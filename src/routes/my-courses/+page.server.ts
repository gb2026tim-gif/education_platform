import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw redirect(302, "/auth/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: locals.user.id },
  });
  if (!dbUser) throw redirect(302, "/auth/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: dbUser.id },
    include: {
      course: {
        include: {
          modules: {
            include: { _count: { select: { lessons: true } } },
          },
          _count: { select: { modules: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  // Прогрес по кожному курсу
  const withProgress = await Promise.all(
    enrollments.map(async (e) => {
      const total = e.course.modules.reduce(
        (a, m) => a + (m._count?.lessons ?? 0),
        0,
      );
      const completed = await prisma.lessonProgress.count({
        where: {
          userId: dbUser.id,
          completed: true,
          lesson: { module: { courseId: e.courseId } },
        },
      });
      return { ...e, totalLessons: total, completedLessons: completed };
    }),
  );

  return { user: locals.user, enrollments: withProgress };
};
