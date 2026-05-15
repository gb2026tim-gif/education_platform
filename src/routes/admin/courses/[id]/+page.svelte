<script lang="ts">
    import { enhance } from '$app/forms';
    export const ssr = false;
    let { data } = $props();

    // Стан для основної інформації курсу
    let title = $state(data.course?.title ?? '');
    let shortDesc = $state(data.course?.shortDesc ?? '');
    let description = $state(data.course?.description ?? '');
    let level = $state(data.course?.level ?? 'Beginner');
    let price = $state(data.course?.price ?? 0);
    let published = $state(data.course?.published ?? false);

    // Синхронізація з базою при завантаженні
    $effect(() => {
        if (data.course) {
            title = data.course.title;
            shortDesc = data.course.shortDesc;
            description = data.course.description;
            level = data.course.level;
            price = data.course.price;
            published = data.course.published;
        }
    });

    let activeTab = $state('main');
</script>

<div class="p-6 max-w-6xl mx-auto text-white">
    <div class="flex justify-between items-end mb-8">
        <div>
            <h1 class="text-3xl font-bold text-blue-400 mb-1">
                {data.course?.title || 'Редагування курсу'}
            </h1>
            <p class="text-gray-500 text-sm">Панель адміністратора • ID: {data.course?.id}</p>
        </div>
        <a href="/admin/courses" class="text-sm text-gray-400 hover:text-white transition border-b border-gray-700 pb-1">
            ← Назад до списку
        </a>
    </div>

    <div class="flex gap-8 border-b border-gray-800 mb-10">
        <button
                onclick={() => activeTab = 'main'}
                class="pb-4 px-1 text-sm font-medium transition-all {activeTab === 'main' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}">
            Основна інформація
        </button>
        <button
                onclick={() => activeTab = 'content'}
                class="pb-4 px-1 text-sm font-medium transition-all {activeTab === 'content' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}">
            Модулі та уроки
        </button>
    </div>

    {#if activeTab === 'main'}
        <form method="POST" action="?/updateCourse" use:enhance class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div class="lg:col-span-7 space-y-6 bg-gray-900/40 p-8 rounded-3xl border border-gray-800 shadow-xl">
                <div class="space-y-2">
                    <label for="f_title" class="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold ml-1">Назва курсу</label>
                    <input
                            id="f_title" name="title" type="text" bind:value={title}
                            class="admin-input w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-white outline-none focus:border-blue-500 transition-all"
                    />
                </div>

                <div class="space-y-2">
                    <label for="f_short" class="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold ml-1">Короткий опис для картки</label>
                    <textarea
                            id="f_short" name="shortDesc" bind:value={shortDesc}
                            class="admin-input w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-white h-28 outline-none focus:border-blue-500 transition-all"
                    ></textarea>
                </div>

                <div class="space-y-2">
                    <label for="f_desc" class="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold ml-1">Повний опис програми</label>
                    <textarea
                            id="f_desc" name="description" bind:value={description}
                            class="admin-input w-full bg-gray-800 border border-gray-700 rounded-xl px-5 py-3 text-white h-56 outline-none focus:border-blue-500 transition-all"
                    ></textarea>
                </div>
            </div>

            <div class="lg:col-span-5 space-y-6">
                <div class="bg-gray-900/40 p-8 rounded-3xl border border-gray-800 shadow-xl space-y-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <label for="f_level" class="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold ml-1">Рівень</label>
                            <select id="f_level" name="level" bind:value={level} class="admin-input w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white">
                                <option value="Beginner">Новачок</option>
                                <option value="Intermediate">Середній</option>
                                <option value="Advanced">Профі</option>
                            </select>
                        </div>
                        <div class="space-y-2">
                            <label for="f_price" class="text-[10px] uppercase tracking-[2px] text-gray-500 font-bold ml-1">Ціна (грн)</label>
                            <input id="f_price" name="price" type="number" bind:value={price} class="admin-input w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white" />
                        </div>
                    </div>

                    <div class="pt-4 border-t border-gray-800 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <input id="f_pub" type="checkbox" name="published" bind:checked={published} class="w-5 h-5 accent-blue-500 rounded border-gray-700" />
                            <label for="f_pub" class="text-sm text-gray-300 font-medium cursor-pointer">Опублікувати курс</label>
                        </div>
                        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider {published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}">
                            {published ? 'Активний' : 'Чернетка'}
                        </span>
                    </div>
                </div>

                <button type="submit" class="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]">
                    Зберегти всі зміни
                </button>
            </div>
        </form>

    {:else if activeTab === 'content'}
        <div class="space-y-4">
            {#each data.course?.modules || [] as module}
                <div class="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
                    <div class="bg-gray-800/50 p-5 flex justify-between items-center border-b border-gray-800">
                        <h3 class="font-bold text-blue-100 italic">Модуль: {module.title}</h3>
                        <div class="flex gap-4">
                            <button class="text-[11px] text-gray-400 hover:text-white transition">Редагувати</button>
                            <button class="text-[11px] text-red-400/70 hover:text-red-400 transition">Видалити</button>
                        </div>
                    </div>
                    <div class="p-5 space-y-3">
                        {#each module.lessons || [] as lesson}
                            <div class="flex items-center justify-between p-4 bg-gray-800/20 rounded-xl border border-gray-700/30 group hover:border-blue-500/30 transition-all">
                                <span class="text-sm text-gray-300 font-medium">
                                    <span class="text-gray-600 mr-2">{lesson.order}.</span> {lesson.title}
                                </span>
                                <button class="opacity-0 group-hover:opacity-100 text-[10px] bg-gray-800 px-3 py-1 rounded-md text-gray-400 transition-all hover:text-white">⚙️ Налаштувати</button>
                            </div>
                        {/each}
                        <button class="w-full py-3 mt-2 border border-dashed border-gray-700 rounded-xl text-xs text-gray-500 hover:border-blue-500/30 hover:text-blue-400 transition-all">
                            + Додати урок в цей модуль
                        </button>
                    </div>
                </div>
            {/each}
            <button class="w-full py-10 border-2 border-dashed border-gray-800 rounded-3xl text-gray-500 font-bold hover:bg-gray-900/20 hover:border-blue-500/50 hover:text-blue-400 transition-all shadow-inner">
                + Створити новий модуль програми
            </button>
        </div>
    {/if}
</div>

<style>
    /* ПРИМУСОВИЙ ВИГЛЯД ТЕКСТУ В ПОЛЯХ */
    :global(.admin-input) {
        color: #ffffff !important; /* Текст завжди білий */
        background-color: #1f2937 !important; /* Фон темно-сірий (Tailwind gray-800) */
    }

    :global(.admin-input:focus) {
        background-color: #111827 !important; /* Ще темніший при активності */
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    /* Стиль для скролбару всередині textarea */
    textarea::-webkit-scrollbar {
        width: 8px;
    }
    textarea::-webkit-scrollbar-thumb {
        background: #374151;
        border-radius: 10px;
    }
</style>