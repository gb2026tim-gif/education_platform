<!-- src/routes/my-teams/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    interface Invite {
        id: string;
        teamId: string;
        teamName: string;
        tournamentTitle: string;
        status: string;
    }

    let { data }: { data: PageData } = $props();
    let dismissedInvites = $state<string[]>([]);
    let showInviteModal  = $state(false);
    let activeInvite     = $state<Invite | null>(null);

    function dismiss(id: string) {
        dismissedInvites = [...dismissedInvites, id];
    }
    function openModal(invite: Invite) {
        activeInvite    = invite;
        showInviteModal = true;
    }
    function closeModal() {
        showInviteModal = false;
        activeInvite    = null;
    }

    const pendingInvites = $derived(
        (data.invites as Invite[] ?? []).filter(i => !dismissedInvites.includes(i.id))
    );

    const statusLabel: Record<string, string> = { PENDING: 'Очікує', APPROVED: 'Активна', REJECTED: 'Відхилено' };
    const statusColor: Record<string, string> = { PENDING: '#f59e0b', APPROVED: '#3ecf7c', REJECTED: '#ef4444' };
    const statusBg:    Record<string, string> = { PENDING: 'rgba(245,158,11,.15)', APPROVED: 'rgba(62,207,124,.15)', REJECTED: 'rgba(239,68,68,.15)' };
</script>

<svelte:head><title>Мої команди — LvUp</title></svelte:head>

