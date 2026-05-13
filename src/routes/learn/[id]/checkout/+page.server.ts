// src/routes/learn/[id]/checkout/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { prisma } from "$lib/server/db";
import { redirect, fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user) throw redirect(302, "/auth/login");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: { select: { id: true, title: true } },
    },
  });

  if (!course || !course.published) throw redirect(302, "/learn");
  if (course.isFree) throw redirect(302, `/learn/${params.id}`);

  // Already enrolled → go to course
  const dbUser = await prisma.user.findUnique({
    where: { id: locals.user.id },
  });
  if (dbUser) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: dbUser.id, courseId: course.id } },
    });
    if (enrollment) throw redirect(302, `/learn/${params.id}`);
  }

  return { user: locals.user, course };
};

export const actions: Actions = {
  pay: async ({ params, locals }) => {
    if (!locals.user) return fail(401, { error: "Увійдіть для оплати" });

    const dbUser = await prisma.user.findUnique({
      where: { id: locals.user.id },
    });
    if (!dbUser) return fail(401, { error: "Користувача не знайдено" });

    // In real app — integrate with payment gateway (LiqPay, Stripe, etc.)
    // For demo — enroll directly after "payment"
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
