<!-- src/routes/courses/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data }: { data: PageData } = $props();

    const statusCfg: Record<string, { label: string; color: string; bg: string; pulse: boolean }> = {
        RUNNING:      { label: "Тривають оцінювання", color: "#4ADE80", bg: "rgba(74,222,128,.12)",  pulse: true  },
        REGISTRATION: { label: "Реєстрація відкрита", color: "#3E83FF", bg: "rgba(62,131,255,.12)", pulse: false },
        FINISHED:     { label: "Завершено",            color: "#64748B", bg: "rgba(100,116,139,.1)", pulse: false },
        DRAFT:        { label: "Чернетка",             color: "#475569", bg: "rgba(71,85,105,.1)",   pulse: false },
    };

    function fmt(d: string | Date | null | undefined) {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
    }

    function fmtShort(d: string | Date | null | undefined) {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("uk-UA", { day: "numeric", month: "short" });
    }

    function getMemberCount(team: any): number {
        return (team.members?.length ?? 0) + 1; // +1 for captain
    }

    function hasSubmission(team: any): boolean {
        return (team.submissions?.length ?? 0) > 0;
    }
</script>

<svelte:head>
    <title>Мої турніри — LvUp</title>
</svelte:head>

<style>
/* ── shell ── */
.page { min-height:100vh; background:var(--bg); color:var(--text); font-family:"Manrope",sans-serif; display:flex; flex-direction:column; }
.body { display:flex; flex:1; min-height:0; }
.main { flex:1; padding:32px 40px 64px; max-width:1000px; margin:0 auto; }

