// src/routes/admin/courses/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') redirect(302, '/');

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count:      { select: { modules: true, enrollments: true } },
      certTemplate: { select: { id: true, name: true } },
    },
  });

  const certTemplates = await prisma.certificateTemplate.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  return { courses, certTemplates };
};

const CourseSchema = z.object({
  title:         z.string().min(3, 'Назва занадто коротка'),
  description:   z.string().min(10, 'Опис занадто короткий'),
  category:      z.string().default('Програмування'),
  isPaid:        z.string().optional(),
  certTemplateId: z.string().optional(),
  modules:       z.string().optional(), // JSON: [{title}]
});

export const actions: Actions = {
  // Створити курс
  create: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Доступ заборонено' });

    const raw    = Object.fromEntries(await request.formData());
    const parsed = CourseSchema.safeParse(raw);
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0].message });

    const d = parsed.data;

    let moduleTitles: string[] = [];
    try {
      if (d.modules) moduleTitles = JSON.parse(d.modules);
    } catch {/* ignore */}

    await prisma.course.create({
      data: {
        title:          d.title,
        description:    d.description,
        category:       d.category,
        isPaid:         d.isPaid === 'true',
        certTemplateId: d.certTemplateId || null,
        modules: {
          create: moduleTitles
            .filter(t => t.trim())
            .map((title, i) => ({ title: title.trim(), order: i })),
        },
      },
    });

    return { success: true };
  },

  // Опублікувати курс
  publish: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Доступ заборонено' });
    const data = Object.fromEntries(await request.formData());
    await prisma.course.update({
      where: { id: String(data.id) },
      data:  { status: 'PUBLISHED' },
    });
    return { success: true };
  },

  // Видалити курс
  delete: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Доступ заборонено' });
    const data = Object.fromEntries(await request.formData());
    await prisma.course.delete({ where: { id: String(data.id) } });
    return { success: true };
  },
};
