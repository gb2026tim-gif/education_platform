// src/routes/tourments/+page.server.ts
import type { PageServerLoad } from "./$types";
import { getTournaments } from "$lib/server/tournament";

export const load: PageServerLoad = async () => {
  const [running, registration, finished] = await Promise.all([
    getTournaments("RUNNING"),
    getTournaments("REGISTRATION"),
    getTournaments("FINISHED"),
  ]);
  return { running, registration, finished };
};
