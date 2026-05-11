<!-- src/routes/tourments/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();

    type Filter = 'all' | 'RUNNING' | 'REGISTRATION' | 'FINISHED';
    let activeFilter = $state<Filter>('all');

    const filters: { value: Filter; label: string }[] = [
        { value: 'all',          label: 'Всі' },
        { value: 'RUNNING',      label: 'Тривають' },
        { value: 'REGISTRATION', label: 'Відкрита реєстрація' },
        { value: 'FINISHED',     label: 'Завершені' },
    ];

    const allTournaments = $derived([
        ...(data.running      ?? []),
        ...(data.registration ?? []),
        ...(data.finished     ?? []),
    ]);

    const filtered = $derived(
        activeFilter === 'all'
            ? allTournaments
            : allTournaments.filter((t: any) => t.status === activeFilter)
    );

    const statusCfg: Record<string, { label: string; color: string; bg: string; pulse: boolean }> = {
        RUNNING:      { label: 'Тривають оцінювання', color: '#4ADE80', bg: 'rgba(74,222,128,0.12)',  pulse: true  },
        REGISTRATION: { label: 'Реєстрація відкрита', color: '#3E83FF', bg: 'rgba(62,131,255,0.12)', pulse: false },
        FINISHED:     { label: 'Завершено',            color: '#64748B', bg: 'rgba(100,116,139,0.1)', pulse: false },
        DRAFT:        { label: 'Чернетка',             color: '#475569', bg: 'rgba(71,85,105,0.1)',   pulse: false },
    };

    function fmt(d: string | Date | null | undefined) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
    }

    function fmtFull(d: string | Date | null | undefined) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    // Extract tech stack tags from tournament description or tasks
    function getTags(t: any): string[] {
        const tags: string[] = [];
        if (t.tasks?.[0]?.techStack) {
            const lines = t.tasks[0].techStack.split('\n');
            for (const line of lines) {
                const val = line.split(':')[1]?.trim();
                if (val) {
                    // Take first word only
                    const first = val.split(/[,+]/)[0].trim().split(' ')[0];
                    if (first && tags.length < 3) tags.push(first);
                }
            }
        }
        if (tags.length === 0) {
            // Default tags based on status
            return ['Backend', 'Frontend', 'PostgreSQL'];
        }
        return tags.slice(0, 3);
    }
</script>

<svelte:head>
    <title>Турніри — LvUp</title>
</svelte:head>

