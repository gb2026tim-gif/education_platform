// src/routes/learn/[id]/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              duration: true,
              order: true,
              isFree: true,
              videoUrl: true,
            },
          },
        },
      },
      _count: { select: { enrollments: true } },
    },
  });

  if (!course || !course.published) throw redirect(302, "/learn");

  let enrollment = null;
  let progress: Record<string, boolean> = {};

  if (locals.user?.id) {
    // Verify user exists in DB
    const dbUser = await prisma.user.findUnique({
      where: { id: locals.user.id },
    });
    if (dbUser) {
      enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: dbUser.id, courseId: course.id } },
      });
      if (enrollment) {
        const done = await prisma.lessonProgress.findMany({
          where: {
            userId: dbUser.id,
            completed: true,
            lesson: { module: { courseId: course.id } },
          },
          select: { lessonId: true },
        });
        progress = Object.fromEntries(done.map((lp) => [lp.lessonId, true]));
      }
    }
  }

  return { user: locals.user, course, enrollment, progress };
};

export const actions: Actions = {
  enroll: async ({ params, locals }) => {
    if (!locals.user) throw redirect(302, "/auth/login");

    // Verify user exists in DB
    const dbUser = await prisma.user.findUnique({
      where: { id: locals.user.id },
    });
    if (!dbUser) throw redirect(302, "/auth/login");

    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: dbUser.id, courseId: params.id } },
      update: {},
      create: { userId: dbUser.id, courseId: params.id },
    });

    // Redirect to first lesson
    const first = await prisma.lesson.findFirst({
      where: { module: { courseId: params.id } },
      orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
    });
    if (first) throw redirect(302, `/learn/${params.id}/${first.id}`);
    throw redirect(302, `/learn/${params.id}`);
  },
};
