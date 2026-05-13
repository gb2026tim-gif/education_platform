<script lang="ts">
    import { enhance } from '$app/forms';

    // Svelte 5 отримує дані через $props
    let { data } = $props();

    // Описуємо тип учасника для чистого коду
    interface Member {
        name: string;
    }
</script>

<div class="p-8 text-white">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold uppercase tracking-wider">Підтвердження команд</h1>
        <div class="text-xs text-gray-400">
            ВСЬОГО КОМАНД: {data.teams.length} |
            <span class="text-green-400 text-bold uppercase">Підтверджено: {data.teams.filter((t: any) => t.verified).length}</span>
        </div>
    </div>

    <div class="bg-[#1a1f2e] rounded-lg overflow-hidden border border-gray-800 shadow-xl">
        <table class="w-full text-left border-collapse">
            <thead>
            <tr class="text-gray-400 text-[10px] uppercase border-b border-gray-800 bg-[#141824] tracking-widest">
                <th class="p-4">Назва команди</th>
                <th class="p-4">Учасники</th>
                <th class="p-4 text-center">Статус</th>
                <th class="p-4 text-right">Дія</th>
            </tr>
            </thead>
            <tbody>
            {#each data.teams as team}
                <tr class="border-b border-gray-800 hover:bg-[#23293b] transition-all">
                    <td class="p-4 font-semibold text-sm">{team.name}</td>
                    <td class="p-4 text-xs text-gray-400">
                        {team.members.map((m: Member) => m.name).join(', ')}
                    </td>
                    <td class="p-4 text-center">
                            <span class="text-[10px] font-bold px-2 py-1 rounded-sm shadow-inner {team.verified ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}">
                                {team.verified ? 'ПІДТВЕРДЖЕНО' : 'ОЧІКУЄ'}
                            </span>
                    </td>
                    <td class="p-4 text-right">
                        <form method="POST" action="?/toggleVerify" use:enhance>
                            <input type="hidden" name="teamId" value={team.id} />
                            <input type="hidden" name="verified" value={String(team.verified)} />
                            <button type="submit" class="text-blue-500 hover:text-blue-300 font-bold uppercase text-[11px] transition-colors active:scale-95">
                                {team.verified ? 'Скасувати' : 'Підтвердити'}
                            </button>
                        </form>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>