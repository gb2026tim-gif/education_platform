import { PrismaClient } from "@prisma/client";
import { auth } from "../src/lib/server/auth";

const prisma = new PrismaClient();

async function main() {
  const jurors = [
    { name: "Іван Шевченко",    email: "ivan.shevchenko@jury.lvlup.com" },
    { name: "Оксана Мельник",   email: "oksana.melnyk@jury.lvlup.com"   },
    { name: "Дмитро Коваль",    email: "dmytro.koval@jury.lvlup.com"    },
    { name: "Аліна Бондаренко", email: "alina.bondarenko@jury.lvlup.com"},
    { name: "Тарас Лисенко",    email: "taras.lysenko@jury.lvlup.com"   },
    { name: "Катерина Зибіна",  email: "katya@sigmasoftware.com"        },
    { name: "Сергій Кашубін",   email: "sergii@google.com"              },
  ];

  for (const j of jurors) {
    // Перевіряємо чи вже є
    const existing = await prisma.user.findUnique({ where: { email: j.email } });
    if (!existing) {
      await auth.api.signUpEmail({
        body: {
          name: j.name,
          email: j.email,
          password: "Jury@2026!",
        },
      });
      console.log(`✅ Створено: ${j.email}`);
    } else {
      console.log(`⏭️  Вже існує: ${j.email}`);
    }
    // Встановлюємо роль JURY
    await prisma.user.update({
      where: { email: j.email },
      data: { role: "JURY" },
    });
    console.log(`   Роль JURY встановлена`);
  }
  console.log("\n🎉 Готово! Пароль для всіх: Jury@2026!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
