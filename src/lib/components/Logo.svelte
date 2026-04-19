<!-- src/lib/components/Logo.svelte -->
<script lang="ts">
    const { size = 40 }: { size?: number } = $props();

    const w = $derived(Math.round(78 * (size / 40)));
</script>

<svg width={w} height={size} viewBox="0 0 78 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="33" font-family="Manrope,sans-serif" font-size="24" font-weight="800" fill="#3E83FF" opacity="0.3">Lvl</text>
    <path d="M38 8 L38 27 Q38 36 46 36 Q54 36 54 27 L54 8"
          stroke="#3E83FF" stroke-width="5.5" stroke-linecap="butt" stroke-linejoin="miter" fill="none"/>
    <line x1="54" y1="8" x2="54" y2="3" stroke="#3E83FF" stroke-width="5.5" stroke-linecap="butt"/>
    <polyline points="48,10 54,3 60,10"
              stroke="#3E83FF" stroke-width="5" stroke-linecap="butt" stroke-linejoin="miter" fill="none"/>
    <text x="57" y="33" font-family="Manrope,sans-serif" font-size="24" font-weight="800" fill="#3E83FF">p</text>
</svg>
