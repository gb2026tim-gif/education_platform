<script lang="ts">
  import { enhance } from '$app/forms';

  let { data, form } = $props();

  // ── Status stepper config ─────────────────────────────
  type Status = 'DRAFT' | 'PUBLISHED' | 'REGISTRATION' | 'RUNNING' | 'EVALUATION' | 'FINISHED';

  const stages: { key: Status; label: string }[] = [
    { key: 'DRAFT',        label: 'Чернетка' },
    { key: 'REGISTRATION', label: 'Реєстрація' },
    { key: 'RUNNING',      label: 'Триває' },
    { key: 'EVALUATION',   label: 'Оцінювання' },
    { key: 'FINISHED',     label: 'Завершення' }
  ];

  function stageIndex(s: string): number {
    // PUBLISHED is mapped to REGISTRATION step
    if (s === 'PUBLISHED') return 1;
    const i = stages.findIndex(x => x.key === s);
    return i < 0 ? 0 : i;
  }

  let currentIdx = $derived(stageIndex(data.tournament.status));

  // ── Date formatter ────────────────────────────────────
  function fmt(d: Date | string | null): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
  }

  function fmtRange(a: Date | string | null, b: Date | string | null): string {
    if (!a && !b) return '—';
    return `${fmt(a)} - ${fmt(b)}`;
  }

  // ── Add-task form state ───────────────────────────────
  let showTaskForm = $state(false);
  let taskTitle = $state('');
  let taskDescription = $state('');
  let taskTechStack = $state('');
  let taskRequirements = $state('');
  let taskStartAt = $state('');
  let taskDeadline = $state('');

  function resetTaskForm() {
    taskTitle = '';
    taskDescription = '';
    taskTechStack = '';
    taskRequirements = '';
    taskStartAt = '';
    taskDeadline = '';
  }

  // ── Status labels for team status pill ────────────────
  function teamPill(verified: boolean): { bg: string; color: string; text: string } {
    return verified
      ? { bg: 'rgba(74,222,128,0.12)', color: '#4ade80', text: 'Підтверджено' }
      : { bg: 'rgba(62,131,255,0.15)', color: '#3E83FF', text: 'Підтвердити' };
  }

  let t = $derived(data.tournament);
  let totalTeams = $derived(data.teams.length);
  let verifiedTeams = $derived(data.verifiedTeams);
</script>

<svelte:head><title>{t.title} — Керування турніром</title></svelte:head>

