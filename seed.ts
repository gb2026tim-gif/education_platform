import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const email = 'nastyazahc@gmail.com'; // Твій імейл

    // Видаляємо, якщо раніше щось створилося некоректно
    try {
        await prisma.user.delete({ where: { email } });
    } catch (e) {}

    const user = await prisma.user.create({
        data: {
            email: email,
            name: 'Nastia',
            role: 'ADMIN',
            password: 'admin', // Потім зміниш через сайт
            emailVerified: true,
            mustChangePassword: false
        }
    });

    console.log('--------------------------------------');
    console.log('УСПІХ! Адмін створений:');
    console.log(`Email: ${user.email}`);
    console.log(`Role: ${user.role}`);
    console.log('Тепер можеш логінитися на сайті!');
    console.log('--------------------------------------');
}

main()
    .catch((e) => {
        console.error('Помилка:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });