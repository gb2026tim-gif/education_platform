<!-- src/routes/learn/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();

    const levels: Record<string, { label: string; color: string; bg: string }> = {
        BEGINNER:     { label: 'Початківець', color: '#4ADE80', bg: 'rgba(74,222,128,.12)' },
        INTERMEDIATE: { label: 'Середній',    color: '#FB923C', bg: 'rgba(251,146,60,.12)' },
        ADVANCED:     { label: 'Просунутий',  color: '#F43F5E', bg: 'rgba(244,63,94,.12)'  },
    };

    const DEFAULT_LEVEL = { label: 'Базовий', color: '#64748B', bg: 'rgba(100,116,139,.1)' };

    type Filter = 'all' | 'free' | 'paid';
    let activeFilter = $state<Filter>('all');
    let activeCategory = $state('all');
    let search = $state('');

    const categories = $derived([
        'all',
        ...Array.from(new Set(data.courses.map((c: any) => c.category))),
    ]);

    const filtered = $derived(
        data.courses.filter((c: any) => {
            const byFilter   = activeFilter === 'all' ? true : activeFilter === 'free' ? c.isFree : !c.isFree;
            const byCat      = activeCategory === 'all' || c.category === activeCategory;
            const bySearch   = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.shortDesc.toLowerCase().includes(search.toLowerCase());
            return byFilter && byCat && bySearch;
        })
    );

    function totalLessons(course: any): number {
        return course.modules?.reduce((acc: number, m: any) => acc + (m._count?.lessons ?? 0), 0) ?? 0;
    }

    function getProgress(course: any): number {
        if (!data.enrollments) return 0;
        const e = data.enrollments.find((en: any) => en.courseId === course.id);
        if (!e) return 0;
        const total = totalLessons(course);
        if (!total) return 0;
        return Math.round((e.completedLessons / total) * 100);
    }

    function isEnrolled(course: any): boolean {
        return data.enrollments?.some((e: any) => e.courseId === course.id) ?? false;
    }
</script>

<svelte:head>
    <title>Курси — LvUp</title>
</svelte:head>

<style>
.page  { min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; display:flex; flex-direction:column; }
.body  { display:flex; flex:1; min-height:0; }
.main  { flex:1; padding:32px 40px 64px; max-width:1200px; margin:0 auto; width:100%; box-sizing:border-box; }

