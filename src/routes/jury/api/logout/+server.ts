import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { clearJurySessionCookie } from "$lib/server/jury-auth";

export const POST: RequestHandler = async ({ cookies }) => {
  clearJurySessionCookie(cookies);
  throw redirect(302, "/jury/login");
};
