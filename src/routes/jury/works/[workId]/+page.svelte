<!-- src/routes/jury/works/[workId]/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ScoreSlider from "$lib/jury/ScoreSlider.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const ev = data.assignment.evaluation;
  let backendCode = $state(ev?.backendCode ?? 50);
  let databaseStructure = $state(ev?.databaseStructure ?? 50);
  let frontendCode = $state(ev?.frontendCode ?? 50);
  let backendFunctionality = $state(ev?.backendFunctionality ?? 50);
  let databaseFunctionality = $state(ev?.databaseFunctionality ?? 50);
  let frontendFunctionality = $state(ev?.frontendFunctionality ?? 50);
  let comment = $state(ev?.comment ?? "");
  let requirementsRest = $state(ev?.requirementsRest ?? false);
  let requirementsDb = $state(ev?.requirementsDb ?? false);
  let requirementsAuth = $state(ev?.requirementsAuth ?? false);
  let requirementsFrontend = $state(ev?.requirementsFrontend ?? false);
  let requirementsDeploy = $state(ev?.requirementsDeploy ?? false);
  let loadingDraft = $state(false);
  let loadingSubmit = $state(false);
  let descExpanded = $state(false);

  const average = $derived(
    Number(
      (
        (backendCode + databaseStructure + frontendCode +
          backendFunctionality + databaseFunctionality + frontendFunctionality) / 6
      ).toFixed(2)
    )
  );
</script>

<svelte:head>
  <title>Оцінювання — {data.assignment.work.tournament.title} / Команда {data.assignment.displayNumber}</title>
</svelte:head>

