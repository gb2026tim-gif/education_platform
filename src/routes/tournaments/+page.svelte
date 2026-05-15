<script lang="ts">
  // src/routes/admin/tournaments/+page.svelte
  let { data } = $props();

  const statusLabel: Record<string, string> = {
    DRAFT: 'Чернетка',
    REGISTRATION: 'Реєстрація',
    RUNNING: 'Триваєть',
    EVALUATION: 'Оцінювання',
    FINISHED: 'Завершено',
  };

  const statusColor: Record<string, string> = {
    DRAFT:        'rgba(255,255,255,0.3)',
    REGISTRATION: '#3E83FF',
    RUNNING:      '#4ade80',
    EVALUATION:   '#eab308',
    FINISHED:     'rgba(255,255,255,0.4)',
  };

  const statusBg: Record<string, string> = {
    DRAFT:        'rgba(255,255,255,0.05)',
    REGISTRATION: 'rgba(62,131,255,0.15)',
    RUNNING:      'rgba(74,222,128,0.12)',
    EVALUATION:   'rgba(234,179,8,0.12)',
    FINISHED:     'rgba(255,255,255,0.05)',
  };

  const groups = [
    { key: 'RUNNING',      label: 'АКТИВНІ' },
    { key: 'REGISTRATION', label: 'ВІДКРИТА РЕЄСТРАЦІЯ' },
    { key: 'EVALUATION',   label: 'ОЦІНЮВАННЯ' },
    { key: 'DRAFT',        label: 'ЧЕРНЕТКИ' },
    { key: 'FINISHED',     label: 'ЗАВЕРШЕНІ' },
  ];
</script>

<svelte:head><title>Турніри — LvUp Admin</title></svelte:head>

<div style="max-width:1100px;margin:0 auto;padding:2rem;">

  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;">
    <div>
      <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin:0 0 4px;">Адмін / Турніри</p>
      <h1 style="margin:0;font-size:1.75rem;font-weight:800;">Всі турніри</h1>
    </div>
    <a href="/admin/tournaments/new"
       style="background:#3E83FF;color:#fff;padding:0.7rem 1.4rem;border-radius:10px;
              text-decoration:none;font-weight:600;font-size:0.95rem;">
      + Створити турнір
    </a>
  </div>

  {#each groups as group}
    {@const items = data.tournaments.filter(t => t.status === group.key)}
    {#if items.length > 0}
      <div style="margin-bottom:2rem;">
        <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.75rem;">
          <span style="width:3px;height:16px;background:#3E83FF;border-radius:2px;display:block;"></span>
          <p style="margin:0;font-size:0.78rem;font-weight:700;color:rgba(255,255,255,0.45);
                    text-transform:uppercase;letter-spacing:0.08em;">
            {group.label}
          </p>
        </div>

        {#each items as t}
          <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:14px;
                      padding:1.25rem 1.5rem;margin-bottom:0.75rem;
                      display:flex;align-items:center;gap:1rem;">

            <!-- Іконка -->
            <div style="width:44px;height:44px;border-radius:10px;background:rgba(62,131,255,0.15);
                        display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="1.5"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
            </div>

            <!-- Інфо -->
            <div style="flex:1;min-width:0;">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:3px;">
                <h3 style="margin:0;font-size:1rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  {t.title}
                </h3>
              </div>
              <p style="margin:0;font-size:0.82rem;color:rgba(255,255,255,0.45);">
                {t._count.teams} команд
                {#if t.taskDeadline}
                  · Дедлайн: {new Date(t.taskDeadline).toLocaleDateString('uk-UA', {day:'numeric',month:'short'})}
                {/if}
                {#if t.tasks.length > 0}
                  · {t.tasks.length} завдань
                {/if}
              </p>
            </div>

            <!-- Статус -->
            <span style="background:{statusBg[t.status]};color:{statusColor[t.status]};
                         padding:4px 14px;border-radius:20px;font-size:0.8rem;font-weight:600;
                         white-space:nowrap;flex-shrink:0;">
              {statusLabel[t.status]}
            </span>

            <!-- Дії -->
            <div style="display:flex;gap:0.5rem;flex-shrink:0;">
              {#if t.status === 'DRAFT' || t.status === 'REGISTRATION'}
                <a href="/admin/tournaments/{t.id}/edit"
                   style="padding:0.5rem 1rem;border:1px solid rgba(255,255,255,0.12);border-radius:8px;
                          color:rgba(255,255,255,0.7);text-decoration:none;font-size:0.85rem;">
                  Редагувати
                </a>
              {/if}
              <a href="/admin/tournaments/{t.id}"
                 style="padding:0.5rem 1rem;background:rgba(62,131,255,0.15);border:1px solid rgba(62,131,255,0.3);
                        border-radius:8px;color:#3E83FF;text-decoration:none;font-size:0.85rem;font-weight:600;">
                Керувати →
              </a>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/each}

  {#if data.tournaments.length === 0}
    <div style="text-align:center;padding:4rem;color:rgba(255,255,255,0.35);">
      <p style="font-size:1rem;">Турнірів ще немає.</p>
      <a href="/admin/tournaments/new"
         style="color:#3E83FF;text-decoration:none;font-weight:600;">Створити перший →</a>
    </div>
  {/if}
</div>
