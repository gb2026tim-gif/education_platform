// src/routes/my-teams/+page.server.ts
import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);

	const teams = await prisma.team.findMany({
		where: {
			captainId: user.id
		},
		include: {
			tournament: {
				select: {
					id: true,
					title: true,
					status: true
				}
			},
			members: true,
			submissions: {
				include: {
					task: { select: { title: true, deadline: true } },
					assignments: {
						include: {
							score: true
						}
					}
				}
			}
		},
		orderBy: { createdAt: 'desc' }
	});

	return { teams, user };
};
