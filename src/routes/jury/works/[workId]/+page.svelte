<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ScoreSlider from "$lib/jury/ScoreSlider.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();
  const evaluation = data.assignment.evaluation;

  let backendCode = $state(evaluation?.backendCode ?? 50);
  let databaseStructure = $state(evaluation?.databaseStructure ?? 50);
  let frontendCode = $state(evaluation?.frontendCode ?? 50);
  let backendFunctionality = $state(evaluation?.backendFunctionality ?? 50);
  let databaseFunctionality = $state(evaluation?.databaseFunctionality ?? 50);
  let frontendFunctionality = $state(evaluation?.frontendFunctionality ?? 50);
  let comment = $state(evaluation?.comment ?? "");
  let requirementsRest = $state(evaluation?.requirementsRest ?? false);
  let requirementsDb = $state(evaluation?.requirementsDb ?? false);
  let requirementsAuth = $state(evaluation?.requirementsAuth ?? false);
  let requirementsFrontend = $state(evaluation?.requirementsFrontend ?? false);
  let requirementsDeploy = $state(evaluation?.requirementsDeploy ?? false);
  let loadingDraft = $state(false);
  let loadingSubmit = $state(false);

  const average = $derived(
    Number(
      (
        (backendCode +
          databaseStructure +
          frontendCode +
          backendFunctionality +
          databaseFunctionality +
          frontendFunctionality) /
        6
      ).toFixed(2)
    )
  );
</script>

<div class="mb-4 text-sm text-[--text-secondary]">
  Кабінет / Мої роботи / {data.assignment.work.tournament.title} / Команда {data.assignment.displayNumber}
</div>
<h1 class="mb-5 text-4xl" style="font-family: 'Space Grotesk', sans-serif;">Оцінювання</h1>

<form class="grid gap-6 lg:grid-cols-[1fr_420px]">
  <section class="space-y-3 rounded-xl border border-[--border] bg-[--bg-card] p-4">
    <h2 class="text-lg">Матеріали для перегляду</h2>
    {#if data.assignment.work.githubUrl}
      <a href={data.assignment.work.githubUrl} target="_blank" class="block rounded border border-[--border] p-2">GitHub</a>
    {/if}
    {#if data.assignment.work.videoUrl}
      <a href={data.assignment.work.videoUrl} target="_blank" class="block rounded border border-[--border] p-2">Відео</a>
    {/if}
    {#if data.assignment.work.liveDemoUrl}
      <a href={data.assignment.work.liveDemoUrl} target="_blank" class="block rounded border border-[--border] p-2">Live demo</a>
    {/if}
    <h3 class="pt-2 text-sm text-[--text-secondary]">Обов'язкові вимоги завдання</h3>
    <label class="block"><input type="checkbox" bind:checked={requirementsRest} name="requirementsRest" /> REST API</label>
    <label class="block"><input type="checkbox" bind:checked={requirementsDb} name="requirementsDb" /> База даних</label>
    <label class="block"><input type="checkbox" bind:checked={requirementsAuth} name="requirementsAuth" /> Авторизація</label>
    <label class="block"><input type="checkbox" bind:checked={requirementsFrontend} name="requirementsFrontend" /> Frontend API</label>
    <label class="block"><input type="checkbox" bind:checked={requirementsDeploy} name="requirementsDeploy" /> Деплой</label>
    <p class="rounded border border-[--border] bg-[--bg-base] p-3 text-sm text-[--text-secondary]">
      {data.assignment.work.description ?? "Опис не додано"}
    </p>
  </section>

  <section class="space-y-4 rounded-xl border border-[--border] bg-[--bg-card] p-4">
    <h2 class="text-lg">Форма оцінювання</h2>
    <ScoreSlider label="Backend якість коду" bind:value={backendCode} />
    <ScoreSlider label="База даних (структура)" bind:value={databaseStructure} />
    <ScoreSlider label="Frontend (код, UI)" bind:value={frontendCode} />
    <ScoreSlider label="Backend функціональність" bind:value={backendFunctionality} />
    <ScoreSlider label="База даних функціональність" bind:value={databaseFunctionality} />
    <ScoreSlider label="Frontend функціональність" bind:value={frontendFunctionality} />

    <div class="rounded bg-[--accent-blue]/20 p-3 font-mono">Середній бал: {average}</div>
    <textarea bind:value={comment} name="comment" class="h-24 w-full rounded border border-[--border] bg-[--bg-base] p-2" placeholder="Коментар" />

    <input type="hidden" name="backendCode" value={backendCode} />
    <input type="hidden" name="databaseStructure" value={databaseStructure} />
    <input type="hidden" name="frontendCode" value={frontendCode} />
    <input type="hidden" name="backendFunctionality" value={backendFunctionality} />
    <input type="hidden" name="databaseFunctionality" value={databaseFunctionality} />
    <input type="hidden" name="frontendFunctionality" value={frontendFunctionality} />

    {#if form?.error}<p class="text-sm text-red-400">{form.error}</p>{/if}
    <div class="flex gap-2">
      <button
        formaction="?/submitFinal"
        formmethod="POST"
        use:enhance={() => {
          loadingSubmit = true;
          return async ({ update }) => {
            await update();
            loadingSubmit = false;
          };
        }}
        class="rounded bg-[--accent-blue] px-4 py-2 text-white"
        disabled={loadingSubmit}
      >
        {loadingSubmit ? "Збереження..." : "Підтвердити оцінку"}
      </button>
      <button
        formaction="?/saveDraft"
        formmethod="POST"
        use:enhance={() => {
          loadingDraft = true;
          return async ({ update }) => {
            await update();
            loadingDraft = false;
          };
        }}
        class="rounded border border-[--border] px-4 py-2"
        disabled={loadingDraft}
      >
        {loadingDraft ? "Збереження..." : "Зберегти чернетку"}
      </button>
    </div>
    <div class="flex justify-between text-sm">
      {#if data.prev}
        <a href={`/jury/works/${data.prev.workId}`}>← Попередня</a>
      {:else}
        <span />
      {/if}
      {#if data.next}
        <a href={`/jury/works/${data.next.workId}`}>Наступна →</a>
      {/if}
    </div>
  </section>
</form>
