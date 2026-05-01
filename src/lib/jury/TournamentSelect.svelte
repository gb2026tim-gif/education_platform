<script lang="ts">
  let {
    options = [],
    value = $bindable("all")
  } = $props<{ options?: { id: string; name: string }[]; value?: string }>();
</script>

<label class="flex items-center gap-2 text-sm text-[--text-secondary]">
  Турнір:
  <select
    bind:value
    class="rounded-lg border border-[--border] bg-[--bg-card] px-3 py-1.5 text-[--text-primary] outline-none focus:border-[--border-focus]"
  >
    <option value="all">Усі турніри</option>
    {#each options as option}
      <option value={option.id}>{option.name}</option>
    {/each}
  </select>
</label>
