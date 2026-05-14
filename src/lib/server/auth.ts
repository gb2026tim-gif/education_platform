import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  // Дозволяємо запити з dev-сервера Vite
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://127.0.0.1:5173",
    process.env.BETTER_AUTH_URL ?? "",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 днів
    updateAge: 60 * 60 * 24, // оновлювати щодня
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 30,
    },
  },
});
