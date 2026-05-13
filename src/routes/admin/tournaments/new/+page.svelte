<script lang="ts">
  // src/routes/admin/tournaments/new/+page.svelte
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let loading = $state(false);

  // Стейт для живого прев'ю (зберігаємо все)
  let title = $state('');
  let rounds = $state('1 раунд');
  let minTeam = $state(2);
  let maxTeam = $state(5);
  let regStart = $state('');
  let regEnd = $state('');
  let startAt = $state('');
  let taskDeadline = $state('');

  function fmt(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  }
</script>

<svelte:head><title>Створити турнір — LvUp Admin</title></svelte:head>

<div style="max-width: 1100px; margin: 0 auto; padding: 2rem;">
  <div style="margin-bottom: 2rem;">
    <p style="color: rgba(255,255,255,0.4); font-size: 0.85rem; margin: 0 0 4px;">
      <a href="/admin/tournaments" style="color: #3E83FF; text-decoration: none;">Турніри</a> / Новий турнір
    </p>
    <h1 style="margin: 0; font-size: 1.75rem; font-weight: 800; color: white;">Створити турнір</h1>
  </div>

  {#if form?.error}
    <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
      {form.error}
    </div>
  {/if}

  <form method="POST" action="?/create" use:enhance={() => {
    loading = true;
    return async ({ update }) => {
      await update();
      loading = false;
    };
  }}>
    <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem; align-items: start;">

      <div style="display: flex; flex-direction: column; gap: 1.25rem;">

        <div style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
            <span style="width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block;"></span>
            <h2 style="margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.5);">Основна інформація</h2>
          </div>

          <div style="margin-bottom: 1rem;">
            <label for="t-title" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Назва турніру *</label>
            <input id="t-title" name="title" required bind:value={title} placeholder="Hackathon Spring 2026"
                   style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff; outline: none; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 1rem;">
            <label for="t-desc" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Організатор / опис *</label>
            <textarea id="t-desc" name="description" required rows="4" placeholder="CODE4FUTURE · Командний турнір..."
                      style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff; outline: none; box-sizing: border-box; resize: vertical; font-family: inherit;"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label for="t-format" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Формат</label>
              <select id="t-format" name="format" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff; box-sizing: border-box;">
                <option value="Командний">Командний</option>
                <option value="Індивідуальний">Індивідуальний</option>
              </select>
            </div>
            <div>
              <label for="t-rounds" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Кількість раундів</label>
              <select id="t-rounds" onchange={(e) => { rounds = (e.currentTarget as HTMLSelectElement).value }}
                      style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff; box-sizing: border-box;">
                <option value="1 раунд">1 раунд</option>
                <option value="2 раунди">2 раунди</option>
                <option value="3 раунди">3 раунди</option>
              </select>
            </div>
          </div>
        </div>

        <div style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 166px; padding: 1.75rem; border-radius: 16px;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
            <span style="width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block;"></span>
            <h2 style="margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.5);">Дати та реєстрація</h2>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label for="regStart" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Початок реєстрації</label>
              <input type="date" name="regStart" id="regStart" bind:value={regStart} style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label for="regEnd" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Кінець реєстрації</label>
              <input type="date" name="regEnd" id="regEnd" bind:value={regEnd} style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label for="startAt" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Дата старту</label>
              <input type="date" name="startAt" id="startAt" bind:value={startAt} style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label for="taskDeadline" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Дедлайн здачі</label>
              <input type="date" name="taskDeadline" id="taskDeadline" bind:value={taskDeadline} style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div>
              <label for="minTeam" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Мін. учасників</label>
              <input type="number" name="minTeamSize" id="minTeam" bind:value={minTeam} style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label for="maxTeam" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Макс. учасників</label>
              <input type="number" name="maxTeamSize" id="maxTeam" bind:value={maxTeam} style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label for="maxTeams" style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Макс. команд</label>
              <input type="number" name="maxTeams" id="maxTeams" placeholder="Без обмежень" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
          </div>
        </div>

        <div style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
            <span style="width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block;"></span>
            <h2 style="margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.5);">Вимоги до технологій</h2>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Backend</label>
              <input name="backendReq" placeholder="Node.js / PHP" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Frontend</label>
              <input name="frontendReq" placeholder="Svelte / React" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">База даних</label>
              <input name="databaseReq" placeholder="PostgreSQL / MongoDB" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem;">Деплой</label>
              <input name="deployReq" placeholder="Vercel / Docker" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;" />
            </div>
          </div>
        </div>

        {#if data?.certTemplates?.length > 0}
          <div style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.75rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
              <span style="width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block;"></span>
              <h2 style="margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.5);">Сертифікат</h2>
            </div>
            <select name="certTemplateId" style="width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.85rem 1rem; color: #fff;">
              <option value="">— Без сертифіката —</option>
              {#each data.certTemplates as t}
                <option value={t.id}>{t.name}</option>
              {/each}
            </select>
          </div>
        {/if}
      </div>

      <div style="position: sticky; top: 1.5rem;">
        <div style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem;">
            <span style="width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block;"></span>
            <h2 style="margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.5);">Прев'ю</h2>
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <span style="font-size: 0.875rem; color: rgba(255,255,255,0.5);">Назва</span>
              <span style="font-size: 0.875rem; font-weight: 500; color: white;">{title || '—'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <span style="font-size: 0.875rem; color: rgba(255,255,255,0.5);">Раунди</span>
              <span style="font-size: 0.875rem; font-weight: 500; color: white;">{rounds}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 0;">
              <span style="font-size: 0.875rem; color: rgba(255,255,255,0.5);">Учасники</span>
              <span style="font-size: 0.875rem; font-weight: 500; color: white;">{minTeam}–{maxTeam}</span>
            </div>
          </div>

          <div>
            <p style="font-size: 0.75rem; color: rgba(255,255,255,0.35); text-transform: uppercase; margin-bottom: 0.5rem;">Важливі дати</p>
            <div style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
              <span style="font-size: 0.875rem; color: rgba(255,255,255,0.5);">Старт</span>
              <span style="font-size: 0.875rem; font-weight: 500; color: white;">{fmt(startAt)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 6px 0;">
              <span style="font-size: 0.875rem; color: rgba(255,255,255,0.5);">Дедлайн</span>
              <span style="font-size: 0.875rem; font-weight: 500; color: white;">{fmt(taskDeadline)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
      <a href="/admin/tournaments" style="padding: 0.85rem 1.5rem; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.95rem;">Скасувати</a>

      <button type="submit" name="publish" value="false"
              disabled={loading}
              style:opacity={loading ? 0.5 : 1}
              style="padding: 0.85rem 1.5rem; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: #fff; font-size: 0.95rem; font-weight: 600; cursor: pointer;">
        {loading ? 'Збереження...' : 'Зберегти як чернетку'}
      </button>

      <button type="submit" name="publish" value="true"
              disabled={loading}
              style:opacity={loading ? 0.5 : 1}
              style="padding: 0.85rem 1.75rem; background: #3E83FF; border: none; border-radius: 10px; color: #fff; font-size: 0.95rem; font-weight: 600; cursor: pointer;">
        {loading ? 'Публікація...' : 'Опублікувати турнір'}
      </button>
    </div>
  </form>
</div>