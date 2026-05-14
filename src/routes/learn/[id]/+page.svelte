<!-- src/routes/learn/[id]/+page.svelte -->
<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data, form }: { data: PageData; form: ActionData } = $props();

    const c = $derived(data.course);

    const levels: Record<string, { label: string; color: string; bg: string }> = {
        BEGINNER:     { label: 'Початківець', color: '#4ADE80', bg: 'rgba(74,222,128,.12)' },
        INTERMEDIATE: { label: 'Середній',    color: '#FB923C', bg: 'rgba(251,146,60,.12)' },
        ADVANCED:     { label: 'Просунутий',  color: '#F43F5E', bg: 'rgba(244,63,94,.12)'  },
    };
    const DEFAULT_LEVEL = { label: 'Базовий', color: '#64748B', bg: 'rgba(100,116,139,.1)' };
    const lvl = $derived(levels[c?.level ?? 'BEGINNER'] ?? DEFAULT_LEVEL);

    let openModules = $state<Record<string, boolean>>({});
    let enrolling = $state(false);

    // Open first module by default
    $effect(() => {
        if (c.modules?.[0]) openModules[c.modules[0].id] = true;
    });

    function toggleModule(id: string) {
        openModules[id] = !openModules[id];
    }

    function totalLessons(): number {
        return c.modules?.reduce((acc: number, m: any) => acc + m.lessons.length, 0) ?? 0;
    }

    function completedCount(): number {
        return Object.values(data.progress ?? {}).filter(Boolean).length;
    }

    function progressPercent(): number {
        const total = totalLessons();
        if (!total) return 0;
        return Math.round((completedCount() / total) * 100);
    }

    function fmtDuration(min: number): string {
        if (min < 60) return `${min} хв`;
        return `${Math.floor(min / 60)}г ${min % 60}хв`;
    }
</script>

<svelte:head>
    <title>{c?.title ?? 'Курс'} — LvUp</title>
</svelte:head>

