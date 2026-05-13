<!-- src/routes/leaderboard/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data }: { data: PageData } = $props();

    const scored   = $derived((data.leaderboard as any[]).filter(t => t.average > 0));
    const unscored = $derived((data.leaderboard as any[]).filter(t => t.average === 0));
    let expanded = $state<Record<string, boolean>>({});
    function toggle(id: string) { expanded[id] = !expanded[id]; }

    function medal(r: number) { return r===1?"🥇":r===2?"🥈":r===3?"🥉":`${r}`; }
    function scoreColor(v: number) {
        if (v >= 85) return "#4ADE80";
        if (v >= 70) return "#3E83FF";
        if (v >= 55) return "#FB923C";
        return "#f85149";
    }
    function scoreLabel(v: number) {
        if (v >= 85) return "Відмінно";
        if (v >= 70) return "Добре";
        if (v >= 55) return "Задовільно";
        return "Слабко";
    }
    const crits = [
        { key: "backendCode",           label: "Backend (код)" },
        { key: "databaseStructure",     label: "БД (структура)" },
        { key: "frontendCode",          label: "Frontend (код)" },
        { key: "backendFunctionality",  label: "Backend (функціонал)" },
        { key: "databaseFunctionality", label: "БД (функціонал)" },
        { key: "frontendFunctionality", label: "Frontend (функціонал)" },
    ];
</script>

<svelte:head><title>Рейтинг — LvUp</title></svelte:head>

