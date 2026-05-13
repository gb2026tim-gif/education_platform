<!-- src/routes/learn/[id]/[lessonId]/+page.svelte -->
<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data }: { data: PageData } = $props();
    const lesson = $derived(data.lesson);
    const course = $derived(data.course);
    const isCompleted = $derived(data.isCompleted);
    const isLastLesson = $derived(!data.nextLesson);
    let marking = $state(false);

    // ── Quiz ─────────────────────────────────────────────────────
    const questions = $derived(parseQuestions(lesson?.content ?? ''));
    let answers = $state<Record<number, number>>({});
    let submitted = $state(false);

    function parseQuestions(content: string) {
        const qs: { text: string; options: { text: string; correct: boolean }[] }[] = [];
        const lines = content.split('\n');
        let cur: typeof qs[0] | null = null;
        for (const line of lines) {
            const qm = line.match(/^\*\*(\d+)\.\s+(.+?)\*\*$/);
            if (qm) { if (cur) qs.push(cur); cur = { text: qm[2] ?? '', options: [] }; continue; }
            if (cur) {
                const om = line.match(/^-\s+[a-d]\)\s+(.+?)(\s+✅)?$/);
                if (om) cur.options.push({ text: om[1] ?? '', correct: !!om[2] });
            }
        }
        if (cur && cur.options.length > 0) qs.push(cur);
        return qs;
    }

    function quizScore() {
        return questions.filter((q, i) => answers[i] !== undefined && q.options[answers[i]]?.correct).length;
    }

    // ── Render markdown-like content ──────────────────────────────
    function render(content: string): string {
        return content
            // Remove quiz block entirely (rendered separately)
            .replace(/##\s+Тест[\s\S]*$/m, '')
            .replace(/# Тест[\s\S]*$/m, '')
            // Remove download links from content
            .replace(/\[📥.*?\]\(.*?\)/g, '')
            .replace(/\*\*\d+\.\s+.+?\*\*\n(- [a-d]\).+(\n|$))*/g, '')
            .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/^✅ (.+)$/gm, '<div class="ck-item">✅ $1</div>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n\n/g, '<br><br>');
    }

    function fmt(min: number) {
        return min < 60 ? `${min} хв` : `${Math.floor(min/60)}г ${min%60}хв`;
    }
</script>

<svelte:head><title>{lesson?.title} — {course?.title} — LvUp</title></svelte:head>

<style>
.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;display:flex;flex-direction:column;}
.body{display:flex;flex:1;}
.main{flex:1;overflow-y:auto;}
.layout{display:grid;grid-template-columns:1fr 290px;min-height:100%;}
@media(max-width:960px){.layout{grid-template-columns:1fr;}}

