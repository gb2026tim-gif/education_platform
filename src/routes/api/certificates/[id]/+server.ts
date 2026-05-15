// src/routes/api/certificates/[id]/+server.ts
// Генерує PDF сертифікат та повертає його як завантаження

import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { generateCertificate } from "$lib/server/certificates";
import { prisma } from "$lib/server/db";

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) throw error(401, "Не авторизовано");

  const cert = await prisma.userCertificate.findUnique({
    where: { id: params.id },
    select: {
      userId: true,
      user: { select: { name: true } },
      template: { select: { name: true } },
    },
  });

  if (!cert) throw error(404, "Сертифікат не знайдено");

  // Юзер може завантажити тільки свій сертифікат (адмін — будь-який)
  if (cert.userId !== locals.user.id && locals.user.role !== "ADMIN") {
    throw error(403, "Доступ заборонено");
  }

  try {
    const pdfBuffer = await generateCertificate(params.id);
    const filename = `certificate-${cert.user.name.replace(/\s+/g, "-")}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Certificate generation error:", e);
    throw error(500, "Помилка генерації сертифіката");
  }
};
