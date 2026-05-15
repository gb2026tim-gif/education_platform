// src/routes/api/admin/invite/+server.ts
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { inviteUser } from "$lib/server/invite";
import { z } from "zod";

const InviteSchema = z.object({
  email: z.string().email("Невірний формат email"),
  name: z.string().min(2, "Ім'я занадто коротке"),
  role: z.enum(["ADMIN", "JURY"]),
});

export const POST: RequestHandler = async ({ request, locals }) => {
  // Тільки ADMIN може запрошувати
  if (!locals.user || locals.user.role !== "ADMIN") {
    throw error(403, "Доступ заборонено");
  }

  const body = await request.json().catch(() => null);
  const parsed = InviteSchema.safeParse(body);

  if (!parsed.success) {
    throw error(400, parsed.error.issues[0]?.message ?? "Помилка валідації");
  }

  try {
    const result = await inviteUser(parsed.data);
    return json({ ok: true, userId: result.userId });
  } catch (e: unknown) {
    throw error(400, e instanceof Error ? e.message : "Помилка запрошення");
  }
};
