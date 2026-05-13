// src/routes/calendar/+page.server.ts
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  const tournaments = await prisma.tournament.findMany({
    select: {
      id: true,
      title: true,
      status: true,
      regStart: true,
      regEnd: true,
      maxTeams: true,
      _count: { select: { teams: true } },
    },
    orderBy: { regStart: "asc" },
  });

  const tasks = await prisma.task.findMany({
    where: { status: { not: "DRAFT" } },
    select: {
      id: true,
      title: true,
      startAt: true,
      deadline: true,
      tournament: { select: { id: true, title: true, status: true } },
    },
  });

  let userTeams: any[] = [];
  let userEnrollments: any[] = [];

  if (locals.user) {
    const dbUser = await prisma.user.findUnique({
      where: { id: locals.user.id },
    });
    if (dbUser) {
      userTeams = await prisma.team.findMany({
        where: {
          OR: [
            { captainId: dbUser.id },
            { members: { some: { email: dbUser.email } } },
          ],
        },
        include: {
          tournament: {
            select: { id: true, title: true, regEnd: true, status: true },
          },
          submissions: {
            include: { task: { select: { deadline: true, title: true } } },
          },
        },
      });

      userEnrollments = await prisma.enrollment.findMany({
        where: { userId: dbUser.id },
        include: { course: { select: { id: true, title: true } } },
        orderBy: { enrolledAt: "desc" },
        take: 5,
      });
    }
  }

  type EventType =
    | "registration"
    | "reg-end"
    | "task-start"
    | "deadline"
    | "my-deadline"
    | "course";

  const events: {
    id: string;
    title: string;
    date: string;
    type: EventType;
    color: string;
    tournamentId?: string;
    description?: string;
    isPersonal?: boolean;
    teamsCount?: number;
    maxTeams?: number;
  }[] = [];

  for (const t of tournaments) {
    if (t.regStart)
      events.push({
        id: `rs-${t.id}`,
        title: `Старт реєстрації`,
        date: t.regStart.toISOString().split("T")[0],
        type: "registration",
        color: "#3E83FF",
        tournamentId: t.id,
        description: t.title,
        teamsCount: t._count.teams,
        maxTeams: t.maxTeams ?? undefined,
      });
    if (t.regEnd)
      events.push({
        id: `re-${t.id}`,
        title: `Закриття реєстрації`,
        date: t.regEnd.toISOString().split("T")[0],
        type: "reg-end",
        color: "#FB923C",
        tournamentId: t.id,
        description: t.title,
      });
  }

  for (const task of tasks) {
    if (task.startAt)
      events.push({
        id: `ts-${task.id}`,
        title: `Турнір стартує`,
        date: task.startAt.toISOString().split("T")[0],
        type: "task-start",
        color: "#4ADE80",
        tournamentId: task.tournament.id,
        description: task.tournament.title,
      });
    events.push({
      id: `td-${task.id}`,
      title: `Здача проєктів`,
      date: task.deadline.toISOString().split("T")[0],
      type: "deadline",
      color: "#f85149",
      tournamentId: task.tournament.id,
      description: task.tournament.title,
    });
  }

  for (const team of userTeams) {
    for (const sub of team.submissions) {
      if (sub.task?.deadline)
        events.push({
          id: `md-${sub.id}`,
          title: `Мій дедлайн`,
          date: new Date(sub.task.deadline).toISOString().split("T")[0],
          type: "my-deadline",
          color: "#A855F7",
          tournamentId: team.tournament.id,
          description: `${team.name} · ${team.tournament.title}`,
          isPersonal: true,
        });
    }
  }

  // Quick stats
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const thisMonth = events.filter((e) => {
    const d = new Date(e.date);
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  });

  return {
    user: locals.user,
    events,
    tournaments,
    userTeams,
    userEnrollments,
    stats: {
      total: events.length,
      future: events.filter((e) => new Date(e.date) >= now).length,
      thisMonth: thisMonth.length,
      myTeams: userTeams.length,
    },
  };
};
