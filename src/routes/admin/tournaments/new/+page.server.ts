import { prisma } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const certTemplates = await prisma.certificateTemplate?.findMany() || [];
  return { certTemplates };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();

    try {
      await prisma.tournament.create({
        data: {
          title: data.get('title') as string,
          description: data.get('description') as string,
          format: data.get('format') as string,
          regStart: data.get('regStart') ? new Date(data.get('regStart') as string) : null,
          regEnd: data.get('regEnd') ? new Date(data.get('regEnd') as string) : null,
          startAt: data.get('startAt') ? new Date(data.get('startAt') as string) : null,
          taskDeadline: data.get('taskDeadline') ? new Date(data.get('taskDeadline') as string) : null,
          minTeamSize: parseInt(data.get('minTeamSize') as string) || 1,
          maxTeamSize: parseInt(data.get('maxTeamSize') as string) || 1,
          status: data.get('publish') === 'true' ? 'PUBLISHED' : 'DRAFT',
          backendReq: data.get('backendReq') as string,
          frontendReq: data.get('frontendReq') as string,
          databaseReq: data.get('databaseReq') as string,
          deployReq: data.get('deployReq') as string,
          admin: {
            connect: { email: 'nastyazahc@gmail.com' } // Твій email з бази
          }
        }
      });
    } catch (e) {
      console.error("Prisma Error:", e);
      return fail(500, { error: 'Не вдалося створити турнір' });
    }

    throw redirect(303, '/admin/dashboard');
  }
};