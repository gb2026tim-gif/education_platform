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

    const allTournaments = $derived([
        ...data.registration,
        ...data.running,
        ...data.finished
    ].slice(0, 3));

    const courses = [
        { title: 'Python для початківців', tag: 'Безкоштовно', img: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80' },
        { title: 'Python для початківців', tag: 'Безкоштовно', img: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80' },
        { title: 'Python для початківців', tag: 'Безкоштовно', img: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80' },
    ];

    const announcements = [
        { tag: 'CODE4FUTURE', title: 'Командний турнір з програмування', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80' },
        { tag: 'НОВИНИ', title: 'Відкрита реєстрація на курси', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80' },
        { tag: 'ПОДІЇ', title: 'Зустріч з менторами', img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' },
    ];

    let currentSlide = $state(0);
    function nextSlide() { currentSlide = (currentSlide + 1) % announcements.length; }
</script>

<div style="min-height:100vh; background:#0a0e1a; color:#fff; font-family:'Manrope',sans-serif; overflow-x:hidden;">
    <Header />

    <!-- HERO -->
    <section style="position:relative; overflow:hidden; min-height:580px; display:flex; align-items:center;" 
             style:background="linear-gradient(135deg,#0d1635 0%,#0a0e1a 55%)">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem; width:100%; display:flex; align-items:center; min-height:580px; position:relative;">

            <!-- Text left -->
            <div style="flex:1; max-width:520px; z-index:2; padding:4rem 0;">
                <h1 style="font-size:clamp(2rem,3.5vw,2.75rem); font-weight:800; line-height:1.15; color:#fff; margin-bottom:1.25rem;">
                    Empower Child with<br />
                    Future-Ready Tech<br />
                    Skills
                </h1>
                <p style="color:rgba(255,255,255,0.55); font-size:1rem; line-height:1.7; margin-bottom:2rem; max-width:400px;">
                    Join us in creating tech leaders of tomorrow while supporting underprivileged children globally.
                </p>
                <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                    <a href="/about" style="padding:0.75rem 1.75rem; border-radius:20px; border:1.5px solid rgba(255,255,255,0.25); color:rgba(255,255,255,0.75); font-size:0.95rem; font-weight:500; text-decoration:none;">
                        Детальніше
                    </a>
                    <a href="/auth/register" style="padding:0.75rem 1.75rem; border-radius:20px; background:#3E83FF; color:#fff; font-size:0.95rem; font-weight:600; text-decoration:none;">
                        Зареєструватись
                    </a>
                </div>
            </div>

            <!-- Image right — заокруглення зліва, права сторона обрізана, торкається хедера і знизу -->
            <div style="position:absolute; right:2rem; top:-72px; bottom:0; width:48%; max-width:560px; border-radius:280px 0 0 280px; overflow:hidden;">
                <img
                    src="data:image/jpeg;base64,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"
                    alt="Tech education"
                    style="width:100%; height:100%; object-fit:cover; "
                />
            </div>
        </div>
    </section>

    <!-- ВАЖЛИВІ ОГОЛОШЕННЯ -->
    <section style="padding:3rem 0;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">
            <!-- Зовнішній блок з градієнтом, ширина 1280 -->
            <div style="border-radius:20px; padding:1.25rem 1.5rem; background:linear-gradient(135deg,#0d1b40 0%,#1a3060 50%,#0d1b40 100%); border:1px solid rgba(255,255,255,0.06);">
                <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:1rem; color:#fff;">Важливі оголошення</h2>

                <!-- Слайдер: вужчий, висота 320px -->
                <div style="position:relative; border-radius:14px; overflow:hidden; height:320px;">
                    <div style="display:flex; height:320px;">
                        <!-- Ліве фото -->
                        <img src={announcements[currentSlide].img} alt=""
                             style="width:280px; height:320px; object-fit:cover; flex-shrink:0; position:relative; z-index:1;" />

                        <!-- Правий блок: фото-фон ann-bg + синій overlay + текст -->
                        <div style="flex:1; position:relative; overflow:hidden;">
                            <!-- Фонове фото хвилі -->
                            <img src="/ann-bg.png" alt=""
                                 style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;" />
                            <!-- Синій кольоровий overlay -->
                            <div style="position:absolute; inset:0; background:rgba(10,40,100,0.78); mix-blend-mode:multiply;"></div>
                            <!-- Додатковий синій градієнт для насиченості -->
                            <div style="position:absolute; inset:0; background:linear-gradient(135deg,rgba(13,27,64,0.6) 0%,rgba(26,58,106,0.5) 100%);"></div>

                            <!-- Текст: 75px від верху -->
                            <div style="position:relative; z-index:2; padding:75px 2.5rem 2rem;">
                                <p style="font-size:0.7rem; font-weight:700; letter-spacing:0.15em; color:rgba(255,255,255,0.5); text-transform:uppercase; margin-bottom:0.75rem;">
                                    {announcements[currentSlide].tag}
                                </p>
                                <h3 style="font-size:1.75rem; font-weight:700; line-height:1.25; color:#fff;">
                                    {announcements[currentSlide].title}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <!-- Стрілка -->
                    <button onclick={nextSlide}
                            style="position:absolute; right:0.75rem; top:50%; transform:translateY(-50%); width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.2); color:#fff; cursor:pointer; font-size:1.1rem; display:flex; align-items:center; justify-content:center; z-index:3;">›</button>

                    <!-- Dots -->
                    <div style="position:absolute; bottom:0.75rem; left:50%; transform:translateX(-50%); display:flex; gap:5px; z-index:3;">
                        {#each announcements as _, i}
                            <button onclick={() => currentSlide = i}
                                    style="width:{i===currentSlide?'18px':'7px'}; height:7px; border-radius:4px; background:{i===currentSlide?'#3E83FF':'rgba(255,255,255,0.3)'}; border:none; cursor:pointer; transition:all 0.2s; padding:0;"></button>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- СПИСОК ТУРНІРІВ -->
    <section style="padding:3rem 0;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">
            <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:1.25rem;">Список всі турнірів</h2>
            {#if allTournaments.length === 0}
                <p style="color:rgba(255,255,255,0.3); font-size:0.9rem;">Турнірів поки немає</p>
            {:else}
                <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem;">
                    {#each allTournaments as t}
                        <a href="/tourments/{t.id}" style="display:block; border-radius:16px; overflow:hidden; background:#111827; border:1px solid rgba(255,255,255,0.06); text-decoration:none;">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt={t.title} style="width:100%; height:140px; object-fit:cover; opacity:0.7;" />
                            <div style="padding:1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem;">
                                    <p style="color:#fff; font-size:0.9rem; font-weight:600;">{t.title}</p>
                                    <span style="font-size:0.7rem; padding:0.2rem 0.55rem; border-radius:20px; background:#3E83FF; color:#fff; white-space:nowrap; flex-shrink:0;">{statusLabel[t.status]}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:0.4rem; color:rgba(255,255,255,0.4); font-size:0.78rem;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    Команди {t._count.teams} · до {new Date(t.regEnd).toLocaleDateString('uk-UA')}
                                </div>
                            </div>
                        </a>
                        <a href="/tourments/{t.id}" style="display:block; border-radius:16px; overflow:hidden; background:#111827; border:1px solid rgba(255,255,255,0.06); text-decoration:none;">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt={t.title} style="width:100%; height:140px; object-fit:cover; opacity:0.7;" />
                            <div style="padding:1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem;">
                                    <p style="color:#fff; font-size:0.9rem; font-weight:600;">{t.title}</p>
                                    <span style="font-size:0.7rem; padding:0.2rem 0.55rem; border-radius:20px; background:#3E83FF; color:#fff; white-space:nowrap; flex-shrink:0;">{statusLabel[t.status]}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:0.4rem; color:rgba(255,255,255,0.4); font-size:0.78rem;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    Команди {t._count.teams} · до {new Date(t.regEnd).toLocaleDateString('uk-UA')}
                                </div>
                            </div>
                        </a>
                        <a href="/tourments/{t.id}" style="display:block; border-radius:16px; overflow:hidden; background:#111827; border:1px solid rgba(255,255,255,0.06); text-decoration:none;">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt={t.title} style="width:100%; height:140px; object-fit:cover; opacity:0.7;" />
                            <div style="padding:1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem;">
                                    <p style="color:#fff; font-size:0.9rem; font-weight:600;">{t.title}</p>
                                    <span style="font-size:0.7rem; padding:0.2rem 0.55rem; border-radius:20px; background:#3E83FF; color:#fff; white-space:nowrap; flex-shrink:0;">{statusLabel[t.status]}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:0.4rem; color:rgba(255,255,255,0.4); font-size:0.78rem;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    Команди {t._count.teams} · до {new Date(t.regEnd).toLocaleDateString('uk-UA')}
                                </div>
                            </div>
                        </a>
                        <a href="/tourments/{t.id}" style="display:block; border-radius:16px; overflow:hidden; background:#111827; border:1px solid rgba(255,255,255,0.06); text-decoration:none;">
                            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" alt={t.title} style="width:100%; height:140px; object-fit:cover; opacity:0.7;" />
                            <div style="padding:1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; margin-bottom:0.5rem;">
                                    <p style="color:#fff; font-size:0.9rem; font-weight:600;">{t.title}</p>
                                    <span style="font-size:0.7rem; padding:0.2rem 0.55rem; border-radius:20px; background:#3E83FF; color:#fff; white-space:nowrap; flex-shrink:0;">{statusLabel[t.status]}</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:0.4rem; color:rgba(255,255,255,0.4); font-size:0.78rem;">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                                    Команди {t._count.teams} · до {new Date(t.regEnd).toLocaleDateString('uk-UA')}
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

    <!-- ПОПУЛЯРНІ КУРСИ -->
    <section style="padding:3rem 0;">
        <div style="max-width:1280px; margin:0 auto; padding:0 2rem;">
            <h2 style="font-size:1.35rem; font-weight:700; margin-bottom:1.25rem;">Популярні курси</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1rem;">
                {#each courses as course, i}
                    <a href="/courses" style="display:block; border-radius:16px; overflow:hidden; background:#111827; border:2px solid {i===0?'#3E83FF':'rgba(255,255,255,0.06)'}; text-decoration:none;">
                        <img src={course.img} alt={course.title} style="width:100%; height:150px; object-fit:cover; opacity:0.75;" />
                        <div style="padding:1rem;">
                            <p style="color:#fff; font-size:0.9rem; font-weight:600; margin-bottom:0.4rem;">{course.title}</p>
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
            <!-- CTA блок: висота 280px, radius 58px -->
            <div style="border-radius:58px; height:280px; position:relative; overflow:hidden; background:#1B315A;">
                <!-- Фонове фото хвилі, opacity 61% як в макеті -->
                <img src="/cta-bg.png" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:0.61;" />
                <!-- Контент: текст 656x240, padding 32px top, 64px left -->
                <!-- Текст: 32px зверху, 65px зліва -->
                <div style="position:absolute; top:32px; left:65px; width:656px; max-width:calc(100% - 130px); z-index:1;">
                    <h2 style="font-size:clamp(2rem,4.5vw,48px); font-weight:800; line-height:1.0; color:#fff; font-family:'Manrope',sans-serif;">
                        Реєструйся та<br />інвестуй у майбутнє<br />разом з нами
                    </h2>
                </div>
                <!-- Кнопка: 40px знизу, 120px справа -->
                <a href="/auth/register" style="position:absolute; bottom:40px; right:120px; padding:1rem 2.75rem; border-radius:20px; background:#3E83FF; color:#fff; font-size:1.2rem; font-weight:900; text-decoration:none; white-space:nowrap; z-index:1;">
                    Зареєструватись
                </a>
            </div>
        </div>
    </section>

    <Footer />
</div>
