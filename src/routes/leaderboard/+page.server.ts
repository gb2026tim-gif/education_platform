// src/routes/leaderboard/+page.server.ts
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async ({ url, locals }) => {
  const running = await prisma.tournament.findMany({
    where: { status: "RUNNING" },
  });
  const finished = await prisma.tournament.findMany({
    where: { status: "FINISHED" },
  });
  const all = [...running, ...finished];

  const tournamentId =
    url.searchParams.get("tournamentId") ?? all[0]?.id ?? null;

  if (!tournamentId) {
    return {
      leaderboard: [],
      tournaments: all,
      tournamentId: null,
      user: locals.user,
    };
  }

  const teams = await prisma.team.findMany({
    where: { tournamentId },
    select: { id: true, name: true, city: true },
  });

  const works = await prisma.work.findMany({
    where: { tournamentId },
    include: {
      assignments: {
        include: { evaluation: true },
        where: { evaluated: true },
      },
    },
  });

  const leaderboard = teams
    .map((team) => {
      const work = works.find((w) => w.teamName === team.name);
      const evals = (work?.assignments ?? [])
        .map((a) => a.evaluation)
        .filter(Boolean) as NonNullable<
        (typeof works)[0]["assignments"][0]["evaluation"]
      >[];

      const scores = evals.map(
        (e) =>
          (e.backendCode +
            e.databaseStructure +
            e.frontendCode +
            e.backendFunctionality +
            e.databaseFunctionality +
            e.frontendFunctionality) /
          6,
      );

      const average =
        scores.length > 0
          ? Math.round(
              (scores.reduce((a, b) => a + b, 0) / scores.length) * 100,
            ) / 100
          : 0;

      // Average per criteria
      const criteriaScores =
        evals.length > 0
          ? {
              backendCode: Math.round(
                evals.reduce((a, e) => a + e.backendCode, 0) / evals.length,
              ),
              databaseStructure: Math.round(
                evals.reduce((a, e) => a + e.databaseStructure, 0) /
                  evals.length,
              ),
              frontendCode: Math.round(
                evals.reduce((a, e) => a + e.frontendCode, 0) / evals.length,
              ),
              backendFunctionality: Math.round(
                evals.reduce((a, e) => a + e.backendFunctionality, 0) /
                  evals.length,
              ),
              databaseFunctionality: Math.round(
                evals.reduce((a, e) => a + e.databaseFunctionality, 0) /
                  evals.length,
              ),
              frontendFunctionality: Math.round(
                evals.reduce((a, e) => a + e.frontendFunctionality, 0) /
                  evals.length,
              ),
            }
          : null;

      return {
        teamId: team.id,
        teamName: team.name,
        city: team.city,
        average,
        scoresCount: scores.length,
        criteriaScores,
      };
    })
    .sort((a, b) => b.average - a.average);

  return { leaderboard, tournaments: all, tournamentId, user: locals.user };
};
