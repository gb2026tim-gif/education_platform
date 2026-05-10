import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";

export const load: LayoutServerLoad = async ({ locals, route }) => {
  const id = route.id ?? "";
  if (id.startsWith("/jury/login") || id.startsWith("/jury/auth")) {
    return {};
  }

  // Варіант 1: jury session cookie (магічне посилання або /jury/login)
  if (locals.juryJurorId) {
    const juror = await prisma.juror.findUnique({
      where: { id: locals.juryJurorId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        passwordChanged: true,
      },
    });
    if (juror) return { juror };
  }

  // Варіант 2: Better Auth сесія з роллю JURY
  if (locals.user?.role === "JURY") {
    let juror = await prisma.juror.findUnique({
      where: { email: locals.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        passwordChanged: true,
      },
    });
    if (!juror) {
      juror = await prisma.juror.create({
        data: {
          name: locals.user.name,
          email: locals.user.email,
          passwordChanged: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          passwordChanged: true,
        },
      });
    }
    return { juror };
  }

  throw redirect(302, "/jury/login");
};
