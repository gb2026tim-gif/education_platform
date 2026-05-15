<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();
  let saving = $state(false);

  // Convert Date | null to ISO date string for <input type="date">
  function toDateInput(d: Date | string | null | undefined): string {
    if (!d) return '';
    return new Date(d).toISOString().slice(0, 10);
  }

  // eslint-disable-next-line svelte/no-reactive-reassign
  const t = data.tournament;

  // Form state pre-populated from tournament
  let title = $state(t.title);
  let description = $state(t.description);
  let format = $state(t.format ?? '');
  let rounds = $state(t.rounds ?? 1);
  let regStart = $state(toDateInput(t.regStart));
  let regEnd = $state(toDateInput(t.regEnd));
  let startAt = $state(toDateInput(t.startAt));
  let taskDeadline = $state(toDateInput(t.taskDeadline));
  let minTeamSize = $state(t.minTeamSize ?? 1);
  let maxTeamSize = $state(t.maxTeamSize ?? 5);
  let maxTeams = $state(t.maxTeams ?? '');
  let backendReq = $state(t.backendReq ?? '');
  let frontendReq = $state(t.frontendReq ?? '');
  let databaseReq = $state(t.databaseReq ?? '');
  let deployReq = $state(t.deployReq ?? '');
  let certTemplateId = $state(t.certTemplateId ?? '');

  function fmt(d: string) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  }
</script>

<svelte:head><title>Редагувати — {t.title}</title></svelte:head>

