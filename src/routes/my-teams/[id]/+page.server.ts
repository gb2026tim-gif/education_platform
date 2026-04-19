// src/routes/my-teams/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { prisma } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);
	const teamId = event.params.id;

	const team = await prisma.team.findUnique({
		where: { id: teamId },
		include: {
			tournament: { select: { id: true, title: true, status: true, description: true } },
			members: true,
			captain: { select: { id: true, name: true, email: true } },
			submissions: {
				include: { task: { select: { id: true, title: true, deadline: true } } }
			}
		}
	});

	if (!team || team.captainId !== user.id) {
		throw error(404, 'Команда не знайдена');
	}

	return { team, user };
};
