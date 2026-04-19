<!-- src/lib/components/Sidebar.svelte -->
<script lang="ts">
    import { page } from '$app/stores';
    import { signOut } from '$lib/auth-client';
    import { goto } from '$app/navigation';

    let { user } = $props<{ user: { name: string; email: string; role: string } | null }>();

    const isActive = (path: string) =>
        $page.url.pathname === path || $page.url.pathname.startsWith(path + '/');

    async function handleLogout() {
        await signOut();
        await goto('/auth/login');
    }
</script>

<aside class="sidebar">
    <nav class="nav">
        <div class="nav-section">
            <span class="nav-label">Кабінет</span>
            <a href="/profile" class="nav-item" class:active={isActive('/profile')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                Мій акаунт
            </a>
            <a href="/my-teams" class="nav-item" class:active={isActive('/my-teams')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                Мої команди
            </a>
            <a href="/tourments" class="nav-item" class:active={isActive('/tourments')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                Турніри
            </a>
        </div>

        <div class="nav-section">
            <span class="nav-label">Навчання</span>
            <a href="/courses" class="nav-item" class:active={isActive('/courses')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Мої курси
            </a>
            <a href="/tasks" class="nav-item" class:active={isActive('/tasks')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Завдання
            </a>
        </div>

        <div class="nav-section">
            <span class="nav-label">Система</span>
            <a href="/settings" class="nav-item" class:active={isActive('/settings')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Налаштування
            </a>
        </div>
    </nav>

    <button class="logout-btn" onclick={handleLogout}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Вийти
    </button>
</aside>

<style>
    .sidebar {
        width: 200px;
        align-self: stretch;
        background: #0a0e14;
        border-right: 1px solid #1a2535;
        display: flex;
        flex-direction: column;
        padding: 1.25rem 0 1rem;
        flex-shrink: 0;
    }

    .nav {
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .nav-section {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
    }

    .nav-label {
        font-size: 0.68rem;
        color: #3a4a5e;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 700;
        padding: 0 0.75rem;
        margin-bottom: 0.3rem;
    }

    .nav-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.52rem 0.75rem;
        border-radius: 8px;
        color: #6b7a8f;
        text-decoration: none;
        font-size: 0.85rem;
        font-weight: 500;
        transition: background 0.15s, color 0.15s;
        border-left: 3px solid transparent;
    }

    .nav-item:hover {
        background: #0d1828;
        color: #e8edf5;
    }

    .nav-item.active {
        background: #0d1828;
        color: #3d8ef0;
        border-left: 3px solid #3d8ef0;
    }

    .nav-item svg {
        flex-shrink: 0;
        opacity: 0.7;
    }

    .nav-item.active svg {
        opacity: 1;
    }

    .logout-btn {
        margin-top: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.6rem;
        padding: 0.52rem 0.75rem;
        border-radius: 8px;
        background: none;
        border: none;
        color: #6b7a8f;
        font-size: 0.85rem;
        font-weight: 500;
        cursor: pointer;
        transition: color 0.15s;
        font-family: 'Manrope', sans-serif;
        width: calc(100% - 1rem);
    }

    .logout-btn:hover {
        color: #ff6b6b;
    }
</style>