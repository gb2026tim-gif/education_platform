import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";

function toNumber(value: FormDataEntryValue | null) {
  return Math.min(100, Math.max(0, Number(value ?? 50)));
}

export const load: PageServerLoad = async ({ locals, params }) => {
  if (!locals.juryJurorId) throw redirect(302, "/jury/login");

  const assignment = await prisma.assignment.findFirst({
    where: { jurorId: locals.juryJurorId, workId: params.workId },
    include: { evaluation: true, work: { include: { tournament: true } } }
  });

  if (!assignment) throw redirect(302, "/jury/works");

  const list = await prisma.assignment.findMany({
    where: { jurorId: locals.juryJurorId },
    orderBy: { displayNumber: "asc" },
    select: { workId: true, displayNumber: true, work: { select: { tournament: { select: { title: true } } } } }
  });

  const index = list.findIndex((item) => item.workId === params.workId);
  const prev = index > 0 ? list[index - 1] : null;
  const next = index >= 0 && index < list.length - 1 ? list[index + 1] : null;

  return { assignment, prev, next };
};

export const actions: Actions = {
  saveDraft: async ({ request, locals, params }) => {
    if (!locals.juryJurorId) throw redirect(302, "/jury/login");
    const form = await request.formData();
    const assignment = await prisma.assignment.findFirst({
      where: { jurorId: locals.juryJurorId, workId: params.workId }
    });
    if (!assignment) return fail(404, { error: "Роботу не знайдено" });

    const payload = {
      backendCode: toNumber(form.get("backendCode")),
      databaseStructure: toNumber(form.get("databaseStructure")),
      frontendCode: toNumber(form.get("frontendCode")),
      backendFunctionality: toNumber(form.get("backendFunctionality")),
      databaseFunctionality: toNumber(form.get("databaseFunctionality")),
      frontendFunctionality: toNumber(form.get("frontendFunctionality")),
      comment: String(form.get("comment") ?? ""),
      requirementsRest: form.get("requirementsRest") === "on",
      requirementsDb: form.get("requirementsDb") === "on",
      requirementsAuth: form.get("requirementsAuth") === "on",
      requirementsFrontend: form.get("requirementsFrontend") === "on",
      requirementsDeploy: form.get("requirementsDeploy") === "on"
    };

    await prisma.evaluation.upsert({
      where: { assignmentId: assignment.id },
      update: payload,
      create: { assignmentId: assignment.id, ...payload }
    });

    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { isDraft: true }
    });

    return { success: true };
  },
  submitFinal: async ({ request, locals, params }) => {
    if (!locals.juryJurorId) throw redirect(302, "/jury/login");
    const form = await request.formData();
    const assignment = await prisma.assignment.findFirst({
      where: { jurorId: locals.juryJurorId, workId: params.workId }
    });
    if (!assignment) return fail(404, { error: "Роботу не знайдено" });

    const payload = {
      backendCode: toNumber(form.get("backendCode")),
      databaseStructure: toNumber(form.get("databaseStructure")),
      frontendCode: toNumber(form.get("frontendCode")),
      backendFunctionality: toNumber(form.get("backendFunctionality")),
      databaseFunctionality: toNumber(form.get("databaseFunctionality")),
      frontendFunctionality: toNumber(form.get("frontendFunctionality")),
      comment: String(form.get("comment") ?? ""),
      requirementsRest: form.get("requirementsRest") === "on",
      requirementsDb: form.get("requirementsDb") === "on",
      requirementsAuth: form.get("requirementsAuth") === "on",
      requirementsFrontend: form.get("requirementsFrontend") === "on",
      requirementsDeploy: form.get("requirementsDeploy") === "on"
    };

    await prisma.evaluation.upsert({
      where: { assignmentId: assignment.id },
      update: payload,
      create: { assignmentId: assignment.id, ...payload }
    });

    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { evaluated: true, isDraft: false, evaluatedAt: new Date() }
    });

    throw redirect(302, "/jury/works");
  }
};
