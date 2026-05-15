<script lang="ts">
    let { data } = $props();
</script>

<main class="p-8 flex-1">
    <h1 class="text-3xl font-black mb-10 tracking-tight uppercase">Мій акаунт</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div class="bg-[#161b2c] p-8 rounded-2xl border border-gray-800 shadow-xl border-l-4 border-l-blue-600">
            <div class="text-blue-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Турніри</div>
            <div class="text-5xl font-black mb-1">{data.stats.tournaments}</div>
            <div class="text-[10px] text-gray-500 uppercase">Всього в базі</div>
        </div>

        <div class="bg-[#161b2c] p-8 rounded-2xl border border-gray-800 shadow-xl">
            <div class="text-blue-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Журі</div>
            <div class="text-5xl font-black mb-1">{data.stats.jury}</div>
            <div class="text-[10px] text-gray-500 uppercase">Активно оцінюють</div>
        </div>

        <div class="bg-[#161b2c] p-8 rounded-2xl border border-gray-800 shadow-xl">
            <div class="text-blue-500 text-[10px] font-bold uppercase mb-4 tracking-widest">Курси</div>
            <div class="text-5xl font-black mb-1">{data.stats.courses}</div>
            <div class="text-[10px] text-gray-500 uppercase">Освітні модулі</div>
        </div>
    </div>

    <div class="bg-[#111625] rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden">
        <div class="p-8 border-b border-gray-800 flex justify-between items-center bg-[#14192d]">
            <h2 class="text-xl font-bold flex items-center gap-3 uppercase tracking-tight">
                <span class="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                Керування турнірами
            </h2>
            <a href="/admin/tournaments/new" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                + Новий турнір
            </a>
        </div>

        <div class="divide-y divide-gray-800/50">
            {#each data.tournaments as tournament}
                <div class="p-6 flex justify-between items-center hover:bg-[#1a1f33] transition-all group">
                    <div class="flex items-center gap-6">
                        <div class="w-14 h-14 bg-blue-900/20 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 text-xl font-black uppercase">
                            {tournament.title.charAt(0)}
                        </div>
                        <div>
                            <p class="font-bold text-gray-200 text-xl group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                {tournament.title}
                            </p>
                            <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                Статус: <span class="text-blue-500 font-bold">{tournament.status}</span>
                            </p>
                        </div>
                    </div>
                    <a href="/admin/tournaments/{tournament.id}" class="bg-[#1c233a] hover:bg-blue-600 text-gray-400 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all border border-gray-700">
                        Деталі →
                    </a>
                </div>
            {:else}
                <div class="p-24 text-center text-gray-600 uppercase tracking-[0.2em] text-sm italic">
                    Турнірів не знайдено (Перевір підключення до БД)
                </div>
            {/each}
        </div>
    </div>
</main>