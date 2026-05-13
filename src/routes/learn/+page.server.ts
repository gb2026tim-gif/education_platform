// src/routes/learn/+page.server.ts
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      author: { select: { id: true, name: true } },
      modules: {
        include: { _count: { select: { lessons: true } } },
        orderBy: { order: "asc" },
      },
      _count: { select: { modules: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get enrollments for logged-in user
  let enrollments: any[] = [];
  if (locals.user) {
    const raw = await prisma.enrollment.findMany({
      where: { userId: locals.user.id },
      include: {
        course: { select: { id: true } },
      },
    });

    // Count completed lessons per enrollment
    enrollments = await Promise.all(
      raw.map(async (e) => {
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId: locals.user!.id,
            completed: true,
            lesson: { module: { courseId: e.courseId } },
          },
        });
        return { ...e, completedLessons };
      }),
    );
  }

  return { user: locals.user, courses, enrollments };
};
