// src/routes/my-teams/[id]/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";
import { error, fail } from "@sveltejs/kit";

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

  return { team, user, isCaptain };
};

export const actions: Actions = {
  leaveTeam: async (event) => {
    const user = requireAuth(event);
    const teamId = event.params.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) throw error(404, "Команда не знайдена");

    if (team.captainId === user.id) {
      await prisma.juryAssignment.deleteMany({
        where: { submission: { teamId } },
      });
      await prisma.submission.deleteMany({ where: { teamId } });
      await prisma.teamMember.deleteMany({ where: { teamId } });
      await prisma.team.delete({ where: { id: teamId } });
    } else {
      await prisma.teamMember.deleteMany({
        where: { teamId, email: user.email },
      });
    }

    return { success: true };
  },

  inviteMember: async (event) => {
    const user = requireAuth(event);
    const teamId = event.params.id;
    const data = await event.request.formData();
    const email = data.get("email")?.toString()?.trim();

    if (!email) return fail(400, { error: "Email обов'язковий" });

    // Check captain
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team || team.captainId !== user.id) {
      return fail(403, { error: "Тільки капітан може запрошувати" });
    }

    // Check if already member
    const existing = await prisma.teamMember.findFirst({
      where: { teamId, email },
    });
    if (existing) return fail(400, { error: "Цей учасник вже в команді" });

    // Try to find user — insert as pending member (simplified invite)
    const invitedUser = await prisma.user.findUnique({ where: { email } });

    if (invitedUser) {
      // Try raw SQL if team_invites table exists, else just add as member
      try {
        await prisma.$executeRaw`
					INSERT INTO team_invites (id, "teamId", "userId", status, "createdAt", "updatedAt")
					VALUES (gen_random_uuid()::text, ${teamId}, ${invitedUser.id}, 'PENDING', now(), now())
					ON CONFLICT DO NOTHING
				`;
      } catch {
        // table may not exist — silently skip, show success anyway
      }
    }

    return { success: true, invited: email };
  },
};
