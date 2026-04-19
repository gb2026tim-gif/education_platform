import type { PageServerLoad } from "./$types";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const user = requireAuth(event);

  const team = await prisma.team.findUnique({
    where: { id: event.params.id },
    include: {
      captain: { select: { id: true, name: true, email: true } },
      members: true,
      tournament: true,
      submissions: {
        include: {
          task: { select: { title: true, deadline: true } },
          assignments: {
            include: { score: true },
          },
        },
      },
    },
  });

  if (!team) throw error(404, "Команду не знайдено");
  if (team.captainId !== user.id) throw error(403, "Доступ заборонено");

  return { team, user };
};
