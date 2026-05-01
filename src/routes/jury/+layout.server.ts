import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";

export const load: LayoutServerLoad = async ({ locals, route }) => {
  if (route.id?.startsWith("/jury/login") || route.id?.startsWith("/jury/auth")) {
    return {};
  }

  if (!locals.juryJurorId) {
    throw redirect(302, "/jury/login");
  }

  const juror = await prisma.juror.findUnique({
    where: { id: locals.juryJurorId },
    select: { id: true, name: true, email: true, avatarUrl: true, passwordChanged: true }
  });

  if (!juror) {
    throw redirect(302, "/jury/login");
  }

  return { juror };
};
