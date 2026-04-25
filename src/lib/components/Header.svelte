<!-- src/lib/components/Header.svelte -->
<script lang="ts">
    import { page } from '$app/state';
    import { signOut } from '$lib/auth-client';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Logo from '$lib/components/Logo.svelte';

    let mobileOpen = $state(false);
    let dark = $state(true);
    let userMenuOpen = $state(false);
    let searchOpen = $state(false);
    let searchQuery = $state('');
    let searchInput = $state<HTMLInputElement | null>(null);

    function openSearch() {
        searchOpen = true;
        setTimeout(() => searchInput?.focus(), 50);
    }
    function closeSearch() {
        searchOpen = false;
        searchQuery = '';
    }
    function handleSearchKey(e: KeyboardEvent) {
        if (e.key === 'Escape') closeSearch();
    }

    const navLinks = [
        { label: 'Курси',      href: '/courses' },
        { label: 'Календар',   href: '/calendar' },
        { label: 'Турніри',    href: '/tournaments' },
        { label: 'Рейтинг',   href: '/leaderboard' },
        { label: 'Інформація', href: '/about' }
    ];

    function isActive(href: string): boolean {
        return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
    }

    onMount(() => {
        dark = localStorage.getItem('theme') !== 'light';
    });

    function applyTheme(isDark: boolean) {
        if (isDark) {
            document.documentElement.classList.remove('light-mode');
        } else {
            document.documentElement.classList.add('light-mode');
        }
    }

    function toggleTheme() {
        dark = !dark;
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        applyTheme(dark);
    }

    async function handleLogout() {
        await signOut();
        await goto('/auth/login');
    }

    function handleSearchFocusOut(e: FocusEvent) {
        const cur = e.currentTarget as HTMLElement;
        const rel = e.relatedTarget as Node;
        if (!cur.contains(rel)) closeSearch();
    }

    function handleClickOutside(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.user-menu-wrap')) {
            userMenuOpen = false;
        }
    }

    const user = $derived(page.data?.user ?? null);

    function getInitials(name: string): string {
        return name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() ?? '?';
    }
</script>

<svelte:window onclick={handleClickOutside} />

