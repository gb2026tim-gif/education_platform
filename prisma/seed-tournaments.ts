// prisma/seed-tournaments.ts
// Run: npx tsx prisma/seed-tournaments.ts
// Creates 3 static test tournaments with different statuses

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🏆 Seeding tournaments...\n");

  // Find admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error("❌ No ADMIN user found. Run: npx tsx prisma/seed.ts first.");
    process.exit(1);
  }
  console.log(`✅ Admin: ${admin.name} <${admin.email}>`);

  // Remove existing test tournaments to avoid duplicates
  await prisma.task.deleteMany({
    where: { tournament: { title: { contains: "CODE4FUTURE" } } },
  });
  await prisma.tournament.deleteMany({
    where: {
      title: {
        in: ["CODE4FUTURE 2026", "Hackathon Spring 2025", "WebDev Cup 2024"],
      },
    },
  });

  // 1. REGISTRATION — open registration
  const t1 = await prisma.tournament.create({
    data: {
      title: "CODE4FUTURE 2026",
      description:
        "Командний турнір з програмування для школярів та студентів. Учасники розробляють веб-платформу з підтримкою командної роботи в реальному часі. Завдання буде опубліковано після старту реєстрації. Оцінювання проводитиметься журі за технічними та функціональними критеріями. Команди-переможці отримають сертифікати та призи від партнерів.",
      status: "REGISTRATION",
      regStart: new Date("2026-04-01"),
      regEnd: new Date("2026-05-25"),
      maxTeams: 20,
      adminId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Веб-платформа CODE4FUTURE",
      description:
        "Мета — створити веб-платформу, яка дозволяє організаторам проводити турніри, командам — реєструватись та здавати результати, а журі — оцінювати роботи.\n\nКритерії оцінювання:\n• Функціональність та стабільність\n• Якість коду та архітектура\n• UI/UX та адаптивність\n• Документація та тести",
      requirements: [
        "Авторизація та ролі (Admin, Team, Jury)",
        "Управління турнірами та командами",
        "Система подачі результатів (GitHub, відео, demo)",
        "Панель журі з оцінюванням",
        "Таблиця лідерів",
        "Адаптивний інтерфейс",
        "Деплой на публічний хостинг",
        "README з інструкцією запуску",
      ],
      techStack: [
        "Backend: SvelteKit або Node.js / PHP (на вибір)",
        "Frontend: Svelte, React або будь-який фреймворк",
        "Database: PostgreSQL або MongoDB",
        "Deploy: Обов'язково",
      ].join("\n"),
      startAt: new Date("2026-04-15"),
      deadline: new Date("2026-05-25T23:59:00"),
      status: "ACTIVE",
      tournamentId: t1.id,
    },
  });
  console.log(`✅ Created: ${t1.title} [REGISTRATION]`);

  // 2. RUNNING — active tournament
  const t2 = await prisma.tournament.create({
    data: {
      title: "Hackathon Spring 2025",
      description:
        "Командний хакатон для веб-розробників. Завдання — розробити повнофункціональний застосунок за 48 годин. Наразі відбувається оцінювання робіт журі. Результати будуть опубліковані після завершення оцінювання.",
      status: "RUNNING",
      regStart: new Date("2025-03-01"),
      regEnd: new Date("2025-04-01"),
      maxTeams: 16,
      adminId: admin.id,
    },
  });
  console.log(`✅ Created: ${t2.title} [RUNNING]`);

  // 3. FINISHED — completed tournament
  const t3 = await prisma.tournament.create({
    data: {
      title: "WebDev Cup 2024",
      description:
        "Завершений турнір з веб-розробки. Учасники змагались у створенні інноваційних веб-застосунків. Переможці нагороджені сертифікатами та цінними призами від технологічних партнерів.",
      status: "FINISHED",
      regStart: new Date("2024-09-01"),
      regEnd: new Date("2024-10-01"),
      maxTeams: 16,
      adminId: admin.id,
    },
  });
  console.log(`✅ Created: ${t3.title} [FINISHED]`);

  console.log("\n🎉 Done! Tournaments created:");
  console.log(`   REGISTRATION → /tourments/${t1.id}`);
  console.log(`   RUNNING      → /tourments/${t2.id}`);
  console.log(`   FINISHED     → /tourments/${t3.id}`);
  console.log("\n   View all: http://localhost:5173/tourments");
}

main()
  .catch((e) => {
    console.error("❌", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