<div class="page">
  <!-- ── Header ───────────────────────────────────────── -->
  <div class="head">
    <div>
      <p class="breadcrumbs">
        <a href="/admin/tournaments">Турніри</a>
        <span class="bc-sep">/</span>
        <span class="bc-current">{t.title}</span>
      </p>
      <h1 class="title">{t.title}</h1>
    </div>
    <div class="head-actions">
      <a href="/admin/tournaments/{t.id}/edit" class="btn btn-ghost">Редагувати</a>
      <button type="button" class="btn btn-primary" onclick={() => { showTaskForm = true; }}>
        Додати завдання
      </button>
    </div>
  </div>

  {#if form?.error}
    <div class="alert">{form.error}</div>
  {/if}

  <!-- ── Status stepper ───────────────────────────────── -->
  <section class="card">
    <div class="card-head">
      <span class="bar"></span>
      <h2 class="card-title">Статус турніру</h2>
    </div>

    <div class="stepper">
      {#each stages as stage, i}
        {@const active = i === currentIdx}
        {@const done = i < currentIdx}
        <div class="step">
          <div class="step-circle {active ? 'is-active' : ''} {done ? 'is-done' : ''}">
            {#if done}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            {:else if active}
              <span class="dot"></span>
            {:else}
              <span class="empty"></span>
            {/if}
          </div>
          <p class="step-label {active ? 'is-active' : ''}">{stage.label}</p>
        </div>
        {#if i < stages.length - 1}
          <div class="step-line {done ? 'is-done' : ''}"></div>
        {/if}
      {/each}
    </div>

    <!-- Quick status actions -->
    <div class="status-actions">
      {#if t.status === 'DRAFT'}
        <form method="POST" action="?/setStatus" use:enhance>
          <input type="hidden" name="status" value="REGISTRATION" />
          <button type="submit" class="btn btn-primary btn-sm">Відкрити реєстрацію</button>
        </form>
      {/if}
      {#if t.status === 'REGISTRATION' || t.status === 'PUBLISHED'}
        <form method="POST" action="?/closeRegistration" use:enhance>
          <button type="submit" class="btn btn-ghost btn-sm">Закрити реєстрацію</button>
        </form>
      {/if}
      {#if t.status === 'RUNNING'}
        <form method="POST" action="?/setStatus" use:enhance>
          <input type="hidden" name="status" value="EVALUATION" />
          <button type="submit" class="btn btn-primary btn-sm">Перейти до оцінювання</button>
        </form>
      {/if}
      {#if t.status === 'EVALUATION'}
        <form method="POST" action="?/setStatus" use:enhance>
          <input type="hidden" name="status" value="FINISHED" />
          <button type="submit" class="btn btn-primary btn-sm">Завершити турнір</button>
        </form>
      {/if}
    </div>
  </section>

  <!-- ── Tasks + Info grid ────────────────────────────── -->
  <div class="grid-2">
    <!-- Tasks block -->
    <section class="card">
      <div class="card-head">
        <span class="bar"></span>
        <h2 class="card-title">Завдання</h2>
      </div>

      {#if t.tasks.length === 0}
        <div class="task-empty">
          <button type="button" class="btn btn-primary" onclick={() => { showTaskForm = true; }}>
            Додати завдання - раунд 1
          </button>
          <p class="hint">
            Для додавання першого завдання потрібно
            <span class="hint-em">закрити реєстрацію</span>
            (автоматично закриється
            {#if t.regEnd}{fmt(t.regEnd)}{:else}за розкладом{/if}).
          </p>
        </div>
      {:else}
        <div class="task-list">
          {#each t.tasks as task, i}
            <div class="task-row">
              <div class="task-info">
                <span class="task-num">#{i + 1}</span>
                <div>
                  <p class="task-title">{task.title}</p>
                  <p class="task-meta">
                    {#if task.deadline}Дедлайн: {fmt(task.deadline)}{/if}
                    {#if task.requirements && task.requirements.length}
                      · {task.requirements.length} вимог
                    {/if}
                  </p>
                </div>
              </div>
              <form method="POST" action="?/deleteTask" use:enhance>
                <input type="hidden" name="taskId" value={task.id} />
                <button type="submit" class="btn-icon" title="Видалити">×</button>
              </form>
            </div>
          {/each}
        </div>
      {/if}
    </section>

    <!-- Info block -->
    <section class="card">
      <div class="card-head">
        <span class="bar"></span>
        <h2 class="card-title">Інформація</h2>
      </div>

      <div class="info-row">
        <span class="info-label">Реєстрація</span>
        <span class="info-value">{fmtRange(t.regStart, t.regEnd)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Дедлайн завдання</span>
        <span class="info-value">{fmt(t.taskDeadline)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Учасники у команді</span>
        <span class="info-value">{t.minTeamSize ?? 1}—{t.maxTeamSize ?? 5}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Кількість підтверджених команд</span>
        <span class="info-value pill-blue">{verifiedTeams}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Всього команд</span>
        <span class="info-value">{totalTeams}{t.maxTeams ? ` / ${t.maxTeams}` : ''}</span>
      </div>
    </section>
  </div>

  <!-- ── Add task form (drawer-style) ─────────────────── -->
  {#if showTaskForm}
    <section class="card">
      <div class="card-head" style="justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <span class="bar"></span>
          <h2 class="card-title">Нове завдання</h2>
        </div>
        <button type="button" class="btn-icon" onclick={() => { showTaskForm = false; }}>×</button>
      </div>

      <form method="POST" action="?/addTask" use:enhance={() => {
        return async ({ update }) => {
          await update();
          if (!form?.error) { showTaskForm = false; resetTaskForm(); }
        };
      }}>
        <div class="form-grid">
          <div class="field" style="grid-column: span 2;">
            <label for="task-title">Назва завдання *</label>
            <input id="task-title" name="title" bind:value={taskTitle} required placeholder="Веб-платформа CODE4FUTURE" />
          </div>
          <div class="field" style="grid-column: span 2;">
            <label for="task-desc">Опис *</label>
            <textarea id="task-desc" name="description" bind:value={taskDescription} required rows="4"
              placeholder="Мета — створити веб-платформу..."></textarea>
          </div>
          <div class="field">
            <label for="task-start">Старт *</label>
            <input id="task-start" type="date" name="startAt" bind:value={taskStartAt} required />
          </div>
          <div class="field">
            <label for="task-deadline">Дедлайн *</label>
            <input id="task-deadline" type="date" name="deadline" bind:value={taskDeadline} required />
          </div>
          <div class="field" style="grid-column: span 2;">
            <label for="task-tech">Технологічний стек</label>
            <input id="task-tech" name="techStack" bind:value={taskTechStack}
              placeholder="SvelteKit, PostgreSQL, Tailwind CSS" />
          </div>
          <div class="field" style="grid-column: span 2;">
            <label for="task-req">Вимоги (по одній на рядок)</label>
            <textarea id="task-req" name="requirements" bind:value={taskRequirements} rows="4"
              placeholder="Авторизація та ролі&#10;Управління командами&#10;Деплой"></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-ghost" onclick={() => { showTaskForm = false; resetTaskForm(); }}>
            Скасувати
          </button>
          <button type="submit" class="btn btn-primary">Додати завдання</button>
        </div>
      </form>
    </section>
  {/if}

  <!-- ── Teams table ──────────────────────────────────── -->
  <section class="card">
    <div class="card-head" style="justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <span class="bar"></span>
        <h2 class="card-title">Таблиця команд</h2>
      </div>
      <div class="teams-actions">
        <span class="teams-count">Всього команд: {totalTeams}</span>
        {#if totalTeams > verifiedTeams}
          <form method="POST" action="?/verifyAll" use:enhance>
            <button type="submit" class="btn btn-primary btn-sm">Підтвердити усі можливі</button>
          </form>
        {/if}
      </div>
    </div>

    {#if data.teams.length === 0}
      <div class="teams-empty">Команд ще немає.</div>
    {:else}
      <div class="table-wrap">
        <table class="teams-table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Учасники</th>
              <th>Командир</th>
              <th>Підтверджено учасників</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {#each data.teams as team}
              {@const pill = teamPill(team.verified)}
              <tr>
                <td><span class="team-name">{team.name}</span></td>
                <td class="td-muted">{team.captain?.email ?? '—'}</td>
                <td class="td-muted">{team.captain?.name ?? '—'}</td>
                <td>
                  <div class="participants-progress">
                    <span>{team._count?.members ?? team.members.length}</span>
                    <div class="participants-bar">
                      <div class="participants-fill" style="width: {Math.min(100, ((team._count?.members ?? team.members.length) / (t.maxTeamSize ?? 5)) * 100)}%"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <form method="POST" action="?/toggleVerify" use:enhance style="display: inline-block;">
                    <input type="hidden" name="teamId" value={team.id} />
                    <input type="hidden" name="verified" value={String(team.verified)} />
                    <button type="submit" class="pill" style="background: {pill.bg}; color: {pill.color};">
                      {pill.text}
                    </button>
                  </form>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</div>

<style>
  .page { max-width: 1200px; margin: 0 auto; padding: 0.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

  .head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .breadcrumbs { margin: 0 0 4px; font-size: 0.78rem; color: rgba(255,255,255,0.4); display: flex; gap: 0.4rem; align-items: center; }
  .breadcrumbs a { color: #3E83FF; text-decoration: none; }
  .bc-sep { color: rgba(255,255,255,0.2); }
  .bc-current { color: rgba(255,255,255,0.7); font-weight: 600; }
  .title { margin: 0; font-size: 1.75rem; font-weight: 800; color: #fff; }
  .head-actions { display: flex; gap: 0.6rem; }

  .alert { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; padding: 0.75rem 1rem; border-radius: 8px; }

  .card { background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; }
  .card-head { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.25rem; }
  .bar { width: 3px; height: 18px; background: #3E83FF; border-radius: 2px; display: block; }
  .card-title { margin: 0; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; color: rgba(255,255,255,0.55); letter-spacing: 0.04em; }

  /* ── Stepper ──────────────────────────── */
  .stepper { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap; }
  .step { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; min-width: 80px; flex: 0 0 auto; }
  .step-circle { width: 36px; height: 36px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.3); }
  .step-circle.is-done { background: #3E83FF; border-color: #3E83FF; color: #fff; }
  .step-circle.is-active { background: #3E83FF; border-color: #3E83FF; box-shadow: 0 0 0 4px rgba(62,131,255,0.2); }
  .step-circle .dot { width: 10px; height: 10px; background: #fff; border-radius: 50%; }
  .step-circle .empty { display: block; }
  .step-label { margin: 0; font-size: 0.8rem; color: rgba(255,255,255,0.45); }
  .step-label.is-active { color: #fff; font-weight: 600; }
  .step-line { height: 2px; background: rgba(255,255,255,0.1); flex: 1 1 30px; min-width: 30px; border-radius: 2px; }
  .step-line.is-done { background: #3E83FF; }

  .status-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; }

  /* ── Grid 2 cols ──────────────────────── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
  @media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }

  /* ── Task block ───────────────────────── */
  .task-empty { text-align: center; padding: 1.5rem 0; }
  .task-empty .hint { margin: 0.75rem 0 0; font-size: 0.78rem; color: rgba(255,255,255,0.35); line-height: 1.5; }
  .task-empty .hint-em { color: #3E83FF; }
  .task-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .task-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; }
  .task-info { display: flex; align-items: center; gap: 0.75rem; }
  .task-num { font-size: 0.8rem; font-weight: 700; color: #3E83FF; min-width: 30px; }
  .task-title { margin: 0; font-size: 0.95rem; font-weight: 600; color: #fff; }
  .task-meta { margin: 2px 0 0; font-size: 0.75rem; color: rgba(255,255,255,0.4); }

  /* ── Info block ───────────────────────── */
  .info-row { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .info-row:last-child { border-bottom: none; }
  .info-label { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
  .info-value { font-size: 0.875rem; font-weight: 600; color: #fff; }
  .info-value.pill-blue { background: rgba(62,131,255,0.15); color: #3E83FF; padding: 2px 12px; border-radius: 999px; }

  /* ── Task form ────────────────────────── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 700px) { .form-grid { grid-template-columns: 1fr; } .form-grid .field { grid-column: span 1 !important; } }
  .field label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 0.4rem; }
  .field input, .field textarea { width: 100%; background: #111827; border: 1px solid #1e2d45; border-radius: 10px; padding: 0.75rem 1rem; color: #fff; outline: none; box-sizing: border-box; font-family: inherit; font-size: 0.9rem; resize: vertical; }
  .field input:focus, .field textarea:focus { border-color: #3E83FF; }
  .form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; }

  /* ── Teams table ──────────────────────── */
  .teams-actions { display: flex; align-items: center; gap: 1rem; }
  .teams-count { font-size: 0.85rem; color: rgba(255,255,255,0.55); }
  .teams-empty { text-align: center; padding: 2rem; color: rgba(255,255,255,0.35); font-size: 0.9rem; }
  .table-wrap { overflow-x: auto; margin: 0 -0.5rem; }
  .teams-table { width: 100%; border-collapse: collapse; }
  .teams-table th { text-align: left; padding: 0.6rem 0.75rem; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .teams-table td { padding: 0.85rem 0.75rem; font-size: 0.875rem; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .teams-table tr:last-child td { border-bottom: none; }
  .team-name { font-weight: 600; }
  .td-muted { color: rgba(255,255,255,0.6); }
  .participants-progress { display: flex; align-items: center; gap: 0.5rem; }
  .participants-bar { width: 40px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
  .participants-fill { height: 100%; background: #3E83FF; border-radius: 2px; transition: width 0.2s; }

  /* ── Buttons ──────────────────────────── */
  .btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.7rem 1.3rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer; border: none; text-decoration: none; transition: all 0.15s; font-family: inherit; }
  .btn-primary { background: #3E83FF; color: #fff; }
  .btn-primary:hover { background: #2d6cd9; }
  .btn-ghost { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.75); }
  .btn-ghost:hover { background: rgba(255,255,255,0.05); }
  .btn-sm { padding: 0.45rem 0.9rem; font-size: 0.8rem; }
  .btn-icon { background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; font-size: 1.4rem; line-height: 1; padding: 0 0.4rem; }
  .btn-icon:hover { color: #f87171; }
  .pill { padding: 5px 14px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; border: none; cursor: pointer; font-family: inherit; }
  .pill:hover { filter: brightness(1.15); }
</style>
