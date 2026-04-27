<!-- src/routes/tourments/[id]/submit/+page.svelte -->
<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data, form }: { data: PageData; form: ActionData } = $props();

    let github  = $state(data.submission?.githubUrl   ?? '');
    let video   = $state(data.submission?.videoUrl    ?? '');
    let demo    = $state(data.submission?.demoUrl     ?? '');
    let desc    = $state(data.submission?.description ?? '');
    let editing = $state<string | null>(null);
    let saving  = $state(false);

    function toggle(f: string) { editing = editing === f ? null : f; }

    // countdown
    function cd(d: string | Date) {
        const diff = new Date(d).getTime() - Date.now();
        if (diff <= 0) return null;
        const days = Math.floor(diff / 86400000);
        const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
        return `${days}д ${h}:${m}:${s}`;
    }
    let countdown = $state(cd(data.task.deadline));
    $effect(() => {
        const id = setInterval(() => { countdown = cd(data.task.deadline); }, 1000);
        return () => clearInterval(id);
    });
    const isPast = $derived(new Date(data.task.deadline).getTime() < Date.now());

    const status = $derived([
        { label: 'GitHub',      ok: github.trim().length > 0 },
        { label: 'Відео-демо',  ok: video.trim().length > 0  },
        { label: 'Live demo',   ok: demo.trim().length > 0   },
        { label: 'Опис',        ok: desc.trim().length > 0   },
    ]);
</script>

<svelte:head><title>Сабміт — {data.tournament.title}</title></svelte:head>

