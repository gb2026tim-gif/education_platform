// src/routes/profile/+page.server.ts
import type { PageServerLoad, Actions } from "./$types";
import { requireAuth } from "$lib/server/middleware";
import { prisma } from "$lib/server/db";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const user = requireAuth(event);

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      captainOf: {
        include: {
          tournament: { select: { id: true, title: true } },
          members: true,
        },
      },
    },
  });

  return { profile: fullUser };
};

export const actions: Actions = {
  updateProfile: async (event) => {
    const user = requireAuth(event);
    const data = await event.request.formData();

    const firstName = data.get("firstName")?.toString().trim() ?? "";
    const lastName = data.get("lastName")?.toString().trim() ?? "";
    const city = data.get("city")?.toString().trim() ?? null;
    const school = data.get("school")?.toString().trim() ?? null;
    const phone = data.get("phone")?.toString().trim() ?? null;
    const discord = data.get("discord")?.toString().trim() ?? null;

    if (!firstName || !lastName) {
      return fail(400, { error: "Ім'я та прізвище обов'язкові" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        city,
        school,
        phone,
        discord,
      },
    });

    return { success: true };
  },
};
