import { prisma } from "$lib/server/db";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const teams = await prisma.team.findMany({
    where: { tournamentId: params.id },
    include: { members: true },
  });
  return { teams };
};

export const actions: Actions = {
  toggleVerify: async ({ request }) => {
    const formData = await request.formData();
    const teamId = formData.get("teamId") as string;
    const currentStatus = formData.get("verified") === "true";

    // Використовуємо 'as any', якщо IDE тупить з типами Prisma
    await (prisma.team as any).update({
      where: { id: teamId },
      data: { verified: !currentStatus },
    });

    return { success: true };
  },
};
