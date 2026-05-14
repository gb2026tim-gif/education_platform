// prisma/seed-courses.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// YouTube embeds
const PY = "https://www.youtube.com/embed/rfscVS0vtbw";
const JS = "https://www.youtube.com/embed/PkZNo7MFNFg";
const GIT = "https://www.youtube.com/embed/HVsySz-h9r4";
const SQL = "https://www.youtube.com/embed/qw--VYLpxG4";
const TS = "https://www.youtube.com/embed/W6NZfCO5SIk";
const SVK = "https://www.youtube.com/embed/eIrMbAQSU34";
const DOC = "https://www.youtube.com/embed/nu_pCVPKzTk";
const CSS = "https://www.youtube.com/embed/1Rs2ND1ryYc";

async function main() {
  console.log("📚 Seeding courses...\n");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.error("❌ No ADMIN");
    process.exit(1);
  }

  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  type LessonInput = {
    title: string;
    videoUrl: string;
    duration: number;
    order: number;
    isFree: boolean;
    content: string;
  };
  type ModuleInput = {
    title: string;
    desc?: string;
    order: number;
    lessons: LessonInput[];
  };

  async function mkCourse(data: any, modules: ModuleInput[]) {
    const c = await prisma.course.create({
      data: { ...data, authorId: admin!.id },
    });
    for (const m of modules) {
      const mod = await prisma.module.create({
        data: {
          title: m.title,
          description: m.desc ?? null,
          order: m.order,
          courseId: c.id,
        },
      });
      for (const l of m.lessons) {
        await prisma.lesson.create({ data: { ...l, moduleId: mod.id } });
      }
    }
    const total = modules.reduce((a, m) => a + m.lessons.length, 0);
    console.log(`✅ ${c.title} — ${modules.length} модулів, ${total} уроків`);
    return c;
  }

  // ── 1. Python ───────────────────────────────────────────────────
  await mkCourse(
    {
      title: "Python для початківців",
      shortDesc: "Від Hello World до власних проєктів за 40 годин",
      description:
        "Повний курс Python з нуля. Змінні, функції, ООП, робота з файлами, бібліотеки, веб-скрапінг та телеграм-бот. Кожен модуль завершується практичним проєктом і тестом.",
      coverUrl:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
      price: 0,
      isFree: true,
      level: "BEGINNER",
      category: "Programming",
      duration: 720,
      published: true,
    },
    [
      {
        title: "Вступ та середовище",
        order: 1,
        lessons: [
          {
            title: "Що таке Python і де застосовується",
            videoUrl: PY,
            duration: 8,
            order: 1,
            isFree: true,
            content:
              "# Python\n\nPython — мова загального призначення створена у 1991 році.\n\n## Застосування\n- Веб: Django, FastAPI\n- Data Science: pandas, numpy\n- AI/ML: TensorFlow, PyTorch\n- Автоматизація та скрипти\n\n## Переваги\n✅ Простий синтаксис\n✅ Велика спільнота\n✅ Тисячі бібліотек",
          },
          {
            title: "Встановлення Python та VS Code",
            videoUrl: PY,
            duration: 12,
            order: 2,
            isFree: true,
            content:
              "## Встановлення\n\n```bash\n# Перевірка версії\npython --version\n\n# Запуск скрипту\npython script.py\n```\n\n## VS Code розширення\n- Python (Microsoft)\n- Pylance\n- Python Indent",
          },
          {
            title: "Перша програма Hello World",
            videoUrl: PY,
            duration: 10,
            order: 3,
            isFree: true,
            content:
              '```python\nprint(\'Hello, World!\')\n\n# Коментарі\n# Однорядковий\n"""\nБагаторядковий\n"""\n```',
          },
          {
            title: "Змінні та типи даних",
            videoUrl: PY,
            duration: 20,
            order: 4,
            isFree: false,
            content:
              "```python\nx = 42          # int\ny = 3.14        # float\nname = 'Іван'   # str\nactive = True   # bool\n\nprint(type(x))  # <class 'int'>\n```",
          },
          {
            title: "🧪 Тест: Вступний модуль",
            videoUrl: PY,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест знань\n\n**1. Яка команда виводить текст у Python?**\n- a) echo\n- b) print ✅\n- c) console.log\n- d) write\n\n**2. Який тип даних у змінної: x = 3.14?**\n- a) int\n- b) str\n- c) float ✅\n- d) bool\n\n**3. Як написати коментар?**\n- a) // коментар\n- b) # коментар ✅\n- c) /* коментар */\n- d) -- коментар\n\n**4. Що виведе: print(2 ** 3)?**\n- a) 6\n- b) 8 ✅\n- c) 23\n- d) помилка\n\n**5. Як перевірити тип змінної?**\n- a) typeof(x)\n- b) type(x) ✅\n- c) x.type()\n- d) getType(x)",
          },
        ],
      },
      {
        title: "Структури даних",
        order: 2,
        lessons: [
          {
            title: "Списки (List) та методи",
            videoUrl: PY,
            duration: 22,
            order: 1,
            isFree: false,
            content:
              "```python\nfruits = ['яблуко', 'банан', 'вишня']\nfruits.append('груша')\nfruits.insert(0, 'авокадо')\nfruits.remove('банан')\nprint(fruits[0])   # авокадо\nprint(fruits[-1])  # груша\nprint(len(fruits)) # 3\n\n# Зрізи\nprint(fruits[1:3])\nprint(fruits[::-1])  # реверс\n```",
          },
          {
            title: "Словники (Dict)",
            videoUrl: PY,
            duration: 20,
            order: 2,
            isFree: false,
            content:
              "```python\nperson = {\n  'name': 'Іван',\n  'age': 20,\n  'city': 'Київ'\n}\n\n# Доступ\nprint(person['name'])\nprint(person.get('email', 'N/A'))\n\n# Зміна\nperson['age'] = 21\nperson.update({'email': 'ivan@mail.com'})\n\n# Ітерація\nfor key, val in person.items():\n    print(f'{key}: {val}')\n```",
          },
          {
            title: "Множини (Set) та Кортежі (Tuple)",
            videoUrl: PY,
            duration: 18,
            order: 3,
            isFree: false,
            content:
              "```python\n# Set — унікальні елементи\nnumbers = {1, 2, 3, 2, 1}\nprint(numbers)  # {1, 2, 3}\n\n# Операції\na = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b)  # {2, 3} перетин\nprint(a | b)  # {1,2,3,4} об'єднання\n\n# Tuple — незмінний\ncoords = (50.45, 30.52)\nprint(coords[0])  # 50.45\n```",
          },
          {
            title: "Умови та цикли",
            videoUrl: PY,
            duration: 25,
            order: 4,
            isFree: false,
            content:
              "```python\n# if/elif/else\nscore = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 70:\n    grade = 'B'\nelse:\n    grade = 'C'\n\n# for\nfor i in range(5):\n    print(i)\n\n# while\ncount = 0\nwhile count < 3:\n    count += 1\n\n# List comprehension\nsquares = [x**2 for x in range(10) if x % 2 == 0]\n```",
          },
          {
            title: "🧪 Тест: Структури даних",
            videoUrl: PY,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Як додати елемент в кінець списку?**\n- a) list.add()\n- b) list.push()\n- c) list.append() ✅\n- d) list.insert()\n\n**2. Яка структура не допускає дублікатів?**\n- a) list\n- b) tuple\n- c) set ✅\n- d) dict\n\n**3. Як отримати всі ключі словника?**\n- a) dict.keys() ✅\n- b) dict.all()\n- c) dict.list()\n- d) keys(dict)\n\n**4. Що виведе: len({1,2,2,3})?**\n- a) 4\n- b) 3 ✅\n- c) 2\n- d) помилка\n\n**5. Як створити порожній словник?**\n- a) dict = []\n- b) dict = {}\n✅\n- c) dict = ()\n- d) dict = <>",
          },
        ],
      },
      {
        title: "Функції та ООП",
        order: 3,
        lessons: [
          {
            title: "Функції: визначення та виклик",
            videoUrl: PY,
            duration: 25,
            order: 1,
            isFree: false,
            content:
              "```python\ndef greet(name, greeting='Привіт'):\n    return f'{greeting}, {name}!'\n\nprint(greet('Іван'))\nprint(greet('Оля', 'Вітаю'))\n\n# Lambda\nsquare = lambda x: x**2\nadd = lambda a, b: a + b\n\n# *args, **kwargs\ndef show(*args, **kwargs):\n    print(args, kwargs)\n\nshow(1, 2, 3, name='Іван', age=20)\n```",
          },
          {
            title: "Класи та об'єкти",
            videoUrl: PY,
            duration: 28,
            order: 2,
            isFree: false,
            content:
              "```python\nclass Animal:\n    def __init__(self, name, sound):\n        self.name = name\n        self.sound = sound\n    \n    def speak(self):\n        return f'{self.name} каже {self.sound}'\n    \n    def __str__(self):\n        return f'Animal({self.name})'\n\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(name, 'Гав!')\n    \n    def fetch(self):\n        return f'{self.name} приніс м\\'яч!'\n\ndog = Dog('Рекс')\nprint(dog.speak())\nprint(dog.fetch())\n```",
          },
          {
            title: "Декоратори та генератори",
            videoUrl: PY,
            duration: 22,
            order: 3,
            isFree: false,
            content:
              "```python\n# Декоратор\ndef timer(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f'Час: {time.time()-start:.3f}с')\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    import time\n    time.sleep(0.1)\n\n# Генератор\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci()\nfor _ in range(10):\n    print(next(fib))\n```",
          },
          {
            title: "Обробка помилок (try/except)",
            videoUrl: PY,
            duration: 18,
            order: 4,
            isFree: false,
            content:
              "```python\ntry:\n    x = int(input('Число: '))\n    result = 100 / x\nexcept ValueError:\n    print('Введіть ціле число!')\nexcept ZeroDivisionError:\n    print('Ділення на нуль!')\nexcept Exception as e:\n    print(f'Помилка: {e}')\nelse:\n    print(f'Результат: {result}')\nfinally:\n    print('Завжди виконується')\n```",
          },
          {
            title: "🧪 Тест: Функції та ООП",
            videoUrl: PY,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Що таке self в класі Python?**\n- a) Ключове слово для статичних методів\n- b) Посилання на поточний екземпляр ✅\n- c) Назва класу\n- d) Конструктор\n\n**2. Яке ключове слово використовує генератор?**\n- a) return\n- b) yield ✅\n- c) next\n- d) generate\n\n**3. Що виведе: (lambda x: x*2)(5)?**\n- a) 10 ✅\n- b) 25\n- c) 52\n- d) помилка\n\n**4. Як викликати метод батьківського класу?**\n- a) parent.method()\n- b) super().method() ✅\n- c) base.method()\n- d) this.method()\n\n**5. Що таке декоратор?**\n- a) Коментар у коді\n- b) Функція що обгортає іншу функцію ✅\n- c) Тип даних\n- d) Клас спадкування",
          },
        ],
      },
      {
        title: "Файли та бібліотеки",
        order: 4,
        lessons: [
          {
            title: "Робота з файлами",
            videoUrl: PY,
            duration: 20,
            order: 1,
            isFree: false,
            content:
              "```python\n# Запис\nwith open('data.txt', 'w', encoding='utf-8') as f:\n    f.write('Привіт, файл!\\n')\n    f.writelines(['рядок1\\n', 'рядок2\\n'])\n\n# Читання\nwith open('data.txt', 'r', encoding='utf-8') as f:\n    content = f.read()\n    # або\n    lines = f.readlines()\n\n# JSON\nimport json\ndata = {'name': 'Іван', 'age': 20}\nwith open('data.json', 'w') as f:\n    json.dump(data, f, ensure_ascii=False, indent=2)\n```",
          },
          {
            title: "Бібліотека requests",
            videoUrl: PY,
            duration: 22,
            order: 2,
            isFree: false,
            content:
              "```python\nimport requests\n\n# GET запит\nresponse = requests.get('https://api.github.com/users/torvalds')\ndata = response.json()\nprint(data['name'], data['public_repos'])\n\n# POST запит\nresponse = requests.post(\n    'https://httpbin.org/post',\n    json={'key': 'value'},\n    headers={'Authorization': 'Bearer token123'}\n)\nprint(response.status_code)\n```",
          },
          {
            title: "BeautifulSoup: веб-скрапінг",
            videoUrl: PY,
            duration: 25,
            order: 3,
            isFree: false,
            content:
              "```python\nimport requests\nfrom bs4 import BeautifulSoup\n\nurl = 'https://quotes.toscrape.com'\nresponse = requests.get(url)\nsoup = BeautifulSoup(response.text, 'html.parser')\n\nquotes = soup.find_all('span', class_='text')\nfor q in quotes:\n    print(q.text)\n\n# Збереження в CSV\nimport csv\nwith open('quotes.csv', 'w', newline='') as f:\n    writer = csv.writer(f)\n    for q in quotes:\n        writer.writerow([q.text])\n```",
          },
          {
            title: "pandas: аналіз даних",
            videoUrl: PY,
            duration: 28,
            order: 4,
            isFree: false,
            content:
              "```python\nimport pandas as pd\nimport numpy as np\n\n# Створення DataFrame\ndf = pd.DataFrame({\n    'name': ['Іван', 'Оля', 'Петро'],\n    'score': [85, 92, 78],\n    'grade': ['B', 'A', 'C']\n})\n\nprint(df.describe())\nprint(df[df['score'] > 80])\n\n# Читання CSV\ndf2 = pd.read_csv('data.csv')\ndf2.groupby('grade')['score'].mean()\n```",
          },
          {
            title: "🧪 Тест: Файли та бібліотеки",
            videoUrl: PY,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Який режим відкриття файлу для запису?**\n- a) 'r'\n- b) 'w' ✅\n- c) 'x'\n- d) 'a'\n\n**2. Яка бібліотека для HTTP запитів?**\n- a) urllib\n- b) http\n- c) requests ✅\n- d) fetch\n\n**3. Що робить with open()?**\n- a) Відкриває файл і автоматично закриває ✅\n- b) Відкриває тільки для читання\n- c) Створює новий файл\n- d) Видаляє файл\n\n**4. Яка бібліотека для аналізу даних?**\n- a) numpy\n- b) pandas ✅\n- c) scipy\n- d) matplotlib\n\n**5. Що таке BeautifulSoup?**\n- a) Веб-фреймворк\n- b) Парсер HTML/XML ✅\n- c) HTTP клієнт\n- d) База даних",
          },
        ],
      },
      {
        title: "Фінальний проєкт та конспект",
        order: 5,
        lessons: [
          {
            title: "Проєкт: Телеграм-бот",
            videoUrl: PY,
            duration: 45,
            order: 1,
            isFree: false,
            content:
              "## Телеграм-бот на Python\n\n```bash\npip install python-telegram-bot\n```\n\n```python\nfrom telegram import Update\nfrom telegram.ext import Application, CommandHandler, MessageHandler, filters\n\nasync def start(update: Update, context):\n    await update.message.reply_text(\n        '👋 Привіт! Я Python бот.\\n'\n        'Команди:\\n/hello - вітання\\n/calc 5+3 - калькулятор'\n    )\n\nasync def calc(update: Update, context):\n    try:\n        expr = ' '.join(context.args)\n        result = eval(expr)\n        await update.message.reply_text(f'🔢 {expr} = {result}')\n    except:\n        await update.message.reply_text('❌ Невірний вираз')\n\napp = Application.builder().token('YOUR_BOT_TOKEN').build()\napp.add_handler(CommandHandler('start', start))\napp.add_handler(CommandHandler('calc', calc))\napp.run_polling()\n```",
          },
          {
            title: "Проєкт: CLI Todo застосунок",
            videoUrl: PY,
            duration: 35,
            order: 2,
            isFree: false,
            content:
              "```python\nimport json\nimport os\nfrom datetime import datetime\n\nTODO_FILE = 'todos.json'\n\ndef load_todos():\n    if os.path.exists(TODO_FILE):\n        with open(TODO_FILE) as f:\n            return json.load(f)\n    return []\n\ndef save_todos(todos):\n    with open(TODO_FILE, 'w') as f:\n        json.dump(todos, f, ensure_ascii=False, indent=2)\n\ndef add_todo(title):\n    todos = load_todos()\n    todos.append({\n        'id': len(todos) + 1,\n        'title': title,\n        'done': False,\n        'created': datetime.now().isoformat()\n    })\n    save_todos(todos)\n    print(f'✅ Додано: {title}')\n\ndef list_todos():\n    todos = load_todos()\n    for t in todos:\n        status = '✅' if t['done'] else '⬜'\n        print(f\"{status} [{t['id']}] {t['title']}\")\n```",
          },
          {
            title: "Проєкт: Веб-скрапер новин",
            videoUrl: PY,
            duration: 40,
            order: 3,
            isFree: false,
            content:
              "```python\nimport requests\nfrom bs4 import BeautifulSoup\nimport pandas as pd\nfrom datetime import datetime\n\ndef scrape_news(url):\n    headers = {'User-Agent': 'Mozilla/5.0'}\n    response = requests.get(url, headers=headers)\n    soup = BeautifulSoup(response.text, 'html.parser')\n    \n    articles = []\n    for article in soup.find_all('article')[:10]:\n        title = article.find('h2')\n        link = article.find('a')\n        if title and link:\n            articles.append({\n                'title': title.text.strip(),\n                'url': link.get('href', ''),\n                'scraped_at': datetime.now().isoformat()\n            })\n    return articles\n\n# Збереження\ndf = pd.DataFrame(scrape_news('https://news.ycombinator.com'))\ndf.to_csv(f'news_{datetime.now().strftime(\"%Y%m%d\")}.csv', index=False)\nprint(f'Збережено {len(df)} статей')\n```",
          },
          {
            title: "Тест фінальний: весь курс",
            videoUrl: PY,
            duration: 15,
            order: 4,
            isFree: false,
            content:
              "## Фінальний тест Python\n\n**1. Що таке Generator в Python?**\n- a) Функція яка повертає ітератор через yield ✅\n- b) Клас для генерації коду\n- c) Бібліотека\n- d) Декоратор\n\n**2. Яка різниця між list та tuple?**\n- a) Немає різниці\n- b) Tuple незмінний ✅\n- c) List швидший\n- d) Tuple може містити різні типи\n\n**3. Що робить @property?**\n- a) Робить атрибут приватним\n- b) Перетворює метод на атрибут ✅\n- c) Захищає від зміни\n- d) Кешує результат\n\n**4. Яка складність пошуку в set?**\n- a) O(n)\n- b) O(log n)\n- c) O(1) ✅\n- d) O(n²)\n\n**5. Що таке GIL в Python?**\n- a) Бібліотека для GUI\n- b) Глобальне блокування інтерпретатора ✅\n- c) Тип даних\n- d) Менеджер пакетів",
          },
          {
            title: "📄 Конспект курсу Python",
            videoUrl: PY,
            duration: 5,
            order: 5,
            isFree: false,
            content:
              "# Повний конспект курсу Python\n\n## Модуль 1: Основи\n- Python — інтерпретована мова загального призначення\n- Типи: int, float, str, bool, None\n- print(), input(), type(), len()\n- Відступи замість фігурних дужок\n\n## Модуль 2: Структури даних\n- **List** `[]` — впорядкована змінна колекція\n- **Dict** `{}` — пари ключ-значення\n- **Set** `{}` — унікальні елементи\n- **Tuple** `()` — незмінна послідовність\n\n## Модуль 3: Функції та ООП\n- `def func(args):` — визначення функції\n- `class MyClass:` — визначення класу\n- `__init__` — конструктор\n- `super()` — виклик батьківського класу\n- Декоратори `@decorator`\n- Генератори `yield`\n\n## Модуль 4: Файли та бібліотеки\n- `open()` — робота з файлами\n- `requests` — HTTP запити\n- `BeautifulSoup` — парсинг HTML\n- `pandas` — аналіз даних\n- `json` — робота з JSON\n\n## Модуль 5: Проєкти\n- Телеграм-бот\n- CLI Todo застосунок\n- Веб-скрапер новин\n\n---\n*Для завантаження конспекту натисни кнопку нижче*\n\n[📥 ЗАВАНТАЖИТИ КОНСПЕКТ PDF](/api/courses/python-summary.pdf)",
          },
        ],
      },
    ],
  );

  // ── 2. JavaScript ───────────────────────────────────────────────
  await mkCourse(
    {
      title: "JavaScript: Повний курс",
      shortDesc: "Від основ до сучасного ES2024",
      description:
        "Вивчи JavaScript від змінних до async/await. ES6+, DOM, Fetch API, локальне сховище, модулі та реальні проєкти.",
      coverUrl:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
      price: 0,
      isFree: true,
      level: "BEGINNER",
      category: "Web Development",
      duration: 600,
      published: true,
    },
    [
      {
        title: "Основи JavaScript",
        order: 1,
        lessons: [
          {
            title: "Змінні: var, let, const",
            videoUrl: JS,
            duration: 12,
            order: 1,
            isFree: true,
            content:
              "```javascript\nlet count = 0;      // змінна\nconst PI = 3.14;    // константа\nvar old = 'застаріло'; // уникай\n\n// Деструктуризація\nconst [a, b] = [1, 2];\nconst { name, age } = person;\n```",
          },
          {
            title: "Типи даних та оператори",
            videoUrl: JS,
            duration: 18,
            order: 2,
            isFree: true,
            content:
              "```javascript\n// Примітиви\nconst str = 'текст';\nconst num = 42;\nconst bool = true;\nconst nul = null;\nconst undef = undefined;\n\n// Строге порівняння\n'5' === 5  // false ✅\n'5' == 5   // true ❌\n\n// Шаблонні рядки\n`Привіт, ${name}!`\n```",
          },
          {
            title: "Функції та замикання",
            videoUrl: JS,
            duration: 22,
            order: 3,
            isFree: false,
            content:
              "```javascript\n// Стрілкова функція\nconst add = (a, b) => a + b;\n\n// Замикання\nfunction counter() {\n  let count = 0;\n  return {\n    inc: () => ++count,\n    get: () => count\n  };\n}\n\nconst c = counter();\nc.inc(); c.inc();\nconsole.log(c.get()); // 2\n```",
          },
          {
            title: "Масиви: map, filter, reduce",
            videoUrl: JS,
            duration: 25,
            order: 4,
            isFree: false,
            content:
              "```javascript\nconst nums = [1,2,3,4,5];\n\n// map — трансформація\nconst doubled = nums.map(n => n * 2);\n\n// filter — фільтрація\nconst evens = nums.filter(n => n % 2 === 0);\n\n// reduce — агрегація\nconst sum = nums.reduce((acc, n) => acc + n, 0);\n\n// find, some, every\nconst found = nums.find(n => n > 3);  // 4\nconst hasEven = nums.some(n => n % 2 === 0); // true\n```",
          },
          {
            title: "🧪 Тест: Основи JS",
            videoUrl: JS,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Що виведе: typeof null?**\n- a) null\n- b) undefined\n- c) object ✅\n- d) number\n\n**2. Яка різниця == і ===?**\n- a) Немає різниці\n- b) === перевіряє тип і значення ✅\n- c) == строгіше\n- d) === тільки для рядків\n\n**3. Що повертає [1,2,3].map(x => x*2)?**\n- a) 6\n- b) [2,4,6] ✅\n- c) [1,2,3]\n- d) помилка\n\n**4. Що таке замикання?**\n- a) Функція без параметрів\n- b) Функція що має доступ до зовнішніх змінних ✅\n- c) Рекурсивна функція\n- d) Анонімна функція\n\n**5. Що виведе: Boolean('')?**\n- a) true\n- b) false ✅\n- c) undefined\n- d) null",
          },
        ],
      },
      {
        title: "DOM та події",
        order: 2,
        lessons: [
          {
            title: "Що таке DOM та його структура",
            videoUrl: JS,
            duration: 15,
            order: 1,
            isFree: false,
            content:
              "```javascript\n// Вибірка елементів\nconst el = document.querySelector('.btn');\nconst all = document.querySelectorAll('li');\nconst byId = document.getElementById('app');\n\n// Зміна\nel.textContent = 'Новий текст';\nel.style.color = 'red';\nel.classList.add('active');\nel.classList.toggle('hidden');\n\n// Атрибути\nel.setAttribute('data-id', '42');\nel.getAttribute('href');\n```",
          },
          {
            title: "Події: addEventListener",
            videoUrl: JS,
            duration: 20,
            order: 2,
            isFree: false,
            content:
              "```javascript\nconst btn = document.querySelector('#btn');\n\nbtn.addEventListener('click', (e) => {\n  console.log('Клік!', e.target);\n  e.preventDefault(); // скасувати дефолтну поведінку\n});\n\n// Делегування подій\ndocument.querySelector('ul').addEventListener('click', (e) => {\n  if (e.target.tagName === 'LI') {\n    e.target.classList.toggle('done');\n  }\n});\n\n// Одноразова подія\nbtn.addEventListener('click', handler, { once: true });\n```",
          },
          {
            title: "Fetch API та робота з API",
            videoUrl: JS,
            duration: 28,
            order: 3,
            isFree: false,
            content:
              "```javascript\n// GET\nconst data = await fetch('https://jsonplaceholder.typicode.com/posts')\n  .then(r => r.json());\n\n// POST\nconst res = await fetch('/api/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Іван' })\n});\n\n// Обробка помилок\ntry {\n  const r = await fetch(url);\n  if (!r.ok) throw new Error(`HTTP ${r.status}`);\n  return await r.json();\n} catch (e) {\n  console.error(e);\n}\n```",
          },
          {
            title: "LocalStorage та SessionStorage",
            videoUrl: JS,
            duration: 18,
            order: 4,
            isFree: false,
            content:
              "```javascript\n// Збереження\nlocalStorage.setItem('user', JSON.stringify({ name: 'Іван' }));\nsessionStorage.setItem('token', 'abc123');\n\n// Читання\nconst user = JSON.parse(localStorage.getItem('user'));\n\n// Видалення\nlocalStorage.removeItem('user');\nlocalStorage.clear();\n\n// Різниця:\n// localStorage — зберігається після закриття\n// sessionStorage — очищається при закритті\n```",
          },
          {
            title: "🧪 Тест: DOM та події",
            videoUrl: JS,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Яка подія спрацьовує при натисканні?**\n- a) 'press'\n- b) 'click' ✅\n- c) 'tap'\n- d) 'select'\n\n**2. Що робить e.preventDefault()?**\n- a) Зупиняє bubbling\n- b) Скасовує дефолтну дію браузера ✅\n- c) Видаляє слухач\n- d) Зупиняє скрипт\n\n**3. Як вибрати всі елементи з класом?**\n- a) document.getClass()\n- b) document.querySelectorAll('.class') ✅\n- c) document.findAll()\n- d) document.select()\n\n**4. Яка різниця localStorage і sessionStorage?**\n- a) Немає різниці\n- b) localStorage зберігається довше ✅\n- c) sessionStorage безпечніший\n- d) localStorage тільки для рядків\n\n**5. Що таке делегування подій?**\n- a) Передача події іншому слухачу\n- b) Слухач на батьківському елементі для дочірніх ✅\n- c) Видалення слухача\n- d) Затримка події",
          },
        ],
      },
      {
        title: "Асинхронний JS",
        order: 3,
        lessons: [
          {
            title: "Callbacks та Promise",
            videoUrl: JS,
            duration: 22,
            order: 1,
            isFree: false,
            content:
              "```javascript\n// Callback (застаріло)\nfs.readFile('file.txt', (err, data) => {\n  if (err) throw err;\n  console.log(data);\n});\n\n// Promise\nconst p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve('Готово!'), 1000);\n});\n\np.then(data => console.log(data))\n  .catch(err => console.error(err));\n\n// Promise.all\nconst [users, posts] = await Promise.all([\n  fetch('/api/users').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json()),\n]);\n```",
          },
          {
            title: "Async/Await",
            videoUrl: JS,
            duration: 25,
            order: 2,
            isFree: false,
            content:
              "```javascript\nasync function fetchUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error('Not found');\n    return await res.json();\n  } catch (error) {\n    console.error(error);\n    throw error;\n  }\n}\n\n// Паралельні запити\nasync function loadAll() {\n  const [user, posts] = await Promise.all([\n    fetchUser(1),\n    fetchPosts(1),\n  ]);\n  return { user, posts };\n}\n```",
          },
          {
            title: "ES6+ Можливості",
            videoUrl: JS,
            duration: 20,
            order: 3,
            isFree: false,
            content:
              "```javascript\n// Spread/Rest\nconst arr = [1, 2, 3];\nconst newArr = [...arr, 4, 5];\nconst [first, ...rest] = arr;\n\n// Optional chaining\nconst city = user?.address?.city ?? 'Невідомо';\n\n// Nullish coalescing\nconst name = user.name ?? 'Анонім';\n\n// Деструктуризація з перейменуванням\nconst { name: userName, age: userAge = 18 } = user;\n\n// Dynamic import\nconst module = await import('./utils.js');\n```",
          },
          {
            title: "Модулі ES6",
            videoUrl: JS,
            duration: 18,
            order: 4,
            isFree: false,
            content:
              "```javascript\n// math.js — export\nexport const PI = 3.14;\nexport function add(a, b) { return a + b; }\nexport default class Calculator {\n  multiply(a, b) { return a * b; }\n}\n\n// main.js — import\nimport Calculator, { PI, add } from './math.js';\nimport * as math from './math.js';\n\nconsole.log(PI);\nconsole.log(add(2, 3));\nconst calc = new Calculator();\nconsole.log(calc.multiply(3, 4));\n```",
          },
          {
            title: "🧪 Тест та 📄 Конспект JS",
            videoUrl: JS,
            duration: 15,
            order: 5,
            isFree: false,
            content:
              "## Фінальний тест JavaScript\n\n**1. Що таке Event Loop?**\n- a) Цикл для подій DOM\n- b) Механізм виконання асинхронного коду ✅\n- c) Функція setTimeout\n- d) Promise API\n\n**2. Що повертає async функція?**\n- a) Звичайне значення\n- b) Promise ✅\n- c) callback\n- d) Observable\n\n**3. Різниця null та undefined?**\n- a) Немає різниці\n- b) null — навмисна відсутність, undefined — не ініціалізовано ✅\n- c) undefined — помилка\n- d) null тільки для об'єктів\n\n**4. Що таке closure?**\n- a) Функція без return\n- b) Функція з доступом до зовнішніх змінних ✅\n- c) Клас в JS\n- d) Тип Promise\n\n**5. Що робить Promise.all?**\n- a) Виконує послідовно\n- b) Виконує паралельно та чекає всіх ✅\n- c) Повертає перший результат\n- d) Скасовує всі\n\n---\n# 📄 Конспект JavaScript\n\n## Основи\n- `let/const` для змінних, `var` уникати\n- `===` для суворого порівняння\n- Замикання — функція з доступом до зовн. scope\n\n## DOM\n- `querySelector`, `querySelectorAll`\n- `addEventListener('click', handler)`\n- `classList.add/remove/toggle`\n\n## Асинхронність\n- Promise → `.then().catch()`\n- `async/await` з `try/catch`\n- `Promise.all()` для паралельних запитів\n\n[📥 ЗАВАНТАЖИТИ КОНСПЕКТ](/api/courses/js-summary.pdf)",
          },
        ],
      },
      {
        title: "Проєкти",
        order: 4,
        lessons: [
          {
            title: "Проєкт: Todo App",
            videoUrl: JS,
            duration: 40,
            order: 1,
            isFree: false,
            content:
              "## Todo List з localStorage\n\n```javascript\nconst STORAGE_KEY = 'todos';\n\nfunction getTodos() {\n  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');\n}\n\nfunction saveTodos(todos) {\n  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));\n  renderTodos();\n}\n\nfunction addTodo(text) {\n  const todos = getTodos();\n  todos.push({ id: Date.now(), text, done: false });\n  saveTodos(todos);\n}\n\nfunction renderTodos() {\n  const list = document.getElementById('list');\n  list.innerHTML = getTodos().map(t => `\n    <li class=\"${t.done ? 'done' : ''}\">\n      <span onclick=\"toggle(${t.id})\">${t.text}</span>\n      <button onclick=\"remove(${t.id})\">🗑</button>\n    </li>\n  `).join('');\n}\n```",
          },
          {
            title: "Проєкт: Weather App",
            videoUrl: JS,
            duration: 45,
            order: 2,
            isFree: false,
            content:
              "## Weather App з OpenWeather API\n\n```javascript\nconst API_KEY = 'your_api_key';\n\nasync function getWeather(city) {\n  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ua`;\n  \n  const res = await fetch(url);\n  if (!res.ok) throw new Error('Місто не знайдено');\n  const data = await res.json();\n  \n  return {\n    city: data.name,\n    temp: Math.round(data.main.temp),\n    feels: Math.round(data.main.feels_like),\n    desc: data.weather[0].description,\n    icon: data.weather[0].icon,\n  };\n}\n\nasync function showWeather() {\n  const city = document.getElementById('city').value;\n  try {\n    const weather = await getWeather(city);\n    document.getElementById('result').innerHTML = `\n      <h2>${weather.city}</h2>\n      <p>${weather.temp}°C — ${weather.desc}</p>\n    `;\n  } catch (e) {\n    alert(e.message);\n  }\n}\n```",
          },
          {
            title: "Проєкт: Quiz Game",
            videoUrl: JS,
            duration: 50,
            order: 3,
            isFree: false,
            content:
              "## Quiz Game\n\n```javascript\nconst questions = [\n  {\n    q: 'Що таке JavaScript?',\n    options: ['Мова розмітки', 'Мова програмування', 'CSS фреймворк', 'База даних'],\n    answer: 1\n  },\n  // ...\n];\n\nlet current = 0;\nlet score = 0;\n\nfunction showQuestion() {\n  const q = questions[current];\n  document.getElementById('question').textContent = q.q;\n  document.getElementById('options').innerHTML = \n    q.options.map((opt, i) => `\n      <button onclick=\"answer(${i})\">${opt}</button>\n    `).join('');\n  document.getElementById('progress').textContent = \n    `${current + 1}/${questions.length}`;\n}\n\nfunction answer(idx) {\n  if (idx === questions[current].answer) score++;\n  current++;\n  if (current < questions.length) showQuestion();\n  else showResult();\n}\n```",
          },
          {
            title: "Проєкт: SPA роутер",
            videoUrl: JS,
            duration: 35,
            order: 4,
            isFree: false,
            content:
              "## Простий SPA роутер\n\n```javascript\nconst routes = {\n  '/': HomeComponent,\n  '/about': AboutComponent,\n  '/contact': ContactComponent,\n};\n\nfunction navigate(path) {\n  history.pushState({}, '', path);\n  render();\n}\n\nfunction render() {\n  const path = window.location.pathname;\n  const Component = routes[path] || NotFoundComponent;\n  document.getElementById('app').innerHTML = Component();\n}\n\n// Ініціалізація\nwindow.addEventListener('popstate', render);\ndocument.addEventListener('click', e => {\n  if (e.target.tagName === 'A' && e.target.href) {\n    e.preventDefault();\n    navigate(new URL(e.target.href).pathname);\n  }\n});\nrender();\n```",
          },
          {
            title: "🏆 Фінал та сертифікат",
            videoUrl: JS,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "# Вітаємо з завершенням курсу! 🎉\n\nТи засвоїв:\n✅ Основи JavaScript (змінні, типи, функції)\n✅ DOM маніпуляції та події\n✅ Асинхронне програмування (Promise, async/await)\n✅ ES6+ можливості\n✅ 4 реальних проєкти\n\n## Що далі?\n- **React** — популярна UI бібліотека\n- **Node.js** — JS на сервері\n- **TypeScript** — типізований JS\n\n[📥 ЗАВАНТАЖИТИ СЕРТИФІКАТ](/api/courses/js-certificate.pdf)",
          },
        ],
      },
      {
        title: "Бонусний модуль",
        order: 5,
        lessons: [
          {
            title: "TypeScript за 30 хвилин",
            videoUrl: JS,
            duration: 30,
            order: 1,
            isFree: false,
            content:
              "```typescript\n// Базові типи\nlet name: string = 'Іван';\nlet age: number = 20;\nlet active: boolean = true;\n\n// Interface\ninterface User {\n  id: number;\n  name: string;\n  email?: string;\n}\n\n// Generic\nfunction first<T>(arr: T[]): T {\n  return arr[0];\n}\n```",
          },
          {
            title: "Webpack та Vite",
            videoUrl: JS,
            duration: 25,
            order: 2,
            isFree: false,
            content:
              "```bash\n# Vite проєкт\nnpm create vite@latest my-app\ncd my-app && npm install && npm run dev\n\n# vite.config.js\nimport { defineConfig } from 'vite';\nexport default defineConfig({\n  server: { port: 3000 },\n  build: { outDir: 'dist' }\n});\n```",
          },
          {
            title: "Jest: тестування",
            videoUrl: JS,
            duration: 22,
            order: 3,
            isFree: false,
            content:
              "```javascript\n// sum.js\nexport function sum(a, b) { return a + b; }\n\n// sum.test.js\nimport { sum } from './sum';\n\ntest('додає 1 + 2 = 3', () => {\n  expect(sum(1, 2)).toBe(3);\n});\n\ntest('масив має 3 елементи', () => {\n  expect([1,2,3]).toHaveLength(3);\n});\n\n// npx jest\n```",
          },
          {
            title: "Performance та оптимізація",
            videoUrl: JS,
            duration: 20,
            order: 4,
            isFree: false,
            content:
              "```javascript\n// Debounce\nfunction debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\n\n// Throttle\nfunction throttle(fn, limit) {\n  let inThrottle;\n  return (...args) => {\n    if (!inThrottle) {\n      fn(...args);\n      inThrottle = true;\n      setTimeout(() => inThrottle = false, limit);\n    }\n  };\n}\n\n// Lazy loading\nconst observer = new IntersectionObserver(entries => {\n  entries.forEach(e => {\n    if (e.isIntersecting) {\n      e.target.src = e.target.dataset.src;\n    }\n  });\n});\n```",
          },
          {
            title: "📄 Повний конспект JS курсу",
            videoUrl: JS,
            duration: 5,
            order: 5,
            isFree: false,
            content:
              "# Конспект: JavaScript Повний курс\n\n## Змінні\n- `const` для констант, `let` для змінних\n- Деструктуризація: `const {a, b} = obj`\n- Spread: `[...arr, 4, 5]`\n\n## Функції\n- Стрілкові: `const fn = (x) => x * 2`\n- Замикання: доступ до зовнішнього scope\n- Async: `async function fn() { await ... }`\n\n## DOM\n- querySelector, addEventListener\n- classList, textContent, innerHTML\n- Event delegation\n\n## Асинхронність\n- Promise: `.then().catch()`\n- async/await з try/catch\n- Promise.all для паралельних запитів\n\n## ES6+\n- Optional chaining `?.`\n- Nullish coalescing `??`\n- Dynamic import()\n- Модулі: import/export\n\n[📥 ЗАВАНТАЖИТИ КОНСПЕКТ PDF](/api/courses/js-full-summary.pdf)",
          },
        ],
      },
    ],
  );

  // ── Git ──────────────────────────────────────────────────────────
  await mkCourse(
    {
      title: "Git та GitHub: Майстер-клас",
      shortDesc: "Контроль версій від новачка до профі",
      description:
        "Повний курс Git: від init до CI/CD. Branching, merging, rebasing, GitHub Actions та командна робота.",
      coverUrl:
        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80",
      price: 0,
      isFree: true,
      level: "BEGINNER",
      category: "Tools",
      duration: 300,
      published: true,
    },
    [
      {
        title: "Основи Git",
        order: 1,
        lessons: [
          {
            title: "Ініціалізація та перший коміт",
            videoUrl: GIT,
            duration: 15,
            order: 1,
            isFree: true,
            content:
              "```bash\ngit init\ngit add .\ngit commit -m 'feat: initial commit'\ngit log --oneline\n```",
          },
          {
            title: "Гілки та злиття",
            videoUrl: GIT,
            duration: 20,
            order: 2,
            isFree: true,
            content:
              "```bash\ngit checkout -b feature/login\ngit merge feature/login\ngit branch -d feature/login\n```",
          },
          {
            title: ".gitignore та налаштування",
            videoUrl: GIT,
            duration: 12,
            order: 3,
            isFree: false,
            content:
              "```\nnode_modules/\n.env\n*.log\ndist/\n```\n\n```bash\ngit config --global user.name 'Іван'\ngit config --global user.email 'ivan@mail.com'\n```",
          },
          {
            title: "Stash та cherry-pick",
            videoUrl: GIT,
            duration: 18,
            order: 4,
            isFree: false,
            content:
              "```bash\ngit stash\ngit stash pop\ngit cherry-pick abc123\n```",
          },
          {
            title: "🧪 Тест: Основи Git",
            videoUrl: GIT,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Яка команда ініціалізує репозиторій?**\n- a) git start\n- b) git init ✅\n- c) git create\n- d) git new\n\n**2. Що таке staging area?**\n- a) Готові файли для коміту ✅\n- b) Видалені файли\n- c) Конфлікти\n- d) Гілка\n\n**3. Як скасувати останній коміт?**\n- a) git undo\n- b) git revert HEAD ✅\n- c) git delete\n- d) git remove\n\n**4. Що робить git stash?**\n- a) Зберігає зміни тимчасово ✅\n- b) Видаляє файли\n- c) Злиття гілок\n- d) Публікація\n\n**5. Що таке HEAD?**\n- a) Перший коміт\n- b) Поточний коміт/гілка ✅\n- c) Віддалений репозиторій\n- d) Конфлікт",
          },
        ],
      },
      {
        title: "GitHub",
        order: 2,
        lessons: [
          {
            title: "Push та Pull Requests",
            videoUrl: GIT,
            duration: 25,
            order: 1,
            isFree: false,
            content:
              "```bash\ngit remote add origin https://github.com/user/repo.git\ngit push origin main\ngit pull origin main\n```",
          },
          {
            title: "Code Review та коментарі",
            videoUrl: GIT,
            duration: 20,
            order: 2,
            isFree: false,
            content:
              "## Хороший PR\n✅ Одна задача\n✅ Описовий заголовок\n✅ Скріншоти для UI змін\n✅ Посилання на issue",
          },
          {
            title: "GitHub Actions: CI/CD",
            videoUrl: GIT,
            duration: 30,
            order: 3,
            isFree: false,
            content:
              "```yaml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm test\n```",
          },
          {
            title: "GitHub Pages та деплой",
            videoUrl: GIT,
            duration: 20,
            order: 4,
            isFree: false,
            content:
              "```yaml\n# .github/workflows/deploy.yml\nname: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n      - uses: peaceiris/actions-gh-pages@v3\n        with:\n          github_token: ${{ secrets.GITHUB_TOKEN }}\n          publish_dir: ./dist\n```",
          },
          {
            title: "📄 Конспект Git",
            videoUrl: GIT,
            duration: 5,
            order: 5,
            isFree: false,
            content:
              "# Конспект: Git та GitHub\n\n## Основні команди\n- `git init` — ініціалізація\n- `git add .` — staging\n- `git commit -m 'msg'` — коміт\n- `git push/pull` — синхронізація\n- `git checkout -b branch` — нова гілка\n- `git merge` — злиття\n- `git stash` — тимчасове збереження\n\n## GitHub Flow\n1. Fork або clone\n2. Нова гілка\n3. Коміти\n4. Push\n5. Pull Request\n6. Code Review\n7. Merge\n\n[📥 ЗАВАНТАЖИТИ КОНСПЕКТ](/api/courses/git-summary.pdf)",
          },
        ],
      },
      {
        title: "Просунутий Git",
        order: 3,
        lessons: [
          {
            title: "Rebase та інтерактивний rebase",
            videoUrl: GIT,
            duration: 25,
            order: 1,
            isFree: false,
            content:
              "```bash\ngit rebase main\ngit rebase -i HEAD~3  # squash 3 коміти\n```",
          },
          {
            title: "Вирішення конфліктів",
            videoUrl: GIT,
            duration: 22,
            order: 2,
            isFree: false,
            content:
              "```bash\ngit merge feature\n# Конфлікт у файлі\ngit add resolved_file.js\ngit commit\n```",
          },
          {
            title: "Git hooks",
            videoUrl: GIT,
            duration: 18,
            order: 3,
            isFree: false,
            content:
              "```bash\n# .git/hooks/pre-commit\n#!/bin/sh\nnpm run lint && npm test\n```",
          },
          {
            title: "Monorepo та підмодулі",
            videoUrl: GIT,
            duration: 20,
            order: 4,
            isFree: false,
            content:
              "```bash\ngit submodule add https://github.com/user/lib.git\ngit submodule update --init --recursive\n```",
          },
          {
            title: "🧪 Фінальний тест Git",
            videoUrl: GIT,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Тест\n\n**1. Різниця merge та rebase?**\n- a) Немає різниці\n- b) Rebase переписує історію, merge зберігає ✅\n- c) Merge швидший\n- d) Rebase тільки для pull\n\n**2. Що таке squash?**\n- a) Видалення гілки\n- b) Об'єднання кількох комітів в один ✅\n- c) Скасування змін\n- d) Форк репозиторію\n\n**3. Для чого git hooks?**\n- a) Декорація гілок\n- b) Автоматичні скрипти на події ✅\n- c) Захист від merge\n- d) Backup\n\n**4. Що таке submodule?**\n- a) Гілка\n- b) Вкладений репозиторій ✅\n- c) Тег\n- d) Stash\n\n**5. Що таке cherry-pick?**\n- a) Вибір гілки\n- b) Застосування конкретного коміту ✅\n- c) Злиття\n- d) Скасування",
          },
        ],
      },
      {
        title: "Робочі процеси",
        order: 4,
        lessons: [
          {
            title: "Git Flow",
            videoUrl: GIT,
            duration: 20,
            order: 1,
            isFree: false,
            content:
              "## Гілки Git Flow\n- `main` — production\n- `develop` — інтеграція\n- `feature/*` — нові функції\n- `release/*` — підготовка релізу\n- `hotfix/*` — термінові виправлення",
          },
          {
            title: "Trunk-based Development",
            videoUrl: GIT,
            duration: 18,
            order: 2,
            isFree: false,
            content:
              "## Trunk-based\n- Часті коміти в main\n- Feature flags замість гілок\n- CI/CD на кожен push",
          },
          {
            title: "Semantic Versioning",
            videoUrl: GIT,
            duration: 15,
            order: 3,
            isFree: false,
            content:
              "## SemVer: MAJOR.MINOR.PATCH\n- `1.0.0` → `1.0.1` — виправлення\n- `1.0.1` → `1.1.0` — нова функція\n- `1.1.0` → `2.0.0` — breaking change",
          },
          {
            title: "Conventional Commits",
            videoUrl: GIT,
            duration: 15,
            order: 4,
            isFree: false,
            content:
              "```\nfeat: add user authentication\nfix: resolve login redirect bug\ndocs: update API documentation\nchore: update dependencies\nrefactor: extract auth service\ntest: add unit tests for auth\n```",
          },
          {
            title: "Практика та підсумок",
            videoUrl: GIT,
            duration: 10,
            order: 5,
            isFree: false,
            content:
              "## Фінал\n✅ Основи Git\n✅ GitHub та PR\n✅ CI/CD\n✅ Просунуті техніки\n✅ Робочі процеси\n\n[📥 КОНСПЕКТ](/api/courses/git-full.pdf)",
          },
        ],
      },
      {
        title: "Бонус: GitHub CLI",
        order: 5,
        lessons: [
          {
            title: "GitHub CLI встановлення",
            videoUrl: GIT,
            duration: 10,
            order: 1,
            isFree: false,
            content:
              "```bash\nbrew install gh  # macOS\ngh auth login\ngh repo create my-project\n```",
          },
          {
            title: "PR через CLI",
            videoUrl: GIT,
            duration: 12,
            order: 2,
            isFree: false,
            content:
              "```bash\ngh pr create --title 'feat: add login' --body 'Description'\ngh pr list\ngh pr merge 42\n```",
          },
          {
            title: "Issues та Projects",
            videoUrl: GIT,
            duration: 10,
            order: 3,
            isFree: false,
            content:
              "```bash\ngh issue create --title 'Bug: login fails'\ngh issue list\ngh issue close 15\n```",
          },
          {
            title: "GitHub CLI workflow",
            videoUrl: GIT,
            duration: 15,
            order: 4,
            isFree: false,
            content:
              "```bash\n# Повний workflow\ngh repo fork user/repo --clone\ngh checkout -b fix/bug\ngit commit -am 'fix: resolve bug'\ngh pr create\n```",
          },
          {
            title: "📄 Бонусний конспект",
            videoUrl: GIT,
            duration: 5,
            order: 5,
            isFree: false,
            content:
              "# GitHub CLI Шпаргалка\n\n```bash\ngh auth login       # авторизація\ngh repo create      # новий репо\ngh pr create        # новий PR\ngh pr list          # список PR\ngh issue create     # новий issue\ngh run list         # Actions запуски\n```\n\n[📥 ЗАВАНТАЖИТИ](/api/courses/gh-cli.pdf)",
          },
        ],
      },
    ],
  );

  console.log("\n🎉 Всі курси створено!");
  console.log("http://localhost:5173/learn");
}

main()
  .catch((e) => {
    console.error("❌", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
