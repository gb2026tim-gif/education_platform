<script lang="ts">
  import { page } from "$app/state";

  const errorMap: Record<string, string> = {
    missing_token: "У посиланні немає токена доступу.",
    token_not_found: "Токен не знайдено. Перевірте посилання з email.",
    token_used: "Це посилання вже використано. Запросіть нове.",
    token_expired: "Термін дії посилання завершився. Запросіть нове."
  };

  const errorCode = $derived(page.url.searchParams.get("error") ?? "");
  const errorText = $derived(errorMap[errorCode] ?? "");
</script>

<div class="mx-auto mt-24 max-w-xl rounded-xl border border-[--border] bg-[--bg-card] p-8 text-center">
  <h1 class="mb-3 text-3xl" style="font-family: 'Space Grotesk', sans-serif;">Доступ лише через email</h1>
  <p class="text-[--text-secondary]">Для входу в панель журі використайте магічне посилання з вашої пошти.</p>
  {#if errorText}
    <p class="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-300">
      {errorText}
    </p>
  {/if}
</div>
