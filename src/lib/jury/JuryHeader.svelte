<script lang="ts">
  interface Props {
    jurorName?: string;
    avatarUrl?: string | null;
  }
  let { jurorName = "", avatarUrl = "" }: Props = $props();

  function getInitial(name: string) {
    return name?.[0]?.toUpperCase() ?? "J";
  }
</script>

<header class="jury-header">
  <!-- Logo -->
  <a href="/jury/account" class="logo">
    <span class="logo-lv">Lv</span><span class="logo-up">Up</span>
  </a>

  <!-- Center: Панель журі -->
  <div class="panel-badge">Панель журі</div>

  <!-- Right: icons + user -->
  <div class="header-right">
    <button class="icon-btn" aria-label="Пошук">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </button>
    <button class="icon-btn" aria-label="Тема">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    </button>
    <div class="user-chip">
      {#if avatarUrl}
        <img src={avatarUrl} alt="Avatar" class="user-avatar-img" />
      {:else}
        <div class="user-avatar-placeholder">{getInitial(jurorName)}</div>
      {/if}
      <div class="user-info">
        {#if jurorName}
          <span class="user-name">{jurorName}</span>
        {:else}
          <span class="user-name sign-in">Log in / Sign in</span>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  .jury-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    background: #0d1117;
    border-bottom: 1px solid #21262d;
    flex-shrink: 0;
  }

  .logo {
    font-size: 22px;
    font-weight: 800;
    text-decoration: none;
    letter-spacing: -0.5px;
    font-family: 'Space Grotesk', sans-serif;
  }
  .logo-lv { color: #e6edf3; }
  .logo-up { color: #1f6feb; }

  .panel-badge {
    padding: 7px 24px;
    border: 1.5px solid rgba(31, 111, 235, 0.55);
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    color: #e6edf3;
    background: rgba(31, 111, 235, 0.08);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: #8b949e;
    transition: background 0.12s, color 0.12s;
  }
  .icon-btn:hover { background: #161b22; color: #e6edf3; }

  .user-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 4px;
    border-radius: 20px;
    border: 1px solid #21262d;
    background: #161b22;
  }

  .user-avatar-img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-avatar-placeholder {
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

  .user-name {
    font-size: 12px;
    font-weight: 500;
    color: #e6edf3;
    white-space: nowrap;
  }
  .user-name.sign-in { color: #8b949e; }
</style>
