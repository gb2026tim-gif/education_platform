<script lang="ts">
  let { open = $bindable(false), onChanged } = $props<{
    open?: boolean;
    onChanged?: () => void;
  }>();

  let password = $state("");
  let loading = $state(false);
  let errorText = $state("");

  async function savePassword() {
    errorText = "";
    loading = true;
    const response = await fetch("/jury/api/change-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = (await response.json()) as { error?: string };
    loading = false;
    if (!response.ok) {
      errorText = data.error ?? "Помилка";
      return;
    }
    open = false;
    password = "";
    onChanged?.();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="w-[480px] rounded-xl border border-[--border] bg-[--bg-card] p-8">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl text-[--text-primary]">Змінити пароль</h2>
        <button aria-label="Закрити" on:click={() => (open = false)} class="text-[--text-secondary]">✕</button>
      </div>
      <input
        type="password"
        bind:value={password}
        placeholder="••••••••"
        class="mb-2 w-full rounded border border-[--border] bg-[--bg-base] px-3 py-2 text-[--text-primary] outline-none focus:border-[--border-focus]"
      />
      <p class="mb-4 text-xs text-[--text-secondary]">
        Довжина мінімум 8 символів, з великою літерою, цифрою та спецсимволом.
      </p>
      {#if errorText}<p class="mb-3 text-sm text-red-400">{errorText}</p>{/if}
      <button
        on:click={savePassword}
        disabled={loading}
        class="rounded bg-[--accent-blue] px-4 py-2 text-white disabled:opacity-60"
      >
        {loading ? "Збереження..." : "Зберегти"}
      </button>
    </div>
  </div>
{/if}
