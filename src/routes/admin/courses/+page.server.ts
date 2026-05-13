import { error, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma'; // Переконайся, що шлях правильний

export const load = async () => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true, enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Якщо в тебе ще немає таблиці CertificateTemplate, повертаємо порожній масив, щоб не було 500
    const certTemplates = await prisma.certificateTemplate?.findMany().catch(() => []) || [];

    return { courses, certTemplates };
  } catch (err) {
    console.error("Помилка завантаження курсів:", err);
    throw error(500, "Internal Server Error: Перевір підключення до БД");
  }
};

export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const lessonsData = JSON.parse(formData.get('lessons') as string);

    try {
      const course = await prisma.course.create({
        data: {
          title,
          description,
          category,
          status: formData.get('status') as string || 'DRAFT',
          modules: {
            create: lessonsData.map((l: any) => ({
              title: l.title,
              videoUrl: l.videoUrl,
              content: l.summary, // Переконайся, що в схемі Prisma це поле так називається
              testUrl: l.testUrl
            }))
          }
        }
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Не вдалося створити курс" });
    }
  }
};