import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { consumeMagicLinkToken } from "$lib/server/jury-magic-link";

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = url.searchParams.get("token");
  if (!token) {
    throw redirect(302, "/jury/login?error=missing_token");
  }
  return consumeMagicLinkToken(token, cookies);
};
