<!-- src/routes/my-courses/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data }: { data: PageData } = $props();

    function pct(e: any): number {
        if (!e.totalLessons) return 0;
        return Math.round((e.completedLessons / e.totalLessons) * 100);
    }
</script>

<svelte:head><title>Мої курси — LvUp</title></svelte:head>

<style>
.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;display:flex;flex-direction:column;}
.body{display:flex;flex:1;}
.main{flex:1;padding:32px 40px 64px;max-width:1100px;margin:0 auto;}
.h1{font-size:30px;font-weight:800;color:var(--text);margin-bottom:24px;}
:global(.light-mode) .h1{color:#0a0e1a;}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
@media(max-width:900px){.grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:600px){.grid{grid-template-columns:1fr;}}
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;transition:box-shadow .15s;}
.card:hover{box-shadow:0 6px 24px rgba(0,0,0,.15);}
:global(.light-mode) .card{background:#fff;border-color:rgba(10,14,26,.08);}
.cover{width:100%;height:150px;object-fit:cover;background:linear-gradient(135deg,#0d1b4a,#1a3a7a);display:block;}
.cover img{width:100%;height:100%;object-fit:cover;display:block;}
.body2{padding:14px 16px 16px;flex:1;display:flex;flex-direction:column;gap:8px;}
.title{font-size:15px;font-weight:700;color:var(--text);text-decoration:none;}
:global(.light-mode) .title{color:#0a0e1a;}
.meta{font-size:12px;color:var(--text-muted);}
.bar-bg{height:5px;background:var(--border);border-radius:3px;overflow:hidden;}
:global(.light-mode) .bar-bg{background:rgba(10,14,26,.1);}
.bar{height:100%;background:#3E83FF;border-radius:3px;}
.pct{font-size:12px;color:#3E83FF;font-weight:600;}
.btn{display:block;text-align:center;padding:10px;border-radius:9px;background:#3E83FF;color:#fff;font-size:14px;font-weight:700;text-decoration:none;margin-top:auto;transition:background .12s;}
.btn:hover{background:#2d6fe0;}
.empty{text-align:center;padding:60px;color:var(--text-muted);}
.empty a{color:#3E83FF;text-decoration:none;font-weight:600;}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <h1 class="h1">Мої курси</h1>
            {#if data.enrollments.length === 0}
                <div class="empty">
                    <p>Ти ще не записана на жоден курс.</p>
                    <p><a href="/learn">Переглянути всі курси →</a></p>
                </div>
            {:else}
                <div class="grid">
                    {#each data.enrollments as e}
                        {@const p = pct(e)}
                        <div class="card">
                            <div class="cover">
                                {#if e.course.coverUrl}
                                    <img src={e.course.coverUrl} alt={e.course.title} loading="lazy" />
                                {/if}
                            </div>
                            <div class="body2">
                                <a href="/learn/{e.course.id}" class="title">{e.course.title}</a>
                                <div class="meta">{e.course._count?.modules ?? 0} модулів · {e.totalLessons} уроків</div>
                                <div class="bar-bg"><div class="bar" style="width:{p}%"></div></div>
                                <div class="pct">{p}% завершено</div>
                                <a href="/learn/{e.course.id}" class="btn">
                                    {p > 0 ? 'Продовжити →' : 'Почати →'}
                                </a>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </main>
    </div>
    <Footer />
</div>
