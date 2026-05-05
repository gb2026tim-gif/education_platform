import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

async function getJurorId(locals: App.Locals): Promise<string | null> {
  if (locals.juryJurorId) return locals.juryJurorId;
  if (locals.user?.role === "JURY") {
    const juror = await prisma.juror.findUnique({ where: { email: locals.user.email } });
    return juror?.id ?? null;
  }
  return null;
}

export const load: PageServerLoad = async ({ locals }) => {
  const jurorId = await getJurorId(locals);
  if (!jurorId) throw redirect(302, "/jury/login");

  const [juror, assignments] = await Promise.all([
    prisma.juror.findUnique({
      where: { id: jurorId },
      select: { id:true, name:true, email:true, avatarUrl:true, passwordChanged:true },
    }),
    prisma.assignment.findMany({
      where: { jurorId, evaluated: true },
      include: { evaluation: true, work: { include: { tournament: true } } },
      orderBy: { evaluatedAt: "desc" },
    }),
  ]);

  if (!juror) throw redirect(302, "/jury/login");

  const total = await prisma.assignment.count({ where: { jurorId } });
  const evaluated = await prisma.assignment.count({ where: { jurorId, evaluated: true } });

  return {
    juror,
    stats: { total, evaluated, pending: total - evaluated },
    evaluatedWorks: assignments.map((a) => {
      const avg = a.evaluation
        ? Number(((a.evaluation.backendCode + a.evaluation.databaseStructure +
            a.evaluation.frontendCode + a.evaluation.backendFunctionality +
            a.evaluation.databaseFunctionality + a.evaluation.frontendFunctionality) / 6).toFixed(2))
        : null;
      return {
        id: a.id,
        workId: a.workId,
        teamLabel: `Команда ${a.displayNumber}`,
        tournamentName: a.work.tournament.title,
        evaluatedAt: a.evaluatedAt?.toISOString() ?? null,
        average: avg,
        comment: a.evaluation?.comment ?? null,
        scores: a.evaluation ? {
          backendCode: a.evaluation.backendCode,
          databaseStructure: a.evaluation.databaseStructure,
          frontendCode: a.evaluation.frontendCode,
          backendFunctionality: a.evaluation.backendFunctionality,
          databaseFunctionality: a.evaluation.databaseFunctionality,
          frontendFunctionality: a.evaluation.frontendFunctionality,
        } : null,
      };
    }),
  };
};
