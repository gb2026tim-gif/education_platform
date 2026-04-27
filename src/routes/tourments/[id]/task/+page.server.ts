// src/routes/tourments/[id]/task/+page.server.ts
import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
    const user = requireAuth(event);
    const tournamentId = event.params.id;

    // Завантажуємо турнір разом із завданням
    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
            tasks: {
                where: { status: { not: "DRAFT" } },
                orderBy: { createdAt: "asc" },
                take: 1,
            },
        },
    });

    if (!tournament) throw error(404, "Турнір не знайдено");

    const task = tournament.tasks[0] ?? null;
    if (!task) throw error(404, "Завдання ще не опубліковано");

    // Перевіряємо чи користувач має команду в цьому турнірі
    const team = await prisma.team.findFirst({
        where: {
            tournamentId,
            OR: [
                { captainId: user.id },
                { members: { some: { email: user.email } } },
            ],
        },
        select: { id: true },
    });

    // Знаходимо сабміт команди для цього завдання
    const submission = team
        ? await prisma.submission.findFirst({
            where: { taskId: task.id, teamId: team.id },
            select: {
                id: true,
                githubUrl: true,
                videoUrl: true,
                demoUrl: true,
                description: true,
            },
        })
        : null;

    return {
        tournament: {
            id: tournament.id,
            title: tournament.title,
            status: tournament.status,
        },
        task,
        team,
        submission,
        user,
    };
};