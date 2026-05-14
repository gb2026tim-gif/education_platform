// src/routes/learn/[id]/complete/+page.server.ts
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) throw redirect(302, "/auth/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: locals.user.id },
  });
  if (!dbUser) throw redirect(302, "/auth/login");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { id: true, title: true },
          },
        },
      },
    },
  });
  if (!course) throw redirect(302, "/learn");

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: dbUser.id, courseId: params.id } },
  });
  if (!enrollment) throw redirect(302, `/learn/${params.id}`);

  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

  const recommended = await prisma.course.findMany({
    where: {
      published: true,
      id: { not: params.id },
      enrollments: { none: { userId: dbUser.id } },
    },
    take: 3,
    select: { id: true, title: true, level: true, isFree: true, price: true },
  });

  return { user: locals.user, course, totalLessons, recommended };
};
