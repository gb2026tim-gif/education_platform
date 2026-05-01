<script lang="ts">
  import { page } from "$app/state";

  const items = [
    { href: "/jury/account", label: "Мій акаунт", icon: "👤" },
    { href: "/jury/works", label: "Мої роботи", icon: "📋" }
  ];
</script>

<aside class="flex h-full w-[180px] flex-col border-r border-[--border] bg-black/30 px-3 py-4">
  <div class="mb-3 text-xs text-[--text-secondary]">Кабінет</div>
  <nav class="space-y-1">
    {#each items as item}
      {@const active = page.url.pathname.startsWith(item.href)}
      <a
        href={item.href}
        class={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition ${
          active ? "bg-[--accent-blue] text-white" : "text-[--text-secondary] hover:bg-[--bg-card]"
        }`}
      >
        <span aria-hidden="true">{item.icon}</span>
        {item.label}
      </a>
    {/each}
  </nav>

  <div class="mb-3 mt-5 text-xs text-[--text-secondary]">Система</div>
  <a
    href="/jury/settings"
    class={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition ${
      page.url.pathname.startsWith("/jury/settings")
        ? "bg-[--accent-blue] text-white"
        : "text-[--text-secondary] hover:bg-[--bg-card]"
    }`}
  >
    <span aria-hidden="true">⚙️</span>
    Налаштування
  </a>

  <form method="POST" action="/jury/api/logout" class="mt-auto">
    <button
      type="submit"
      class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-red-400 transition hover:bg-[--bg-card]"
    >
      <span aria-hidden="true">↩</span>
      Вийти
    </button>
  </form>
</aside>
