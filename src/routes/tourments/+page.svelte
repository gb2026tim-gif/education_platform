<!-- src/routes/tourments/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { data }: { data: PageData } = $props();

    type Filter = 'all' | 'RUNNING' | 'REGISTRATION' | 'FINISHED';
    let activeFilter = $state<Filter>('all');

    const filters: { value: Filter; label: string }[] = [
        { value: 'all',          label: 'Всі' },
        { value: 'RUNNING',      label: 'Тривають' },
        { value: 'REGISTRATION', label: 'Відкрита реєстрація' },
        { value: 'FINISHED',     label: 'Завершені' },
    ];

    const allTournaments = $derived([
        ...(data.running ?? []),
        ...(data.registration ?? []),
        ...(data.finished ?? []),
    ]);

    const filtered = $derived(
        activeFilter === 'all'
            ? allTournaments
            : allTournaments.filter((t: any) => t.status === activeFilter)
    );

    const countByStatus = $derived({
        RUNNING:      (data.running ?? []).length,
        REGISTRATION: (data.registration ?? []).length,
        FINISHED:     (data.finished ?? []).length,
    });

    const statusConfig: Record<string, { label: string; color: string; bg: string; dot: boolean }> = {
        RUNNING:      { label: 'Триває',              color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',   dot: true },
        REGISTRATION: { label: 'Реєстрація відкрита', color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',   dot: false },
        FINISHED:     { label: 'Завершено',            color: '#64748B', bg: 'rgba(100,116,139,0.1)',  dot: false },
        DRAFT:        { label: 'Чернетка',             color: '#475569', bg: 'rgba(71,85,105,0.1)',    dot: false },
    };

    function fmt(d: string | Date | null | undefined) {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' });
    }
</script>

<div style="min-height:100vh; background:var(--bg,#0a0e1a); color:var(--text,#fff); font-family:'Manrope',sans-serif; transition:background 0.25s, color 0.25s;">
<Header />
<div style="padding:3.5rem 2rem 5rem;">
    <div style="max-width:1200px; margin:0 auto;">

        <!-- Page header -->
        <div style="margin-bottom:2.5rem;">
            <h1 style="font-size:2.25rem; font-weight:800; color:var(--text,#fff); margin:0 0 0.4rem; letter-spacing:-0.02em;">Турніри</h1>
            <p style="color:var(--text-muted,rgba(255,255,255,0.45)); font-size:0.95rem; margin:0;">{allTournaments.length} турнірів на платформі</p>
        </div>

        <!-- Filter tabs -->
        <div style="display:flex; gap:0.5rem; margin-bottom:2rem; flex-wrap:wrap;">
            {#each filters as f}
                {@const count = f.value === 'all' ? allTournaments.length : countByStatus[f.value as keyof typeof countByStatus]}
                <button
                    onclick={() => activeFilter = f.value}
                    style="padding:0.5rem 1.2rem; border-radius:100px; font-size:0.875rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.15s;
                           background:{activeFilter === f.value ? '#3E83FF' : 'rgba(255,255,255,0.05)'};
                           color:{activeFilter === f.value ? '#fff' : 'rgba(255,255,255,0.5)'};
                           border:1.5px solid {activeFilter === f.value ? '#3E83FF' : 'rgba(255,255,255,0.07)'};">
                    {f.label}
                    <span style="margin-left:0.35rem; opacity:0.7; font-weight:500;">({count})</span>
                </button>
            {/each}
        </div>

        <!-- Grid -->
        {#if filtered.length === 0}
            <div style="text-align:center; padding:5rem 1rem;">
                <div style="font-size:3rem; margin-bottom:1rem;">🏆</div>
                <p style="color:rgba(255,255,255,0.35); font-size:1rem;">Немає турнірів у цій категорії</p>
            </div>
        {:else}
            <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:1.25rem;">
                {#each filtered as t}
                    {@const cfg = statusConfig[t.status] ?? statusConfig.DRAFT}
                    <a href="/tourments/{t.id}" style="text-decoration:none; display:block;">
                        <article
                            style="background:var(--surface,#111827); border:1px solid rgba(255,255,255,0.07); border-radius:20px; padding:1.75rem; transition:all 0.2s; height:100%; box-sizing:border-box; display:flex; flex-direction:column;"
                            onmouseenter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(62,131,255,0.3)'; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 8px 32px rgba(0,0,0,0.3)'; }}
                            onmouseleave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.07)'; el.style.transform=''; el.style.boxShadow=''; }}>

                            <!-- Top row: status + team count -->
                            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
                                <span style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.28rem 0.85rem; border-radius:100px; background:{cfg.bg}; color:{cfg.color}; font-size:0.78rem; font-weight:600;">
                                    {#if cfg.dot}
                                        <span style="width:6px; height:6px; border-radius:50%; background:{cfg.color}; animation:blink 1.5s infinite;"></span>
                                    {/if}
                                    {cfg.label}
                                </span>
                                {#if t._count?.teams !== undefined}
                                    <span style="font-size:0.8rem; color:rgba(255,255,255,0.3); display:flex; align-items:center; gap:0.3rem;">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                        {t._count.teams}
                                    </span>
                                {/if}
                            </div>

                            <!-- Title -->
                            <h3 style="font-size:1.15rem; font-weight:700; color:var(--text,#fff); margin:0 0 0.5rem; line-height:1.3; flex:1;">{t.title}</h3>

                            <!-- Description -->
                            {#if t.description}
                                <p style="font-size:0.85rem; color:rgba(255,255,255,0.4); margin:0 0 1.25rem; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{t.description}</p>
                            {:else}
                                <div style="margin-bottom:1.25rem;"></div>
                            {/if}

                            <!-- Dates -->
                            <div style="padding-top:1rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; flex-direction:column; gap:0.35rem;">
                                {#if t.regStart && t.regEnd}
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                        <span style="color:rgba(255,255,255,0.35);">Реєстрація</span>
                                        <span style="color:rgba(255,255,255,0.6);">{fmt(t.regStart)} — {fmt(t.regEnd)}</span>
                                    </div>
                                {/if}
                                {#if t.startDate}
                                    <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                        <span style="color:rgba(255,255,255,0.35);">Старт</span>
                                        <span style="color:rgba(255,255,255,0.6);">{fmt(t.startDate)}</span>
                                    </div>
                                {/if}
                            </div>

                            <!-- CTA -->
                            {#if t.status === 'REGISTRATION'}
                                <div style="margin-top:1.25rem;">
                                    <span style="display:block; padding:0.6rem; background:linear-gradient(135deg,#0378A8,#0802FF); color:#fff; border-radius:12px; font-size:0.85rem; font-weight:600; text-align:center;">
                                        Зареєструватись →
                                    </span>
                                </div>
                            {:else if t.status === 'RUNNING'}
                                <div style="margin-top:1.25rem;">
                                    <span style="display:block; padding:0.6rem; background:rgba(74,222,128,0.08); border:1px solid rgba(74,222,128,0.2); color:#4ADE80; border-radius:12px; font-size:0.85rem; font-weight:600; text-align:center;">
                                        Детальніше →
                                    </span>
                                </div>
                            {/if}
                        </article>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</div>

<Footer />
</div>

<style>
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.35; }
    }
</style>