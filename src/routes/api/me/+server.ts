// src/routes/api/me/+server.ts
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) return json({ role: null });
  return json({ role: locals.user.role, id: locals.user.id });
};
