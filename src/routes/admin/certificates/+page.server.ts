// src/routes/admin/certificates/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { issueCertificate } from '$lib/server/certificates';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') redirect(302, '/');

  const [templates, tournaments, courses] = await Promise.all([
    prisma.certificateTemplate.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.tournament.findMany({
      select: { id: true, title: true, certTemplateId: true, status: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.findMany({
      select: { id: true, title: true, certTemplateId: true, status: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { templates, tournaments, courses };
};

export const actions: Actions = {
  // Генерувати PDF для всіх учасників турніру / курсу
  generate: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Доступ заборонено' });

    const data       = Object.fromEntries(await request.formData());
    const entityType = String(data.entityType); // 'tournament' | 'course'
    const entityId   = String(data.entityId);
    const templateId = String(data.templateId);

    if (!templateId) return fail(400, { error: 'Оберіть шаблон сертифіката' });

    try {
      let userIds: string[] = [];

      if (entityType === 'tournament') {
        // Всі учасники турніру (капітани та члени команд зі статусом APPROVED)
        const teams = await prisma.team.findMany({
          where: { tournamentId: entityId, status: 'APPROVED' },
          include: { members: true },
        });
        const captainIds = teams.map(t => t.captainId);
        const memberEmails = teams.flatMap(t => t.members.map(m => m.email));
        const memberUsers = await prisma.user.findMany({
          where: { email: { in: memberEmails } },
          select: { id: true },
        });
        userIds = [...new Set([...captainIds, ...memberUsers.map(u => u.id)])];
      } else {
        // Всі хто завершив курс
        const enrollments = await prisma.enrollment.findMany({
          where: { courseId: entityId, completed: true },
          select: { userId: true },
        });
        userIds = enrollments.map(e => e.userId);
      }

      if (userIds.length === 0) {
        return fail(400, { error: 'Немає учасників для генерації сертифікатів' });
      }

      // Генеруємо сертифікати (пропускаємо якщо вже є)
      let created = 0;
      for (const userId of userIds) {
        const existing = await prisma.userCertificate.findFirst({
          where: { userId, templateId,
                   ...(entityType === 'tournament' ? { tournamentId: entityId } : { courseId: entityId }) },
        });
        if (!existing) {
          await issueCertificate({
            userId,
            templateId,
            ...(entityType === 'tournament' ? { tournamentId: entityId } : { courseId: entityId }),
          });
          created++;
        }
      }

      return { success: true, message: `Видано ${created} нових сертифікатів (${userIds.length - created} вже мали)` };
    } catch (e: unknown) {
      return fail(500, { error: e instanceof Error ? e.message : 'Помилка генерації' });
    }
  },

  // Прив'язати шаблон до турніру / курсу
  assignTemplate: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') return fail(403, { error: 'Доступ заборонено' });

    const data       = Object.fromEntries(await request.formData());
    const entityType = String(data.entityType);
    const entityId   = String(data.entityId);
    const templateId = String(data.templateId) || null;

    if (entityType === 'tournament') {
      await prisma.tournament.update({ where: { id: entityId }, data: { certTemplateId: templateId } });
    } else {
      await prisma.course.update({ where: { id: entityId }, data: { certTemplateId: templateId } });
    }

    return { success: true };
  },
};
