// src/routes/admin/tournaments/[id]/edit/+page.server.ts
import { prisma } from "$lib/server/db";
import { error, fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.user || locals.user.role !== "ADMIN") throw redirect(302, "/");

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
  });
  if (!tournament) throw error(404, "Турнір не знайдено");

  const certTemplates =
    (await prisma.certificateTemplate.findMany().catch(() => [])) || [];

  return { tournament, certTemplates };
};

function parseDate(v: FormDataEntryValue | null): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function parseInt0(v: FormDataEntryValue | null, fallback: number): number {
  const n = parseInt(String(v ?? ""), 10);
  return isNaN(n) ? fallback : n;
}

export const actions: Actions = {
  save: async ({ request, params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);

    const data = await request.formData();
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    if (!title) return fail(400, { error: "Введіть назву турніру" });
    if (!description) return fail(400, { error: "Введіть опис турніру" });

    const certTemplateIdRaw = String(data.get("certTemplateId") ?? "").trim();
    const certTemplateId = certTemplateIdRaw || null;

    try {
      await prisma.tournament.update({
        where: { id: params.id },
        data: {
          title,
          description,
          format: String(data.get("format") ?? "") || null,
          rounds: parseInt0(data.get("rounds"), 1),
          regStart: parseDate(data.get("regStart")),
          regEnd: parseDate(data.get("regEnd")),
          startAt: parseDate(data.get("startAt")),
          taskDeadline: parseDate(data.get("taskDeadline")),
          minTeamSize: parseInt0(data.get("minTeamSize"), 1),
          maxTeamSize: parseInt0(data.get("maxTeamSize"), 5),
          maxTeams: data.get("maxTeams")
            ? parseInt0(data.get("maxTeams"), 0) || null
            : null,
          backendReq: String(data.get("backendReq") ?? "") || null,
          frontendReq: String(data.get("frontendReq") ?? "") || null,
          databaseReq: String(data.get("databaseReq") ?? "") || null,
          deployReq: String(data.get("deployReq") ?? "") || null,
          certTemplateId,
        },
      });
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Не вдалося зберегти зміни" });
    }

    throw redirect(303, `/admin/tournaments/${params.id}`);
  },

  delete: async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") return fail(403);
    try {
      await prisma.tournament.delete({ where: { id: params.id } });
    } catch (e) {
      console.error(e);
      return fail(500, { error: "Не вдалося видалити турнір" });
    }
    throw redirect(303, "/admin/tournaments");
  },
};
