<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  interface CourseRow {
    id: string;
    title: string;
    status: string;
    category: string;
    isPaid: boolean;
    certTemplate: { id: string; name: string } | null;
    _count: { modules: number; enrollments: number };
  }

  const published = $derived((data.courses as CourseRow[]).filter(c => c.status === 'PUBLISHED'));
  const drafts    = $derived((data.courses as CourseRow[]).filter(c => c.status === 'DRAFT'));

  let showModal  = $state(false);
  let modLoading = $state(false);

  let title    = $state('');
  let desc     = $state('');
  let category = $state('Програмування');
  let modules: string[] = $state(['']);

  function addModule()              { modules = [...modules, '']; }
  function removeModule(i: number)  { modules = modules.filter((_, idx) => idx !== i); }
  function closeModal(e: MouseEvent) {
    if (e.target === e.currentTarget) showModal = false;
  }

  const categoryIcons: Record<string, string> = {
    'Програмування': '< >',
    'Бази даних': '🗄',
    'Дизайн': '🎨',
    'Загальне': '📚',
  };
  const categoryColors: Record<string, string> = {
    'Програмування': '#166534',
    'Бази даних': '#1e3a5f',
    'Дизайн': '#4c1d95',
    'Загальне': '#1e3a5f',
  };
</script>

<svelte:head><title>Курси — LvUp Admin</title></svelte:head>

