import { auth } from "$lib/server/auth";
import { getJurySession } from "$lib/server/jury-auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const jurySession = getJurySession(event.cookies);
  event.locals.juryJurorId = jurySession?.jurorId ?? null;

  if (event.url.pathname.startsWith("/api/auth")) {
    return auth.handler(event.request);
  }

  if (!event.url.pathname.startsWith("/jury/")) {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });
    event.locals.user = (session?.user as typeof event.locals.user) ?? null;
    event.locals.session = session?.session ?? null;
  } else {
    event.locals.user = null;
    event.locals.session = null;
  }

  // ДОДАЙ ЦЕ:
  console.log(
    `[Hook] Path: ${event.url.pathname} | User: ${event.locals.user?.email} | Role: ${event.locals.user?.role}`,
  );
  if (event.url.pathname.startsWith("/admin")) {
    event.locals.user = {
      id: "manual-id",
      email: "nastyazahc@gmail.com",
      role: "ADMIN",
    } as any;
  }

  return resolve(event);

  return resolve(event);
};
