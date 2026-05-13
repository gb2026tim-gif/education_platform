<script lang="ts">
  // src/routes/admin/tournaments/create/+page.svelte
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let loading = $state(false);

  // Прев'ю
  let title       = $state('');
  let rounds      = $state('1 раунд');
  let minTeam     = $state(2);
  let maxTeam     = $state(5);
  let regStart    = $state('');
  let regEnd      = $state('');
  let startAt     = $state('');
  let taskDeadline = $state('');

  function fmt(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  }
</script>

<svelte:head><title>Створити турнір — LvUp Admin</title></svelte:head>

<div style="max-width:1100px;margin:0 auto;padding:2rem;">

  <div style="margin-bottom:2rem;">
    <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin:0 0 4px;">
      <a href="/admin/tournaments" style="color:#3E83FF;text-decoration:none;">Турніри</a>
      / Новий турнір
    </p>
    <h1 style="margin:0;font-size:1.75rem;font-weight:800;">Створити турнір</h1>
  </div>

  {#if form?.error}
    <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                color:#f87171;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;">
      {form.error}
    </div>
  {/if}

  <form method="POST" action="?/create" use:enhance={() => {
    loading = true;
    return async ({ update }) => { await update(); loading = false; };
  }}>
    <div style="display:grid;grid-template-columns:1fr 340px;gap:1.5rem;align-items:start;">

      <!-- Ліва колонка: форма -->
      <div style="display:flex;flex-direction:column;gap:1.25rem;">

        <!-- Основна інформація -->
        <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
            <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
            <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;color:rgba(255,255,255,0.5);">Основна інформація</h2>
          </div>

          <div style="margin-bottom:1rem;">
            <label for="t-title" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
              Назва турніру *
            </label>
            <input id="t-title" name="title" required bind:value={title} placeholder="Hackathon Spring 2026"
                   style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                     padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
          </div>

          <div style="margin-bottom:1rem;">
            <label for="t-desc" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
              Організатор / опис *
            </label>
            <textarea id="t-desc" name="description" required rows="4"
                      placeholder="CODE4FUTURE · Командний турнір з програмування для школярів та студентів..."
                      style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                     padding:0.85rem 1rem;color:#fff;font-size:0.95rem;outline:none;
                     box-sizing:border-box;resize:vertical;font-family:inherit;"></textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div>
              <label for="t-format" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Формат
              </label>
              <select id="t-format" name="format"
                      style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
                <option>Командний</option>
                <option>Індивідуальний</option>
              </select>
            </div>
            <div>
              <label for="t-rounds" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Кількість раундів
              </label>
              <select id="t-rounds" onchange={(e) => rounds = (e.target as HTMLSelectElement).value}
                      style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
                <option value="1 раунд">1 раунд</option>
                <option value="2 раунди">2 раунди</option>
                <option value="3 раунди">3 раунди</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Дати та реєстрація -->
        <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
            <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
            <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;color:rgba(255,255,255,0.5);">Дати та реєстрація</h2>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
            <div>
              <label for="t-regstart" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Початок реєстрації
              </label>
              <input id="t-regstart" name="regStart" type="date" bind:value={regStart}
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
            <div>
              <label for="t-regend" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Кінець реєстрації
              </label>
              <input id="t-regend" name="regEnd" type="date" bind:value={regEnd}
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
            <div>
              <label for="t-start" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Дата старту турніру
              </label>
              <input id="t-start" name="startAt" type="date" bind:value={startAt}
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
            <div>
              <label for="t-deadline" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Дедлайн здачі
              </label>
              <input id="t-deadline" name="taskDeadline" type="date" bind:value={taskDeadline}
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem;">
            <div>
              <label for="t-min" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Мін. учасників у команді
              </label>
              <input id="t-min" name="minTeamSize" type="number" min="1" max="20"
                     bind:value={minTeam}
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
            <div>
              <label for="t-max" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Макс. учасників у команді
              </label>
              <input id="t-max" name="maxTeamSize" type="number" min="1" max="20"
                     bind:value={maxTeam}
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
            <div>
              <label for="t-maxteams" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                Макс. команд <span style="opacity:0.5;">(необов'язково)</span>
              </label>
              <input id="t-maxteams" name="maxTeams" type="number" placeholder="Без обмежень"
                     style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                       padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
            </div>
          </div>
        </div>

        <!-- Вимоги до технологій -->
        <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
            <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
            <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;color:rgba(255,255,255,0.5);">Вимоги до технологій</h2>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            {#each [
              { name: 'backendReq',  label: 'Backend',   ph: 'Node.js / Python / PHP' },
              { name: 'frontendReq', label: 'Frontend',  ph: 'React / Vue / Vanilla JS' },
              { name: 'databaseReq', label: 'База даних', ph: 'PostgreSQL / MongoDB' },
              { name: 'deployReq',   label: 'Деплой',    ph: "Обов'язковий (Vercel / Railway)" },
            ] as f}
              <div>
                <label for="t-{f.name}" style="display:block;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
                  {f.label}
                </label>
                <input id="t-{f.name}" name={f.name} placeholder={f.ph}
                       style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                         padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
              </div>
            {/each}
          </div>
        </div>

        <!-- Сертифікат -->
        {#if data.certTemplates.length > 0}
          <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
            <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
              <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
              <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                         letter-spacing:0.06em;color:rgba(255,255,255,0.5);">Сертифікат</h2>
            </div>
            <select name="certTemplateId"
                    style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                     padding:0.85rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
              <option value="">— Без сертифіката —</option>
              {#each data.certTemplates as t}
                <option value={t.id}>{t.name}</option>
              {/each}
            </select>
          </div>
        {/if}

      </div>

      <!-- Права колонка: прев'ю -->
      <div style="position:sticky;top:1.5rem;">
        <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.5rem;">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
            <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
            <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.06em;color:rgba(255,255,255,0.5);">Прев'ю</h2>
          </div>

          <div style="margin-bottom:1rem;">
            <p style="font-size:0.75rem;color:rgba(255,255,255,0.35);text-transform:uppercase;
                      letter-spacing:0.06em;margin:0 0 0.5rem;">Загальне</p>
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:0.875rem;color:rgba(255,255,255,0.5);">Назва</span>
              <span style="font-size:0.875rem;font-weight:500;">{title || '—'}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
              <span style="font-size:0.875rem;color:rgba(255,255,255,0.5);">Раундів</span>
              <span style="font-size:0.875rem;font-weight:500;">{rounds}</span>
            </div>
            <div style="display:flex;justify-content:space-between;padding:6px 0;">
              <span style="font-size:0.875rem;color:rgba(255,255,255,0.5);">Учасники</span>
              <span style="font-size:0.875rem;font-weight:500;">{minTeam}–{maxTeam}</span>
            </div>
          </div>

          <div>
            <p style="font-size:0.75rem;color:rgba(255,255,255,0.35);text-transform:uppercase;
                      letter-spacing:0.06em;margin:0 0 0.5rem;">Дати</p>
            {#each [
              ['Реєстрація', regStart ? `${fmt(regStart)} — ${fmt(regEnd)}` : '—'],
              ['Старт',      fmt(startAt)],
              ['Дедлайн',    fmt(taskDeadline)],
            ] as [label, val]}
              <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <span style="font-size:0.875rem;color:rgba(255,255,255,0.5);">{label}</span>
                <span style="font-size:0.875rem;font-weight:500;
                             color:{val === '—' ? 'rgba(255,255,255,0.3)' : '#fff'};">{val}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки -->
    <div style="display:flex;justify-content:flex-end;gap:0.75rem;margin-top:1.5rem;">
      <a href="/admin/tournaments"
         style="padding:0.85rem 1.5rem;border:1px solid rgba(255,255,255,0.12);border-radius:10px;
                color:rgba(255,255,255,0.6);text-decoration:none;font-size:0.95rem;">
        Скасувати
      </a>
      <button type="submit" name="publish" value="false" disabled={loading}
              style="padding:0.85rem 1.5rem;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);
               border-radius:10px;color:rgba(255,255,255,0.7);font-size:0.95rem;cursor:pointer;
               font-weight:600;opacity:{loading?'0.6':'1'}">
        Зберегти як чернетку
      </button>
      <button type="submit" name="publish" value="true" disabled={loading}
              style="padding:0.85rem 1.75rem;background:#3E83FF;border:none;border-radius:10px;
               color:#fff;font-size:0.95rem;cursor:pointer;font-weight:600;
               opacity:{loading?'0.6':'1'}">
        {loading ? 'Зберігаємо...' : 'Опублікувати турнір'}
      </button>
    </div>
  </form>
</div>