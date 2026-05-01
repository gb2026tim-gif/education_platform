<script lang="ts">
  let { value = $bindable(50), min = 0, max = 100, label } = $props<{
    value?: number;
    min?: number;
    max?: number;
    label: string;
  }>();

  const percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="space-y-1">
  <label class="text-sm text-[--text-secondary]">{label}</label>
  <div class="flex items-center gap-3">
    <input
      type="range"
      bind:value
      {min}
      {max}
      style={`background: linear-gradient(to right, var(--accent-blue) 0%, var(--accent-blue) ${percent}%, #30363d ${percent}%, #30363d 100%);`}
      class="h-2 w-full cursor-pointer appearance-none rounded-lg"
    />
    <span class="w-10 text-right font-mono text-sm text-[--text-primary]">{value}</span>
  </div>
  <div class="flex justify-between text-[10px] text-[--text-secondary]">
    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
  </div>
</div>
