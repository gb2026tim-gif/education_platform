import { prisma } from "$lib/server/db";
import { error, fail } from "@sveltejs/kit";

export const load = async ({ params }) => {
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) throw error(404, "Курс не знайдено");
  return { course };
};

export const actions = {
  updateCourse: async ({ request, params }) => {
    const data = await request.formData();

    try {
      await prisma.course.update({
        where: { id: params.id },
        data: {
          title: data.get("title") as string,
          shortDesc: data.get("shortDesc") as string,
          description: data.get("description") as string,
          level: data.get("level") as string,
          price: Number(data.get("price")),
          published: data.get("published") === "true",
        },
      });
      return { success: true };
    } catch (err) {
      return fail(500, { message: "Не вдалося зберегти зміни" });
    }
  },
};
