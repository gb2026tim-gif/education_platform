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

	function getInitials(name: string) {
		return name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '??';
	}
</script>

<svelte:head><title>Мій акаунт — LvUp</title></svelte:head>

<div style="min-height:100vh; background:#0a0e14; color:#e8edf5; font-family:'Manrope',sans-serif;">
	<Header />

	<div style="display:flex; min-height:calc(100vh - 72px);">
		<Sidebar user={p} />

		<main style="flex:1; padding:36px 48px; max-width:1100px;">
			<!-- Breadcrumb -->
			<div style="font-size:12px; color:#3a4a5e; margin-bottom:6px;">
				Кабінет / <span style="color:#6b7a8f;">Мій акаунт</span>
			</div>
			<h1 style="font-size:22px; font-weight:800; color:#fff; margin-bottom:28px;">Мій акаунт</h1>

			{#if p}
			<!-- Profile hero -->
			<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:28px 32px; margin-bottom:24px; display:flex; align-items:center; gap:28px;">
				<div style="position:relative; flex-shrink:0;">
					<div style="width:88px; height:88px; border-radius:50%; background:#1a2d4a; border:3px solid #1e3a5f; display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:800; color:#3d8ef0; cursor:pointer;">
						{getInitials(p.name)}
					</div>
					<div style="position:absolute; bottom:2px; right:2px; width:26px; height:26px; border-radius:50%; background:#3d8ef0; border:2px solid #0a0e14; display:flex; align-items:center; justify-content:center; cursor:pointer;">
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
					</div>
				</div>
				<div style="flex:1;">
					<div style="font-size:22px; font-weight:800; color:#fff; margin-bottom:4px;">{p.name}</div>
					<div style="font-size:13px; color:#6b7a8f; margin-bottom:12px;">{p.email}</div>
					<div style="display:flex; gap:8px; flex-wrap:wrap;">
						{#each p.captainOf as team}
							<span style="padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; background:#1a2d4a; color:#3d8ef0;">
								Турнір: {team.tournament.title}
							</span>
							<span style="padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; background:#0f2218; color:#3ecf7c;">
								Командир
							</span>
							<span style="padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; background:#141c28; color:#4a6080;">
								Команда: {team.name}
							</span>
						{/each}
					</div>
				</div>
				{#if p.captainOf.length > 0}
				<div style="margin-left:auto; text-align:right; padding-left:28px; border-left:1px solid #1a2535; flex-shrink:0;">
					<div style="font-size:10px; font-weight:700; letter-spacing:1px; color:#3a4a5e; text-transform:uppercase; margin-bottom:4px;">Активність:</div>
					{#each p.captainOf as team}
						<div style="font-size:13px; color:#6b7a8f; font-weight:600;">{team.tournament.title}</div>
					{/each}
				</div>
				{/if}
			</div>

			<!-- Form -->
			{#if form?.error}
				<div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:12px; padding:12px 16px; margin-bottom:16px; color:#f87171; font-size:14px;">
					{form.error}
				</div>
			{/if}
			{#if saved || form?.success}
				<div style="background:rgba(62,207,124,0.1); border:1px solid rgba(62,207,124,0.3); border-radius:12px; padding:12px 16px; margin-bottom:16px; color:#3ecf7c; font-size:14px;">
					Збережено успішно!
				</div>
			{/if}

			<form method="POST" action="?/updateProfile" use:enhance={() => {
				saving = true;
				return async ({ update }) => {
					await update();
					saving = false;
					saved = true;
					setTimeout(() => saved = false, 3000);
				};
			}}>
				<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px;">
					<!-- Особисті дані -->
					<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px;">
						<div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#3a4a5e; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:20px;">
							<span style="width:3px; height:14px; background:#3d8ef0; border-radius:2px; display:block;"></span>
							Особисті дані
						</div>
						<div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Ім'я <span style="color:#3d8ef0;">*</span></label>
								<input name="firstName" type="text" value={p.firstName ?? p.name.split(' ')[0] ?? ''} required
									style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
									onfocus={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
									onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
							</div>
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Прізвище <span style="color:#3d8ef0;">*</span></label>
								<input name="lastName" type="text" value={p.lastName ?? p.name.split(' ')[1] ?? ''} required
									style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
									onfocus={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
									onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
							</div>
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Місто</label>
								<input name="city" type="text" value={p.city ?? ''}
									style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
									onfocus={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
									onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
							</div>
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Місце навчання</label>
								<input name="school" type="text" value={p.school ?? ''}
									style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
									onfocus={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
									onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
							</div>
						</div>
					</div>

					<!-- Контакти -->
					<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px;">
						<div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#3a4a5e; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:20px;">
							<span style="width:3px; height:14px; background:#3d8ef0; border-radius:2px; display:block;"></span>
							Контакти
						</div>
						<div style="display:flex; flex-direction:column; gap:16px;">
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">E-mail <span style="color:#3d8ef0;">*</span></label>
								<div style="display:flex; align-items:center; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; gap:8px;">
									<span style="color:#e8edf5; font-size:13px;">{p.email}</span>
									<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7a8f" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
								</div>
							</div>
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Телефон</label>
								<input name="phone" type="tel" value={p.phone ?? ''} placeholder="+380-XX-XXX-XX-XX"
									style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
									onfocus={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
									onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
							</div>
							<div>
								<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Discord</label>
								<input name="discord" type="text" value={p.discord ?? ''} placeholder="username"
									style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#e8edf5; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box;"
									onfocus={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
									onblur={(e)=>e.currentTarget.style.borderColor='#1a2535'} />
							</div>
						</div>
					</div>
				</div>

				<!-- Безпека -->
				<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px; margin-bottom:24px;">
					<div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#3a4a5e; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:20px;">
						<span style="width:3px; height:14px; background:#3d8ef0; border-radius:2px; display:block;"></span>
						Безпека
					</div>
					<div style="max-width:340px;">
						<label style="display:block; font-size:12px; color:#6b7a8f; margin-bottom:6px;">Пароль</label>
						<input type="password" value="••••••••" disabled
							style="width:100%; background:#080d13; border:1px solid #1a2535; border-radius:8px; padding:10px 14px; color:#6b7a8f; font-size:13px; font-family:'Manrope',sans-serif; outline:none; box-sizing:border-box; cursor:not-allowed;" />
					</div>
				</div>

				<!-- Info banner + Buttons -->
				<div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
					<div style="flex:1; background:rgba(61,142,240,0.08); border:1px solid rgba(61,142,240,0.2); border-radius:12px; padding:12px 16px; font-size:13px; color:#6b7a8f; min-width:200px;">
						Хочеш взяти участь у турнірі? Перейди до
						<a href="/tourments" style="color:#3d8ef0; text-decoration:none;">Акаунту команди</a>
						— там можна переглянути турніри з відкритою реєстрацією, створити команду або до вже існуючої.
					</div>
					<div style="display:flex; gap:12px;">
						<a href="/" style="padding:10px 24px; border-radius:10px; border:1px solid #1a2535; color:#6b7a8f; font-size:14px; font-weight:600; text-decoration:none; font-family:'Manrope',sans-serif;">
							Скасувати
						</a>
						<button type="submit" disabled={saving}
							style="padding:10px 24px; border-radius:10px; background:#3d8ef0; border:none; color:#fff; font-size:14px; font-weight:700; cursor:pointer; font-family:'Manrope',sans-serif; opacity:{saving ? 0.7 : 1};">
							{saving ? 'Збереження...' : 'Зберегти'}
						</button>
					</div>
				</div>
			</form>
			{/if}
		</main>
	</div>

	<Footer />
</div>
