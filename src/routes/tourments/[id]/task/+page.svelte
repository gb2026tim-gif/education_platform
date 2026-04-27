<!-- src/routes/tourments/[id]/task/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data }: { data: PageData } = $props();

    // ── Конфіг тексту — замінити на API коли буде готово ──────────
    const TASK_CONFIG = {
        goalLabel: "Мета:",
        criteriaLabel: "Критерії оцінювання:",
        requirementsLabel: "Функціональні вимоги:",
        extraLabel: "Додатковий функціонал (опціонально — оцінюється додатково):",
        deadlineWarning:
            "Після дедлайну форма блокується. Будь ласка, переконайтесь, що прикріпили все необхідне.",
        submitBtnLabel: "Перейти до здачі завдання",
    };

    // ── Таймер відліку до дедлайну ────────────────────────────────
    function getCountdown(deadline: string | Date) {
        const diff = new Date(deadline).getTime() - Date.now();
        if (diff <= 0) return "Дедлайн минув";
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        return `${d}д ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    let countdown = $state(getCountdown(data.task.deadline));
    let interval: ReturnType<typeof setInterval>;

    $effect(() => {
        interval = setInterval(() => {
            countdown = getCountdown(data.task.deadline);
        }, 1000);
        return () => clearInterval(interval);
    });

    // ── Парсимо techStack (формат "Backend: ...\nFrontend: ...") ──
    function parseTechStack(raw: string | null | undefined) {
        if (!raw) return [];
        return raw.split("\n").map((line) => {
            const [label, ...rest] = line.split(":");
            return { label: label.trim(), value: rest.join(":").trim() };
        });
    }

    const techItems = $derived(parseTechStack(data.task.techStack));
    const isPastDeadline = $derived(
        new Date(data.task.deadline).getTime() < Date.now()
    );
</script>

<svelte:head>
    <title>{data.tournament.title} — Завдання</title>
</svelte:head>

<style>
    .page-wrap {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        font-family: "Manrope", sans-serif;
        display: flex;
        flex-direction: column;
    }

    .layout {
        display: flex;
        flex: 1;
        min-height: 0;
    }

    .main {
        flex: 1;
        padding: 32px 44px;
        max-width: 900px;
        overflow-y: auto;
    }

    /* ── Breadcrumb ── */
    .breadcrumb {
        font-size: 13px;
        color: var(--text-dim);
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
    }
    .breadcrumb a {
        color: var(--text-muted);
        text-decoration: none;
    }
    .breadcrumb a:hover {
        color: var(--accent);
    }
    .breadcrumb .active {
        color: var(--accent);
    }

    .page-title {
        font-size: 32px;
        font-weight: 800;
        color: var(--text);
        margin-bottom: 24px;
        letter-spacing: -0.5px;
    }

    /* ── Deadline banner ── */
    .deadline-banner {
        background: linear-gradient(
                135deg,
                rgba(14, 28, 64, 0.95) 0%,
                rgba(20, 38, 88, 0.95) 100%
        );
        border: 1px solid rgba(61, 142, 240, 0.25);
        border-radius: 14px;
        padding: 20px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 28px;
        flex-wrap: wrap;
    }
    :global(.light-mode) .deadline-banner {
        background: linear-gradient(135deg, #e8f0ff 0%, #dce8ff 100%);
        border-color: rgba(61, 142, 240, 0.3);
    }
    .deadline-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    .deadline-label {
        font-size: 14px;
        color: #3d8ef0;
        font-weight: 600;
    }
    .deadline-timer {
        font-size: 34px;
        font-weight: 800;
        color: #ef4444;
        letter-spacing: -1px;
        font-variant-numeric: tabular-nums;
    }
    .deadline-expired {
        color: #ef4444;
        font-size: 18px;
        font-weight: 700;
    }
    .deadline-warning {
        font-size: 14px;
        color: var(--text-muted);
        max-width: 380px;
        line-height: 1.6;
    }
    .deadline-warning strong {
        color: var(--text);
    }

    /* ── Секції ── */
    .section {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 24px 28px;
        margin-bottom: 20px;
    }
    :global(.light-mode) .section {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }

    .section-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 17px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 16px;
    }
    .section-accent {
        width: 4px;
        height: 20px;
        background: #3d8ef0;
        border-radius: 3px;
        flex-shrink: 0;
    }

    /* ── Текст опису ── */
    .desc-text {
        font-size: 15px;
        color: var(--text-muted);
        line-height: 1.75;
        margin-bottom: 16px;
    }
    .desc-text:last-child {
        margin-bottom: 0;
    }

    /* ── Критерії ── */
    .criteria-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .criteria-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 15px;
        color: var(--text-muted);
        line-height: 1.6;
    }
    .criteria-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #3d8ef0;
        margin-top: 8px;
        flex-shrink: 0;
    }

    /* ── Tech stack ── */
    .tech-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
        margin-top: 16px;
    }
    .tech-item {
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 12px 16px;
    }
    :global(.light-mode) .tech-item {
        background: #f0f4ff;
        border-color: rgba(61, 142, 240, 0.15);
    }
    .tech-label {
        font-size: 12px;
        font-weight: 700;
        color: #3d8ef0;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        margin-bottom: 4px;
    }
    .tech-value {
        font-size: 14px;
        color: var(--text);
        font-weight: 500;
    }

    /* ── Функціональні вимоги ── */
    .req-group {
        margin-bottom: 20px;
    }
    .req-group:last-child {
        margin-bottom: 0;
    }
    .req-group-title {
        font-size: 15px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .req-num {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(61, 142, 240, 0.15);
        color: #3d8ef0;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .req-list {
        list-style: none;
        padding: 0;
        padding-left: 32px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .req-item {
        font-size: 14px;
        color: var(--text-muted);
        line-height: 1.6;
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }
    .req-item::before {
        content: "—";
        color: var(--text-dim);
        flex-shrink: 0;
    }

    /* ── Додатковий функціонал ── */
    .extra-section {
        background: rgba(61, 142, 240, 0.05);
        border: 1px solid rgba(61, 142, 240, 0.18);
        border-radius: 14px;
        padding: 20px 24px;
        margin-bottom: 20px;
    }
    :global(.light-mode) .extra-section {
        background: rgba(61, 142, 240, 0.06);
    }
    .extra-title {
        font-size: 14px;
        font-weight: 700;
        color: #3d8ef0;
        margin-bottom: 12px;
        font-style: italic;
    }
    .extra-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .extra-item {
        font-size: 14px;
        color: var(--text-muted);
        line-height: 1.6;
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }
    .extra-item::before {
        content: "•";
        color: #3d8ef0;
        flex-shrink: 0;
        font-size: 16px;
        line-height: 1.4;
    }

    /* ── Submit button row ── */
    .submit-row {
        display: flex;
        justify-content: flex-end;
        margin-top: 8px;
        margin-bottom: 48px;
    }
    .submit-btn {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 28px;
        border-radius: 12px;
        background: #3d8ef0;
        color: #fff;
        font-size: 15px;
        font-weight: 700;
        font-family: "Manrope", sans-serif;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: background 0.15s, transform 0.15s;
    }
    .submit-btn:hover {
        background: #2d7de0;
        transform: translateY(-1px);
    }
    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 768px) {
        .main {
            padding: 20px 16px;
        }
        .deadline-banner {
            flex-direction: column;
            align-items: flex-start;
        }
        .deadline-timer {
            font-size: 26px;
        }
        .page-title {
            font-size: 24px;
        }
        .tech-grid {
            grid-template-columns: 1fr 1fr;
        }
    }
</style>

<div class="page-wrap">
    <Header />

    <div class="layout">
        <Sidebar user={data.user} />

        <main class="main">
            <!-- Breadcrumb -->
            <div class="breadcrumb">
                <a href="/my-teams">Кабінет</a>
                <span>/</span>
                <a href="/my-teams">Мої команди</a>
                <span>/</span>
                <a href="/my-teams/{data.team?.id}">Акаунт команди</a>
                <span>/</span>
                <span class="active">{data.tournament.title} — завдання</span>
            </div>

            <h1 class="page-title">
                <span style="color:#3d8ef0;">{data.tournament.title}:</span> завдання
            </h1>

            <!-- Deadline banner -->
            <div class="deadline-banner">
                <div class="deadline-left">
                    <div class="deadline-label">До дедлайну</div>
                    {#if isPastDeadline}
                        <div class="deadline-expired">Дедлайн минув</div>
                    {:else}
                        <div class="deadline-timer">{countdown}</div>
                    {/if}
                </div>
                <div class="deadline-warning">
                    {TASK_CONFIG.deadlineWarning.split("Будь ласка,")[0]}
                    <strong>Будь ласка, {TASK_CONFIG.deadlineWarning.split("Будь ласка,")[1]}</strong>
                </div>
            </div>

            <!-- Опис завдання -->
            <div class="section">
                <div class="section-title">
                    <span class="section-accent"></span>
                    Опис завдання
                </div>
                <p class="desc-text">{data.task.description}</p>
            </div>

            <!-- Tech Stack -->
            {#if data.task.techStack}
                <div class="section">
                    <div class="section-title">
                        <span class="section-accent"></span>
                        Вимоги до технологій
                        <span
                                style="font-size:12px; color:var(--text-dim); font-weight:400;"
                        >(рекомендовано — можна замінити аналогами)</span>
                    </div>
                    {#if techItems.length > 0}
                        <div class="tech-grid">
                            {#each techItems as item}
                                <div class="tech-item">
                                    <div class="tech-label">{item.label}</div>
                                    <div class="tech-value">{item.value}</div>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="desc-text">{data.task.techStack}</p>
                    {/if}
                </div>
            {/if}

            <!-- Функціональні вимоги -->
            {#if data.task.requirements && data.task.requirements.length > 0}
                <div class="section">
                    <div class="section-title">
                        <span class="section-accent"></span>
                        Функціональні вимоги
                    </div>
                    <div class="req-group">
                        <ul class="req-list" style="padding-left:0;">
                            {#each data.task.requirements as req, i}
                                <li class="req-item">
                  <span
                          class="req-num"
                          style="width:20px;height:20px;font-size:11px;margin-top:2px;"
                  >{i + 1}</span>
                                    {req}
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            {/if}

            <!-- Кнопка переходу до сабміту -->
            <div class="submit-row">
                {#if data.team}
                    <a
                            href="/tourments/{data.tournament.id}/submit"
                            class="submit-btn"
                            class:submit-btn={!isPastDeadline}
                    >
                        {TASK_CONFIG.submitBtnLabel}
                        <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                {:else}
                    <div
                            style="font-size:14px; color:var(--text-muted); background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px 20px;"
                    >
                        Для здачі завдання потрібно мати команду в цьому турнірі
                    </div>
                {/if}
            </div>
        </main>
    </div>

    <Footer />
</div>