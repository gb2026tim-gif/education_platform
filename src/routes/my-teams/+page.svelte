<!-- src/routes/my-teams/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();

    const statusLabel: Record<string, string> = {
        PENDING: 'Очікує',
        APPROVED: 'Підтверджено',
        REJECTED: 'Відхилено'
    };
    const statusColor: Record<string, string> = {
        PENDING: '#f59e0b',
        APPROVED: '#3ecf7c',
        REJECTED: '#ef4444'
    };
    const statusBg: Record<string, string> = {
        PENDING: 'rgba(245,158,11,0.1)',
        APPROVED: 'rgba(62,207,124,0.1)',
        REJECTED: 'rgba(239,68,68,0.1)'
    };
    const tournamentStatusLabel: Record<string, string> = {
        DRAFT: 'Чернетка',
        REGISTRATION: 'Реєстрація',
        RUNNING: 'Активний',
        FINISHED: 'Завершено'
    };
</script>

<svelte:head><title>Мої команди — LvUp</title></svelte:head>

<div style="min-height:100vh; background:#0a0e14; color:#e8edf5; font-family:'Manrope',sans-serif;">
    <Header />

    <div style="display:flex;">
        <Sidebar user={data.user} />

        <main style="flex:1; padding:36px 48px; max-width:1100px;">
            <div style="font-size:12px; color:#3a4a5e; margin-bottom:6px;">
                Кабінет / <span style="color:#6b7a8f;">Мої команди</span>
            </div>
            <h1 style="font-size:22px; font-weight:800; color:#fff; margin-bottom:28px;">Мої команди</h1>

            {#if data.teams.length === 0}
                <!-- Empty state -->
                <div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:80px 40px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; min-height:200px;">
                    <div style="font-size:18px; font-weight:700; color:#3d8ef0; margin-bottom:12px;">
                        Ти ще не належиш до команди
                    </div>
                    <div style="font-size:14px; color:#6b7a8f; max-width:320px; line-height:1.6;">
                        Перейди на сторінку
                        <a href="/tourments" style="color:#3d8ef0; text-decoration:none;">Турніри</a>,
                        вибери один з активних та зареєструй свою команду
                    </div>
                </div>
            {:else}
                <div style="display:flex; flex-direction:column; gap:16px;">
                    {#each data.teams as team}
                        <a href="/my-teams/{team.id}" style="text-decoration:none; display:block;">
                            <div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px; cursor:pointer; transition:border-color 0.15s;"
                                 onmouseenter={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
                                 onmouseleave={(e)=>e.currentTarget.style.borderColor='#1a2535'}>
                                <div style="display:flex; align-items:center; justify-content:space-between; gap:16px;">
                                    <!-- Team info -->
                                    <div style="display:flex; align-items:center; gap:20px; flex:1;">
                                        <div style="width:52px; height:52px; border-radius:12px; background:#1a2d4a; border:1px solid #1e3a5f; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; color:#3d8ef0; flex-shrink:0;">
                                            {team.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:4px;">{team.name}</div>
                                            <div style="font-size:13px; color:#6b7a8f;">{team.tournament.title}</div>
                                        </div>
                                    </div>

                                    <!-- Stats -->
                                    <div style="display:flex; align-items:center; gap:28px;">
                                        <div style="text-align:center;">
                                            <div style="font-size:18px; font-weight:800; color:#fff;">{team.members.length + 1}</div>
                                            <div style="font-size:11px; color:#3a4a5e; text-transform:uppercase; letter-spacing:0.05em;">Учасників</div>
                                        </div>
                                        <div style="text-align:center;">
                                            <div style="font-size:18px; font-weight:800; color:#fff;">{team.submissions.length}</div>
                                            <div style="font-size:11px; color:#3a4a5e; text-transform:uppercase; letter-spacing:0.05em;">Здач</div>
                                        </div>
                                        <div>
											<span style="padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; background:{statusBg[team.status]}; color:{statusColor[team.status]};">
												{statusLabel[team.status]}
											</span>
                                        </div>
                                        <div>
											<span style="padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600; background:#141c28; color:#4a6080;">
												{tournamentStatusLabel[team.tournament.status]}
											</span>
                                        </div>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a4a5e" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                                    </div>
                                </div>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </main>
    </div>

    <Footer />
</div>