<script lang="ts">
  let { value = $bindable(50), min = 0, max = 100, label } = $props<{
    value?: number;
    min?: number;
    max?: number;
    label: string;
  }>();

  const percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="sw">
  <div class="sh">
    <span class="sl">{label}</span>
    <span class="sv">{value}</span>
  </div>
  <input
    type="range"
    bind:value
    {min}
    {max}
    class="si"
    style="--p: {percent}%"
    aria-label={label}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
  />
</div>

<style>
  .sw {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sh {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .sl {
    font-size: 12px;
    color: #8b949e;
    line-height: 1.4;
    flex: 1;
  }

  .sv {
    font-size: 15px;
    font-weight: 700;
    color: #e6edf3;
    font-family: 'JetBrains Mono', monospace;
    /* Fixed width so slider doesn't shift */
    width: 36px;
    text-align: right;
    flex-shrink: 0;
  }

  :global(.light-mode) .sl { color: rgba(10,14,26,.55); }
  :global(.light-mode) .sv { color: #0a0e1a; }

  .si {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 5px;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    margin: 4px 0;
    background: linear-gradient(
      to right,
      #1f6feb 0%,
      #1f6feb var(--p),
      #21262d var(--p),
      #21262d 100%
    );
  }

  :global(.light-mode) .si {
    background: linear-gradient(
      to right,
      #1f6feb 0%,
      #1f6feb var(--p),
      rgba(10,14,26,.15) var(--p),
      rgba(10,14,26,.15) 100%
    );
  }

  .si::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1f6feb;
    border: 2px solid #0d1117;
    cursor: pointer;
    box-shadow: 0 0 0 3px rgba(31,111,235,.2);
    transition: box-shadow .12s, transform .12s;
  }

  .si:hover::-webkit-slider-thumb {
    box-shadow: 0 0 0 5px rgba(31,111,235,.3);
    transform: scale(1.1);
  }

  .si::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1f6feb;
    border: 2px solid #0d1117;
    cursor: pointer;
  }

  :global(.light-mode) .si::-webkit-slider-thumb { border-color: #f0f4ff; }
  :global(.light-mode) .si::-moz-range-thumb     { border-color: #f0f4ff; }
</style>
