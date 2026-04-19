import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });

	const formData = await request.formData();
	const file = formData.get('avatar') as File;

	if (!file || !file.size) return json({ error: 'No file' }, { status: 400 });

	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
	if (!allowedTypes.includes(file.type)) {
		return json({ error: 'Тільки JPG, PNG, WEBP' }, { status: 400 });
	}

	if (file.size > 2 * 1024 * 1024) {
		return json({ error: 'Максимум 2MB' }, { status: 400 });
	}

	const ext = file.type.split('/')[1];
	const filename = `avatar_${locals.user.id}.${ext}`;
	const uploadDir = join(process.cwd(), 'static', 'avatars');

	mkdirSync(uploadDir, { recursive: true });

	const buffer = Buffer.from(await file.arrayBuffer());
	writeFileSync(join(uploadDir, filename), buffer);

	const imagePath = `/avatars/${filename}`;

	await prisma.user.update({
		where: { id: locals.user.id },
		data: { image: imagePath }
	});

	return json({ success: true, image: imagePath });
};
