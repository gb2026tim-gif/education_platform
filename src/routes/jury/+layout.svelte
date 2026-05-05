<script lang="ts">
  import type { LayoutData } from "./$types";
  import JuryHeader from "$lib/jury/JuryHeader.svelte";
  import JurySidebar from "$lib/jury/JurySidebar.svelte";

  let { children, data } = $props<{ children: () => unknown; data: LayoutData }>();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@600;700&display=swap"
          rel="stylesheet"
  />
</svelte:head>

<div class="jury-shell">
  {#if data.juror}
    <JuryHeader jurorName={data.juror.name} avatarUrl={data.juror.avatarUrl} />
    <div class="jury-body">
      <JurySidebar juror={data.juror} />
      <main class="jury-main">
        {@render children()}
      </main>
    </div>
  {:else}
    <div class="jury-bare">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .jury-shell {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #0d1117;
    color: #e6edf3;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background 0.2s, color 0.2s;
  }

  :global(.light-mode) .jury-shell {
    background: #f0f4ff;
    color: #0a0e1a;
  }

  .jury-body {
    display: flex;
    flex: 1;
    min-height: calc(100vh - 60px);
  }

  .jury-main {
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;
    min-width: 0;
  }

  .jury-bare {
    min-height: 100vh;
  }
</style>