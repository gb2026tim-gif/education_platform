<script lang="ts">
  let { work } = $props<{
    work: {
      workId: string;
      teamLabel: string;
      tournamentName: string;
      evaluated: boolean;
      evaluatedAt: string | null;
      githubUrl: string | null;
      videoUrl: string | null;
      average: number | null;
    };
  }>();
</script>

<article class="rounded-xl border border-[--border] bg-[--bg-card] p-4">
  <div class="mb-2 flex items-center justify-between">
    <h3 class="text-lg text-[--text-primary]">{work.teamLabel}</h3>
    <div class="flex gap-2">
      {#if work.githubUrl}
        <a href={work.githubUrl} target="_blank" class="rounded border border-[--border] px-2 py-1 text-xs">GitHub</a>
      {/if}
      {#if work.videoUrl}
        <a href={work.videoUrl} target="_blank" class="rounded border border-[--border] px-2 py-1 text-xs">Відео</a>
      {/if}
    </div>
  </div>
  <p class="text-sm text-[--text-secondary]">{work.tournamentName}</p>
  {#if work.evaluated}
    <p class="mt-2 font-mono text-sm text-[--text-primary]">Середній бал: {work.average ?? 0}</p>
    <a href={`/jury/works/${work.workId}`} class="mt-3 inline-block rounded bg-[--accent-blue] px-3 py-1.5 text-sm text-white">Переглянути</a>
  {:else}
    <p class="mt-2 text-sm text-[--text-secondary]">Оцініть, щоб побачити бали</p>
    <a href={`/jury/works/${work.workId}`} class="mt-3 inline-block rounded bg-[--accent-blue] px-3 py-1.5 text-sm text-white">Оцінити</a>
  {/if}
</article>
