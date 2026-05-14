// src/routes/jury/api/change-password/+server.ts
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import bcrypt from "bcryptjs";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.juryJurorId) {
    return json({ error: "Не авторизовано" }, { status: 401 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Невірний формат запиту" }, { status: 400 });
  }

  const { password } = body;
  if (!password || password.length < 8) {
    return json(
      { error: "Пароль занадто короткий (мінімум 8 символів)" },
      { status: 400 },
    );
  }
  if (!/[A-Z]/.test(password)) {
    return json(
      { error: "Потрібна хоча б одна велика літера" },
      { status: 400 },
    );
  }
  if (!/[0-9]/.test(password)) {
    return json({ error: "Потрібна хоча б одна цифра" }, { status: 400 });
  }
  if (!/[@#$!%^&*()_+\-=[\]{}|;':",.<>?]/.test(password)) {
    return json(
      { error: "Потрібен спеціальний символ (@, #, $, ...)" },
      { status: 400 },
    );
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.juror.update({
    where: { id: locals.juryJurorId },
    data: { passwordHash: hash, passwordChanged: true },
  });

  return json({ ok: true });
};
