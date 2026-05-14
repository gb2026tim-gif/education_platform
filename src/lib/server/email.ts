// src/lib/server/email.ts
// Відправка email через Nodemailer (Gmail SMTP або будь-який SMTP)
// Налаштування: .env → SMTP_USER, SMTP_PASS, PUBLIC_SITE_URL

import nodemailer from "nodemailer";
import { SMTP_USER, SMTP_PASS } from "$env/static/private";
import { PUBLIC_SITE_URL } from "$env/static/public";

// Singleton transporter (перевикористовується між запитами)
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS, // App Password з Google Account → Security → 2FA → App passwords
      },
    });
  }
  return _transporter;
}

// ─── Шаблони листів ───────────────────────────────────────────────────────────

function baseHtml(content: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#0a0e1a;font-family:system-ui,sans-serif;">
      <div style="max-width:520px;margin:32px auto;background:#0d1b3e;border-radius:16px;padding:40px;color:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:22px;font-weight:800;color:#fff;">Lv</span><span style="font-size:22px;font-weight:800;color:#3E83FF;">Up</span>
        </div>
        ${content}
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:32px 0 16px;" />
        <p style="font-size:12px;color:rgba(255,255,255,0.3);margin:0;">
          Це автоматичне повідомлення від платформи LvUp. Не відповідайте на цей лист.
        </p>
      </div>
    </body>
    </html>
  `;
}

// ─── Запрошення адміна / журі ─────────────────────────────────────────────────

export async function sendInviteEmail(opts: {
  to: string;
  name: string;
  role: "ADMIN" | "JURY";
  otp: string;
}) {
  const roleLabel = opts.role === "ADMIN" ? "адміністратора" : "члена журі";

  const html = baseHtml(`
    <h2 style="margin:0 0 8px;font-size:22px;">Вас запрошено на LvUp</h2>
    <p style="color:rgba(255,255,255,0.6);margin:0 0 24px;font-size:14px;">
      Ви були додані як <strong style="color:#fff;">${roleLabel}</strong>.
    </p>

    <p style="margin:0 0 8px;font-size:15px;">Привіт, <strong>${opts.name}</strong>!</p>
    <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;">
      Використайте ці дані для першого входу. Після входу система одразу
      запропонує вам встановити власний пароль.
    </p>

    <div style="background:rgba(62,131,255,0.08);border:1px solid rgba(62,131,255,0.25);
                border-radius:12px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">EMAIL</p>
      <p style="margin:0 0 16px;font-size:16px;font-weight:600;">${opts.to}</p>
      <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">ОДНОРАЗОВИЙ ПАРОЛЬ</p>
      <p style="margin:0;font-size:28px;font-weight:800;color:#3E83FF;letter-spacing:4px;font-family:monospace;">
        ${opts.otp}
      </p>
    </div>

    <a href="${PUBLIC_SITE_URL}/auth/login"
       style="display:inline-block;background:#3E83FF;color:#fff;padding:14px 28px;
              border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;
              margin-top:8px;">
      Увійти на платформу →
    </a>

    <p style="color:rgba(255,255,255,0.35);font-size:12px;margin-top:20px;">
      Одноразовий пароль дійсний 48 годин. Якщо ви не очікували цього листа — проігноруйте його.
    </p>
  `);

  await getTransporter().sendMail({
    from: `"LvUp Platform" <${SMTP_USER}>`,
    to: opts.to,
    subject: `Запрошення на платформу LvUp як ${roleLabel}`,
    html,
  });
}

// ─── Сертифікат видано ────────────────────────────────────────────────────────

export async function sendCertificateEmail(opts: {
  to: string;
  name: string;
  certName: string;
  certId: string;
}) {
  const html = baseHtml(`
    <h2 style="margin:0 0 8px;font-size:22px;">🎉 Ваш сертифікат готовий!</h2>
    <p style="color:rgba(255,255,255,0.7);font-size:14px;line-height:1.6;margin:8px 0 24px;">
      Привіт, <strong>${opts.name}</strong>! Ви отримали сертифікат:
      <strong style="color:#3E83FF;">${opts.certName}</strong>
    </p>
    <a href="${PUBLIC_SITE_URL}/api/certificates/${opts.certId}"
       style="display:inline-block;background:#3E83FF;color:#fff;padding:14px 28px;
              border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
      Завантажити сертифікат (PDF) →
    </a>
    <p style="color:rgba(255,255,255,0.35);font-size:12px;margin-top:20px;">
      Сертифікат також доступний у вашому особистому кабінеті.
    </p>
  `);

  await getTransporter().sendMail({
    from: `"LvUp Platform" <${SMTP_USER}>`,
    to: opts.to,
    subject: `Ваш сертифікат: ${opts.certName}`,
    html,
  });
}