<style>
/* ── shell ── */
.page { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
.body { display:flex; flex:1; min-height:0; }
.main { flex:1; padding:32px 40px 64px; max-width:1000px; margin:0 auto; }

/* ── header row ── */
.page-title { font-size:30px; font-weight:800; color:var(--text); margin-bottom:20px; letter-spacing:-.4px; }

/* ── filter tabs ── */
.filters { display:flex; gap:6px; margin-bottom:24px; flex-wrap:wrap; }
.filter-btn {
    padding:8px 20px; border-radius:8px; font-size:14px; font-weight:600;
    border:1px solid var(--border); background:var(--surface);
    color:var(--text-muted); cursor:pointer; font-family:inherit;
    transition:background .12s, color .12s, border-color .12s;
}
.filter-btn:hover { background:var(--surface-2); color:var(--text); }
.filter-btn.active { background:#3E83FF; color:#fff; border-color:#3E83FF; }
:global(.light-mode) .filter-btn { background:#fff; border-color:rgba(10,14,26,.1); color:rgba(10,14,26,.6); }
:global(.light-mode) .filter-btn:hover { background:#f0f4ff; color:#0a0e1a; }

/* ── tournament card ── */
.t-card {
    background:var(--surface);
    border:1px solid var(--border);
    border-radius:14px;
    margin-bottom:14px;
    overflow:hidden;
    transition:border-color .15s, box-shadow .15s;
}
.t-card:hover { border-color:rgba(62,131,255,.3); box-shadow:0 4px 20px rgba(0,0,0,.15); }
:global(.light-mode) .t-card { background:#fff; border-color:rgba(10,14,26,.08); }
:global(.light-mode) .t-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.08); }

/* Card top */
.card-top { padding:22px 24px 16px; display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }

.card-left { flex:1; min-width:0; }

.status-row { display:flex; align-items:center; gap:8px; margin-bottom:6px; }
.status-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;
}
.pulse-dot {
    width:6px; height:6px; border-radius:50%; flex-shrink:0;
    animation:pulse 1.5s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

.t-title { font-size:20px; font-weight:800; color:var(--text); margin-bottom:5px; letter-spacing:-.3px; }
:global(.light-mode) .t-title { color:#0a0e1a; }

.t-desc { font-size:14px; color:var(--text-muted); line-height:1.5; margin-bottom:10px; }

/* Tags */
.tags { display:flex; gap:5px; flex-wrap:wrap; }
.tag {
    padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600;
    background:rgba(62,131,255,.1); color:#3E83FF;
    border:1px solid rgba(62,131,255,.15);
}
:global(.light-mode) .tag { background:rgba(62,131,255,.08); }

/* Card right buttons */
.card-right { display:flex; flex-direction:column; gap:8px; align-items:flex-end; flex-shrink:0; }
.btn-primary {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 22px; border-radius:9px; font-size:14px; font-weight:700;
    background:#3E83FF; color:#fff; text-decoration:none; border:none; cursor:pointer;
    white-space:nowrap; transition:background .12s;
    font-family:inherit;
}
.btn-primary:hover { background:#2d6fe0; }
.btn-outline {
    display:inline-flex; align-items:center; gap:6px;
    padding:9px 18px; border-radius:9px; font-size:14px; font-weight:600;
    background:transparent; color:#3E83FF;
    border:1px solid rgba(62,131,255,.35); text-decoration:none;
    white-space:nowrap; transition:background .12s;
}
.btn-outline:hover { background:rgba(62,131,255,.08); }

/* Card bottom */
.card-bottom {
    padding:12px 24px;
    border-top:1px solid var(--border);
    display:flex; align-items:center; gap:20px; flex-wrap:wrap;
    background:var(--bg-secondary);
}
:global(.light-mode) .card-bottom { background:#f8faff; border-color:rgba(10,14,26,.07); }

.meta-item { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--text-muted); }
.meta-item svg { flex-shrink:0; opacity:.6; }
:global(.light-mode) .meta-item { color:rgba(10,14,26,.55); }

.meta-label { color:var(--text-dim); margin-right:2px; }
:global(.light-mode) .meta-label { color:rgba(10,14,26,.35); }

/* Progress bar for registration */
.reg-progress { flex:1; max-width:180px; }
.reg-bar-wrap { height:4px; background:rgba(255,255,255,.08); border-radius:2px; overflow:hidden; margin-top:4px; }
:global(.light-mode) .reg-bar-wrap { background:rgba(10,14,26,.08); }
.reg-bar { height:100%; background:#3E83FF; border-radius:2px; transition:width .3s; }

/* Empty state */
.empty { text-align:center; padding:60px 0; color:var(--text-dim); }
.empty svg { margin-bottom:12px; opacity:.3; }
.empty p { font-size:15px; }
:global(.light-mode) .empty { color:rgba(10,14,26,.35); }

@media(max-width:700px) {
    .main { padding:16px 14px 48px; }
    .card-top { flex-direction:column; }
    .card-right { flex-direction:row; align-items:center; }
    .page-title { font-size:20px; }
}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <h1 class="page-title">Список всіх турнірів</h1>

            <!-- Filter tabs -->
            <div class="filters">
                {#each filters as f}
                    <button
                        class="filter-btn"
                        class:active={activeFilter === f.value}
                        onclick={() => activeFilter = f.value}
                    >
                        {f.label}
                    </button>
                {/each}
            </div>

            <!-- Tournament cards -->
            {#if filtered.length === 0}
                <div class="empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                        <path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                    </svg>
                    <p>Турнірів не знайдено</p>
                </div>
            {:else}
                {#each filtered as t}
                    {@const cfg = statusCfg[t.status] ?? statusCfg.DRAFT}
                    {@const teamsCount = t._count?.teams ?? t.teams?.length ?? 0}
                    {@const tags = getTags(t)}

                    <div class="t-card">
                        <div class="card-top">
                            <div class="card-left">
                                <div class="status-row">
                                    <span class="status-badge" style="background:{cfg.bg}; color:{cfg.color};">
                                        {#if cfg.pulse}
                                            <span class="pulse-dot" style="background:{cfg.color};"></span>
                                        {/if}
                                        {cfg.label}
                                    </span>
                                </div>
                                <div class="t-title">{t.title}</div>
                                <div class="t-desc">{t.description}</div>
                                <div class="tags">
                                    {#each tags as tag}
                                        <span class="tag">{tag}</span>
                                    {/each}
                                </div>
                            </div>

                            <div class="card-right">
                                <a href="/tourments/{t.id}" class="btn-primary">
                                    Переглянути
                                </a>
                                {#if t.status === 'REGISTRATION'}
                                    <a href="/tourments/{t.id}/register" class="btn-outline">
                                        Взяти участь
                                    </a>
                                {/if}
                            </div>
                        </div>

                        <!-- Card bottom: meta -->
                        <div class="card-bottom">
                            {#if t.status === 'REGISTRATION'}
                                <div class="meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    <span class="meta-label">Реєстрація до</span>
                                    {fmtFull(t.regEnd)}
                                </div>
                            {:else if t.status === 'RUNNING'}
                                <div class="meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    <span class="meta-label">Старт турніру</span>
                                    {fmtFull(t.regEnd)}
                                </div>
                            {:else}
                                <div class="meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                                    </svg>
                                    {fmtFull(t.regEnd)}
                                </div>
                            {/if}

                            <div class="meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                {#if t.maxTeams}
                                    {teamsCount} / {t.maxTeams} команд зареєстровано
                                {:else}
                                    {teamsCount} команд
                                {/if}
                            </div>

                            {#if t.status === 'REGISTRATION' && t.maxTeams}
                                <div class="reg-progress">
                                    <div class="reg-bar-wrap">
                                        <div class="reg-bar" style="width:{Math.min(100, Math.round(teamsCount/t.maxTeams*100))}%"></div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            {/if}
        </main>
    </div>
    <Footer />
</div>
