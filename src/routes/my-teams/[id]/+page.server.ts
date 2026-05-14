import type { PageServerLoad, Actions } from "./$types";
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


export const actions: Actions = {
  inviteMember: async (event) => {
    const user = event.locals.user;
    if (!user) return { success: false, error: "Не авторизовано" };

    const formData = await event.request.formData();
    const email = formData.get("email")?.toString().trim();
    const teamId = event.params.id;

    if (!email) return { success: false, error: "Email не вказано" };

    // Перевіряємо чи капітан
    const team = await prisma.team.findFirst({
      where: { id: teamId, captainId: user.id }
    });
    if (!team) return { success: false, error: "Тільки капітан може запрошувати" };

    // Знаходимо юзера за email
    const invitee = await prisma.user.findUnique({ where: { email } });
    if (!invitee) return { success: false, error: "Користувача не знайдено" };

    // Перевіряємо чи вже є в команді
    const alreadyMember = await prisma.teamMember.findFirst({
      where: { email, teamId }
    });
    if (alreadyMember) return { success: false, error: "Вже в команді" };

    // Створюємо запрошення
    await prisma.teamInvite.upsert({
      where: { teamId_userId: { teamId, userId: invitee.id } },
      create: { teamId, userId: invitee.id, status: "PENDING" },
      update: { status: "PENDING" }
    });

    return { success: true };
  }
};
