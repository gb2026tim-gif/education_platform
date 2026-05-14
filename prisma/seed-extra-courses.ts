// prisma/seed-extra-courses.ts — додаткові курси до 12
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

const SQL = "https://www.youtube.com/embed/qw--VYLpxG4";
const TS = "https://www.youtube.com/embed/W6NZfCO5SIk";
const SVK = "https://www.youtube.com/embed/eIrMbAQSU34";
const DOC = "https://www.youtube.com/embed/nu_pCVPKzTk";
const CSS = "https://www.youtube.com/embed/1Rs2ND1ryYc";
const REA = "https://www.youtube.com/embed/Ke90Tje7VS0";
const NOD = "https://www.youtube.com/embed/fBNz5xF-Kx4";
const FIG = "https://www.youtube.com/embed/FTFaQWZBqQ8";
const LIN = "https://www.youtube.com/embed/sWbUDq4S6Y8";

async function mkCourse(admin: any, data: any, modules: any[]) {
  const c = await prisma.course.create({
    data: { ...data, authorId: admin.id },
  });
  for (const m of modules) {
    const mod = await prisma.module.create({
      data: {
        title: m.title,
        description: m.desc ?? null,
        order: m.order,
        courseId: c.id,
      },
    });
    await prisma.lesson.createMany({
      data: m.lessons.map((l: any) => ({ ...l, moduleId: mod.id })),
    });
  }
  const total = modules.reduce((a: number, m: any) => a + m.lessons.length, 0);
  console.log(`✅ ${c.title} — ${modules.length} модулів, ${total} уроків`);
  return c;
}

function mod5(title: string, order: number, video: string, topic: string) {
  return {
    title,
    order,
    lessons: [
      {
        title: `${topic}: Вступ`,
        videoUrl: video,
        duration: 15,
        order: 1,
        isFree: order === 1,
        content: `# ${topic}\n\nОсновні концепції та огляд модуля.`,
      },
      {
        title: `${topic}: Практика`,
        videoUrl: video,
        duration: 20,
        order: 2,
        isFree: false,
        content: `## Практичне завдання\n\nВиконай вправи до теми ${topic}.`,
      },
      {
        title: `${topic}: Поглиблено`,
        videoUrl: video,
        duration: 25,
        order: 3,
        isFree: false,
        content: `## Поглиблене вивчення\n\nРозширені можливості ${topic}.`,
      },
      {
        title: `${topic}: Проєкт`,
        videoUrl: video,
        duration: 30,
        order: 4,
        isFree: false,
        content: `## Міні-проєкт\n\nСтворюємо реальний приклад з ${topic}.`,
      },
      {
        title: `🧪 Тест + 📄 Конспект: ${topic}`,
        videoUrl: video,
        duration: 10,
        order: 5,
        isFree: false,
        content: `## Тест\n\n**1. Основне питання з ${topic}?**\n- a) Варіант А ✅\n- b) Варіант Б\n- c) Варіант В\n- d) Варіант Г\n\n---\n# Конспект: ${topic}\n\nКлючові поняття та команди модуля.\n\n[📥 ЗАВАНТАЖИТИ КОНСПЕКТ](/api/courses/summary.pdf)`,
      },
    ],
  };
}

