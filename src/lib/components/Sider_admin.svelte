<script lang="ts">
    import { page } from '$app/stores';

    const menuItems = [
        { name: 'Мій акаунт', href: '/admin/dashboard' },
        { name: 'Всі турніри', href: '/admin/tournaments' },
        { name: 'Створити', href: '/admin/tournaments/new' },
        { name: 'Журі', href: '/admin/jury' }, // <--- Зміни тут на /jury
        { name: 'Курси', href: '/admin/courses' }
    ];
</script>

<aside class="w-64 min-h-screen bg-[#0B1224] border-r border-white/10 p-6 flex flex-col text-white">
    <div class="mb-10 flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">Up</div>
        <span class="text-xl font-bold tracking-tight">LvlUp</span>
    </div>

    <nav class="flex-1 space-y-2">
        <p class="text-xs uppercase text-gray-500 font-semibold mb-4 ml-2 tracking-wider">Огляд</p>

        {#each menuItems as item}
            <a
                    href={item.href}
                    class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 {$page.url.pathname === item.href ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'hover:bg-white/5 text-gray-400'}"
            >
                <span class="text-sm font-medium">{item.name}</span>
            </a>
        {/each}
    </nav>

    <div class="mt-auto pt-6 border-t border-white/5">
        <button class="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl transition-all">
            <span class="text-sm font-medium">Вийти</span>
        </button>
    </div>
</aside>