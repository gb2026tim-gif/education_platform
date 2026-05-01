import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import bcrypt from "bcrypt";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.juryJurorId) return json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { password?: string };
  const password = body.password?.trim() ?? "";
  if (!passwordRegex.test(password)) {
    return json(
      { error: "Пароль має містити мінімум 8 символів, велику літеру, цифру і спецсимвол" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.juror.update({
    where: { id: locals.juryJurorId },
    data: { passwordHash, passwordChanged: true }
  });

  return json({ ok: true });
};
