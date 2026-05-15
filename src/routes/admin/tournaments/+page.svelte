<script lang="ts">
  // src/routes/admin/tournaments/+page.svelte
  let { data } = $props();

  // Unified status mapping for cleaner maintenance and less token usage
  const statusMap = {
    DRAFT: {
      label: 'Чернетка',
      bg: 'bg-white/5',
      text: 'text-white/30',
      border: 'border-transparent'
    },
    REGISTRATION: {
      label: 'Реєстрація',
      bg: 'bg-[#3E83FF]/15',
      text: 'text-[#3E83FF]',
      border: 'border-[#3E83FF]/30'
    },
    RUNNING: {
      label: 'Триває',
      bg: 'bg-green-400/12',
      text: 'text-green-400',
      border: 'border-green-400/20'
    },
    EVALUATION: {
      label: 'Оцінювання',
      bg: 'bg-yellow-500/12',
      text: 'text-yellow-500',
      border: 'border-yellow-500/20'
    },
    FINISHED: {
      label: 'Завершено',
      bg: 'bg-white/5',
      text: 'text-white/40',
      border: 'border-transparent'
    },
  PUBLISHED: {
    label: 'Опубліковано',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30'
  },
  };

  const groups = [
    { key: 'RUNNING',      label: 'АКТИВНІ' },
    { key: 'REGISTRATION', label: 'ВІДКРИТА РЕЄСТРАЦІЯ' },
    { key: 'EVALUATION',   label: 'ОЦІНЮВАННЯ' },
    { key: 'DRAFT',        label: 'ЧЕРНЕТКИ' },
    { key: 'FINISHED',     label: 'ЗАВЕРШЕНІ' },
  ];
</script>

<svelte:head>
  <title>Турніри — LvUp Admin</title>
</svelte:head>

<div class="max-w-[1100px] mx-auto py-8 px-4 sm:px-8">

  <!-- Header Section -->
  <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
    <div>
      <p class="text-white/40 text-xs font-medium mb-1 tracking-wide uppercase">Адмін / Турніри</p>
      <h1 class="text-3xl font-extrabold text-white m-0 tracking-tight">Всі турніри</h1>
    </div>
    <a
            href="/admin/tournaments/new"
            class="inline-flex items-center justify-center bg-[#3E83FF] hover:bg-blue-600 text-white px-6 py-3 rounded-xl no-underline font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
    >
      + Створити турнір
    </a>
  </div>

  <!-- Tournament Groups -->
  {#each groups as group}
    {@const items = data.tournaments.filter(t => t.status === group.key)}
    {#if items.length > 0}
      <div class="mb-10">
        <!-- Group Header -->
        <div class="flex items-center gap-3 mb-4">
          <span class="w-1 h-4 bg-[#3E83FF] rounded-full"></span>
          <p class="m-0 text-[0.75rem] font-black text-white/40 uppercase tracking-[0.15em]">
            {group.label}
          </p>
        </div>

        <!-- Tournament Cards List -->
        <div class="space-y-3">
          {#each items as t}
            <div class="group bg-[#0d1b3e] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5 transition-all hover:border-white/10 hover:shadow-xl hover:shadow-black/20">

              <!-- Icon Box -->
              <div class="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
                </svg>
              </div>

              <!-- Content Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="m-0 text-base font-bold text-white truncate">
                    {t.title}
                  </h3>
                </div>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] text-white/45">
                  <span class="flex items-center gap-1.5">
                    <span class="w-1 h-1 rounded-full bg-white/20"></span>
                    {t._count.teams} команд
                  </span>

                  {#if t.taskDeadline}
                    <span class="flex items-center gap-1.5">
                      <span class="w-1 h-1 rounded-full bg-white/20"></span>
                      Дедлайн: {new Date(t.taskDeadline).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                    </span>
                  {/if}

                  {#if t.tasks?.length > 0}
                    <span class="flex items-center gap-1.5">
                      <span class="w-1 h-1 rounded-full bg-white/20"></span>
                      {t.tasks.length} завдань
                    </span>
                  {/if}
                </div>
              </div>

              <!-- Status Badge -->
              <div class="shrink-0">
                <span class="px-4 py-1.5 rounded-full text-[0.75rem] font-bold uppercase tracking-wider {statusMap[t.status].bg} {statusMap[t.status].text} border {statusMap[t.status].border}">
                  {statusMap[t.status].label}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-2 shrink-0 w-full md:w-auto">
                {#if ['DRAFT', 'REGISTRATION'].includes(t.status)}
                  <a
                          href="/admin/tournaments/{t.id}/edit"
                          class="flex-1 md:flex-none px-4 py-2.5 border border-white/10 rounded-xl text-white/70 no-underline text-xs font-bold hover:bg-white/5 hover:text-white transition-all text-center"
                  >
                    Редагувати
                  </a>
                {/if}
                <a
                        href="/admin/tournaments/{t.id}"
                        class="flex-1 md:flex-none px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-500 no-underline text-xs font-black hover:bg-blue-500/20 transition-all text-center"
                >
                  Керувати →
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/each}

  <!-- Empty State -->
  {#if data.tournaments.length === 0}
    <div class="flex flex-col items-center justify-center text-center py-20 px-4 bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
      <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-white mb-2">Турнірів ще немає</h2>
      <p class="text-white/40 max-w-xs mb-8 text-sm leading-relaxed">
        Схоже, ви ще не створили жодного турніру. Почніть з натискання кнопки нижче.
      </p>
      <a
              href="/admin/tournaments/new"
              class="text-[#3E83FF] no-underline font-bold text-sm border-b border-[#3E83FF]/30 hover:border-[#3E83FF] pb-0.5 transition-all"
      >
        Створити перший турнір →
      </a>
    </div>
  {/if}
</div>

<style>
  /* Optional: Custom scrollbar or specific adjustments if needed */
  :global(body) {
    background-color: #050a1a; /* Matching the admin theme background */
    color: white;
  }
</style>
