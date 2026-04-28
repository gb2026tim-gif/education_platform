// prisma/seed-task.ts — запуск: npx tsx prisma/seed-task.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const tournament = await prisma.tournament.findFirst({
        where: { title: { contains: "CODE4FUTURE" } },
        include: { tasks: true },
    });

    if (!tournament) {
        console.error("❌ Турнір CODE4FUTURE не знайдено.");
        process.exit(1);
    }
    console.log(`✅ Турнір: ${tournament.title}`);

    await prisma.tournament.update({
        where: { id: tournament.id },
        data: { status: "RUNNING" },
    });

    // Очищаємо старі задачі
    for (const t of tournament.tasks) {
        await prisma.submission.deleteMany({ where: { taskId: t.id } });
    }
    await prisma.task.deleteMany({ where: { tournamentId: tournament.id } });

    const task = await prisma.task.create({
        data: {
            title: "Веб-платформа CODE4FUTURE",

            // Повний опис як на макеті
            description: `Мета — створити веб-платформу, яка дозволяє організаторам проводити турніри (раунди із завданнями), командам — реєструватись та здавати результати, а журі — оцінювати роботи за визначеними критеріями з подальшим формуванням таблиці лідерів.

Оцінка проєкту буде проводитись за такими критеріями:
• Функціональність, стабільність та коректність роботи платформи.
• Якість коду: чистота, використання паттернів та ООП.
• Командна робота та виконання дедлайнів.
• Якість документації та покриття тестами.
• UI/UX та адаптивність інтерфейсу.`,

            // Технологічний стек
            techStack: [
                "Backend: SvelteKit, архітектура серверних роутів",
                "Frontend: Svelte 5 + Tailwind CSS або CSS Variables",
                "Database: PostgreSQL + Prisma ORM",
                "Auth: Better Auth або власна JWT-авторизація",
                "Деплой: Vercel / Railway або будь-який фреймворк",
            ].join("\n"),

            // Функціональні вимоги — повний список як на макеті
            requirements: [
                "Ролі користувачів — система повинна підтримувати 3 типи користувачів: Адміністратор (Admin) — створює та керує турнірами/завданнями, переглядає результати; Учасник/Команда (Team) — реєструє команду, подає рішення, переглядає таблицю результатів; Журі (Jury) — отримує роботи на оцінювання, виставляє бали та коментарі. Опціональна роль Організатор (Організатор) — він же Адмін або окрема роль — потрібно буде розглянути далі.",

                "Турніри (Tournaments) — Створення турніру (Admin): Назва турніру; Опис / правила; Дата старту турніру (не обов'язково — старт реєстрації); Вікно реєстрації команди: дата/час початку та дата/час завершення; Максимальна кількість команд (опціонально); Формат: один раунд або кілька раундів (мінімально — 1 раунд). Сторінка турніру: Публічна інформація (назва, опис, статус); Статус турніру: Draft / Registration / Running / Finished; Список команд (можливо приховати до завершення реєстрації — опціонально).",

                "Реєстрація команди — командний профіль: назва, місто, контакт; Капітан створює команду та запрошує учасників (через email); Підтвердження участі кожним учасником; Обмеження: одна команда на один турнір на одного учасника.",

                "Система подачі результатів (Submission) — поля: GitHub URL (обов'язково, має бути публічним), відео-демо (YouTube або Google Drive, тривалість 3–5 хвилин), Live demo посилання (опціонально, дає додаткові бали), текстовий опис рішення. Дедлайн: після дедлайну форма блокується. Один сабміт на команду з можливістю редагування до дедлайну.",

                "Панель журі — журі отримує список команд для оцінювання; оцінка за 6 критеріями: backendQuality, databaseQuality, frontendQuality, functionality, stability, usability (кожен від 0 до 10); поле для коментаря; підрахунок загального балу (total) автоматично як середнє; один журі — одна оцінка на команду.",

                "Таблиця лідерів — відображення результатів після завершення оцінювання; сортування за загальним балом (total); публічна сторінка з можливістю фільтрації.",

                "Адаптивний UI — усі ключові сторінки (турнір, команда, завдання, сабміт, лідерборд) коректно відображаються на desktop та mobile пристроях.",

                "Розгортання на хостингу — публічний URL для перевірки журі; Vercel, Railway або Render; README з інструкцією запуску локально та деплою.",
            ],

            startAt: new Date("2026-04-01"),
            deadline: new Date("2026-05-15T23:59:00"),
            status: "ACTIVE",
            tournamentId: tournament.id,
        },
    });

    console.log(`✅ Завдання: "${task.title}"`);
    console.log(`   Дедлайн: ${task.deadline.toLocaleDateString("uk-UA")}`);

    // Сабміт для першої команди
    const team = await prisma.team.findFirst({
        where: { tournamentId: tournament.id },
        orderBy: { createdAt: "asc" },
    });

    if (team) {
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
    }

    console.log(`\n🎉 Посилання:`);
    console.log(`   /tourments/${tournament.id}/task`);
    console.log(`   /tourments/${tournament.id}/submit`);
}

main()
    .catch((e) => {
        console.error("❌", e.message);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());