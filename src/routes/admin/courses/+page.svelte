<script lang="ts">
  // src/routes/admin/courses/+page.svelte
  import { enhance } from '$app/forms';
  import { fade, slide, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  let { data, form } = $props();

  // --- Стейт інтерфейсу ---
  let showModal = $state(false);
  let loading = $state(false);
  let activeTab = $state('general');
  let searchTerm = $state('');

  // --- Стейт форми ---
  let title = $state('');
  let description = $state('');
  let category = $state('IT & Розробка');
  let isPaid = $state(false);

  // Конструктор уроків
  let lessons = $state([
    { id: crypto.randomUUID(), title: '', videoUrl: '', summary: '', testUrl: '', expanded: true }
  ]);

  // --- Функції логіки ---
  function addLesson() {
    lessons = [...lessons, { id: crypto.randomUUID(), title: '', videoUrl: '', summary: '', testUrl: '', expanded: true }];
  }

  function removeLesson(id: string) {
    if (lessons.length > 1) lessons = lessons.filter(l => l.id !== id);
  }

  const toggleLesson = (id: string) => {
    lessons = lessons.map(l => l.id === id ? { ...l, expanded: !l.expanded } : l);
  };

  // Пошук
  let filteredCourses = $derived(
          data.courses?.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())) || []
  );

  // Допоміжні стилі для IDE (щоб не було "Statement expected")
  const inputStyle = "width: 100%; background: #0f172a; border: 1px solid #1e293b; color: white; padding: 12px 16px; border-radius: 12px; font-size: 1rem; outline: none; transition: all 0.2s;";
  const labelStyle = "display: block; margin-bottom: 8px; font-size: 0.85rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.025em;";
</script>

