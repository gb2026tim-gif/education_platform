<script lang="ts">
  let { label, value } = $props<{ label: string; value: number }>();
</script>

<div class="min-w-20 rounded-xl bg-[--bg-card] px-4 py-2 text-center">
  <div class="font-mono text-2xl text-[--text-primary]">{value}</div>
  <div class="text-xs text-[--text-secondary]">{label}</div>
</div>
