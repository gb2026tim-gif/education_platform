// src/routes/tourments/[id]/task/+page.server.ts
import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const user = requireAuth(event);
  const tournamentId = event.params.id;

  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    select: { id: true, title: true, status: true },
  });
  if (!tournament) throw error(404, "Турнір не знайдено");

  const task = await prisma.task.findFirst({
    where: { tournamentId, status: { not: "DRAFT" } },
    orderBy: { createdAt: "asc" },
  });
  if (!task) throw error(404, "Завдання ще не опубліковано");

  const team = await prisma.team.findFirst({
    where: {
      tournamentId,
      OR: [
        { captainId: user.id },
        { members: { some: { email: user.email } } },
      ],
    },
    select: { id: true, name: true },
  });

  return { tournament, task, team, user };
};
