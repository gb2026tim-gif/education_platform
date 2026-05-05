<script lang="ts">
  interface Option { id: string; name: string; }
  let { options, value = $bindable("all") }: { options: Option[]; value?: string } = $props();
</script>

<div class="select-wrap">
  <select bind:value class="select" aria-label="Фільтр по турніру">
    <option value="all">Турнір: Всі</option>
    {#each options as opt}
      <option value={opt.id}>Турнір: {opt.name}</option>
    {/each}
  </select>
  <div class="arrow" aria-hidden="true">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
</div>

<style>
  .select-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .select {
    appearance: none;
    -webkit-appearance: none;
    padding: 7px 30px 7px 12px;
    border-radius: 7px;
    border: 1px solid #21262d;
    background: #161b22;
    color: #e6edf3;
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    outline: none;
    transition: border-color 0.12s;
    min-width: 180px;
  }

  .select:hover { border-color: #30363d; }
  .select:focus { border-color: #1f6feb; }

  .arrow {
    position: absolute;
    right: 9px;
    color: #484f58;
    pointer-events: none;
  }
</style>
