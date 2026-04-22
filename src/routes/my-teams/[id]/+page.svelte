<!-- src/routes/my-teams/[id]/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();
    const t = $derived(data.team);

    let inviteEmail  = $state('');
    let inviteStatus = $state<'idle' | 'sending' | 'done' | 'error'>('idle');
    let inviteMsg    = $state('');

    const teamStatusLabel: Record<string, string> = { PENDING: 'Очікує', APPROVED: 'Активна', REJECTED: 'Відхилено' };
    const teamStatusColor: Record<string, string> = { PENDING: '#f59e0b', APPROVED: '#3ecf7c', REJECTED: '#ef4444' };
    const teamStatusBg:    Record<string, string> = { PENDING: 'rgba(245,158,11,.2)', APPROVED: 'rgba(62,207,124,.2)', REJECTED: 'rgba(239,68,68,.2)' };

    function formatDate(d: string | Date) {
        return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
    }

    const submission = $derived(t.submissions[0] ?? null);
    const task       = $derived(t.submissions[0]?.task ?? null);
    const deadline   = $derived(task?.deadline ?? null);

    async function sendInvite() {
        if (!inviteEmail.trim()) return;
        inviteStatus = 'sending';
        try {
            const fd = new FormData();
            fd.append('email', inviteEmail.trim());
            const res = await fetch('?/inviteMember', { method: 'POST', body: fd });
            inviteStatus = res.ok ? 'done' : 'error';
            inviteMsg    = res.ok ? `Запрошення надіслано на ${inviteEmail}` : 'Не вдалось надіслати';
            if (res.ok) {
                inviteEmail = '';
                setTimeout(() => { inviteStatus = 'idle'; inviteMsg = ''; }, 3000);
            }
        } catch {
            inviteStatus = 'error';
            inviteMsg    = 'Помилка мережі';
        }
    }

    // Hover helpers — TypeScript cast stays in <script>, not in template
    function hoverRed(e: MouseEvent) {
        (e.currentTarget as HTMLButtonElement).style.color = '#dc2626';
    }
    function unhoverRed(e: MouseEvent) {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--t-value)';
    }
</script>

<svelte:head><title>{t?.name ?? "Команда"} — LvUp</title></svelte:head>

