// src/routes/admin/tournaments/new/+page.server.ts
import { prisma } from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { TournamentStatus } from "@prisma/client";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "ADMIN") throw redirect(302, "/");
  const certTemplates =
    (await prisma.certificateTemplate.findMany().catch(() => [])) || [];
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tasks: true,
      _count: { select: { teams: true } },
    },
  });
  return { certTemplates, tournaments };
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
  create: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") {
      return fail(403, { error: "Доступ заборонено" });
    }

    const data = await request.formData();
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();

    if (!title) return fail(400, { error: "Введіть назву турніру" });
    if (!description) return fail(400, { error: "Введіть опис турніру" });

    const publish = data.get("publish") === "true";
    const status: TournamentStatus = publish ? "REGISTRATION" : "DRAFT";

    const certTemplateIdRaw = String(data.get("certTemplateId") ?? "").trim();
    const certTemplateId = certTemplateIdRaw || null;

    try {
      const created = await prisma.tournament.create({
        data: {
          title,
          description,
          status,
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
          admin: { connect: { id: locals.user.id } },
        },
      });

      throw redirect(303, `/admin/tournaments/${created.id}`);
    } catch (e) {
      // Re-throw redirects (SvelteKit redirects are objects with `status` & `location`)
      if (e && typeof e === "object" && "status" in e && "location" in e)
        throw e;
      console.error("Prisma Error:", e);
      return fail(500, { error: "Не вдалося створити турнір" });
    }
  },
};
