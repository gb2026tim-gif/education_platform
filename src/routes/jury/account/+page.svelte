<!-- src/routes/jury/account/+page.svelte -->
<script lang="ts">
  import type { PageData, ActionData } from "./$types";
  import { enhance } from "$app/forms";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let avatarUrl = $state("");
  let showBanner = $state(false);
  let editingName = $state(false);
  let showPwdForm = $state(false);
  let uploading = $state(false);
  let savingName = $state(false);
  let savingPwd = $state(false);

  $effect(() => {
    avatarUrl = data.juror.avatarUrl ?? "";
    showBanner = !data.juror.passwordChanged;
  });

  // Закриваємо форми після успіху
  $effect(() => {
    if (form?.nameSuccess) editingName = false;
    if (form?.pwdSuccess) { showPwdForm = false; showBanner = false; }
  });

  function getInitial(name: string) { return name?.[0]?.toUpperCase() ?? "J"; }

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
    } catch { /* ignore */ }
    finally { uploading = false; }
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
  .bc   { font-size:12px; color:#484f58; margin-bottom:8px; }
  .bc a { color:#8b949e; text-decoration:none; }
  .bc a:hover { color:#58a6ff; }
  .cur  { color:#58a6ff; }
  .h1   { font-size:28px; font-weight:700; color:#e6edf3; margin-bottom:24px; font-family:'Space Grotesk',sans-serif; }
  :global(.light-mode) .h1 { color:#0a0e1a; }

  .grid { display:grid; grid-template-columns:300px 1fr; gap:20px; }
  @media(max-width:900px){ .grid { grid-template-columns:1fr; } }

  /* ── Profile card ── */
  .profile-card {
    background:#161b22; border:1px solid #21262d; border-radius:12px;
    padding:24px; display:flex; flex-direction:column; align-items:center; gap:0;
  }
  :global(.light-mode) .profile-card { background:#fff; border-color:rgba(10,14,26,.08); }

  /* Avatar */
  .avatar-wrap { position:relative; width:100px; height:100px; margin-bottom:14px; }
  .avatar-img  { width:100px; height:100px; border-radius:50%; object-fit:cover; border:2px solid #21262d; }
  .avatar-placeholder {
    width:100px; height:100px; border-radius:50%;
    background:#1f6feb; display:flex; align-items:center; justify-content:center;
    font-size:36px; font-weight:700; color:#fff; border:2px solid #21262d;
  }
  .avatar-btn {
    position:absolute; bottom:4px; right:4px;
    width:26px; height:26px; border-radius:50%;
    background:#1f6feb; border:2px solid #0d1117;
    display:flex; align-items:center; justify-content:center;
    color:#fff; cursor:pointer; transition:background .12s;
  }
  .avatar-btn:hover { background:#388bfd; }

  /* Name */
  .juror-name  { font-size:17px; font-weight:700; color:#e6edf3; text-align:center; margin-bottom:3px; }
  .juror-email { font-size:12px; color:#8b949e; margin-bottom:16px; text-align:center; }
  :global(.light-mode) .juror-name  { color:#0a0e1a; }
  :global(.light-mode) .juror-email { color:rgba(10,14,26,.5); }

  /* Edit name */
  .edit-name-btn {
    font-size:12px; color:#58a6ff; background:none; border:none;
    cursor:pointer; font-family:inherit; margin-bottom:12px;
    padding:3px 8px; border-radius:5px; transition:background .12s;
  }
  .edit-name-btn:hover { background:rgba(88,166,255,.1); }

  .name-form { width:100%; margin-bottom:12px; }
  .name-input {
    width:100%; padding:8px 10px; border-radius:7px;
    border:1.5px solid #1f6feb; background:#0d1117;
    color:#e6edf3; font-size:14px; font-family:inherit;
    outline:none; box-sizing:border-box; margin-bottom:6px;
  }
  :global(.light-mode) .name-input { background:#f0f4ff; color:#0a0e1a; }
  .name-btns { display:flex; gap:6px; }
  .btn-save   { flex:1; padding:7px; border-radius:7px; background:#1f6feb; color:#fff; font-size:13px; font-weight:600; border:none; cursor:pointer; font-family:inherit; }
  .btn-cancel { flex:1; padding:7px; border-radius:7px; background:#21262d; color:#8b949e; font-size:13px; border:none; cursor:pointer; font-family:inherit; }

  /* Stats */
  .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:100%; margin-bottom:14px; }
  .stat-cell  { background:#0d1117; border:1px solid #21262d; border-radius:8px; padding:10px 6px; text-align:center; }
  :global(.light-mode) .stat-cell { background:#f0f4ff; border-color:rgba(10,14,26,.08); }
  .stat-val   { font-size:20px; font-weight:700; color:#e6edf3; display:block; font-family:'JetBrains Mono',monospace; }
  .stat-lbl   { font-size:10px; color:#484f58; display:block; margin-top:2px; }
  :global(.light-mode) .stat-val { color:#0a0e1a; }

  .works-link { display:inline-flex; align-items:center; gap:5px; font-size:13px; color:#58a6ff; text-decoration:none; margin-bottom:18px; }
  .works-link:hover { color:#388bfd; }

  /* Fields */
  .field-group { width:100%; display:flex; flex-direction:column; gap:10px; }
  .field-lbl   { font-size:11px; color:#484f58; margin-bottom:4px; display:block; }
  .field-val   { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; border-radius:7px; background:#0d1117; border:1px solid #21262d; font-size:13px; color:#8b949e; }
  :global(.light-mode) .field-val { background:#f0f4ff; border-color:rgba(10,14,26,.08); }

  /* Password form */
  .pwd-section { width:100%; margin-top:12px; }
  .pwd-toggle  { width:100%; padding:8px; border-radius:7px; background:rgba(31,111,235,.1); border:1px solid rgba(31,111,235,.25); color:#58a6ff; font-size:13px; font-weight:600; cursor:pointer; font-family:inherit; transition:background .12s; }
  .pwd-toggle:hover { background:rgba(31,111,235,.2); }

  .pwd-form { margin-top:10px; display:flex; flex-direction:column; gap:8px; }
  .pwd-input {
    width:100%; padding:9px 12px; border-radius:7px;
    border:1.5px solid #21262d; background:#0d1117;
    color:#e6edf3; font-size:13px; font-family:inherit;
    outline:none; box-sizing:border-box;
    transition:border-color .12s;
  }
  .pwd-input:focus { border-color:#1f6feb; }
  :global(.light-mode) .pwd-input { background:#f0f4ff; color:#0a0e1a; border-color:rgba(10,14,26,.12); }

  .pwd-hint { font-size:11px; color:#484f58; line-height:1.5; }
  .btn-pwd  { padding:9px; border-radius:7px; background:#1f6feb; color:#fff; font-size:13px; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:background .12s; }
  .btn-pwd:hover:not(:disabled) { background:#388bfd; }
  .btn-pwd:disabled { opacity:.4; cursor:not-allowed; }

  .msg-ok  { font-size:12px; color:#3ecf7c; padding:6px 10px; background:rgba(62,207,124,.1); border-radius:6px; border:1px solid rgba(62,207,124,.2); }
  .msg-err { font-size:12px; color:#f85149; padding:6px 10px; background:rgba(248,81,73,.1); border-radius:6px; border:1px solid rgba(248,81,73,.2); }

  /* ── Evaluated card ── */
  .evaluated-card { background:#161b22; border:1px solid #21262d; border-radius:12px; padding:20px 22px; }
  :global(.light-mode) .evaluated-card { background:#fff; border-color:rgba(10,14,26,.08); }
  .eval-title { font-size:16px; font-weight:700; color:#58a6ff; margin-bottom:16px; }

  .eval-item { background:#0d1117; border:1px solid #21262d; border-radius:8px; padding:12px 14px; margin-bottom:10px; }
  :global(.light-mode) .eval-item { background:#f8faff; border-color:rgba(10,14,26,.08); }
  .eval-top  { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .eval-team { font-size:13px; font-weight:600; color:#e6edf3; }
  .eval-meta { font-size:11px; color:#484f58; margin-top:2px; }
  :global(.light-mode) .eval-team { color:#0a0e1a; }

  .eval-scores { display:flex; gap:16px; flex-wrap:wrap; padding:8px 0; border-top:1px solid #21262d; margin-top:6px; }
  :global(.light-mode) .eval-scores { border-color:rgba(10,14,26,.08); }
  .escore { display:flex; flex-direction:column; gap:1px; }
  .escore-lbl { font-size:10px; color:#484f58; }
  .escore-val { font-size:14px; font-weight:700; color:#e6edf3; font-family:'JetBrains Mono',monospace; }
  .escore.avg .escore-val { color:#58a6ff; }
  :global(.light-mode) .escore-val { color:#0a0e1a; }

  .eval-comment { font-size:11px; color:#8b949e; margin-top:6px; font-style:italic; }
  .eval-link    { display:inline-flex; align-items:center; padding:5px 12px; border-radius:6px; background:#21262d; border:1px solid #30363d; font-size:12px; color:#e6edf3; text-decoration:none; }
  .eval-link:hover { background:#30363d; }
  :global(.light-mode) .eval-link { background:#f0f4ff; border-color:rgba(10,14,26,.1); color:#0a0e1a; }

  .no-evals { font-size:13px; color:#484f58; text-align:center; padding:24px 0; }

  /* Banner */
  .banner { position:fixed; bottom:20px; right:20px; background:#1c2333; border:1px solid rgba(158,106,3,.5); border-radius:10px; padding:14px 16px; max-width:340px; box-shadow:0 8px 32px rgba(0,0,0,.4); z-index:50; }
  .banner-title { font-size:13px; font-weight:600; color:#e3b341; margin-bottom:6px; }
  .banner p     { font-size:12px; color:#8b949e; line-height:1.5; margin-bottom:10px; }
  .banner-close { position:absolute; top:10px; right:10px; width:22px; height:22px; background:none; border:none; cursor:pointer; color:#484f58; display:flex; align-items:center; justify-content:center; border-radius:4px; }
  .banner-close:hover { color:#8b949e; }
  .banner-btn   { padding:7px 18px; border-radius:6px; background:#1f6feb; color:#fff; font-size:13px; font-weight:600; border:none; cursor:pointer; font-family:inherit; }
  .banner-btn:hover { background:#388bfd; }

  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }</style>

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
      <div class="avatar-btn">
        {#if uploading}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/></svg>
        {:else}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        {/if}
      </div>
      <input type="file" accept="image/*" class="sr-only" onchange={handleAvatarChange} />
    </label>

    <!-- Name -->
    {#if editingName}
      <form class="name-form" method="POST" action="?/updateName"
        use:enhance={() => { savingName = true; return async ({update}) => { await update(); savingName = false; }; }}>
        <input name="name" class="name-input" value={data.juror.name} placeholder="Ім'я Прізвище" required minlength="2" />
        {#if form?.nameError}<div class="msg-err">{form.nameError}</div>{/if}
        <div class="name-btns">
          <button type="submit" class="btn-save" disabled={savingName}>{savingName ? "..." : "Зберегти"}</button>
          <button type="button" class="btn-cancel" onclick={() => editingName = false}>Скасувати</button>
        </div>
      </form>
    {:else}
      <div class="juror-name">{data.juror.name}</div>
      <div class="juror-email">{data.juror.email}</div>
      <button class="edit-name-btn" onclick={() => editingName = true}>
        ✏️ Змінити ім'я
      </button>
    {/if}

    {#if form?.nameSuccess && !editingName}
      <div class="msg-ok" style="margin-bottom:8px;">✓ Ім'я оновлено!</div>
    {/if}

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-cell"><span class="stat-val">{data.stats.total}</span><span class="stat-lbl">Всього</span></div>
      <div class="stat-cell"><span class="stat-val">{data.stats.evaluated}</span><span class="stat-lbl">Оцінено</span></div>
      <div class="stat-cell"><span class="stat-val">{data.stats.pending}</span><span class="stat-lbl">Очікують</span></div>
    </div>

    <a href="/jury/works" class="works-link">
      До робіт →
    </a>

    <!-- Fields -->
    <div class="field-group">
      <div>
        <span class="field-lbl">E-mail</span>
        <div class="field-val">
          <span>{data.juror.email}</span>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#484f58"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
      </div>
      <div>
        <span class="field-lbl">Пароль</span>
        <div class="field-val">
          <span style="letter-spacing:3px;color:#484f58;">••••••••</span>
        </div>
      </div>
    </div>

    <!-- Password change -->
    <div class="pwd-section">
      <button class="pwd-toggle" onclick={() => showPwdForm = !showPwdForm}>
        {showPwdForm ? "Сховати" : "🔐 Змінити пароль"}
      </button>

      {#if showPwdForm}
        <form class="pwd-form" method="POST" action="?/changePassword"
          use:enhance={() => { savingPwd = true; return async ({update}) => { await update(); savingPwd = false; }; }}>

          {#if data.juror.passwordChanged}
          <input name="oldPassword" type="password" class="pwd-input"
            placeholder="Поточний пароль" required autocomplete="current-password" />
          {:else}
          <input name="oldPassword" type="hidden" value="" />
          {/if}

          <input name="newPassword" type="password" class="pwd-input"
            placeholder="Новий пароль" required autocomplete="new-password" />

          <input name="confirmPassword" type="password" class="pwd-input"
            placeholder="Повторіть новий пароль" required autocomplete="new-password" />

          <div class="pwd-hint">Мінімум 8 символів, велика літера, цифра та спецсимвол (@, #, $...)</div>

          {#if form?.pwdError}
            <div class="msg-err">{form.pwdError}</div>
          {/if}
          {#if form?.pwdSuccess}
            <div class="msg-ok">✓ Пароль змінено! Наступного разу входь з новим паролем.</div>
          {/if}

          <button type="submit" class="btn-pwd" disabled={savingPwd}>
            {savingPwd ? "Збереження..." : "Зберегти пароль"}
          </button>
        </form>
      {/if}
    </div>
  </div>

  <!-- Right: Evaluated works -->
  <div class="evaluated-card">
    <div class="eval-title">Оцінено</div>

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
            <a href={`/jury/works/${work.id}`} class="eval-link">Переглянути</a>
          </div>
          {#if work.scores}
            <div class="eval-scores">
              <div class="escore"><span class="escore-lbl">Frontend</span><span class="escore-val">{work.scores.frontendCode}</span></div>
              <div class="escore"><span class="escore-lbl">Backend</span><span class="escore-val">{work.scores.backendCode}</span></div>
              <div class="escore"><span class="escore-lbl">БД</span><span class="escore-val">{work.scores.databaseStructure}</span></div>
              <div class="escore"><span class="escore-lbl">Додатково</span><span class="escore-val">{work.scores.databaseFunctionality}</span></div>
              <div class="escore"><span class="escore-lbl">Функціонал</span><span class="escore-val">{work.scores.frontendFunctionality}</span></div>
              <div class="escore avg"><span class="escore-lbl">Середній</span><span class="escore-val">{work.average ?? 0}</span></div>
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
    <button class="banner-close" onclick={() => showBanner = false} aria-label="Закрити">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div class="banner-title">Нагадування:</div>
    <p>Ви використовуєте <strong style="color:#e3b341;">одноразовий пароль</strong>. Будь ласка, змініть його на надійний.</p>
    <button class="banner-btn" onclick={() => { showBanner = false; showPwdForm = true; window.scrollTo(0,0); }}>
      Змінити
    </button>
  </div>
{/if}