<style>
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

    .team-card {
        display: block;
        text-decoration: none;
        color: inherit;
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        transition: border-color .2s, transform .18s, box-shadow .2s;
        backdrop-filter: blur(8px);
    }

    :global(.light-mode) .team-card {
        background: rgba(255,255,255,.8);
        border-color: rgba(61,142,240,.15);
        box-shadow: 0 2px 12px rgba(0,0,0,.06);
    }

    .team-card:hover {
        border-color: rgba(61,142,240,.55);
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(61,142,240,.15);
    }

    .team-card:hover .t-avatar { transform: scale(1.06); }

    .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
    }

    .card-stats {
        border-top: 1px solid rgba(255,255,255,.07);
        padding: 11px 24px;
        display: flex;
        align-items: center;
        gap: 18px;
        background: rgba(0,0,0,.2);
    }

    :global(.light-mode) .card-stats {
        border-color: rgba(61,142,240,.1);
        background: rgba(61,142,240,.04);
    }

    .t-avatar {
        width: 52px;
        height: 52px;
        border-radius: 12px;
        background: linear-gradient(135deg,#1e3a7a,#1a50a0);
        border: 1px solid rgba(61,142,240,.35);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        font-weight: 800;
        color: #5aaeff;
        flex-shrink: 0;
        transition: transform .2s;
    }

    .t-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 3px; }

    .t-captain { font-size: 12px; color: rgba(255,255,255,.5); }
    :global(.light-mode) .t-captain { color: rgba(10,14,26,.5); }

    .view-btn {
        padding: 9px 22px;
        border-radius: 9px;
        background: #3d8ef0;
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        font-family: 'Manrope', sans-serif;
        white-space: nowrap;
        transition: background .15s, transform .15s;
    }
    .view-btn:hover { background: #2d7de0; transform: scale(1.03); }

    .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }

    .badge-blue { background: rgba(61,142,240,.14); color: #5aaeff; border: 1px solid rgba(61,142,240,.25); }
    :global(.light-mode) .badge-blue { color: #1a5cc8; }

    .stat-text { font-size: 12px; color: rgba(255,255,255,.55); display: flex; align-items: center; gap: 6px; }
    :global(.light-mode) .stat-text { color: rgba(10,14,26,.55); }

    .tour-lbl { font-size: 12px; color: rgba(255,255,255,.4); }
    :global(.light-mode) .tour-lbl { color: rgba(10,14,26,.45); }

    .tour-lbl span { color: rgba(255,255,255,.65); font-weight: 600; }
    :global(.light-mode) .tour-lbl span { color: rgba(10,14,26,.7); }

    .bc { font-size: 12px; color: rgba(255,255,255,.35); margin-bottom: 8px; }
    :global(.light-mode) .bc { color: rgba(10,14,26,.4); }

    .bc span { color: rgba(255,255,255,.55); }
    :global(.light-mode) .bc span { color: rgba(10,14,26,.6); }

    .ptitle { font-size: 24px; font-weight: 800; color: var(--text); margin-bottom: 28px; }

    .empty-box {
        background: rgba(255,255,255,.04);
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 18px;
        padding: 80px 40px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }
    :global(.light-mode) .empty-box {
        background: #fff;
        border-color: rgba(61,142,240,.15);
        box-shadow: 0 2px 16px rgba(0,0,0,.06);
    }

    .invite-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 200;
        background: var(--surface);
        border: 1px solid rgba(61,142,240,.25);
        border-radius: 14px;
        padding: 18px 20px;
        width: 320px;
        box-shadow: 0 16px 48px rgba(0,0,0,.4);
        backdrop-filter: blur(16px);
    }

    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 300;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,.65);
        backdrop-filter: blur(6px);
    }

    .modal-box {
        position: relative;
        background: var(--surface);
        border: 1px solid var(--border-hover);
        border-radius: 18px;
        padding: 36px 40px;
        width: 440px;
        max-width: 92vw;
        box-shadow: 0 24px 80px rgba(0,0,0,.4);
    }

    .modal-input {
        width: 100%;
        padding: 14px 16px;
        border: 1px solid var(--border-hover);
        border-radius: 10px;
        background: var(--bg-secondary);
        color: var(--text-dim);
        font-size: 15px;
        text-align: center;
        letter-spacing: 3px;
        font-family: 'Manrope', sans-serif;
        outline: none;
        box-sizing: border-box;
    }
    .modal-input:focus { border-color: #3d8ef0; }

    .modal-submit-btn {
        width: 100%;
        padding: 14px;
        border-radius: 10px;
        border: none;
        background: #3d8ef0;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Manrope', sans-serif;
        transition: background .15s;
    }
    .modal-submit-btn:hover { background: #2d7de0; }

    /* SVG muted icon — color set via CSS, not via obsolete SVG attribute */
    .empty-icon {
        stroke: #6b7a8f;
    }
    :global(.light-mode) .empty-icon {
        stroke: rgba(10,14,26,.35);
    }
</style>

<div class="page-wrap">
    <Header />

    <div style="display:flex; min-height:calc(100vh - 72px);">
        <Sidebar user={data.user} />

        <main class="main-area">
            <div style="position:relative; z-index:1;">
                <div class="bc">Кабінет / <span>Акаунт команди</span></div>
                <h1 class="ptitle">Всі команди</h1>

                {#if data.teams.length === 0}
                    <div class="empty-box">
                        <div style="width:64px;height:64px;border-radius:16px;background:var(--surface-2);border:1px solid var(--border-hover);display:flex;align-items:center;justify-content:center;margin-bottom:20px;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke-width="1.5" class="empty-icon">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <div style="font-size:16px;font-weight:700;color:#3d8ef0;margin-bottom:10px;">Ти ще не належиш до команди</div>
                        <div style="font-size:13px;color:var(--text-muted);max-width:300px;line-height:1.7;">
                            Перейди на сторінку <a href="/tourments" style="color:#3d8ef0;text-decoration:none;">Турніри</a>, вибери один з активних та зареєструй свою команду
                        </div>
                    </div>
                {:else}
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        {#each data.teams as team}
                            <a href="/my-teams/{team.id}" class="team-card">
                                <div class="card-top">
                                    <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:0;">
                                        <div class="t-avatar">{team.name?.[0]?.toUpperCase() ?? "?"}</div>
                                        <div style="min-width:0;">
                                            <div class="t-name">{team.name}</div>
                                            <div class="t-captain">Командир · {team.captain?.name ?? 'Невідомо'}</div>
                                        </div>
                                    </div>
                                    <span class="view-btn" aria-hidden="true">Переглянути</span>
                                </div>
                                <div class="card-stats">
                                    <div class="stat-text">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                            <circle cx="9" cy="7" r="4"/>
                                        </svg>
                                        {team.members.length + 1} учасники
                                    </div>
                                    <span class="badge" style="background:{statusBg[team.status]};color:{statusColor[team.status]};">{statusLabel[team.status]}</span>
                                    <span class="badge badge-blue">1 турнір</span>
                                    <span class="tour-lbl">Турнір: <span>{team.tournament.title}</span></span>
                                </div>
                            </a>
                        {/each}
                    </div>
                {/if}
            </div>
        </main>
    </div>

    <!-- Invite toasts -->
    {#each pendingInvites as invite}
        <div class="invite-toast" role="alert">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
                <span style="font-size:13px;font-weight:700;color:var(--text);">Запрошення до команди</span>
                <button type="button" onclick={() => dismiss(invite.id)}
                        style="background:none;border:none;color:var(--text-dim);cursor:pointer;"
                        aria-label="Закрити">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;line-height:1.6;">
                Тебе запросили до команди <span style="color:#3d8ef0;font-weight:600;">{invite.teamName}</span>
                на турнір <span style="color:#3d8ef0;font-weight:600;">{invite.tournamentTitle}</span>
            </p>
            <div style="display:flex;gap:8px;justify-content:flex-end;">
                <form method="POST" action="?/declineInvite">
                    <input type="hidden" name="inviteId" value={invite.id} />
                    <button type="submit" style="padding:8px 18px;border-radius:8px;border:1px solid var(--border-hover);background:transparent;color:var(--text-muted);font-size:12px;font-weight:600;cursor:pointer;font-family:'Manrope',sans-serif;">Відхилити</button>
                </form>
                <button type="button" onclick={() => openModal(invite)}
                        style="padding:8px 18px;border-radius:8px;border:none;background:#3d8ef0;color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;">
                    Прийняти
                </button>
            </div>
        </div>
    {/each}

    <!-- Accept modal -->
    {#if showInviteModal && activeInvite}
        <div class="modal-overlay"
             role="dialog"
             tabindex="-1"
             aria-modal="true"
             aria-label="Доєднатись до команди"
             onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
             onkeydown={(e) => { if (e.key === 'Escape') closeModal(); }}>
            <div class="modal-box">
                <button type="button" onclick={closeModal}
                        style="position:absolute;top:16px;right:16px;background:none;border:none;color:var(--text-dim);cursor:pointer;display:flex;"
                        aria-label="Закрити">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <h2 style="font-size:20px;font-weight:800;color:var(--text);margin-bottom:6px;">Доєднатись до команди</h2>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:28px;">
                    Турнір: <span style="color:#3d8ef0;">{activeInvite.tournamentTitle}</span>
                </p>
                <div style="margin-bottom:24px;">
                    <label for="invite-code" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:8px;">Код запрошення від капітана</label>
                    <input id="invite-code" type="text" placeholder="XXX-XXX" class="modal-input" />
                </div>
                <form method="POST" action="?/acceptInvite">
                    <input type="hidden" name="inviteId" value={activeInvite.id} />
                    <input type="hidden" name="teamId" value={activeInvite.teamId} />
                    <button type="submit" class="modal-submit-btn">Доєднатись</button>
                </form>
            </div>
        </div>
    {/if}

    <Footer />
</div>