import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.juryJurorId) throw redirect(302, "/jury/login");

  const [juror, assignments] = await Promise.all([
    prisma.juror.findUnique({
      where: { id: locals.juryJurorId },
      select: { id: true, name: true, email: true, avatarUrl: true, passwordChanged: true }
    }),
    prisma.assignment.findMany({
      where: { jurorId: locals.juryJurorId, evaluated: true },
      include: { evaluation: true, work: { include: { tournament: true } } },
      orderBy: { evaluatedAt: "desc" }
    })
  ]);

  if (!juror) throw redirect(302, "/jury/login");

  const total = await prisma.assignment.count({ where: { jurorId: juror.id } });
  const evaluated = await prisma.assignment.count({ where: { jurorId: juror.id, evaluated: true } });

  return {
    juror,
    stats: { total, evaluated, pending: total - evaluated },
    evaluatedWorks: assignments.map((a) => ({
      id: a.id,
      teamLabel: `Команда ${a.displayNumber}`,
      tournamentName: a.work.tournament.title,
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
