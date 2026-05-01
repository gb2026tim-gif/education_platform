import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.juryJurorId) return json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const avatar = formData.get("avatar");
  if (!(avatar instanceof File)) return json({ error: "Файл не знайдено" }, { status: 400 });

  const bytes = new Uint8Array(await avatar.arrayBuffer());
  const ext = avatar.type.split("/")[1] ?? "png";
  const filename = `${randomUUID()}.${ext}`;
  const uploadDir = resolve("static/uploads/avatars");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(resolve(uploadDir, filename), bytes);

  const url = `/uploads/avatars/${filename}`;
  await prisma.juror.update({
    where: { id: locals.juryJurorId },
    data: { avatarUrl: url }
  });

  return json({ url });
};
