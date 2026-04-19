import type { PageServerLoad, Actions } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);

	const [teams, invites] = await Promise.all([
		prisma.team.findMany({
			where: { captainId: user.id },
			include: {
				tournament: { select: { id: true, title: true, status: true } },
				members: true,
				submissions: { include: { task: true } }
			},
			orderBy: { createdAt: 'desc' }
		}),
		prisma.$queryRaw<Array<{
			id: string;
			teamId: string;
			teamName: string;
			tournamentTitle: string;
			status: string;
		}>>`
			SELECT ti.id, ti."teamId", t.name as "teamName", tour.title as "tournamentTitle", ti.status
			FROM team_invites ti
			JOIN teams t ON t.id = ti."teamId"
			JOIN tournaments tour ON tour.id = t."tournamentId"
			WHERE ti."userId" = ${user.id} AND ti.status = 'PENDING'
		`
	]);

	return { teams, invites, user };
};

export const actions: Actions = {
	acceptInvite: async (event) => {
		const user = requireAuth(event);
		const data = await event.request.formData();
		const inviteId = data.get('inviteId')?.toString();
		const teamId = data.get('teamId')?.toString();

		if (!inviteId || !teamId) return;

		await prisma.$executeRaw`
			UPDATE team_invites SET status = 'ACCEPTED' WHERE id = ${inviteId} AND "userId" = ${user.id}
		`;

		return { success: true };
	},

	declineInvite: async (event) => {
		const user = requireAuth(event);
		const data = await event.request.formData();
		const inviteId = data.get('inviteId')?.toString();

		if (!inviteId) return;

		await prisma.$executeRaw`
			UPDATE team_invites SET status = 'DECLINED' WHERE id = ${inviteId} AND "userId" = ${user.id}
		`;

		return { success: true };
	}
};