/* Video area */
.va{padding:24px 32px;display:flex;flex-direction:column;gap:18px;}
.bc{font-size:13px;color:var(--text-dim);display:flex;gap:4px;flex-wrap:wrap;}
.bc a{color:var(--text-muted);text-decoration:none;}
.bc a:hover{color:#3E83FF;}
:global(.light-mode) .bc a{color:rgba(10,14,26,.55);}

.vw{position:relative;width:100%;padding-top:56.25%;background:#000;border-radius:14px;overflow:hidden;}
.vw iframe{position:absolute;inset:0;width:100%;height:100%;border:none;}
.vp{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0d1b4a,#1a3a7a);color:rgba(255,255,255,.3);}

.lt{font-size:23px;font-weight:800;color:var(--text);}
:global(.light-mode) .lt{color:#0a0e1a;}
.lm{font-size:13px;color:var(--text-muted);display:flex;gap:14px;flex-wrap:wrap;}
:global(.light-mode) .lm{color:rgba(10,14,26,.55);}

/* Content */
.lc{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:22px 26px;line-height:1.8;color:var(--text-muted);font-size:14px;}
:global(.light-mode) .lc{background:#fff;border-color:rgba(10,14,26,.08);color:rgba(10,14,26,.7);}
.lc :global(h1){font-size:19px;font-weight:700;color:var(--text);margin:14px 0 8px;}
.lc :global(h2){font-size:17px;font-weight:700;color:var(--text);margin:12px 0 7px;}
.lc :global(h3){font-size:15px;font-weight:600;color:var(--text);margin:10px 0 6px;}
.lc :global(pre){background:rgba(0,0,0,.35);border-radius:9px;padding:14px;overflow-x:auto;margin:10px 0;}
:global(.light-mode) .lc :global(pre){background:#f0f4ff;}
.lc :global(code){font-family:'JetBrains Mono',monospace;font-size:12.5px;color:#e6edf3;}
:global(.light-mode) .lc :global(code){color:#1a3a7a;}
.lc :global(strong){color:var(--text);font-weight:700;}
:global(.light-mode) .lc :global(strong){color:#0a0e1a;}
.lc :global(a){color:#3E83FF;}
.lc :global(.ck-item){margin:3px 0;}
:global(.light-mode) .lc :global(h1),:global(.light-mode) .lc :global(h2),:global(.light-mode) .lc :global(h3){color:#0a0e1a;}

/* Quiz */
.quiz{background:var(--surface);border:2px solid rgba(62,131,255,.2);border-radius:12px;padding:22px;}
:global(.light-mode) .quiz{background:#fff;}
.quiz-h{font-size:16px;font-weight:700;color:var(--text);margin-bottom:18px;display:flex;align-items:center;gap:8px;}
:global(.light-mode) .quiz-h{color:#0a0e1a;}
.q{margin-bottom:20px;}
.qt{font-size:14px;font-weight:600;color:var(--text);margin-bottom:10px;}
:global(.light-mode) .qt{color:#0a0e1a;}
.opts{display:flex;flex-direction:column;gap:7px;}
.opt{display:flex;align-items:center;gap:9px;padding:9px 13px;border-radius:8px;border:1.5px solid var(--border);cursor:pointer;font-size:13px;color:var(--text);transition:border-color .12s,background .12s;}
.opt:hover:not(.dis){border-color:rgba(62,131,255,.4);background:rgba(62,131,255,.05);}
.opt.sel{border-color:#3E83FF;background:rgba(62,131,255,.08);}
.opt.ok{border-color:#4ADE80!important;background:rgba(74,222,128,.1)!important;color:#4ADE80!important;}
.opt.ng{border-color:#f85149!important;background:rgba(248,81,73,.08)!important;color:#f85149!important;}
.opt.dis{cursor:default;}
:global(.light-mode) .opt{border-color:rgba(10,14,26,.1);color:#0a0e1a;}
.radio{width:17px;height:17px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.sel .radio{border-color:#3E83FF;background:#3E83FF;}
.sel .radio::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff;display:block;}
.ok .radio{border-color:#4ADE80;background:#4ADE80;}
.ng .radio{border-color:#f85149;background:#f85149;}

.q-submit{padding:10px 24px;border-radius:8px;border:none;background:#3E83FF;color:#fff;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:6px;}
.q-submit:disabled{opacity:.4;cursor:not-allowed;}
.q-result{margin-top:14px;padding:12px 16px;border-radius:9px;font-size:14px;font-weight:600;text-align:center;}
.rg{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.25);color:#4ADE80;}
.ro{background:rgba(251,146,60,.1);border:1px solid rgba(251,146,60,.2);color:#FB923C;}
.rb{background:rgba(248,81,73,.08);border:1px solid rgba(248,81,73,.2);color:#f85149;}
.retry{margin-top:8px;padding:7px 18px;border-radius:7px;border:1px solid var(--border);background:none;color:var(--text-muted);font-size:13px;cursor:pointer;font-family:inherit;}
:global(.light-mode) .retry{border-color:rgba(10,14,26,.1);}

/* Nav */
.nav{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.bn{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;transition:background .12s;}
.bp{background:var(--surface);border:1px solid var(--border);color:var(--text-muted);}
.bp:hover{background:var(--surface-2);}
:global(.light-mode) .bp{background:#f0f4ff;border-color:rgba(10,14,26,.1);color:rgba(10,14,26,.6);}
.bx{background:#3E83FF;color:#fff;}
.bx:hover{background:#2d6fe0;}
.bc2{background:linear-gradient(135deg,#1a3a7a,#3E83FF);color:#fff;padding:12px 22px;font-size:15px;}
.bc2:hover{opacity:.9;}
.btc{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:9px;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:inherit;}
.btc.done{background:rgba(74,222,128,.12);color:#4ADE80;border:1px solid rgba(74,222,128,.25);}
.btc.todo{background:#3E83FF;color:#fff;}
.btc:disabled{opacity:.4;cursor:not-allowed;}

/* Outline */
.ol{border-left:1px solid var(--border);background:var(--surface);overflow-y:auto;position:sticky;top:0;max-height:100vh;}
:global(.light-mode) .ol{background:#f8faff;border-color:rgba(10,14,26,.08);}
.ol-h{font-size:14px;font-weight:700;color:var(--text);padding:16px 16px 10px;border-bottom:1px solid var(--border);}
:global(.light-mode) .ol-h{color:#0a0e1a;border-color:rgba(10,14,26,.08);}
.om{padding:8px 14px 4px;}
.om-t{font-size:10px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;}
:global(.light-mode) .om-t{color:rgba(10,14,26,.4);}
.ol-l{display:flex;align-items:center;gap:7px;padding:6px 9px;border-radius:7px;font-size:12px;color:var(--text-muted);text-decoration:none;transition:background .12s;}
.ol-l:hover{background:var(--surface-2);}
.ol-l.cur{background:rgba(62,131,255,.12);color:#3E83FF;font-weight:600;}
:global(.light-mode) .ol-l:hover{background:#eef2ff;}
:global(.light-mode) .ol-l.cur{color:#2563eb;}
.lch{width:15px;height:15px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.lch.d{background:rgba(74,222,128,.2);color:#4ADE80;}
.lch.c{background:rgba(62,131,255,.2);color:#3E83FF;}
.lch.t{border:1.5px solid var(--border);}
:global(.light-mode) .lch.t{border-color:rgba(10,14,26,.2);}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <div class="layout">
                <!-- LEFT -->
                <div class="va">
                    <div class="bc">
                        <a href="/learn">Курси</a><span>/</span>
                        <a href="/learn/{course.id}">{course.title}</a><span>/</span>
                        <span style="color:#3E83FF;">{lesson.title}</span>
                    </div>

                    <div class="vw">
                        {#if lesson.videoUrl}
                            {@const em = lesson.videoUrl.replace('watch?v=','embed/').replace('youtu.be/','youtube.com/embed/')}
                            <iframe src={em} title={lesson.title} allowfullscreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                        {:else}
                            <div class="vp"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
                        {/if}
                    </div>

                    <div class="lt">{lesson.title}</div>
                    <div class="lm">
                        <span>⏱ {fmt(lesson.duration)}</span>
                        <span>{course.title}</span>
                        {#if lesson.isFree}<span style="color:#4ADE80;">Безкоштовний</span>{/if}
                    </div>

                    {#if lesson.content}
                        {@const rendered = render(lesson.content).trim()}
                        {#if rendered && rendered !== "<br><br>" && rendered.length > 10}
                            <div class="lc">{@html rendered}</div>
                        {/if}
                    {/if}

                    <!-- Quiz -->
                    {#if questions.length > 0}
                        <div class="quiz">
                            <div class="quiz-h">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                Тест для перевірки знань ({questions.length} питань)
                            </div>
                            {#each questions as q, qi}
                                <div class="q">
                                    <div class="qt">{qi+1}. {q.text}</div>
                                    <div class="opts">
                                        {#each q.options as opt, oi}
                                            {@const sel = answers[qi] === oi}
                                            {@const show = submitted}
                                            <label class="opt"
                                                class:sel={sel && !show}
                                                class:ok={show && opt.correct}
                                                class:ng={show && sel && !opt.correct}
                                                class:dis={show}>
                                                <div class="radio"></div>
                                                <input type="radio" style="display:none"
                                                    disabled={show}
                                                    onchange={() => answers[qi] = oi} />
                                                {opt.text}
                                                {#if show}{opt.correct ? ' ✅' : sel ? ' ❌' : ''}{/if}
                                            </label>
                                        {/each}
                                    </div>
                                </div>
                            {/each}
                            {#if !submitted}
                                <button class="q-submit" onclick={() => submitted=true}
                                    disabled={Object.keys(answers).length < questions.length}>
                                    Перевірити
                                </button>
                            {:else}
                                {@const sc = quizScore()}
                                {@const pct = Math.round(sc/questions.length*100)}
                                <div class="q-result" class:rg={pct>=80} class:ro={pct>=50&&pct<80} class:rb={pct<50}>
                                    {pct>=80?'🎉 Відмінно!':pct>=50?'👍 Непогано!':'📚 Повторіть матеріал'}
                                    {sc}/{questions.length} ({pct}%)
                                </div>
                                <button class="retry" onclick={() => {submitted=false;answers={};}}>Спробувати ще раз</button>
                            {/if}
                        </div>
                    {/if}

                    <!-- Nav -->
                    <div class="nav">
                        {#if data.prevLesson}
                            <a href="/learn/{course.id}/{data.prevLesson.id}" class="bn bp">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                                Попередній
                            </a>
                        {/if}

                        {#if data.enrollment}
                            {#if isCompleted && isLastLesson}
                                <a href="/learn/{course.id}/complete" class="bn bc2">
                                    🎓 Отримати сертифікат
                                </a>
                            {:else}
                                <form method="POST" action="?/toggleComplete"
                                    use:enhance={() => {marking=true; return async({update})=>{await update();marking=false;}}}>
                                    <button type="submit" class="btc" class:done={isCompleted} class:todo={!isCompleted} disabled={marking}>
                                        {#if isCompleted}
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                            Завершено
                                        {:else}
                                            Позначити завершеним
                                        {/if}
                                    </button>
                                </form>
                            {/if}
                        {/if}

                        {#if data.nextLesson}
                            <a href="/learn/{course.id}/{data.nextLesson.id}" class="bn bx">
                                Наступний
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </a>
                        {/if}
                    </div>
                </div>

                <!-- RIGHT: outline -->
                <div class="ol">
                    <div class="ol-h">Програма курсу</div>
                    {#each course.modules as mod}
                        <div class="om">
                            <div class="om-t">{mod.title}</div>
                            {#each mod.lessons as l}
                                {@const cur = l.id === lesson.id}
                                {@const done = data.progress?.[l.id]}
                                <a href="/learn/{course.id}/{l.id}" class="ol-l" class:cur>
                                    <div class="lch" class:d={done} class:c={cur&&!done} class:t={!done&&!cur}>
                                        {#if done}<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                                        {:else if cur}<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polygon points="5 3 19 12 5 21 5 3"/></svg>{/if}
                                    </div>
                                    <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;">{l.title}</span>
                                    <span style="font-size:10px;opacity:.5;flex-shrink:0;">{l.duration}хв</span>
                                </a>
                            {/each}
                        </div>
                    {/each}
                </div>
            </div>
        </main>
    </div>
    <Footer />
</div>
