// src/routes/api/courses/[id]/summary/+server.ts
import type { RequestHandler } from "./$types";
import { prisma } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) throw error(401, "Unauthorized");

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            select: { title: true, content: true, duration: true },
          },
        },
      },
    },
  });

  if (!course) throw error(404, "Not found");

  // Build HTML summary
  const modulesHtml = course.modules
    .map(
      (m) => `
    <section class="module">
      <h2>${m.title}</h2>
      ${m.lessons
        .map(
          (l) => `
        <div class="lesson">
          <h3>${l.title} <span class="dur">${l.duration} хв</span></h3>
          ${
            l.content
              ? `<div class="content">${l.content
                  .replace(/```[\w]*\n?/g, "<pre><code>")
                  .replace(/```/g, "</code></pre>")
                  .replace(/\n/g, "<br>")}</div>`
              : ""
          }
        </div>
      `,
        )
        .join("")}
    </section>
  `,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8">
<title>Конспект — ${course.title}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', sans-serif; background: #f8faff; color: #0a0e1a; padding: 40px; max-width: 900px; margin: 0 auto; }
  header { background: linear-gradient(135deg, #0d1b4a, #1a3a7a); color: #fff; padding: 40px; border-radius: 16px; margin-bottom: 32px; }
  .logo { font-size: 28px; font-weight: 800; margin-bottom: 16px; }
  .logo .up { color: #3E83FF; }
  h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
  .meta { font-size: 14px; opacity: .7; }
  .module { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 12px; padding: 24px; margin-bottom: 20px; }
  h2 { font-size: 20px; font-weight: 700; color: #0a0e1a; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #3E83FF; }
  .lesson { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,.06); }
  .lesson:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  h3 { font-size: 15px; font-weight: 600; color: #1a3a7a; margin-bottom: 8px; }
  .dur { font-size: 12px; color: #666; font-weight: 400; margin-left: 8px; }
  .content { font-size: 13px; color: #444; line-height: 1.7; }
  pre { background: #f0f4ff; border-radius: 8px; padding: 12px; margin: 8px 0; overflow-x: auto; }
  code { font-family: 'Courier New', monospace; font-size: 12px; }
  footer { text-align: center; color: #666; font-size: 13px; margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,.1); }
</style>
</head>
<body>
<header>
  <div class="logo">Lv<span class="up">Up</span></div>
  <h1>${course.title}</h1>
  <div class="meta">${course.modules.length} модулів · Конспект курсу · ${new Date().toLocaleDateString("uk-UA")}</div>
</header>
${modulesHtml}
<footer>LvUp Education Platform · ${new Date().getFullYear()}</footer>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'attachment; filename="LvUp-course-summary.html"',
    },
  });
};
