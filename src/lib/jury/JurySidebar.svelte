<script lang="ts">
  import { page } from "$app/state";

  interface Props {
    juror?: { name: string; email: string; avatarUrl?: string | null } | null;
  }
  let { juror }: Props = $props();

  const nav = [
    {
      section: "Кабінет",
      items: [
        { href: "/jury/account", label: "Мій акаунт", icon: "person" },
        { href: "/jury/works",   label: "Мої роботи", icon: "clipboard" },
      ],
    },
    {
      section: "Система",
      items: [
        { href: "/jury/settings", label: "Налаштування", icon: "settings" },
      ],
    },
  ];

  function isActive(href: string) {
    return page.url.pathname === href || page.url.pathname.startsWith(href + "/");
  }
</script>

<aside class="sidebar">
  <nav class="nav">
    {#each nav as group}
      <div class="nav-group">
        <span class="nav-label">{group.section}</span>
        {#each group.items as item}
          <a
            href={item.href}
            class="nav-item"
            class:active={isActive(item.href)}
          >
            {#if item.icon === "person"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            {:else if item.icon === "clipboard"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="16" x2="13" y2="16"/>
              </svg>
            {:else if item.icon === "settings"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            {/if}
            {item.label}
          </a>
        {/each}
      </div>
    {/each}
  </nav>

  <!-- Sticky logout -->
  <div class="logout-wrap">
    {#if juror}
      <div class="juror-mini">
        <div class="juror-avatar">
          {juror.name?.[0]?.toUpperCase() ?? "J"}
        </div>
        <div class="juror-info">
          <div class="juror-name">{juror.name}</div>
          <div class="juror-email">{juror.email}</div>
        </div>
      </div>
    {/if}
    <form method="POST" action="/jury/api/logout">
      <button type="submit" class="logout-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Вийти
      </button>
    </form>
  </div>
</aside>

<style>
  .sidebar {
    width: 200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    background: #0d1117;
    border-right: 1px solid #21262d;
    min-height: 100%;
  }

  .nav {
    flex: 1;
    padding: 1rem 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    overflow-y: auto;
  }

  .nav-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #484f58;
    padding: 0 0.5rem;
    margin-bottom: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #8b949e;
    text-decoration: none;
    transition: background 0.12s, color 0.12s;
  }

  .nav-item:hover {
    background: #161b22;
    color: #e6edf3;
  }

  .nav-item.active {
    background: #1f6feb;
    color: #ffffff;
  }

  .logout-wrap {
    flex-shrink: 0;
    padding: 0.75rem 0.5rem 1.25rem;
    border-top: 1px solid #21262d;
    background: #0d1117;
  }

  .juror-mini {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    margin-bottom: 6px;
  }

  .juror-avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #1f6feb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }

  .juror-info { min-width: 0; }
  .juror-name  { font-size: 12px; font-weight: 600; color: #e6edf3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .juror-email { font-size: 10px; color: #484f58; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #f85149;
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;
  }

  .logout-btn:hover {
    background: rgba(248, 81, 73, 0.1);
  }

  /* Light mode */
  :global(.light-mode) .sidebar {
    background: #ffffff;
    border-right-color: rgba(10,14,26,.08);
  }
  :global(.light-mode) .nav-label {
    color: rgba(10,14,26,.35);
  }
  :global(.light-mode) .nav-item {
    color: rgba(10,14,26,.55);
  }
  :global(.light-mode) .nav-item:hover {
    background: rgba(31,111,235,.07);
    color: #0a0e1a;
  }
  :global(.light-mode) .nav-item.active {
    background: rgba(31,111,235,.12);
    color: #1a5cc8;
  }
  :global(.light-mode) .logout-wrap {
    background: #ffffff;
    border-top-color: rgba(10,14,26,.08);
  }
  :global(.light-mode) .juror-name { color: #0a0e1a; }
  :global(.light-mode) .juror-email { color: rgba(10,14,26,.5); }
  :global(.light-mode) .logout-btn { color: rgba(10,14,26,.5); }
  :global(.light-mode) .logout-btn:hover {
    color: #dc2626;
    background: rgba(220,38,38,.07);
  }
  :global(.light-mode) .juror-avatar { border-color: #e0e8ff; }
</style>
