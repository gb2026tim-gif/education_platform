import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.juryJurorId) throw redirect(302, "/jury/login");

  const assignments = await prisma.assignment.findMany({
    where: { jurorId: locals.juryJurorId },
    include: { evaluation: true, work: { include: { tournament: true } } },
    orderBy: { displayNumber: "asc" }
  });

  const tournamentsMap = new Map<string, string>();
  for (const item of assignments) tournamentsMap.set(item.work.tournamentId, item.work.tournament.title);

  const total = assignments.length;
  const evaluated = assignments.filter((a) => a.evaluated).length;

  return {
    stats: { total, evaluated, pending: total - evaluated },
    tournaments: Array.from(tournamentsMap.entries()).map(([id, name]) => ({ id, name })),
    works: assignments.map((a) => ({
      workId: a.workId,
      teamLabel: `Команда ${a.displayNumber}`,
      tournamentId: a.work.tournamentId,
      tournamentName: a.work.tournament.title,
      evaluated: a.evaluated,
      evaluatedAt: a.evaluatedAt?.toISOString() ?? null,
      githubUrl: a.work.githubUrl,
      videoUrl: a.work.videoUrl,
      average: a.evaluation
        ? Number(
            (
              (a.evaluation.backendCode +
                a.evaluation.databaseStructure +
                a.evaluation.frontendCode +
                a.evaluation.backendFunctionality +
                a.evaluation.databaseFunctionality +
                a.evaluation.frontendFunctionality) /
              6
            ).toFixed(2)
          )
        : null
    }))
  };
};
