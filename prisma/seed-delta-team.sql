// prisma/seed-delta.ts
// Запуск: npx tsx prisma/seed-delta.ts
// Замін YOUR_EMAIL нижче на свій реальний email (той з яким ти логінишся)

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MY_EMAIL = 'sofia.zaharchuk12@gmail.com';

async function main() {
  console.log('🔍 Шукаю користувача...');

  const sofia = await prisma.user.findUnique({ where: { email: MY_EMAIL } });
  if (!sofia) {
    console.error(`❌ Користувача з email "${MY_EMAIL}" не знайдено!`);
    console.error('   Переконайся що ти залогінена і правильно вказала email.');
    process.exit(1);
}
  console.log(`✅ Знайдено: ${sofia.name} (${sofia.email})`);

// ── Видаляємо старі тестові дані якщо є ──────────────────────
  await prisma.submission.deleteMany({
    where: { team: { name: 'Делта', captainId: sofia.id } }
  });
  await prisma.teamMember.deleteMany({
    where: { team: { name: 'Делта', captainId: sofia.id } }
  });
  await prisma.team.deleteMany({
    where: { name: 'Делта', captainId: sofia.id }
  });

// ── Турнір ───────────────────────────────────────────────────
  console.log('🏆 Створюю турнір CODE4FUTURE 2026...');
  let tournament = await prisma.tournament.findFirst({
    where: { title: 'CODE4FUTURE 2026' }
  });

  if (!tournament) {
    tournament = await prisma.tournament.create({
      data: {
        title: 'CODE4FUTURE 2026',
        description: 'Щорічний турнір з веб-розробки та програмування для студентів і молодих спеціалістів',
        status: 'RUNNING',
        regStart: new Date('2026-03-01'),
        regEnd: new Date('2026-03-31'),
        maxTeams: 50,
        adminId: sofia.id,
      },
    });
    console.log(`   Турнір створено: ${tournament.id}`);
} else {
    // Оновлюємо статус на RUNNING щоб все працювало
    tournament = await prisma.tournament.update({
      where: { id: tournament.id },
      data: { status: 'RUNNING' },
    });
    console.log(`   Турнір вже є, оновлено статус → RUNNING`);
}

  // ── Команда Делта ─────────────────────────────────────────────
  console.log('👥 Створюю команду Делта...');
  const team = await prisma.team.create({
    data: {
      name: 'Делта',
      city: 'Луцьк',
      contact: '@delta_team',
      status: 'APPROVED',
      captainId: sofia.id,
      tournamentId: tournament.id,
      members: {
        create: [
          { name: 'Анна Коваль',    email: 'anna.koval@example.com'    },
          { name: 'Богдан Мельник', email: 'bohdan.melnyk@example.com' },
          { name: 'Юлія Петренко',  email: 'yulia.petrenko@example.com' },
        ],
      },
    },
  });
  console.log(`   Команда створена: ${team.id}`);

// ── Завдання з дедлайном ──────────────────────────────────────
  console.log('📝 Створюю завдання...');
  let task = await prisma.task.findFirst({
    where: { tournamentId: tournament.id }
  });

  if (!task) {
    task = await prisma.task.create({
      data: {
        title: 'Веб-платформа CODE4FUTURE',
        description:
          'Розробити повнофункціональну веб-платформу для проведення турнірів. ' +
          'Платформа має підтримувати реєстрацію команд, систему завдань та оцінювання.',
        requirements: [
          'Авторизація та реєстрація (ролі: Команда, Журі, Адмін)',
          'Управління командами: створення, запрошення учасників',
          'Система подачі робіт (GitHub URL, відео-демо, Live demo)',
          'Панель журі з оцінкою за 6 критеріями',
          'Адаптивний UI (desktop + mobile)',
          'Розгортання на хостингу (Vercel / Railway / інше)',
        ],
        techStack: 'SvelteKit · TypeScript · PostgreSQL · Tailwind CSS · Prisma',
        startAt: new Date('2026-04-01'),
        deadline: new Date('2026-05-15T23:59:00'),   // ← дедлайн 15 травня
        status: 'ACTIVE',
        tournamentId: tournament.id,
      },
    });
    console.log(`   Завдання створено: ${task.id}`);
    console.log(`   Дедлайн: ${task.deadline.toLocaleDateString('uk-UA')}`);
} else {
    console.log(`   Завдання вже є: ${task.title}`);
}

  // ── Сабміт (частково заповнений) ─────────────────────────────
  console.log('📤 Створюю сабміт...');
  const existing = await prisma.submission.findFirst({
    where: { teamId: team.id, taskId: task.id }
  });

  if (!existing) {
    await prisma.submission.create({
      data: {
        githubUrl: 'https://github.com/gb2026tim-gif/education_platform',
        videoUrl: '',
        demoUrl: '',
        description: 'Платформа управління турнірами на SvelteKit + PostgreSQL',
        taskId: task.id,
        teamId: team.id,
      },
    });
    console.log('   Сабміт створено з GitHub URL');
} else {
    console.log('   Сабміт вже є');
}

  // ── Підсумок ──────────────────────────────────────────────────
  console.log('\n✅ Готово! Тепер:');
  console.log('   1. Перейди на /my-teams');
  console.log('   2. Побачиш команду "Делта"');
  console.log('   3. Натисни "Переглянути" — побачиш дедлайн 15 травня і GitHub');
  console.log(`\n   Team ID: ${team.id}`);
  console.log(`   Turney URL: /my-teams/${team.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Помилка:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
