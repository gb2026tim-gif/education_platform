// prisma/seed-tournaments.ts
// Run: npx tsx prisma/seed-tournaments.ts
// Creates test tournaments and (for one of them) 8 test teams with mixed verification status.

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function ensureCaptain(email: string, name: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;
  return prisma.user.create({
    data: {
      email,
      name,
      role: "TEAM",
      emailVerified: true,
      mustChangePassword: false,
    },
  });
}

async function main() {
  console.log("🏆 Seeding tournaments...\n");

  // 1) Find or create admin
  let admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.log("ℹ️  No admin found; creating fallback admin@sfl.org.ua…");
    admin = await prisma.user.create({
      data: {
        email: "admin@sfl.org.ua",
        name: "Адмін SFL",
        role: "ADMIN",
        emailVerified: true,
        mustChangePassword: false,
      },
    });
  }
  console.log(`✅ Admin: ${admin.name} <${admin.email}>`);

  // 2) Wipe old test tournaments (cascades to teams, tasks, members)
  await prisma.tournament.deleteMany({
    where: {
      title: {
        in: ["CODE4FUTURE 2026", "Hackathon Spring 2025", "WebDev Cup 2024"],
      },
    },
  });

  // 3) CODE4FUTURE 2026 — REGISTRATION (the live tournament shown in mockup 1)
  const t1 = await prisma.tournament.create({
    data: {
      title: "CODE4FUTURE 2026",
      description:
        "Командний хакатон для школярів та студентів, де учасники за обмежений час розробляють повноцінний веб-застосунок. Завдання буде опубліковано в день старту. Оцінювання проводиться журі по технічним та функціональним критеріям. Команди-переможці отримують сертифікати та призи від партнерів.",
      status: "REGISTRATION",
      format: "Командний",
      rounds: 1,
      regStart: new Date("2026-04-24"),
      regEnd: new Date("2026-05-25"),
      startAt: new Date("2026-05-26"),
      taskDeadline: new Date("2026-06-10"),
      minTeamSize: 2,
      maxTeamSize: 5,
      maxTeams: 30,
      backendReq: "Node.js / Python / PHP (на вибір)",
      frontendReq: "Будь-який фреймворк",
      databaseReq: "PostgreSQL або MongoDB",
      deployReq: "Обов'язково",
      adminId: admin.id,
    },
  });
  console.log(`✅ Created: ${t1.title} [REGISTRATION]`);

  // 4) Test captains
  const captainsData = [
    { email: "ivan.shevchenko@gr.example", name: "Іван Шевченко" },
    { email: "ankur.warikoo@gr.example", name: "Ankur Warikoo" },
    { email: "jodi.picoult@gr.example", name: "Jodi Picoult" },
    { email: "james.clear@gr.example", name: "James Clear" },
    { email: "frank.herbert@gr.example", name: "Frank Herbert" },
    { email: "kateryna.babkina@gr.example", name: "Катерина Бабкіна" },
    { email: "andriy.kurkov@gr.example", name: "Андрій Курков" },
    { email: "marija.matios@gr.example", name: "Марія Матіос" },
  ];
  const captains: { id: string; email: string }[] = [];
  for (const c of captainsData)
    captains.push(await ensureCaptain(c.email, c.name));

  // 5) 8 teams with mixed verification
  const teamSpecs = [
    {
      name: "Gb",
      city: "Київ",
      verified: true,
      captainIdx: 0,
      members: [
        { name: "Олег Петренко", email: "oleg@example.com" },
        { name: "Анна Грищенко", email: "anna@example.com" },
        { name: "Дмитро Левченко", email: "dmytro@example.com" },
      ],
    },
    {
      name: "DevFusion",
      city: "Львів",
      verified: false,
      captainIdx: 1,
      members: [
        { name: "Sahil Bloom", email: "sahil@example.com" },
        { name: "Naval Ravikant", email: "naval@example.com" },
      ],
    },
    {
      name: "ByteCrafters",
      city: "Одеса",
      verified: true,
      captainIdx: 2,
      members: [
        { name: "Sarah Doe", email: "sarah@example.com" },
        { name: "Mike Ross", email: "mike@example.com" },
        { name: "Emily Stone", email: "emily@example.com" },
      ],
    },
    {
      name: "Pixel Pirates",
      city: "Харків",
      verified: false,
      captainIdx: 3,
      members: [
        { name: "Atomic Hab", email: "atomic@example.com" },
        { name: "Tiny Changes", email: "tinychange@example.com" },
      ],
    },
    {
      name: "Logic Lions",
      city: "Дніпро",
      verified: false,
      captainIdx: 4,
      members: [
        { name: "Paul Atreides", email: "paul@example.com" },
        { name: "Duncan Idaho", email: "duncan@example.com" },
        { name: "Lady Jessica", email: "jessica@example.com" },
      ],
    },
    {
      name: "Code Cossacks",
      city: "Запоріжжя",
      verified: true,
      captainIdx: 5,
      members: [
        { name: "Іван Сірко", email: "sirko@example.com" },
        { name: "Тарас Бульба", email: "bulba@example.com" },
      ],
    },
    {
      name: "Algorithm Allies",
      city: "Полтава",
      verified: false,
      captainIdx: 6,
      members: [
        { name: "Юрій Винничук", email: "vynnychuk@example.com" },
        { name: "Сергій Жадан", email: "zhadan@example.com" },
      ],
    },
    {
      name: "Quantum Queens",
      city: "Чернівці",
      verified: false,
      captainIdx: 7,
      members: [
        { name: "Оксана Забужко", email: "zabuzhko@example.com" },
        { name: "Ліна Костенко", email: "kostenko@example.com" },
        { name: "Софія Андрухович", email: "andrukhovych@example.com" },
        { name: "Ірена Карпа", email: "karpa@example.com" },
      ],
    },
  ];

  for (const ts of teamSpecs) {
    const cap = captains[ts.captainIdx];
    if (!cap) continue;
    await prisma.team.create({
      data: {
        name: ts.name,
        city: ts.city,
        verified: ts.verified,
        status: ts.verified ? "APPROVED" : "PENDING",
        captainId: cap.id,
        tournamentId: t1.id,
        members: { create: ts.members },
      },
    });
  }
  console.log(`✅ Created 8 test teams (3 verified, 5 pending)`);

  // 6) Hackathon Spring 2025 — RUNNING
  const t2 = await prisma.tournament.create({
    data: {
      title: "Hackathon Spring 2025",
      description:
        "Командний хакатон для веб-розробників. Завдання — розробити повнофункціональний застосунок за 48 годин.",
      status: "RUNNING",
      format: "Командний",
      rounds: 1,
      regStart: new Date("2025-03-01"),
      regEnd: new Date("2025-04-01"),
      startAt: new Date("2025-04-02"),
      taskDeadline: new Date("2025-04-10"),
      minTeamSize: 2,
      maxTeamSize: 4,
      maxTeams: 16,
      adminId: admin.id,
    },
  });
  console.log(`✅ Created: ${t2.title} [RUNNING]`);

  // 7) WebDev Cup 2024 — FINISHED
  const t3 = await prisma.tournament.create({
    data: {
      title: "WebDev Cup 2024",
      description:
        "Завершений турнір з веб-розробки. Переможці нагороджені сертифікатами та призами.",
      status: "FINISHED",
      format: "Командний",
      rounds: 1,
      regStart: new Date("2024-09-01"),
      regEnd: new Date("2024-10-01"),
      startAt: new Date("2024-10-02"),
      taskDeadline: new Date("2024-11-01"),
      minTeamSize: 2,
      maxTeamSize: 5,
      maxTeams: 16,
      adminId: admin.id,
    },
  });
  console.log(`✅ Created: ${t3.title} [FINISHED]`);

  console.log("\n🎉 Done! Open admin to manage:");
  console.log(`   REGISTRATION → /admin/tournaments/${t1.id}`);
  console.log(`   RUNNING      → /admin/tournaments/${t2.id}`);
  console.log(`   FINISHED     → /admin/tournaments/${t3.id}`);
  console.log("\n   List view: http://localhost:5173/admin/tournaments");
}

main()
  .catch((e) => {
    console.error("❌", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
