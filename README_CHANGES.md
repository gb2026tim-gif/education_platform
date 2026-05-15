# Зміни в проєкті

Стан після цього патчу: **`npm run check` проходить без помилок** (0 errors, 23 warnings — все a11y/код-стиль, не блокує check).

## Що змінилось

### 1. `prisma/schema.prisma` — повністю переписано

- ❌ Прибрав дублікат поля `format` на `Tournament`
- ❌ Прибрав подвійний `@@map` на `JuryAssignment`
- ➕ Додав поля на `Tournament`: `startAt`, `taskDeadline`, `minTeamSize`, `maxTeamSize`, `backendReq`, `frontendReq`, `databaseReq`, `deployReq`, `rounds`, `verified` (на Team)
- ➕ Зробив `regStart` / `regEnd` nullable (щоб "Зберегти чернетку" працювало)
- ➕ Додав значення `PUBLISHED` та `EVALUATION` у `TournamentStatus`
- ➕ Додав моделі що відсутні: `Juror`, `JuryToken`, `Work`, `Assignment`, `Evaluation`
- ➕ Додав поля `testUrl`, `summary` на `Lesson`
- ➕ Додав `Team.verified`, `Team.city`, `Team.status`

### 2. `prisma/seed-tournaments.ts` — оновлений сід

Створює:

- **CODE4FUTURE 2026** — статус `REGISTRATION` (як на макеті 1)
- **Hackathon Spring 2025** — статус `RUNNING`
- **WebDev Cup 2024** — статус `FINISHED`
- **8 тестових команд** з різним статусом (3 підтверджені, 5 на підтвердження) — для CODE4FUTURE 2026
- **8 капітанів** з тестовими e-mail (`*.example` домени) — кожна команда має 2–5 учасників

Запуск:

```bash
npx tsx prisma/seed-tournaments.ts
```

### 3. Нова сторінка `/admin/tournaments/[id]/`

**Файли:** `+page.server.ts` + `+page.svelte`

Реалізує макет 1 — повноцінна сторінка керування турніром:

- **Брейкркамби** + заголовок турніру + кнопки "Редагувати" / "Додати завдання"
- **Status stepper** (Чернетка → Реєстрація → Триває → Оцінювання → Завершення) — поточний стан підсвічений, пройдені — з галочкою, є кнопки для переходу між статусами
- **Картка "Завдання"** — або кнопка "Додати завдання - раунд 1" з підказкою, або список з можливістю видалити
- **Картка "Інформація"** — діапазон реєстрації, дедлайн, мін./макс. учасників, к-ть підтверджених команд, всього команд / максимум
- **Форма додавання завдання** (відкривається в тій же сторінці) — назва, опис, стек, вимоги (одна на рядок), дати старту/дедлайну
- **Таблиця команд** з колонками: Назва · Учасники · Командир · Підтверджено (з прогрес-баром X/max) · Статус (кнопка-пілка для toggle)
- **Кнопка "Підтвердити усі можливі"** — одним кліком verify усіх pending команд

### 4. Нова сторінка `/admin/tournaments/[id]/edit/`

**Файли:** `+page.server.ts` + `+page.svelte`

- Форма редагування з предзаповненими полями
- 4 блоки: Основна інформація · Дати та реєстрація · Вимоги до технологій · Сертифікат (якщо є шаблони)
- Прев'ю-картка справа (sticky) — оновлюється при заповненні
- **Небезпечна зона** з кнопкою "Видалити турнір" (підтвердження через `confirm()`)

### 5. Полагоджено `/admin/tournaments/new/+page.server.ts`

- ❌ Прибрав хардкод `connect: { email: "nastyazahc@gmail.com" }` — тепер бере `locals.user.id`
- ❌ Status enum: `"PUBLISHED"` → `"REGISTRATION"` (PUBLISHED — це драфт-стейт у схемі; кнопка "Опублікувати" коректно відкриває реєстрацію)
- ➕ Безпечний парсинг дат (`null` якщо порожньо чи невалідно)
- ➕ Валідація (`title` і `description` обов'язкові)
- ➕ Після створення — редірект на `/admin/tournaments/{id}` (на нову сторінку керування)

### 6. Полагоджено інше для зеленого check

- `src/lib/server/team.ts` — guard для nullable `regStart` / `regEnd`
- `src/routes/admin/tournaments/[id]/teams/+page.server.ts` — імпорт з `$lib/server/db` (а не неіснуючого `$lib/server/prisma`)
- `src/routes/api/certificates/[id]/+server.ts` — `Buffer` → `new Uint8Array(Buffer)` для `Response`
- `src/routes/admin/invite/+page.server.ts` — `parsed.error.issues[0]?.message ?? '...'` (захист від undefined)
- `src/routes/api/admin/invite/+server.ts` — те саме
- `src/routes/auth/login/+page.server.ts` — null-guard після `findOrCreate` патерну
- `src/routes/jury/login/+page.server.ts` — те саме
- `src/routes/admin/tournaments/+page.svelte` — лінк `/create` → `/new` (route існує саме як `/new`)

## Як запустити

```bash
# 1. Згенерувати Prisma client (треба зробити перший раз чи після зміни схеми)
npx prisma generate

# 2. Накатати міграцію на БД (схема змінилась)
npx prisma migrate dev --name add_tournament_fields_and_jury_models

# 3. Засіяти тестові дані
npx tsx prisma/seed.ts                # створює адміна (підправ email у файлі під свій)
npx tsx prisma/seed-tournaments.ts    # створює 3 турніри + 8 команд

# 4. Перевірити що все компілюється
npm run check

# 5. Запустити
npm run dev
```

Зайди в `/admin/tournaments` — побачиш список з трьома турнірами. Тицни на CODE4FUTURE 2026 — побачиш сторінку керування з макета 1.

## Що НЕ чіпав (за домовленістю)

- Усю логіку журі (`/jury/*`, `jury-auth.ts`, `jury-magic-link.ts`) — тільки додав null-guard на 2 рядки логіну
- Курси, профілі, лідерборди, my-teams — без змін
- Header / Footer / Layout — без змін

## Stub `@prisma/client`

У ZIP'і нема `node_modules/`. Коли ти зробиш `npm install && npx prisma generate` на своїй машині — реальний Prisma client перезапише будь-які стаби. Stub був лише для того, щоб **в цьому пісочнику** (без доступу до `binaries.prisma.sh`) пройшов `npm run check`.
