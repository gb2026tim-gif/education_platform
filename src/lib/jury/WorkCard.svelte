<script lang="ts">
  interface Work {
    workId: string;
    teamLabel: string;
    tournamentName: string;
    evaluated: boolean;
    evaluatedAt: string | null;
    githubUrl: string | null;
    videoUrl: string | null;
    average: number | null;
    scores?: {
      backendCode: number;
      databaseStructure: number;
      frontendCode: number;
      backendFunctionality: number;
      databaseFunctionality: number;
      frontendFunctionality: number;
    } | null;
    comment?: string | null;
  }

  let { work }: { work: Work } = $props();

  function fmt(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("uk-UA", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }
</script>

<article class="work-card" class:evaluated={work.evaluated}>
  <!-- Top row -->
  <div class="card-top">
    <div class="card-left">
      {#if work.evaluated}
        <span class="check-icon">✓</span>
      {:else}
        <span class="num-badge">1</span>
      {/if}
      <div>
        <h3 class="team-name">{work.teamLabel}</h3>
        <p class="tournament-name">
          {work.tournamentName}
          {#if work.evaluated && work.evaluatedAt}
            · Оцінено {fmt(work.evaluatedAt)}
          {/if}
        </p>
      </div>
    </div>
    <div class="card-right">
      {#if work.githubUrl}
        <a href={work.githubUrl} target="_blank" rel="noopener" class="link-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          GitHub
        </a>
      {/if}
      {#if work.videoUrl}
        <a href={work.videoUrl} target="_blank" rel="noopener" class="link-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="23 7 16 12 23 17 23 7"/>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
          </svg>
          Відео
        </a>
      {/if}
      {#if work.evaluated}
        <a href={`/jury/works/${work.workId}`} class="action-btn view">Переглянути</a>
      {:else}
        <a href={`/jury/works/${work.workId}`} class="action-btn evaluate">Оцінити</a>
      {/if}
    </div>
  </div>

  <!-- Scores row (if evaluated) -->
  {#if work.evaluated && work.scores}
    <div class="scores-row">
      <div class="score-item">
        <span class="score-label">Frontend</span>
        <span class="score-val">{work.scores.frontendCode}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Backend</span>
        <span class="score-val">{work.scores.backendCode}</span>
      </div>
      <div class="score-item">
        <span class="score-label">БД</span>
        <span class="score-val">{work.scores.databaseStructure}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Додатково</span>
        <span class="score-val">{work.scores.databaseFunctionality}</span>
      </div>
      <div class="score-item">
        <span class="score-label">Функціональність</span>
        <span class="score-val">{work.scores.frontendFunctionality}</span>
      </div>
      <div class="score-item avg">
        <span class="score-label">Середній</span>
        <span class="score-val avg-val">{work.average ?? 0}</span>
      </div>
    </div>
    {#if work.comment}
      <p class="comment">{work.comment}</p>
    {/if}
  {:else if !work.evaluated}
    <div class="pending-row">
      Оцініть, щоб побачити бали
    </div>
  {/if}
</article>

<style>
  .work-card {
    background: #161b22;
    border: 1px solid #21262d;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
    transition: border-color 0.15s;
  }
  .work-card:hover { border-color: #30363d; }
  .work-card.evaluated { border-color: rgba(31,111,235,.2); }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
  }

  .card-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .check-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(35, 134, 54, 0.2);
    border: 1px solid rgba(35, 134, 54, 0.4);
    color: #3fb950;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .num-badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(31, 111, 235, 0.15);
    border: 1px solid rgba(31, 111, 235, 0.3);
    color: #58a6ff;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .team-name {
    font-size: 14px;
    font-weight: 600;
    color: #e6edf3;
    margin: 0;
  }

  .tournament-name {
    font-size: 12px;
    color: #484f58;
    margin: 0;
    margin-top: 2px;
  }

  .card-right {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .link-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 10px;
    border-radius: 6px;
    border: 1px solid #30363d;
    background: #0d1117;
    font-size: 12px;
    color: #8b949e;
    text-decoration: none;
    transition: border-color 0.12s, color 0.12s;
  }
  .link-btn:hover { border-color: #58a6ff; color: #58a6ff; }

  .action-btn {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.12s;
  }
  .action-btn.evaluate { background: #1f6feb; color: #fff; }
  .action-btn.evaluate:hover { background: #388bfd; }
  .action-btn.view { background: #21262d; color: #e6edf3; border: 1px solid #30363d; }
  .action-btn.view:hover { background: #30363d; }

  /* Scores */
  .scores-row {
    display: flex;
    gap: 0;
    background: #0d1117;
    border-top: 1px solid #21262d;
    padding: 10px 16px;
    gap: 24px;
    flex-wrap: wrap;
  }

  .score-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .score-label {
    font-size: 11px;
    color: #484f58;
    white-space: nowrap;
  }

  .score-val {
    font-size: 16px;
    font-weight: 700;
    color: #e6edf3;
    font-family: 'JetBrains Mono', monospace;
  }

  .score-item.avg .score-label { color: #58a6ff; }
  .avg-val { color: #58a6ff; }

  .comment {
    padding: 8px 16px 12px;
    font-size: 12px;
    color: #8b949e;
    border-top: 1px solid #21262d;
    font-style: italic;
    background: #0d1117;
    margin: 0;
  }

  .pending-row {
    padding: 14px 16px;
    background: #0d1117;
    border-top: 1px solid #21262d;
    font-size: 13px;
    color: #484f58;
    text-align: center;
  }
</style>