<header style="position:sticky; top:0; z-index:50; background:var(--header-bg,rgba(29,29,38,0.96)); backdrop-filter:blur(8px); border-bottom:1px solid var(--border,rgba(255,255,255,0.05)); transition:background 0.25s;">
    <div style="max-width:1280px; margin:0 auto; padding:0 2rem; display:flex; align-items:center; height:72px; gap:2rem;">

        <a href="/" style="flex-shrink:0; text-decoration:none;" aria-label="LvlUp — Головна">
            <Logo size={40} />
        </a>

        <nav style="display:flex; align-items:center; gap:4px; flex:1;" class="hidden md:flex">
            {#each navLinks as link}
                <a href={link.href}
                   style={isActive(link.href)
                     ? 'font-size:17px;font-weight:700;padding:10px 18px;border-radius:13px;border:1.5px solid #3E83FF;color:#3E83FF;box-shadow:0 0 10px #3E83FF4D;text-decoration:none;transition:all 0.15s;'
                     : 'font-size:17px;font-weight:500;padding:10px 18px;border-radius:13px;border:1.5px solid transparent;color:var(--text-muted);text-decoration:none;transition:all 0.15s;'}>
                    {link.label}
                </a>
            {/each}
        </nav>

        <div style="display:flex; align-items:center; gap:1rem; margin-left:auto;" class="hidden md:flex">
            <!-- Search: expands LEFT from icon -->
            <div class="search-wrap" style="position:relative; display:flex; align-items:center;"
                 onfocusout={handleSearchFocusOut}>
                {#if searchOpen}
                    <div style="position:absolute; right:0; top:50%; transform:translateY(-50%); display:flex; align-items:center; gap:0.4rem; background:var(--surface,#1A1D23); border:1.5px solid rgba(62,131,255,0.5); border-radius:24px; padding:0 0.6rem 0 0.9rem; height:36px; width:240px; animation:searchExpand 0.2s ease-out;">
                        <input
                                bind:this={searchInput}
                                bind:value={searchQuery}
                                onkeydown={handleSearchKey}
                                placeholder="Пошук..."
                                style="flex:1; background:none; border:none; outline:none; color:var(--text,#fff); font-size:13px; font-family:inherit;"
                        />
                        <button onclick={closeSearch} style="background:none; border:none; color:var(--text-muted); cursor:pointer; display:flex; padding:0;" aria-label="Закрити">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div style="width:36px; height:36px;"></div>
                {:else}
                    <button onclick={openSearch} aria-label="Пошук"
                            style="width:36px; height:36px; border-radius:50%; background:none; border:none; color:var(--text-muted); cursor:pointer; display:flex; align-items:center; justify-content:center;">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </button>
                {/if}
            </div>

            <!-- Theme toggle — after search -->
            <button onclick={toggleTheme} aria-label={dark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
                    style="width:36px; height:36px; border-radius:50%; background:none; border:none; color:var(--text-muted); cursor:pointer; display:flex; align-items:center; justify-content:center;">
                {#if dark}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                {:else}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                {/if}
            </button>

            {#if user}
                <div class="user-menu-wrap" style="position:relative;">
                    <button onclick={() => userMenuOpen = !userMenuOpen}
                            aria-label="Меню користувача"
                            style="width:40px; height:40px; border-radius:50%; overflow:hidden; border:2px solid #3E83FF; background:#0d1b3e; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; font-size:14px; font-weight:700;">
                        {#if user.image}
                            <img src={user.image} alt={user.name} style="width:100%; height:100%; object-fit:cover;" />
                        {:else}
                            {getInitials(user.name)}
                        {/if}
                    </button>

                    {#if userMenuOpen}
                        <div style="position:absolute; right:0; top:calc(100% + 8px); background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:0.5rem; min-width:180px; z-index:100; box-shadow:0 8px 24px rgba(0,0,0,0.3);">
                            <div style="padding:0.5rem 0.75rem; border-bottom:1px solid var(--border); margin-bottom:0.25rem;">
                                <p style="font-size:0.85rem; font-weight:600; color:var(--text);">{user.name}</p>
                                <p style="font-size:0.75rem; color:var(--text-muted);">{user.email}</p>
                            </div>
                            <a href="/dashboard" style="display:block; padding:0.5rem 0.75rem; border-radius:8px; font-size:0.875rem; color:var(--text); text-decoration:none;">Дашборд</a>
                            <a href="/profile" style="display:block; padding:0.5rem 0.75rem; border-radius:8px; font-size:0.875rem; color:var(--text); text-decoration:none;">Профіль</a>
                            <button onclick={handleLogout}
                                    style="width:100%; text-align:left; padding:0.5rem 0.75rem; border-radius:8px; font-size:0.875rem; color:#f87171; background:none; border:none; cursor:pointer; margin-top:0.25rem; border-top:1px solid var(--border); padding-top:0.5rem;">
                                Вийти
                            </button>
                        </div>
                    {/if}
                </div>
            {:else}
                <a href="/auth/login" style="display:flex; flex-direction:column; align-items:center; gap:2px; text-decoration:none; color:var(--text-muted);">
                    <svg width="20" height="20" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 15.5c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    <span style="font-size:11px; font-weight:500; white-space:nowrap;">Log in / Sign in</span>
                </a>
            {/if}
        </div>

        <button class="md:hidden" onclick={() => (mobileOpen = !mobileOpen)}
                aria-label="Відкрити меню"
                style="margin-left:auto; background:none; border:none; color:var(--text); cursor:pointer;">
            {#if mobileOpen}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M5 17L17 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {:else}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {/if}
        </button>
    </div>

    {#if mobileOpen}
        <nav style="background:var(--surface); border-top:1px solid var(--border); padding:0.5rem 1.25rem 1.25rem; display:flex; flex-direction:column; gap:4px;">
            {#each navLinks as link}
                <a href={link.href} onclick={() => (mobileOpen = false)}
                   style="padding:0.75rem 1rem; border-radius:12px; font-size:15px; font-weight:500; color:var(--text-muted); text-decoration:none;">
                    {link.label}
                </a>
            {/each}
            <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem; border-top:1px solid var(--border); padding-top:0.75rem;">
                <button onclick={toggleTheme}
                        style="padding:0.75rem 1rem; border-radius:12px; background:none; border:none; color:var(--text-muted); font-size:15px; font-weight:500; cursor:pointer; text-align:left;">
                    {dark ? '☀️ Світла тема' : '🌙 Темна тема'}
                </button>
                {#if user}
                    <a href="/dashboard" onclick={() => (mobileOpen = false)} style="padding:0.75rem 1rem; border-radius:15px; font-size:15px; font-weight:600; text-align:center; border:1px solid rgba(62,131,255,0.4); color:#3E83FF; text-decoration:none;">Дашборд</a>
                    <button onclick={handleLogout} style="padding:0.75rem 1rem; border-radius:15px; font-size:15px; font-weight:600; text-align:center; background:none; border:1px solid rgba(248,113,113,0.3); color:#f87171; cursor:pointer;">Вийти</button>
                {:else}
                    <a href="/auth/login" onclick={() => (mobileOpen = false)} style="padding:0.75rem 1rem; border-radius:15px; font-size:15px; font-weight:600; text-align:center; border:1px solid var(--border-hover); color:var(--text-muted); text-decoration:none;">Увійти</a>
                    <a href="/auth/register" onclick={() => (mobileOpen = false)} style="padding:0.75rem 1rem; border-radius:15px; font-size:15px; font-weight:600; text-align:center; background:#3E83FF; color:#fff; text-decoration:none;">Зареєструватись</a>
                {/if}
            </div>
        </nav>
    {/if}
</header>

<style>
    input:focus { outline: none !important; box-shadow: none !important; }
    @keyframes searchExpand {
        from { width: 36px; opacity: 0; }
        to   { width: 240px; opacity: 1; }
    }
</style>