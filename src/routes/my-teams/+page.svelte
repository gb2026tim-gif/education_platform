<!-- src/routes/my-teams/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { data }: { data: PageData } = $props();
	let dismissedInvites = $state<string[]>([]);

	function dismiss(id: string) {
		dismissedInvites = [...dismissedInvites, id];
	}

	const pendingInvites = $derived(
		(data.invites ?? []).filter((i: any) => !dismissedInvites.includes(i.id))
	);

	const statusLabel: Record<string, string> = {
		PENDING: 'Очікує',
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
	const tournamentStatusLabel: Record<string, string> = {
		DRAFT: 'Чернетка',
		REGISTRATION: 'Реєстрація',
		RUNNING: 'Активний',
		FINISHED: 'Завершено'
	};
</script>

<svelte:head><title>Мої команди — LvUp</title></svelte:head>

<div style="min-height:100vh; background:#0a0e14; color:#e8edf5; font-family:'Manrope',sans-serif;">
	<Header />

	<div style="display:flex;">
		<Sidebar user={data.user} />

		<main style="flex:1; padding:36px 48px; max-width:1100px; position:relative; background-image:url('/img/bg-teams.png'); background-size:cover; background-position:center;">
			<div style="font-size:12px; color:#6b7a8f; margin-bottom:6px; text-shadow:0 1px 3px rgba(0,0,0,0.8);">
				Кабінет / <span style="color:#a0b0c0;">Мої команди</span>
			</div>
			<h1 style="font-size:22px; font-weight:800; color:#fff; margin-bottom:28px;">Мої команди</h1>

			{#if data.teams.length === 0}
				<div style="position:relative; border-radius:16px; overflow:hidden; min-height:400px; display:flex; align-items:center; justify-content:center;">
					<img src="/img/bg-teams.png" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; border-radius:16px;" />
					<div style="position:absolute; inset:0; background:rgba(5,10,20,0.55); border-radius:16px;"></div>
					<div style="position:relative; z-index:1; background:rgba(8,12,22,0.82); border:1px solid rgba(255,255,255,0.07); border-radius:14px; padding:48px 60px; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center;">
						<div style="font-size:18px; font-weight:700; color:#3d8ef0; margin-bottom:12px;">
							Ти ще не належиш до команди
						</div>
						<div style="font-size:14px; color:#6b7a8f; max-width:320px; line-height:1.6;">
							Перейди на сторінку
							<a href="/tourments" style="color:#3d8ef0; text-decoration:none;">Турніри</a>,
							вибери один з активних та зареєструй свою команду
						</div>
					</div>
				</div>
			{:else}
				<div style="display:flex; flex-direction:column; gap:16px;">
					{#each data.teams as team}
						<a href="/my-teams/{team.id}" style="text-decoration:none; display:block;">
							<div style="background:rgba(8,13,22,0.88); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:24px 28px; cursor:pointer; backdrop-filter:blur(8px); transition:border-color 0.15s;"
								onmouseenter={(e)=>e.currentTarget.style.borderColor='#3d8ef0'}
								onmouseleave={(e)=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}
								role="button"
								tabindex="0">
								<div style="display:flex; align-items:center; justify-content:space-between; gap:16px;">
									<div style="display:flex; align-items:center; gap:20px; flex:1;">
										<div style="width:52px; height:52px; border-radius:12px; background:#1a2d4a; border:1px solid #1e3a5f; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; color:#3d8ef0; flex-shrink:0;">
											{team.name[0].toUpperCase()}
										</div>
										<div>
											<div style="font-size:16px; font-weight:700; color:#fff; margin-bottom:4px;">{team.name}</div>
											<div style="font-size:13px; color:#6b7a8f;">{team.tournament.title}</div>
										</div>
									</div>
									<div style="display:flex; align-items:center; gap:28px;">
										<div style="text-align:center;">
											<div style="font-size:18px; font-weight:800; color:#fff;">{team.members.length + 1}</div>
											<div style="font-size:11px; color:#8899aa; text-transform:uppercase; letter-spacing:0.05em;">Учасників</div>
										</div>
										<div style="text-align:center;">
											<div style="font-size:18px; font-weight:800; color:#fff;">{team.submissions.length}</div>
											<div style="font-size:11px; color:#8899aa; text-transform:uppercase; letter-spacing:0.05em;">Здач</div>
										</div>
										<span style="padding:5px 14px; border-radius:20px; font-size:12px; font-weight:700; background:{statusBg[team.status]}; color:{statusColor[team.status]};">
											{statusLabel[team.status]}
										</span>
										<span style="padding:5px 14px; border-radius:20px; font-size:12px; font-weight:600; background:#141c28; color:#4a6080;">
											{tournamentStatusLabel[team.tournament.status]}
										</span>
										<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3a4a5e" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</main>
	</div>

	<!-- Invite notifications -->
	{#each pendingInvites as invite}
		<div style="position:fixed; bottom:24px; right:24px; z-index:100; background:#0d1422; border:1px solid #1a2840; border-radius:12px; padding:16px 18px; width:300px; box-shadow:0 12px 40px rgba(0,0,0,0.7);">
			<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
				<span style="font-size:13px; font-weight:700; color:#c8d4e8;">Нагадування:</span>
				<button onclick={() => dismiss(invite.id)} style="background:none; border:none; color:#4a5a6a; cursor:pointer; padding:0; display:flex; align-items:center;" aria-label="Закрити">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
				</button>
			</div>
			<p style="font-size:13px; color:#7a8a9a; margin-bottom:14px; line-height:1.55;">
				Тебе було запрошено як учасника на турнір
				<span style="color:#3d8ef0; font-weight:500;">{invite.tournamentTitle}</span>
				в команду
				<span style="color:#3d8ef0; font-weight:500;">{invite.teamName}</span>
			</p>
			<div style="display:flex; gap:8px; justify-content:flex-end;">
				<form method="POST" action="?/declineInvite">
					<input type="hidden" name="inviteId" value={invite.id} />
					<button type="submit"
						style="padding:7px 16px; border-radius:7px; border:1px solid #2a3a50; background:transparent; color:#7a8a9a; font-size:12px; font-weight:600; cursor:pointer; font-family:'Manrope',sans-serif;">
						Відхилити
					</button>
				</form>
				<form method="POST" action="?/acceptInvite">
					<input type="hidden" name="inviteId" value={invite.id} />
					<input type="hidden" name="teamId" value={invite.teamId} />
					<button type="submit"
						style="padding:7px 16px; border-radius:7px; border:none; background:#3d8ef0; color:#fff; font-size:12px; font-weight:600; cursor:pointer; font-family:'Manrope',sans-serif;">
						Прийняти
					</button>
				</form>
			</div>
		</div>
	{/each}

	<Footer />
</div>
