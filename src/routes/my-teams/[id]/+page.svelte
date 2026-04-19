<!-- src/routes/my-teams/[id]/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { data }: { data: PageData } = $props();
	const t = $derived(data.team);

	const statusLabel: Record<string, string> = {
		PENDING: 'Очікує підтвердження',
		APPROVED: 'Підтверджено',
		REJECTED: 'Відхилено'
	};
	const statusColor: Record<string, string> = {
		PENDING: '#f59e0b',
		APPROVED: '#3ecf7c',
		REJECTED: '#ef4444'
	};
	const statusBg: Record<string, string> = {
		PENDING: 'rgba(245,158,11,0.1)',
		APPROVED: 'rgba(62,207,124,0.1)',
		REJECTED: 'rgba(239,68,68,0.1)'
	};

	function formatDate(d: string | Date) {
		return new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' });
	}
</script>

<svelte:head><title>{t.name} — LvUp</title></svelte:head>

<div style="min-height:100vh; background:#0a0e14; color:#e8edf5; font-family:'Manrope',sans-serif;">
	<Header />

	<div style="display:flex; min-height:calc(100vh - 72px); align-items:stretch;">
		<Sidebar user={data.user} />

		<main style="flex:1; padding:36px 48px; max-width:1100px;">
			<!-- Breadcrumb -->
			<div style="font-size:12px; color:#3a4a5e; margin-bottom:6px;">
				Кабінет /
				<a href="/my-teams" style="color:#6b7a8f; text-decoration:none;">Мої команди</a>
				/ <span style="color:#6b7a8f;">{t.name}</span>
			</div>
			<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:28px;">
				<h1 style="font-size:22px; font-weight:800; color:#fff;">Акаунт команди</h1>
				<form method="POST" action="?/leaveTeam" use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							window.location.href = '/my-teams';
						}
					};
				}}>
					<button type="submit" style="padding:9px 20px; border-radius:10px; border:1px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.08); color:#ef4444; font-size:13px; font-weight:600; cursor:pointer; font-family:'Manrope',sans-serif; display:flex; align-items:center; gap:8px;"
						onclick={(e) => { if (!confirm('Ти впевнена що хочеш покинути команду?')) e.preventDefault(); }}>
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
						{data.isCaptain ? 'Розпустити команду' : 'Покинути команду'}
					</button>
				</form>
			</div>

			<!-- Team hero -->
			<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:28px 32px; margin-bottom:24px;">
				<div style="display:flex; align-items:center; gap:24px; margin-bottom:20px;">
					<div style="width:64px; height:64px; border-radius:14px; background:#1a2d4a; border:2px solid #1e3a5f; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; color:#3d8ef0; flex-shrink:0;">
						{t.name[0].toUpperCase()}
					</div>
					<div style="flex:1;">
						<div style="font-size:20px; font-weight:800; color:#fff; margin-bottom:6px;">{t.name}</div>
						<div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
							<span style="padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; background:#1a2d4a; color:#3d8ef0;">
								{t.tournament.title}
							</span>
							<span style="padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; background:{statusBg[t.status]}; color:{statusColor[t.status]};">
								{statusLabel[t.status]}
							</span>
							{#if t.city}
								<span style="font-size:13px; color:#6b7a8f;">📍 {t.city}</span>
							{/if}
						</div>
					</div>
					<!-- Stats -->
					<div style="display:flex; gap:32px;">
						<div style="text-align:center;">
							<div style="font-size:24px; font-weight:800; color:#fff;">{t.members.length + 1}</div>
							<div style="font-size:11px; color:#3a4a5e; text-transform:uppercase; letter-spacing:0.05em;">Учасників</div>
						</div>
						<div style="text-align:center;">
							<div style="font-size:24px; font-weight:800; color:#fff;">{t.submissions.length}</div>
							<div style="font-size:11px; color:#3a4a5e; text-transform:uppercase; letter-spacing:0.05em;">Здач</div>
						</div>
					</div>
				</div>

				<!-- Tournament info -->
				<div style="border-top:1px solid #1a2535; padding-top:16px; display:flex; gap:32px;">
					<div>
						<div style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:#3a4a5e; text-transform:uppercase; margin-bottom:4px;">Турнір</div>
						<div style="font-size:13px; color:#e8edf5;">{t.tournament.title}</div>
					</div>
					<div>
						<div style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:#3a4a5e; text-transform:uppercase; margin-bottom:4px;">Створено</div>
						<div style="font-size:13px; color:#e8edf5;">{formatDate(t.createdAt)}</div>
					</div>
					{#if t.contact}
					<div>
						<div style="font-size:11px; font-weight:700; letter-spacing:0.08em; color:#3a4a5e; text-transform:uppercase; margin-bottom:4px;">Контакт</div>
						<div style="font-size:13px; color:#e8edf5;">{t.contact}</div>
					</div>
					{/if}
				</div>
			</div>

			<div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
				<!-- Members -->
				<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px;">
					<div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#3a4a5e; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:20px;">
						<span style="width:3px; height:14px; background:#3d8ef0; border-radius:2px; display:block;"></span>
						Склад команди
					</div>

					<!-- Captain -->
					<div style="display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:10px; background:#080d13; border:1px solid #1a2535; margin-bottom:8px;">
						<div style="width:34px; height:34px; border-radius:50%; background:#1a2d4a; border:1.5px solid #2a4a80; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#3d8ef0; flex-shrink:0;">
							{t.captain.name[0].toUpperCase()}
						</div>
						<div style="flex:1;">
							<div style="font-size:13px; font-weight:600; color:#e8edf5;">{t.captain.name}</div>
							<div style="font-size:11px; color:#3a4a5e;">{t.captain.email}</div>
						</div>
						<span style="padding:3px 10px; border-radius:12px; font-size:11px; font-weight:700; background:#0f2218; color:#3ecf7c;">Капітан</span>
					</div>

					{#each t.members as member}
						<div style="display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:10px; background:#080d13; border:1px solid #1a2535; margin-bottom:8px;">
							<div style="width:34px; height:34px; border-radius:50%; background:#141c28; border:1.5px solid #1a2535; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#6b7a8f; flex-shrink:0;">
								{member.name[0].toUpperCase()}
							</div>
							<div style="flex:1;">
								<div style="font-size:13px; font-weight:600; color:#e8edf5;">{member.name}</div>
								<div style="font-size:11px; color:#3a4a5e;">{member.email}</div>
							</div>
							<span style="padding:3px 10px; border-radius:12px; font-size:11px; font-weight:600; background:#141c28; color:#4a6080;">Учасник</span>
						</div>
					{/each}

					{#if t.members.length === 0}
						<div style="text-align:center; padding:20px; color:#3a4a5e; font-size:13px;">
							Немає інших учасників
						</div>
					{/if}
				</div>

				<!-- Submissions -->
				<div style="background:#0f1520; border:1px solid #1a2535; border-radius:16px; padding:24px 28px;">
					<div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#3a4a5e; text-transform:uppercase; display:flex; align-items:center; gap:8px; margin-bottom:20px;">
						<span style="width:3px; height:14px; background:#3d8ef0; border-radius:2px; display:block;"></span>
						Здані роботи
					</div>

					{#if t.submissions.length === 0}
						<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; text-align:center;">
							<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a2535" stroke-width="1.5" style="margin-bottom:12px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
							<div style="font-size:13px; color:#3a4a5e;">Здач ще немає</div>
						</div>
					{:else}
						{#each t.submissions as sub}
							<div style="border:1px solid #1a2535; border-radius:10px; padding:14px; margin-bottom:8px; background:#080d13;">
								<div style="font-size:13px; font-weight:600; color:#e8edf5; margin-bottom:4px;">{sub.task.title}</div>
								<div style="font-size:11px; color:#3a4a5e; margin-bottom:8px;">Дедлайн: {formatDate(sub.task.deadline)}</div>
								<div style="display:flex; gap:8px;">
									<a href={sub.githubUrl} target="_blank" style="font-size:11px; color:#3d8ef0; text-decoration:none; display:flex; align-items:center; gap:4px;">
										<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
										GitHub
									</a>
									{#if sub.videoUrl}
										<a href={sub.videoUrl} target="_blank" style="font-size:11px; color:#6b7a8f; text-decoration:none;">Відео</a>
									{/if}
								</div>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</main>
	</div>

	<Footer />
</div>
