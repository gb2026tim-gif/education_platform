<script lang="ts">
  import type { PageData } from "./$types";
  import StatBadge from "$lib/jury/StatBadge.svelte";
  import WorkCard from "$lib/jury/WorkCard.svelte";
  import TournamentSelect from "$lib/jury/TournamentSelect.svelte";

  let { data }: { data: PageData } = $props();
  let tab = $state<"all" | "pending" | "evaluated">("all");
  let tournament = $state("all");

  const filtered = $derived(
    data.works.filter((w) => {
      const byTab = tab === "all" ? true : tab === "pending" ? !w.evaluated : w.evaluated;
      const byTournament = tournament === "all" ? true : w.tournamentId === tournament;
      return byTab && byTournament;
    })
  );
</script>

<div class="mb-4 text-sm text-[--text-secondary]">Кабінет / Мої роботи</div>
<h1 class="mb-4 text-4xl" style="font-family: 'Space Grotesk', sans-serif;">Призначені роботи</h1>

<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
  <div class="flex gap-2">
    <StatBadge label="Всього" value={data.stats.total} />
    <StatBadge label="Оцінено" value={data.stats.evaluated} />
    <StatBadge label="Очікують" value={data.stats.pending} />
  </div>
  <TournamentSelect options={data.tournaments} bind:value={tournament} />
</div>

<div class="mb-4 flex gap-2">
  <button class={`rounded-full px-3 py-1 text-sm ${tab === "all" ? "bg-[--accent-blue] text-white" : "bg-[--bg-card]"}`} on:click={() => (tab = "all")}>Всі</button>
  <button class={`rounded-full px-3 py-1 text-sm ${tab === "pending" ? "bg-[--accent-blue] text-white" : "bg-[--bg-card]"}`} on:click={() => (tab = "pending")}>Не оцінені</button>
  <button class={`rounded-full px-3 py-1 text-sm ${tab === "evaluated" ? "bg-[--accent-blue] text-white" : "bg-[--bg-card]"}`} on:click={() => (tab = "evaluated")}>Оцінені</button>
</div>

<div class="space-y-3">
  {#each filtered as work}
    <WorkCard {work} />
  {/each}
</div>
