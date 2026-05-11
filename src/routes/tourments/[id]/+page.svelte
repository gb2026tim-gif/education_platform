<!-- src/routes/tourments/[id]/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();
    const t = $derived(data.tournament);

    const statusCfg: Record<string, { label: string; color: string; bg: string; pulse: boolean }> = {
        RUNNING:      { label: 'Тривають оцінювання', color: '#4ADE80', bg: 'rgba(74,222,128,.12)', pulse: true  },
        REGISTRATION: { label: 'Реєстрація відкрита', color: '#3E83FF', bg: 'rgba(62,131,255,.12)', pulse: false },
        FINISHED:     { label: 'Завершено',            color: '#64748B', bg: 'rgba(100,116,139,.1)', pulse: false },
        DRAFT:        { label: 'Чернетка',             color: '#475569', bg: 'rgba(71,85,105,.1)',   pulse: false },
    };

    function fmt(d: string | Date | null | undefined) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    function fmtShort(d: string | Date | null | undefined) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
    }

    // Countdown to regEnd
    function getCountdown(d: string | Date | null | undefined): string {
        if (!d) return '';
        const diff = new Date(d).getTime() - Date.now();
        if (diff <= 0) return 'Завершено';
        const days = Math.floor(diff / 86400000);
        if (days > 0) return `${days} дн. залишилось`;
        const hours = Math.floor(diff / 3600000);
        return `${hours} год. залишилось`;
    }

    const isRegistrationOpen = $derived(t?.status === 'REGISTRATION');
    const canRegister = $derived(isRegistrationOpen && !data.userTeam);
    const hasTeam = $derived(!!data.userTeam);
    const hasTask = $derived(!!data.task);

    function getTags(tournament: any): string[] {
        const tags: string[] = [];
        if (tournament.tasks?.[0]?.techStack) {
            const lines = tournament.tasks[0].techStack.split('\n');
            for (const line of lines) {
                const val = line.split(':')[1]?.trim();
                if (val) {
                    const first = val.split(/[,+]/)[0].trim().split(' ')[0];
                    if (first && tags.length < 4) tags.push(first);
                }
            }
        }
        return tags.length > 0 ? tags : ['Backend', 'Frontend', 'PostgreSQL'];
    }
</script>

<svelte:head>
    <title>{t?.title ?? 'Турнір'} — LvUp</title>
</svelte:head>

