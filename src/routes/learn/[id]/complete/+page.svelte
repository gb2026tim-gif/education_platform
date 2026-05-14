<!-- src/routes/learn/[id]/complete/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data }: { data: PageData } = $props();
    const c = $derived(data.course);
    let dlCert = $state(false);
    let dlSum = $state(false);

    async function downloadFile(url: string, filename: string, flag: 'cert' | 'sum') {
        if (flag === 'cert') dlCert = true; else dlSum = true;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Помилка завантаження');
            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (e) { alert('Помилка завантаження'); }
        finally { if (flag === 'cert') dlCert = false; else dlSum = false; }
    }
</script>

<svelte:head><title>Вітаємо! — {c?.title} — LvUp</title></svelte:head>

<style>
.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;display:flex;flex-direction:column;}
.body{display:flex;flex:1;}
.main{flex:1;padding:40px;display:flex;flex-direction:column;align-items:center;max-width:900px;margin:0 auto;width:100%;}

.trophy{font-size:80px;text-align:center;margin-bottom:16px;animation:bounce .7s ease infinite alternate;}
@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-12px)}}
.h1{font-size:34px;font-weight:800;color:var(--text);text-align:center;margin-bottom:6px;}
:global(.light-mode) .h1{color:#0a0e1a;}
.sub{font-size:17px;color:var(--text-muted);text-align:center;margin-bottom:4px;}
.cn{font-size:20px;font-weight:700;color:#3E83FF;text-align:center;margin-bottom:32px;}

/* Stats */
.stats{display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:18px 24px;text-align:center;min-width:110px;}
:global(.light-mode) .stat{background:#fff;border-color:rgba(10,14,26,.08);}
.sn{font-size:26px;font-weight:800;color:#3E83FF;font-family:'JetBrains Mono',monospace;}
.sl{font-size:11px;color:var(--text-muted);margin-top:3px;}

/* Certificate */
.cert{
    width:100%;max-width:700px;
    background:linear-gradient(135deg,#0a1535 0%,#1a3a7a 50%,#0a1535 100%);
    border:2px solid rgba(62,131,255,.4);border-radius:20px;
    padding:48px;text-align:center;position:relative;overflow:hidden;
    margin-bottom:28px;box-shadow:0 20px 60px rgba(0,0,0,.4);
}
.cert::before{content:'';position:absolute;inset:12px;border:1px solid rgba(62,131,255,.15);border-radius:10px;pointer-events:none;}
.cert::after{content:'';position:absolute;top:0;left:50%;transform:translateX(-50%);width:300px;height:300px;background:radial-gradient(circle,rgba(62,131,255,.15),transparent 70%);pointer-events:none;}
.clogo{font-size:26px;font-weight:800;margin-bottom:24px;position:relative;z-index:1;}
.clogo .lv{color:#e6edf3;}.clogo .up{color:#3E83FF;}
.clbl{font-size:12px;letter-spacing:.25em;color:rgba(255,255,255,.45);text-transform:uppercase;margin-bottom:10px;position:relative;z-index:1;}
.chead{font-size:30px;font-weight:800;color:#fff;margin-bottom:24px;position:relative;z-index:1;font-family:'Georgia',serif;}
.cdiv{width:160px;height:1px;background:linear-gradient(90deg,transparent,rgba(62,131,255,.7),transparent);margin:0 auto 24px;position:relative;z-index:1;}
.caw{font-size:14px;color:rgba(255,255,255,.55);margin-bottom:12px;position:relative;z-index:1;}
.cname{font-size:30px;font-weight:700;color:#3E83FF;font-style:italic;margin-bottom:10px;position:relative;z-index:1;}
.cfor{font-size:14px;color:rgba(255,255,255,.55);margin-bottom:14px;position:relative;z-index:1;}
.ccourse{font-size:19px;font-weight:700;color:#fff;border:1px solid rgba(62,131,255,.35);border-radius:10px;padding:12px 24px;display:inline-block;position:relative;z-index:1;}
.cdate{font-size:12px;color:rgba(255,255,255,.35);margin-top:20px;position:relative;z-index:1;}
.cseal{position:absolute;bottom:18px;right:22px;width:60px;height:60px;border:2px solid rgba(62,131,255,.35);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;background:rgba(62,131,255,.1);}

/* Buttons */
.btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;}
.btn{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border-radius:11px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;border:none;transition:background .12s;text-decoration:none;}
.bc1{background:#3E83FF;color:#fff;}
.bc1:hover{background:#2d6fe0;}
.bc1:disabled{opacity:.5;cursor:not-allowed;}
.bc2{background:var(--surface);border:1.5px solid var(--border)!important;color:var(--text);}
.bc2:hover{background:var(--surface-2);}
:global(.light-mode) .bc2{background:#fff;border-color:rgba(10,14,26,.12)!important;color:#0a0e1a;}
.bc3{background:rgba(62,131,255,.1);color:#3E83FF;border:1px solid rgba(62,131,255,.25)!important;}
.bc3:hover{background:rgba(62,131,255,.18);}

/* Next */
.next-h{font-size:19px;font-weight:700;color:var(--text);margin-bottom:16px;text-align:center;}
:global(.light-mode) .next-h{color:#0a0e1a;}
.next-g{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;width:100%;max-width:700px;}
@media(max-width:600px){.next-g{grid-template-columns:1fr;}}
.nc{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px;text-decoration:none;transition:border-color .15s,box-shadow .15s;}
.nc:hover{border-color:rgba(62,131,255,.3);box-shadow:0 4px 16px rgba(0,0,0,.12);}
:global(.light-mode) .nc{background:#fff;border-color:rgba(10,14,26,.08);}
.nc-icon{font-size:26px;margin-bottom:8px;}
.nc-t{font-size:14px;font-weight:700;color:var(--text);}
.nc-s{font-size:12px;color:var(--text-muted);margin-top:3px;}
:global(.light-mode) .nc-t{color:#0a0e1a;}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <div class="trophy">🏆</div>
            <h1 class="h1">Вітаємо!</h1>
            <p class="sub">Ти успішно завершила курс</p>
            <p class="cn">«{c.title}»</p>

            <div class="stats">
                <div class="stat"><div class="sn">{c.modules.length}</div><div class="sl">Модулів</div></div>
                <div class="stat"><div class="sn">{data.totalLessons}</div><div class="sl">Уроків</div></div>
                <div class="stat"><div class="sn">{Math.floor(c.duration/60)}г</div><div class="sl">Матеріалу</div></div>
                <div class="stat"><div class="sn">100%</div><div class="sl">Завершено</div></div>
            </div>

            <!-- Сертифікат -->
            <div class="cert">
                <div class="clogo"><span class="lv">Lv</span><span class="up">Up</span></div>
                <div class="clbl">LvUp Education Platform</div>
                <div class="chead">Certificate of Completion</div>
                <div class="cdiv"></div>
                <div class="caw">Цим засвідчується, що</div>
                <div class="cname">{data.user?.name}</div>
                <div class="cfor">успішно завершила курс</div>
                <div class="ccourse">{c.title}</div>
                <div class="cdate">
                    {new Date().toLocaleDateString('uk-UA',{day:'numeric',month:'long',year:'numeric'})}
                    &nbsp;·&nbsp; LvUp Education Platform
                </div>
                <div class="cseal">🎓</div>
            </div>

            <!-- Buttons -->
            <div class="btns">
                <button class="btn bc1" onclick={() => downloadFile(`/api/courses/${c.id}/certificate`,'certificate.html','cert')} disabled={dlCert}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {dlCert ? 'Генерація...' : 'Завантажити сертифікат'}
                </button>
                <button class="btn bc2" onclick={() => downloadFile(`/api/courses/${c.id}/summary`,`${c.title}-конспект.html`,'sum')} disabled={dlSum}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    {dlSum ? 'Генерація...' : 'Завантажити конспект'}
                </button>
                <a href="/my-courses" class="btn bc3">Мої курси →</a>
            </div>

            <!-- Рекомендації -->
            {#if data.recommended?.length > 0}
                <div class="next-h">Що вивчити далі?</div>
                <div class="next-g">
                    {#each data.recommended as r}
                        <a href="/learn/{r.id}" class="nc">
                            <div class="nc-icon">📚</div>
                            <div class="nc-t">{r.title}</div>
                            <div class="nc-s">{r.level} · {r.isFree ? 'Безкоштовно' : r.price+' грн'}</div>
                        </a>
                    {/each}
                </div>
            {/if}
        </main>
    </div>
    <Footer />
</div>
