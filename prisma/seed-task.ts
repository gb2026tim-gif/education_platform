// prisma/seed-task.ts
// Запуск: npx tsx prisma/seed-task.ts
// Додає реальні дані до існуючого турніру CODE4FUTURE 2026

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Знаходимо турнір
  const tournament = await prisma.tournament.findFirst({
    where: { title: { contains: "CODE4FUTURE" } },
    include: { tasks: true },
  });

  if (!tournament) {
    console.error("❌ Турнір CODE4FUTURE не знайдено.");
    console.error(
      "   Спочатку запусти: npx tsx prisma/seed-delta.ts (щоб створити турнір)"
    );
    process.exit(1);
  }

  console.log(`✅ Турнір знайдено: ${tournament.title} [${tournament.id}]`);

  // Оновлюємо статус турніру на RUNNING якщо потрібно
  if (tournament.status !== "RUNNING") {
    await prisma.tournament.update({
      where: { id: tournament.id },
      data: { status: "RUNNING" },
    });
    console.log("   Статус турніру → RUNNING");
  }

  // Видаляємо старе завдання якщо є
  if (tournament.tasks.length > 0) {
    await prisma.submission.deleteMany({
      where: { task: { tournamentId: tournament.id } },
    });
    await prisma.task.deleteMany({
      where: { tournamentId: tournament.id },
    });
    console.log("   Старе завдання видалено");
  }

  // Створюємо завдання
  const task = await prisma.task.create({
    data: {
      title: "Веб-платформа CODE4FUTURE",
      description:
        "Мета — створити веб-платформу, яка дозволяє організаторам проводити турніри (раунди із завданнями), командам — реєструватись та здавати результати, а журі — оцінювати роботи за визначеними критеріями з подальшим формуванням таблиці лідерів.\n\nОцінка проєкту буде проводитись за такими критеріями:\n• Функціональність, стабільність та коректність роботи платформи;\n• Якість коду: чистота, використання паттернів та ООП;\n• Командна робота та виконання дедлайнів;\n• Якість документації та покриття тестами;\n• UI/UX та адаптивність інтерфейсу.",
      requirements: [
        "Авторизація та реєстрація (ролі: Адмін, Команда, Журі)",
        "Адміністратор (Admin) — створює та керує турнірами, завданнями, переглядає результати",
        "Команда (Team) — реєструє команду, подає рішення, переглядає таблицю результатів",
        "Журі (Jury) — оцінює роботи команд, виставляє бали та коментарі",
        "Сторінка турніру: назва, опис, дати, статус (Draft/Registration/Running/Finished)",
        "Список команд (з можливим приєднанням до завершення реєстрації — опціонально)",
        "Реєстрація команди: назва, місто, контакт, запрошення учасників",
        "Форма подачі результатів: GitHub URL, відео-демо, Live demo, опис",
        "Таблиця лідерів після оцінювання",
        "Адаптивний інтерфейс (desktop + mobile)",
      ],
      techStack:
        "Backend: SvelteKit, архітектура серверних роутів\nFrontend: Svelte 5 + Tailwind CSS або CSS Variables\nDatabase: PostgreSQL + Prisma ORM\nAuth: Better Auth або власна JWT-авторизація",
      startAt: new Date("2026-04-01"),
      deadline: new Date("2026-05-15T23:59:00"),
      status: "ACTIVE",
      tournamentId: tournament.id,
    },
  });

  console.log(`✅ Завдання створено: "${task.title}" [${task.id}]`);
  console.log(`   Дедлайн: ${task.deadline.toLocaleDateString("uk-UA")}`);

  // Знаходимо команду Делта
  const team = await prisma.team.findFirst({
    where: { name: "Делта", tournamentId: tournament.id },
  });

  if (team) {
    // Видаляємо старий сабміт якщо є
    await prisma.submission.deleteMany({
      where: { teamId: team.id, taskId: task.id },
    });

    // Створюємо сабміт з частковими даними (для демо)
    await prisma.submission.create({
      data: {
        githubUrl: "https://github.com/gb2026tim-gif/education_platform",
        videoUrl: "https://youtu.be/dOwkw9WgXcQ",
        demoUrl: "",
        description: "",
        taskId: task.id,
        teamId: team.id,
      },
    });

    console.log(`✅ Сабміт для команди "${team.name}" створено`);
  } else {
    console.log(
      "ℹ️  Команда Делта не знайдена — сабміт не створено (не критично)"
    );
  }

  console.log("\n🎉 Готово! Тепер:");
  console.log(`   Завдання: /tourments/${tournament.id}/task`);
  console.log(`   Сабміт:   /tourments/${tournament.id}/submit`);
}

main()
  .catch((e) => {
    console.error("❌ Помилка:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
