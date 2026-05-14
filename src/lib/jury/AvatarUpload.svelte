<script lang="ts">
  let { avatarUrl = "", onUploaded } = $props<{
    avatarUrl?: string | null;
    onUploaded?: (url: string) => void;
  }>();

  let uploading = $state(false);
  let uploadError = $state("");

  async function uploadAvatar(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    uploadError = "";
    uploading = true;
    const data = new FormData();
    data.append("avatar", file);
    const response = await fetch("/jury/api/avatar", { method: "POST", body: data });
    const result = (await response.json()) as { url?: string; error?: string };
    uploading = false;
    if (!response.ok || !result.url) {
      uploadError = result.error ?? "Помилка завантаження";
      return;
    }
    onUploaded?.(result.url);
  }
</script>

<div>
  <label class="relative block h-36 w-32 cursor-pointer overflow-hidden rounded-lg border border-[--border]">
    <img src={avatarUrl || "/favicon.png"} alt="Аватар" class="h-full w-full object-cover" />
    <input type="file" accept="image/*" class="hidden" onchange={uploadAvatar} />
  </label>
  {#if uploading}<p class="mt-1 text-xs text-[--text-secondary]">Завантаження...</p>{/if}
  {#if uploadError}<p class="mt-1 text-xs text-red-400">{uploadError}</p>{/if}
</div>