<style>
    /* ── wrap ───────────────────────────────────────────────── */
    .wrap { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
    .row  { display:flex; flex:1; min-height:0; }

    /* центруємо контент */
    .main {
        flex:1; padding:28px 40px 60px;
        max-width:920px; width:100%; margin:0 auto;
    }

    /* ── breadcrumb ─────────────────────────────────────────── */
    .bc   { font-size:12px; color:var(--text-dim); margin-bottom:6px; display:flex; flex-wrap:wrap; gap:4px; }
    .bc a { color:var(--text-muted); text-decoration:none; }
    .bc a:hover, .bc .hi { color:#3d8ef0; }
    .h1   { font-size:28px; font-weight:800; letter-spacing:-.5px; color:var(--text); margin-bottom:20px; }

    /* ── deadline banner ────────────────────────────────────── */
    .dl {
        background:linear-gradient(135deg,#0c1b4a 0%,#111e58 100%);
        border:1px solid rgba(61,142,240,.2);
        border-radius:12px; padding:16px 22px;
        display:flex; align-items:center; justify-content:space-between;
        gap:16px; margin-bottom:20px; flex-wrap:wrap;
    }
    :global(.light-mode) .dl {
        background:linear-gradient(135deg,#dde8ff 0%,#ccd8ff 100%);
        border-color:rgba(61,142,240,.3);
    }
    .dl-lbl  { font-size:13px; font-weight:600; color:#3d8ef0; margin-bottom:2px; }
    .dl-time { font-size:30px; font-weight:800; color:#ef4444; letter-spacing:-1px; font-variant-numeric:tabular-nums; line-height:1; }
    .dl-warn { font-size:13px; color:var(--text-muted); max-width:360px; line-height:1.6; }
    .dl-warn b { color:var(--text); }

    /* ── two-column layout ──────────────────────────────────── */
    .cols { display:grid; grid-template-columns:1fr 280px; gap:16px; align-items:start; }
    @media(max-width:820px) { .cols { grid-template-columns:1fr; } }

    /* ── card ───────────────────────────────────────────────── */
    .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:18px 22px; margin-bottom:14px; }
    :global(.light-mode) .card { box-shadow:0 2px 10px rgba(0,0,0,.06); }
    .ctitle { display:flex; align-items:center; gap:9px; font-size:15px; font-weight:700; color:var(--text); margin-bottom:16px; }
    .cbar   { width:4px; height:17px; background:#3d8ef0; border-radius:3px; flex-shrink:0; }

    /* ── field ──────────────────────────────────────────────── */
    .field { margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid var(--border); }
    .field:last-child { margin-bottom:0; padding-bottom:0; border-bottom:none; }

    .fhead { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
    .fleft { display:flex; align-items:center; gap:8px; }
    .ficon {
        width:28px; height:28px; border-radius:7px;
        background:rgba(61,142,240,.1); border:1px solid rgba(61,142,240,.18);
        display:flex; align-items:center; justify-content:center; color:#3d8ef0; flex-shrink:0;
    }
    .flabel { font-size:13px; font-weight:600; color:var(--text); }

    .ebtn {
        font-size:13px; font-weight:600; color:#3d8ef0;
        background:none; border:none; cursor:pointer;
        font-family:'Manrope',sans-serif;
        padding:3px 9px; border-radius:6px;
        transition:background .12s;
    }
    .ebtn:hover { background:rgba(61,142,240,.1); }

    /* value display */
    .fval {
        display:block; padding:8px 12px; border-radius:8px;
        background:var(--bg-secondary); border:1px solid var(--border);
        font-size:13px; color:#3d8ef0; text-decoration:none;
        margin-bottom:5px; word-break:break-all;
    }
    .fval.empty { color:var(--text-dim); font-style:italic; }
    .fhint { font-size:12px; color:var(--text-dim); line-height:1.5; }

    /* inputs */
    .inp {
        width:100%; padding:9px 12px; border-radius:8px;
        border:1.5px solid #3d8ef0; background:var(--bg-secondary);
        color:var(--text); font-size:13px; font-family:'Manrope',sans-serif;
        outline:none; box-sizing:border-box; margin-bottom:5px;
    }
    .inp:focus { border-color:#5aaeff; box-shadow:0 0 0 3px rgba(61,142,240,.12); }
    :global(.light-mode) .inp { background:#eef2ff; }

    .ta {
        width:100%; min-height:110px; padding:10px 12px; border-radius:8px;
        border:1.5px solid #3d8ef0; background:var(--bg-secondary);
        color:var(--text); font-size:13px; font-family:'Manrope',sans-serif;
        outline:none; resize:vertical; box-sizing:border-box; line-height:1.6;
    }
    .ta:focus { border-color:#5aaeff; box-shadow:0 0 0 3px rgba(61,142,240,.12); }
    :global(.light-mode) .ta { background:#eef2ff; }

    .ta-view {
        width:100%; min-height:110px; padding:10px 12px; border-radius:8px;
        border:1px solid var(--border); background:var(--bg-secondary);
        color:var(--text-muted); font-size:13px; font-family:'Manrope',sans-serif;
        resize:none; box-sizing:border-box; line-height:1.6;
    }

    /* ── status card ────────────────────────────────────────── */
    .scart {
        background:var(--surface); border:1px solid var(--border);
        border-radius:12px; padding:18px 20px;
        position:sticky; top:20px;
    }
    :global(.light-mode) .scart { box-shadow:0 2px 10px rgba(0,0,0,.06); }
    .stitle {
        font-size:15px; font-weight:700; color:var(--text);
        margin-bottom:14px; display:flex; align-items:center; gap:7px;
    }
    .srow {
        display:flex; align-items:center; justify-content:space-between;
        padding:8px 0; border-bottom:1px solid var(--border);
        font-size:13px; color:var(--text-muted);
    }
    .srow:last-of-type { border-bottom:none; }
    .badge-ok  { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; background:rgba(62,207,124,.15); color:#3ecf7c; }
    .badge-no  { font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; background:rgba(255,255,255,.07); color:var(--text-dim); }
    :global(.light-mode) .badge-no { background:rgba(0,0,0,.07); }

    .sbtn {
        width:100%; padding:11px; border-radius:9px; border:none;
        background:#3d8ef0; color:#fff;
        font-size:14px; font-weight:700; font-family:'Manrope',sans-serif;
        cursor:pointer; transition:background .15s; margin-top:14px;
    }
    .sbtn:hover { background:#2d7de0; }
    .sbtn:disabled { opacity:.45; cursor:not-allowed; }

    /* ── alerts ─────────────────────────────────────────────── */
    .ok  { padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:12px; background:rgba(62,207,124,.1); border:1px solid rgba(62,207,124,.25); color:#3ecf7c; }
    .err { padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:12px; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.25); color:#f87171; }
    .exp { padding:10px 14px; border-radius:9px; font-size:13px; margin-bottom:16px; background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.2); color:#f87171; }

    @media(max-width:700px){
        .main { padding:18px 14px 48px; }
        .h1   { font-size:20px; }
        .dl-time { font-size:22px; }
    }
</style>

<div class="wrap">
    <Header />
    <div class="row">
        <Sidebar user={data.user} />

        <main class="main">
            <!-- Breadcrumb -->
            <div class="bc">
                <a href="/my-teams">Кабінет</a><span>/</span>
                <a href="/my-teams">Мої команди</a><span>/</span>
                <a href="/my-teams/{data.team.id}">Акаунт команди</a><span>/</span>
                <a href="/tourments/{data.tournament.id}/task">Завдання</a><span>/</span>
                <span class="hi">Подача результату</span>
            </div>

            <h1 class="h1">Подача результату</h1>

            <!-- Deadline -->
            <div class="dl">
                <div>
                    <div class="dl-lbl">До дедлайну</div>
                    {#if countdown}
                        <div class="dl-time">{countdown}</div>
                    {:else}
                        <div class="dl-time" style="color:var(--text-muted);font-size:18px;">Дедлайн минув</div>
                    {/if}
                </div>
                <div class="dl-warn">
                    Після дедлайну форма блокується. <b>Будь ласка, переконайтесь, що прикріпили все необхідне.</b>
                </div>
            </div>

            {#if isPast}<div class="exp">⏰ Дедлайн минув. Форма заблокована.</div>{/if}
            {#if form?.success}<div class="ok">✓ Сабміт збережено успішно!</div>{/if}
            {#if form?.error}<div class="err">{form.error}</div>{/if}

            <form method="POST" action="?/save" use:enhance={() => {
                saving = true;
                return async ({ update }) => { await update(); saving = false; };
            }}>
                <input type="hidden" name="taskId" value={data.task.id} />
                <input type="hidden" name="teamId" value={data.team.id} />

                <div class="cols">
                    <!-- LEFT -->
                    <div>
                        <!-- Основні матеріали -->
                        <div class="card">
                            <div class="ctitle"><span class="cbar"></span>Основні матеріали</div>

                            <!-- GitHub -->
                            <div class="field">
                                <div class="fhead">
                                    <div class="fleft">
                                        <div class="ficon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                            </svg>
                                        </div>
                                        <span class="flabel">GitHub репозиторій</span>
                                    </div>
                                    {#if !isPast}<button type="button" class="ebtn" onclick={() => toggle('gh')}>Змінити</button>{/if}
                                </div>
                                {#if editing === 'gh'}
                                    <input bind:value={github} name="githubUrl" type="url" placeholder="https://github.com/username/repo" class="inp" />
                                {:else}
                                    <input type="hidden" name="githubUrl" value={github} />
                                    {#if github}<a href={github} target="_blank" class="fval">GitHub · {github.replace('https://github.com/','')}</a>
                                    {:else}<span class="fval empty">Не вказано</span>{/if}
                                {/if}
                                <div class="fhint">Репозиторій має бути публічним. Переконайся що код запускається з README.</div>
                            </div>

                            <!-- Відео -->
                            <div class="field">
                                <div class="fhead">
                                    <div class="fleft">
                                        <div class="ficon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                                        </div>
                                        <span class="flabel">Відео-демо</span>
                                    </div>
                                    {#if !isPast}<button type="button" class="ebtn" onclick={() => toggle('vid')}>Змінити</button>{/if}
                                </div>
                                {#if editing === 'vid'}
                                    <input bind:value={video} name="videoUrl" type="url" placeholder="https://youtube.com/watch?v=..." class="inp" />
                                {:else}
                                    <input type="hidden" name="videoUrl" value={video} />
                                    {#if video}<a href={video} target="_blank" class="fval">{video}</a>
                                    {:else}<span class="fval empty">Не вказано</span>{/if}
                                {/if}
                                <div class="fhint">YouTube або Google Drive. Тривалість: 3–5 хвилин. Покажи всі основні функції.</div>
                            </div>
                        </div>

                        <!-- Додаткові матеріали -->
                        <div class="card">
                            <div class="ctitle"><span class="cbar"></span>Додаткові матеріали</div>
                            <div class="field">
                                <div class="fhead">
                                    <div class="fleft">
                                        <div class="ficon">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                        </div>
                                        <span class="flabel">Live demo (не обов'язково)</span>
                                    </div>
                                    {#if !isPast}<button type="button" class="ebtn" onclick={() => toggle('demo')}>Змінити</button>{/if}
                                </div>
                                {#if editing === 'demo'}
                                    <input bind:value={demo} name="demoUrl" type="url" placeholder="https://your-app.vercel.app" class="inp" />
                                {:else}
                                    <input type="hidden" name="demoUrl" value={demo} />
                                    {#if demo}<a href={demo} target="_blank" class="fval">{demo}</a>
                                    {:else}<span class="fval empty">Не вказано</span>{/if}
                                {/if}
                                <div class="fhint">Публічне посилання на задеплоєний застосунок. Дає додаткові бали.</div>
                            </div>
                        </div>

                        <!-- Опис -->
                        <div class="card">
                            <div class="ctitle">
                                <span class="cbar"></span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3d8ef0" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                Опис
                                {#if !isPast}
                                    <button type="button" class="ebtn" style="margin-left:auto;" onclick={() => toggle('desc')}>Змінити</button>
                                {/if}
                            </div>
                            {#if editing === 'desc'}
                                <textarea bind:value={desc} name="description"
                                          placeholder="Що зроблено, які технології використано, як запустити локально..."
                                          class="ta"></textarea>
                            {:else}
                                <input type="hidden" name="description" value={desc} />
                                <textarea readonly class="ta-view"
                                          value={desc || 'Що зроблено, які технології використано, як запустити локально...'}
                                ></textarea>
                            {/if}
                        </div>
                    </div>

                    <!-- RIGHT: статус -->
                    <div>
                        <div class="scart">
                            <div class="stitle">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3d8ef0" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                                Статус сабміту
                            </div>
                            {#each status as s}
                                <div class="srow">
                                    <span>{s.label}</span>
                                    {#if s.ok}
                                        <span class="badge-ok">Додано</span>
                                    {:else}
                                        <span class="badge-no">Немає</span>
                                    {/if}
                                </div>
                            {/each}
                            {#if !isPast}
                                <button type="submit" class="sbtn" disabled={saving || !github.trim()}>
                                    {saving ? 'Збереження...' : 'Зберегти сабміт'}
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            </form>
        </main>
    </div>
    <Footer />
</div>