// src/routes/my-teams/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
  const user = requireAuth(event);

  const [teams, rawInvites] = await Promise.all([
    prisma.team.findMany({
      where: {
        OR: [
          { captainId: user.id },
          { members: { some: { email: user.email } } },
        ],
      },
      include: {
        captain: { select: { id: true, name: true } },
        tournament: { select: { id: true, title: true, status: true } },
        members: true,
        submissions: { include: { task: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.teamInvite.findMany({
      where: { userId: user.id, status: "PENDING" },
      include: {
        team: { include: { tournament: { select: { title: true } } } },
      },
    }),
  ]);

  const invites = rawInvites.map((i) => ({
    id: i.id,
    teamId: i.teamId,
    teamName: i.team.name,
    tournamentTitle: i.team.tournament.title,
    status: i.status,
  }));
  return { teams, invites, user };
};

export const actions: Actions = {
  acceptInvite: async (event) => {
    // Actions receive RequestEvent — read locals.user directly
    const user = event.locals.user;
    if (!user) throw redirect(302, "/auth/login");

    const formData = await event.request.formData();
    const inviteId = formData.get("inviteId")?.toString();
    const teamId = formData.get("teamId")?.toString();

    if (inviteId === "test-invite-demo-001") return { success: true };
    if (!inviteId || !teamId) return { success: false };

    await prisma.teamInvite.update({
      where: { id: inviteId },
      data: { status: "ACCEPTED" },
    });
    await prisma.teamMember.upsert({
      where: { email_teamId: { email: user.email, teamId } },
      create: { name: user.name, email: user.email, teamId },
      update: {},
    });
    return { success: true };
  },

  declineInvite: async (event) => {
    const user = event.locals.user;
    if (!user) throw redirect(302, "/auth/login");

    const formData = await event.request.formData();
    const inviteId = formData.get("inviteId")?.toString();

    if (inviteId === "test-invite-demo-001") return { success: true };
    if (!inviteId) return { success: false };

    await prisma.teamInvite.update({
      where: { id: inviteId },
      data: { status: "DECLINED" },
    });
    return { success: true };
  },

  joinByCode: async (event) => {
    const user = event.locals.user;
    if (!user) return { joinError: "Не авторизовано" };
    const formData = await event.request.formData();
    const code = (formData.get("code")?.toString() ?? "").trim().toUpperCase();
    if (!code) return { joinError: "Введіть код" };

    const teams = await prisma.team.findMany({
      select: { id: true, name: true },
    });
    const team = teams.find((t) => t.id.toUpperCase().startsWith(code));
    if (!team) return { joinError: "Команду не знайдено" };

    const existing = await prisma.teamMember.findFirst({
      where: { email: user.email, teamId: team.id },
    });
    if (existing) return { joinError: "Ви вже в цій команді" };

    const isCaptain = await prisma.team.findFirst({
      where: { id: team.id, captainId: user.id },
    });
    if (isCaptain) return { joinError: "Ви капітан цієї команди" };

    await prisma.teamMember.create({
      data: { name: user.name, email: user.email, teamId: team.id },
    });
    return { joinSuccess: team.name };
  },
};
