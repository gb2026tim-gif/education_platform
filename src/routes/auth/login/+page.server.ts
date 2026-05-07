import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import { auth } from "$lib/server/auth";
import { setJurySessionCookie } from "$lib/server/jury-auth";
import bcrypt from "bcryptjs";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.juryJurorId) throw redirect(302, "/jury/account");
  if (locals.user?.role === "JURY") throw redirect(302, "/jury/account");
  if (locals.user?.role === "ADMIN") throw redirect(302, "/admin");
  if (locals.user) throw redirect(302, "/my-teams");
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const fd = await request.formData();
    const email = fd.get("email")?.toString().trim().toLowerCase() ?? "";
    const password = fd.get("password")?.toString() ?? "";

    if (!email || !password) return fail(400, { error: "Заповніть всі поля" });

    // 1. jurors таблиця — bcrypt пароль (5 журі з seed-jury.ts)
    const juror = await prisma.juror.findUnique({ where: { email } });
    if (juror) {
      if (!juror.passwordHash)
        return fail(401, { error: "Невірний email або пароль" });
      const valid = await bcrypt.compare(password, juror.passwordHash);
      if (!valid) return fail(401, { error: "Невірний email або пароль" });
      setJurySessionCookie(cookies, juror.id);
      throw redirect(302, "/jury/account");
    }

    // 2. users таблиця — Better Auth (katya, sergii тощо)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail(401, { error: "Невірний email або пароль" });

    // Використовуємо Better Auth API для перевірки пароля
    try {
      const res = await auth.api.signInEmail({
        body: { email, password },
        asResponse: false,
      });
      if (!res?.user) return fail(401, { error: "Невірний email або пароль" });

      if (user.role === "JURY") {
        let j = await prisma.juror.findUnique({ where: { email } });
        if (!j) {
          j = await prisma.juror.create({
            data: { name: user.name, email, passwordChanged: true },
          });
        }
        setJurySessionCookie(cookies, j.id);
        throw redirect(302, "/jury/account");
      }
      if (user.role === "ADMIN") throw redirect(302, "/admin");
      throw redirect(302, "/my-teams");
    } catch (e: unknown) {
      if (e && typeof e === "object" && "status" in e) throw e;
      return fail(401, { error: "Невірний email або пароль" });
    }
  },
};
