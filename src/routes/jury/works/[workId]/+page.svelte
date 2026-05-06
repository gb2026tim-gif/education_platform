<!-- Evaluation page: /jury/works/[workId] -->
<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ScoreSlider from "$lib/jury/ScoreSlider.svelte";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const ev = data.assignment.evaluation;

  // Scoring state — initialized from existing evaluation or defaults
  let backendCode           = $state(ev?.backendCode           ?? 50);
  let databaseStructure     = $state(ev?.databaseStructure     ?? 50);
  let frontendCode          = $state(ev?.frontendCode          ?? 50);
  let backendFunctionality  = $state(ev?.backendFunctionality  ?? 50);
  let databaseFunctionality = $state(ev?.databaseFunctionality ?? 50);
  let frontendFunctionality = $state(ev?.frontendFunctionality ?? 50);
  let comment        = $state(ev?.comment               ?? "");
  let reqRest        = $state(ev?.requirementsRest      ?? false);
  let reqDb          = $state(ev?.requirementsDb        ?? false);
  let reqAuth        = $state(ev?.requirementsAuth      ?? false);
  let reqFrontend    = $state(ev?.requirementsFrontend  ?? false);
  let reqDeploy      = $state(ev?.requirementsDeploy    ?? false);
  let loadingDraft   = $state(false);
  let loadingSubmit  = $state(false);
  let descExpanded   = $state(false);

  // Auto-computed average score
  const average = $derived(
    Number((
      (backendCode + databaseStructure + frontendCode +
       backendFunctionality + databaseFunctionality + frontendFunctionality) / 6
    ).toFixed(2))
  );
</script>

<svelte:head>
  <title>Evaluation — {data.assignment.work.tournament.title} / Team {data.assignment.displayNumber}</title>
</svelte:head>

