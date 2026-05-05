// src/routes/jury/api/avatar/+server.ts
import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import crypto from "node:crypto";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.juryJurorId) {
    return json({ error: "Не авторизовано" }, { status: 401 });
  }

  const fd = await request.formData();
  const file = fd.get("avatar") as File | null;

  if (!file || !(file instanceof File)) {
    return json({ error: "Файл не знайдено" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return json({ error: "Дозволені лише зображення" }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    return json({ error: "Файл занадто великий (максимум 2MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `jury_${crypto.randomBytes(12).toString("hex")}.${ext}`;
  const uploadDir = join("static", "uploads", "jury");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(join(uploadDir, filename), buffer);

  const url = `/uploads/jury/${filename}`;
  await prisma.juror.update({
    where: { id: locals.juryJurorId },
    data: { avatarUrl: url },
  });

  return json({ url });
};
