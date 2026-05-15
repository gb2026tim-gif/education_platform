import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import { setJurySessionCookie } from "$lib/server/jury-auth";
import { auth } from "$lib/server/auth";
import bcrypt from "bcryptjs";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.juryJurorId) throw redirect(302, "/jury/account");
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const fd = await request.formData();
    const email = fd.get("email")?.toString().trim().toLowerCase() ?? "";
    const password = fd.get("password")?.toString() ?? "";

    if (!email || !password)
      return fail(400, { error: "Введіть email та пароль" });

    // Варіант 1: jurors таблиця (bcrypt)
    const juror = await prisma.juror.findUnique({ where: { email } });
    if (juror?.passwordHash) {
      const valid = await bcrypt.compare(password, juror.passwordHash);
      if (valid) {
        setJurySessionCookie(cookies, juror.id);
        throw redirect(302, "/jury/account");
      }
    }

    // Варіант 2: Better Auth users з роллю JURY
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== "JURY")
      return fail(401, { error: "Невірний email або пароль" });

    // Перевіряємо через Better Auth signIn API
    try {
      const res = await auth.api.signInEmail({
        body: { email, password },
      });

      if (!res?.user) return fail(401, { error: "Невірний email або пароль" });

      // Знаходимо або створюємо juror запис
      let jurorRecord = await prisma.juror.findUnique({ where: { email } });
      if (!jurorRecord) {
        jurorRecord = await prisma.juror.create({
          data: {
            name: user.name,
            email: user.email,
            passwordChanged: true,
          },
        });
      }
      if (!jurorRecord)
        return fail(500, { error: "Не вдалося створити запис журі" });

      setJurySessionCookie(cookies, jurorRecord.id);
      throw redirect(302, "/jury/account");
    } catch (e: unknown) {
      if (e && typeof e === "object" && "location" in e) throw e;
      return fail(401, { error: "Невірний email або пароль" });
    }
  },
};
