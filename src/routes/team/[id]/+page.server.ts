// src/routes/team/[id]/+page.server.ts
import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';
import { getTeamById } from '$lib/server/team';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);

	const team = await getTeamById(event.params.id);
	if (!team) throw error(404, 'Команду не знайдено');

	// Тільки капітан може бачити свою команду
	if (team.captainId !== user.id) {
		throw error(403, 'Доступ заборонено');
	}

	return { team, user };
};