<style>
    /* ── layout ──────────────────────────────── */
    .page-wrap {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Manrope', sans-serif;
    }

    .main-area {
        flex: 1;
        padding: 32px 40px;
        position: relative;
        background:
                radial-gradient(ellipse 100% 55% at 40% -5%, rgba(18,55,150,.65) 0%, transparent 60%),
                radial-gradient(ellipse 70% 45% at 85% 25%, rgba(10,35,110,.45) 0%, transparent 55%),
                #08101e;
        min-height: calc(100vh - 72px);
    }

    :global(.light-mode) .main-area {
        background:
                radial-gradient(ellipse 100% 55% at 40% -5%, rgba(190,215,255,.5) 0%, transparent 60%),
                radial-gradient(ellipse 70% 45% at 85% 25%, rgba(170,205,255,.35) 0%, transparent 55%),
                #eef2ff;
    }

    /* ── hero card ───────────────────────────── */
    .hero-card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 20px;
        backdrop-filter: blur(10px);
    }

    :global(.light-mode) .hero-card {
        background: #ffffff;
        border-color: rgba(61,142,240,.2);
        box-shadow: 0 4px 24px rgba(61,142,240,.1);
    }

    .hero-top { padding: 24px 32px; display: flex; align-items: center; gap: 20px; }

    .stats-bar {
        border-top: 1px solid rgba(255,255,255,.07);
        padding: 0 32px;
        height: 54px;
        display: flex;
        align-items: center;
        background: rgba(0,0,0,.25);
    }

    :global(.light-mode) .stats-bar {
        border-color: rgba(61,142,240,.12);
        background: rgba(61,142,240,.04);
    }

    .sep { width: 1px; height: 22px; background: rgba(255,255,255,.1); margin: 0 22px; flex-shrink: 0; }
    :global(.light-mode) .sep { background: rgba(61,142,240,.18); }

    .hero-avatar {
        width: 60px; height: 60px; border-radius: 12px;
        background: linear-gradient(135deg,#1e3a7a,#1a50a0);
        border: 1.5px solid rgba(61,142,240,.5);
        display: flex; align-items: center; justify-content: center;
        font-size: 26px; font-weight: 800; color: #5aaeff; flex-shrink: 0;
    }

    .htitle { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 4px; }
    .hsub   { font-size: 13px; color: rgba(255,255,255,.45); }
    :global(.light-mode) .hsub { color: rgba(10,14,26,.5); }

    .stat-chip { display: flex; align-items: center; gap: 7px; font-size: 13px; color: rgba(255,255,255,.55); white-space: nowrap; }
    :global(.light-mode) .stat-chip { color: rgba(10,14,26,.55); }

    .badge-status { padding: 5px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; white-space: nowrap; }

    .badge-blue {
        padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap;
        background: rgba(61,142,240,.15); color: #5aaeff; border: 1px solid rgba(61,142,240,.25);
    }
    :global(.light-mode) .badge-blue { background: rgba(61,142,240,.12); color: #1a5cc8; }

    .tour-lbl { font-size: 13px; color: rgba(255,255,255,.45); display: flex; align-items: center; gap: 6px; }
    :global(.light-mode) .tour-lbl { color: rgba(10,14,26,.5); }

    .tour-val {
        font-size: 13px; font-weight: 700; color: #5aaeff;
        background: rgba(61,142,240,.12); padding: 2px 10px; border-radius: 6px;
        border: 1px solid rgba(61,142,240,.22);
    }
    :global(.light-mode) .tour-val { color: #1a5cc8; }

    /* ── panels ──────────────────────────────── */
    .panel {
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 16px;
        padding: 24px;
        backdrop-filter: blur(6px);
    }

    :global(.light-mode) .panel {
        background: #ffffff;
        border-color: rgba(61,142,240,.15);
        box-shadow: 0 2px 16px rgba(0,0,0,.06);
    }

    .p-title { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 18px; }
    .p-accent { width: 3px; height: 17px; background: #3d8ef0; border-radius: 2px; display: block; }

    /* ── member rows ─────────────────────────── */
    .mrow {
        display: flex; align-items: center; gap: 12px;
        padding: 10px 14px; border-radius: 10px;
        background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.06);
        margin-bottom: 8px; transition: border-color .15s;
    }
    :global(.light-mode) .mrow { background: rgba(61,142,240,.05); border-color: rgba(61,142,240,.12); }
    .mrow:hover { border-color: rgba(255,255,255,.14); }
    :global(.light-mode) .mrow:hover { border-color: rgba(61,142,240,.28); }

    .mavatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
    .mname   { font-size: 13px; font-weight: 600; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .memail  { font-size: 11px; color: rgba(255,255,255,.3); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    :global(.light-mode) .memail { color: rgba(10,14,26,.4); }

    /* ── resource rows ───────────────────────── */
    .rrow {
        display: flex; align-items: center; justify-content: space-between;
        padding: 13px 16px; border-radius: 10px;
        background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.07);
        margin-bottom: 8px; transition: border-color .15s;
    }
    :global(.light-mode) .rrow { background: rgba(61,142,240,.05); border-color: rgba(61,142,240,.12); }
    .rrow:hover { border-color: rgba(255,255,255,.15); }
    :global(.light-mode) .rrow:hover { border-color: rgba(61,142,240,.3); }

    .ricon {
        width: 36px; height: 36px; border-radius: 9px;
        background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    :global(.light-mode) .ricon { background: rgba(61,142,240,.08); border-color: rgba(61,142,240,.15); }

    /* SVG inside .ricon — color set via CSS */
    .ricon-svg { color: rgba(255,255,255,.5); }
    :global(.light-mode) .ricon-svg { color: #3d6abf; }

    .rlabel { font-size: 12px; color: rgba(255,255,255,.45); margin-bottom: 2px; }
    :global(.light-mode) .rlabel { color: rgba(10,14,26,.5); }

    .rval { font-size: 12px; color: rgba(255,255,255,.28); }
    :global(.light-mode) .rval { color: rgba(10,14,26,.38); }

    .rlink { font-size: 12px; color: #5aaeff; text-decoration: none; }
    .rlink:hover { text-decoration: underline; }

    .raction { font-size: 12px; color: #5aaeff; background: none; border: none; cursor: pointer; font-family: 'Manrope', sans-serif; font-weight: 600; flex-shrink: 0; padding: 0; }
    :global(.light-mode) .raction { color: #1a5cc8; }

    /* ── deadline ────────────────────────────── */
    .deadline-banner {
        display: flex; align-items: center; gap: 8px;
        margin-bottom: 16px; padding: 11px 14px; border-radius: 10px;
        background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.22);
    }

    /* ── invite ──────────────────────────────── */
    .invite-wrap { display: flex; gap: 8px; margin-top: 16px; }

    .invite-input {
        flex: 1; padding: 10px 14px; border-radius: 9px;
        border: 1px solid rgba(255,255,255,.1); background: rgba(0,0,0,.3);
        color: var(--text); font-size: 13px; font-family: 'Manrope', sans-serif; outline: none;
        transition: border-color .15s;
    }
    :global(.light-mode) .invite-input { background: rgba(61,142,240,.06); border-color: rgba(61,142,240,.2); color: #0a0e1a; }
    .invite-input::placeholder { color: rgba(255,255,255,.3); }
    :global(.light-mode) .invite-input::placeholder { color: rgba(10,14,26,.3); }
    .invite-input:focus { border-color: #3d8ef0; }

    .invite-btn {
        padding: 10px 18px; border-radius: 9px;
        border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.07); color: rgba(255,255,255,.7);
        font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Manrope', sans-serif; white-space: nowrap;
        transition: background .15s, border-color .15s, color .15s;
    }
    :global(.light-mode) .invite-btn { background: rgba(61,142,240,.1); border-color: rgba(61,142,240,.25); color: #1a5cc8; }
    .invite-btn:hover { background: rgba(61,142,240,.25); border-color: #3d8ef0; color: #fff; }
    .invite-btn:disabled { opacity: .35; cursor: not-allowed; }

    /* invite status messages — :global because class applied dynamically */
    :global(.im-done)  { font-size: 12px; margin-top: 6px; padding: 6px 10px; border-radius: 7px; color: #166534; background: rgba(62,207,124,.1); border: 1px solid rgba(62,207,124,.25); }
    :global(.im-error) { font-size: 12px; margin-top: 6px; padding: 6px 10px; border-radius: 7px; color: #991b1b; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2); }

    /* ── CTA buttons ─────────────────────────── */
    .cta-row { display: flex; gap: 10px; margin-top: 4px; }

    .btn-gray {
        flex: 1; padding: 12px; border-radius: 10px;
        border: 1px solid rgba(255,255,255,.15); background: rgba(255,255,255,.06); color: rgba(255,255,255,.6);
        font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Manrope', sans-serif;
        text-align: center; text-decoration: none; display: block; transition: border-color .15s, color .15s, background .15s;
    }
    :global(.light-mode) .btn-gray { border-color: rgba(61,142,240,.2); background: rgba(61,142,240,.07); color: rgba(10,14,26,.6); }
    .btn-gray:hover { border-color: #3d8ef0; color: #3d8ef0; background: rgba(61,142,240,.1); }

    .btn-blue {
        flex: 1; padding: 12px; border-radius: 10px; border: none; background: #3d8ef0;
        color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Manrope', sans-serif;
        text-align: center; text-decoration: none; display: block; transition: background .15s;
    }
    .btn-blue:hover { background: #2d7de0; }

    /* ── leave button ────────────────────────── */
    .leave-btn {
        padding: 8px 16px; border-radius: 8px;
        border: 1px solid rgba(239,68,68,.3); background: rgba(239,68,68,.07);
        color: #dc2626; font-size: 12px; font-weight: 600; cursor: pointer;
        font-family: 'Manrope', sans-serif; display: flex; align-items: center; gap: 6px;
        transition: background .15s, border-color .15s;
    }
    .leave-btn:hover { background: rgba(239,68,68,.16); border-color: rgba(239,68,68,.5); }

    /* ── delete member button ────────────────── */
    .del-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; padding-left: 6px; color: rgba(255,255,255,.3); transition: color .15s; }
    .del-btn:hover { color: #dc2626; }
    :global(.light-mode) .del-btn { color: rgba(10,14,26,.25); }
    :global(.light-mode) .del-btn:hover { color: #dc2626; }

    /* ── breadcrumb & title ──────────────────── */
    .bc    { font-size: 12px; color: rgba(255,255,255,.35); margin-bottom: 8px; }
    :global(.light-mode) .bc { color: rgba(10,14,26,.4); }
    .bc a  { color: rgba(255,255,255,.5); text-decoration: none; }
    :global(.light-mode) .bc a { color: rgba(10,14,26,.55); }
    .bc a:hover { text-decoration: underline; }
    .ptitle { font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 22px; }

    /* ── no-task placeholder ─────────────────── */
    .no-task {
        padding: 10px 14px; border-radius: 10px;
        background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
        margin-bottom: 16px; font-size: 12px; color: rgba(255,255,255,.3);
    }
    :global(.light-mode) .no-task { background: rgba(61,142,240,.05); border-color: rgba(61,142,240,.12); color: rgba(10,14,26,.4); }
</style>

<div class="page-wrap">
    <Header />

    <div style="display:flex; min-height:calc(100vh - 72px);">
        <Sidebar user={data.user} />

        <main class="main-area">
            <div style="position:relative; z-index:1;">

                <div class="bc">Кабінет / <a href="/my-teams">Акаунт команди</a></div>
                <h1 class="ptitle">Акаунт команди</h1>

                <!-- HERO CARD -->
                <div class="hero-card">
                    <div class="hero-top">
                        <div class="hero-avatar">{t?.name?.[0]?.toUpperCase() ?? "?"}</div>
                        <div style="flex:1; min-width:0;">
                            <div class="htitle">{t.name}</div>
                            <div class="hsub">Командир · {t.captain?.name ?? ''}</div>
                        </div>
                    </div>

                    <div class="stats-bar">
                        <div class="stat-chip">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                            </svg>
                            {t.members.length + 1} учасники
                        </div>
                        <div class="sep"></div>

                        <span class="badge-status" style="background:{teamStatusBg[t.status]}; color:{teamStatusColor[t.status]};">
							{teamStatusLabel[t.status]}
						</span>
                        <div class="sep"></div>

                        <span class="badge-blue">1 турнір</span>
                        <div class="sep"></div>

                        <span class="tour-lbl">Турнір: <span class="tour-val">{t.tournament.title}</span></span>

                        <div style="flex:1; display:flex; justify-content:flex-end;">
                            <form method="POST" action="?/leaveTeam" use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') window.location.href = '/my-teams';
								};
							}}>
                                <button type="submit" class="leave-btn"
                                        onclick={(e) => { if (!confirm('Покинути команду?')) e.preventDefault(); }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                        <polyline points="16 17 21 12 16 7"/>
                                        <line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                    {data.isCaptain ? 'Розпустити' : 'Покинути'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- TWO COLUMNS -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">

                    <!-- LEFT: Members -->
                    <div class="panel">
                        <div class="p-title"><span class="p-accent"></span> Склад :</div>

                        <!-- Captain -->
                        <div class="mrow">
                            <div class="mavatar" style="background:#1e3a7a; color:#5aaeff; border:1.5px solid rgba(61,142,240,.3);">
                                {t.captain?.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div style="flex:1; min-width:0;">
                                <div class="mname">{t.captain?.name ?? ''}</div>
                                <div class="memail">{t.captain?.email ?? ''}</div>
                            </div>
                            <span class="badge-blue" style="font-size:11px; padding:3px 10px;">Командир</span>
                        </div>

                        {#each t.members as member}
                            <div class="mrow">
                                <div class="mavatar" style="background:rgba(62,207,124,.12); border:1.5px solid rgba(62,207,124,.25); color:#166534;">
                                    {member.name?.[0]?.toUpperCase() ?? "?"}
                                </div>
                                <div style="flex:1; min-width:0;">
                                    <div class="mname">{member.name}</div>
                                    <div class="memail">{member.email}</div>
                                </div>
                                <span style="padding:3px 10px; border-radius:8px; font-size:11px; font-weight:700; background:rgba(62,207,124,.14); color:#166534; white-space:nowrap;">Підтверджено</span>
                                {#if data.isCaptain}
                                    <button type="button" class="del-btn" aria-label="Видалити учасника"
                                            onmouseenter={hoverRed}
                                            onmouseleave={unhoverRed}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                {/if}
                            </div>
                        {/each}

                        {#if t.members.length === 0}
                            <div style="text-align:center; padding:16px; color:rgba(255,255,255,.25); font-size:13px;">Немає інших учасників</div>
                        {/if}

                        <!-- Invite row — captain only -->
                        {#if data.isCaptain}
                            <div style="margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,.07);">
                                <div class="invite-wrap">
                                    <input
                                            bind:value={inviteEmail}
                                            type="email"
                                            placeholder="e-mail нового учасника"
                                            class="invite-input"
                                            onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendInvite(); } }}
                                    />
                                    <button
                                            type="button"
                                            class="invite-btn"
                                            disabled={inviteStatus === 'sending' || !inviteEmail.trim()}
                                            onclick={sendInvite}>
                                        {inviteStatus === 'sending' ? '...' : 'Запросити'}
                                    </button>
                                </div>
                                {#if inviteMsg}
                                    <div class="im-{inviteStatus}">{inviteMsg}</div>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- RIGHT: Submit -->
                    <div class="panel">
                        <div class="p-title"><span class="p-accent"></span> Сабміт:</div>

                        {#if deadline}
                            <div class="deadline-banner">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
                                    <circle cx="12" cy="12" r="10"/>
                                    <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                <span style="font-size:13px; color:#ef4444; font-weight:700;">Дедлайн : {formatDate(deadline)} 23:59</span>
                            </div>
                        {:else}
                            <div class="no-task">Завдань поки немає — команду ще не зареєстровано на активний турнір</div>
                        {/if}

                        <!-- GitHub -->
                        <div class="rrow">
                            <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
                                <div class="ricon">
                                    <svg class="ricon-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                    </svg>
                                </div>
                                <div style="min-width:0;">
                                    <div class="rlabel">GitHub репозиторій</div>
                                    {#if submission?.githubUrl && submission.githubUrl.length > 3}
                                        <a href={submission.githubUrl} target="_blank" class="rlink"
                                           style="display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;">
                                            GitHub · {submission.githubUrl.replace('https://github.com/', '')}
                                        </a>
                                    {:else}
                                        <div class="rval">Не додано</div>
                                    {/if}
                                </div>
                            </div>
                            <button type="button" class="raction">Змінити</button>
                        </div>

                        <!-- Video -->
                        <div class="rrow">
                            <div style="display:flex; align-items:center; gap:12px; flex:1;">
                                <div class="ricon">
                                    <svg class="ricon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polygon points="23 7 16 12 23 17 23 7"/>
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                    </svg>
                                </div>
                                <div>
                                    <div class="rlabel">Відео-демо</div>
                                    {#if submission?.videoUrl && submission.videoUrl.length > 3}
                                        <a href={submission.videoUrl} target="_blank" class="rlink">Переглянути</a>
                                    {:else}
                                        <div class="rval">Не додано</div>
                                    {/if}
                                </div>
                            </div>
                            <button type="button" class="raction">Змінити</button>
                        </div>

                        <!-- Live demo -->
                        <div class="rrow" style="margin-bottom:20px;">
                            <div style="display:flex; align-items:center; gap:12px; flex:1;">
                                <div class="ricon">
                                    <svg class="ricon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                        <line x1="8" y1="21" x2="16" y2="21"/>
                                        <line x1="12" y1="17" x2="12" y2="21"/>
                                    </svg>
                                </div>
                                <div>
                                    <div class="rlabel">Live demo</div>
                                    {#if submission?.demoUrl && submission.demoUrl.length > 3}
                                        <a href={submission.demoUrl} target="_blank" class="rlink">{submission.demoUrl}</a>
                                    {:else}
                                        <div class="rval">Не додано</div>
                                    {/if}
                                </div>
                            </div>
                            <button type="button" class="raction">Змінити</button>
                        </div>

                        <div class="cta-row">
                            {#if task}
                                <a href="/tourments/{t.tournament.id}" class="btn-gray">Завдання</a>
                                <a href="/tourments/{t.tournament.id}" class="btn-blue">Сторінка сабміту</a>
                            {:else}
                                <a href="/tourments" class="btn-gray" style="flex:none; width:100%;">Перейти до турнірів</a>
                            {/if}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>

    <Footer />
</div>