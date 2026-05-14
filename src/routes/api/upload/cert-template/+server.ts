// src/routes/api/upload/cert-template/+server.ts
// Завантаження PDF-шаблону сертифіката
// Зберігає файл у ./uploads/cert-templates/ (поза static/)
// Повертає: { templateId, filePath }

import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { prisma } from "$lib/server/db";
import {
  ensureUploadsDir,
  CERT_TEMPLATES_DIR,
  MAX_TEMPLATE_SIZE,
} from "$lib/server/certificates";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user || locals.user.role !== "ADMIN") {
    throw error(403, "Доступ заборонено");
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) throw error(400, "Невірний запит");

  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;

  if (!file || !name) throw error(400, "Файл та назва обов'язкові");
  if (!file.name.endsWith(".pdf")) throw error(400, "Тільки PDF файли");
  if (file.size > MAX_TEMPLATE_SIZE) throw error(400, "Файл більше 5MB");

  await ensureUploadsDir();

  // Унікальне ім'я файлу
  const ext = path.extname(file.name);
  const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const fullPath = path.join(CERT_TEMPLATES_DIR, uniqueName);
  const relPath = `uploads/cert-templates/${uniqueName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, buffer);

  const template = await prisma.certificateTemplate.create({
    data: {
      name,
      filePath: relPath,
      fileSize: file.size,
    },
  });

  return json({ ok: true, templateId: template.id });
};
