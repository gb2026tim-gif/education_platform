// src/routes/jury/account/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect, fail } from "@sveltejs/kit";
import bcrypt from "bcryptjs";

async function getJurorId(locals: App.Locals): Promise<string | null> {
  if (locals.juryJurorId) return locals.juryJurorId;
  if (locals.user?.role === "JURY") {
    const j = await prisma.juror.findUnique({
      where: { email: locals.user.email },
    });
    return j?.id ?? null;
  }
  return null;
}

export const load: PageServerLoad = async ({ locals }) => {
  const jurorId = await getJurorId(locals);
  if (!jurorId) throw redirect(302, "/jury/login");

  const [juror, allAssignments] = await Promise.all([
    prisma.juror.findUnique({
      where: { id: jurorId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        passwordChanged: true,
      },
    }),
    prisma.assignment.findMany({
      where: { jurorId },
      include: { evaluation: true, work: { include: { tournament: true } } },
    }),
  ]);

  if (!juror) throw redirect(302, "/jury/login");

  const total = allAssignments.length;
  const evaluated = allAssignments.filter((a) => a.evaluated).length;

  const evaluatedWorks = allAssignments
    .filter((a) => a.evaluated)
    .sort(
      (a, b) =>
        (b.evaluatedAt?.getTime() ?? 0) - (a.evaluatedAt?.getTime() ?? 0),
    )
    .map((a) => {
      const e = a.evaluation;
      const avg = e
        ? Number(
            (
              (e.backendCode +
                e.databaseStructure +
                e.frontendCode +
                e.backendFunctionality +
                e.databaseFunctionality +
                e.frontendFunctionality) /
              6
            ).toFixed(2),
          )
        : null;
      return {
        id: a.id,
        workId: a.workId,
        teamLabel: `Команда ${a.displayNumber}`,
        tournamentName: a.work.tournament.title,
        evaluatedAt: a.evaluatedAt?.toISOString() ?? null,
        average: avg,
        comment: e?.comment ?? null,
        scores: e
          ? {
              backendCode: e.backendCode,
              databaseStructure: e.databaseStructure,
              frontendCode: e.frontendCode,
              backendFunctionality: e.backendFunctionality,
              databaseFunctionality: e.databaseFunctionality,
              frontendFunctionality: e.frontendFunctionality,
            }
          : null,
      };
    });

  return {
    juror,
    stats: { total, evaluated, pending: total - evaluated },
    evaluatedWorks,
  };
};

export const actions: Actions = {
  // Оновити ім'я
  updateName: async ({ request, locals }) => {
    const jurorId = await getJurorId(locals);
    if (!jurorId) return fail(401, { error: "Не авторизовано" });

    const fd = await request.formData();
    const name = fd.get("name")?.toString().trim() ?? "";

    if (!name || name.length < 2)
      return fail(400, { nameError: "Введіть ім'я (мінімум 2 символи)" });

    await prisma.juror.update({ where: { id: jurorId }, data: { name } });
    return { nameSuccess: true };
  },

  // Змінити пароль
  changePassword: async ({ request, locals }) => {
    const jurorId = await getJurorId(locals);
    if (!jurorId) return fail(401, { error: "Не авторизовано" });

    const fd = await request.formData();
    const oldPassword = fd.get("oldPassword")?.toString() ?? "";
    const newPassword = fd.get("newPassword")?.toString() ?? "";
    const confirmPwd = fd.get("confirmPassword")?.toString() ?? "";

    if (!newPassword || !confirmPwd)
      return fail(400, { pwdError: "Заповніть всі поля" });

    if (newPassword.length < 8)
      return fail(400, { pwdError: "Новий пароль — мінімум 8 символів" });

    if (newPassword !== confirmPwd)
      return fail(400, { pwdError: "Паролі не співпадають" });

    if (!/[A-Z]/.test(newPassword))
      return fail(400, { pwdError: "Потрібна хоча б одна велика літера" });

    if (!/[0-9]/.test(newPassword))
      return fail(400, { pwdError: "Потрібна хоча б одна цифра" });

    if (!/[@#$!%^&*()_+\-=[\]{}|;':\",./<>?]/.test(newPassword))
      return fail(400, {
        pwdError: "Потрібен спеціальний символ (@, #, $...)",
      });

    const juror = await prisma.juror.findUnique({ where: { id: jurorId } });
    if (!juror?.passwordHash) return fail(400, { pwdError: "Помилка акаунту" });

    // Якщо одноразовий пароль — не перевіряємо старий
    if (juror.passwordChanged) {
      const oldValid = await bcrypt.compare(oldPassword, juror.passwordHash);
      if (!oldValid) return fail(400, { pwdError: "Невірний поточний пароль" });
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.juror.update({
      where: { id: jurorId },
      data: { passwordHash: newHash, passwordChanged: true },
    });

    return { pwdSuccess: true };
  },
};
