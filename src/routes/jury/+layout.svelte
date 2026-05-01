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
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Space+Grotesk:wght@600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="min-h-screen bg-[--bg-base] text-[--text-primary]" style="font-family: Inter, sans-serif;">
  {#if data.juror}
    <JuryHeader jurorName={data.juror.name} avatarUrl={data.juror.avatarUrl} />
    <div class="flex min-h-[calc(100vh-4rem)]">
      <JurySidebar />
      <main class="flex-1 p-6">{@render children()}</main>
    </div>
  {:else}
    {@render children()}
  {/if}
</div>
