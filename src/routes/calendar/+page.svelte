<!-- src/routes/calendar/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data }: { data: PageData } = $props();

    const today = new Date();
    let viewYear  = $state(today.getFullYear());
    let viewMonth = $state(today.getMonth());
    let selectedDay = $state<string | null>(null);
    let activeFilter = $state<string>('all');

    // Static type filters
    const typeFilters = [
        { key: 'all',          label: 'Всі',          color: '#3E83FF', icon: '🗓' },
        { key: 'registration', label: 'Реєстрація',   color: '#3E83FF', icon: '📋' },
        { key: 'deadline',     label: 'Дедлайни',     color: '#f85149', icon: '⏰' },
        { key: 'my-deadline',  label: 'Мої події',    color: '#A855F7', icon: '⭐' },
    ];

    // Tournament filters — dynamic from data
    const tournamentFilters = $derived(
        (data.tournaments as any[]).map((t: any) => ({
            key: `tournament:${t.id}`,
            label: t.title,
            color: t.status === 'RUNNING' ? '#4ADE80' : t.status === 'REGISTRATION' ? '#3E83FF' : '#64748B',
            icon: '🏆',
            id: t.id,
        }))
    );

    // Реактивний відфільтрований масив — перераховується при зміні activeFilter
    const allFiltered = $derived((() => {
        const evs = data.events as any[];
        if (activeFilter === 'all') return evs;
        if (activeFilter.startsWith('tournament:')) {
            const tid = activeFilter.replace('tournament:', '');
            return evs.filter((e: any) => e.tournamentId === tid);
        }
        return evs.filter((e: any) => e.type === activeFilter);
    })());

    function filteredEvents(evs: any[]) {
        if (activeFilter === 'all') return evs;
        if (activeFilter.startsWith('tournament:')) {
            const tid = activeFilter.replace('tournament:', '');
            return evs.filter((e: any) => e.tournamentId === tid);
        }
        return evs.filter((e: any) => e.type === activeFilter);
    }

    const MONTHS = ["Січень","Лютий","Березень","Квітень","Травень","Червень",
                    "Липень","Серпень","Вересень","Жовтень","Листопад","Грудень"];
    const DAYS_SHORT = ["Пн","Вт","Ср","Чт","Пт","Сб","Нд"];

    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

    const calDays = $derived((() => {
        const first = new Date(viewYear, viewMonth, 1);
        const last  = new Date(viewYear, viewMonth + 1, 0);
        let dow = first.getDay(); dow = dow === 0 ? 6 : dow - 1;
        const cells: (number | null)[] = [];
        for (let i = 0; i < dow; i++) cells.push(null);
        for (let d = 1; d <= last.getDate(); d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    })());

    function dayStr(d: number) {
        return `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    }
    function eventsForDay(d: number) {
        const ds = dayStr(d);
        return allFiltered.filter((e: any) => e.date === ds);
    }
    const selectedEvents = $derived(
        selectedDay ? allFiltered.filter((e: any) => e.date === selectedDay) : []
    );

    // Upcoming: next 45 days
    const upcoming = $derived((() => {
        const now = new Date(); now.setHours(0,0,0,0);
        const limit = new Date(now.getTime() + 45*24*3600000);
        return allFiltered
            .filter((e:any) => { const d=new Date(e.date); return d>=now && d<=limit; })
            .sort((a:any,b:any) => a.date.localeCompare(b.date));
    })());

    // Group upcoming by date
    const upcomingGrouped = $derived((() => {
        const groups: Record<string, any[]> = {};
        for (const ev of upcoming) {
            if (!groups[ev.date]) groups[ev.date] = [];
            groups[ev.date].push(ev);
        }
        return Object.entries(groups).slice(0, 8);
    })());

    function prevMonth() {
        if (viewMonth === 0) { viewMonth = 11; viewYear--; } else viewMonth--;
        selectedDay = null;
    }
    function nextMonth() {
        if (viewMonth === 11) { viewMonth = 0; viewYear++; } else viewMonth++;
        selectedDay = null;
    }
    function goToday() {
        viewYear = today.getFullYear(); viewMonth = today.getMonth(); selectedDay = todayStr;
    }

    function isToday(d: number) { return dayStr(d) === todayStr; }
    function isPast(d: number) { return new Date(dayStr(d)) < new Date(todayStr); }

    function fmtDate(s: string) {
        return new Date(s).toLocaleDateString("uk-UA",{day:"numeric",month:"long"});
    }
    function fmtFull(s: string) {
        return new Date(s).toLocaleDateString("uk-UA",{day:"numeric",month:"long",year:"numeric"});
    }
    function daysUntil(s: string): number {
        const diff = new Date(s).getTime() - new Date(todayStr).getTime();
        return Math.round(diff / 86400000);
    }

    const typeConfig: Record<string,{label:string;icon:string;color:string}> = {
        "registration": { label:"Реєстрація",        icon:"📋", color:"#3E83FF" },
        "reg-end":      { label:"Кінець реєстрації", icon:"🔒", color:"#FB923C" },
        "task-start":   { label:"Старт турніру",     icon:"🚀", color:"#4ADE80" },
        "deadline":     { label:"Здача проєктів",    icon:"⏰", color:"#f85149" },
        "my-deadline":  { label:"Мій дедлайн",       icon:"⭐", color:"#A855F7" },
        "course":       { label:"Курс",              icon:"📚", color:"#06B6D4" },
    };

    function cfg(type: string) {
        return typeConfig[type] ?? { label: type, icon: "📌", color: "#64748B" };
    }

    const evArr = $derived(data.events as any[]);
</script>

<svelte:head><title>Календар — LvUp</title></svelte:head>

<style>
/* ── Base ── */
.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;display:flex;flex-direction:column;}
.body{display:flex;flex:1;}
.main{flex:1;padding:28px 32px 64px;max-width:1280px;margin:0 auto;width:100%;box-sizing:border-box;}

/* ── Page header ── */
.page-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;flex-wrap:wrap;gap:12px;}
.h1{font-size:28px;font-weight:800;color:var(--text);margin:0;}
:global(.light-mode) .h1{color:#0a0e1a;}
.today-btn{padding:9px 22px;border-radius:10px;border:1px solid rgba(62,131,255,.35);background:rgba(62,131,255,.08);color:#3E83FF;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .12s;}
.today-btn:hover{background:#3E83FF;color:#fff;}

/* ── Stats strip ── */
.stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px;}
@media(max-width:700px){.stats-strip{grid-template-columns:repeat(2,1fr);}}
.stat-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:16px 18px;display:flex;align-items:center;gap:14px;}
:global(.light-mode) .stat-box{background:#fff;border-color:rgba(10,14,26,.08);}
.stat-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.stat-num{font-size:24px;font-weight:800;font-family:'JetBrains Mono',monospace;line-height:1;}
.stat-lbl{font-size:12px;color:var(--text-muted);margin-top:3px;}
:global(.light-mode) .stat-lbl{color:rgba(10,14,26,.5);}

/* ── Layout ── */
.layout{display:grid;grid-template-columns:1fr 360px;gap:20px;align-items:start;}
@media(max-width:1060px){.layout{grid-template-columns:1fr;}}

/* ── Calendar card ── */
.cal-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;}
:global(.light-mode) .cal-card{background:#fff;border-color:rgba(10,14,26,.08);box-shadow:0 2px 14px rgba(0,0,0,.05);}

.cal-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border);}
:global(.light-mode) .cal-nav{border-color:rgba(10,14,26,.08);}
.nav-btn{width:38px;height:38px;border-radius:10px;border:1px solid var(--border);background:transparent;color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .12s;}
.nav-btn:hover{background:#3E83FF;color:#fff;border-color:#3E83FF;}
:global(.light-mode) .nav-btn{border-color:rgba(10,14,26,.12);color:#0a0e1a;}
.month-lbl{font-size:18px;font-weight:700;color:var(--text);}
:global(.light-mode) .month-lbl{color:#0a0e1a;}

.day-names{display:grid;grid-template-columns:repeat(7,1fr);padding:10px 14px 0;}
.dn{text-align:center;font-size:12px;font-weight:700;letter-spacing:.06em;color:var(--text-dim);padding:7px 0;}
:global(.light-mode) .dn{color:rgba(10,14,26,.35);}

.cells{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;padding:6px 14px 14px;}
.cell{min-height:78px;border-radius:11px;padding:8px 7px;cursor:pointer;transition:background .12s;display:flex;flex-direction:column;position:relative;}
.cell:hover:not(.empty){background:rgba(62,131,255,.07);}
.cell.empty{cursor:default;pointer-events:none;}
.cell.today{background:rgba(62,131,255,.12);border:1.5px solid rgba(62,131,255,.4);}
.cell.selected{background:rgba(62,131,255,.16);border:1.5px solid #3E83FF;}
.cell.past .dnum{opacity:.38;}
:global(.light-mode) .cell:hover:not(.empty){background:#eef4ff;}
:global(.light-mode) .cell.today{background:rgba(62,131,255,.08);}
:global(.light-mode) .cell.selected{background:rgba(62,131,255,.1);}

.dnum{font-size:13px;font-weight:600;color:var(--text);width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:50%;margin-bottom:5px;flex-shrink:0;}
:global(.light-mode) .dnum{color:#0a0e1a;}
.cell.today .dnum{background:#3E83FF;color:#fff;font-weight:800;}

.dots{display:flex;flex-wrap:wrap;gap:3px;}
.filter-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.f-btn{padding:7px 16px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text-muted);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .12s;display:flex;align-items:center;gap:6px;}
.f-btn:hover{border-color:rgba(62,131,255,.4);color:var(--text);}
.f-btn.active{color:#fff;border-color:transparent;}
:global(.light-mode) .f-btn{background:#fff;border-color:rgba(10,14,26,.1);color:rgba(10,14,26,.6);}
.dot{width:10px;height:10px;border-radius:50%;}

/* Legend */
.legend{display:flex;gap:16px;flex-wrap:wrap;padding:16px 22px;border-top:1px solid var(--border);}
:global(.light-mode) .legend{border-color:rgba(10,14,26,.08);}
.leg{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--text-muted);}
:global(.light-mode) .leg{color:rgba(10,14,26,.5);}
.leg-dot{width:13px;height:13px;border-radius:50%;flex-shrink:0;}

/* ── Selected day detail ── */
.detail-card{margin-top:16px;background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
:global(.light-mode) .detail-card{background:#fff;border-color:rgba(10,14,26,.08);}
.dc-head{padding:14px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
:global(.light-mode) .dc-head{border-color:rgba(10,14,26,.08);}
.dc-title{font-size:15px;font-weight:700;color:var(--text);}
:global(.light-mode) .dc-title{color:#0a0e1a;}
.dc-cnt{font-size:12px;font-weight:700;color:#3E83FF;background:rgba(62,131,255,.1);padding:2px 9px;border-radius:20px;}
.dc-body{padding:10px 16px;}
.d-ev{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
:global(.light-mode) .d-ev{border-color:rgba(10,14,26,.07);}
.d-ev:last-child{border-bottom:none;}
.d-icon-wrap{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
.d-name{font-size:14px;font-weight:700;color:var(--text);}
:global(.light-mode) .d-name{color:#0a0e1a;}
.d-desc{font-size:12px;color:var(--text-muted);margin-top:2px;}
.d-badge{display:inline-flex;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;margin-top:5px;}
.d-link{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#3E83FF;text-decoration:none;margin-top:4px;margin-left:8px;}
.d-link:hover{text-decoration:underline;}
.d-teams{font-size:11px;color:var(--text-dim);margin-top:2px;}
.d-empty{padding:24px;text-align:center;color:var(--text-dim);font-size:13px;}

/* ── Right panel ── */
.right{display:flex;flex-direction:column;gap:16px;}

/* My teams */
.panel{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
:global(.light-mode) .panel{background:#fff;border-color:rgba(10,14,26,.08);}
.panel-h{padding:15px 18px;border-bottom:1px solid var(--border);font-size:15px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px;}
:global(.light-mode) .panel-h{color:#0a0e1a;border-color:rgba(10,14,26,.08);}
.ph-bar{width:4px;height:16px;background:#3E83FF;border-radius:2px;flex-shrink:0;}

/* Team card */
.team-row{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--border);}
:global(.light-mode) .team-row{border-color:rgba(10,14,26,.07);}
.team-row:last-child{border-bottom:none;}
.team-av{width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,#1e3a7a,#1a50a0);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;color:#5aaeff;flex-shrink:0;}
.team-name{font-size:13px;font-weight:700;color:var(--text);}
:global(.light-mode) .team-name{color:#0a0e1a;}
.team-tour{font-size:11px;color:var(--text-muted);margin-top:2px;}
.team-status{padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;margin-left:auto;flex-shrink:0;}

/* Upcoming grouped */
.up-group{border-bottom:1px solid var(--border);}
:global(.light-mode) .up-group{border-color:rgba(10,14,26,.07);}
.up-group:last-child{border-bottom:none;}
.up-date-label{font-size:11px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.07em;padding:10px 18px 4px;}
:global(.light-mode) .up-date-label{color:rgba(10,14,26,.4);}
.up-date-label.today-lbl{color:#3E83FF;}
.up-ev{display:flex;align-items:center;gap:10px;padding:8px 18px 8px 24px;cursor:pointer;transition:background .12s;}
.up-ev:hover{background:rgba(62,131,255,.04);}
.up-icon{font-size:16px;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.up-ev-name{font-size:12px;font-weight:600;color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
:global(.light-mode) .up-ev-name{color:#0a0e1a;}
.up-ev-desc{font-size:10px;color:var(--text-muted);}
.up-badge{font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px;flex-shrink:0;}
.up-empty{padding:20px;text-align:center;color:var(--text-dim);font-size:13px;}

/* Tournament status */
.t-running{background:rgba(74,222,128,.12);color:#4ADE80;}
.t-registration{background:rgba(62,131,255,.12);color:#3E83FF;}
.t-finished{background:rgba(100,116,139,.1);color:#64748B;}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">

            <div class="page-top">
                <h1 class="h1">Календар подій</h1>
                <button class="today-btn" onclick={goToday}>Сьогодні</button>
            </div>

            <!-- Stats -->
            <div class="stats-strip">
                <div class="stat-box">
                    <div class="stat-icon" style="background:rgba(62,131,255,.12);">🗓</div>
                    <div>
                        <div class="stat-num" style="color:#3E83FF;">{data.stats.total}</div>
                        <div class="stat-lbl">Подій всього</div>
                    </div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon" style="background:rgba(74,222,128,.12);">🚀</div>
                    <div>
                        <div class="stat-num" style="color:#4ADE80;">{data.stats.future}</div>
                        <div class="stat-lbl">Майбутніх</div>
                    </div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon" style="background:rgba(248,81,73,.1);">⏰</div>
                    <div>
                        <div class="stat-num" style="color:#f85149;">{evArr.filter((e:any)=>e.type==='deadline').length}</div>
                        <div class="stat-lbl">Дедлайнів</div>
                    </div>
                </div>
                <div class="stat-box">
                    <div class="stat-icon" style="background:rgba(168,85,247,.12);">👥</div>
                    <div>
                        <div class="stat-num" style="color:#A855F7;">{data.stats.myTeams}</div>
                        <div class="stat-lbl">Моїх команд</div>
                    </div>
                </div>
            </div>

            <div class="layout">
                <!-- LEFT -->
                <div>
                    <!-- Filter bar -->
                    <div class="filter-bar">
                        <!-- Type filters -->
                        {#each typeFilters as f}
                            <button class="f-btn"
                                class:active={activeFilter === f.key}
                                style={activeFilter === f.key ? `background:${f.color};` : ''}
                                onclick={() => { activeFilter = f.key; selectedDay = null; }}>
                                <div style="width:9px;height:9px;border-radius:50%;background:{activeFilter===f.key?'rgba(255,255,255,.7)':f.color};flex-shrink:0;"></div>
                                {f.label}
                            </button>
                        {/each}
                        <!-- Divider -->
                        <div style="width:1px;height:28px;background:var(--border);align-self:center;"></div>
                        <!-- Tournament filters -->
                        {#each tournamentFilters as f}
                            <button class="f-btn"
                                class:active={activeFilter === f.key}
                                style={activeFilter === f.key ? `background:${f.color};` : ''}
                                onclick={() => { activeFilter = f.key; selectedDay = null; }}>
                                <span style="font-size:12px;">🏆</span>
                                {f.label}
                            </button>
                        {/each}
                    </div>
                    <div class="cal-card">
                        <!-- Nav -->
                        <div class="cal-nav">
                            <button class="nav-btn" onclick={prevMonth} aria-label="Попередній">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            <div class="month-lbl">{MONTHS[viewMonth]} {viewYear}</div>
                            <button class="nav-btn" onclick={nextMonth} aria-label="Наступний">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                            </button>
                        </div>

                        <!-- Day names -->
                        <div class="day-names">
                            {#each DAYS_SHORT as d, i}
                                <div class="dn" style={i>=5?"color:#f85149;":""}>{d}</div>
                            {/each}
                        </div>

                        <!-- Cells -->
                        <div class="cells">
                            {#each calDays as cell}
                                {#if cell === null}
                                    <div class="cell empty"></div>
                                {:else}
                                    {@const evs = eventsForDay(cell)}
                                    {@const ds = dayStr(cell)}
                                    <div class="cell"
                                        class:today={isToday(cell)}
                                        class:selected={selectedDay===ds}
                                        class:past={isPast(cell)}
                                        onclick={() => selectedDay = selectedDay===ds ? null : ds}
                                        role="button" tabindex="0"
                                        onkeydown={(e)=>e.key==='Enter'&&(selectedDay=ds)}>
                                        <div class="dnum">{cell}</div>
                                        <div class="dots">
                                            {#each evs.slice(0,7) as ev}
                                                <div class="dot" style="background:{ev.color};" title={ev.title}></div>
                                            {/each}
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>

                        <!-- Legend -->
                        <div class="legend">
                            {#each Object.entries(typeConfig) as [key, c]}
                                <div class="leg">
                                    <div class="leg-dot" style="background:{c.color};"></div>
                                    {c.label}
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- Selected day detail -->
                    {#if selectedDay !== null}
                        <div class="detail-card">
                            <div class="dc-head">
                                <div class="dc-title">{fmtFull(selectedDay)}</div>
                                {#if selectedEvents.length > 0}
                                    <span class="dc-cnt">{selectedEvents.length} подій</span>
                                {/if}
                            </div>
                            <div class="dc-body">
                                {#if selectedEvents.length === 0}
                                    <div class="d-empty">Немає подій цього дня</div>
                                {:else}
                                    {#each selectedEvents as ev}
                                        {@const c = cfg(ev.type)}
                                        <div class="d-ev">
                                            <div class="d-icon-wrap" style="background:{c.color}18;">{c.icon}</div>
                                            <div style="flex:1;min-width:0;">
                                                <div class="d-name">{ev.title}</div>
                                                {#if ev.description}<div class="d-desc">{ev.description}</div>{/if}
                                                {#if ev.teamsCount !== undefined}
                                                    <div class="d-teams">{ev.teamsCount}{ev.maxTeams ? ` / ${ev.maxTeams}` : ''} команд зареєстровано</div>
                                                {/if}
                                                <div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px;margin-top:5px;">
                                                    <span class="d-badge" style="background:{c.color}20;color:{c.color};">{c.label}</span>
                                                    {#if ev.tournamentId}
                                                        <a href="/tourments/{ev.tournamentId}" class="d-link">
                                                            Переглянути турнір →
                                                        </a>
                                                    {/if}
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- RIGHT -->
                <div class="right">

                    <!-- My teams -->
                    {#if data.userTeams.length > 0}
                        <div class="panel">
                            <div class="panel-h"><span class="ph-bar"></span>Мої команди</div>
                            {#each data.userTeams as team}
                                {@const status = team.tournament.status}
                                <div class="team-row">
                                    <div class="team-av">{team.name[0].toUpperCase()}</div>
                                    <div style="flex:1;min-width:0;">
                                        <div class="team-name">{team.name}</div>
                                        <div class="team-tour">{team.tournament.title}</div>
                                    </div>
                                    <span class="team-status"
                                        class:t-running={status==='RUNNING'}
                                        class:t-registration={status==='REGISTRATION'}
                                        class:t-finished={status==='FINISHED'}>
                                        {status==='RUNNING'?'Тривє':status==='REGISTRATION'?'Реєстрація':'Завершено'}
                                    </span>
                                </div>
                            {/each}
                        </div>
                    {/if}

                    <!-- Upcoming events grouped -->
                    <div class="panel">
                        <div class="panel-h"><span class="ph-bar"></span>Найближчі 45 днів</div>
                        {#if upcomingGrouped.length === 0}
                            <div class="up-empty">Найближчих подій немає</div>
                        {:else}
                            {#each upcomingGrouped as [date, evs]}
                                {@const du = daysUntil(date)}
                                <div class="up-group">
                                    <div class="up-date-label" class:today-lbl={du===0}>
                                        {du===0 ? 'Сьогодні' : du===1 ? 'Завтра' : fmtDate(date)}
                                        {#if du > 1}<span style="font-weight:400;opacity:.6;"> · через {du} дн.</span>{/if}
                                    </div>
                                    {#each evs as ev}
                                        {@const c = cfg(ev.type)}
                                        <button class="up-ev"
                                            onclick={() => { const d=new Date(ev.date); viewYear=d.getFullYear(); viewMonth=d.getMonth(); selectedDay=ev.date; }}>
                                            <div class="up-icon" style="background:{c.color}18;">{c.icon}</div>
                                            <div style="flex:1;min-width:0;">
                                                <div class="up-ev-name">{ev.title}</div>
                                                {#if ev.description}<div class="up-ev-desc">{ev.description}</div>{/if}
                                            </div>
                                            <span class="up-badge" style="background:{c.color}20;color:{c.color};">{c.label}</span>
                                        </button>
                                    {/each}
                                </div>
                            {/each}
                        {/if}
                    </div>

                    <!-- Tournaments quick view -->
                    <div class="panel">
                        <div class="panel-h"><span class="ph-bar"></span>Турніри</div>
                        {#each data.tournaments as t}
                            <div class="team-row" style="cursor:pointer;"
                                onclick={() => { activeFilter = `tournament:${t.id}`; selectedDay = null; }}
                                role="button" tabindex="0"
                                onkeydown={(e) => e.key==='Enter' && (activeFilter = `tournament:${t.id}`)}>
                                <div class="team-av" style="background:linear-gradient(135deg,#1a3a6a,#2563eb);font-size:13px;">🏆</div>
                                <div style="flex:1;min-width:0;">
                                    <div class="team-name">{t.title}</div>
                                    <div class="team-tour">
                                        {#if t.regEnd}до {new Date(t.regEnd).toLocaleDateString('uk-UA',{day:'numeric',month:'short'})}{/if}
                                        · натисни для фільтрації
                                    </div>
                                </div>
                                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                                    <span class="team-status"
                                        class:t-running={t.status==='RUNNING'}
                                        class:t-registration={t.status==='REGISTRATION'}
                                        class:t-finished={t.status==='FINISHED'}>
                                        {t.status==='RUNNING'?'Тривє':t.status==='REGISTRATION'?'Реєстрація':'Завершено'}
                                    </span>
                                    {#if activeFilter === `tournament:${t.id}`}
                                        <span style="font-size:10px;color:#3E83FF;font-weight:600;">● активний фільтр</span>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>

                </div>
            </div>

        </main>
    </div>
    <Footer />
</div>
