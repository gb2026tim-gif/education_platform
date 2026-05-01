<script lang="ts">
  import type { PageData } from "./$types";
  import AvatarUpload from "$lib/jury/AvatarUpload.svelte";
  import PasswordModal from "$lib/jury/PasswordModal.svelte";
  import StatBadge from "$lib/jury/StatBadge.svelte";

  let { data }: { data: PageData } = $props();
  let avatarUrl = $state(data.juror.avatarUrl ?? "");
  let showPasswordModal = $state(false);
  let passwordChanged = $state(data.juror.passwordChanged);
</script>

<div class="mb-4 text-sm text-[--text-secondary]">Кабінет / Мій акаунт</div>
<h1 class="mb-6 text-4xl" style="font-family: 'Space Grotesk', sans-serif;">Мій акаунт</h1>

<section class="grid gap-6 lg:grid-cols-[320px_1fr]">
  <div class="rounded-xl border border-[--border] bg-[--bg-card] p-4">
    <AvatarUpload avatarUrl={avatarUrl} onUploaded={(url) => (avatarUrl = url)} />
    <h2 class="mt-4 text-xl">{data.juror.name}</h2>
    <p class="text-sm text-[--text-secondary]">{data.juror.email}</p>
    <div class="mt-4 grid grid-cols-3 gap-2">
      <StatBadge label="Всього" value={data.stats.total} />
      <StatBadge label="Оцінено" value={data.stats.evaluated} />
      <StatBadge label="Очікують" value={data.stats.pending} />
    </div>
    <a href="/jury/works" class="mt-4 inline-block text-sm text-[--accent-blue-light]">До робіт</a>
  </div>

  <div class="rounded-xl border border-[--border] bg-[--bg-card] p-4">
    <h3 class="mb-3 text-xl">Оцінено</h3>
    <div class="space-y-2">
      {#each data.evaluatedWorks as work}
        <div class="rounded-lg border border-[--border] bg-[--bg-base] p-3">
          <div>{work.teamLabel}</div>
          <div class="text-sm text-[--text-secondary]">{work.tournamentName}</div>
          <div class="font-mono text-sm">Середній: {work.average ?? "-"}</div>
        </div>
      {/each}
      {#if data.evaluatedWorks.length === 0}
        <p class="text-sm text-[--text-secondary]">Оцінок поки немає.</p>
      {/if}
    </div>
  </div>
</section>

{#if !passwordChanged}
  <div class="fixed bottom-5 right-5 max-w-md rounded-lg border border-[--warning] bg-[--bg-card] p-3 text-sm">
    <p class="mb-2">Ви використовуєте одноразовий пароль, будь ласка, змініть його на ваш надійний</p>
    <button class="rounded bg-[--accent-blue] px-3 py-1.5 text-white" on:click={() => (showPasswordModal = true)}>
      Змінити
    </button>
  </div>
{/if}

<PasswordModal bind:open={showPasswordModal} onChanged={() => (passwordChanged = true)} />
