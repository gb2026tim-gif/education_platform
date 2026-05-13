import { prisma } from '$lib/server/db';
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  try {
    // Додаємо перевірку: чи існує взагалі prisma
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    // Отримуємо дані. Якщо count() видає помилку, повертаємо 0
    const tournaments = await prisma.tournament?.findMany({
      orderBy: { createdAt: 'desc' }
    }) || [];

    const juryCount = await prisma.user?.count({
      where: { role: 'JURY' }
    }).catch(() => 0) || 0;

    const coursesCount = await prisma.course?.count().catch(() => 0) || 0;

    return {
      tournaments,
      stats: {
        tournaments: tournaments.length,
        jury: juryCount,
        courses: coursesCount
      }
    };
  } catch (error) {
    console.error("--- КРИТИЧНА ПОМИЛКА БАЗИ ---");
    console.error(error);
    return {
      tournaments: [],
      stats: { tournaments: 0, jury: 0, courses: 0 }
    };
  }
};