async function main() {
  console.log("📚 Додаємо курси...\n");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.error("❌ No ADMIN");
    process.exit(1);
  }

  // const existing = await (prisma as any).course.count();
  // console.log(`Існуючих курсів: ${existing}`);

  const courses = [
    {
      data: {
        title: "SQL та PostgreSQL",
        shortDesc: "Від SELECT до складних JOIN та індексів",
        description:
          "Вивчи SQL від основ до оптимізації запитів. DDL, DML, JOIN, підзапити, транзакції, індекси та PostgreSQL специфіка.",
        coverUrl:
          "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80",
        price: 0,
        isFree: true,
        level: "BEGINNER",
        category: "Databases",
        duration: 400,
        published: true,
      },
      modules: [
        mod5("Основи SQL", 1, SQL, "SELECT та фільтрація"),
        mod5("JOIN та підзапити", 2, SQL, "JOIN операції"),
        mod5("DDL: Таблиці та схеми", 3, SQL, "CREATE TABLE"),
        mod5("Функції та агрегація", 4, SQL, "GROUP BY"),
        mod5("Індекси та оптимізація", 5, SQL, "EXPLAIN ANALYZE"),
      ],
    },
    {
      data: {
        title: "TypeScript: Повний курс",
        shortDesc: "Типізований JavaScript для серйозних проєктів",
        description:
          "TypeScript від базових типів до generics та декораторів. Інтеграція з React та Node.js.",
        coverUrl:
          "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80",
        price: 499,
        isFree: false,
        level: "INTERMEDIATE",
        category: "Programming",
        duration: 420,
        published: true,
      },
      modules: [
        mod5("Базові типи", 1, TS, "string, number, boolean"),
        mod5("Інтерфейси та типи", 2, TS, "Interface vs Type"),
        mod5("Generics", 3, TS, "Generic функції"),
        mod5("Декоратори", 4, TS, "Class decorators"),
        mod5("TS + React", 5, TS, "TypeScript з React"),
      ],
    },
    {
      data: {
        title: "SvelteKit: Fullstack розробка",
        shortDesc: "Сучасний fullstack з SvelteKit та Prisma",
        description:
          "Поглиблений курс зі створення production-ready застосунків на SvelteKit 5. Runes, routing, server actions, Prisma ORM та деплой.",
        coverUrl:
          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
        price: 899,
        isFree: false,
        level: "ADVANCED",
        category: "Web Development",
        duration: 840,
        published: true,
      },
      modules: [
        mod5("Svelte 5 Runes", 1, SVK, "$state та $derived"),
        mod5("Routing та Layout", 2, SVK, "file-based routing"),
        mod5("Server Actions", 3, SVK, "form actions"),
        mod5("Prisma ORM", 4, SVK, "схема та міграції"),
        mod5("Деплой та CI/CD", 5, SVK, "Railway та Vercel"),
      ],
    },
    {
      data: {
        title: "Docker та Контейнеризація",
        shortDesc: "Пакуй застосунки та деплой без болю",
        description:
          "Docker від основ до production. Dockerfile, docker-compose, мережі, volumes та деплой на VPS.",
        coverUrl:
          "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
        price: 399,
        isFree: false,
        level: "INTERMEDIATE",
        category: "DevOps",
        duration: 300,
        published: true,
      },
      modules: [
        mod5("Основи Docker", 1, DOC, "images та containers"),
        mod5("Dockerfile", 2, DOC, "побудова образів"),
        mod5("docker-compose", 3, DOC, "multi-container"),
        mod5("Мережі та volumes", 4, DOC, "networking"),
        mod5("Деплой на VPS", 5, DOC, "production deploy"),
      ],
    },
    {
      data: {
        title: "CSS та Tailwind Mastery",
        shortDesc: "Від базового CSS до складних анімацій",
        description:
          "CSS від основ до Tailwind. Flexbox, Grid, анімації, CSS змінні та адаптивний дизайн.",
        coverUrl:
          "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
        price: 0,
        isFree: true,
        level: "BEGINNER",
        category: "Web Development",
        duration: 300,
        published: true,
      },
      modules: [
        mod5("CSS основи", 1, CSS, "селектори та каскад"),
        mod5("Flexbox", 2, CSS, "flex контейнер"),
        mod5("CSS Grid", 3, CSS, "grid layout"),
        mod5("Анімації", 4, CSS, "transition та animation"),
        mod5("Tailwind CSS", 5, CSS, "utility-first CSS"),
      ],
    },
    {
      data: {
        title: "React: Сучасна розробка",
        shortDesc: "Хуки, стан, роутинг та Redux Toolkit",
        description:
          "React від основ до просунутих патернів. Hooks, Context, Router та Redux Toolkit.",
        coverUrl:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
        price: 699,
        isFree: false,
        level: "INTERMEDIATE",
        category: "Web Development",
        duration: 720,
        published: true,
      },
      modules: [
        mod5("Основи React", 1, REA, "компоненти та JSX"),
        mod5("Хуки: useState useEffect", 2, REA, "React hooks"),
        mod5("Context API", 3, REA, "глобальний стан"),
        mod5("React Router", 4, REA, "client-side routing"),
        mod5("Redux Toolkit", 5, REA, "state management"),
      ],
    },
    {
      data: {
        title: "Node.js та Express API",
        shortDesc: "Створи REST API з нуля на Node.js",
        description:
          "Backend розробка на Node.js. Express, JWT, Prisma, валідація та деплой.",
        coverUrl:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
        price: 599,
        isFree: false,
        level: "INTERMEDIATE",
        category: "Backend",
        duration: 480,
        published: true,
      },
      modules: [
        mod5("Node.js основи", 1, NOD, "модулі та npm"),
        mod5("Express.js", 2, NOD, "routes та middleware"),
        mod5("JWT автентифікація", 3, NOD, "токени та сесії"),
        mod5("Prisma та PostgreSQL", 4, NOD, "ORM та міграції"),
        mod5("REST API best practices", 5, NOD, "документація та тести"),
      ],
    },
    {
      data: {
        title: "UI/UX Дизайн в Figma",
        shortDesc: "Figma, прототипи та дизайн-система",
        description:
          "Проєктування інтерфейсів у Figma. Компоненти, автолейаут, прототипи та handoff.",
        coverUrl:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
        price: 449,
        isFree: false,
        level: "BEGINNER",
        category: "Design",
        duration: 360,
        published: true,
      },
      modules: [
        mod5("Основи Figma", 1, FIG, "інтерфейс та інструменти"),
        mod5("Компоненти", 2, FIG, "variants та instances"),
        mod5("Auto Layout", 3, FIG, "адаптивні компоненти"),
        mod5("Прототипування", 4, FIG, "interactions"),
        mod5("Дизайн-система", 5, FIG, "токени та бібліотека"),
      ],
    },
    {
      data: {
        title: "Алгоритми та структури даних",
        shortDesc: "Підготовка до технічних співбесід",
        description:
          "Масиви, стеки, черги, дерева, графи, сортування. Розв'язуємо задачі LeetCode разом.",
        coverUrl:
          "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
        price: 799,
        isFree: false,
        level: "ADVANCED",
        category: "Programming",
        duration: 600,
        published: true,
      },
      modules: [
        mod5("Масиви та рядки", 1, LIN, "базові задачі"),
        mod5("Стеки та черги", 2, LIN, "LIFO та FIFO"),
        mod5("Дерева та графи", 3, LIN, "BFS та DFS"),
        mod5("Динамічне програмування", 4, LIN, "memoization"),
        mod5("Сортування та пошук", 5, LIN, "O(n log n)"),
      ],
    },
  ];

  for (const { data, modules } of courses) {
    await mkCourse(admin, data, modules);
  }

  const total = await prisma.course.count();
  console.log(`\n🎉 Всього курсів: ${total}`);
  console.log("http://localhost:5173/learn");
}

main()
  .catch((e) => {
    console.error("❌", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
