// src/routes/admin/tournaments/[id]/+page.server.ts
import { prisma } from "$lib/server/db";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { TournamentStatus, TaskStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user || locals.user.role !== "ADMIN") throw redirect(302, "/");

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: {
      tasks: { orderBy: { createdAt: "asc" } },
      _count: { select: { teams: true, tasks: true } },
    },
  });

  if (!tournament) throw error(404, "Турнір не знайдено");

  const teams = await prisma.team.findMany({
    where: { tournamentId: params.id },
    include: {
      captain: { select: { id: true, name: true, email: true } },
      members: true,
      _count: { select: { members: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Counts for header
  const verifiedTeams = teams.filter(
    (t: { verified: boolean }) => t.verified,
  ).length;

  return { tournament, teams, verifiedTeams };
};

function parseDate(v: FormDataEntryValue | null): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export const actions: Actions = {
  // ── Status transitions ─────────────────────────────────
  setStatus: async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const status = String(fd.get("status") ?? "") as TournamentStatus;
    const allowed: TournamentStatus[] = [
      "DRAFT",
      "PUBLISHED",
      "REGISTRATION",
      "RUNNING",
      "EVALUATION",
      "FINISHED",
    ];
    if (!allowed.includes(status))
      return fail(400, { error: "Невірний статус" });

    await prisma.tournament.update({
      where: { id: params.id },
      data: { status },
    });
    return { success: true };
  },

  // ── Team verification toggle ───────────────────────────
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

  // ── Verify all pending teams ───────────────────────────
  verifyAll: async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    await prisma.team.updateMany({
      where: { tournamentId: params.id, verified: false },
      data: { verified: true, status: "APPROVED" },
    });
    return { success: true };
  },

  // ── Add task (round) ───────────────────────────────────
  addTask: async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const title = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("description") ?? "").trim();
    const techStack = String(fd.get("techStack") ?? "").trim() || null;
    const startAt = parseDate(fd.get("startAt"));
    const deadline = parseDate(fd.get("deadline"));
    const requirementsRaw = String(fd.get("requirements") ?? "");
    const requirements = requirementsRaw
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 0);

    if (!title) return fail(400, { error: "Введіть назву завдання" });
    if (!description) return fail(400, { error: "Введіть опис завдання" });
    if (!startAt || !deadline)
      return fail(400, { error: "Вкажіть дати старту та дедлайну" });

    const status: TaskStatus = "ACTIVE";

    await prisma.task.create({
      data: {
        title,
        description,
        requirements,
        techStack,
        startAt,
        deadline,
        status,
        tournamentId: params.id,
      },
    });

    // Sync tournament.taskDeadline with latest deadline
    await prisma.tournament.update({
      where: { id: params.id },
      data: { taskDeadline: deadline },
    });

    return { success: true };
  },

  // ── Delete task ────────────────────────────────────────
  deleteTask: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    const fd = await request.formData();
    const taskId = String(fd.get("taskId") ?? "");
    if (!taskId) return fail(400);
    await prisma.task.delete({ where: { id: taskId } }).catch(() => null);
    return { success: true };
  },

  // ── Close registration: REGISTRATION → RUNNING ─────────
  closeRegistration: async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    await prisma.tournament.update({
      where: { id: params.id },
      data: { status: "RUNNING" },
    });
    return { success: true };
  },
};
