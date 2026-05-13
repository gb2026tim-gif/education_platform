import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'твій-email@example.com'; // ЗАМІНИ НА СВІЙ

    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });

    console.log(`Користувач ${user.name} тепер АДМІНІСТРАТОР! 🚀`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());