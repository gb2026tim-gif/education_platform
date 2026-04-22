<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    const p = $derived(data.profile);

    let saving        = $state(false);
    let saved         = $state(false);
    let uploadError   = $state('');
    let editing       = $state(false);
    let avatarPreview = $state('' as string);

    async function handleAvatarUpload(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const file  = input.files?.[0];
        if (!file) return;
        avatarPreview = URL.createObjectURL(file);
        const fd = new FormData();
        fd.append('avatar', file);
        const res  = await fetch('/api/upload', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.error) { uploadError = json.error; avatarPreview = ''; }
    }

    function getInitials(name: string) {
        return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '??';
    }

    interface Certificate {
        id:       string;
        type:     'course' | 'tournament';
        title:    string;
        subtitle: string;
        date:     string;
        imageUrl: string;
        filename: string;
    }

    const CERTIFICATES: Certificate[] = [
        { id: 'c1', type: 'course',     title: 'Основи UI/UX Дизайну',     subtitle: 'Завершення курсу · TOP 50',        date: '2026', imageUrl: '/certs/cert-course-1.png',     filename: 'cert-ui-ux-design.png' },
        { id: 'c2', type: 'course',     title: 'Програмування Python',      subtitle: 'Завершення курсу · TOP 50',        date: '2026', imageUrl: '/certs/cert-course-2.png',     filename: 'cert-python.png' },
        { id: 'c3', type: 'course',     title: 'Веб-розробка Fullstack',    subtitle: 'Завершення курсу · TOP 50',        date: '2026', imageUrl: '/certs/cert-course-3.png',     filename: 'cert-fullstack.png' },
        { id: 'c4', type: 'course',     title: 'Цифровий Маркетинг',        subtitle: 'Завершення курсу · TOP 50',        date: '2026', imageUrl: '/certs/cert-course-4.png',     filename: 'cert-digital-marketing.png' },
        { id: 'c5', type: 'course',     title: 'Курс за вибором',           subtitle: 'Завершення курсу · TOP 50',        date: '2026', imageUrl: '/certs/cert-course-5.png',     filename: 'cert-course-5.png' },
        { id: 't1', type: 'tournament', title: 'DJANGO PUB',                subtitle: 'Учасник хакатону · Волинський НУ', date: '2026', imageUrl: '/certs/cert-tournament-1.png', filename: 'cert-django-pub.png' },
        { id: 't2', type: 'tournament', title: 'Hackaton CodeFest 2026',    subtitle: 'Сертифікат учасника',              date: '2026', imageUrl: '/certs/cert-tournament-2.png', filename: 'cert-codefest-2026.png' },
        { id: 't3', type: 'tournament', title: 'Змагання з Кібербезпеки',  subtitle: 'Сертифікат учасника',              date: '2026', imageUrl: '/certs/cert-tournament-3.png', filename: 'cert-cyber-security.png' },
        { id: 't4', type: 'tournament', title: 'Олімпіада з робототехніки', subtitle: 'Сертифікат учасника',             date: '2026', imageUrl: '/certs/cert-tournament-4.png', filename: 'cert-robotics.png' },
    ];

    const courseCerts     = $derived(CERTIFICATES.filter(c => c.type === 'course'));
    const tournamentCerts = $derived(CERTIFICATES.filter(c => c.type === 'tournament'));

    async function downloadCert(cert: Certificate) {
        try {
            const res  = await fetch(cert.imageUrl);
            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = cert.filename;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            window.open(cert.imageUrl, '_blank');
        }
    }

    function handleCertKey(e: KeyboardEvent, cert: Certificate) {
        if (e.key === 'Enter' || e.key === ' ') downloadCert(cert);
    }
</script>

<svelte:head><title>Мій акаунт — LvUp</title></svelte:head>

