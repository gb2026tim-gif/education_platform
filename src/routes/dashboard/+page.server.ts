import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/middleware';

export const load: PageServerLoad = async (event) => {
	const user = requireAuth(event);
	return { user };
};
