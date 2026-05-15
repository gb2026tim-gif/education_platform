# Patch 2 — фікс реальних Prisma-помилок

Цей патч виправляє 7 помилок, які виявив справжній Prisma client (мій stub був занадто м'який і їх ховав).

## Файли в архіві

1. **`prisma/schema.prisma`** — оновлена схема:
   - `Course.shortDesc` / `coverUrl` отримали `@default("")`
   - `Course.level` отримав `@default("BEGINNER")`
   - `Course.duration` отримав `@default(0)`
   - `Course.category` отримав `@default("Programming")`
   - `Course.isFree` дефолт став `true` (раніше `false`)
   - `Lesson.content` отримав `@default("")`
   - **`Juror.image` → `Juror.avatarUrl`** (бо весь твій jury-код використовує `avatarUrl`)

2. **`src/routes/admin/courses/+page.server.ts`** — додано:
   - `locals.user.role === "ADMIN"` guard у `load` і `create`
   - `author: { connect: { id: locals.user.id } }` при створенні курсу (раніше пробувало без author — і Prisma скаржилась)
   - Структура `modules.create` тепер створює `Module` з вкладеним `Lesson` (раніше пробувало запхати `videoUrl/content/testUrl` напряму в Module, де таких полів нема)

## Як накатати

```bash
# 1. Розпакувати поверх проєкту (замінить тільки 2 файли)
unzip -o lvlup-fix-2.zip

# 2. Засинхронізувати схему з БД
npx prisma db push --accept-data-loss
#    --accept-data-loss потрібен для перейменування image → avatarUrl у jurors

# 3. Регенерити клієнт
npx prisma generate

# 4. Перевірка
npm run check    # → 0 errors
```

## Чому це працює

- Defaults на Course → старі сторінки (які не передають усі поля) тепер створюють курс з sensible-defaults замість падати
- `author connect` → закриває останню required-field-помилку
- `Juror.avatarUrl` → відповідає тому, що JS-код вже скрізь очікує (`data.juror.avatarUrl`)

Warnings (23) — це pre-existing a11y/Svelte-runes-style, не помилки. Check job вони не валять.
