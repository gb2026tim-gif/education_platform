import { error, fail, redirect } from "@sveltejs/kit";
import { prisma } from "$lib/server/db";

export const load = async ({ locals }: { locals: App.Locals }) => {
  if (!locals.user || locals.user.role !== "ADMIN") throw redirect(302, "/");
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { modules: true, enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Якщо в тебе ще немає таблиці CertificateTemplate, повертаємо порожній масив, щоб не було 500
    const certTemplates =
      (await prisma.certificateTemplate?.findMany().catch(() => [])) || [];

    return { courses, certTemplates };
  } catch (err) {
    console.error("Помилка завантаження курсів:", err);
    throw error(500, "Internal Server Error: Перевір підключення до БД");
  }
};

export const actions = {
  create: async ({
    request,
    locals,
  }: {
    request: Request;
    locals: App.Locals;
  }) => {
    if (!locals.user || locals.user.role !== "ADMIN") {
      return fail(403, { message: "Доступ заборонено" });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = (formData.get("category") as string) || "Programming";
    const lessonsRaw = formData.get("lessons");
    let lessonsData: Array<{
      title?: string;
      videoUrl?: string;
      summary?: string;
      testUrl?: string;
    }> = [];
    try {
      lessonsData = lessonsRaw ? JSON.parse(lessonsRaw as string) : [];
    } catch {
      lessonsData = [];
    }

    try {
      await prisma.course.create({
        data: {
          title,
          description,
          category,
          status: (formData.get("status") as string) || "DRAFT",
          author: { connect: { id: locals.user.id } },
          modules: {
            create: lessonsData.map((l, i) => ({
              title: l.title || `Модуль ${i + 1}`,
              order: i,
              lessons: {
                create: [
                  {
                    title: l.title || `Урок ${i + 1}`,
                    videoUrl: l.videoUrl || null,
                    content: l.summary || "",
                    summary: l.summary || null,
                    testUrl: l.testUrl || null,
                    order: 0,
                  },
                ],
              },
            })),
          },
        },
      });
      return { success: true };
    } catch (err) {
      console.error(err);
      return fail(500, { message: "Не вдалося створити курс" });
    }
  },
};
