<!-- src/routes/tourments/[id]/task/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';
    let { data }: { data: PageData } = $props();
    const deadline = $derived(data.task.deadline);
    // ── Countdown ────────────────────────────────────────────────
    function getTimer(d: string | Date): string {
        const ms = new Date(d).getTime() - Date.now();
        if (ms <= 0) return 'Дедлайн минув';
        const days = Math.floor(ms / 86400000);
        const h = String(Math.floor((ms % 86400000) / 3600000)).padStart(2, '0');
        const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
        return `${days}д ${h}:${m}:${s}`;
    }
    let timer = $state('');
    $effect(() => {
        const update = () => {
            timer = getTimer(deadline);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    });
    const isPast = $derived(timer === 'Дедлайн минув');
    // ── Parse techStack: "Backend: SvelteKit\nFrontend: Svelte" → grid ──
    const techRows = $derived(
        (data.task.techStack ?? '')
            .split('\n')
            .filter(Boolean)
            .map((line) => {
                const i = line.indexOf(':');
                return i < 0
                    ? { label: '', val: line.trim() }
                    : { label: line.slice(0, i).trim(), val: line.slice(i + 1).trim() };
            })
    );
    // ── Parse description: split on "•" bullet lines ──────────────
    interface Block {
        type: 'p' | 'li';
        text: string;
    }
    function parseDesc(raw: string): Block[] {
        const out: Block[] = [];
        for (const line of raw.split('\n')) {
            const t = line.trim();
            if (!t) continue;
            if (t.startsWith('•') || t.startsWith('-')) {
                out.push({ type: 'li', text: t.replace(/^[•\-]\s*/, '') });
            } else {
                out.push({ type: 'p', text: t });
            }
        }
        return out;
    }
    const descBlocks = $derived(parseDesc(data.task.description));
    const descParas = $derived(descBlocks.filter((b) => b.type === 'p'));
    const descItems = $derived(descBlocks.filter((b) => b.type === 'li'));
</script>

<svelte:head><title>{data.tournament.title} — Завдання</title></svelte:head>

<style>
    /* ── page shell ─────────────────────────────────────────── */
    .page {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: 'Manrope', sans-serif;
        display: flex;
        flex-direction: column;
    }
    .body { display: flex; flex: 1; min-height: 0; }

    /* ── main — same gradient bg as my-teams ────────────────── */
    .main {
        flex: 1;
        padding: 36px 52px 72px;
        /* Same gradient as my-teams */
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

    /* ── inner wrap — centers and limits width ───────────────── */
    .inner { max-width: 900px; margin: 0 auto; width: 100%; }

    /* ── breadcrumb ─────────────────────────────────────────── */
    .bc   { display:flex; flex-wrap:wrap; gap:5px; font-size:14px; color:rgba(255,255,255,.35); margin-bottom:8px; }
    :global(.light-mode) .bc { color:rgba(10,14,26,.4); }
    .bc a { color:rgba(255,255,255,.65); text-decoration:none; transition:color .12s; }
    :global(.light-mode) .bc a { color:rgba(10,14,26,.55); }
    .bc a:hover { color:#4a90e2; }
    .bc .cur { color:#4a90e2; }

    /* ── heading ────────────────────────────────────────────── */
    .h1 { font-size:38px; font-weight:800; color:#ffffff; margin-bottom:28px; letter-spacing:-.8px; line-height:1.15; }
    :global(.light-mode) .h1 { color:#0a0e1a; }
    .h1 em { color:#4a90e2; font-style:normal; }

    /* ── deadline banner ────────────────────────────────────── */
    .dl {
        background: linear-gradient(135deg,rgba(14,28,80,.97) 0%,rgba(18,36,100,.97) 100%);
        border: 1px solid rgba(74,144,226,.28);
        border-radius: 14px;
        padding: 20px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 24px;
        flex-wrap: wrap;
    }
    :global(.light-mode) .dl { background:linear-gradient(135deg,#d4e4ff 0%,#c0d6ff 100%); border-color:rgba(74,144,226,.35); }
    .dl-label { font-size:15px; font-weight:700; color:#4a90e2; margin-bottom:4px; }
    .dl-time  { font-size:36px; font-weight:800; color:#ef4444; letter-spacing:-1.5px; font-variant-numeric:tabular-nums; line-height:1; }
    .dl-note  { font-size:15px; color:rgba(255,255,255,.78); line-height:1.65; max-width:400px; }
    :global(.light-mode) .dl-note { color:rgba(10,14,26,.6); }
    .dl-note strong { color:#fff; }
    :global(.light-mode) .dl-note strong { color:#0a0e1a; }

    /* ── card ───────────────────────────────────────────────── */
    .card {
        background: rgba(255,255,255,.05);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 16px;
        padding: 28px 32px;
        margin-bottom: 18px;
        backdrop-filter: blur(6px);
    }
    :global(.light-mode) .card { background:rgba(255,255,255,.85); border-color:rgba(10,14,26,.1); box-shadow:0 2px 14px rgba(0,0,0,.07); }

    .card-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 20px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 20px;
    }
    :global(.light-mode) .card-title { color:#0a0e1a; }
    .bar { width:4px; height:20px; background:#4a90e2; border-radius:3px; flex-shrink:0; }

    /* ── description text ───────────────────────────────────── */
    .desc-p {
        font-size: 16px;
        color: rgba(255,255,255,.88);
        line-height: 1.85;
        margin-bottom: 14px;
    }
    :global(.light-mode) .desc-p { color:rgba(10,14,26,.7); }
    .desc-p:last-child { margin-bottom: 0; }

    .desc-ul { list-style:none; padding:0; margin-top:10px; display:flex; flex-direction:column; gap:8px; }
    .desc-li {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 16px;
        color: rgba(255,255,255,.82);
        line-height: 1.75;
    }
    :global(.light-mode) .desc-li { color:rgba(10,14,26,.65); }
    .bullet { width:6px; height:6px; border-radius:50%; background:#4a90e2; margin-top:9px; flex-shrink:0; }

    /* ── tech grid ──────────────────────────────────────────── */
    .tech-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; margin-top:4px; }
    .tech-cell {
        background: rgba(0,0,0,.45);
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 11px;
        padding: 14px 18px;
    }
    :global(.light-mode) .tech-cell { background:#eef2ff; border-color:rgba(74,144,226,.18); }
    .tech-lbl { font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.12em; color:#5aaeff; margin-bottom:5px; }
    .tech-val { font-size:16px; color:#ffffff; font-weight:600; line-height:1.5; }
    :global(.light-mode) .tech-val { color:#0a0e1a; }

    /* ── requirements ───────────────────────────────────────── */
    .req-list { list-style:none; padding:0; display:flex; flex-direction:column; gap:14px; }
    .req-item { display:flex; gap:14px; align-items:flex-start; }
    .req-num {
        width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
        background: rgba(74,144,226,.25); color: #5aaeff;
        font-size: 12px; font-weight: 800;
        display: flex; align-items: center; justify-content: center;
        margin-top: 1px;
    }
    .req-text { font-size:16px; color:rgba(255,255,255,.88); line-height:1.75; }
    :global(.light-mode) .req-text { color:rgba(10,14,26,.7); }

    /* ── extra (optional) section ───────────────────────────── */
    .extra-card {
        background: rgba(74,144,226,.07);
        border: 1px solid rgba(74,144,226,.2);
        border-radius: 16px;
        padding: 24px 28px;
        margin-bottom: 18px;
    }
    :global(.light-mode) .extra-card { background:rgba(74,144,226,.06); border-color:rgba(74,144,226,.2); }
    .extra-title {
        font-size: 16px;
        font-weight: 700;
        color: #5aaeff;
        font-style: italic;
        margin-bottom: 14px;
    }
    .extra-list { list-style:none; padding:0; display:flex; flex-direction:column; gap:8px; }
    .extra-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 16px;
        color: rgba(255,255,255,.82);
        line-height: 1.75;
    }
    :global(.light-mode) .extra-item { color:rgba(10,14,26,.65); }
    .extra-item::before { content:'•'; color:#4a90e2; flex-shrink:0; font-size:18px; line-height:1.4; }

    /* ── CTA ────────────────────────────────────────────────── */
    .cta { display:flex; justify-content:flex-end; margin-top:8px; }
    .cta-btn {
        display: inline-flex; align-items: center; gap: 10px;
        padding: 16px 34px; border-radius: 12px;
        background: #3d8ef0; color: #fff;
        font-size: 17px; font-weight: 700; font-family: 'Manrope', sans-serif;
        text-decoration: none; border: none; cursor: pointer;
        transition: background .15s, transform .1s;
        box-shadow: 0 4px 20px rgba(74,144,226,.35);
    }
    .cta-btn:hover { background:#3a7dd0; transform:translateY(-2px); }
    .no-team-msg {
        font-size: 15px; color: rgba(255,255,255,.5);
        background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
        border-radius: 11px; padding: 14px 20px;
    }
    :global(.light-mode) .no-team-msg { color:rgba(10,14,26,.5); background:rgba(0,0,0,.04); border-color:rgba(0,0,0,.1); }

    @media(max-width:700px) {
        .main { padding:20px 16px 56px; }
        .h1 { font-size:22px; }
        .dl-time { font-size:26px; }
        .tech-grid { grid-template-columns:1fr 1fr; }
        .card { padding:20px 18px; }
    }
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <div class="inner">

                <!-- Breadcrumb -->
                <div class="bc">
                    <a href="/my-teams">Кабінет</a><span>/</span>
                    <a href="/my-teams">Мої команди</a><span>/</span>
                    {#if data.team}
                        <a href="/my-teams/{data.team.id}">Акаунт команди</a><span>/</span>
                    {/if}
                    <span class="cur">{data.tournament.title} — Завдання</span>
                </div>

                <h1 class="h1"><em>{data.tournament.title}</em> завдання</h1>

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

                <!-- Опис завдання -->
                <div class="card">
                    <div class="card-title"><span class="bar"></span>Опис завдання</div>
                    {#each descParas as para}
                        <p class="desc-p">{para.text}</p>
                    {/each}
                    {#if descItems.length > 0}
                        <ul class="desc-ul">
                            {#each descItems as item}
                                <li class="desc-li"><span class="bullet"></span>{item.text}</li>
                            {/each}
                        </ul>
                    {/if}
                </div>

                <!-- Вимоги до технологій -->
                {#if techRows.length > 0}
                    <div class="card">
                        <div class="card-title">
                            <span class="bar"></span>
                            Вимоги до технологій
                            <span style="font-size:13px;color:rgba(255,255,255,.35);font-weight:400;">(рекомендовано — можна замінити аналогами)</span>
                        </div>
                        <div class="tech-grid">
                            {#each techRows as t}
                                <div class="tech-cell">
                                    {#if t.label}<div class="tech-lbl">{t.label}</div>{/if}
                                    <div class="tech-val">{t.val}</div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Функціональні вимоги -->
                {#if data.task.requirements?.length > 0}
                    <div class="card">
                        <div class="card-title"><span class="bar"></span>Функціональні вимоги</div>
                        <ul class="req-list">
                            {#each data.task.requirements as req, i}
                                <li class="req-item">
                                    <span class="req-num">{i + 1}</span>
                                    <span class="req-text">{req}</span>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                <!-- Додатковий функціонал (якщо є в description як окремі bullet після маркера) -->
                <!-- Виводимо завжди якщо є requirements — це стандартний блок -->
                {#if data.task.requirements?.length > 0}
                    <div class="extra-card">
                        <div class="extra-title">Додатковий функціонал (опціонально — оцінюється додатково)</div>
                        <ul class="extra-list">
                            <li class="extra-item">Нотифікації (email/push/in-app): старт реєстрації, старт завдання, 24 години до дедлайну, закриття сабміту</li>
                            <li class="extra-item">Realtime статус (оновлення таблиці лідерів після нових оцінок)</li>
                            <li class="extra-item">Експорт результатів у CSV/Google Sheet</li>
                            <li class="extra-item">Генерація сертифікатів: адміністратор завантажує макет сертифіката, система генерує іменні сертифікати для учасників або переможців (PDF)</li>
                            <li class="extra-item">Розклад турніру: відображення календаря етапів, онлайн-консультацій, дедлайнів та інших подій; адміністратор може створювати/редагувати ці події, команди та журі бачать розклад</li>
                            <li class="extra-item">Архів попередніх турнірів: перелік завершених турнірів з результатами та командами; можливість перегляду сабміту (опціонально)</li>
                            <li class="extra-item">Оголошення: адміністратор публікує повідомлення-новини; їх бачать усі учасники; підтримка посилань та форматування, можливе розсилання нотифікацій</li>
                        </ul>
                    </div>
                {/if}

                <!-- CTA -->
                <div class="cta">
                    {#if data.team}
                        <a href="/tourments/{data.tournament.id}/submit" class="cta-btn">
                            Перейти до здачі завдання
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </a>
                    {:else}
                        <div class="no-team-msg">Для здачі завдання потрібна команда в цьому турнірі</div>
                    {/if}
                </div>

            </div>
        </main>
    </div>
    <Footer />
</div>