<style>
.page { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
.body { display:flex; flex:1; min-height:0; }
.main { flex:1; padding:28px 36px 64px; overflow-y:auto; max-width:1200px; width:100%; margin:0 auto; box-sizing:border-box; }

/* breadcrumb */
.bc   { font-size:13px; color:var(--text-dim); margin-bottom:10px; display:flex; flex-wrap:wrap; gap:4px; }
.bc a { color:var(--text-muted); text-decoration:none; }
.bc a:hover { color:#3E83FF; }

/* layout */
.layout { display:grid; grid-template-columns:1fr 340px; gap:24px; align-items:start; max-width:1100px; }
@media(max-width:960px) { .layout { grid-template-columns:1fr; } }

/* ── Hero ── */
.hero {
    background:var(--surface); border:1px solid var(--border);
    border-radius:16px; overflow:hidden; margin-bottom:20px;
    position:relative;
}
:global(.light-mode) .hero { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 2px 14px rgba(0,0,0,.05); }

.hero-cover { width:100%; height:220px; object-fit:cover; display:block; background:linear-gradient(135deg,#0d1b4a,#1a3a7a); }
.hero-cover img { width:100%; height:100%; object-fit:cover; display:block; }

.hero-body { padding:24px 28px; }

.hero-meta { display:flex; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap; }
.level-badge { display:inline-flex; padding:3px 11px; border-radius:20px; font-size:11px; font-weight:700; }
.cat-tag { font-size:12px; color:var(--text-dim); }
:global(.light-mode) .cat-tag { color:rgba(10,14,26,.4); }

.hero-title { font-size:30px; font-weight:800; color:var(--text); letter-spacing:-.4px; margin-bottom:10px; }
:global(.light-mode) .hero-title { color:#0a0e1a; }

.hero-desc { font-size:15px; color:var(--text-muted); line-height:1.75; margin-bottom:18px; }

.hero-stats { display:flex; gap:20px; flex-wrap:wrap; padding-top:16px; border-top:1px solid var(--border); }
:global(.light-mode) .hero-stats { border-color:rgba(10,14,26,.08); }
.h-stat { display:flex; align-items:center; gap:6px; font-size:13px; color:var(--text-muted); }
:global(.light-mode) .h-stat { color:rgba(10,14,26,.55); }

/* ── Modules list ── */
.section-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
:global(.light-mode) .section-card { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 2px 10px rgba(0,0,0,.05); }

.section-title { font-size:17px; font-weight:700; color:var(--text); padding:18px 22px 14px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:9px; }
:global(.light-mode) .section-title { color:#0a0e1a; border-color:rgba(10,14,26,.08); }
.s-bar { width:4px; height:17px; background:#3E83FF; border-radius:3px; flex-shrink:0; }

.module-item { border-bottom:1px solid var(--border); }
:global(.light-mode) .module-item { border-color:rgba(10,14,26,.07); }
.module-item:last-child { border-bottom:none; }

.module-header {
    display:flex; align-items:center; gap:12px;
    padding:14px 22px; cursor:pointer;
    transition:background .12s;
}
.module-header:hover { background:var(--surface-2); }
:global(.light-mode) .module-header:hover { background:#f8faff; }

.module-num {
    width:28px; height:28px; border-radius:8px; flex-shrink:0;
    background:rgba(62,131,255,.1); border:1px solid rgba(62,131,255,.2);
    color:#3E83FF; font-size:12px; font-weight:700;
    display:flex; align-items:center; justify-content:center;
}

.module-info { flex:1; min-width:0; }
.module-title { font-size:15px; font-weight:600; color:var(--text); }
.module-sub   { font-size:12px; color:var(--text-dim); margin-top:2px; }
:global(.light-mode) .module-title { color:#0a0e1a; }
:global(.light-mode) .module-sub   { color:rgba(10,14,26,.4); }

.module-arrow { color:var(--text-dim); transition:transform .2s; flex-shrink:0; }
.module-arrow.open { transform:rotate(180deg); }

/* Lessons */
.lessons-list { padding:0 22px 10px 22px; }
.lesson-row {
    display:flex; align-items:center; gap:10px;
    padding:10px 12px; border-radius:8px;
    cursor:pointer; transition:background .12s; text-decoration:none;
}
.lesson-row:hover { background:var(--surface-2); }
:global(.light-mode) .lesson-row:hover { background:#f0f4ff; }

.lesson-icon {
    width:32px; height:32px; border-radius:8px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
}
.lesson-icon.video    { background:rgba(62,131,255,.1); color:#3E83FF; }
.lesson-icon.done     { background:rgba(74,222,128,.12); color:#4ADE80; }
.lesson-icon.locked   { background:rgba(255,255,255,.05); color:var(--text-dim); }
:global(.light-mode) .lesson-icon.locked { background:rgba(10,14,26,.06); }

.lesson-info { flex:1; min-width:0; }
.lesson-title { font-size:13px; font-weight:500; color:var(--text); }
:global(.light-mode) .lesson-title { color:#0a0e1a; }
.lesson-title.muted { color:var(--text-dim); }
:global(.light-mode) .lesson-title.muted { color:rgba(10,14,26,.4); }
.lesson-dur   { font-size:11px; color:var(--text-dim); margin-top:1px; }
:global(.light-mode) .lesson-dur { color:rgba(10,14,26,.35); }

.free-pill { font-size:10px; font-weight:700; padding:2px 7px; border-radius:10px; background:rgba(74,222,128,.12); color:#4ADE80; flex-shrink:0; }

/* ── Right widget ── */
.enroll-widget { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; position:sticky; top:20px; }
:global(.light-mode) .enroll-widget { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 4px 20px rgba(0,0,0,.08); }

.ew-price { font-size:28px; font-weight:800; color:var(--text); margin-bottom:4px; }
:global(.light-mode) .ew-price { color:#0a0e1a; }
.ew-free  { font-size:28px; font-weight:800; color:#4ADE80; margin-bottom:4px; }
.ew-sub   { font-size:13px; color:var(--text-muted); margin-bottom:16px; }

/* Progress circle */
.progress-row { display:flex; align-items:center; gap:12px; margin-bottom:16px; padding:12px 14px; background:rgba(62,131,255,.07); border:1px solid rgba(62,131,255,.18); border-radius:10px; }
.prog-num { font-size:20px; font-weight:800; color:#3E83FF; font-family:'JetBrains Mono',monospace; }
.prog-label { font-size:12px; color:var(--text-muted); }
.prog-bar-bg { height:6px; background:var(--border); border-radius:3px; overflow:hidden; margin-top:4px; width:100%; }
:global(.light-mode) .prog-bar-bg { background:rgba(10,14,26,.1); }
.prog-bar { height:100%; background:#3E83FF; border-radius:3px; }

.ew-stats { display:flex; flex-direction:column; gap:8px; margin-bottom:18px; }
.ew-stat { display:flex; align-items:center; justify-content:space-between; font-size:13px; }
.ew-stat-label { color:var(--text-muted); display:flex; align-items:center; gap:6px; }
:global(.light-mode) .ew-stat-label { color:rgba(10,14,26,.55); }
.ew-stat-val   { font-weight:600; color:var(--text); }
:global(.light-mode) .ew-stat-val { color:#0a0e1a; }

.btn-enroll {
    width:100%; padding:13px; border-radius:10px; border:none;
    background:#3E83FF; color:#fff; font-size:15px; font-weight:700;
    font-family:inherit; cursor:pointer; transition:background .12s;
    margin-bottom:8px;
}
.btn-enroll:hover:not(:disabled) { background:#2d6fe0; }
.btn-enroll:disabled { opacity:.5; cursor:not-allowed; }

.enrolled-badge {
    display:flex; align-items:center; justify-content:center; gap:6px;
    padding:11px; border-radius:10px; background:rgba(74,222,128,.1);
    border:1px solid rgba(74,222,128,.25); color:#4ADE80;
    font-size:14px; font-weight:700; margin-bottom:10px;
}

.ew-hint { font-size:12px; color:var(--text-dim); text-align:center; }
:global(.light-mode) .ew-hint { color:rgba(10,14,26,.4); }
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">

            <div class="bc">
                <a href="/learn">Курси</a>
                <span>/</span>
                <span style="color:#3E83FF;">{c.title}</span>
            </div>

            <div class="layout">
                <!-- LEFT: course info + modules -->
                <div>
                    <!-- Hero -->
                    <div class="hero">
                        <div class="hero-cover">
                            {#if c.coverUrl}
                                <img src={c.coverUrl} alt={c.title} />
                            {/if}
                        </div>
                        <div class="hero-body">
                            <div class="hero-meta">
                                <span class="level-badge" style="background:{lvl.bg}; color:{lvl.color};">{lvl.label}</span>
                                <span class="cat-tag">{c.category}</span>
                                {#if c.isFree}
                                    <span style="font-size:11px; font-weight:700; color:#4ADE80; background:rgba(74,222,128,.12); padding:2px 9px; border-radius:20px;">Безкоштовно</span>
                                {/if}
                            </div>
                            <div class="hero-title">{c.title}</div>
                            <div class="hero-desc">{c.description}</div>
                            <div class="hero-stats">
                                <span class="h-stat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                    {c.modules.length} модулів
                                </span>
                                <span class="h-stat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                                    {totalLessons()} уроків
                                </span>
                                <span class="h-stat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    {fmtDuration(c.duration)}
                                </span>
                                <span class="h-stat">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    {c._count?.enrollments ?? 0} студентів
                                </span>
                                <span class="h-stat">Автор: {c.author.name}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Modules -->
                    <div class="section-card">
                        <div class="section-title">
                            <span class="s-bar"></span>
                            Програма курсу
                        </div>

                        {#each c.modules as mod, mi}
                            <div class="module-item">
                                <div class="module-header" onclick={() => toggleModule(mod.id)} role="button" tabindex="0" onkeydown={(e) => e.key === 'Enter' && toggleModule(mod.id)}>
                                    <div class="module-num">{mi + 1}</div>
                                    <div class="module-info">
                                        <div class="module-title">{mod.title}</div>
                                        <div class="module-sub">
                                            {mod.lessons.length} уроків ·
                                            {fmtDuration(mod.lessons.reduce((a: number, l: any) => a + l.duration, 0))}
                                        </div>
                                    </div>
                                    <div class="module-arrow" class:open={openModules[mod.id]}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>
                                </div>

                                {#if openModules[mod.id]}
                                    <div class="lessons-list">
                                        {#each mod.lessons as lesson}
                                            {@const isCompleted = data.progress?.[lesson.id]}
                                            {@const canAccess = lesson.isFree || !!data.enrollment}
                                            <a
                                                href={canAccess ? `/learn/${c.id}/${lesson.id}` : '#'}
                                                class="lesson-row"
                                                onclick={canAccess ? undefined : (e) => e.preventDefault()}
                                            >
                                                <div class="lesson-icon" class:done={isCompleted} class:video={!isCompleted && canAccess} class:locked={!canAccess}>
                                                    {#if isCompleted}
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                                    {:else if canAccess}
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                                    {:else}
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                                    {/if}
                                                </div>
                                                <div class="lesson-info">
                                                    <div class="lesson-title" class:muted={!canAccess}>{lesson.title}</div>
                                                    <div class="lesson-dur">{fmtDuration(lesson.duration)}</div>
                                                </div>
                                                {#if lesson.isFree && !data.enrollment}
                                                    <span class="free-pill">Безкоштовно</span>
                                                {/if}
                                            </a>
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- RIGHT: enroll widget -->
                <div>
                    <div class="enroll-widget">
                        {#if c.isFree}
                            <div class="ew-free">Безкоштовно</div>
                        {:else}
                            <div class="ew-price">{c.price} грн</div>
                        {/if}
                        <div class="ew-sub">Необмежений доступ назавжди</div>

                        {#if data.enrollment}
                            <!-- Progress -->
                            <div class="progress-row">
                                <div>
                                    <div class="prog-num">{progressPercent()}%</div>
                                    <div class="prog-label">завершено</div>
                                </div>
                                <div style="flex:1;">
                                    <div class="prog-bar-bg">
                                        <div class="prog-bar" style="width:{progressPercent()}%"></div>
                                    </div>
                                    <div style="font-size:11px; color:var(--text-dim); margin-top:3px;">
                                        {completedCount()} / {totalLessons()} уроків
                                    </div>
                                </div>
                            </div>
                            <div class="enrolled-badge">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                Ти записаний на курс
                            </div>
                            {#if c.modules?.[0]?.lessons?.[0]}
                                <a href="/learn/{c.id}/{c.modules[0].lessons[0].id}" class="btn-enroll" style="display:block; text-align:center; text-decoration:none;">
                                    Продовжити навчання
                                </a>
                            {/if}
                        {:else if data.user && c.isFree}
                            <form method="POST" action="?/enroll" use:enhance={() => { enrolling = true; return async ({update}) => { await update(); enrolling = false; }; }}>
                                <button type="submit" class="btn-enroll" disabled={enrolling}>
                                    {enrolling ? 'Запис...' : 'Записатись безкоштовно →'}
                                </button>
                            </form>
                        {:else if data.user && !c.isFree}
                            <a href="/learn/{c.id}/checkout" class="btn-enroll" style="display:block;text-align:center;text-decoration:none;">
                                Придбати за {c.price} грн →
                            </a>
                        {:else}
                            <a href="/auth/login" class="btn-enroll" style="display:block; text-align:center; text-decoration:none;">
                                Увійти та записатись
                            </a>
                        {/if}

                        <!-- Stats -->
                        <div class="ew-stats" style="margin-top:16px;">
                            <div class="ew-stat">
                                <span class="ew-stat-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                    Модулів
                                </span>
                                <span class="ew-stat-val">{c.modules.length}</span>
                            </div>
                            <div class="ew-stat">
                                <span class="ew-stat-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
                                    Уроків
                                </span>
                                <span class="ew-stat-val">{totalLessons()}</span>
                            </div>
                            <div class="ew-stat">
                                <span class="ew-stat-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    Тривалість
                                </span>
                                <span class="ew-stat-val">{fmtDuration(c.duration)}</span>
                            </div>
                            <div class="ew-stat">
                                <span class="ew-stat-label">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    Студентів
                                </span>
                                <span class="ew-stat-val">{c._count?.enrollments ?? 0}</span>
                            </div>
                        </div>

                        {#if !data.user}
                            <div class="ew-hint">Безкоштовні уроки доступні без реєстрації</div>
                        {/if}
                    </div>
                </div>
            </div>

        </main>
    </div>
    <Footer />
</div>
