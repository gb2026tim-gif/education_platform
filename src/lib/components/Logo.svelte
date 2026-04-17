<!-- src/lib/components/Logo.svelte -->
<script lang="ts">
    let { size = 40 } = $props<{ size?: number }>();
    const scale = size / 40;
    const w = Math.round(78 * scale);
    const h = size;
</script>

<svg width={w} height={h} viewBox="0 0 78 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Lvl dim — щільніше -->
    <text x="0" y="33" font-family="Manrope,sans-serif" font-size="24" font-weight="800" fill="#3E83FF" opacity="0.3">Lvl</text>

    <!-- U: прямі краї, заокруглене дно, компактна -->
    <path d="M38 8 L38 27 Q38 36 46 36 Q54 36 54 27 L54 8"
          stroke="#3E83FF" stroke-width="5.5" stroke-linecap="butt" stroke-linejoin="miter" fill="none"/>

    <!-- Права нога = стрілка вгору -->
    <line x1="54" y1="8" x2="54" y2="3" stroke="#3E83FF" stroke-width="5.5" stroke-linecap="butt"/>

    <!-- Голова стрілки -->
    <polyline points="48,10 54,3 60,10"
              stroke="#3E83FF" stroke-width="5" stroke-linecap="butt" stroke-linejoin="miter" fill="none"/>

    <!-- p — впритул до U -->
    <text x="57" y="33" font-family="Manrope,sans-serif" font-size="24" font-weight="800" fill="#3E83FF">p</text>
</svg>
