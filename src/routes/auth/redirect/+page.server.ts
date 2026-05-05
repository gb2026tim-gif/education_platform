import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user?.role === "JURY")  throw redirect(302, "/jury/account");
  if (locals.user?.role === "ADMIN") throw redirect(302, "/admin");
  throw redirect(302, "/my-teams");
};
