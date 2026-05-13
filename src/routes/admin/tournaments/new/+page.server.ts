// src/routes/admin/tournaments/create/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/db';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user || locals.user.role !== 'ADMIN') redirect(302, '/');

  const certTemplates = await prisma.certificateTemplate.findMany({
    select: { id: true, name: true },
    orderBy: { createdAt: 'desc' },
  });

  return { certTemplates };
};

const TournamentSchema = z.object({
  title:       z.string().min(3, 'Назва занадто коротка'),
  description: z.string().min(10, 'Опис занадто короткий'),
  regStart:    z.string().optional(),
  regEnd:      z.string().optional(),
  startAt:     z.string().optional(),
  taskDeadline:z.string().optional(),
  minTeamSize: z.coerce.number().int().min(1).default(2),
  maxTeamSize: z.coerce.number().int().min(1).default(5),
  maxTeams:    z.coerce.number().int().nullable().optional(),
  backendReq:  z.string().optional(),
  frontendReq: z.string().optional(),
  databaseReq: z.string().optional(),
  deployReq:   z.string().optional(),
  certTemplateId: z.string().optional(),
  publish:     z.string().optional(), // "true" = одразу публікуємо
});

export const actions: Actions = {
  create: async ({ request, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') {
      return fail(403, { error: 'Доступ заборонено' });
    }

    const raw = Object.fromEntries(await request.formData());
    const parsed = TournamentSchema.safeParse(raw);

    if (!parsed.success) {
      return fail(400, { error: parsed.error.issues[0].message });
    }

    const d = parsed.data;

    const tournament = await prisma.tournament.create({
      data: {
        title:        d.title,
        description:  d.description,
        status:       d.publish === 'true' ? 'REGISTRATION' : 'DRAFT',
        regStart:     d.regStart    ? new Date(d.regStart)    : undefined,
        regEnd:       d.regEnd      ? new Date(d.regEnd)      : undefined,
        startAt:      d.startAt     ? new Date(d.startAt)     : undefined,
        taskDeadline: d.taskDeadline ? new Date(d.taskDeadline): undefined,
        minTeamSize:  d.minTeamSize,
        maxTeamSize:  d.maxTeamSize,
        maxTeams:     d.maxTeams ?? null,
        backendReq:   d.backendReq  || null,
        frontendReq:  d.frontendReq || null,
        databaseReq:  d.databaseReq || null,
        deployReq:    d.deployReq   || null,
        certTemplateId: d.certTemplateId || null,
        adminId:      locals.user.id,
      },
    });

    redirect(302, `/admin/tournaments/${tournament.id}`);
  },
};
