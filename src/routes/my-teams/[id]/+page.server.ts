import type { PageServerLoad } from "./$types";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const user = requireAuth(event);
  const teamId = event.params.id;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      tournament: {
        select: { id: true, title: true, status: true, description: true },
      },
      members: true,
      captain: { select: { id: true, name: true, email: true } },
      submissions: {
        include: {
          task: { select: { id: true, title: true, deadline: true } },
        },
      },
    },
  });

  if (!team) throw error(404, "Команда не знайдена");

  const isMember = team.members.some((m) => m.email === user.email);
  const isCaptain = team.captainId === user.id;
  if (!isCaptain && !isMember) throw error(404, "Команда не знайдена");

  // Get active task for this tournament separately
  const tournamentTask = await prisma.task.findFirst({
    where: { tournamentId: team.tournamentId, status: "ACTIVE" },
    select: { id: true, title: true, deadline: true },
  });

  return { team, user, isCaptain, tournamentTask };
};
