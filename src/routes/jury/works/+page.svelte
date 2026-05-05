<!-- src/routes/jury/works/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types";
  import WorkCard from "$lib/jury/WorkCard.svelte";
  import TournamentSelect from "$lib/jury/TournamentSelect.svelte";

  let { data }: { data: PageData } = $props();

  let tab = $state<"all" | "pending" | "evaluated">("all");
  let tournament = $state("all");

  const filtered = $derived(
    data.works.filter((w) => {
      const byTab =
        tab === "all" ? true : tab === "pending" ? !w.evaluated : w.evaluated;
      const byTour =
        tournament === "all" ? true : w.tournamentId === tournament;
      return byTab && byTour;
    })
  );
</script>

<svelte:head><title>Призначені роботи — Панель журі</title></svelte:head>

<style>
  .bc   { font-size: 12px; color: #484f58; margin-bottom: 8px; }
  .bc a { color: #8b949e; text-decoration: none; }
  .bc a:hover { color: #58a6ff; }

  .page-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .h1 {
    font-size: 28px;
    font-weight: 700;
    color: #e6edf3;
    font-family: 'Space Grotesk', sans-serif;
    margin: 0;
  }

  .stats-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .stat-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 14px;
    border-radius: 8px;
    background: #161b22;
    border: 1px solid #21262d;
    min-width: 56px;
  }

  .stat-num {
    font-size: 18px;
    font-weight: 700;
    color: #e6edf3;
    font-family: 'JetBrains Mono', monospace;
    line-height: 1;
  }

  .stat-label {
    font-size: 10px;
    color: #484f58;
    margin-top: 3px;
    white-space: nowrap;
  }

  .filter-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .tabs {
    display: flex;
    gap: 4px;
  }

  .tab {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s, color 0.12s;
    background: #161b22;
    color: #8b949e;
    border: 1px solid #21262d;
  }

  .tab.active {
    background: #1f6feb;
    color: #fff;
    border-color: #1f6feb;
  }

  .tab:hover:not(.active) {
    background: #21262d;
    color: #e6edf3;
  }

  .works-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .empty {
    text-align: center;
    padding: 40px 0;
    color: #484f58;
    font-size: 14px;
  }
</style>

<div class="bc">
  <a href="/jury/account">Кабінет</a> / Мої роботи
</div>

<div class="page-top">
  <h1 class="h1">Призначені роботи</h1>
  <div class="stats-row">
    <div class="stat-badge">
      <span class="stat-num">{data.stats.total}</span>
      <span class="stat-label">Всього</span>
    </div>
    <div class="stat-badge">
      <span class="stat-num">{data.stats.evaluated}</span>
      <span class="stat-label">Оцінено</span>
    </div>
    <div class="stat-badge">
      <span class="stat-num">{data.stats.pending}</span>
      <span class="stat-label">Очікують</span>
    </div>
  </div>
</div>

<div class="filter-row">
  <div class="tabs">
    <button class="tab" class:active={tab === "all"} onclick={() => (tab = "all")}>Всі</button>
    <button class="tab" class:active={tab === "pending"} onclick={() => (tab = "pending")}>Не оцінені</button>
    <button class="tab" class:active={tab === "evaluated"} onclick={() => (tab = "evaluated")}>Оцінені</button>
  </div>
  <TournamentSelect options={data.tournaments} bind:value={tournament} />
</div>

<div class="works-list">
  {#each filtered as work}
    <WorkCard {work} />
  {:else}
    <div class="empty">Немає робіт для відображення</div>
  {/each}
</div>