<div style="max-width:1100px;margin:0 auto;padding:2rem;">

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
    <div>
      <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin:0 0 4px;">Адмін / Курси</p>
      <h1 style="margin:0;font-size:1.75rem;font-weight:800;">Курси</h1>
    </div>
    <button onclick={() => showModal = true}
            style="background:#3E83FF;color:#fff;padding:0.7rem 1.4rem;border-radius:10px;
             border:none;font-weight:600;font-size:0.95rem;cursor:pointer;">
      + Створити курс
    </button>
  </div>

  {#if form?.error}
    <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                color:#f87171;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;">
      {form.error}
    </div>
  {/if}

  <!-- Опубліковані -->
  {#if published.length > 0}
    <div style="margin-bottom:2rem;">
      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;">
        <span style="width:3px;height:16px;background:#3E83FF;border-radius:2px;display:block;"></span>
        <p style="margin:0;font-size:0.78rem;font-weight:700;color:rgba(255,255,255,0.45);
                  text-transform:uppercase;letter-spacing:0.08em;">
          Опубліковані ({published.length})
        </p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;">
        {#each published as c}
          <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;">
            <div style="background:{categoryColors[c.category] ?? '#1e3a5f'};
                        height:120px;display:flex;align-items:center;justify-content:center;position:relative;">
              <span style="font-size:2.5rem;" aria-hidden="true">{categoryIcons[c.category] ?? '📘'}</span>
              <span style="position:absolute;top:10px;right:10px;background:{c.isPaid ? '#92400e' : '#14532d'};
                           color:{c.isPaid ? '#fbbf24' : '#4ade80'};padding:3px 10px;border-radius:20px;
                           font-size:0.75rem;font-weight:600;">
                {c.isPaid ? 'Платний' : 'Безкоштовно'}
              </span>
            </div>
            <div style="padding:1rem;">
              <h3 style="margin:0 0 4px;font-size:1rem;font-weight:700;">{c.title}</h3>
              <p style="margin:0 0 0.75rem;font-size:0.82rem;color:rgba(255,255,255,0.45);">
                {c._count.modules} модулів · {c._count.enrollments} учасників
              </p>
              <div style="display:flex;gap:0.5rem;">
                <a href="/admin/courses/{c.id}/edit"
                   style="padding:0.4rem 0.9rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;
                          color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.82rem;">
                  Редагувати
                </a>
                <a href="/admin/courses/{c.id}/participants"
                   style="padding:0.4rem 0.9rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;
                          color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.82rem;">
                  Учасники
                </a>
                <form method="POST" action="?/delete" use:enhance style="margin:0;">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit"
                          style="padding:0.4rem 0.9rem;border:1px solid rgba(248,113,113,0.2);border-radius:8px;
                           color:#f87171;background:none;font-size:0.82rem;cursor:pointer;">
                    Видалити
                  </button>
                </form>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Чернетки -->
  {#if drafts.length > 0}
    <div>
      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;">
        <span style="width:3px;height:16px;background:rgba(255,255,255,0.2);border-radius:2px;display:block;"></span>
        <p style="margin:0;font-size:0.78rem;font-weight:700;color:rgba(255,255,255,0.45);
                  text-transform:uppercase;letter-spacing:0.08em;">
          Чернетки ({drafts.length})
        </p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1rem;">
        {#each drafts as c}
          <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:14px;overflow:hidden;opacity:0.8;">
            <div style="background:#1a1f2e;height:120px;display:flex;align-items:center;justify-content:center;position:relative;">
              <span style="font-size:2rem;opacity:0.4;" aria-hidden="true">{categoryIcons[c.category] ?? '📘'}</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.08);
                           color:rgba(255,255,255,0.5);padding:3px 10px;border-radius:20px;font-size:0.75rem;">
                Чернетка
              </span>
            </div>
            <div style="padding:1rem;">
              <h3 style="margin:0 0 4px;font-size:1rem;font-weight:700;">{c.title}</h3>
              <p style="margin:0 0 0.75rem;font-size:0.82rem;color:rgba(255,255,255,0.4);">
                {c._count.modules} модулів · не опубліковано
              </p>
              <div style="display:flex;gap:0.5rem;">
                <a href="/admin/courses/{c.id}/edit"
                   style="padding:0.4rem 0.9rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;
                          color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.82rem;">
                  Редагувати
                </a>
                <form method="POST" action="?/publish" use:enhance style="margin:0;">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit"
                          style="padding:0.4rem 0.9rem;border:none;border-radius:8px;
                           color:#4ade80;background:rgba(34,197,94,0.1);font-size:0.82rem;
                           cursor:pointer;font-weight:600;">
                    Опублікувати
                  </button>
                </form>
                <form method="POST" action="?/delete" use:enhance style="margin:0;">
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit"
                          style="padding:0.4rem 0.9rem;border:1px solid rgba(248,113,113,0.2);border-radius:8px;
                           color:#f87171;background:none;font-size:0.82rem;cursor:pointer;">
                    Видалити
                  </button>
                </form>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- ─── Модалка "Новий курс" ────────────────────────────────────────────────── -->
{#if showModal}
  <div
          role="presentation"
          style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;
           display:flex;align-items:center;justify-content:center;padding:1rem;"
          onclick={closeModal}>

    <div style="background:#0d1b3e;border:1px solid rgba(62,131,255,0.2);border-radius:16px;
                padding:2rem;width:100%;max-width:580px;max-height:90vh;overflow-y:auto;">

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;">
        <h2 style="margin:0;font-size:1.25rem;font-weight:700;">Новий курс</h2>
        <button onclick={() => showModal = false}
                style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;font-size:1.25rem;"
                aria-label="Закрити">✕</button>
      </div>

      <form method="POST" action="?/create" use:enhance={({ formData }) => {
        formData.set('modules', JSON.stringify(modules));
        modLoading = true;
        return async ({ update }) => { await update(); modLoading = false; showModal = false; };
      }}>

        <div style="margin-bottom:1rem;">
          <label for="course-title"
                 style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
            Назва курсу *
          </label>
          <input id="course-title" name="title" required bind:value={title}
                 placeholder="Python для початківців"
                 style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                   padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
        </div>

        <div style="margin-bottom:1rem;">
          <label for="course-desc"
                 style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
            Короткий опис *
          </label>
          <textarea id="course-desc" name="description" required bind:value={desc} rows={3}
                    placeholder="Про що курс, для кого він, що отримає учасник..."
                    style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                   padding:0.8rem 1rem;color:#fff;font-size:0.95rem;outline:none;
                   box-sizing:border-box;resize:vertical;font-family:inherit;"></textarea>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
          <div>
            <label for="course-category"
                   style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
              Категорія
            </label>
            <select id="course-category" name="category" bind:value={category}
                    style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                     padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
              {#each ['Програмування', 'Бази даних', 'Дизайн', 'Загальне'] as cat}
                <option value={cat}>{cat}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="course-access"
                   style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
              Тип доступу
            </label>
            <select id="course-access" name="isPaid"
                    style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                     padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
              <option value="false">Безкоштовно</option>
              <option value="true">Платний</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:1rem;">
          <label for="course-cert"
                 style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
            Сертифікат після завершення <span style="opacity:0.5;">(необов'язково)</span>
          </label>
          <select id="course-cert" name="certTemplateId"
                  style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                   padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
            <option value="">Без сертифіката</option>
            {#each data.certTemplates as t}
              <option value={t.id}>{t.name}</option>
            {/each}
          </select>
        </div>

        <!-- Модулі -->
        <div style="margin-bottom:1.5rem;">
          <p style="font-size:0.82rem;color:rgba(255,255,255,0.5);margin:0 0 0.6rem;">Модулі курсу</p>
          {#each modules as _mod, i}
            <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem;">
              <label for="module-{i}" class="sr-only">Модуль {i + 1}</label>
              <input id="module-{i}" bind:value={modules[i]}
                     placeholder="Модуль {i + 1}: Назва..."
                     style="flex:1;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.7rem 1rem;color:#fff;font-size:0.95rem;outline:none;box-sizing:border-box;" />
              {#if modules.length > 1}
                <button type="button" onclick={() => removeModule(i)}
                        aria-label="Видалити модуль {i + 1}"
                        style="background:none;border:1px solid rgba(248,113,113,0.2);border-radius:8px;
                         color:#f87171;padding:0 0.75rem;cursor:pointer;font-size:1rem;">✕</button>
              {/if}
            </div>
          {/each}
          <button type="button" onclick={addModule}
                  style="background:none;border:1px dashed rgba(255,255,255,0.15);border-radius:10px;
                   color:rgba(255,255,255,0.5);padding:0.6rem 1rem;cursor:pointer;font-size:0.875rem;
                   width:100%;margin-top:4px;">
            + Додати модуль
          </button>
        </div>

        <div style="display:flex;gap:0.75rem;justify-content:flex-end;">
          <button type="button" onclick={() => showModal = false}
                  style="padding:0.75rem 1.25rem;border:1px solid rgba(255,255,255,0.12);border-radius:10px;
                   color:rgba(255,255,255,0.6);background:none;font-size:0.95rem;cursor:pointer;">
            Скасувати
          </button>
          <button type="submit" disabled={modLoading}
                  style="padding:0.75rem 1.5rem;background:#3E83FF;border:none;border-radius:10px;
                   color:#fff;font-size:0.95rem;font-weight:600;cursor:pointer;
                   opacity:{modLoading ? '0.6' : '1'}">
            {modLoading ? 'Створюємо...' : 'Створити курс'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>