<style>
  .bc   { font-size: 12px; color: #484f58; margin-bottom: 8px; display:flex; align-items:center; gap:4px; flex-wrap:wrap; }
  .bc a { color: #8b949e; text-decoration: none; }
  .bc a:hover { color: #58a6ff; }
  .bc .cur { color: #58a6ff; }

  .page-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  }

  .h1 { font-size: 28px; font-weight: 700; color: #e6edf3; font-family: 'Space Grotesk', sans-serif; margin: 0; }

  .tour-badge {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #8b949e;
  }
  .tour-badge strong { color: #58a6ff; }

  /* Nav arrows */
  .nav-arrows { display: flex; gap: 8px; }

  .nav-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 6px;
    border: 1px solid #21262d; background: #161b22;
    font-size: 12px; color: #8b949e; text-decoration: none;
    transition: background 0.12s, color 0.12s, border-color 0.12s;
  }
  .nav-btn:hover { background: #21262d; color: #e6edf3; border-color: #30363d; }
  .nav-btn.disabled { opacity: 0.35; pointer-events: none; }

  /* Main grid */
  .grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 960px) { .grid { grid-template-columns: 1fr; } }

  /* Left: materials */
  .materials-card {
    background: #161b22; border: 1px solid #21262d; border-radius: 12px;
  }

  .section-title {
    font-size: 14px; font-weight: 600; color: #e6edf3;
    padding: 16px 18px 12px; border-bottom: 1px solid #21262d;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::before {
    content: ''; width: 3px; height: 14px;
    background: #1f6feb; border-radius: 2px; flex-shrink: 0;
  }

  .materials-list { padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; }

  .material-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 8px;
    background: #0d1117; border: 1px solid #21262d;
    text-decoration: none;
    transition: border-color 0.12s, background 0.12s;
  }
  .material-link:hover { border-color: #1f6feb; background: #161b22; }

  .mat-icon {
    width: 32px; height: 32px; border-radius: 6px;
    background: #161b22; border: 1px solid #21262d;
    display: flex; align-items: center; justify-content: center;
    color: #8b949e; flex-shrink: 0;
  }

  .mat-label { font-size: 11px; color: #484f58; display: block; }
  .mat-url   { font-size: 12px; color: #58a6ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 240px; }

  .mat-ext {
    margin-left: auto; color: #484f58; flex-shrink: 0;
  }

  /* Requirements */
  .req-section { padding: 14px 18px; border-top: 1px solid #21262d; }

  .req-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 0; border-bottom: 1px solid #21262d;
    cursor: pointer;
  }
  .req-item:last-child { border-bottom: none; }

  .checkbox {
    width: 16px; height: 16px; border-radius: 4px; flex-shrink: 0;
    border: 1.5px solid #30363d; background: #0d1117;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.12s, border-color 0.12s;
  }
  .checkbox.checked { background: #1f6feb; border-color: #1f6feb; }

  .req-label { font-size: 13px; color: #e6edf3; }

  /* Description */
  .desc-section { padding: 14px 18px; border-top: 1px solid #21262d; }
  .desc-text {
    font-size: 13px; color: #8b949e; line-height: 1.7;
    max-height: 120px; overflow: hidden;
    transition: max-height 0.3s;
  }
  .desc-text.expanded { max-height: 999px; }
  .expand-btn {
    background: none; border: none; cursor: pointer;
    color: #58a6ff; font-size: 12px; margin-top: 6px;
    font-family: inherit; padding: 0;
  }

  /* Right: scoring */
  .scoring-card {
    background: #161b22; border: 1px solid #21262d; border-radius: 12px;
    position: sticky; top: 20px;
  }

  .scoring-header { padding: 16px 18px 12px; border-bottom: 1px solid #21262d; }
  .scoring-title { font-size: 15px; font-weight: 700; color: #e6edf3; margin: 0; }

  .scoring-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }

  .subsection-label {
    font-size: 12px; font-weight: 700; color: #484f58;
    text-transform: uppercase; letter-spacing: 0.08em;
    margin-bottom: -4px;
  }

  /* Average display */
  .average-block {
    background: rgba(31,111,235,.1);
    border: 1px solid rgba(31,111,235,.25);
    border-radius: 8px; padding: 12px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .avg-label { font-size: 13px; color: #8b949e; }
  .avg-label span { display: block; font-size: 10px; color: #484f58; margin-top: 2px; }
  .avg-num {
    font-size: 26px; font-weight: 800; color: #58a6ff;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Comment */
  .comment-input {
    width: 100%; min-height: 80px; padding: 10px 12px;
    border-radius: 8px; border: 1px solid #21262d;
    background: #0d1117; color: #e6edf3;
    font-size: 13px; font-family: inherit;
    outline: none; resize: vertical; box-sizing: border-box;
    line-height: 1.6;
    transition: border-color 0.12s;
  }
  .comment-input:focus { border-color: #1f6feb; }
  .comment-input::placeholder { color: #484f58; }

  /* Buttons */
  .btns { display: flex; flex-direction: column; gap: 8px; }

  .btn-submit {
    width: 100%; padding: 12px; border-radius: 8px;
    background: #1f6feb; color: #fff;
    font-size: 15px; font-weight: 700; border: none;
    cursor: pointer; font-family: inherit;
    transition: background 0.12s;
  }
  .btn-submit:hover:not(:disabled) { background: #388bfd; }
  .btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-draft {
    width: 100%; padding: 10px; border-radius: 8px;
    background: none; border: 1px solid #21262d;
    color: #8b949e; font-size: 14px; font-weight: 500;
    cursor: pointer; font-family: inherit;
    transition: background 0.12s, border-color 0.12s, color 0.12s;
  }
  .btn-draft:hover:not(:disabled) { background: #21262d; color: #e6edf3; border-color: #30363d; }
  .btn-draft:disabled { opacity: 0.4; cursor: not-allowed; }

  .error-msg { font-size: 12px; color: #f85149; padding: 0 18px 12px; }
</style>

<!-- Breadcrumb + nav -->
<div class="bc">
  <a href="/jury/account">Кабінет</a> /
  <a href="/jury/works">Мої роботи</a> /
  <span class="cur">Оцінювання</span>
</div>

<div class="page-top">
  <h1 class="h1">Оцінювання</h1>
  <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
    <div class="tour-badge">
      Турнір: <strong>{data.assignment.work.tournament.title}</strong> /
      <strong>Команда {data.assignment.displayNumber}</strong>
    </div>
    <div class="nav-arrows">
      {#if data.prev}
        <a href={`/jury/works/${data.prev.workId}`} class="nav-btn">← Попередня</a>
      {:else}
        <span class="nav-btn disabled">← Попередня</span>
      {/if}
      {#if data.next}
        <a href={`/jury/works/${data.next.workId}`} class="nav-btn">Наступна →</a>
      {:else}
        <span class="nav-btn disabled">Наступна →</span>
      {/if}
    </div>
  </div>
</div>

<form class="grid">
  <!-- Hidden inputs -->
  <input type="hidden" name="backendCode"           value={backendCode} />
  <input type="hidden" name="databaseStructure"     value={databaseStructure} />
  <input type="hidden" name="frontendCode"          value={frontendCode} />
  <input type="hidden" name="backendFunctionality"  value={backendFunctionality} />
  <input type="hidden" name="databaseFunctionality" value={databaseFunctionality} />
  <input type="hidden" name="frontendFunctionality" value={frontendFunctionality} />
  <input type="hidden" name="requirementsRest"      value={String(requirementsRest)} />
  <input type="hidden" name="requirementsDb"        value={String(requirementsDb)} />
  <input type="hidden" name="requirementsAuth"      value={String(requirementsAuth)} />
  <input type="hidden" name="requirementsFrontend"  value={String(requirementsFrontend)} />
  <input type="hidden" name="requirementsDeploy"    value={String(requirementsDeploy)} />

  <!-- LEFT: Materials -->
  <div class="materials-card">
    <div class="section-title">Матеріали для перегляду</div>

    <div class="materials-list">
      {#if data.assignment.work.githubUrl}
        <a href={data.assignment.work.githubUrl} target="_blank" rel="noopener" class="material-link">
          <div class="mat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color:#8b949e">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          <div>
            <span class="mat-label">GitHub репозиторій</span>
            <span class="mat-url">{data.assignment.work.githubUrl}</span>
          </div>
          <span class="mat-ext">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
        </a>
      {/if}

      {#if data.assignment.work.videoUrl}
        <a href={data.assignment.work.videoUrl} target="_blank" rel="noopener" class="material-link">
          <div class="mat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#8b949e">
              <polygon points="23 7 16 12 23 17 23 7"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <div>
            <span class="mat-label">Відео-демо</span>
            <span class="mat-url">{data.assignment.work.videoUrl}</span>
          </div>
          <span class="mat-ext">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
        </a>
      {/if}

      {#if data.assignment.work.liveDemoUrl}
        <a href={data.assignment.work.liveDemoUrl} target="_blank" rel="noopener" class="material-link">
          <div class="mat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:#8b949e">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <div>
            <span class="mat-label">Live demo (не обов'язково)</span>
            <span class="mat-url">{data.assignment.work.liveDemoUrl}</span>
          </div>
          <span class="mat-ext">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </span>
        </a>
      {/if}
    </div>

    <!-- Requirements checkboxes -->
    <div class="section-title">Обов'язкові вимоги завдання</div>
    <div class="req-section">
      {#each [
        { key: 'rest',      label: 'REST API з документацією (Swagger/Postman)', checked: requirementsRest,     toggle: () => (requirementsRest = !requirementsRest) },
        { key: 'db',        label: 'База даних з міграціями',                    checked: requirementsDb,       toggle: () => (requirementsDb = !requirementsDb) },
        { key: 'auth',      label: 'Авторизація (JWT або OAuth)',                checked: requirementsAuth,     toggle: () => (requirementsAuth = !requirementsAuth) },
        { key: 'frontend',  label: 'Frontend підключення до API',                checked: requirementsFrontend, toggle: () => (requirementsFrontend = !requirementsFrontend) },
        { key: 'deploy',    label: 'Деплой на публічний хостинг',               checked: requirementsDeploy,   toggle: () => (requirementsDeploy = !requirementsDeploy) },
      ] as req}
        <label class="req-item" onclick={req.toggle}>
          <div class="checkbox" class:checked={req.checked}>
            {#if req.checked}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            {/if}
          </div>
          <span class="req-label">{req.label}</span>
        </label>
      {/each}
    </div>

    <!-- Description -->
    {#if data.assignment.work.description}
      <div class="section-title">Опис від команди</div>
      <div class="desc-section">
        <div class="desc-text" class:expanded={descExpanded}>
          {data.assignment.work.description}
        </div>
        <button type="button" class="expand-btn" onclick={() => (descExpanded = !descExpanded)}>
          {descExpanded ? "Згорнути ▲" : "Розгорнути ▼"}
        </button>
      </div>
    {/if}
  </div>

  <!-- RIGHT: Scoring -->
  <div class="scoring-card">
    <div class="scoring-header">
      <h2 class="scoring-title">Форма оцінювання</h2>
    </div>

    <div class="scoring-body">
      <div class="subsection-label">I. Технічна частина</div>
      <ScoreSlider label="Backend якість коду (Clean code, патерни, ООП)" bind:value={backendCode} />
      <ScoreSlider label="База даних (структура, налаштування)" bind:value={databaseStructure} />
      <ScoreSlider label="Frontend (код, UI/UX тести)" bind:value={frontendCode} />

      <div class="subsection-label" style="margin-top:4px;">II. Функціональність</div>
      <ScoreSlider label="Backend якість коду (Clean code, патерни, ООП)" bind:value={backendFunctionality} />
      <ScoreSlider label="База даних (структура, налаштування)" bind:value={databaseFunctionality} />
      <ScoreSlider label="Frontend (код, UI/UX тести)" bind:value={frontendFunctionality} />

      <!-- Average -->
      <div class="average-block">
        <div class="avg-label">
          Середній Бал
          <span>автоматично</span>
        </div>
        <div class="avg-num">{average}</div>
      </div>

      <!-- Comment -->
      <textarea
        bind:value={comment}
        name="comment"
        class="comment-input"
        placeholder="Залиш коментар до оцінки команди (необов'язково)..."
      ></textarea>

      {#if form?.error}
        <p class="error-msg">{form.error}</p>
      {/if}

      <div class="btns">
        <button
          type="submit"
          formaction="?/submitFinal"
          formmethod="POST"
          use:enhance={() => {
            loadingSubmit = true;
            return async ({ update }) => { await update(); loadingSubmit = false; };
          }}
          class="btn-submit"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Збереження..." : "Підтвердити оцінку"}
        </button>
        <button
          type="submit"
          formaction="?/saveDraft"
          formmethod="POST"
          use:enhance={() => {
            loadingDraft = true;
            return async ({ update }) => { await update(); loadingDraft = false; };
          }}
          class="btn-draft"
          disabled={loadingDraft}
        >
          {loadingDraft ? "Збереження..." : "Зберегти чернетку"}
        </button>
      </div>
    </div>
  </div>
</form>
