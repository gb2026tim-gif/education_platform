import { prisma } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const tournaments = await prisma.tournament.findMany({
    where: { status: { not: "DRAFT" } },
    orderBy: { createdAt: "desc" },
    include: {
      tasks: true,
      _count: { select: { teams: true } },
    },
  });
  return { tournaments };
};
