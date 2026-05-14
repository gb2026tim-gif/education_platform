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
  if (locals.user) throw redirect(302, "/profile");
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const fd = await request.formData();
    const email = fd.get("email")?.toString().trim().toLowerCase() ?? "";
    const password = fd.get("password")?.toString() ?? "";
    if (!email || !password) return fail(400, { error: "Заповніть всі поля" });

    // 1. Журі — bcrypt
    const juror = await prisma.juror.findUnique({ where: { email } });
    if (juror) {
      if (!juror.passwordHash)
        return fail(401, { error: "Невірний email або пароль" });
      const valid = await bcrypt.compare(password, juror.passwordHash);
      if (!valid) return fail(401, { error: "Невірний email або пароль" });
      setJurySessionCookie(cookies, juror.id);
      throw redirect(302, "/jury/account");
    }

    // 2. Better Auth
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail(401, { error: "Невірний email або пароль" });

    const res = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    if (!res.ok) return fail(401, { error: "Невірний email або пароль" });

    // Передаємо всі cookies від Better Auth в браузер
    const cookieNames = [
      "better-auth.session_token",
      "better-auth.session_data",
    ];
    const raw = res.headers.get("set-cookie") ?? "";
    for (const name of cookieNames) {
      const escaped = name.replace(/\./g, "\\.");
      const match = raw.match(new RegExp(escaped + "=([^;]+)"));
      if (match) {
        cookies.set(name, decodeURIComponent(match[1]), {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
        });
      }
    }

    if (user.role === "JURY") throw redirect(302, "/jury/account");
    if (user.role === "ADMIN") throw redirect(302, "/admin");
    throw redirect(302, "/profile");
  },
};
