// src/routes/admin/tournaments/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') redirect(302, '/');

  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { teams: true } },
      tasks:  { select: { id: true, status: true } },
    },
  });

  return { tournaments };
};
