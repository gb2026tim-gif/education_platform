<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { data }: { data: PageData } = $props();

    onMount(() => {
        if (data.user) {
            if (data.user.role === 'ADMIN') goto('/admin');
            else if (data.user.role === 'JURY') goto('/jury/dashboard');
        }
    });

    const statusLabel: Record<string, string> = {
        REGISTRATION: 'Реєстрація',
        RUNNING: 'Активний',
        FINISHED: 'Завершено',
        DRAFT: 'Чернетка'
    };

    const allTournaments = $derived([...data.registration, ...data.running, ...data.finished]);

    // --- FILTERS ---
    let activeFilter = $state('all');

    const filters = [
        { value: 'all',          label: 'Всі' },
        { value: 'RUNNING',      label: 'Тривають' },
        { value: 'REGISTRATION', label: 'Відкрита реєстрація' },
        { value: 'FINISHED',     label: 'Завершені' },
    ];

    const filteredTournaments = $derived(
        activeFilter === 'all'
            ? allTournaments
            : allTournaments.filter((t) => t.status === activeFilter)
    );

    // Pagination (3 per page, resets on filter change)
    let tournamentPage = $state(0);
    $effect(() => { activeFilter; tournamentPage = 0; });

    const perPage = 3;
    const totalPages = $derived(Math.ceil(filteredTournaments.length / perPage));
    const visibleTournaments = $derived(
        filteredTournaments.slice(tournamentPage * perPage, tournamentPage * perPage + perPage)
    );

    const courses = [
        { title: 'Python для початківців', tag: 'Безкоштовно', img: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80' },
        { title: 'Web розробка', tag: 'Безкоштовно', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80' },
        { title: 'Алгоритми та структури даних', tag: 'Безкоштовно', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80' },
    ];

    const announcements = [
        { tag: 'CODE4FUTURE', title: 'Командний турнір з програмування', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80' },
        { tag: 'НОВИНИ', title: 'Відкрита реєстрація на курси', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80' },
        { tag: 'ПОДІЇ', title: 'Зустріч з менторами', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' },
    ];

    let currentSlide = $state(0);

    function nextSlide() { currentSlide = (currentSlide + 1) % announcements.length; }
    function goToSlide(i: number) { currentSlide = i; }
    function prevT() { tournamentPage = Math.max(0, tournamentPage - 1); }
    function nextT() { tournamentPage = Math.min(totalPages - 1, tournamentPage + 1); }
    function borderOn(e: MouseEvent) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)'; }
    function borderOff(e: MouseEvent) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }

    const slide = $derived.by(() => {
        const s = announcements[currentSlide];
        if (!s) return announcements[0]!;
        return s;
    });
</script>

<div style="min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; overflow-x:hidden; transition:background 0.25s, color 0.25s;">
    <Header />

    <!-- HERO -->
    <section class="hero-section" style="position:relative; overflow:hidden; min-height:580px; display:flex; align-items:center;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem; width:100%; display:flex; align-items:center; min-height:580px; position:relative;">
            <div style="flex:1; max-width:520px; z-index:2; padding:4rem 0;">
                <h1 style="font-size:clamp(2rem,3.5vw,2.75rem); font-weight:800; line-height:1.15; color:var(--text); margin-bottom:1.25rem;">
                    Empower Child with<br />Future-Ready Tech<br />Skills
                </h1>
                <p style="color:var(--text-muted); font-size:1rem; line-height:1.7; margin-bottom:2rem; max-width:400px;">
                    Join us in creating tech leaders of tomorrow while supporting underprivileged children globally.
                </p>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                    <a href="/about" style="padding:0.75rem 1.75rem; border-radius:20px; border:1.5px solid var(--border-hover); color:var(--text-muted); font-size:0.95rem; font-weight:500; text-decoration:none;">Детальніше</a>
                    <a href="/auth/register" style="padding:0.75rem 1.75rem; border-radius:20px; background:#3E83FF; color:#fff; font-size:0.95rem; font-weight:600; text-decoration:none;">Зареєструватись</a>
                </div>
            </div>
            <div style="position:absolute; right:2rem; top:-40px; bottom:0; width:44%; max-width:500px; border-radius:280px 0 0 280px; overflow:hidden;">
                <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" alt="Tech education" style="width:100%; height:100%; object-fit:cover;" />
            </div>
        </div>
    </section>

    <!-- ВАЖЛИВІ ОГОЛОШЕННЯ -->
    <section style="padding:3rem 0;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">
            <div class="ann-block" style="border-radius:20px; padding:1.25rem 1.5rem; border:1px solid var(--border);">
                <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:1rem; color:var(--text);">Важливі оголошення</h2>
                <div style="position:relative; border-radius:14px; overflow:hidden; height:320px;">
                    <div style="display:flex; height:320px;">
                        <img src={slide.img} alt="" style="width:280px; height:320px; object-fit:cover; flex-shrink:0;" />
                        <div style="flex:1; position:relative; overflow:hidden;">
                            <img src="/ann-bg.png" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
                            <div style="position:absolute; inset:0; background:rgba(10,40,100,0.78);"></div>
                            <div style="position:absolute; inset:0; background:linear-gradient(135deg,rgba(13,27,64,0.6),rgba(26,58,106,0.5));"></div>
                            <div style="position:relative; z-index:2; padding:75px 2.5rem 2rem;">
                                <p style="font-size:0.7rem; font-weight:700; letter-spacing:0.15em; color:rgba(255,255,255,0.5); text-transform:uppercase; margin-bottom:0.75rem;">{slide.tag}</p>
                                <h3 style="font-size:1.75rem; font-weight:700; line-height:1.25; color:#fff;">{slide.title}</h3>
                            </div>
                        </div>
                    </div>
                    <button onclick={nextSlide} aria-label="Наступне оголошення"
                            style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.2); color:#fff; cursor:pointer; font-size:1.1rem; display:flex; align-items:center; justify-content:center; z-index:3;">›</button>
                    <div style="position:absolute; bottom:0.75rem; left:50%; transform:translateX(-50%); display:flex; gap:5px; z-index:3;">
                        {#each announcements as _, i}
                            <button onclick={() => goToSlide(i)} aria-label="Оголошення {i + 1}"
                                    style="width:{i === currentSlide ? '18px' : '7px'}; height:7px; border-radius:4px; background:{i === currentSlide ? '#3E83FF' : 'rgba(255,255,255,0.3)'}; border:none; cursor:pointer; transition:all 0.2s; padding:0;"></button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ТУРНІРИ -->
    <section style="padding:3rem 0;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">

            <!-- Title row -->
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
                <h2 style="font-size:1.35rem; font-weight:700; color:var(--text); margin:0;">Список всіх турнірів</h2>
                {#if totalPages > 1}
                    <div style="display:flex; gap:0.5rem;">
                        <button aria-label="Попередні турніри" onclick={prevT} disabled={tournamentPage === 0}
                                style="width:36px; height:36px; border-radius:50%; background:var(--surface); border:1px solid var(--border); color:var(--text); cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:{tournamentPage === 0 ? '0.3' : '1'};">‹</button>
                        <button aria-label="Наступні турніри" onclick={nextT} disabled={tournamentPage === totalPages - 1}
                                style="width:36px; height:36px; border-radius:50%; background:var(--surface); border:1px solid var(--border); color:var(--text); cursor:pointer; display:flex; align-items:center; justify-content:center; opacity:{tournamentPage === totalPages - 1 ? '0.3' : '1'};">›</button>
                    </div>
                {/if}
            </div>

            <!-- Filter tabs -->
            <div style="display:flex; gap:0.5rem; margin-bottom:1.25rem; flex-wrap:wrap;">
                {#each filters as f}
                    {@const count = f.value === 'all' ? allTournaments.length : allTournaments.filter((t) => t.status === f.value).length}
                    <button
                        onclick={() => { activeFilter = f.value; }}
                        style="padding:0.4rem 1rem; border-radius:100px; font-size:0.82rem; font-weight:600; cursor:pointer; font-family:inherit; transition:all 0.15s;
                               background:{activeFilter === f.value ? '#3E83FF' : 'rgba(255,255,255,0.05)'};
                               color:{activeFilter === f.value ? '#fff' : 'var(--text-muted,rgba(255,255,255,0.5))'};
                               border:1.5px solid {activeFilter === f.value ? '#3E83FF' : 'var(--border,rgba(255,255,255,0.07))'};">
                        {f.label}
                        <span style="margin-left:0.3rem; opacity:0.7; font-weight:500;">({count})</span>
                    </button>
                {/each}
            </div>

            {#if filteredTournaments.length === 0}
                <p style="color:var(--text-dim); font-size:0.9rem; padding:2rem 0; text-align:center;">Немає турнірів у цій категорії</p>
            {:else}
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1rem;">
                    {#each visibleTournaments as t}
                        <a href="/tourments/{t.id}" onmouseenter={borderOn} onmouseleave={borderOff}
                           style="display:block; border-radius:16px; overflow:hidden; background:var(--surface); border:1px solid var(--border); text-decoration:none; transition:border-color 0.2s;">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt={t.title} style="width:100%; height:140px; object-fit:cover; opacity:0.7;" />
                            <div style="padding:1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem;">
                                    <p style="color:var(--text); font-size:0.9rem; font-weight:600;">{t.title}</p>
                                    <span style="font-size:0.7rem; padding:0.2rem 0.55rem; border-radius:20px; background:#3E83FF; color:#fff; white-space:nowrap; flex-shrink:0;">{statusLabel[t.status] ?? t.status}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:0.4rem; color:var(--text-dim); font-size:0.78rem;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    Команди · 2–5 осіб
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
                <div style="margin-top:1.5rem; text-align:center;">
                    <a href="/tourments" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.75rem 2rem; border-radius:20px; border:1.5px solid rgba(62,131,255,0.4); color:#3E83FF; font-size:0.9rem; font-weight:600; text-decoration:none;">
                        Всі турніри
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                </div>
            {/if}
        </div>
    </section>

    <!-- КУРСИ -->
    <section style="padding:3rem 0;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">
            <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:1.25rem; color:var(--text);">Популярні курси</h2>
            <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1rem;">
                {#each courses as course, i}
                    <a href="/courses" style="display:block; border-radius:16px; overflow:hidden; background:var(--surface); border:2px solid {i === 0 ? '#3E83FF' : 'var(--border)'}; text-decoration:none;">
                        <img src={course.img} alt={course.title} style="width:100%; height:150px; object-fit:cover; opacity:0.75;" />
                        <div style="padding:1rem;">
                            <p style="color:var(--text); font-size:0.9rem; font-weight:600; margin-bottom:0.4rem;">{course.title}</p>
                            <span style="font-size:0.75rem; color:#3E83FF; font-weight:500;">{course.tag}</span>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section style="padding:2rem 0 4rem;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">
            <div style="border-radius:58px; height:432px; position:relative; overflow:hidden; background:#1B315A;">
                <img src="/cta-bg.png" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.61;" />
                <div style="position:absolute; top:32px; left:65px; width:656px; max-width:calc(100% - 130px); z-index:1;">
                    <h2 style="font-size:clamp(2rem,4.5vw,64px); font-weight:800; line-height:1.0; color:#fff; font-family:'Manrope',sans-serif;">
                        Реєструйся та<br />інвестуй у майбутнє<br />разом з нами
                    </h2>
                </div>
                <a href="/auth/register" style="position:absolute; bottom:40px; right:120px; padding:1rem 2.75rem; border-radius:20px; background:#3E83FF; color:#fff; font-size:1rem; font-weight:600; text-decoration:none; z-index:1;">
                    Зареєструватись
                </a>
            </div>
        </div>
    </section>

    <Footer />
</div>
