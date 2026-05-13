// src/routes/learn/[id]/[lessonId]/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: { include: { course: { select: { id: true } } } } },
  });

  if (!lesson || lesson.module.course.id !== params.id) {
    throw redirect(302, `/learn/${params.id}`);
  }

  // Check access: free lesson OR enrolled
  let enrollment = null;
  let isCompleted = false;
  let progress: Record<string, boolean> = {};

  if (locals.user) {
    enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: locals.user.id, courseId: params.id } },
    });

    if (enrollment) {
      const lp = await prisma.lessonProgress.findUnique({
        where: { userId_lessonId: { userId: locals.user.id, lessonId: params.lessonId } },
      });
      isCompleted = lp?.completed ?? false;

      const allProgress = await prisma.lessonProgress.findMany({
        where: { userId: locals.user.id, completed: true, lesson: { module: { courseId: params.id } } },
        select: { lessonId: true },
      });
      progress = Object.fromEntries(allProgress.map((p) => [p.lessonId, true]));
    }
  }

  if (!lesson.isFree && !enrollment) {
    throw redirect(302, `/learn/${params.id}`);
  }

  // Full course with modules for outline
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" }, select: { id: true, title: true, duration: true, order: true } } },
      },
    },
  });

  if (!course) throw redirect(302, "/learn");

  // Find prev/next lessons
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const idx = allLessons.findIndex((l) => l.id === params.lessonId);
  const prevLesson = idx > 0 ? allLessons[idx - 1] : null;
  const nextLesson = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;

  return {
    user: locals.user,
    lesson: { ...lesson, content: lesson.content },
    course,
    enrollment,
    isCompleted,
    progress,
    prevLesson,
    nextLesson,
  };
};

export const actions: Actions = {
  toggleComplete: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: "Не авторизовано" });

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: locals.user.id, courseId: params.id } },
    });
    if (!enrollment) return fail(403, { error: "Ви не записані на цей курс" });

    const existing = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: locals.user.id, lessonId: params.lessonId! } },
    });

    if (existing) {
      await prisma.lessonProgress.update({
        where: { id: existing.id },
        data: { completed: !existing.completed },
      });
    } else {
      await prisma.lessonProgress.create({
        data: { userId: locals.user.id, lessonId: params.lessonId!, completed: true },
      });
    }

    return { toggled: true };
  },
};
