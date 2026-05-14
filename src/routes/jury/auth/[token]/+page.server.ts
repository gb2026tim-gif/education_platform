import type { PageServerLoad } from "./$types";
import { consumeMagicLinkToken } from "$lib/server/jury-magic-link";

export const load: PageServerLoad = async ({ params, cookies }) => {
  return consumeMagicLinkToken(params.token, cookies);
};
