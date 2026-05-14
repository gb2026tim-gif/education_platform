// src/routes/courses/+page.server.ts
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/auth/login");

  const user = locals.user;

  // Find all teams where user is captain or member
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { captainId: user.id },
        { members: { some: { email: user.email } } },
      ],
    },
    include: {
      tournament: {
        include: {
          tasks: {
            where: { status: { not: "DRAFT" } },
            orderBy: { createdAt: "asc" },
            take: 1,
            select: { id: true, title: true, deadline: true },
          },
          _count: { select: { teams: true } },
        },
      },
      submissions: {
        include: {
          task: { select: { id: true, title: true } },
        },
      },
      captain: { select: { id: true, name: true } },
      members: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { user, teams };
};
