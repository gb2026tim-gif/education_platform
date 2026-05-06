// prisma/seed-jury.ts
import { PrismaClient } from "@prisma/client";
import * as crypto from "node:crypto";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const ONE_TIME_PASSWORD = "Jury@2026!";

async function main() {
  console.log("🔧 Seed jury started...\n");

  const tournament = await prisma.tournament.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!tournament) {
    console.error("❌ Турнір не знайдено. Запусти seed.ts спочатку.");
    process.exit(1);
  }
  console.log(`✅ Турнір: ${tournament.title}`);

  await prisma.tournament.update({
    where: { id: tournament.id },
    data: { status: "RUNNING" },
  });

  const passwordHash = await bcrypt.hash(ONE_TIME_PASSWORD, 12);

  // ── 10 журі ──────────────────────────────────────────────────
  const jurorData = Array.from({ length: 10 }, (_, i) => ({
    name: `Журі ${i + 1}`,
    email: `jury${i + 1}@lvlup.com`,
  }));

  const jurors = [];
  for (const d of jurorData) {
    const juror = await prisma.juror.upsert({
      where: { email: d.email },
      update: { passwordHash, passwordChanged: false, name: d.name },
      create: {
        name: d.name,
        email: d.email,
        passwordHash,
        passwordChanged: false,
      },
    });
    jurors.push(juror);
    console.log(`✅ Журі: ${juror.name} <${juror.email}>`);
  }

  // ── 8 тестових робіт ─────────────────────────────────────────
  await prisma.assignment.deleteMany({
    where: { work: { tournamentId: tournament.id } },
  });
  await prisma.work.deleteMany({ where: { tournamentId: tournament.id } });

  const worksData = [
    {
      teamName: "Команда Альфа",
      githubUrl: "https://github.com/alpha-team/project",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      liveDemoUrl: "https://alpha.vercel.app",
      description:
        "Платформа управління завданнями. Node.js + React + PostgreSQL.",
    },
    {
      teamName: "Команда Бета",
      githubUrl: "https://github.com/beta-team/project",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      liveDemoUrl: null,
      description: "Освітня платформа з курсами. SvelteKit + Prisma.",
    },
    {
      teamName: "Команда Гамма",
      githubUrl: "https://github.com/gamma-team/project",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      liveDemoUrl: "https://gamma.netlify.app",
      description: "Маркетплейс з аукціонами. WebSocket + Redis.",
    },
    {
      teamName: "Команда Дельта",
      githubUrl: "https://github.com/delta-team/project",
      videoUrl: null,
      liveDemoUrl: null,
      description: "CRM система. Vue.js + Fastify + MySQL.",
    },
    {
      teamName: "Команда Epsilon",
      githubUrl: "https://github.com/epsilon-team/project",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      liveDemoUrl: "https://epsilon.railway.app",
      description: "Месенджер з шифруванням. Next.js + Socket.IO.",
    },
    {
      teamName: "Команда Зета",
      githubUrl: "https://github.com/zeta-team/project",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      liveDemoUrl: null,
      description: "Аналітична платформа. FastAPI + React + ClickHouse.",
    },
    {
      teamName: "Команда Ета",
      githubUrl: "https://github.com/eta-team/project",
      videoUrl: null,
      liveDemoUrl: "https://eta.vercel.app",
      description: "Сервіс доставки. NestJS + React + Redis.",
    },
    {
      teamName: "Команда Тета",
      githubUrl: "https://github.com/theta-team/project",
      videoUrl: "https://youtu.be/dQw4w9WgXcQ",
      liveDemoUrl: "https://theta.netlify.app",
      description: "Система бронювання. SvelteKit + Supabase.",
    },
  ];

  const works = [];
  for (const w of worksData) {
    const work = await prisma.work.create({
      data: { ...w, tournamentId: tournament.id },
    });
    works.push(work);
  }
  console.log(`\n✅ Створено ${works.length} робіт`);

  // Кожен журі отримує 3 роботи
  const plans = [
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [4, 5, 6],
    [5, 6, 7],
    [0, 3, 6],
    [1, 4, 7],
    [0, 2, 5],
    [1, 3, 7],
  ];

  for (let i = 0; i < jurors.length; i++) {
    const juror = jurors[i];
    const workIdxs = plans[i] ?? [0, 1, 2];
    for (let j = 0; j < workIdxs.length; j++) {
      const work = works[workIdxs[j]];
      const assignment = await prisma.assignment.create({
        data: {
          jurorId: juror.id,
          workId: work.id,
          displayNumber: j + 1,
          evaluated: false,
          isDraft: false,
        },
      });
      // Перша робота першого журі — вже оцінена (демо)
      if (i === 0 && j === 0) {
        await prisma.assignment.update({
          where: { id: assignment.id },
          data: { evaluated: true, evaluatedAt: new Date() },
        });
        await prisma.evaluation.create({
          data: {
            assignmentId: assignment.id,
            backendCode: 78,
            databaseStructure: 75,
            frontendCode: 82,
            backendFunctionality: 90,
            databaseFunctionality: 82,
            frontendFunctionality: 82,
            comment: "Гарна архітектура, потрібно більше тестів.",
            requirementsRest: true,
            requirementsDb: true,
            requirementsAuth: true,
            requirementsFrontend: true,
            requirementsDeploy: false,
          },
        });
      }
    }
    console.log(`✅ ${juror.name}: ${workIdxs.length} роботи`);
  }

  // Магічні посилання
  console.log("\n🔗 Магічні посилання:\n");
  for (const juror of jurors) {
    await prisma.juryToken.deleteMany({ where: { jurorId: juror.id } });
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.juryToken.create({
      data: {
        jurorId: juror.id,
        token,
        used: false,
        expiresAt: new Date(Date.now() + 72 * 3600000),
      },
    });
    console.log(
      `${juror.name}: http://localhost:5173/jury/auth?token=${token}`,
    );
  }

  console.log(`\n🔑 Пароль для всіх: ${ONE_TIME_PASSWORD}`);
  console.log("   Вхід: http://localhost:5173/jury/login");
  console.log("\n📧 Акаунти:");
  for (const j of jurors) console.log(`   ${j.email}`);
}

main()
  .catch((e) => {
    console.error("❌", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