<style>
/* ── shell ── */
.page { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
.body { display:flex; flex:1; min-height:0; }
.main { flex:1; padding:32px 40px 64px; overflow-y:auto; }

/* breadcrumb */
.bc   { font-size:13px; color:var(--text-dim); margin-bottom:8px; display:flex; flex-wrap:wrap; gap:4px; }
.bc a { color:var(--text-muted); text-decoration:none; transition:color .12s; }
.bc a:hover { color:#3E83FF; }
.bc .cur { color:#3E83FF; }

/* ── Layout: left content + right sidebar ── */
.layout { display:grid; grid-template-columns:1fr 320px; gap:24px; align-items:start; max-width:1100px; margin:0 auto; }
@media(max-width:900px) { .layout { grid-template-columns:1fr; } }

/* ── Hero card ── */
.hero {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; padding:28px 32px; margin-bottom:20px;
    position:relative; overflow:hidden;
}
:global(.light-mode) .hero { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 2px 14px rgba(0,0,0,.06); }
.hero::before {
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse 80% 60% at 10% 0%, rgba(62,131,255,.1) 0%, transparent 70%);
    pointer-events:none;
}

.hero-top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; margin-bottom:8px; position:relative; z-index:1; }

.status-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; flex-shrink:0;
}
.pulse-dot { width:6px; height:6px; border-radius:50%; animation:pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

.hero-title { font-size:32px; font-weight:800; color:var(--text); letter-spacing:-.5px; position:relative; z-index:1; margin-bottom:10px; }
:global(.light-mode) .hero-title { color:#0a0e1a; }

.tags { display:flex; gap:5px; flex-wrap:wrap; margin-bottom:14px; position:relative; z-index:1; }
.tag { padding:3px 10px; border-radius:6px; font-size:11px; font-weight:600; background:rgba(62,131,255,.1); color:#3E83FF; border:1px solid rgba(62,131,255,.15); }

.hero-desc { font-size:15px; color:var(--text-muted); line-height:1.75; position:relative; z-index:1; margin-bottom:20px; }

/* Meta grid */
.meta-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0; border-top:1px solid var(--border); padding-top:18px; position:relative; z-index:1; }
:global(.light-mode) .meta-grid { border-color:rgba(10,14,26,.08); }
.meta-item { padding:0 16px; border-right:1px solid var(--border); }
.meta-item:first-child { padding-left:0; }
.meta-item:last-child  { border-right:none; }
:global(.light-mode) .meta-item { border-color:rgba(10,14,26,.08); }
.meta-label { font-size:13px; color:var(--text-dim); margin-bottom:4px; }
.meta-val   { font-size:16px; font-weight:600; color:var(--text); }
:global(.light-mode) .meta-label { color:rgba(10,14,26,.4); }
:global(.light-mode) .meta-val   { color:#0a0e1a; }

/* ── Tech requirements ── */
.section-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:22px 26px; margin-bottom:16px; }
:global(.light-mode) .section-card { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 2px 10px rgba(0,0,0,.05); }
.section-title { display:flex; align-items:center; gap:9px; font-size:16px; font-weight:700; color:var(--text); margin-bottom:16px; }
.s-bar { width:4px; height:17px; background:#3E83FF; border-radius:3px; flex-shrink:0; }
:global(.light-mode) .section-title { color:#0a0e1a; }

.tech-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:10px; }
.tech-cell { background:var(--bg-secondary); border:1px solid var(--border); border-radius:9px; padding:10px 14px; }
:global(.light-mode) .tech-cell { background:#f0f4ff; border-color:rgba(62,131,255,.12); }
.tech-lbl { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#3E83FF; margin-bottom:3px; }
.tech-val { font-size:13px; color:var(--text); font-weight:500; }
:global(.light-mode) .tech-val { color:#0a0e1a; }

/* ── Teams section ── */
.team-row { display:flex; align-items:center; padding:11px 0; border-bottom:1px solid var(--border); gap:12px; }
:global(.light-mode) .team-row { border-color:rgba(10,14,26,.07); }
.team-row:last-child { border-bottom:none; }
.team-avatar { width:36px; height:36px; border-radius:8px; background:linear-gradient(135deg,#1e3a7a,#1a50a0); border:1px solid rgba(62,131,255,.25); display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#5aaeff; flex-shrink:0; }
.team-name { font-size:15px; font-weight:600; color:var(--text); }
.team-sub  { font-size:12px; color:var(--text-muted); margin-top:1px; }
:global(.light-mode) .team-name { color:#0a0e1a; }
.team-city { font-size:12px; color:var(--text-dim); margin-left:auto; }

/* ── Right sidebar (registration widget) ── */
.reg-widget { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; position:sticky; top:20px; }
:global(.light-mode) .reg-widget { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 4px 20px rgba(0,0,0,.08); }

.rw-title { font-size:18px; font-weight:700; color:var(--text); margin-bottom:16px; }
:global(.light-mode) .rw-title { color:#0a0e1a; }

.rw-status { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:14px; }

.rw-stats { display:flex; flex-direction:column; gap:8px; margin-bottom:18px; }
.rw-stat { display:flex; align-items:center; justify-content:space-between; font-size:13px; }
.rw-stat-label { color:var(--text-muted); }
:global(.light-mode) .rw-stat-label { color:rgba(10,14,26,.55); }
.rw-stat-val { font-weight:600; color:var(--text); }
:global(.light-mode) .rw-stat-val { color:#0a0e1a; }

.countdown-box { background:rgba(62,131,255,.08); border:1px solid rgba(62,131,255,.2); border-radius:10px; padding:12px 14px; margin-bottom:16px; }
.countdown-label { font-size:11px; color:#3E83FF; font-weight:600; margin-bottom:3px; }
.countdown-val   { font-size:18px; font-weight:800; color:var(--text); font-variant-numeric:tabular-nums; }
:global(.light-mode) .countdown-val { color:#0a0e1a; }

.btn-reg {
    width:100%; padding:14px; border-radius:10px; border:none;
    background:#3E83FF; color:#fff; font-size:16px; font-weight:700;
    font-family:inherit; cursor:pointer; text-decoration:none;
    display:block; text-align:center; transition:background .12s;
    margin-bottom:8px;
}
.btn-reg:hover { background:#2d6fe0; }
.btn-reg.secondary { background:rgba(62,131,255,.1); color:#3E83FF; border:1px solid rgba(62,131,255,.25); }
.btn-reg.secondary:hover { background:rgba(62,131,255,.18); }
.btn-reg:disabled, .btn-reg.disabled { opacity:.5; cursor:not-allowed; }

.my-team-box { background:rgba(62,131,255,.06); border:1px solid rgba(62,131,255,.18); border-radius:10px; padding:12px 14px; margin-bottom:12px; }
.mt-label { font-size:11px; color:#3E83FF; font-weight:600; margin-bottom:3px; }
.mt-name  { font-size:14px; font-weight:700; color:var(--text); }
:global(.light-mode) .mt-name { color:#0a0e1a; }

.rw-hint { font-size:12px; color:var(--text-dim); text-align:center; line-height:1.5; }
:global(.light-mode) .rw-hint { color:rgba(10,14,26,.4); }

/* ── Empty ── */
.empty-teams { padding:20px 0; text-align:center; color:var(--text-dim); font-size:13px; }

@media(max-width:700px) {
    .main { padding:16px 14px 48px; }
    .meta-grid { grid-template-columns:1fr 1fr; gap:12px; }
    .meta-item { border-right:none; border-bottom:1px solid var(--border); padding:0 0 10px; }
    .meta-item:last-child { border-bottom:none; }
}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">

            <!-- Breadcrumb -->
            <div class="bc">
                <a href="/tourments">Турніри</a>
                <span>/</span>
                <span class="cur">{t.title}</span>
            </div>

            <div class="layout">
                <!-- ── LEFT: main content ── -->
                <div>
                    <!-- Hero -->
                    <div class="hero">
                        <div class="hero-top">
                            <h1 class="hero-title">{t.title}</h1>
                            {@const cfg = statusCfg[t.status] ?? statusCfg.DRAFT}
                            <span class="status-badge" style="background:{cfg.bg}; color:{cfg.color};">
                                {#if cfg.pulse}<span class="pulse-dot" style="background:{cfg.color};"></span>{/if}
                                {cfg.label}
                            </span>
                        </div>

                        <div class="tags">
                            {#each getTags(t) as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        </div>

                        <div class="hero-desc">{t.description}</div>

                        <div class="meta-grid">
                            <div class="meta-item">
                                <div class="meta-label">Реєстрація до</div>
                                <div class="meta-val">{fmtShort(t.regEnd)}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Старт</div>
                                <div class="meta-val">{fmtShort(t.regEnd)}</div>
                            </div>
                            <div class="meta-item">
                                <div class="meta-label">Команди</div>
                                <div class="meta-val">
                                    {t.teams.length}{t.maxTeams ? ` / ${t.maxTeams}` : ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tech stack -->
                    {#if t.tasks?.[0]?.techStack}
                        {@const techRows = t.tasks[0].techStack.split('\n').filter(Boolean).map((line: string) => {
                            const i = line.indexOf(':');
                            return i < 0 ? {label:'', val: line.trim()} : {label: line.slice(0,i).trim(), val: line.slice(i+1).trim()};
                        })}
                        <div class="section-card">
                            <div class="section-title">
                                <span class="s-bar"></span>
                                Вимоги до технологій
                                <span style="font-size:11px; color:var(--text-dim); font-weight:400;">(рекомендовано)</span>
                            </div>
                            <div class="tech-grid">
                                {#each techRows as row}
                                    <div class="tech-cell">
                                        {#if row.label}<div class="tech-lbl">{row.label}</div>{/if}
                                        <div class="tech-val">{row.val}</div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    <!-- Teams -->
                    <div class="section-card">
                        <div class="section-title">
                            <span class="s-bar"></span>
                            Команди ({t.teams.length})
                        </div>

                        {#if t.teams.length === 0}
                            <div class="empty-teams">Команд ще немає — будь першим!</div>
                        {:else}
                            {#each t.teams as team}
                                <div class="team-row">
                                    <div class="team-avatar">{team.name[0].toUpperCase()}</div>
                                    <div>
                                        <div class="team-name">{team.name}</div>
                                        <div class="team-sub">
                                            {team.captain.name} · {(team._count?.members ?? 0) + 1} учасників
                                        </div>
                                    </div>
                                    {#if team.city}
                                        <div class="team-city">{team.city}</div>
                                    {/if}
                                </div>
                            {/each}
                        {/if}
                    </div>
                </div>

                <!-- ── RIGHT: registration widget ── -->
                <div>
                    <div class="reg-widget">
                        <div class="rw-title">{t.title}</div>

                        {@const cfg = statusCfg[t.status] ?? statusCfg.DRAFT}
                        <span class="rw-status" style="background:{cfg.bg}; color:{cfg.color};">
                            {#if cfg.pulse}<span class="pulse-dot" style="background:{cfg.color};"></span>{/if}
                            {cfg.label}
                        </span>

                        <!-- My team box -->
                        {#if hasTeam}
                            <div class="my-team-box">
                                <div class="mt-label">Моя команда</div>
                                <div class="mt-name">{data.userTeam?.name}</div>
                            </div>
                        {/if}

                        <!-- Countdown -->
                        {#if isRegistrationOpen}
                            <div class="countdown-box">
                                <div class="countdown-label">До закриття реєстрації</div>
                                <div class="countdown-val">{getCountdown(t.regEnd)}</div>
                            </div>
                        {/if}

                        <!-- Stats -->
                        <div class="rw-stats">
                            <div class="rw-stat">
                                <span class="rw-stat-label">Зареєстровано:</span>
                                <span class="rw-stat-val">
                                    {t.teams.length} {t.maxTeams ? `/ ${t.maxTeams}` : ''} команд
                                </span>
                            </div>
                            <div class="rw-stat">
                                <span class="rw-stat-label">Мін. команда:</span>
                                <span class="rw-stat-val">2 учасники</span>
                            </div>
                            <div class="rw-stat">
                                <span class="rw-stat-label">Макс. команда:</span>
                                <span class="rw-stat-val">5 учасників</span>
                            </div>
                        </div>

                        <!-- Action buttons -->
                        {#if hasTeam && hasTask}
                            <a href="/tourments/{t.id}/task" class="btn-reg">
                                Перейти до завдання
                            </a>
                            <a href="/tourments/{t.id}/submit" class="btn-reg secondary">
                                Сторінка сабміту
                            </a>
                        {:else if hasTeam}
                            <a href="/my-teams/{data.userTeam?.id}" class="btn-reg secondary">
                                Акаунт команди
                            </a>
                        {:else if canRegister}
                            <a href="/tourments/{t.id}/register" class="btn-reg">
                                Зареєструватися в команді
                            </a>
                            <a href="/my-teams" class="btn-reg secondary">
                                Доєднатись до команди
                            </a>
                        {:else if t.status === 'RUNNING'}
                            <span class="btn-reg disabled">Реєстрація закрита</span>
                        {:else if t.status === 'FINISHED'}
                            <span class="btn-reg disabled">Турнір завершено</span>
                        {:else}
                            <div class="rw-hint">Реєстрація ще не відкрита</div>
                        {/if}

                        {#if !data.user && isRegistrationOpen}
                            <div class="rw-hint" style="margin-top:10px;">
                                <a href="/auth/login" style="color:#3E83FF;">Увійдіть</a>, щоб зареєструватись
                            </div>
                        {/if}
                    </div>
                </div>
            </div>

        </main>
    </div>
    <Footer />
</div>
