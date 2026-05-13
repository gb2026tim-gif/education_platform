<script lang="ts">
    // Приймаємо user як об'єкт. Any допомагає уникнути конфліктів зі складними типами Prisma
    let { user = {} }: { user: any } = $props();
</script>

<header class="grid grid-cols-3 items-center py-3 px-8 bg-[#060B18] border-b border-white/5 h-[70px]">
    <div class="flex flex-col justify-center">
        <nav class="text-[10px] text-gray-500 flex gap-1.5 uppercase tracking-wider font-semibold">
            <span>Турніри</span>
            <span class="text-gray-700">/</span>
            <span class="text-blue-500 font-bold">Створити турнір</span>
        </nav>
    </div>

    <div class="flex justify-center">
        <div class="inline-flex items-center px-4 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
            Панель адміністратора
        </div>
    </div>

    <div class="flex items-center justify-end gap-6">
        <div class="relative group hidden lg:block">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Швидкий пошук..." class="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 w-48 transition-all" />
        </div>

        <button class="p-1.5 text-gray-500 hover:text-white transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </button>

        <div class="flex items-center gap-3 pl-6 border-l border-white/10">
            <div class="text-right hidden sm:block">
                <p class="text-xs font-bold text-white leading-tight">{user?.name || 'Адмін'}</p>
                <p class="text-[9px] text-gray-600 uppercase font-medium">Log in / Sign in</p>
            </div>
            <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px] shadow-lg shadow-blue-500/20">
                <div class="w-full h-full rounded-full bg-[#060B18] flex items-center justify-center border border-white/10">
                    <span class="text-xs font-black text-blue-400">{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                </div>
            </div>
        </div>
    </div>
</header>