<!-- src/routes/profile/+page.svelte -->
<script lang="ts">
    import type { PageData, ActionData } from './$types';
    import { enhance } from '$app/forms';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Sidebar from '$lib/components/Sidebar.svelte';

    let { data, form }: { data: PageData; form: ActionData } = $props();
    const p = $derived(data.profile);

    let saving = $state(false);
    let saved = $state(false);
    let uploadError = $state('');
    let editing = $state(false);

    let avatarPreview = $state('' as string);

    async function handleAvatarUpload(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;
        // Show preview immediately
        avatarPreview = URL.createObjectURL(file);
        // Upload to server
        const fd = new FormData();
        fd.append('avatar', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.error) { uploadError = data.error; avatarPreview = ''; return; }
    }

    function getInitials(name: string) {
        return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '??';
    }
</script>

<svelte:head><title>Мій акаунт — LvUp</title></svelte:head>

<div style="min-height:100vh; background:#0a0e14; color:#e8edf5; font-family:'Manrope',sans-serif;">
    <Header />

    <div style="display:flex;">
        <Sidebar user={p} />

        <main style="flex:1; padding:32px 44px; max-width:1100px;">

            <!-- Breadcrumb -->
            <div style="font-size:13px; color:#3a4a5e; margin-bottom:4px;">
                Кабінет / <span style="color:#6b7a8f;">Мій акаунт</span>
            </div>
            <h1 style="font-size:40px; font-weight:800; color:#fff; margin-bottom:24px; letter-spacing:-0.5px;">Мій акаунт</h1>

            {#if p}

                <!-- Profile hero -->
                <div style="background:linear-gradient(135deg, #0d1f3c 0%, #0a1628 60%, #071020 100%); border:1px solid #1a2f50; border-radius:16px; padding:28px 32px; margin-bottom:20px; display:flex; align-items:center; gap:24px;">
                    <!-- Avatar -->
                    <div style="position:relative; flex-shrink:0;">
                        {#if avatarPreview || p.image}
                            <img src={avatarPreview || p.image} alt="avatar" style="width:90px; height:90px; border-radius:50%; border:3px solid #2a4a7f; object-fit:cover;" />
                        {:else}
                            <div style="width:90px; height:90px; border-radius:50%; background:#1a2d4a; border:3px solid #2a4a7f; display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:800; color:#fff;">
                                {getInitials(p.name)}
                            </div>
                        {/if}
                        <label style="position:absolute; bottom:2px; right:2px; width:26px; height:26px; border-radius:50%; background:#3d8ef0; border:2px solid #0a1628; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                            <input type="file" accept="image/jpeg,image/png,image/webp" onchange={handleAvatarUpload} style="display:none;" />
                        </label>
                        {#if uploadError}<div style="position:absolute; top:100%; left:0; font-size:11px; color:#f87171; white-space:nowrap; margin-top:4px;">{uploadError}</div>{/if}
                    </div>

                    <!-- Name + info -->
                    <div style="flex:1;">
                        <div style="font-size:26px; font-weight:800; color:#fff; margin-bottom:4px;">{p.name}</div>
                        <div style="font-size:13px; color:#6b7a8f; margin-bottom:8px;">{p.email}</div>
                        {#if p.captainOf.length > 0}
                            <div style="font-size:13px; color:#6b7a8f;">Турнір: {p.captainOf[0].tournament.title}</div>
                        {/if}
                    </div>

                    <!-- Activity block -->
                    {#if p.captainOf.length > 0}
                        <div style="background:rgba(0,0,0,0.3); border:1px solid #1a2f50; border-radius:12px; padding:16px 20px; min-width:180px;">
                            <div style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:#6b7a8f; text-transform:uppercase; margin-bottom:10px;">Активність:</div>
                            {#each p.captainOf as team}
                                <div style="margin-bottom:8px;">
                                    <div style="font-size:12px; color:#6b7a8f; margin-bottom:6px;">Турнір: <span style="color:#3d8ef0;">{team.tournament.title}</span></div>
                                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                                        <span style="padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; background:#1a2d4a; color:#3d8ef0;">Командир</span>
                                        <span style="padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; background:#1a3040; color:#3d8ef0;">Команда: {team.name}</span>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>

                <!-- Alerts -->
                {#if form?.error}
                    <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:12px 16px; margin-bottom:16px; color:#f87171; font-size:14px;">{form.error}</div>
                {/if}
                {#if saved || form?.success}
                    <div style="background:rgba(62,207,124,0.1); border:1px solid rgba(62,207,124,0.3); border-radius:12px; padding:12px 16px; margin-bottom:16px; color:#3ecf7c; font-size:14px;">Збережено успішно!</div>
                {/if}

                <form method="POST" action="?/updateProfile" use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					await update();
					saving = false;
					saved = true;
					editing = false;
					setTimeout(() => saved = false, 3000);
				};
			}}>
                    <!-- Особисті дані + Контакти -->
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">

                        <!-- Особисті дані -->
                        <div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px;">
                            <div style="font-size:24px; font-weight:700; color:#fff; display:flex; align-items:center; gap:10px; margin-bottom:20px;">
                                <span style="width:4px; height:22px; background:#3d8ef0; border-radius:2px; display:block;"></span>
                                Особисті дані
                            </div>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                                <div>
                                    <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Ім'я <span style="color:#3d8ef0;">*</span></label>
                                    <input name="firstName" type="text" disabled={!editing} value={p.firstName ?? p.name.split(' ')[0] ?? ''} required
                                           placeholder="Іван"
                                           style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
                                           onfocus={(e)=>{ if(editing) e.currentTarget.style.borderColor='#3d8ef0'; }}
                                           onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
                                </div>
                                <div>
                                    <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Прізвище <span style="color:#3d8ef0;">*</span></label>
                                    <input name="lastName" type="text" disabled={!editing} value={p.lastName ?? p.name.split(' ')[1] ?? ''} required
                                           placeholder="Шевченко"
                                           style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
                                           onfocus={(e)=>{ if(editing) e.currentTarget.style.borderColor='#3d8ef0'; }}
                                           onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
                                </div>
                                <div>
                                    <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Місто</label>
                                    <input name="city" type="text" disabled={!editing} value={p.city ?? ''}
                                           placeholder="Львів"
                                           style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
                                           onfocus={(e)=>{ if(editing) e.currentTarget.style.borderColor='#3d8ef0'; }}
                                           onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
                                </div>
                                <div>
                                    <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Місце навчання</label>
                                    <input name="school" type="text" disabled={!editing} value={p.school ?? ''}
                                           placeholder="ФКТБП"
                                           style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
                                           onfocus={(e)=>{ if(editing) e.currentTarget.style.borderColor='#3d8ef0'; }}
                                           onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
                                </div>
                            </div>
                        </div>

                        <!-- Контакти -->
                        <div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px;">
                            <div style="font-size:24px; font-weight:700; color:#fff; display:flex; align-items:center; gap:10px; margin-bottom:20px;">
                                <span style="width:4px; height:22px; background:#3d8ef0; border-radius:2px; display:block;"></span>
                                Контакти
                            </div>
                            <div style="display:flex; flex-direction:column; gap:14px;">
                                <div>
                                    <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">E-mail <span style="color:#3d8ef0;">*</span></label>
                                    <div style="display:flex; align-items:center; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; gap:8px;">
                                        <span style="color:#e8edf5; font-size:14px; flex:1;">{p.email}</span>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7a8f" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                    </div>
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                                    <div>
                                        <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Телефон</label>
                                        <input name="phone" type="tel" disabled={!editing} value={p.phone ?? ''}
                                               placeholder="+380-XX-XXX-XX-XX"
                                               style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
                                               onfocus={(e)=>{ if(editing) e.currentTarget.style.borderColor='#3d8ef0'; }}
                                               onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
                                    </div>
                                    <div>
                                        <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Discord</label>
                                        <input name="discord" type="text" disabled={!editing} value={p.discord ?? ''}
                                               placeholder="username"
                                               style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
                                               onfocus={(e)=>{ if(editing) e.currentTarget.style.borderColor='#3d8ef0'; }}
                                               onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Безпека -->
                    <div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px; margin-bottom:20px; display:flex; align-items:center; gap:40px;">
                        <div style="font-size:24px; font-weight:700; color:#fff; display:flex; align-items:center; gap:10px; flex-shrink:0;">
                            <span style="width:4px; height:22px; background:#3d8ef0; border-radius:2px; display:block;"></span>
                            Безпека
                        </div>
                        <div style="flex:1; max-width:320px;">
                            <label style="display:block; font-size:13px; color:#6b7a8f; margin-bottom:6px;">Пароль</label>
                            <input type="password" value="••••••••" disabled
                                   style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#6b7a8f; font-size:14px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box; cursor:not-allowed;" />
                        </div>
                    </div>

                    <!-- Bottom bar -->
                    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                        <div style="flex:1; background:rgba(61,142,240,0.07); border:1px solid rgba(61,142,240,0.18); border-radius:12px; padding:14px 18px; font-size:13px; color:#6b7a8f; line-height:1.6; min-width:200px;">
                            Хочеш взяти участь у турнірі? Перейди до
                            <a href="/tourments" style="color:#3d8ef0; text-decoration:none;">Акаунту команди</a>
                            — там можна переглянути турніри з відкритою реєстрацією, створити команду або доєднатись до вже існуючої.
                        </div>
                        <div style="display:flex; gap:12px; flex-shrink:0;">
                            {#if editing}
                                <button type="button" onclick={() => editing = false}
                                        style="padding:11px 28px; border-radius:10px; border:1px solid #1a2535; background:none; color:#6b7a8f; font-size:14px; font-weight:600; cursor:pointer; font-family:'Manrope',sans-serif;">
                                    Скасувати
                                </button>
                                <button type="submit" disabled={saving}
                                        style="padding:11px 28px; border-radius:10px; background:#3d8ef0; border:none; color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:'Manrope',sans-serif;">
                                    {saving ? 'Збереження...' : 'Зберегти'}
                                </button>
                            {:else}
                                <button type="button" onclick={() => editing = true}
                                        style="padding:11px 28px; border-radius:10px; background:#3d8ef0; border:none; color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:'Manrope',sans-serif;">
                                    Редагувати
                                </button>
                            {/if}
                        </div>
                    </div>
                </form>
            {/if}
        </main>
    </div>

    <Footer />
</div>