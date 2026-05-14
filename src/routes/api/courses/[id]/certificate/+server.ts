// src/routes/api/courses/[id]/certificate/+server.ts
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { id: locals.user.id },
  });
  if (!dbUser) throw error(401, "User not found");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    select: {
      title: true,
      duration: true,
      modules: { select: { _count: { select: { lessons: true } } } },
    },
  });
  if (!course) throw error(404, "Course not found");

  const date = new Date().toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<title>Сертифікат — ${course.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Georgia,sans-serif;background:#0a1535;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:40px;}
.cert{background:linear-gradient(135deg,#0a1535 0%,#1a3a7a 50%,#0a1535 100%);border:3px solid rgba(62,131,255,.5);border-radius:20px;padding:60px;max-width:800px;width:100%;text-align:center;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.6);}
.cert::before{content:'';position:absolute;inset:14px;border:1px solid rgba(62,131,255,.18);border-radius:12px;}
.logo{font-size:30px;font-weight:800;margin-bottom:28px;position:relative;}
.logo .up{color:#3E83FF;}
.logo .lv{color:#e6edf3;}
.lbl{font-size:12px;letter-spacing:.3em;color:rgba(255,255,255,.4);text-transform:uppercase;margin-bottom:10px;position:relative;}
.title{font-family:Georgia,serif;font-size:38px;font-weight:700;color:#fff;margin-bottom:28px;position:relative;text-shadow:0 2px 20px rgba(62,131,255,.3);}
.divider{width:180px;height:1px;background:linear-gradient(90deg,transparent,rgba(62,131,255,.7),transparent);margin:0 auto 28px;}
.aw{font-size:15px;color:rgba(255,255,255,.55);margin-bottom:14px;position:relative;}
.name{font-family:Georgia,serif;font-size:34px;font-style:italic;color:#3E83FF;margin-bottom:12px;position:relative;}
.for{font-size:15px;color:rgba(255,255,255,.55);margin-bottom:14px;position:relative;}
.course-name{font-size:21px;font-weight:700;color:#fff;border:1px solid rgba(62,131,255,.35);border-radius:10px;padding:14px 28px;display:inline-block;position:relative;margin-bottom:28px;}
.footer{display:flex;justify-content:space-between;align-items:center;position:relative;border-top:1px solid rgba(255,255,255,.1);padding-top:20px;}
.fi{font-size:12px;color:rgba(255,255,255,.38);}
.fi strong{display:block;color:rgba(255,255,255,.6);font-size:13px;margin-top:3px;}
.seal{width:70px;height:70px;border:2px solid rgba(62,131,255,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;background:rgba(62,131,255,.12);}
</style>
</head>
<body>
<div class="cert">
  <div class="logo"><span class="lv">Lv</span><span class="up">Up</span></div>
  <div class="lbl">LvUp Education Platform</div>
  <div class="title">Certificate of Completion</div>
  <div class="divider"></div>
  <div class="aw">Цим засвідчується, що</div>
  <div class="name">${dbUser.name}</div>
  <div class="for">успішно завершила курс</div>
  <div class="course-name">${course.title}</div>
  <div class="footer">
    <div class="fi">Дата видачі<strong>${date}</strong></div>
    <div class="seal">🎓</div>
    <div class="fi">Платформа<strong>LvUp</strong></div>
  </div>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="LvUp-Certificate-${params.id}.html"`,
    },
  });
};
