<!-- src/routes/tourments/[id]/task/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();

    // ── Countdown timer ──────────────────────────────────────────
    function fmt(d: string | Date) {
        const diff = new Date(d).getTime() - Date.now();
        if (diff <= 0) return null;
        const days = Math.floor(diff / 86400000);
        const h = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        return `${days}д ${h}:${m}:${s}`;
    }

    let countdown = $state(fmt(data.task.deadline));
    $effect(() => {
        const id = setInterval(() => { countdown = fmt(data.task.deadline); }, 1000);
        return () => clearInterval(id);
    });

    const isPast = $derived(new Date(data.task.deadline).getTime() < Date.now());

    // ── Parse techStack: "Backend: ...\nFrontend: ..." ────────────
    const techRows = $derived(
        (data.task.techStack ?? '').split('\n').filter(Boolean).map(line => {
            const i = line.indexOf(':');
            return i === -1
                ? { label: '', val: line.trim() }
                : { label: line.slice(0, i).trim(), val: line.slice(i + 1).trim() };
        })
    );
</script>

<svelte:head><title>{data.tournament.title} — Завдання</title></svelte:head>

<style>
    /* ── wrap ───────────────────────────────────────────────── */
    .wrap { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
    .row  { display:flex; flex:1; min-height:0; }
    .main { flex:1; padding:28px 40px 60px; max-width:840px; }

    /* ── breadcrumb ─────────────────────────────────────────── */
    .bc   { font-size:12px; color:var(--text-dim); margin-bottom:6px; display:flex; flex-wrap:wrap; gap:4px; }
    .bc a { color:var(--text-muted); text-decoration:none; }
    .bc a:hover, .bc .hi { color:#3d8ef0; }

    /* ── h1 ─────────────────────────────────────────────────── */
    .h1 { font-size:28px; font-weight:800; letter-spacing:-.5px; color:var(--text); margin-bottom:22px; }
    .h1 span { color:#3d8ef0; }

    /* ── deadline banner ────────────────────────────────────── */
    .dl {
        background:linear-gradient(135deg, #0c1b4a 0%, #111e58 100%);
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

    /* ── card ───────────────────────────────────────────────── */
    .card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px 24px; margin-bottom:14px; }
    :global(.light-mode) .card { box-shadow:0 2px 10px rgba(0,0,0,.06); }

    .ctitle { display:flex; align-items:center; gap:9px; font-size:15px; font-weight:700; color:var(--text); margin-bottom:14px; }
    .cbar   { width:4px; height:17px; background:#3d8ef0; border-radius:3px; flex-shrink:0; }

    /* ── description ────────────────────────────────────────── */
    .desc { font-size:14px; color:var(--text-muted); line-height:1.75; white-space:pre-line; }

    /* criteria bullets */
    .crit { list-style:none; padding:0; display:flex; flex-direction:column; gap:6px; margin-top:10px; }
    .crit li { display:flex; align-items:flex-start; gap:8px; font-size:14px; color:var(--text-muted); line-height:1.6; }
    .dot { width:5px; height:5px; border-radius:50%; background:#3d8ef0; margin-top:8px; flex-shrink:0; }

    /* ── tech grid ──────────────────────────────────────────── */
    .tgrid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:8px; margin-top:6px; }
    .tcell { background:var(--bg-secondary); border:1px solid var(--border); border-radius:9px; padding:10px 12px; }
    :global(.light-mode) .tcell { background:#eef2ff; border-color:rgba(61,142,240,.15); }
    .tlbl { font-size:10px; font-weight:700; color:#3d8ef0; text-transform:uppercase; letter-spacing:.08em; margin-bottom:3px; }
    .tval { font-size:13px; color:var(--text); font-weight:500; }

    /* ── requirements ───────────────────────────────────────── */
    .rlist { list-style:none; padding:0; display:flex; flex-direction:column; gap:7px; }
    .ritem { display:flex; align-items:flex-start; gap:9px; font-size:14px; color:var(--text-muted); line-height:1.65; }
    .rnum  { width:20px; height:20px; border-radius:5px; flex-shrink:0; background:rgba(61,142,240,.15); color:#3d8ef0; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; margin-top:2px; }

    /* ── cta ────────────────────────────────────────────────── */
    .cta { display:flex; justify-content:flex-end; margin-top:6px; }
    .btn {
        display:inline-flex; align-items:center; gap:8px;
        padding:12px 24px; border-radius:10px;
        background:#3d8ef0; color:#fff;
        font-size:14px; font-weight:700; font-family:'Manrope',sans-serif;
        text-decoration:none; border:none; cursor:pointer;
        transition:background .15s, transform .1s;
    }
    .btn:hover { background:#2d7de0; transform:translateY(-1px); }
    .no-team { font-size:13px; color:var(--text-muted); background:var(--surface); border:1px solid var(--border); border-radius:9px; padding:10px 16px; }

    @media(max-width:700px) {
        .main { padding:18px 14px 48px; }
        .h1   { font-size:20px; }
        .dl-time { font-size:22px; }
        .tgrid { grid-template-columns:1fr 1fr; }
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
                {#if data.team}
                    <a href="/my-teams">Мої команди</a><span>/</span>
                    <a href="/my-teams/{data.team.id}">Акаунт команди</a><span>/</span>
                {/if}
                <span class="hi">{data.tournament.title} — завдання</span>
            </div>

            <h1 class="h1"><span>{data.tournament.title}:</span> завдання</h1>

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

            <!-- Опис -->
            <div class="card">
                <div class="ctitle"><span class="cbar"></span>Опис завдання</div>
                <div class="desc">{data.task.description}</div>
            </div>

            <!-- Tech stack -->
            {#if techRows.length > 0}
                <div class="card">
                    <div class="ctitle">
                        <span class="cbar"></span>
                        Вимоги до технологій
                        <span style="font-size:11px;color:var(--text-dim);font-weight:400;margin-left:4px;">(рекомендовано — можна замінити аналогами)</span>
                    </div>
                    <div class="tgrid">
                        {#each techRows as t}
                            <div class="tcell">
                                {#if t.label}<div class="tlbl">{t.label}</div>{/if}
                                <div class="tval">{t.val}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}

            <!-- Функціональні вимоги -->
            {#if data.task.requirements?.length > 0}
                <div class="card">
                    <div class="ctitle"><span class="cbar"></span>Функціональні вимоги</div>
                    <ul class="rlist">
                        {#each data.task.requirements as req, i}
                            <li class="ritem">
                                <span class="rnum">{i + 1}</span>
                                {req}
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}

            <!-- CTA -->
            <div class="cta">
                {#if data.team}
                    <a href="/tourments/{data.tournament.id}/submit" class="btn" aria-disabled={isPast}>
                        Перейти до здачі завдання
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                {:else}
                    <div class="no-team">Для здачі потрібна команда в цьому турнірі</div>
                {/if}
            </div>

        </main>
    </div>
    <Footer />
</div>