<div class="admin-container" style="min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif;">

  <header style="max-width: 1400px; margin: 0 auto; padding: 40px 20px; display: flex; justify-content: space-between; align-items: flex-end;">
    <div>
      <h1 style="font-size: 3rem; font-weight: 900; margin: 0; background: linear-gradient(to right, #fff, #64748b); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        Керування курсами
      </h1>
      <p style="color: #64748b; margin-top: 8px; font-size: 1.1rem;">Створюйте контент, додавайте тести та видавайте сертифікати</p>
    </div>

    <div style="display: flex; gap: 16px;">
      <div style="position: relative;">
        <input
                bind:value={searchTerm}
                placeholder="Пошук за назвою..."
                style="background: #0f172a; border: 1px solid #1e293b; padding: 12px 20px 12px 45px; border-radius: 14px; color: white; width: 300px;"
        />
        <span style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); opacity: 0.5;">🔍</span>
      </div>
      <button
              onclick={() => { showModal = true; activeTab = 'general'; }}
              style="background: #3b82f6; color: white; border: none; padding: 12px 28px; border-radius: 14px; font-weight: 700; cursor: pointer; transition: transform 0.2s; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);">
        + Новий курс
      </button>
    </div>
  </header>

  <main style="max-width: 1400px; margin: 0 auto; padding: 0 20px 60px;">

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px;">
      {#each filteredCourses as course}
        <div
                in:scale={{ duration: 400, start: 0.95, easing: quintOut }}
                style="background: #0f172a; border: 1px solid #1e293b; border-radius: 24px; overflow: hidden; position: relative; transition: border-color 0.3s;">

          <div style="height: 180px; background: linear-gradient(45deg, #1e3a8a, #3b82f6); padding: 30px; display: flex; flex-direction: column; justify-content: space-between;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <span style="background: rgba(255,255,255,0.15); backdrop-filter: blur(4px); padding: 6px 14px; border-radius: 99px; font-size: 0.75rem; font-weight: 700;">{course.category}</span>
              <div style="width: 10px; height: 10px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 10px #4ade80;"></div>
            </div>
            <h2 style="font-size: 1.5rem; font-weight: 800; margin: 0; line-height: 1.2;">{course.title}</h2>
          </div>

          <div style="padding: 24px;">
            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px; height: 3em; overflow: hidden;">{course.description}</p>

            <div style="display: flex; gap: 20px; margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 16px;">
              <div>
                <span style="display: block; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Модулі</span>
                <span style="font-size: 1.2rem; font-weight: 700;">{course._count?.modules || 0}</span>
              </div>
              <div style="width: 1px; background: #1e293b;"></div>
              <div>
                <span style="display: block; font-size: 0.7rem; color: #64748b; text-transform: uppercase;">Студенти</span>
                <span style="font-size: 1.2rem; font-weight: 700;">{course._count?.enrollments || 0}</span>
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <a href="/admin/courses/{course.id}" style="flex: 1; text-align: center; background: #1e293b; color: white; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Редагувати</a>
              <form method="POST" action="?/delete" use:enhance style="margin:0;">
                <input type="hidden" name="id" value={course.id} />
                <button style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 12px; border-radius: 12px; cursor: pointer;">✕</button>
              </form>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </main>
</div>

{#if showModal}
  <div
          transition:fade={{ duration: 200 }}
          style="position: fixed; inset: 0; background: rgba(2, 6, 23, 0.95); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 40px;">

    <div
            in:fly={{ y: 100, duration: 600, easing: quintOut }}
            style="background: #0f172a; width: 100%; max-width: 1100px; height: 90vh; border-radius: 32px; border: 1px solid #1e293b; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">

      <header style="padding: 24px 40px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; gap: 32px;">
          {#each ['general', 'lessons', 'certificate'] as tab}
            <button
                    onclick={() => activeTab = tab}
                    style="background: none; border: none; color: {activeTab === tab ? '#3b82f6' : '#64748b'}; font-weight: 800; font-size: 1.1rem; cursor: pointer; position: relative; padding: 8px 0;">
              {tab === 'general' ? '1. Інформація' : tab === 'lessons' ? '2. Програма' : '3. Сертифікат'}
              {#if activeTab === tab}
                <div in:scale style="position: absolute; bottom: -25px; left: 0; width: 100%; height: 4px; background: #3b82f6; border-radius: 2px;"></div>
              {/if}
            </button>
          {/each}
        </div>
        <button onclick={() => showModal = false} style="background: none; border: none; color: #64748b; font-size: 1.5rem; cursor: pointer;">✕</button>
      </header>

      <form
              method="POST"
              action="?/create"
              use:enhance={() => {
        loading = true;
        return async ({ update }) => { await update(); loading = false; showModal = false; };
      }}
              style="flex: 1; overflow-y: auto; padding: 40px;">

        <input type="hidden" name="lessons" value={JSON.stringify(lessons)} />

        {#if activeTab === 'general'}
          <div in:fade style="display: flex; flex-direction: column; gap: 24px;">
            <div>
              <label style={labelStyle}>Назва курсу</label>
              <input name="title" bind:value={title} placeholder="Введіть назву..." required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Повний опис / Конспект</label>
              <textarea name="description" bind:value={description} rows="6" placeholder="Про що цей курс?" style={inputStyle}></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
              <div>
                <label style={labelStyle}>Категорія</label>
                <select name="category" bind:value={category} style={inputStyle}>
                  <option>IT & Розробка</option>
                  <option>Кібербезпека</option>
                  <option>Дизайн</option>
                  <option>3D Моделювання</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Доступ</label>
                <select bind:value={isPaid} style={inputStyle}>
                  <option value={false}>Безкоштовно</option>
                  <option value={true}>Платний курс</option>
                </select>
              </div>
            </div>
          </div>

        {:else if activeTab === 'lessons'}
          <div in:fade>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <h3 style="font-size: 1.25rem; font-weight: 800;">Структура навчання</h3>
              <button type="button" onclick={addLesson} style="background: #1e293b; color: #3b82f6; border: 1px solid #1e293b; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer;">+ Додати урок</button>
            </div>

            {#each lessons as lesson, i (lesson.id)}
              <div style="background: #020617; border: 1px solid #1e293b; border-radius: 20px; margin-bottom: 16px; overflow: hidden;">
                <div
                        onclick={() => toggleLesson(lesson.id)}
                        style="padding: 20px; display: flex; justify-content: space-between; cursor: pointer; background: rgba(255,255,255,0.02);">
                  <span style="font-weight: 700; color: #3b82f6;">#{i+1} {lesson.title || 'Новий урок'}</span>
                  <button type="button" onclick={(e) => { e.stopPropagation(); removeLesson(lesson.id); }} style="background:none; border:none; color:#ef4444;">Видалити</button>
                </div>

                {#if lesson.expanded}
                  <div style="padding: 24px; border-top: 1px solid #1e293b; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;" transition:slide>
                    <div style="grid-column: span 2;">
                      <label style={labelStyle}>Заголовок уроку</label>
                      <input bind:value={lesson.title} placeholder="Вступ до Svelte 5..." style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Відео URL</label>
                      <input bind:value={lesson.videoUrl} placeholder="YouTube/Vimeo" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Тест URL</label>
                      <input bind:value={lesson.testUrl} placeholder="Google Forms" style={inputStyle} />
                    </div>
                    <div style="grid-column: span 2;">
                      <label style={labelStyle}>Конспект уроку</label>
                      <textarea bind:value={lesson.summary} rows="3" placeholder="Текст уроку..." style={inputStyle}></textarea>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>

        {:else if activeTab === 'certificate'}
          <div in:fade style="text-align: center;">
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 30px;">Макет сертифікату для випускників</h3>

            <div style="background: white; color: #020617; width: 600px; height: 420px; margin: 0 auto; border: 20px solid #0f172a; padding: 40px; box-sizing: border-box; position: relative;">
              <div style="border: 2px solid #3b82f6; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h1 style="font-size: 2.5rem; margin: 0; color: #0f172a;">СЕРТИФІКАТ</h1>
                <p style="font-size: 0.9rem; margin-top: 10px;">Це підтверджує, що</p>
                <h2 style="font-size: 1.8rem; font-family: serif; font-style: italic; border-bottom: 2px solid #3b82f6; padding: 0 20px; margin: 15px 0;">Nastia (Student)</h2>
                <p style="font-size: 0.9rem;">Успішно закінчила курс</p>
                <h3 style="font-size: 1.3rem; color: #3b82f6; margin-top: 5px;">{title || 'Назва курсу'}</h3>

                <div style="margin-top: 30px; width: 100%; display: flex; justify-content: space-between; font-size: 0.7rem; padding: 0 40px;">
                  <span>Дата: {new Date().toLocaleDateString()}</span>
                  <span>LvUp Academy</span>
                </div>
              </div>
              <div style="position: absolute; bottom: 30px; right: 30px; width: 60px; height: 60px; border: 4px double #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #3b82f6; font-weight: 900; font-size: 0.6rem; transform: rotate(-15deg); opacity: 0.5;">STAMP</div>
            </div>

            <div style="margin-top: 40px; max-width: 400px; margin-inline: auto;">
              <label style={labelStyle}>Оберіть стиль</label>
              <select name="template" style={inputStyle}>
                <option>Modern Blue (Стандарт)</option>
                <option>Elegant Gold</option>
                <option>Cyber Dark</option>
              </select>
            </div>
          </div>
        {/if}

        <footer style="margin-top: 40px; border-top: 1px solid #1e293b; padding-top: 30px; display: flex; justify-content: flex-end; gap: 16px;">
          <button type="button" onclick={() => showModal = false} style="padding: 12px 24px; background: none; border: 1px solid #1e293b; color: #64748b; border-radius: 12px; cursor: pointer;">Скасувати</button>

          {#if activeTab === 'general'}
            <button type="button" onclick={() => activeTab = 'lessons'} style="padding: 12px 32px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">Далі до уроків</button>
          {:else if activeTab === 'lessons'}
            <button type="button" onclick={() => activeTab = 'certificate'} style="padding: 12px 32px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer;">Далі до сертифікату</button>
          {:else}
            <button
                    type="submit"
                    name="status"
                    value="PUBLISHED"
                    disabled={loading}
                    style="padding: 12px 40px; background: #4ade80; color: #064e3b; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; opacity: {loading ? 0.5 : 1};">
              {loading ? 'Зберігаємо...' : 'Опублікувати курс'}
            </button>
          {/if}
        </footer>
      </form>
    </div>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }

  input:focus, textarea:focus, select:focus {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  /* Скролбар */
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background: #020617;
  }
  ::-webkit-scrollbar-thumb {
    background: #1e293b;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
  }
</style>