import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🏆 Seeding leaderboard...\n");

  let tournament = await prisma.tournament.findFirst({
    where: { status: { in: ["RUNNING", "FINISHED"] } },
  });
  if (!tournament) tournament = await prisma.tournament.findFirst();
  if (!tournament) {
    console.error("No tournament");
    process.exit(1);
  }
  console.log(`Tournament: ${tournament.title}`);

  const jurors = await prisma.juror.findMany({ take: 3 });
  if (jurors.length === 0) {
    console.error("Run seed-jury.ts first");
    process.exit(1);
  }

  const teamsData = [
    {
      name: "Alpha Coders",
      city: "Київ",
      b: 90,
      d: 87,
      f: 92,
      bf: 94,
      df: 88,
      ff: 93,
    },
    {
      name: "ByteForce",
      city: "Львів",
      b: 83,
      d: 81,
      f: 86,
      bf: 85,
      df: 80,
      ff: 85,
    },
    {
      name: "DevStorm",
      city: "Харків",
      b: 76,
      d: 74,
      f: 79,
      bf: 77,
      df: 73,
      ff: 78,
    },
    {
      name: "CodeNinja",
      city: "Одеса",
      b: 70,
      d: 68,
      f: 73,
      bf: 71,
      df: 67,
      ff: 72,
    },
    {
      name: "PixelPirates",
      city: "Дніпро",
      b: 63,
      d: 61,
      f: 66,
      bf: 64,
      df: 60,
      ff: 65,
    },
    {
      name: "NullPointers",
      city: "Запоріжжя",
      b: 55,
      d: 53,
      f: 58,
      bf: 56,
      df: 52,
      ff: 57,
    },
  ];
  const noScore = [
    { name: "SyntaxSquad", city: "Вінниця" },
    { name: "RuntimeRebels", city: "Полтава" },
    { name: "LoopLegends", city: "Луцьк" },
  ];

  const users = await prisma.user.findMany();
  let capIdx = 0;

  async function getOrCreateTeam(name: string, city: string) {
    const existing = await prisma.team.findFirst({
      where: { name, tournamentId: tournament!.id },
    });
    if (existing) return existing;
    for (let i = 0; i < users.length; i++) {
      const u = users[(capIdx + i) % users.length];
      const busy = await prisma.team.findFirst({
        where: { captainId: u.id, tournamentId: tournament!.id },
      });
      if (!busy) {
        capIdx = (capIdx + i + 1) % users.length;
        return prisma.team.create({
          data: { name, city, tournamentId: tournament!.id, captainId: u.id },
        });
      }
    }
    return null;
  }

  for (const td of teamsData) {
    const team = await getOrCreateTeam(td.name, td.city);
    if (!team) {
      console.log(`⚠️ Skipped ${td.name}`);
      continue;
    }

    let work = await prisma.work.findFirst({
      where: { tournamentId: tournament.id, teamName: td.name },
    });
    if (!work) {
      work = await prisma.work.create({
        data: {
          teamName: td.name,
          tournamentId: tournament.id,
          githubUrl: `https://github.com/${td.name.toLowerCase().replace(/\s/g, "-")}/project`,
          description: `Проєкт команди ${td.name}`,
        },
      });
    }

    for (let j = 0; j < Math.min(2, jurors.length); j++) {
      const juror = jurors[j];
      let asgn = await prisma.assignment.findFirst({
        where: { jurorId: juror.id, workId: work.id },
      });
      if (!asgn) {
        asgn = await prisma.assignment.create({
          data: { jurorId: juror.id, workId: work.id, displayNumber: j + 1 },
        });
      }
      const v = Math.floor(Math.random() * 8) - 4;
      await prisma.evaluation.upsert({
        where: { assignmentId: asgn.id },
        update: {},
        create: {
          assignmentId: asgn.id,
          backendCode: Math.min(100, Math.max(0, td.b + v)),
          databaseStructure: Math.min(100, Math.max(0, td.d + v)),
          frontendCode: Math.min(100, Math.max(0, td.f + v)),
          backendFunctionality: Math.min(100, Math.max(0, td.bf + v)),
          databaseFunctionality: Math.min(100, Math.max(0, td.df + v)),
          frontendFunctionality: Math.min(100, Math.max(0, td.ff + v)),
          requirementsRest: true,
          requirementsDb: true,
          requirementsAuth: true,
          requirementsFrontend: true,
          requirementsDeploy: td.b > 70,
          comment: `Оцінка журі ${j + 1}`,
        },
      });
      await prisma.assignment.update({
        where: { id: asgn.id },
        data: { evaluated: true, evaluatedAt: new Date() },
      });
    }
    console.log(`✅ ${td.name} (${td.city})`);
  }

  for (const td of noScore) {
    const team = await getOrCreateTeam(td.name, td.city);
    if (team) console.log(`⏳ ${td.name} — без оцінок`);
  }

  console.log("\n🎉 Done! http://localhost:5173/leaderboard");
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