<div class="page">
  <div class="head">
    <p class="breadcrumbs">
      <a href="/admin/tournaments">Турніри</a> /
      <a href="/admin/tournaments/{t.id}">{t.title}</a> /
      <span class="bc-current">Редагувати</span>
    </p>
    <h1 class="title">Редагувати турнір</h1>
  </div>

  {#if form?.error}
    <div class="alert">{form.error}</div>
  {/if}

  <form method="POST" action="?/save" use:enhance={() => {
    saving = true;
    return async ({ update }) => { await update(); saving = false; };
  }}>
    <div class="grid">
      <div class="col-main">
        <!-- ── Основна інформація ───────────────────── -->
        <section class="card">
          <div class="card-head">
            <span class="bar"></span>
            <h2 class="card-title">Основна інформація</h2>
          </div>

          <div class="field">
            <label for="f-title">Назва турніру *</label>
            <input id="f-title" name="title" required bind:value={title} />
          </div>
          <div class="field">
            <label for="f-desc">Опис *</label>
            <textarea id="f-desc" name="description" required rows="5" bind:value={description}></textarea>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="f-format">Формат</label>
              <select id="f-format" name="format" bind:value={format}>
                <option value="Командний">Командний</option>
                <option value="Індивідуальний">Індивідуальний</option>
              </select>
            </div>
            <div class="field">
              <label for="f-rounds">Кількість раундів</label>
              <input id="f-rounds" type="number" name="rounds" min="1" max="10" bind:value={rounds} />
            </div>
          </div>
        </section>

        <!-- ── Дати ─────────────────────────────────── -->
        <section class="card">
          <div class="card-head">
            <span class="bar"></span>
            <h2 class="card-title">Дати та реєстрація</h2>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="f-rs">Початок реєстрації</label>
              <input id="f-rs" type="date" name="regStart" bind:value={regStart} />
            </div>
            <div class="field">
              <label for="f-re">Кінець реєстрації</label>
              <input id="f-re" type="date" name="regEnd" bind:value={regEnd} />
            </div>
            <div class="field">
              <label for="f-sa">Старт турніру</label>
              <input id="f-sa" type="date" name="startAt" bind:value={startAt} />
            </div>
            <div class="field">
              <label for="f-td">Дедлайн здачі</label>
              <input id="f-td" type="date" name="taskDeadline" bind:value={taskDeadline} />
            </div>
          </div>
          <div class="grid-3">
            <div class="field">
              <label for="f-min">Мін. учасників</label>
              <input id="f-min" type="number" name="minTeamSize" min="1" bind:value={minTeamSize} />
            </div>
            <div class="field">
              <label for="f-max">Макс. учасників</label>
              <input id="f-max" type="number" name="maxTeamSize" min="1" bind:value={maxTeamSize} />
            </div>
            <div class="field">
              <label for="f-mt">Макс. команд</label>
              <input id="f-mt" type="number" name="maxTeams" min="0" placeholder="Без обмежень" bind:value={maxTeams} />
            </div>
          </div>
        </section>

        <!-- ── Вимоги ──────────────────────────────── -->
        <section class="card">
          <div class="card-head">
            <span class="bar"></span>
            <h2 class="card-title">Вимоги до технологій</h2>
          </div>
          <div class="grid-2">
            <div class="field">
              <label for="f-be">Backend</label>
              <input id="f-be" name="backendReq" placeholder="Node.js / PHP" bind:value={backendReq} />
            </div>
            <div class="field">
              <label for="f-fe">Frontend</label>
              <input id="f-fe" name="frontendReq" placeholder="Svelte / React" bind:value={frontendReq} />
            </div>
            <div class="field">
              <label for="f-db">База даних</label>
              <input id="f-db" name="databaseReq" placeholder="PostgreSQL / MongoDB" bind:value={databaseReq} />
            </div>
            <div class="field">
              <label for="f-dp">Деплой</label>
              <input id="f-dp" name="deployReq" placeholder="Vercel / Docker" bind:value={deployReq} />
            </div>
          </div>
        </section>

        {#if data.certTemplates && data.certTemplates.length > 0}
          <section class="card">
            <div class="card-head">
              <span class="bar"></span>
              <h2 class="card-title">Сертифікат</h2>
            </div>
            <div class="field">
              <label for="f-cert">Шаблон сертифіката</label>
              <select id="f-cert" name="certTemplateId" bind:value={certTemplateId}>
                <option value="">— Без сертифіката —</option>
                {#each data.certTemplates as ct}
                  <option value={ct.id}>{ct.name}</option>
                {/each}
              </select>
            </div>
          </section>
        {/if}
      </div>

      <!-- ── Preview ─────────────────────────────────── -->
      <div class="col-side">
        <section class="card sticky">
          <div class="card-head">
            <span class="bar"></span>
            <h2 class="card-title">Прев'ю</h2>
          </div>
          <div class="prev-row">
            <span>Назва</span>
            <strong>{title || '—'}</strong>
          </div>
          <div class="prev-row">
            <span>Раунди</span>
            <strong>{rounds}</strong>
          </div>
          <div class="prev-row">
            <span>Учасники</span>
            <strong>{minTeamSize}—{maxTeamSize}</strong>
          </div>
          <div class="prev-section">Важливі дати</div>
          <div class="prev-row">
            <span>Старт</span>
            <strong>{fmt(startAt)}</strong>
          </div>
          <div class="prev-row">
            <span>Дедлайн</span>
            <strong>{fmt(taskDeadline)}</strong>
          </div>
        </section>
      </div>
    </div>

    <div class="actions">
      <a href="/admin/tournaments/{t.id}" class="btn btn-ghost">Скасувати</a>
      <button type="submit" class="btn btn-primary" disabled={saving}>
        {saving ? 'Збереження...' : 'Зберегти зміни'}
      </button>
    </div>
  </form>

  <!-- Delete (separate form) -->
  <section class="card danger-zone">
    <div class="card-head">
      <span class="bar danger"></span>
      <h2 class="card-title">Небезпечна зона</h2>
    </div>
    <p class="danger-text">Видалення турніру є незворотнім — будуть видалені всі команди, завдання та подання.</p>
    <form method="POST" action="?/delete" use:enhance={({ cancel }) => {
      if (!confirm('Видалити турнір остаточно?')) { cancel(); return; }
      return async ({ update }) => { await update(); };
    }}>
      <button type="submit" class="btn btn-danger">Видалити турнір</button>
    </form>
  </section>
</div>

<style>
  .page { max-width: 1200px; margin: 0 auto; padding: 0.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

  .head { margin-bottom: 0.5rem; }
  .breadcrumbs { margin: 0 0 4px; font-size: 0.78rem; color: rgba(255,255,255,0.4); }
  .breadcrumbs a { color: #3E83FF; text-decoration: none; }
  .bc-current { color: rgba(255,255,255,0.7); font-weight: 600; }
  .title { margin: 0; font-size: 1.75rem; font-weight: 800; color: #fff; }

  .alert { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 0.75rem 1rem; border-radius: 8px; }

  .grid { display: grid; grid-template-columns: 1fr 340px; gap: 1.25rem; align-items: start; }
  @media (max-width: 1000px) { .grid { grid-template-columns: 1fr; } }
  .col-main { display: flex; flex-direction: column; gap: 1.25rem; }
  .col-side .sticky { position: sticky; top: 1rem; }

  .card { background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; }
  .card-head { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem; }
  .bar { width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block; }
  .bar.danger { background: #ef4444; }
  .card-title { margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.55); letter-spacing: 0.04em; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-top: 1rem; }
  @media (max-width: 700px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } }

  .field { margin-bottom: 1rem; }
  .field:last-child { margin-bottom: 0; }
  .field label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem; }
  .field input, .field textarea, .field select { width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.75rem 1rem; color: #fff; outline: none; box-sizing: border-box; font-family: inherit; font-size: 0.9rem; }
  .field input:focus, .field textarea:focus, .field select:focus { border-color: #3E83FF; }
  .field textarea { resize: vertical; }

  .prev-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .prev-row:last-child { border-bottom: none; }
  .prev-row span { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
  .prev-row strong { font-size: 0.875rem; font-weight: 600; color: #fff; }
  .prev-section { font-size: 0.72rem; color: rgba(255,255,255,0.35); text-transform: uppercase; margin: 0.75rem 0 0.4rem; letter-spacing: 0.05em; }

  .actions { display: flex; justify-content: flex-end; gap: 0.75rem; }
  .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.85rem 1.5rem; border-radius: 10px; font-size: 0.95rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: all 0.15s; font-family: inherit; }
  .btn-primary { background: #3E83FF; color: #fff; }
  .btn-primary:hover { background: #2d6cd9; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.75); }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); }
  .btn-danger { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35); color: #f87171; }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }

  .danger-zone { border-color: rgba(239,68,68,0.18); }
  .danger-text { margin: 0 0 1rem; font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.5; }
</style>
