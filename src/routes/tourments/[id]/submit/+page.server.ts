// src/routes/tourments/[id]/submit/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { error, fail, redirect } from "@sveltejs/kit";
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
        select: { id: true, title: true, deadline: true },
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
        select: { id: true, name: true, captainId: true },
    });

    if (!team) throw redirect(302, `/tourments/${tournamentId}`);

    const submission = await prisma.submission.findFirst({
        where: { taskId: task.id, teamId: team.id },
    });

    return {
        tournament,
        task,
        team,
        submission,
        isCaptain: team.captainId === user.id,
        user,
    };
};

export const actions: Actions = {
    save: async (event) => {
        const user = event.locals.user;
        if (!user) throw redirect(302, "/auth/login");

        const tournamentId = event.params.id;
        const fd = await event.request.formData();

        const taskId = fd.get("taskId")?.toString();
        const teamId = fd.get("teamId")?.toString();
        const githubUrl = fd.get("githubUrl")?.toString().trim() ?? "";
        const videoUrl = fd.get("videoUrl")?.toString().trim() ?? "";
        const demoUrl = fd.get("demoUrl")?.toString().trim() ?? "";
        const description = fd.get("description")?.toString().trim() ?? "";

        if (!taskId || !teamId) return fail(400, { error: "Невірні дані форми" });
        if (!githubUrl) return fail(400, { error: "GitHub URL є обов'язковим" });

        // Перевірка що task належить до цього турніру
        const task = await prisma.task.findFirst({
            where: { id: taskId, tournamentId },
        });
        if (!task) return fail(400, { error: "Завдання не знайдено" });

        if (new Date(task.deadline) < new Date()) {
            return fail(400, { error: "Дедлайн минув — подача результатів закрита" });
        }

        await prisma.submission.upsert({
            where: { taskId_teamId: { taskId, teamId } },
            create: {
                githubUrl,
                videoUrl,
                demoUrl: demoUrl || null,
                description: description || null,
                taskId,
                teamId,
            },
            update: {
                githubUrl,
                videoUrl,
                demoUrl: demoUrl || null,
                description: description || null,
            },
        });

        return { success: true };
    },
};