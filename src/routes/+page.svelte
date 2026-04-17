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

    const statusBg: Record<string, string> = {
        REGISTRATION: '#1d4ed8',
        RUNNING: '#15803d',
        FINISHED: '#374151',
        DRAFT: '#374151'
    };

    const allTournaments = $derived([
        ...data.registration,
        ...data.running,
        ...data.finished
    ].slice(0, 4));
</script>

<div class="min-h-screen bg-[#0D0D14] text-white">
    <Header />

    <!-- Hero -->
    <section class="relative overflow-hidden min-h-[520px] flex items-center" style="background: linear-gradient(135deg, #0d1b3e 0%, #0D0D14 50%);">
        <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 w-full py-20 flex flex-col md:flex-row items-center gap-12">
            <div class="flex-1 max-w-xl">
                <h1 class="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                    Empower Child with<br />
                    <span class="text-[#3E83FF]">Future-Ready</span> Tech<br />
                    Skills
                </h1>
                <p class="text-white/60 text-base leading-relaxed mb-8 max-w-md">
                    Join us in creating tech leaders of tomorrow while supporting underprivileged children globally.
                </p>
                <div class="flex gap-3 flex-wrap">
                    <a href="/about" class="px-6 py-3 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:border-white/40 hover:text-white transition-colors">
                        Детальніше
                    </a>
                    <a href="/auth/register" class="px-6 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity" style="background:#3E83FF;">
                        Зареєструватись
                    </a>
                </div>
            </div>
            <div class="flex-1 flex justify-center md:justify-end">
                <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&q=80"
                    alt="Tech education"
                    class="w-80 h-72 object-cover rounded-2xl opacity-80"
                />
            </div>
        </div>
    </section>

    <!-- Важливі оголошення -->
    <section class="py-12">
        <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
            <h2 class="text-xl font-bold text-white mb-6">Важливі оголошення</h2>
            <div class="rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row items-center gap-6 p-0" style="background: linear-gradient(90deg, #0d1b3e, #111827);">
                <img
                    src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80"
                    alt="Турнір"
                    class="w-full md:w-64 h-40 object-cover rounded-l-2xl flex-shrink-0"
                />
                <div class="flex-1 p-6">
                    <p class="text-[11px] font-bold tracking-widest text-[#3E83FF] uppercase mb-2">CODE4FUTURE</p>
                    <h3 class="text-2xl font-bold text-white mb-2">Командний турнір<br />з програмування</h3>
                    <p class="text-white/50 text-sm mb-4">Реєструй команду та змагайся за перше місце</p>
                    <a href="/tourments" class="inline-block px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity" style="background:#3E83FF;">
                        Дізнатись більше
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Список турнірів -->
    <section class="py-12">
        <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
            <h2 class="text-xl font-bold text-white mb-6">Список всіх турнірів</h2>
            {#if allTournaments.length === 0}
                <p class="text-white/40 text-sm">Турнірів поки немає</p>
            {:else}
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {#each allTournaments as tournament}
                        <a href="/tourments/{tournament.id}" class="group block rounded-2xl border border-white/5 overflow-hidden hover:border-white/15 transition-colors" style="background:#111116;">
                            <img
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80"
                                alt={tournament.title}
                                class="w-full h-36 object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div class="p-4">
                                <div class="flex items-start justify-between gap-2 mb-2">
                                    <p class="text-white text-sm font-semibold leading-snug group-hover:text-[#3E83FF] transition-colors">
                                        {tournament.title}
                                    </p>
                                    <span class="text-xs px-2 py-0.5 rounded-full shrink-0 text-white" style="background:{statusBg[tournament.status]};">
                                        {statusLabel[tournament.status]}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3 text-xs text-white/35 mt-2">
                                    <span>Команд: {tournament._count.teams}</span>
                                    <span>·</span>
                                    <span>{new Date(tournament.regEnd).toLocaleDateString('uk-UA')}</span>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

    <!-- Популярні курси -->
    <section class="py-12">
        <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
            <h2 class="text-xl font-bold text-white mb-6">Популярні курси</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {#each [
                    { title: 'Python для початківців', img: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80' },
                    { title: 'Web розробка', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80' },
                    { title: 'Алгоритми та структури даних', img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80' }
                ] as course}
                    <a href="/courses" class="group block rounded-2xl border border-white/5 overflow-hidden hover:border-white/15 transition-colors" style="background:#111116;">
                        <img src={course.img} alt={course.title} class="w-full h-36 object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                        <div class="p-4">
                            <p class="text-white text-sm font-semibold mb-1 group-hover:text-[#3E83FF] transition-colors">{course.title}</p>
                            <p class="text-white/35 text-xs">Навчання</p>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-12 pb-20">
        <div class="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20">
            <div class="rounded-2xl border border-white/5 p-10 flex flex-col md:flex-row items-center justify-between gap-6" style="background: linear-gradient(90deg, #0d1b3e, #1a2a4a, #0d1b3e);">
                <h2 class="text-2xl md:text-3xl font-extrabold text-white">
                    Реєструйся та<br />інвестуй у майбутнє<br />разом з нами
                </h2>
                <a href="/auth/register" class="px-8 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap" style="background:#3E83FF;">
                    Зареєструватись
                </a>
            </div>
        </div>
    </section>

    <Footer />
</div>
