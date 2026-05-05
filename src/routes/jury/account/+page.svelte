<!-- src/routes/jury/account/+page.svelte -->
<script lang="ts">
  import type { PageData } from "./$types";
  import PasswordModal from "$lib/jury/PasswordModal.svelte";

  let { data }: { data: PageData } = $props();

  let avatarUrl = $state("");
  let showPasswordModal = $state(false);
  let passwordChanged = $state(false);
  let uploading = $state(false);
  let showBanner = $state(false);

  // Ініціалізуємо з data через $effect щоб не було warnings
  $effect(() => {
    avatarUrl = data.juror.avatarUrl ?? "";
    passwordChanged = data.juror.passwordChanged;
    showBanner = !data.juror.passwordChanged;
  });

  function getInitial(name: string) {
    return name?.[0]?.toUpperCase() ?? "J";
  }

  async function handleAvatarChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    uploading = true;
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await fetch("/jury/api/avatar", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) avatarUrl = json.url;
    } catch {
      console.error("Avatar upload failed");
    } finally {
      uploading = false;
    }
  }

  function fmtDate(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("uk-UA", {
      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
    });
  }
</script>

<svelte:head><title>Мій акаунт — Панель журі</title></svelte:head>

<style>
  .bc   { font-size: 12px; color: #484f58; margin-bottom: 8px; }
  .bc a { color: #8b949e; text-decoration: none; }
  .bc a:hover { color: #58a6ff; }
  .cur  { color: #58a6ff; }

  .h1 { font-size: 28px; font-weight: 700; color: #e6edf3; margin-bottom: 24px; font-family: 'Space Grotesk', sans-serif; }

  .grid { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }

  /* Left card */
  .profile-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .avatar-wrap {
    position: relative;
    width: 100px;
    height: 100px;
    margin-bottom: 14px;
    cursor: pointer;
  }

  .avatar-img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid #21262d; }

  .avatar-placeholder {
    width: 100px; height: 100px; border-radius: 50%;
    background: #1f6feb;
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; font-weight: 700; color: #fff;
    border: 2px solid #21262d;
  }

  .avatar-overlay {
    position: absolute; bottom: 4px; right: 4px;
    width: 26px; height: 26px; border-radius: 50%;
    background: #1f6feb; border: 2px solid #0d1117;
    display: flex; align-items: center; justify-content: center;
    color: #fff; cursor: pointer; transition: background 0.12s;
  }
  .avatar-overlay:hover { background: #388bfd; }

  .juror-name  { font-size: 17px; font-weight: 700; color: #e6edf3; margin-bottom: 3px; text-align: center; }
  .juror-email { font-size: 12px; color: #8b949e; margin-bottom: 16px; text-align: center; }

  .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%; margin-bottom: 14px; }

  .stat-cell {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 10px 6px;
    text-align: center;
  }

  .stat-val   { font-size: 20px; font-weight: 700; color: #e6edf3; font-family: 'JetBrains Mono', monospace; display: block; }
  .stat-label { font-size: 10px; color: #484f58; display: block; margin-top: 2px; }

  .works-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 13px; color: #58a6ff; text-decoration: none;
    margin-bottom: 20px;
    transition: color 0.12s;
  }
  .works-link:hover { color: #388bfd; }

  .field-group { width: 100%; display: flex; flex-direction: column; gap: 10px; }

  .field-label { font-size: 11px; color: #484f58; margin-bottom: 4px; display: block; }

  .field-display {
    display: flex; align-items: center; justify-content: space-between;
    padding: 9px 12px; border-radius: 7px;
    background: #0d1117; border: 1px solid #21262d;
    font-size: 13px; color: #8b949e;
  }

  .field-icon { color: #484f58; }

  /* Right card */
  .evaluated-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 12px;
    padding: 20px 22px;
  }

  .evaluated-title {
    font-size: 16px; font-weight: 700; color: #58a6ff;
    margin-bottom: 16px;
  }

  .eval-item {
    background: #0d1117;
    border: 1px solid #21262d;
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 10px;
  }

  .eval-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 8px;
  }

  .eval-team { font-size: 13px; font-weight: 600; color: #e6edf3; }
  .eval-meta { font-size: 11px; color: #484f58; }

  .eval-scores {
    display: flex; gap: 16px; flex-wrap: wrap;
    padding: 8px 0; border-top: 1px solid #21262d;
    margin-top: 6px;
  }

  .escore { display: flex; flex-direction: column; gap: 1px; }
  .escore-label { font-size: 10px; color: #484f58; }
  .escore-val   { font-size: 14px; font-weight: 700; color: #e6edf3; font-family: 'JetBrains Mono', monospace; }
  .escore.avg .escore-val { color: #58a6ff; }

  .eval-comment { font-size: 11px; color: #8b949e; margin-top: 6px; font-style: italic; }

  .eval-action {
    display: inline-flex; align-items: center;
    padding: 5px 12px; border-radius: 6px;
    background: #21262d; border: 1px solid #30363d;
    font-size: 12px; color: #e6edf3;
    text-decoration: none; font-weight: 500;
    transition: background 0.12s;
  }
  .eval-action:hover { background: #30363d; }

  .no-evals { font-size: 13px; color: #484f58; text-align: center; padding: 24px 0; }

  /* Banner */
  .banner {
    position: fixed; bottom: 20px; right: 20px;
    background: #1c2333; border: 1px solid rgba(158, 106, 3, 0.5);
    border-radius: 10px; padding: 14px 16px;
    max-width: 340px; width: 100%;
    box-shadow: 0 8px 32px rgba(0,0,0,.4);
    z-index: 50;
  }

  .banner-title { font-size: 13px; font-weight: 600; color: #e3b341; margin-bottom: 6px; }
  .banner p { font-size: 12px; color: #8b949e; line-height: 1.5; margin-bottom: 10px; }

  .banner-close {
    position: absolute; top: 10px; right: 10px;
    width: 22px; height: 22px; border-radius: 4px;
    background: none; border: none; cursor: pointer;
    color: #484f58; display: flex; align-items: center; justify-content: center;
  }
  .banner-close:hover { color: #8b949e; }

  .banner-btn {
    padding: 7px 18px; border-radius: 6px;
    background: #1f6feb; color: #fff;
    font-size: 13px; font-weight: 600;
    border: none; cursor: pointer; font-family: inherit;
    transition: background 0.12s;
  }
  .banner-btn:hover { background: #388bfd; }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
</style>

<div class="bc">
  <a href="/jury/account">Кабінет</a> / <span class="cur">Мій акаунт</span>
</div>
<h1 class="h1">Мій акаунт</h1>

<div class="grid">
  <!-- Left: Profile -->
  <div class="profile-card">
    <!-- Avatar -->
    <label class="avatar-wrap" aria-label="Завантажити фото">
      {#if avatarUrl}
        <img src={avatarUrl} alt="Аватар" class="avatar-img" />
      {:else}
        <div class="avatar-placeholder">{getInitial(data.juror.name)}</div>
      {/if}
      <div class="avatar-overlay">
        {#if uploading}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
          </svg>
        {:else}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        {/if}
      </div>
      <input type="file" accept="image/*" class="sr-only" onchange={handleAvatarChange} />
    </label>

    <div class="juror-name">{data.juror.name}</div>
    <div class="juror-email">{data.juror.email}</div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-cell">
        <span class="stat-val">{data.stats.total}</span>
        <span class="stat-label">Всього призначено</span>
      </div>
      <div class="stat-cell">
        <span class="stat-val">{data.stats.evaluated}</span>
        <span class="stat-label">Оцінено</span>
      </div>
      <div class="stat-cell">
        <span class="stat-val">{data.stats.pending}</span>
        <span class="stat-label">Очікують</span>
      </div>
    </div>

    <a href="/jury/works" class="works-link">
      До робіт
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>

    <!-- Fields -->
    <div class="field-group">
      <div>
        <span class="field-label">E-mail</span>
        <div class="field-display">
          <span>{data.juror.email}</span>
          <span class="field-icon">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
        </div>
      </div>
      <div>
        <span class="field-label">Пароль</span>
        <div class="field-display">
          <span style="letter-spacing:3px;color:#484f58;">••••••••</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Right: Evaluated works -->
  <div class="evaluated-card">
    <div class="evaluated-title">Оцінено</div>

    {#if data.evaluatedWorks.length === 0}
      <div class="no-evals">Оцінок поки немає.</div>
    {:else}
      {#each data.evaluatedWorks as work}
        <div class="eval-item">
          <div class="eval-top">
            <div>
              <div class="eval-team">{work.teamLabel}</div>
              <div class="eval-meta">
                {work.tournamentName}
                {#if work.evaluatedAt}· Оцінено {fmtDate(work.evaluatedAt)}{/if}
              </div>
            </div>
            <a href={`/jury/works/${work.id}`} class="eval-action">Переглянути</a>
          </div>

          {#if work.scores}
            <div class="eval-scores">
              <div class="escore"><span class="escore-label">Frontend</span><span class="escore-val">{work.scores.frontendCode}</span></div>
              <div class="escore"><span class="escore-label">Backend</span><span class="escore-val">{work.scores.backendCode}</span></div>
              <div class="escore"><span class="escore-label">БД</span><span class="escore-val">{work.scores.databaseStructure}</span></div>
              <div class="escore"><span class="escore-label">Додатково</span><span class="escore-val">{work.scores.databaseFunctionality}</span></div>
              <div class="escore"><span class="escore-label">Функціональність</span><span class="escore-val">{work.scores.frontendFunctionality}</span></div>
              <div class="escore avg"><span class="escore-label">Середній</span><span class="escore-val">{work.average ?? 0}</span></div>
            </div>
          {/if}

          {#if work.comment}
            <div class="eval-comment">{work.comment}</div>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<!-- Password reminder banner -->
{#if showBanner}
  <div class="banner">
    <button class="banner-close" onclick={() => (showBanner = false)} aria-label="Закрити">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
    <div class="banner-title">Нагадування:</div>
    <p>Ви використовуєте <strong style="color:#e3b341;">одноразовий пароль</strong>, будь ласка, змініть його на ваш надійний</p>
    <button class="banner-btn" onclick={() => (showPasswordModal = true)}>Змінити</button>
  </div>
{/if}

<PasswordModal
        bind:open={showPasswordModal}
        onChanged={() => {
    passwordChanged = true;
    showBanner = false;
  }}
/>