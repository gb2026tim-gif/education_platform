<!-- src/routes/tourments/[id]/submit/+page.svelte -->
<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    let { data, form }: { data: PageData; form: ActionData } = $props();
    const submission = $derived(data.submission);
    const deadline = $derived(data.task.deadline);
    let gh = $state('');
    let vid = $state('');
    let demo = $state('');
    let desc = $state('');
    let edit = $state('');
    let saving = $state(false);
    let timer = $state('');
    $effect(() => {
        gh = submission?.githubUrl ?? '';
        vid = submission?.videoUrl ?? '';
        demo = submission?.demoUrl ?? '';
        desc = submission?.description ?? '';
    });
    function toggle(f: string) {
        edit = edit === f ? '' : f;
    }
    function getTimer(d: string | Date): string {
        const ms = new Date(d).getTime() - Date.now();
        if (ms <= 0) return 'Дедлайн минув';
        const days = Math.floor(ms / 86400000);
        const h = String(Math.floor((ms % 86400000) / 3600000)).padStart(2, '0');
        const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return `${days}д ${h}:${m}:${s}`;
    }
    $effect(() => {
        const update = () => {
            timer = getTimer(deadline);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    });
    const isPast = $derived(timer === 'Дедлайн минув');
    const statusItems = $derived([
        { label: 'GitHub', ok: gh.trim().length > 0 },
        { label: 'Відео-демо', ok: vid.trim().length > 0 },
        { label: 'Live demo', ok: demo.trim().length > 0 },
        { label: 'Опис', ok: desc.trim().length > 0 }
    ]);
</script>

<svelte:head><title>Подача результату — {data.tournament.title}</title></svelte:head>

<style>
    /* ── page shell ─────────────────────────────────────────── */
    .page { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
    .body { display:flex; flex:1; min-height:0; }

    /* ── main — same gradient as my-teams ───────────────────── */
    .main {
        flex: 1;
        padding: 36px 52px 72px;
        background:
                radial-gradient(ellipse 100% 55% at 40% -5%, rgba(18,55,150,.65) 0%, transparent 60%),
                radial-gradient(ellipse 70%  45% at 85%  25%, rgba(10,35,110,.45) 0%, transparent 55%),
                #08101e;
        min-height: calc(100vh - 72px);
    }
    :global(.light-mode) .main {
        background:
                radial-gradient(ellipse 100% 55% at 40% -5%, rgba(190,215,255,.5) 0%, transparent 60%),
                radial-gradient(ellipse 70%  45% at 85%  25%, rgba(170,205,255,.35) 0%, transparent 55%),
                #eef2ff;
    }

    /* centered inner wrap */
    .inner { max-width: 1000px; margin: 0 auto; width: 100%; }

    /* ── breadcrumb ─────────────────────────────────────────── */
    .bc   { display:flex; flex-wrap:wrap; gap:5px; font-size:14px; color:rgba(255,255,255,.35); margin-bottom:8px; }
    :global(.light-mode) .bc { color:rgba(10,14,26,.4); }
    .bc a { color:rgba(255,255,255,.65); text-decoration:none; transition:color .12s; }
    :global(.light-mode) .bc a { color:rgba(10,14,26,.55); }
    .bc a:hover { color:#4a90e2; }
    .bc .cur { color:#4a90e2; }

    .h1 { font-size:38px; font-weight:800; color:#ffffff; margin-bottom:26px; letter-spacing:-.8px; }
    :global(.light-mode) .h1 { color:#0a0e1a; }

    /* ── deadline ────────────────────────────────────────────── */
    .dl {
        background: linear-gradient(135deg,rgba(14,28,80,.97) 0%,rgba(18,36,100,.97) 100%);
        border: 1px solid rgba(74,144,226,.28);
        border-radius: 14px;
        padding: 20px 28px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 24px; flex-wrap: wrap; margin-bottom: 24px;
    }
    :global(.light-mode) .dl { background:linear-gradient(135deg,#d4e4ff 0%,#c0d6ff 100%); border-color:rgba(74,144,226,.35); }
    .dl-label { font-size:15px; font-weight:700; color:#4a90e2; margin-bottom:4px; }
    .dl-time  { font-size:36px; font-weight:800; color:#ef4444; letter-spacing:-1.5px; font-variant-numeric:tabular-nums; line-height:1; }
    .dl-note  { font-size:15px; color:rgba(255,255,255,.78); line-height:1.65; max-width:400px; }
    :global(.light-mode) .dl-note { color:rgba(10,14,26,.6); }
    .dl-note strong { color:#fff; }
    :global(.light-mode) .dl-note strong { color:#0a0e1a; }

    /* ── alerts ─────────────────────────────────────────────── */
    .alert { padding:13px 18px; border-radius:11px; font-size:15px; margin-bottom:16px; }
    .alert.ok   { background:rgba(62,207,124,.1); border:1px solid rgba(62,207,124,.25); color:#3ecf7c; }
    .alert.err  { background:rgba(239,68,68,.1);  border:1px solid rgba(239,68,68,.25);  color:#f87171; }
    .alert.warn { background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.18);  color:#f87171; }

    /* ── two-column layout ───────────────────────────────────── */
    .cols { display:grid; grid-template-columns:1fr 300px; gap:20px; align-items:start; }
    @media(max-width:860px) { .cols { grid-template-columns:1fr; } }

    /* ── card ───────────────────────────────────────────────── */
    .card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        padding: 24px 28px;
        margin-bottom: 18px;
        backdrop-filter: blur(6px);
    }
    :global(.light-mode) .card { background:rgba(255,255,255,.85); border-color:rgba(10,14,26,.1); box-shadow:0 2px 14px rgba(0,0,0,.07); }

    .card-title { display:flex; align-items:center; gap:12px; font-size:18px; font-weight:700; color:#ffffff; margin-bottom:20px; }
    :global(.light-mode) .card-title { color:#0a0e1a; }
    .bar { width:4px; height:19px; background:#4a90e2; border-radius:3px; flex-shrink:0; }

    /* ── field ──────────────────────────────────────────────── */
    .field { padding-bottom:18px; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,.08); }
    :global(.light-mode) .field { border-color:rgba(10,14,26,.08); }
    .field:last-child { padding-bottom:0; margin-bottom:0; border-bottom:none; }

    .frow  { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .fleft { display:flex; align-items:center; gap:10px; }

    .ficon {
        width: 32px; height: 32px; flex-shrink: 0;
        border-radius: 8px;
        background: rgba(74,144,226,.15);
        border: 1px solid rgba(74,144,226,.25);
        display: flex; align-items: center; justify-content: center;
        color: #4a90e2;
    }
    .flabel { font-size:16px; font-weight:700; color:#ffffff; }
    :global(.light-mode) .flabel { color:#0a0e1a; }

    .ebtn {
        font-size:14px; font-weight:700; color:#5aaeff;
        background: none; border: none; cursor: pointer;
        font-family: 'Manrope', sans-serif;
        padding: 4px 12px; border-radius: 7px;
        transition: background .12s;
    }
    .ebtn:hover { background: rgba(74,144,226,.12); }

    /* value */
    .fval {
        display: block; padding: 10px 14px; border-radius: 10px;
        background: rgba(0,0,0,.3); border: 1px solid rgba(255,255,255,.08);
        font-size: 14px; color: #5aaeff; text-decoration: none;
        margin-bottom: 7px; word-break: break-all;
    }
    :global(.light-mode) .fval { background:#eef2ff; border-color:rgba(74,144,226,.15); }
    .fval.empty { color: rgba(255,255,255,.42); font-style: italic; }
    :global(.light-mode) .fval.empty { color:rgba(10,14,26,.3); }
    .fhint { font-size:13px; color:rgba(255,255,255,.58); line-height:1.6; }
    :global(.light-mode) .fhint { color:rgba(10,14,26,.45); }

    /* inputs */
    .inp {
        width: 100%; padding: 10px 14px; border-radius: 10px;
        border: 1.5px solid #3d8ef0; background: rgba(0,0,0,.45);
        color: #ffffff; font-size: 15px; font-family: 'Manrope', sans-serif;
        outline: none; box-sizing: border-box; margin-bottom: 7px;
        transition: border-color .14s, box-shadow .14s;
    }
    .inp:focus { border-color:#6aaeff; box-shadow:0 0 0 3px rgba(74,144,226,.15); }
    :global(.light-mode) .inp { background:#eef2ff; color:#0a0e1a; }

    .ta {
        width: 100%; min-height: 120px; padding: 12px 14px; border-radius: 10px;
        border: 1.5px solid #3d8ef0; background: rgba(0,0,0,.45);
        color: #ffffff; font-size: 15px; font-family: 'Manrope', sans-serif;
        outline: none; resize: vertical; box-sizing: border-box; line-height: 1.7;
        transition: border-color .14s, box-shadow .14s;
    }
    .ta:focus { border-color:#6aaeff; box-shadow:0 0 0 3px rgba(74,144,226,.15); }
    :global(.light-mode) .ta { background:#eef2ff; color:#0a0e1a; }

    .ta-view {
        width: 100%; min-height: 120px; padding: 12px 14px; border-radius: 10px;
        border: 1px solid rgba(255,255,255,.08); background: rgba(0,0,0,.3);
        color: rgba(255,255,255,.4); font-size: 15px; font-family: 'Manrope', sans-serif;
        resize: none; box-sizing: border-box; line-height: 1.7;
    }
    :global(.light-mode) .ta-view { background:#eef2ff; border-color:rgba(74,144,226,.15); color:rgba(10,14,26,.4); }

    /* ── status card ────────────────────────────────────────── */
    .status-card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        padding: 22px 24px;
        position: sticky; top: 24px;
        backdrop-filter: blur(6px);
    }
    :global(.light-mode) .status-card { background:rgba(255,255,255,.85); border-color:rgba(10,14,26,.1); box-shadow:0 2px 14px rgba(0,0,0,.07); }

    .status-title { font-size:17px; font-weight:700; color:#ffffff; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
    :global(.light-mode) .status-title { color:#0a0e1a; }

    .srow {
        display: flex; align-items: center; justify-content: space-between;
        padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,.07);
        font-size: 15px; color: rgba(255,255,255,.8);
    }
    :global(.light-mode) .srow { border-color:rgba(10,14,26,.08); color:rgba(10,14,26,.6); }
    .srow:last-of-type { border-bottom: none; }

    .b-ok  { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; background:rgba(61,142,240,.35); color:#ffffff; white-space:nowrap; }
    .b-no  { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; background:rgba(255,255,255,.06); color:rgba(255,255,255,.38); white-space:nowrap; }
    :global(.light-mode) .b-no { background:rgba(0,0,0,.07); color:rgba(10,14,26,.4); }

    .save-btn {
        width: 100%; padding: 13px; border-radius: 11px; border: none;
        background: #3d8ef0; color: #fff;
        font-size: 16px; font-weight: 700; font-family: 'Manrope', sans-serif;
        cursor: pointer; transition: background .15s; margin-top: 16px;
        box-shadow: 0 4px 20px rgba(61,142,240,.4);
    }
    .save-btn:hover { background: #2d7de0; }
    .save-btn:disabled { opacity:.4; cursor:not-allowed; box-shadow:none; }

    @media(max-width:700px) {
        .main { padding:20px 16px 56px; }
        .h1 { font-size:22px; }
        .dl-time { font-size:26px; }
        .card { padding:18px 16px; }
    }
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <div class="inner">

                <div class="bc">
                    <a href="/my-teams">Кабінет</a><span>/</span>
                    <a href="/my-teams">Мої команди</a><span>/</span>
                    <a href="/my-teams/{data.team.id}">Акаунт команди</a><span>/</span>
                    <a href="/tourments/{data.tournament.id}/task">Завдання</a><span>/</span>
                    <span class="cur">Подача результату</span>
                </div>

                <h1 class="h1">Подача результату</h1>

                <!-- Deadline -->
                <div class="dl">
                    <div>
                        <div class="dl-label">До дедлайну</div>
                        <div class="dl-time">{timer}</div>
                    </div>
                    <p class="dl-note">
                        Після дедлайну форма блокується.
                        <strong>Будь ласка, переконайтесь, що прикріпили все необхідне.</strong>
                    </p>
                </div>

                {#if isPast}   <div class="alert warn">⏰ Дедлайн минув. Форма заблокована.</div>{/if}
                {#if form?.success}<div class="alert ok">✓ Сабміт збережено успішно!</div>{/if}
                {#if form?.error}  <div class="alert err">{form.error}</div>{/if}

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
                                <div class="card-title"><span class="bar"></span>Основні матеріали</div>

                                <!-- GitHub -->
                                <div class="field">
                                    <div class="frow">
                                        <div class="fleft">
                                            <div class="ficon">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                                                </svg>
                                            </div>
                                            <span class="flabel">GitHub репозиторій</span>
                                        </div>
                                        {#if !isPast}
                                            <button type="button" class="ebtn" onclick={() => toggle('gh')}>Змінити</button>
                                        {/if}
                                    </div>
                                    {#if edit === 'gh'}
                                        <input bind:value={gh} name="githubUrl" type="url" placeholder="https://github.com/username/repo" class="inp" />
                                    {:else}
                                        <input type="hidden" name="githubUrl" value={gh} />
                                        {#if gh}
                                            <a href={gh} target="_blank" class="fval">
                                                GitHub · {gh.replace('https://github.com/', '')}
                                            </a>
                                        {:else}
                                            <span class="fval empty">Не вказано</span>
                                        {/if}
                                    {/if}
                                    <div class="fhint">Репозиторій має бути публічним. Переконайся що код запускається з README.</div>
                                </div>

                                <!-- Відео-демо -->
                                <div class="field">
                                    <div class="frow">
                                        <div class="fleft">
                                            <div class="ficon">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <polygon points="23 7 16 12 23 17 23 7"/>
                                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                                </svg>
                                            </div>
                                            <span class="flabel">Відео-демо</span>
                                        </div>
                                        {#if !isPast}
                                            <button type="button" class="ebtn" onclick={() => toggle('vid')}>Змінити</button>
                                        {/if}
                                    </div>
                                    {#if edit === 'vid'}
                                        <input bind:value={vid} name="videoUrl" type="url" placeholder="https://youtube.com/watch?v=..." class="inp" />
                                    {:else}
                                        <input type="hidden" name="videoUrl" value={vid} />
                                        {#if vid}
                                            <a href={vid} target="_blank" class="fval">{vid}</a>
                                        {:else}
                                            <span class="fval empty">Не вказано</span>
                                        {/if}
                                    {/if}
                                    <div class="fhint">YouTube або Google Drive. Тривалість: 3–5 хвилин. Покажи всі основні функції.</div>
                                </div>
                            </div>

                            <!-- Додаткові матеріали -->
                            <div class="card">
                                <div class="card-title"><span class="bar"></span>Додаткові матеріали</div>
                                <div class="field">
                                    <div class="frow">
                                        <div class="fleft">
                                            <div class="ficon">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                                    <line x1="8" y1="21" x2="16" y2="21"/>
                                                    <line x1="12" y1="17" x2="12" y2="21"/>
                                                </svg>
                                            </div>
                                            <span class="flabel">Live demo (не обов'язково)</span>
                                        </div>
                                        {#if !isPast}
                                            <button type="button" class="ebtn" onclick={() => toggle('demo')}>Змінити</button>
                                        {/if}
                                    </div>
                                    {#if edit === 'demo'}
                                        <input bind:value={demo} name="demoUrl" type="url" placeholder="https://your-app.vercel.app" class="inp" />
                                    {:else}
                                        <input type="hidden" name="demoUrl" value={demo} />
                                        {#if demo}
                                            <a href={demo} target="_blank" class="fval">{demo}</a>
                                        {:else}
                                            <span class="fval empty">Не вказано</span>
                                        {/if}
                                    {/if}
                                    <div class="fhint">Публічне посилання на задеплоєний застосунок. Дає додаткові бали.</div>
                                </div>
                            </div>

                            <!-- Опис -->
                            <div class="card">
                                <div class="card-title">
                                    <span class="bar"></span>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" stroke-width="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                    </svg>
                                    Опис
                                    {#if !isPast}
                                        <button type="button" class="ebtn" style="margin-left:auto;" onclick={() => toggle('desc')}>Змінити</button>
                                    {/if}
                                </div>
                                {#if edit === 'desc'}
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
                            <div class="status-card">
                                <div class="status-title">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a90e2" stroke-width="2">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                        <polyline points="22 4 12 14.01 9 11.01"/>
                                    </svg>
                                    Статус сабміту
                                </div>

                                {#each statusItems as item}
                                    <div class="srow">
                                        <span>{item.label}</span>
                                        {#if item.ok}
                                            <span class="b-ok">Додано</span>
                                        {:else}
                                            <span class="b-no">Немає</span>
                                        {/if}
                                    </div>
                                {/each}

                                {#if !isPast}
                                    <button type="submit" class="save-btn" disabled={saving || !gh.trim()}>
                                        {saving ? 'Збереження...' : 'Зберегти сабміт'}
                                    </button>
                                {/if}
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </main>
    </div>
    <Footer />
</div>