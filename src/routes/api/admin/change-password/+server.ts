// src/routes/api/admin/change-password/+server.ts
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { changePasswordForced } from '$lib/server/invite';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) throw error(401, 'Не авторизовано');

  const { newPassword } = await request.json();

  try {
    await changePasswordForced({
      userId: locals.user.id,
      newPassword,
    });
    return json({ ok: true });
  } catch (e: unknown) {
    throw error(400, e instanceof Error ? e.message : 'Помилка');
  }
};
