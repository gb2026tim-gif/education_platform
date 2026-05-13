// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  event.locals.user    = (session?.user as App.Locals['user']) ?? null;
  event.locals.session = session?.session ?? null;

  // Передаємо прапор примусової зміни пароля в locals
  // Компонент ChangePasswordModal читає це через layout load
  if (session?.user) {
    const u = session.user as App.Locals['user'] & { mustChangePassword?: boolean };
    event.locals.mustChangePassword = u.mustChangePassword ?? false;
  } else {
    event.locals.mustChangePassword = false;
  }

  return svelteKitHandler({ event, resolve, auth, building });
};