<style>
/* ── Breadcrumb ── */
.bc   { font-size:12px; color:#484f58; margin-bottom:8px; display:flex; flex-wrap:wrap; gap:4px; }
.bc a { color:#8b949e; text-decoration:none; }
.bc a:hover { color:#58a6ff; }
.bc .cur { color:#58a6ff; }
:global(.light-mode) .bc   { color:rgba(10,14,26,.4); }
:global(.light-mode) .bc a { color:rgba(10,14,26,.55); }

/* ── Page header ── */
.page-top {
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:20px; flex-wrap:wrap; gap:12px;
}
.h1 {
  font-size:28px; font-weight:700; color:#e6edf3;
  font-family:'Space Grotesk',sans-serif; margin:0;
}
:global(.light-mode) .h1 { color:#0a0e1a; }

.tour-badge { display:flex; align-items:center; gap:8px; font-size:13px; color:#8b949e; }
.tour-badge strong { color:#58a6ff; }

/* ── Navigation arrows ── */
.nav-arrows { display:flex; gap:8px; }
.nav-btn {
  display:inline-flex; align-items:center; gap:5px;
  padding:6px 12px; border-radius:6px;
  border:1px solid #21262d; background:#161b22;
  font-size:12px; color:#8b949e; text-decoration:none;
  transition:background .12s, color .12s, border-color .12s;
}
.nav-btn:hover { background:#21262d; color:#e6edf3; border-color:#30363d; }
.nav-btn.disabled { opacity:.35; pointer-events:none; }
:global(.light-mode) .nav-btn { background:#f0f4ff; border-color:rgba(10,14,26,.1); color:rgba(10,14,26,.55); }
:global(.light-mode) .nav-btn:hover { background:#e4eaff; color:#0a0e1a; }

/* ── Two-column layout ── */
.grid { display:grid; grid-template-columns:1fr 380px; gap:20px; align-items:start; }
@media(max-width:960px) { .grid { grid-template-columns:1fr; } }

/* ── Material card (left) ── */
.mat-card { background:#161b22; border:1px solid #21262d; border-radius:12px; overflow:hidden; }
:global(.light-mode) .mat-card { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 2px 10px rgba(0,0,0,.05); }

.sec-title {
  font-size:14px; font-weight:600; color:#e6edf3;
  padding:14px 18px 12px; border-bottom:1px solid #21262d;
  display:flex; align-items:center; gap:8px;
}
.sec-title::before { content:''; width:3px; height:14px; background:#1f6feb; border-radius:2px; flex-shrink:0; }
:global(.light-mode) .sec-title { color:#0a0e1a; border-color:rgba(10,14,26,.08); }

/* Material links */
.mat-list { padding:12px 16px; display:flex; flex-direction:column; gap:8px; }
.mat-link {
  display:flex; align-items:center; gap:10px;
  padding:10px 13px; border-radius:8px;
  background:#0d1117; border:1px solid #21262d;
  text-decoration:none; transition:border-color .12s;
}
.mat-link:hover { border-color:#1f6feb; }
:global(.light-mode) .mat-link { background:#f8faff; border-color:rgba(10,14,26,.08); }
:global(.light-mode) .mat-link:hover { border-color:#1f6feb; }

.mat-icon {
  width:30px; height:30px; border-radius:6px;
  background:#161b22; border:1px solid #21262d;
  display:flex; align-items:center; justify-content:center;
  color:#8b949e; flex-shrink:0;
}
:global(.light-mode) .mat-icon { background:#eef2ff; border-color:rgba(10,14,26,.08); }

.mat-label { font-size:11px; color:#484f58; display:block; }
.mat-url   { font-size:12px; color:#58a6ff; display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:280px; }
.mat-ext   { margin-left:auto; color:#484f58; flex-shrink:0; }

/* Checkboxes */
.req-section { padding:12px 16px; border-top:1px solid #21262d; }
:global(.light-mode) .req-section { border-color:rgba(10,14,26,.08); }
.req-item {
  display:flex; align-items:center; gap:10px;
  padding:7px 0; border-bottom:1px solid #21262d;
  cursor:pointer;
}
.req-item:last-child { border-bottom:none; }
:global(.light-mode) .req-item { border-color:rgba(10,14,26,.06); }

.checkbox {
  width:16px; height:16px; border-radius:4px; flex-shrink:0;
  border:1.5px solid #30363d; background:#0d1117;
  display:flex; align-items:center; justify-content:center;
  transition:background .12s, border-color .12s;
}
.checkbox.checked { background:#1f6feb; border-color:#1f6feb; }
:global(.light-mode) .checkbox { background:#f0f4ff; border-color:rgba(10,14,26,.2); }

.req-label { font-size:13px; color:#e6edf3; }
:global(.light-mode) .req-label { color:#0a0e1a; }

/* Description */
.desc-section { padding:12px 16px; border-top:1px solid #21262d; }
:global(.light-mode) .desc-section { border-color:rgba(10,14,26,.08); }
.desc-text { font-size:13px; color:#8b949e; line-height:1.7; max-height:100px; overflow:hidden; transition:max-height .3s; }
.desc-text.expanded { max-height:999px; }
:global(.light-mode) .desc-text { color:rgba(10,14,26,.6); }
.expand-btn { background:none; border:none; cursor:pointer; color:#58a6ff; font-size:12px; margin-top:6px; font-family:inherit; padding:0; }

/* ── Scoring card (right) ── */
.score-card { background:#161b22; border:1px solid #21262d; border-radius:12px; position:sticky; top:20px; }
:global(.light-mode) .score-card { background:#fff; border-color:rgba(10,14,26,.08); box-shadow:0 2px 10px rgba(0,0,0,.05); }

.score-head { padding:14px 18px 12px; border-bottom:1px solid #21262d; }
.score-head h2 { font-size:15px; font-weight:700; color:#e6edf3; margin:0; }
:global(.light-mode) .score-head { border-color:rgba(10,14,26,.08); }
:global(.light-mode) .score-head h2 { color:#0a0e1a; }

.score-body { padding:16px 18px; display:flex; flex-direction:column; gap:12px; }

.sub-label {
  font-size:11px; font-weight:700; color:#484f58;
  text-transform:uppercase; letter-spacing:.08em;
}

/* Average block */
.avg-block {
  background:rgba(31,111,235,.1); border:1px solid rgba(31,111,235,.2);
  border-radius:8px; padding:12px 14px;
  display:flex; align-items:center; justify-content:space-between;
}
:global(.light-mode) .avg-block { background:rgba(31,111,235,.07); border-color:rgba(31,111,235,.18); }
.avg-label { font-size:13px; color:#8b949e; }
.avg-label span { display:block; font-size:10px; color:#484f58; margin-top:2px; }
:global(.light-mode) .avg-label { color:rgba(10,14,26,.6); }
.avg-num { font-size:26px; font-weight:800; color:#58a6ff; font-family:'JetBrains Mono',monospace; }

/* Comment */
.comment-ta {
  width:100%; min-height:72px; padding:9px 12px; border-radius:8px;
  border:1px solid #21262d; background:#0d1117;
  color:#e6edf3; font-size:13px; font-family:inherit;
  outline:none; resize:vertical; box-sizing:border-box; line-height:1.6;
  transition:border-color .12s;
}
.comment-ta:focus { border-color:#1f6feb; }
.comment-ta::placeholder { color:#484f58; }
:global(.light-mode) .comment-ta { background:#f8faff; border-color:rgba(10,14,26,.1); color:#0a0e1a; }
:global(.light-mode) .comment-ta::placeholder { color:rgba(10,14,26,.3); }

/* Buttons */
.btn-submit {
  width:100%; padding:12px; border-radius:8px; border:none;
  background:#1f6feb; color:#fff;
  font-size:15px; font-weight:700; font-family:inherit;
  cursor:pointer; transition:background .12s;
}
.btn-submit:hover:not(:disabled) { background:#388bfd; }
.btn-submit:disabled { opacity:.4; cursor:not-allowed; }

.btn-draft {
  width:100%; padding:10px; border-radius:8px;
  background:none; border:1px solid #21262d;
  color:#8b949e; font-size:14px; font-family:inherit;
  cursor:pointer; transition:background .12s, color .12s;
}
.btn-draft:hover:not(:disabled) { background:#21262d; color:#e6edf3; }
.btn-draft:disabled { opacity:.4; cursor:not-allowed; }
:global(.light-mode) .btn-draft { border-color:rgba(10,14,26,.12); color:rgba(10,14,26,.55); }
:global(.light-mode) .btn-draft:hover:not(:disabled) { background:#eef2ff; color:#0a0e1a; }

.err-msg { font-size:12px; color:#f85149; }
</style>

<!-- Breadcrumb -->
<div class="bc">
  <a href="/jury/account">Cabinet</a><span>/</span>
  <a href="/jury/works">My works</a><span>/</span>
  <span class="cur">Evaluation</span>
</div>

<!-- Page header -->
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
  <!-- Hidden scoring inputs (bound to sliders via $state) -->
  <input type="hidden" name="backendCode"           value={backendCode} />
  <input type="hidden" name="databaseStructure"     value={databaseStructure} />
  <input type="hidden" name="frontendCode"          value={frontendCode} />
  <input type="hidden" name="backendFunctionality"  value={backendFunctionality} />
  <input type="hidden" name="databaseFunctionality" value={databaseFunctionality} />
  <input type="hidden" name="frontendFunctionality" value={frontendFunctionality} />
  <input type="hidden" name="requirementsRest"      value={String(reqRest)} />
  <input type="hidden" name="requirementsDb"        value={String(reqDb)} />
  <input type="hidden" name="requirementsAuth"      value={String(reqAuth)} />
  <input type="hidden" name="requirementsFrontend"  value={String(reqFrontend)} />
  <input type="hidden" name="requirementsDeploy"    value={String(reqDeploy)} />

  <!-- LEFT: Work materials -->
  <div>
    <div class="mat-card">
      <!-- Materials -->
      <div class="sec-title">Матеріали для перегляду</div>
      <div class="mat-list">
        {#if data.assignment.work.githubUrl}
          <a href={data.assignment.work.githubUrl} target="_blank" rel="noopener" class="mat-link">
            <div class="mat-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </div>
            <div>
              <span class="mat-label">GitHub репозиторій</span>
              <span class="mat-url">{data.assignment.work.githubUrl}</span>
            </div>
            <span class="mat-ext">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </span>
          </a>
        {/if}

        {#if data.assignment.work.videoUrl}
          <a href={data.assignment.work.videoUrl} target="_blank" rel="noopener" class="mat-link">
            <div class="mat-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div>
              <span class="mat-label">Відео-демо</span>
              <span class="mat-url">{data.assignment.work.videoUrl}</span>
            </div>
            <span class="mat-ext">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </span>
          </a>
        {/if}

        {#if data.assignment.work.liveDemoUrl}
          <a href={data.assignment.work.liveDemoUrl} target="_blank" rel="noopener" class="mat-link">
            <div class="mat-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <span class="mat-label">Live demo</span>
              <span class="mat-url">{data.assignment.work.liveDemoUrl}</span>
            </div>
            <span class="mat-ext">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </span>
          </a>
        {/if}
      </div>

      <!-- Requirements checkboxes -->
      <div class="sec-title">Обов'язкові вимоги завдання</div>
      <div class="req-section">
        {#each [
          { label: "REST API з документацією (Swagger/Postman)", get: () => reqRest,     set: () => reqRest = !reqRest     },
          { label: "База даних з міграціями",                    get: () => reqDb,       set: () => reqDb = !reqDb         },
          { label: "Авторизація (JWT або OAuth)",                get: () => reqAuth,     set: () => reqAuth = !reqAuth     },
          { label: "Frontend підключення до API",                get: () => reqFrontend, set: () => reqFrontend = !reqFrontend },
          { label: "Деплой на публічний хостинг",               get: () => reqDeploy,   set: () => reqDeploy = !reqDeploy },
        ] as req}
          <label class="req-item" onclick={req.set}>
            <div class="checkbox" class:checked={req.get()}>
              {#if req.get()}
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
              {/if}
            </div>
            <span class="req-label">{req.label}</span>
          </label>
        {/each}
      </div>

      <!-- Team description -->
      {#if data.assignment.work.description}
        <div class="sec-title">Опис від команди</div>
        <div class="desc-section">
          <div class="desc-text" class:expanded={descExpanded}>
            {data.assignment.work.description}
          </div>
          <button type="button" class="expand-btn" onclick={() => descExpanded = !descExpanded}>
            {descExpanded ? "Згорнути ▲" : "Розгорнути ▼"}
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- RIGHT: Scoring form -->
  <div>
    <div class="score-card">
      <div class="score-head"><h2>Форма оцінювання</h2></div>
      <div class="score-body">

        <div class="sub-label">I. Технічна частина</div>
        <ScoreSlider label="Backend якість коду (Clean code, патерни, ООП)" bind:value={backendCode} />
        <ScoreSlider label="База даних (структура, налаштування)"           bind:value={databaseStructure} />
        <ScoreSlider label="Frontend (код, UI/UX тести)"                    bind:value={frontendCode} />

        <div class="sub-label">II. Функціональність</div>
        <ScoreSlider label="Backend якість коду (Clean code, патерни, ООП)" bind:value={backendFunctionality} />
        <ScoreSlider label="База даних (структура, налаштування)"           bind:value={databaseFunctionality} />
        <ScoreSlider label="Frontend (код, UI/UX тести)"                    bind:value={frontendFunctionality} />

        <!-- Auto-computed average -->
        <div class="avg-block">
          <div class="avg-label">
            Середній Бал
            <span>автоматично</span>
          </div>
          <div class="avg-num">{average}</div>
        </div>

        <textarea
          bind:value={comment}
          name="comment"
          class="comment-ta"
          placeholder="Залиш коментар до оцінки команди (необов'язково)..."
        ></textarea>

        {#if form?.error}
          <p class="err-msg">{form.error}</p>
        {/if}

        <!-- Submit / draft buttons -->
        <button
          type="submit"
          formaction="?/submitFinal"
          formmethod="POST"
          use:enhance={() => { loadingSubmit = true; return async ({update}) => { await update(); loadingSubmit = false; }; }}
          class="btn-submit"
          disabled={loadingSubmit}
        >
          {loadingSubmit ? "Збереження..." : "Підтвердити оцінку"}
        </button>

        <button
          type="submit"
          formaction="?/saveDraft"
          formmethod="POST"
          use:enhance={() => { loadingDraft = true; return async ({update}) => { await update(); loadingDraft = false; }; }}
          class="btn-draft"
          disabled={loadingDraft}
        >
          {loadingDraft ? "Збереження..." : "Зберегти чернетку"}
        </button>

      </div>
    </div>
  </div>
</form>