<style>
    /* ── form fields ───────────────────────────── */
    .field-input {
        width: 100%;
        background: var(--bg-secondary);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 10px 14px;
        color: var(--text);
        font-size: 14px;
        font-family: 'Manrope', sans-serif;
        outline: none;
        box-sizing: border-box;
        transition: border-color .15s;
    }
    .field-input:focus   { border-color: #3d8ef0; }
    .field-input:disabled { opacity: .65; cursor: not-allowed; }

    :global(.light-mode) .field-input {
        background: #f0f4ff;
        border-color: rgba(10,14,26,.12);
        color: #0a0e1a;
    }
    :global(.light-mode) .field-input:focus { border-color: #3d8ef0; }

    /* ── panel ─────────────────────────────────── */
    .panel {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 24px 28px;
    }
    :global(.light-mode) .panel {
        background: #fff;
        border-color: rgba(10,14,26,.1);
        box-shadow: 0 2px 12px rgba(0,0,0,.06);
    }

    .panel-title {
        font-size: 20px;
        font-weight: 700;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    .panel-accent { width: 4px; height: 22px; background: #3d8ef0; border-radius: 2px; display: block; }

    /* ── avatar upload label ───────────────────── */
    /* <label> wraps <input type=file> — no separate for= needed per HTML spec */
    .avatar-upload-label {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: #3d8ef0;
        border: 2px solid var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background .15s;
    }
    .avatar-upload-label:hover { background: #2d7de0; }

    /* ── buttons ───────────────────────────────── */
    .btn-primary {
        padding: 11px 28px; border-radius: 10px;
        background: #3d8ef0; border: none;
        color: #fff; font-size: 14px; font-weight: 700;
        cursor: pointer; font-family: 'Manrope', sans-serif;
        transition: background .15s;
    }
    .btn-primary:hover { background: #2d7de0; }

    .btn-secondary {
        padding: 11px 28px; border-radius: 10px;
        border: 1px solid var(--border-hover); background: none;
        color: var(--text-muted); font-size: 14px; font-weight: 600;
        cursor: pointer; font-family: 'Manrope', sans-serif;
        transition: border-color .15s, color .15s;
    }
    .btn-secondary:hover { border-color: #3d8ef0; color: #3d8ef0; }

    /* ── certificates ──────────────────────────── */
    .section-heading {
        font-size: 22px;
        font-weight: 800;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
    }

    .cert-section {
        border-radius: 14px;
        padding: 22px;
        margin-bottom: 16px;
        background: rgba(255,255,255,.03);
        border: 1px solid var(--border);
    }
    :global(.light-mode) .cert-section { background: #f4f7ff; border-color: rgba(61,142,240,.12); }

    .cert-cat-label {
        font-size: 13px; font-weight: 700; color: var(--text-muted);
        letter-spacing: .06em; text-transform: uppercase;
        margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
    }

    .cert-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px,1fr));
        gap: 14px;
    }

    .cert-card {
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        cursor: pointer;
        transition: transform .2s, box-shadow .2s, border-color .2s;
        position: relative;
        background: var(--surface);
    }
    :global(.light-mode) .cert-card { border-color: rgba(10,14,26,.1); box-shadow: 0 2px 8px rgba(0,0,0,.06); }
    .cert-card:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 14px 44px rgba(0,0,0,.22); }
    :global(.light-mode) .cert-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,.14); }

    .cert-img { width: 100%; height: 145px; object-fit: cover; display: block; border-bottom: 1px solid var(--border); }
    :global(.light-mode) .cert-img { border-color: rgba(10,14,26,.08); }

    .cert-body   { padding: 12px 14px; }
    .cert-title  { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
    .cert-sub    { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; }
    .cert-date   { font-size: 11px; color: var(--text-dim); display: flex; align-items: center; gap: 4px; }

    .cert-overlay {
        position: absolute; inset: 0;
        background: rgba(0,0,0,.52);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity .2s; border-radius: 12px;
    }
    .cert-card:hover .cert-overlay { opacity: 1; }

    .cert-dl-btn {
        display: flex; flex-direction: column; align-items: center; gap: 7px;
        background: rgba(61,142,240,.9); border: none;
        padding: 12px 20px; border-radius: 10px; color: #fff;
        font-size: 13px; font-weight: 700; cursor: pointer;
        font-family: 'Manrope', sans-serif; transition: background .15s;
    }
    .cert-dl-btn:hover { background: #3d8ef0; }
</style>

<div style="min-height:100vh; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif;">
    <Header />

    <div style="display:flex; align-items:flex-start;">
        <Sidebar user={p} />

        <main style="flex:1; padding:32px 44px; max-width:1100px;">

            <div style="font-size:13px; color:var(--text-dim); margin-bottom:4px;">
                Кабінет / <span style="color:var(--text-muted);">Мій акаунт</span>
            </div>
            <h1 style="font-size:36px; font-weight:800; color:var(--text); margin-bottom:24px; letter-spacing:-0.5px;">Мій акаунт</h1>

            {#if p != null}

                <!-- Profile hero -->
                <div class="panel" style="display:flex; align-items:center; gap:24px; margin-bottom:20px;">
                    <div style="position:relative; flex-shrink:0;">
                        {#if avatarPreview || p.image}
                            <img src={avatarPreview || p.image} alt="Фото профілю"
                                 style="width:90px;height:90px;border-radius:50%;border:3px solid #2a4a7f;object-fit:cover;" />
                        {:else}
                            <div style="width:90px;height:90px;border-radius:50%;background:var(--surface-2);border:3px solid var(--border-hover);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:var(--text);">
                                {getInitials(p.name)}
                            </div>
                        {/if}
                        <!-- label wraps input[type=file] directly — valid without for= -->
                        <label class="avatar-upload-label" aria-label="Завантажити фото профілю">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                <circle cx="12" cy="13" r="4"/>
                            </svg>
                            <input type="file" accept="image/jpeg,image/png,image/webp" onchange={handleAvatarUpload} style="display:none;" />
                        </label>
                        {#if uploadError}
                            <div style="position:absolute;top:100%;left:0;font-size:11px;color:#f87171;white-space:nowrap;margin-top:4px;">{uploadError}</div>
                        {/if}
                    </div>

                    <div style="flex:1;">
                        <div style="font-size:24px;font-weight:800;color:var(--text);margin-bottom:4px;">
                            {p.firstName && p.lastName ? p.firstName + ' ' + p.lastName : p.name}
                        </div>
                        <div style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">{p.email}</div>
                        {#if p.captainOf && p.captainOf.length > 0}
                            <div style="font-size:13px;color:var(--text-muted);">Турнір: {p.captainOf[0]?.tournament?.title}</div>
                        {/if}
                    </div>

                    {#if p.captainOf && p.captainOf.length > 0}
                        <div style="background:rgba(61,142,240,.1);border:1px solid rgba(61,142,240,.3);border-radius:12px;padding:16px 20px;min-width:180px;">
                            <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#3d8ef0;text-transform:uppercase;margin-bottom:10px;">Активність:</div>
                            {#each (p.captainOf ?? []) as team}
                                <div style="margin-bottom:8px;">
                                    <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;">Турнір: <span style="color:#3d8ef0;">{team.tournament.title}</span></div>
                                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                        <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;background:rgba(61,142,240,.22);color:#3d8ef0;">Командир</span>
                                        <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;background:rgba(61,142,240,.22);color:#3d8ef0;">Команда: {team.name}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                {#if form?.error}
                    <div style="background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:12px;padding:12px 16px;margin-bottom:16px;color:#f87171;font-size:14px;">{form.error}</div>
                {/if}
                {#if saved || form?.success}
                    <div style="background:rgba(62,207,124,.1);border:1px solid rgba(62,207,124,.3);border-radius:12px;padding:12px 16px;margin-bottom:16px;color:#3ecf7c;font-size:14px;">Збережено успішно!</div>
                {/if}

                <form method="POST" action="?/updateProfile" use:enhance={() => {
                    saving = true;
                    return async ({ update }) => {
                        await update();
                        saving = false; saved = true; editing = false;
                        setTimeout(() => saved = false, 3000);
                    };
                }}>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">

                        <!-- Особисті дані -->
                        <div class="panel">
                            <div class="panel-title"><span class="panel-accent"></span>Особисті дані</div>
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                                <div>
                                    <label for="firstName" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Ім'я <span style="color:#3d8ef0;">*</span></label>
                                    <input id="firstName" name="firstName" type="text" disabled={!editing} value={p.firstName ?? ''} required placeholder="Іван" class="field-input" />
                                </div>
                                <div>
                                    <label for="lastName" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Прізвище <span style="color:#3d8ef0;">*</span></label>
                                    <input id="lastName" name="lastName" type="text" disabled={!editing} value={p.lastName ?? ''} required placeholder="Шевченко" class="field-input" />
                                </div>
                                <div>
                                    <label for="city" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Місто</label>
                                    <input id="city" name="city" type="text" disabled={!editing} value={p.city ?? ''} placeholder="Львів" class="field-input" />
                                </div>
                                <div>
                                    <label for="school" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Місце навчання</label>
                                    <input id="school" name="school" type="text" disabled={!editing} value={p.school ?? ''} placeholder="ФКТБП" class="field-input" />
                                </div>
                            </div>
                        </div>

                        <!-- Контакти -->
                        <div class="panel">
                            <div class="panel-title"><span class="panel-accent"></span>Контакти</div>
                            <div style="display:flex;flex-direction:column;gap:14px;">
                                <div>
                                    <!-- email is read-only display, no input — use <p> not <label> -->
                                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:6px;">E-mail <span style="color:#3d8ef0;">*</span></p>
                                    <div style="display:flex;align-items:center;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;padding:10px 14px;gap:8px;">
                                        <span style="color:var(--text);font-size:14px;flex:1;">{p.email}</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-dim);">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                            <polyline points="22,6 12,13 2,6"/>
                                        </svg>
                                    </div>
                                </div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
                                    <div>
                                        <label for="phone" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Телефон</label>
                                        <input id="phone" name="phone" type="tel" disabled={!editing} value={p.phone ?? ''} placeholder="+380-XX-XXX-XX-XX" class="field-input" />
                                    </div>
                                    <div>
                                        <label for="discord" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Discord</label>
                                        <input id="discord" name="discord" type="text" disabled={!editing} value={p.discord ?? ''} placeholder="username" class="field-input" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Безпека -->
                    <div class="panel" style="display:flex;align-items:center;gap:40px;margin-bottom:20px;">
                        <div class="panel-title" style="margin-bottom:0;flex-shrink:0;"><span class="panel-accent"></span>Безпека</div>
                        <div style="flex:1;max-width:320px;">
                            <label for="password-display" style="display:block;font-size:13px;color:var(--text-muted);margin-bottom:6px;">Пароль</label>
                            <input id="password-display" type="password" value="••••••••" disabled
                                   style="width:100%;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text-dim);font-size:14px;font-family:'Manrope',sans-serif;outline:none;box-sizing:border-box;cursor:not-allowed;" />
                        </div>
                    </div>

                    <!-- Bottom bar -->
                    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:40px;">
                        <div style="flex:1;background:rgba(61,142,240,.07);border:1px solid rgba(61,142,240,.18);border-radius:12px;padding:14px 18px;font-size:13px;color:var(--text-muted);line-height:1.6;min-width:200px;">
                            Хочеш взяти участь у турнірі? Перейди до
                            <a href="/tourments" style="color:#3d8ef0;text-decoration:none;">Акаунту команди</a>
                            — там можна переглянути турніри з відкритою реєстрацією, створити команду або доєднатись.
                        </div>
                        <div style="display:flex;gap:12px;flex-shrink:0;">
                            {#if editing}
                                <button type="button" onclick={() => editing = false} class="btn-secondary">Скасувати</button>
                                <button type="submit" disabled={saving} class="btn-primary">{saving ? 'Збереження...' : 'Зберегти'}</button>
                            {:else}
                                <button type="button" onclick={() => editing = true} class="btn-primary">Редагувати</button>
                            {/if}
                        </div>
                    </div>
                </form>

                <!-- CERTIFICATES -->
                <div>
                    <div class="section-heading">
                        <span class="panel-accent" style="height:28px;"></span>
                        Мої сертифікати
                    </div>
                    <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">Наведи на сертифікат, щоб завантажити</p>

                    <!-- Course certs -->
                    <div class="cert-section">
                        <div class="cert-cat-label">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d4a020" stroke-width="2">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                            </svg>
                            Сертифікати за курси
                        </div>
                        <div class="cert-grid">
                            {#each courseCerts as cert}
                                <div
                                        class="cert-card"
                                        role="button"
                                        tabindex="0"
                                        aria-label="Завантажити сертифікат: {cert.title}"
                                        onclick={() => downloadCert(cert)}
                                        onkeydown={(e) => handleCertKey(e, cert)}>
                                    <img src={cert.imageUrl} alt={cert.title} class="cert-img" loading="lazy" />
                                    <div class="cert-body">
                                        <div class="cert-title">{cert.title}</div>
                                        <div class="cert-sub">{cert.subtitle}</div>
                                        <div class="cert-date">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            {cert.date}
                                        </div>
                                    </div>
                                    <div class="cert-overlay" aria-hidden="true">
                                        <button type="button" class="cert-dl-btn"
                                                onclick={(e) => { e.stopPropagation(); downloadCert(cert); }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            Завантажити
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>

                    <!-- Tournament certs -->
                    <div class="cert-section">
                        <div class="cert-cat-label">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3d8ef0" stroke-width="2">
                                <circle cx="12" cy="8" r="6"/>
                                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                            </svg>
                            Сертифікати за турніри
                        </div>
                        <div class="cert-grid">
                            {#each tournamentCerts as cert}
                                <div
                                        class="cert-card"
                                        role="button"
                                        tabindex="0"
                                        aria-label="Завантажити сертифікат: {cert.title}"
                                        onclick={() => downloadCert(cert)}
                                        onkeydown={(e) => handleCertKey(e, cert)}>
                                    <img src={cert.imageUrl} alt={cert.title} class="cert-img" loading="lazy" />
                                    <div class="cert-body">
                                        <div class="cert-title">{cert.title}</div>
                                        <div class="cert-sub">{cert.subtitle}</div>
                                        <div class="cert-date">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2"/>
                                                <line x1="16" y1="2" x2="16" y2="6"/>
                                                <line x1="8" y1="2" x2="8" y2="6"/>
                                                <line x1="3" y1="10" x2="21" y2="10"/>
                                            </svg>
                                            {cert.date}
                                        </div>
                                    </div>
                                    <div class="cert-overlay" aria-hidden="true">
                                        <button type="button" class="cert-dl-btn"
                                                onclick={(e) => { e.stopPropagation(); downloadCert(cert); }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                            Завантажити
                                        </button>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>

            {/if}
        </main>
    </div>

    <Footer />
</div>