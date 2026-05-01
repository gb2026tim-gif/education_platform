<script lang="ts">
  let { jurorName = "Log in / Sign in", avatarUrl = "" } = $props<{
    jurorName?: string;
    avatarUrl?: string | null;
  }>();
</script>

<header class="flex h-16 items-center justify-between border-b border-[--border] bg-[--bg-base] px-6">
  <div class="text-3xl font-bold text-[--accent-blue]">LvlUp</div>
  <div class="rounded-xl border border-[--accent-blue]/60 px-8 py-2 font-medium text-[--text-primary]">
    Панель журі
  </div>
  <div class="flex items-center gap-4 text-[--text-secondary]">
    <button aria-label="Пошук" class="rounded-md p-1.5 transition hover:bg-[--bg-card]">
      <span aria-hidden="true">🔎</span>
    </button>
    <button aria-label="Тільки темна тема" class="rounded-md p-1.5 transition hover:bg-[--bg-card]">
      <span aria-hidden="true">🌙</span>
    </button>
    <div class="flex items-center gap-2">
      <img
        src={avatarUrl || "/favicon.png"}
        alt="Avatar"
        class="h-8 w-8 rounded-full border border-[--border] object-cover"
      />
      <span class="text-xs text-[--text-secondary]">{jurorName}</span>
    </div>
  </div>
</header>
