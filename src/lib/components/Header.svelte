<!-- src/lib/components/Header.svelte -->
<script lang="ts">
    import { page } from '$app/stores';

    let mobileOpen = $state(false);
    let dark = $state(true);

    const navLinks = [
        { label: 'Курси',      href: '/courses' },
        { label: 'Календар',   href: '/calendar' },
        { label: 'Команда',    href: '/my-teams' },
        { label: 'Рейтинг',   href: '/leaderboard' },
        { label: 'Інформація', href: '/about' }
    ];

    import Logo from '$lib/components/Logo.svelte';

    function isActive(href: string) {
        return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
    }

    function toggleTheme() {
        dark = !dark;
        document.documentElement.classList.toggle('light-mode', !dark);
    }
</script>

<header style="position:sticky; top:0; z-index:50; background-color: [#0F1115]; border-bottom:1px solid rgba(255,255,255,0.05);">
    <div style="max-width:1280px; margin:0 auto; padding:0 2rem; display:flex; align-items:center; height:80px; gap:2rem;">

        <!-- Logo -->
        <a href="/" style="flex-shrink:0; text-decoration:none; display:flex; align-items:center;" aria-label="LvlUp">
            <Logo size={40} />
        </a>

        <!-- Desktop nav -->
        <nav class="hidden md:flex" style="display:flex; align-items:center; gap:4px; flex:1;">
            {#each navLinks as link}
                <a href={link.href}
                   style="font-size:15px; font-weight:500; padding:7px 16px; border-radius:50px;
                          border:1.5px solid {isActive(link.href) ? 'rgba(255,255,255,0.35)' : 'transparent'};
                          color:{isActive(link.href) ? '#fff' : 'rgba(255,255,255,0.65)'};
                          text-decoration:none; transition:all 0.15s;">
                    {link.label}
                </a>
            {/each}
        </nav>

        <!-- Desktop actions -->
        <div class="hidden md:flex" style="display:flex; align-items:center; gap:1rem; margin-left:auto;">
            <button onclick={toggleTheme} style="width:48px; height:48px; border-radius:50%; background:none; border:none; color:rgba(255,255,255,0.55); cursor:pointer; display:flex; align-items:center; justify-content:center;" aria-label="Тема">
                {#if dark}
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                {:else}
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                {/if}
            </button>
            <button style="width:48px; height:48px; border-radius:50%; background:none; border:none; color:rgba(255,255,255,0.55); cursor:pointer; display:flex; align-items:center; justify-content:center;" aria-label="Пошук">
                <svg width="28" height="28" viewBox="0 0 18 18" fill="none"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M12 12l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </button>
            <a href="/auth/login" style="display:flex; flex-direction:column; align-items:center; gap:2px; text-decoration:none; color:rgba(255,255,255,0.6);">
                <svg width="28" height="28" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="5.5" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M2.5 15.5c0-3.038 2.91-5.5 6.5-5.5s6.5 2.462 6.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                <span style="font-size:11px; font-weight:500; white-space:nowrap;">Log in / Sign in</span>
            </a>
        </div>

        <!-- Mobile burger -->
        <button class="md:hidden" style="margin-left:auto; background:none; border:none; color:#fff; cursor:pointer;" onclick={() => (mobileOpen = !mobileOpen)}>
            {#if mobileOpen}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 5l12 12M5 17L17 5" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            {:else}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16M3 11h16M3 16h16" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
            {/if}
        </button>
    </div>

    {#if mobileOpen}
        <nav style="background:#191921; border-top:1px solid rgba(255,255,255,0.05); padding:0.5rem 1.25rem 1.25rem; display:flex; flex-direction:column; gap:4px;">
            {#each navLinks as link}
                <a href={link.href} onclick={() => (mobileOpen = false)} style="padding:0.75rem 1rem; border-radius:12px; font-size:15px; font-weight:500; color:rgba(255,255,255,0.7); text-decoration:none;">{link.label}</a>
            {/each}
            <div style="margin-top:0.75rem; display:flex; flex-direction:column; gap:0.5rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:0.75rem;">
                <a href="/auth/login" onclick={() => (mobileOpen = false)} style="padding:0.75rem 1rem; border-radius:15px; font-size:15px; font-weight:600; text-align:center; border:1px solid rgba(255,255,255,0.25); color:rgba(255,255,255,0.7); text-decoration:none;">Увійти</a>
                <a href="/auth/register" onclick={() => (mobileOpen = false)} style="padding:0.75rem 1rem; border-radius:15px; font-size:15px; font-weight:600; text-align:center; background:#3E83FF; color:#fff; text-decoration:none;">Зареєструватись</a>
            </div>
        </nav>
    {/if}
</header>