/* ── top bar ── */
.top-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:20px; }
.page-title { font-size:34px; font-weight:800; color:var(--text); letter-spacing:-.4px; margin:0; }
:global(.light-mode) .page-title { color:#0a0e1a; }

.search-wrap { position:relative; }
.search-input {
    padding:9px 14px 9px 36px; border-radius:9px;
    border:1px solid var(--border); background:var(--surface);
    color:var(--text); font-size:14px; font-family:inherit; outline:none;
    width:220px; transition:border-color .12s;
}
.search-input:focus { border-color:#3E83FF; }
:global(.light-mode) .search-input { background:#fff; border-color:rgba(10,14,26,.1); color:#0a0e1a; }
.search-icon { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:var(--text-dim); pointer-events:none; }

/* ── filters ── */
.filter-row { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:24px; }
.filter-btn {
    padding:7px 16px; border-radius:8px; font-size:13px; font-weight:600;
    border:1px solid var(--border); background:var(--surface);
    color:var(--text-muted); cursor:pointer; font-family:inherit;
    transition:background .12s, color .12s, border-color .12s;
}
.filter-btn:hover  { background:var(--surface-2); color:var(--text); }
.filter-btn.active { background:#3E83FF; color:#fff; border-color:#3E83FF; }
:global(.light-mode) .filter-btn { background:#fff; border-color:rgba(10,14,26,.1); color:rgba(10,14,26,.6); }
:global(.light-mode) .filter-btn.active { background:#3E83FF; color:#fff; border-color:#3E83FF; }

.sep { width:1px; height:22px; background:var(--border); }

/* ── grid ── */
.courses-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
@media(max-width:1200px){.courses-grid{grid-template-columns:repeat(3,1fr);}}
@media(max-width:900px){.courses-grid{grid-template-columns:repeat(2,1fr);}}

/* ── course card ── */
.c-card {
    background:var(--surface); border:1px solid var(--border); border-radius:14px;
    overflow:hidden; display:flex; flex-direction:column;
    transition:border-color .15s, box-shadow .15s, transform .15s;
}
.c-card:hover { border-color:rgba(62,131,255,.3); box-shadow:0 8px 30px rgba(0,0,0,.15); transform:translateY(-2px); }
:global(.light-mode) .c-card { background:#fff; border-color:rgba(10,14,26,.08); }
:global(.light-mode) .c-card:hover { box-shadow:0 8px 24px rgba(0,0,0,.08); }

/* Card cover */
.c-cover {
    width:100%; height:170px; object-fit:cover;
    background:linear-gradient(135deg,#0f2057,#1a50a0);
    display:block; position:relative;
}
.c-cover img { width:100%; height:100%; object-fit:cover; display:block; }
.c-cover-placeholder {
    width:100%; height:170px;
    background:linear-gradient(135deg,#0d1b4a 0%,#1a3a7a 50%,#0d1b4a 100%);
    display:flex; align-items:center; justify-content:center;
}
.c-cover-icon { opacity:.3; }

.free-badge {
    position:absolute; top:10px; left:10px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;
    background:rgba(74,222,128,.9); color:#fff;
}
.paid-badge {
    position:absolute; top:10px; left:10px;
    padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700;
    background:rgba(251,146,60,.9); color:#fff;
}

/* Card body */
.c-body { padding:16px 18px 18px; flex:1; display:flex; flex-direction:column; gap:10px; }

.c-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.level-badge { display:inline-flex; align-items:center; padding:2px 9px; border-radius:20px; font-size:11px; font-weight:700; }
.cat-badge   { font-size:11px; color:var(--text-dim); }
:global(.light-mode) .cat-badge { color:rgba(10,14,26,.4); }

.c-title { font-size:17px; font-weight:700; color:var(--text); line-height:1.35; }
:global(.light-mode) .c-title { color:#0a0e1a; }

.c-desc { font-size:14px; color:var(--text-muted); line-height:1.55; flex:1; }

.c-stats { display:flex; gap:14px; font-size:12px; color:var(--text-muted); }
:global(.light-mode) .c-stats { color:rgba(10,14,26,.55); }
.c-stat { display:flex; align-items:center; gap:4px; }

/* Progress bar */
.progress-wrap { margin-top:4px; }
.progress-bar-bg { height:4px; background:var(--border); border-radius:2px; overflow:hidden; }
:global(.light-mode) .progress-bar-bg { background:rgba(10,14,26,.1); }
.progress-bar { height:100%; background:#3E83FF; border-radius:2px; transition:width .3s; }
.progress-label { font-size:11px; color:#3E83FF; margin-top:3px; }

/* Card actions */
.c-actions { display:flex; gap:8px; padding:0 18px 18px; }
.btn-enroll {
    flex:1; padding:10px; border-radius:9px; border:none;
    background:#3E83FF; color:#fff; font-size:14px; font-weight:700;
    cursor:pointer; font-family:inherit; text-decoration:none;
    text-align:center; transition:background .12s;
}
.btn-enroll:hover { background:#2d6fe0; }


/* Empty */
.empty { text-align:center; padding:60px 0; color:var(--text-dim); grid-column:1/-1; }
.empty p { font-size:14px; }

/* Count */
.result-count { font-size:13px; color:var(--text-muted); margin-bottom:16px; }
:global(.light-mode) .result-count { color:rgba(10,14,26,.5); }

@media(max-width:700px) {
    .main { padding:16px 14px 48px; }
    .page-title { font-size:22px; }
    .courses-grid { grid-template-columns:1fr; }
    .search-input { width:160px; }
}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">

            <!-- Top bar -->
            <div class="top-bar">
                <h1 class="page-title">Курси</h1>
                <div class="search-wrap">
                    <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input class="search-input" type="text" placeholder="Пошук курсів..." bind:value={search} />
                </div>
            </div>

            <!-- Filters -->
            <div class="filter-row">
                <button class="filter-btn" class:active={activeFilter==='all'}  onclick={() => activeFilter='all'} >Всі</button>
                <button class="filter-btn" class:active={activeFilter==='free'} onclick={() => activeFilter='free'}>Безкоштовні</button>
                <button class="filter-btn" class:active={activeFilter==='paid'} onclick={() => activeFilter='paid'}>Платні</button>
                <div class="sep"></div>
                {#each categories as cat}
                    <button
                        class="filter-btn"
                        class:active={activeCategory === cat}
                        onclick={() => activeCategory = cat}
                    >
                        {cat === 'all' ? 'Усі категорії' : cat}
                    </button>
                {/each}
            </div>

            <div class="result-count">{filtered.length} курс{filtered.length === 1 ? '' : filtered.length < 5 ? 'и' : 'ів'}</div>

            <!-- Grid -->
            <div class="courses-grid">
                {#each filtered as course}
                    {@const lvl = levels[course.level] ?? DEFAULT_LEVEL}
                    {@const enrolled = isEnrolled(course)}
                    {@const progress = getProgress(course)}
                    {@const lessons = totalLessons(course)}

                    <div class="c-card">
                        <!-- Cover -->
                        <a href="/learn/{course.id}" style="position:relative; display:block; text-decoration:none;">
                            {#if course.coverUrl}
                                <div class="c-cover">
                                    <img src={course.coverUrl} alt={course.title} loading="lazy" />
                                </div>
                            {:else}
                                <div class="c-cover-placeholder">
                                    <div class="c-cover-icon">
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                        </svg>
                                    </div>
                                </div>
                            {/if}
                            {#if course.isFree}
                                <span class="free-badge">Безкоштовно</span>
                            {:else}
                                <span class="paid-badge">{course.price} грн</span>
                            {/if}
                        </a>

                        <!-- Body -->
                        <div class="c-body">
                            <div class="c-meta">
                                <span class="level-badge" style="background:{lvl.bg}; color:{lvl.color};">{lvl.label}</span>
                                <span class="cat-badge">{course.category}</span>
                            </div>
                            <a href="/learn/{course.id}" style="text-decoration:none;">
                                <div class="c-title">{course.title}</div>
                            </a>
                            <div class="c-desc">{course.shortDesc}</div>

                            <div class="c-stats">
                                <span class="c-stat">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                    </svg>
                                    {course._count?.modules ?? course.modules?.length ?? 0} модулів
                                </span>
                                <span class="c-stat">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polygon points="23 7 16 12 23 17 23 7"/>
                                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                                    </svg>
                                    {lessons} уроків
                                </span>
                                <span class="c-stat">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    {Math.floor(course.duration / 60)}г {course.duration % 60}хв
                                </span>
                            </div>

                            <!-- Progress bar for enrolled -->
                            {#if enrolled}
                                <div class="progress-wrap">
                                    <div class="progress-bar-bg">
                                        <div class="progress-bar" style="width:{progress}%"></div>
                                    </div>
                                    <div class="progress-label">{progress}% завершено</div>
                                </div>
                            {/if}
                        </div>

                        <!-- Actions -->
                        <div class="c-actions">
                            {#if enrolled}
                                <a href="/learn/{course.id}" class="btn-enroll">Продовжити →</a>
                            {:else if course.isFree}
                                <a href="/learn/{course.id}" class="btn-enroll">Почати безкоштовно →</a>
                            {:else}
                                <a href="/learn/{course.id}" class="btn-enroll">Детальніше →</a>
                            {/if}
                        </div>
                    </div>
                {/each}

                {#if filtered.length === 0}
                    <div class="empty">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.3; margin-bottom:12px;">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <p>Курсів не знайдено</p>
                    </div>
                {/if}
            </div>

        </main>
    </div>
    <Footer />
</div>