/* breadcrumb */
.bc   { font-size:13px; color:var(--text-dim); margin-bottom:8px; display:flex; flex-wrap:wrap; gap:4px; }
.bc a { color:var(--text-muted); text-decoration:none; }
.bc a:hover { color:#3E83FF; }

/* page title */
.page-title { font-size:30px; font-weight:800; color:var(--text); margin-bottom:24px; letter-spacing:-.4px; }
:global(.light-mode) .page-title { color:#0a0e1a; }

/* ── Empty state ── */
.empty {
    text-align:center; padding:60px 24px;
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px;
}
:global(.light-mode) .empty { background:#fff; border-color:rgba(10,14,26,.08); }
.empty-icon { margin-bottom:16px; opacity:.3; }
.empty-title { font-size:18px; font-weight:700; color:var(--text); margin-bottom:8px; }
:global(.light-mode) .empty-title { color:#0a0e1a; }
.empty-desc  { font-size:14px; color:var(--text-muted); margin-bottom:20px; }
.btn-go {
    display:inline-flex; align-items:center; gap:6px;
    padding:11px 24px; border-radius:10px;
    background:#3E83FF; color:#fff; text-decoration:none;
    font-size:14px; font-weight:700; transition:background .12s;
}
.btn-go:hover { background:#2d6fe0; }

/* ── Tournament card ── */
.t-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; margin-bottom:16px; overflow:hidden;
    transition:border-color .15s, box-shadow .15s;
}
.t-card:hover { border-color:rgba(62,131,255,.3); box-shadow:0 4px 20px rgba(0,0,0,.12); }
:global(.light-mode) .t-card { background:#fff; border-color:rgba(10,14,26,.08); }
:global(.light-mode) .t-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.07); }

/* Card top */
.card-top { padding:22px 26px 16px; display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.card-left { flex:1; min-width:0; }

.status-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
.status-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 12px; border-radius:20px; font-size:11px; font-weight:700;
}
.pulse-dot { width:6px; height:6px; border-radius:50%; animation:pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

.t-title { font-size:20px; font-weight:800; color:var(--text); margin-bottom:6px; letter-spacing:-.3px; }
:global(.light-mode) .t-title { color:#0a0e1a; }

.t-desc { font-size:14px; color:var(--text-muted); line-height:1.55; margin-bottom:12px; }

/* Team info badge */
.team-badge {
    display:inline-flex; align-items:center; gap:6px;
    padding:5px 12px; border-radius:8px; font-size:13px; font-weight:600;
    background:rgba(62,131,255,.08); color:#3E83FF;
    border:1px solid rgba(62,131,255,.18);
}
:global(.light-mode) .team-badge { background:rgba(62,131,255,.06); }

/* Action buttons */
.card-right { display:flex; flex-direction:column; gap:8px; align-items:flex-end; flex-shrink:0; }

.btn-primary {
    display:inline-flex; align-items:center; gap:6px;
    padding:10px 22px; border-radius:9px; font-size:14px; font-weight:700;
    background:#3E83FF; color:#fff; text-decoration:none;
    white-space:nowrap; transition:background .12s;
}
.btn-primary:hover { background:#2d6fe0; }

.btn-outline {
    display:inline-flex; align-items:center; gap:6px;
    padding:9px 18px; border-radius:9px; font-size:13px; font-weight:600;
    background:transparent; color:#3E83FF;
    border:1px solid rgba(62,131,255,.3); text-decoration:none;
    white-space:nowrap; transition:background .12s;
}
.btn-outline:hover { background:rgba(62,131,255,.08); }

/* Card bottom: meta */
.card-bottom {
    padding:12px 26px;
    border-top:1px solid var(--border);
    background:var(--bg-secondary);
    display:flex; align-items:center; gap:20px; flex-wrap:wrap;
}
:global(.light-mode) .card-bottom { background:#f8faff; border-color:rgba(10,14,26,.07); }

.meta-item { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--text-muted); }
:global(.light-mode) .meta-item { color:rgba(10,14,26,.55); }

/* Submission status */
.sub-badge {
    display:inline-flex; align-items:center; gap:4px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;
    margin-left:auto;
}
.sub-done { background:rgba(74,222,128,.12); color:#4ADE80; }
.sub-none { background:rgba(255,255,255,.06); color:var(--text-dim); }
:global(.light-mode) .sub-none { background:rgba(0,0,0,.05); color:rgba(10,14,26,.4); }

@media(max-width:700px) {
    .main { padding:16px 14px 48px; }
    .card-top { flex-direction:column; }
    .card-right { flex-direction:row; }
    .page-title { font-size:22px; }
}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">

            <div class="bc">
                <a href="/my-teams">Кабінет</a>
                <span>/</span>
                <span style="color:#3E83FF;">Мої турніри</span>
            </div>

            <h1 class="page-title">Мої турніри</h1>

            {#if data.teams.length === 0}
                <!-- Empty state -->
                <div class="empty">
                    <div class="empty-icon">
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                            <path d="M4 22h16"/>
                            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
                            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                        </svg>
                    </div>
                    <div class="empty-title">Ти ще не берешь участь у турнірах</div>
                    <p class="empty-desc">Знайди активний турнір і зареєструй свою команду</p>
                    <a href="/tourments" class="btn-go">
                        Переглянути турніри
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </a>
                </div>
            {:else}
                {#each data.teams as team}
                    {@const t = team.tournament}
                    {@const cfg = statusCfg[t.status] ?? statusCfg.DRAFT}
                    {@const task = t.tasks?.[0]}
                    {@const submitted = hasSubmission(team)}

                    <div class="t-card">
                        <div class="card-top">
                            <div class="card-left">
                                <div class="status-row">
                                    <span class="status-badge" style="background:{cfg.bg}; color:{cfg.color};">
                                        {#if cfg.pulse}<span class="pulse-dot" style="background:{cfg.color};"></span>{/if}
                                        {cfg.label}
                                    </span>
                                </div>

                                <div class="t-title">{t.title}</div>
                                <div class="t-desc">
                                    {t.description.length > 120 ? t.description.slice(0, 120) + "..." : t.description}
                                </div>

                                <span class="team-badge">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                    {team.name} · {getMemberCount(team)} учасників
                                </span>
                            </div>

                            <!-- Action buttons -->
                            <div class="card-right">
                                <a href="/tourments/{t.id}" class="btn-primary">
                                    Переглянути
                                </a>
                                {#if task}
                                    <a href="/tourments/{t.id}/task" class="btn-outline">
                                        Завдання
                                    </a>
                                    <a href="/tourments/{t.id}/submit" class="btn-outline">
                                        Сабміт
                                    </a>
                                {/if}
                                <a href="/my-teams/{team.id}" class="btn-outline">
                                    Команда
                                </a>
                            </div>
                        </div>

                        <!-- Card bottom: meta -->
                        <div class="card-bottom">
                            <div class="meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                Реєстрація до {fmtShort(t.regEnd)}
                            </div>

                            <div class="meta-item">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                {t._count?.teams ?? 0} команд
                            </div>

                            {#if task}
                                <div class="meta-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    Дедлайн: {fmtShort(task.deadline)}
                                </div>
                            {/if}

                            <span class="sub-badge {submitted ? 'sub-done' : 'sub-none'}" style="margin-left:auto;">
                                {submitted ? "✓ Сабміт подано" : "Сабміт не подано"}
                            </span>
                        </div>
                    </div>
                {/each}
            {/if}

        </main>
    </div>
    <Footer />
</div>
