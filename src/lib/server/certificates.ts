// src/lib/server/certificates.ts
// Генерація PDF сертифікатів "на льоту" через pdf-lib
// Шаблон (PDF) зберігається на диску: <project_root>/uploads/cert-templates/
// При генерації: завантажуємо шаблон → вписуємо ім'я → повертаємо Buffer

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs/promises";
import path from "path";
import { prisma } from "./db";
import { sendCertificateEmail } from "./email";

// Папка для шаблонів (поза static/, git-ігнорується)
export const CERT_TEMPLATES_DIR = path.resolve("uploads/cert-templates");
export const MAX_TEMPLATE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function ensureUploadsDir() {
  await fs.mkdir(CERT_TEMPLATES_DIR, { recursive: true });
}

// ─── Генерація PDF ────────────────────────────────────────────────────────────

export async function generateCertificate(certId: string): Promise<Buffer> {
  const cert = await prisma.userCertificate.findUnique({
    where: { id: certId },
    include: {
      user: { select: { name: true } },
      template: true,
      tournament: { select: { title: true } },
      course: { select: { title: true } },
    },
  });

  if (!cert) throw new Error("Сертифікат не знайдено");

  const templatePath = path.resolve(cert.template.filePath);
  const templateBytes = await fs.readFile(templatePath);

  // Завантажуємо PDF-шаблон
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Визначаємо текст: "Ім'я Прізвище"
  const displayName = cert.user.name;

  // Вбудований шрифт (Helvetica-Bold — завжди є)
  // Для кирилиці потрібен окремий TTF — підключається окремо
  // (div нижче показує як підключити власний шрифт)
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { nameX, nameY, fontSize, fontColor } = cert.template;

  // Парсимо hex колір (#1a1a1a → {r,g,b})
  const hex = fontColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Центруємо ім'я по X
  const textWidth = font.widthOfTextAtSize(displayName, fontSize);
  const x = nameX - textWidth / 2;

  firstPage.drawText(displayName, {
    x,
    y: nameY,
    size: fontSize,
    font,
    color: rgb(r, g, b),
  });

  // Додаткова стрічка внизу: "Турнір: ..." або "Курс: ..."
  const subtitle = cert.tournament?.title ?? cert.course?.title ?? "";
  if (subtitle) {
    const subFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const subSize = 14;
    const subWidth = subFont.widthOfTextAtSize(subtitle, subSize);
    firstPage.drawText(subtitle, {
      x: nameX - subWidth / 2,
      y: nameY - fontSize - 10,
      size: subSize,
      font: subFont,
      color: rgb(r * 0.7, g * 0.7, b * 0.7),
    });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// ─── Видача сертифіката (запис в БД + email) ──────────────────────────────────

export async function issueCertificate(opts: {
  userId: string;
  templateId: string;
  tournamentId?: string;
  courseId?: string;
}) {
  const user = await prisma.user.findUnique({
    where: { id: opts.userId },
    select: { name: true, email: true },
  });
  if (!user) throw new Error("Користувача не знайдено");

  const template = await prisma.certificateTemplate.findUnique({
    where: { id: opts.templateId },
    select: { name: true },
  });
  if (!template) throw new Error("Шаблон не знайдено");

  const cert = await prisma.userCertificate.create({
    data: {
      userId: opts.userId,
      templateId: opts.templateId,
      tournamentId: opts.tournamentId,
      courseId: opts.courseId,
    },
  });

  // Відправляємо email (асинхронно, не блокуємо відповідь)
  sendCertificateEmail({
    to: user.email,
    name: user.name,
    certName: template.name,
    certId: cert.id,
  }).catch(console.error);

  return cert;
}

// ─── Підказка: кирилиця в PDF ─────────────────────────────────────────────────
// Якщо потрібна кирилиця — завантажте TTF-шрифт у /static/fonts/
// та підключіть так:
//
//   const fontBytes = await fs.readFile('static/fonts/Manrope-Bold.ttf');
//   const font = await pdfDoc.embedFont(fontBytes);
