import { prisma } from "$lib/server/db";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { TournamentStatus, TaskStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ params, locals }) => {
  // Перевірка прав (якщо сесія запрацює)
  if (!locals.user || locals.user.role !== "ADMIN") throw redirect(302, "/");

  // Завантажуємо турнір разом із завданнями (tasks)
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      tasks: { orderBy: { createdAt: "asc" } },
      _count: { select: { teams: true, tasks: true } },
    },
  });

  if (!tournament) throw error(404, "Турнір не знайдено");

  // ЦЕЙ БЛОК: Завантаження списку команд та капітанів
  const teams = await prisma.team.findMany({
    where: { tournamentId: params.id },
    include: {
      captain: { select: { id: true, name: true, email: true } },
      members: true,
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Лічильник підтверджених команд для хедера
  const verifiedTeams = teams.filter((t) => t.verified).length;

  return { tournament, teams, verifiedTeams };
};

// Допоміжна функція для дат
function parseDate(v: FormDataEntryValue | null): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export const actions: Actions = {
  // Зміна статусу турніру
  setStatus: async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const status = String(fd.get("status") ?? "") as TournamentStatus;

    await prisma.tournament.update({
      where: { id: params.id },
      data: { status },
    });
    return { success: true };
  },

  // ПІДТВЕРДЖЕННЯ КОМАНДИ (Кнопка "Галочка")
  toggleVerify: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const teamId = String(fd.get("teamId") ?? "");
    const currentlyVerified = fd.get("verified") === "true";

    await prisma.team.update({
      where: { id: teamId },
      data: {
        verified: !currentlyVerified,
        status: !currentlyVerified ? "APPROVED" : "PENDING",
      },
    });
    return { success: true };
  },

  // ПІДТВЕРДИТИ ВСІХ
  verifyAll: async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    await prisma.team.updateMany({
      where: { tournamentId: params.id, verified: false },
      data: { verified: true, status: "APPROVED" },
    });
    return { success: true };
  },

  // Додавання завдання (раунду)
  addTask: async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const title = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    const startAt = parseDate(fd.get("startAt"));
    const deadline = parseDate(fd.get("deadline"));

    if (!title || !description || !startAt || !deadline) {
      return fail(400, { error: "Заповніть усі поля" });
    }

    await prisma.task.create({
      data: {
        title,
        description,
        startAt,
        deadline,
        status: "ACTIVE",
        tournamentId: params.id,
      },
    });

    return { success: true };
  },

  // Видалення завдання
  deleteTask: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const taskId = String(fd.get("taskId") ?? "");
    await prisma.task.delete({ where: { id: taskId } }).catch(() => null);
    return { success: true };
  },
};
