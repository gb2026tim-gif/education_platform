import type { PageServerLoad, Actions } from './$types';
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

	if (!team) throw error(404, 'Команда не знайдена');

	const isMember = team.members.some(m => m.email === user.email);
	const isCaptain = team.captainId === user.id;
	if (!isCaptain && !isMember) throw error(404, 'Команда не знайдена');

	return { team, user, isCaptain };
};

export const actions: Actions = {
	leaveTeam: async (event) => {
		const user = requireAuth(event);
		const teamId = event.params.id;

		const team = await prisma.team.findUnique({
			where: { id: teamId },
			include: { members: true }
		});

		if (!team) throw error(404, 'Команда не знайдена');

		if (team.captainId === user.id) {
			await prisma.juryAssignment.deleteMany({
				where: { submission: { teamId } }
			});
			await prisma.submission.deleteMany({ where: { teamId } });
			await prisma.teamMember.deleteMany({ where: { teamId } });
			await prisma.team.delete({ where: { id: teamId } });
		} else {
			await prisma.teamMember.deleteMany({
				where: { teamId, email: user.email }
			});
		}

		return { success: true };
	}
};
