<script lang="ts">
    import Sider_admin from '$lib/components/Sider_admin.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Header_admin from "$lib/components/Header_admin.svelte";

    import '/src/app.css';

    let { data, children } = $props();
</script>

<div class="flex h-screen w-full overflow-hidden bg-[#060B18]">

    <aside class="h-full flex-shrink-0">
        <Sider_admin />
    </aside>

    <div class="flex flex-1 flex-col min-w-0 h-full">

        <Header_admin user={data?.user ?? {}} />

        <main class="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar text-white flex flex-col">

            <div class="flex-1 p-6 md:p-10">
                <div class="max-w-[1400px] mx-auto w-full">
                    {@render children()}
                </div>
            </div>

            <Footer />
        </main>
    </div>
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #060B18;
        overflow: hidden;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.05);
        border-radius: 20px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255,255,255,0.15);
    }
</style>