import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    throw redirect(302, "/jury/login?error=missing_token");
  }
  throw redirect(302, `/jury/auth?token=${encodeURIComponent(token)}`);
};
