// src/lib/server/invite.ts
// Бізнес-логіка запрошення нових адмінів та журі
// @ts-nocheck
import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "./db";
import { sendInviteEmail } from "./email";
import type { Role } from "@prisma/client";

// Генеруємо читабельний OTP: 4 групи по 3 символи (A3F-B2D-1C9-E5A)
function generateOtp(): string {
  return crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase()
    .match(/.{1,3}/g)!
    .join("-");
}

export async function inviteUser(opts: {
  email: string;
  name: string;
  role: Role;
}) {
  // Перевіряємо чи email вже зайнятий
  const existing = await prisma.user.findUnique({
    where: { email: opts.email },
  });
  if (existing) {
    throw new Error(`Користувач з email ${opts.email} вже існує`);
  }

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp.replace(/-/g, ""), 12); // хешуємо без дефісів

  // Транзакція: створюємо user + account атомарно
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: opts.email,
        name: opts.name,
        role: opts.role,
        password: hashedOtp,
        emailVerified: true, // адмін підтвердив особисто
        mustChangePassword: true, // примусова зміна після першого входу
      },
    });

    // Акаунт для better-auth (credential login)
    await tx.account.create({
      data: {
        accountId: newUser.id,
        providerId: "credential",
        userId: newUser.id,
        password: hashedOtp,
      },
    });

    // Зберігаємо запис про запрошення (для аудиту)
    await tx.invitation.create({
      data: {
        email: opts.email,
        name: opts.name,
        role: opts.role,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 годин
      },
    });

    return newUser;
  });

  // Відправляємо email (поза транзакцією — якщо впаде, user вже є, можна перезапустити)
  await sendInviteEmail({
    to: opts.email,
    name: opts.name,
    role: opts.role as "ADMIN" | "JURY",
    otp,
  });

  return { userId: user.id, email: user.email };
}

// Примусова зміна пароля (викликається з API ендпоінту)
export async function changePasswordForced(opts: {
  userId: string;
  newPassword: string;
}) {
  if (opts.newPassword.length < 8) {
    throw new Error("Пароль має містити мінімум 8 символів");
  }

  const hashed = await bcrypt.hash(opts.newPassword, 12);

  await prisma.$transaction([
    // Оновлюємо пароль у таблиці users
    prisma.user.update({
      where: { id: opts.userId },
      data: {
        password: hashed,
        mustChangePassword: false,
      },
    }),
    // Оновлюємо пароль у accounts (better-auth credential)
    prisma.account.updateMany({
      where: { userId: opts.userId, providerId: "credential" },
      data: { password: hashed },
    }),
  ]);
}
