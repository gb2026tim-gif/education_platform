// src/routes/tourments/[id]/+page.server.ts
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getTournamentById } from "$lib/server/tournament";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const user = event.locals.user ?? null;
  const tournamentId = event.params.id;

  const tournament = await getTournamentById(tournamentId);
  if (!tournament) throw error(404, "Турнір не знайдено");

  // Знаходимо команду поточного юзера в цьому турнірі
  const userTeam = user
    ? await prisma.team.findFirst({
        where: {
          tournamentId,
          OR: [
            { captainId: user.id },
            { members: { some: { email: user.email } } },
          ],
        },
        select: { id: true, name: true },
      })
    : null;

  // Перша активна задача
  const task = await prisma.task.findFirst({
    where: { tournamentId, status: { not: "DRAFT" } },
    orderBy: { createdAt: "asc" },
    select: { id: true, title: true, deadline: true },
  });

  return { tournament, user, userTeam, task };
};
