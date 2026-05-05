<script lang="ts">
  let { value = $bindable(50), min = 0, max = 100, label } = $props<{
    value?: number;
    min?: number;
    max?: number;
    label: string;
  }>();

  const percent = $derived(((value - min) / (max - min)) * 100);
</script>

<div class="slider-wrap">
  <div class="slider-header">
    <label class="slider-label">{label}</label>
    <span class="slider-value">{value}</span>
  </div>
  <div class="slider-track">
    <input
      type="range"
      bind:value
      {min}
      {max}
      class="slider-input"
      style="--percent: {percent}%"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
    />
  </div>
  <div class="scale-labels">
    <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
  </div>
</div>

<style>
  .slider-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .slider-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .slider-label {
    font-size: 12px;
    color: #8b949e;
    line-height: 1.4;
  }

  .slider-value {
    font-size: 16px;
    font-weight: 700;
    color: #e6edf3;
    font-family: 'JetBrains Mono', monospace;
    min-width: 32px;
    text-align: right;
  }

  .slider-track {
    position: relative;
    height: 8px;
  }

  .slider-input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
    background: linear-gradient(
      to right,
      #1f6feb 0%,
      #1f6feb var(--percent),
      #21262d var(--percent),
      #21262d 100%
    );
    transition: background 0.05s;
  }

  .slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1f6feb;
    border: 2px solid #0d1117;
    cursor: pointer;
    box-shadow: 0 0 0 3px rgba(31,111,235,.25);
    transition: box-shadow 0.12s, transform 0.12s;
  }

  .slider-input:hover::-webkit-slider-thumb {
    box-shadow: 0 0 0 5px rgba(31,111,235,.35);
    transform: scale(1.1);
  }

  .slider-input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #1f6feb;
    border: 2px solid #0d1117;
    cursor: pointer;
  }

  .scale-labels {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: #484f58;
    padding: 0 1px;
  }
</style>
