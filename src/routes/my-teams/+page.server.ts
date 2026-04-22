// src/routes/my-teams/+page.server.ts
import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { requireAuth } from '$lib/server/middleware';
import { prisma } from '$lib/server/db';

interface RawInvite {
    id:              string;
    teamId:          string;
    teamName:        string;
    tournamentTitle: string;
    status:          string;
}

export const load: PageServerLoad = async (event) => {
    const user = requireAuth(event);

    const [teams, rawInvites] = await Promise.all([
        prisma.team.findMany({
            where: {
                OR: [
                    { captainId: user.id },
                    { members: { some: { email: user.email } } }
                ]
            },
            include: {
                captain:     { select: { id: true, name: true } },
                tournament:  { select: { id: true, title: true, status: true } },
                members:     true,
                submissions: { include: { task: true } }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.$queryRaw<RawInvite[]>`
            SELECT ti.id, ti."teamId", t.name as "teamName", tour.title as "tournamentTitle", ti.status
            FROM team_invites ti
                     JOIN teams t          ON t.id    = ti."teamId"
                     JOIN tournaments tour ON tour.id = t."tournamentId"
            WHERE ti."userId" = ${user.id} AND ti.status = 'PENDING'
        `.catch((): RawInvite[] => [])
    ]);

    const testInvite: RawInvite = {
        id:              'test-invite-demo-001',
        teamId:          'test-team-demo-001',
        teamName:        'Alpha Squad',
        tournamentTitle: 'Hackathon Spring 2025',
        status:          'PENDING'
    };

    const invites: RawInvite[] = [...rawInvites];
    if (!invites.some(i => i.id === testInvite.id)) {
        invites.push(testInvite);
    }

    return { teams, invites, user };
};

export const actions: Actions = {
    acceptInvite: async (event) => {
        // Actions receive RequestEvent — read locals.user directly
        const user = event.locals.user;
        if (!user) throw redirect(302, '/auth/login');

        const formData = await event.request.formData();
        const inviteId = formData.get('inviteId')?.toString();
        const teamId   = formData.get('teamId')?.toString();

        if (inviteId === 'test-invite-demo-001') return { success: true };
        if (!inviteId || !teamId) return { success: false };

        await prisma.$executeRaw`UPDATE team_invites SET status = 'ACCEPTED' WHERE id = ${inviteId} AND "userId" = ${user.id}`;
        await prisma.teamMember.upsert({
            where:  { email_teamId: { email: user.email, teamId } },
            create: { name: user.name, email: user.email, teamId },
            update: {}
        });
        return { success: true };
    },

    declineInvite: async (event) => {
        const user = event.locals.user;
        if (!user) throw redirect(302, '/auth/login');

        const formData = await event.request.formData();
        const inviteId = formData.get('inviteId')?.toString();

        if (inviteId === 'test-invite-demo-001') return { success: true };
        if (!inviteId) return { success: false };

        await prisma.$executeRaw`UPDATE team_invites SET status = 'DECLINED' WHERE id = ${inviteId} AND "userId" = ${user.id}`;
        return { success: true };
    }
};