// src/routes/admin/invite/+page.server.ts
import { redirect, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { inviteUser } from "$lib/server/invite";
import { z } from "zod";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "ADMIN") redirect(302, "/");

  const invites = await prisma.invitation.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const adminsAndJury = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "JURY"] } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      mustChangePassword: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { invites, adminsAndJury };
};

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(["ADMIN", "JURY"]),
});

export const actions: Actions = {
  invite: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== "ADMIN") {
      return fail(403, { error: "Доступ заборонено" });
    }

    const data = Object.fromEntries(await request.formData());
    const parsed = Schema.safeParse(data);

    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message });
    }

    try {
      await inviteUser(parsed.data);
      return { success: true };
    } catch (e: unknown) {
      return fail(400, { error: e instanceof Error ? e.message : "Помилка" });
    }
  },
};