<style>
.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;display:flex;flex-direction:column;}
.body{display:flex;flex:1;}
.main{flex:1;padding:32px 40px 64px;max-width:1000px;margin:0 auto;width:100%;}
.h1{font-size:30px;font-weight:800;color:var(--text);margin-bottom:4px;}
:global(.light-mode) .h1{color:#0a0e1a;}
.sub{font-size:14px;color:var(--text-muted);margin-bottom:28px;}

/* Tabs */
.tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;}
.tab{padding:8px 18px;border-radius:9px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);font-size:13px;font-weight:600;text-decoration:none;transition:all .12s;}
.tab:hover{background:var(--surface-2);color:var(--text);}
.tab.active{background:#3E83FF;color:#fff;border-color:#3E83FF;}
:global(.light-mode) .tab{background:#fff;border-color:rgba(10,14,26,.1);color:rgba(10,14,26,.6);}

/* Podium */
.podium{display:flex;align-items:flex-end;justify-content:center;gap:14px;margin-bottom:40px;}
.pw{display:flex;flex-direction:column;align-items:center;}
.pc{border-radius:16px 16px 0 0;padding:22px 18px;text-align:center;width:195px;position:relative;overflow:hidden;}
.pc.g{background:linear-gradient(135deg,rgba(255,215,0,.12),rgba(255,180,0,.04));border:1px solid rgba(255,215,0,.4);border-bottom:none;}
.pc.s{background:linear-gradient(135deg,rgba(192,192,192,.1),rgba(192,192,192,.03));border:1px solid rgba(192,192,192,.3);border-bottom:none;}
.pc.b{background:linear-gradient(135deg,rgba(205,127,50,.1),rgba(205,127,50,.03));border:1px solid rgba(205,127,50,.25);border-bottom:none;}
:global(.light-mode) .pc.g{background:rgba(255,215,0,.07);}
:global(.light-mode) .pc.s{background:rgba(192,192,192,.07);}
:global(.light-mode) .pc.b{background:rgba(205,127,50,.07);}
.pm{font-size:32px;margin-bottom:8px;}
.pn{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px;}
:global(.light-mode) .pn{color:#0a0e1a;}
.pc2{font-size:12px;color:var(--text-muted);margin-bottom:10px;}
.ps{font-size:28px;font-weight:800;font-family:'JetBrains Mono',monospace;}
.g .ps{color:#FFD700;} .s .ps{color:#C0C0C0;} .b .ps{color:#CD7F32;}
.pp{font-size:11px;color:var(--text-dim);margin-top:3px;}
.pb{width:195px;display:flex;align-items:center;justify-content:center;border-radius:0 0 12px 12px;font-size:16px;font-weight:800;}
.pb-g{height:88px;background:rgba(255,215,0,.1);border:1px solid rgba(255,215,0,.3);color:#FFD700;}
.pb-s{height:64px;background:rgba(192,192,192,.08);border:1px solid rgba(192,192,192,.2);color:#C0C0C0;}
.pb-b{height:48px;background:rgba(205,127,50,.07);border:1px solid rgba(205,127,50,.18);color:#CD7F32;}

/* Section header */
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.st{font-size:17px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px;}
:global(.light-mode) .st{color:#0a0e1a;}
.sb{width:4px;height:17px;background:#3E83FF;border-radius:3px;}
.sc{font-size:13px;color:var(--text-muted);}

/* Rank list */
.rl{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-bottom:28px;}
:global(.light-mode) .rl{background:#fff;border-color:rgba(10,14,26,.08);}
.rr{border-bottom:1px solid var(--border);}
:global(.light-mode) .rr{border-color:rgba(10,14,26,.07);}
.rr:last-child{border-bottom:none;}
.rm{display:flex;align-items:center;gap:14px;padding:14px 18px;cursor:pointer;transition:background .12s;}
.rm:hover{background:rgba(255,255,255,.03);}
:global(.light-mode) .rm:hover{background:#f8faff;}
.rnum{width:36px;text-align:center;font-size:18px;font-weight:800;flex-shrink:0;}
.ra{width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#1e3a7a,#1a50a0);border:1px solid rgba(62,131,255,.25);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#5aaeff;flex-shrink:0;}
.ri{flex:1;min-width:0;}
.rn{font-size:14px;font-weight:700;color:var(--text);}
:global(.light-mode) .rn{color:#0a0e1a;}
.rm2{font-size:12px;color:var(--text-muted);margin-top:2px;}
.rba{width:130px;flex-shrink:0;}
.rbb{height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:3px;}
:global(.light-mode) .rbb{background:rgba(10,14,26,.1);}
.rbf{height:100%;border-radius:3px;}
.rbp{font-size:10px;color:var(--text-dim);text-align:right;}
.rs{text-align:right;flex-shrink:0;}
.rsn{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace;}
.rbadge{display:inline-flex;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;margin-top:3px;}
.chev{color:var(--text-dim);transition:transform .2s;margin-left:6px;flex-shrink:0;}
.chev.op{transform:rotate(180deg);}

/* Detail */
.rd{padding:16px 18px 20px 78px;border-top:1px solid var(--border);background:rgba(0,0,0,.12);}
:global(.light-mode) .rd{background:#f8faff;border-color:rgba(10,14,26,.07);}
.dt{font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;}
:global(.light-mode) .dt{color:rgba(10,14,26,.45);}
.cg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
@media(max-width:700px){.cg{grid-template-columns:repeat(2,1fr);}}
.ci{background:var(--surface);border:1px solid var(--border);border-radius:9px;padding:10px 12px;}
:global(.light-mode) .ci{background:#fff;border-color:rgba(10,14,26,.08);}
.cl{font-size:11px;color:var(--text-muted);margin-bottom:5px;}
:global(.light-mode) .cl{color:rgba(10,14,26,.5);}
.cb{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:5px;}
:global(.light-mode) .cb{background:rgba(10,14,26,.1);}
.cbf{height:100%;border-radius:2px;}
.cv{font-size:17px;font-weight:800;font-family:'JetBrains Mono',monospace;}

/* Unscored */
.ul{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
:global(.light-mode) .ul{background:#fff;border-color:rgba(10,14,26,.08);}
.ur{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid var(--border);}
:global(.light-mode) .ur{border-color:rgba(10,14,26,.07);}
.ur:last-child{border-bottom:none;}
.wb{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(100,116,139,.12);color:#64748B;margin-left:auto;}

.empty{text-align:center;padding:60px;color:var(--text-dim);}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user ?? null} />
        <main class="main">
            <h1 class="h1">🏆 Рейтинг команд</h1>
            <p class="sub">Підсумкові результати оцінювання журі</p>

            {#if data.tournaments.length > 1}
                <div class="tabs">
                    {#each data.tournaments as t}
                        <a href="/leaderboard?tournamentId={t.id}" class="tab"
                           class:active={t.id === data.tournamentId}>{t.title}</a>
                    {/each}
                </div>
            {/if}

            {#if data.leaderboard.length === 0}
                <div class="empty"><div style="font-size:48px;margin-bottom:12px;">📊</div><p>Оцінок поки немає</p></div>
            {:else}

                <!-- Podium -->
                {#if scored.length >= 3}
                    <div class="podium">
                        <div class="pw">
                            <div class="pc s">
                                <div class="pm">🥈</div>
                                <div class="pn">{scored[1].teamName}</div>
                                {#if scored[1].city}<div class="pc2">📍 {scored[1].city}</div>{/if}
                                <div class="ps">{scored[1].average.toFixed(1)}</div>
                                <div class="pp">середній бал</div>
                            </div>
                            <div class="pb pb-s">2</div>
                        </div>
                        <div class="pw">
                            <div class="pc g">
                                <div class="pm">🏆</div>
                                <div class="pn">{scored[0].teamName}</div>
                                {#if scored[0].city}<div class="pc2">📍 {scored[0].city}</div>{/if}
                                <div class="ps">{scored[0].average.toFixed(1)}</div>
                                <div class="pp">середній бал</div>
                            </div>
                            <div class="pb pb-g">1</div>
                        </div>
                        <div class="pw">
                            <div class="pc b">
                                <div class="pm">🥉</div>
                                <div class="pn">{scored[2].teamName}</div>
                                {#if scored[2].city}<div class="pc2">📍 {scored[2].city}</div>{/if}
                                <div class="ps">{scored[2].average.toFixed(1)}</div>
                                <div class="pp">середній бал</div>
                            </div>
                            <div class="pb pb-b">3</div>
                        </div>
                    </div>
                {/if}

                <!-- Rank list -->
                {#if scored.length > 0}
                    <div class="sh">
                        <div class="st"><span class="sb"></span>Повний рейтинг</div>
                        <div class="sc">{scored.length} команд оцінено</div>
                    </div>
                    <div class="rl">
                        {#each scored as team, i}
                            {@const col = scoreColor(team.average)}
                            {@const isOpen = expanded[team.teamId]}
                            <div class="rr">
                                <div class="rm" onclick={() => toggle(team.teamId)}
                                     role="button" tabindex="0"
                                     onkeydown={(e) => e.key==='Enter' && toggle(team.teamId)}>
                                    <div class="rnum">
                                        {#if i < 3}<span>{medal(i+1)}</span>
                                        {:else}<span style="color:var(--text-dim);font-size:14px;">{i+1}</span>{/if}
                                    </div>
                                    <div class="ra">{team.teamName[0].toUpperCase()}</div>
                                    <div class="ri">
                                        <div class="rn">{team.teamName}</div>
                                        <div class="rm2">
                                            {#if team.city}📍 {team.city} · {/if}
                                            {team.scoresCount} оцінок
                                        </div>
                                    </div>
                                    <div class="rba">
                                        <div class="rbb"><div class="rbf" style="width:{team.average}%;background:{col};"></div></div>
                                        <div class="rbp">{team.average.toFixed(0)}/100</div>
                                    </div>
                                    <div class="rs">
                                        <div class="rsn" style="color:{col};">{team.average.toFixed(2)}</div>
                                        <div><span class="rbadge" style="background:{col}22;color:{col};">{scoreLabel(team.average)}</span></div>
                                    </div>
                                    <div class="chev" class:op={isOpen}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                </div>

                                {#if isOpen && team.criteriaScores}
                                    <div class="rd">
                                        <div class="dt">Оцінки за критеріями</div>
                                        <div class="cg">
                                            {#each crits as crit}
                                                {@const val = team.criteriaScores[crit.key] ?? 0}
                                                {@const cc = scoreColor(val)}
                                                <div class="ci">
                                                    <div class="cl">{crit.label}</div>
                                                    <div class="cb"><div class="cbf" style="width:{val}%;background:{cc};"></div></div>
                                                    <div class="cv" style="color:{cc};">{val.toFixed(0)}</div>
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                {/if}

                <!-- Unscored -->
                {#if unscored.length > 0}
                    <div class="sh">
                        <div class="st"><span class="sb"></span>Очікують оцінювання</div>
                        <div class="sc">{unscored.length} команд</div>
                    </div>
                    <div class="ul">
                        {#each unscored as team}
                            <div class="ur">
                                <div class="ra">{team.teamName[0].toUpperCase()}</div>
                                <div class="ri">
                                    <div class="rn">{team.teamName}</div>
                                    {#if team.city}<div class="rm2">📍 {team.city}</div>{/if}
                                </div>
                                <span class="wb">⏳ Очікує</span>
                            </div>
                        {/each}
                    </div>
                {/if}
            {/if}
        </main>
    </div>
    <Footer />
</div>
