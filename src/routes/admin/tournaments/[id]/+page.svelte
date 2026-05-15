<script lang="ts">
    // src/routes/admin/tournaments/[id]/+page.svelte
    import type { PageData, ActionData } from './$types';

    // Отримуємо дані з сервера та результат екшенів через Runes
    let { data, form }: { data: PageData, form: ActionData } = $props();

    const statusLabel: Record<string, string> = {
        DRAFT: 'Чернетка',
        PUBLISHED: 'Опубліковано',
        REGISTRATION: 'Реєстрація',
        RUNNING: 'Триває',
        EVALUATION: 'Оцінювання',
        FINISHED: 'Завершено',
    };

    const statusColor: Record<string, string> = {
        DRAFT:        'rgba(255,255,255,0.4)',
        PUBLISHED:    '#818cf8',
        REGISTRATION: '#3E83FF',
        RUNNING:      '#4ade80',
        EVALUATION:   '#eab308',
        FINISHED:     'rgba(255,255,255,0.5)',
    };
</script>

<svelte:head>
    <title>{data.tournament.title} — Керування</title>
</svelte:head>

<div style="max-width: 1100px; margin: 0 auto; padding: 2rem;">

    <div style="margin-bottom: 2.5rem; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
            <p style="color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-bottom: 4px;">
                <a href="/admin/tournaments" style="color: inherit; text-decoration: none;">← Турніри</a> / Керування
            </p>
            <h1 style="margin: 0; font-size: 2rem; font-weight: 800; color: #fff;">{data.tournament.title}</h1>
            <div style="margin-top: 8px; display: flex; align-items: center; gap: 10px;">
        <span style="background: {statusColor[data.tournament.status] || '#333'};
                     color: #000; padding: 2px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">
          {statusLabel[data.tournament.status] || data.tournament.status}
        </span>
                <span style="color: rgba(255,255,255,0.4); font-size: 0.85rem;">
          {data.verifiedTeams} підтверджених команд
        </span>
            </div>
        </div>
    </div>

    <section style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #fff;">Заявки на участь</h2>

            <form method="POST" action="?/verifyAll">
                <button type="submit" style="background: rgba(62,131,255,0.1); color: #3E83FF; border: 1px solid rgba(62,131,255,0.3);
                        padding: 0.5rem 1rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; cursor: pointer;">
                    Підтвердити всіх
                </button>
            </form>
        </div>

        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 0.8rem; text-transform: uppercase;">
                    <th style="padding: 12px; font-weight: 600;">Назва команди</th>
                    <th style="padding: 12px; font-weight: 600;">Капітан</th>
                    <th style="padding: 12px; font-weight: 600;">Учасники</th>
                    <th style="padding: 12px; font-weight: 600;">Статус</th>
                    <th style="padding: 12px; font-weight: 600; text-align: right;">Дія</th>
                </tr>
                </thead>
                <tbody style="color: rgba(255,255,255,0.85);">
                {#each data.teams as team}
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                        <td style="padding: 16px 12px; font-weight: 600;">{team.name}</td>
                        <td style="padding: 16px 12px;">
                            <div style="font-size: 0.9rem;">{team.captain?.name || 'Н/Д'}</div>
                            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.35);">{team.captain?.email || ''}</div>
                        </td>
                        <td style="padding: 16px 12px;">{team._count?.members || 0}</td>
                        <td style="padding: 16px 12px;">
                <span style="font-size: 0.75rem; font-weight: 700;
                             color: {team.verified ? '#4ade80' : '#eab308'};">
                  {team.verified ? 'APPROVED' : 'PENDING'}
                </span>
                        </td>
                        <td style="padding: 16px 12px; text-align: right;">
                            <form method="POST" action="?/toggleVerify">
                                <input type="hidden" name="teamId" value={team.id} />
                                <input type="hidden" name="verified" value={team.verified ? 'true' : 'false'} />
                                <button type="submit" style="background: none; border: none; font-size: 1.25rem; cursor: pointer;">
                                    {team.verified ? '✅' : '⬜'}
                                </button>
                            </form>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    </section>

    <section style="background: #0d1b3e; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 1.5rem;">
        <h3 style="margin: 0 0 1rem; font-size: 1.1rem; font-weight: 700;">Статус турніру</h3>
        <form method="POST" action="?/setStatus" style="display: flex; gap: 10px;">
            <select name="status" style="background: #1a2a4e; border: 1px solid rgba(255,255,255,0.1); color: #fff;
                                   padding: 0.5rem; border-radius: 8px; flex: 1;">
                {#each Object.keys(statusLabel) as key}
                    <option value={key} selected={data.tournament.status === key}>{statusLabel[key]}</option>
                {/each}
            </select>
            <button type="submit" style="background: #3E83FF; color: #fff; border: none; padding: 0.5rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Зберегти
            </button>
        </form>
    </section>

</div>

<style>
    :global(body) {
        background-color: #081024;
        color: #fff;
        font-family: 'Inter', sans-serif;
    }
</style>