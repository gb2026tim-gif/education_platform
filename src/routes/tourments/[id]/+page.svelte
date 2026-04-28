<!-- src/routes/tourments/[id]/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";

    let { data }: { data: PageData } = $props();
    const t = $derived(data.tournament);

    const statusLabel: Record<string, string> = {
        DRAFT: "Чернетка",
        REGISTRATION: "Реєстрація",
        RUNNING: "Активний",
        FINISHED: "Завершено",
    };
    const statusColor: Record<string, string> = {
        DRAFT: "rgba(255,255,255,.12)",
        REGISTRATION: "rgba(61,142,240,.18)",
        RUNNING: "rgba(62,207,124,.18)",
        FINISHED: "rgba(255,255,255,.08)",
    };
    const statusText: Record<string, string> = {
        DRAFT: "rgba(255,255,255,.6)",
        REGISTRATION: "#5aaeff",
        RUNNING: "#3ecf7c",
        FINISHED: "rgba(255,255,255,.45)",
    };

    function fmt(d: string | Date) {
        return new Date(d).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }
</script>

<svelte:head>
    <title>{t.title} — LvUp</title>
</svelte:head>

<style>
    .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: "Manrope", sans-serif; display: flex; flex-direction: column; }

    .content { flex: 1; max-width: 860px; margin: 0 auto; width: 100%; padding: 36px 24px 64px; }

    /* back link */
    .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; color: var(--text-muted); text-decoration: none; margin-bottom: 28px; transition: color .15s; }
    .back-link:hover { color: #3d8ef0; }

    /* hero */
    .hero {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 32px 36px;
        margin-bottom: 20px;
        position: relative;
        overflow: hidden;
    }
    :global(.light-mode) .hero { box-shadow: 0 4px 20px rgba(0,0,0,.07); }
    .hero::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 80% 60% at 10% 0%, rgba(61,142,240,.12) 0%, transparent 70%);
        pointer-events: none;
    }

    .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 10px; }
    .hero-title { font-size: 30px; font-weight: 800; color: var(--text); letter-spacing: -.5px; }
    .status-badge { padding: 5px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }

    .hero-desc { font-size: 15px; color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; }

    .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1px solid var(--border); padding-top: 20px; }
    .meta-item { padding: 0 20px 0 0; border-right: 1px solid var(--border); }
    .meta-item:last-child { border-right: none; padding-left: 20px; padding-right: 0; }
    .meta-item:first-child { padding-left: 0; }
    .meta-label { font-size: 13px; color: var(--text-dim); margin-bottom: 4px; }
    .meta-value { font-size: 15px; font-weight: 600; color: var(--text); }

    /* section card */
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px 28px; margin-bottom: 16px; }
    :global(.light-mode) .card { box-shadow: 0 2px 12px rgba(0,0,0,.06); }
    .card-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .card-accent { width: 4px; height: 18px; background: #3d8ef0; border-radius: 3px; flex-shrink: 0; }

    /* task row */
    .task-row {
        display: flex; align-items: center; justify-content: space-between;
        padding: 14px 18px; border-radius: 10px;
        background: var(--bg-secondary); border: 1px solid var(--border);
        transition: border-color .15s;
        gap: 16px;
    }
    .task-row:hover { border-color: rgba(61,142,240,.35); }
    .task-name { font-size: 15px; font-weight: 600; color: var(--text); }
    .task-deadline { font-size: 13px; color: var(--text-muted); white-space: nowrap; }

    .task-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

    .btn-primary {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 9px 20px; border-radius: 9px;
        background: #3d8ef0; color: #fff;
        font-size: 14px; font-weight: 700; font-family: "Manrope", sans-serif;
        text-decoration: none; border: none; cursor: pointer;
        transition: background .15s;
        white-space: nowrap;
    }
    .btn-primary:hover { background: #2d7de0; }

    .btn-outline {
        display: inline-flex; align-items: center; gap: 7px;
        padding: 9px 18px; border-radius: 9px;
        background: rgba(61,142,240,.1); color: #3d8ef0;
        border: 1px solid rgba(61,142,240,.25);
        font-size: 14px; font-weight: 600; font-family: "Manrope", sans-serif;
        text-decoration: none; cursor: pointer;
        transition: background .15s;
        white-space: nowrap;
    }
    .btn-outline:hover { background: rgba(61,142,240,.2); }

    /* team row */
    .team-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border); gap: 12px; }
    .team-row:last-child { border-bottom: none; padding-bottom: 0; }
    .team-row:first-child { padding-top: 0; }
    .team-avatar { width: 38px; height: 38px; border-radius: 9px; background: linear-gradient(135deg,#1e3a7a,#1a50a0); border: 1px solid rgba(61,142,240,.3); display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: #5aaeff; flex-shrink: 0; }
    .team-info { flex: 1; min-width: 0; }
    .team-name { font-size: 15px; font-weight: 600; color: var(--text); }
    .team-sub { font-size: 13px; color: var(--text-muted); margin-top: 2px; }
    .team-city { font-size: 13px; color: var(--text-dim); }

    /* my-team highlight */
    .my-team-banner {
        background: rgba(61,142,240,.08);
        border: 1px solid rgba(61,142,240,.22);
        border-radius: 12px;
        padding: 14px 18px;
        margin-bottom: 16px;
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        flex-wrap: wrap;
    }
    .my-team-text { font-size: 14px; color: var(--text-muted); }
    .my-team-text strong { color: var(--text); font-weight: 700; }

    /* register CTA */
    .register-cta {
        margin-top: 20px; padding-top: 20px;
        border-top: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between; gap: 12px;
        flex-wrap: wrap;
    }
    .register-hint { font-size: 14px; color: var(--text-muted); }

    /* empty */
    .empty { padding: 24px 0; text-align: center; color: var(--text-dim); font-size: 14px; }

    @media (max-width: 640px) {
        .hero { padding: 22px 18px; }
        .hero-title { font-size: 22px; }
        .meta-grid { grid-template-columns: 1fr; gap: 12px; }
        .meta-item { border-right: none; border-bottom: 1px solid var(--border); padding: 0 0 12px; }
        .meta-item:last-child { border-bottom: none; padding-bottom: 0; }
        .task-row { flex-direction: column; align-items: flex-start; }
    }
</style>

<div class="page">
    <Header />

    <div class="content">

        <!-- Back -->
        <a href="/tourments" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Всі турніри
        </a>

        <!-- Hero -->
        <div class="hero">
            <div class="hero-top">
                <h1 class="hero-title">{t.title}</h1>
                <span class="status-badge"
                      style="background:{statusColor[t.status]}; color:{statusText[t.status]};">
          {statusLabel[t.status]}
        </span>
            </div>
            <p class="hero-desc">{t.description}</p>

            <div class="meta-grid">
                <div class="meta-item">
                    <div class="meta-label">Початок реєстрації</div>
                    <div class="meta-value">{fmt(t.regStart)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Кінець реєстрації</div>
                    <div class="meta-value">{fmt(t.regEnd)}</div>
                </div>
                {#if t.maxTeams}
                    <div class="meta-item">
                        <div class="meta-label">Команди</div>
                        <div class="meta-value">{t.teams.length} / {t.maxTeams}</div>
                    </div>
                {:else}
                    <div class="meta-item">
                        <div class="meta-label">Команди</div>
                        <div class="meta-value">{t.teams.length}</div>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Моя команда -->
        {#if data.userTeam}
            <div class="my-team-banner">
                <div class="my-team-text">
                    Ти берешь участь з командою <strong>{data.userTeam.name}</strong>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    {#if data.task}
                        <a href="/tourments/{t.id}/task" class="btn-primary">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            Завдання
                        </a>
                        <a href="/tourments/{t.id}/submit" class="btn-outline">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                            </svg>
                            Сабміт
                        </a>
                    {/if}
                    <a href="/my-teams/{data.userTeam.id}" class="btn-outline">Моя команда</a>
                </div>
            </div>
        {/if}

        <!-- Завдання -->
        {#if t.tasks.length > 0}
            <div class="card">
                <div class="card-title">
                    <span class="card-accent"></span>
                    Завдання
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    {#each t.tasks as task}
                        <div class="task-row">
                            <div>
                                <div class="task-name">{task.title}</div>
                                <div class="task-deadline">Дедлайн: {fmt(task.deadline)}</div>
                            </div>
                            <div class="task-actions">
                                <a href="/tourments/{t.id}/task" class="btn-primary" style="font-size:13px; padding:8px 16px;">
                                    Переглянути
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Команди -->
        <div class="card">
            <div class="card-title">
                <span class="card-accent"></span>
                Команди ({t.teams.length})
            </div>

            {#if t.teams.length === 0}
                <div class="empty">Команд ще немає — будь першим!</div>
            {:else}
                <div>
                    {#each t.teams as team}
                        <div class="team-row">
                            <div class="team-avatar">{team.name?.charAt(0).toUpperCase() || '?'}</div>
                            <div class="team-info">
                                <div class="team-name">{team.name}</div>
                                <div class="team-sub">{team.captain.name} · {team._count.members + 1} учасників</div>
                            </div>
                            {#if team.city}
                                <div class="team-city">{team.city}</div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}

            <!-- Реєстрація (якщо відкрита і юзер без команди) -->
            {#if t.status === 'REGISTRATION' && !data.userTeam}
                <div class="register-cta">
                    <div class="register-hint">Хочеш взяти участь? Зареєструй свою команду.</div>
                    <a href="/tourments/{t.id}/register" class="btn-primary">
                        Зареєструватись
                    </a>
                </div>
            {/if}
        </div>

    </div>

    <Footer />
</div>