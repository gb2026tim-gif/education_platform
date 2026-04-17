<script lang="ts">
	import type { PageData } from './$types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Topbar from '$lib/components/Topbar.svelte';

	let { data }: { data: PageData } = $props();

	const statusLabel: Record<string, string> = {
		PENDING: 'Очікує підтвердження',
		APPROVED: 'Підтверджено',
		REJECTED: 'Відхилено'
	};

	const statusClass: Record<string, string> = {
		PENDING: 'badge-pending',
		APPROVED: 'badge-approved',
		REJECTED: 'badge-rejected'
	};

	const tournamentStatusLabel: Record<string, string> = {
		DRAFT: 'Чернетка',
		REGISTRATION: 'Реєстрація',
		RUNNING: 'Активний',
		FINISHED: 'Завершено'
	};

	function getAverageScore(team: (typeof data.teams)[0]) {
		const allScores = team.submissions.flatMap((s: any) => s.assignments?.map((a: any) => a.score) ?? []);
		const valid = allScores.filter(Boolean);
		if (!valid.length) return null;
		return (valid.reduce((sum: number, s: any) => sum + (s?.total ?? 0), 0) / valid.length).toFixed(1);
	}
</script>

<div class="app-layout">
	<Sidebar user={data.user ?? null} />
	<div class="main-area">
		<Topbar />
		<div class="content">
			<nav class="breadcrumb">
				<span>Кабінет</span>
				<span class="sep">/</span>
				<span class="current">Мої команди</span>
			</nav>
			<h1>Мої команди</h1>

			{#if data.teams.length === 0}
				<div class="empty-state">
					<p class="empty-title">Ти ще не належиш до команди</p>
					<p class="empty-desc">
						Перейди на сторінку <a href="/tourments">Турніри</a>, вибери один з активних та зареєструй свою команду
					</p>
				</div>
			{:else}
				<div class="teams-list">
					{#each data.teams as team}
						<a href="/team/{team.id}" class="team-card">
							<div class="team-card-top">
								<div>
									<p class="team-name">{team.name}</p>
									<p class="team-tournament">{team.tournament.title}</p>
								</div>
								<span class="badge {statusClass[team.status]}">{statusLabel[team.status]}</span>
							</div>
							<div class="team-card-meta">
								{#if team.city}<span>{team.city}</span>{/if}
								<span>Учасників: {team.members.length}</span>
								<span>Турнір: {tournamentStatusLabel[team.tournament.status]}</span>
								{#if getAverageScore(team)}<span class="score">Оцінка: {getAverageScore(team)}</span>{/if}
								{#if team.submissions.length > 0}
									<span class="submitted">Роботу подано</span>
								{:else if team.tournament.status === 'RUNNING'}
									<span class="not-submitted">Не подано</span>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.app-layout { display:flex; min-height:100vh; background:#0a0e1a; color:#fff; font-family:'Urbanist',sans-serif; }
	.main-area { flex:1; display:flex; flex-direction:column; overflow:hidden; }
	.content { padding:2rem; flex:1; overflow-y:auto; }
	.breadcrumb { font-size:0.8rem; color:#8899aa; margin-bottom:0.75rem; display:flex; align-items:center; gap:0.4rem; }
	.sep { color:#3a4a5a; }
	.current { color:#fff; }
	h1 { font-size:1.75rem; font-weight:700; margin-bottom:1.5rem; }
	.empty-state { background:linear-gradient(135deg,#0d1b3e 0%,#111827 100%); border:1px solid #1e2d45; border-radius:16px; padding:4rem 2rem; text-align:center; max-width:500px; }
	.empty-title { font-size:1.1rem; font-weight:600; color:#4a90e2; margin-bottom:0.75rem; }
	.empty-desc { color:#8899aa; font-size:0.9rem; line-height:1.6; }
	.empty-desc a { color:#4a90e2; text-decoration:none; }
	.teams-list { display:flex; flex-direction:column; gap:0.75rem; max-width:700px; }
	.team-card { background:#111827; border:1px solid #1e2d45; border-radius:12px; padding:1.1rem 1.25rem; text-decoration:none; color:#fff; display:block; transition:border-color 0.2s; }
	.team-card:hover { border-color:#4a90e2; }
	.team-card-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; }
	.team-name { font-weight:600; font-size:0.95rem; margin-bottom:0.2rem; }
	.team-tournament { font-size:0.82rem; color:#8899aa; }
	.badge { font-size:0.72rem; font-weight:500; padding:0.25rem 0.65rem; border-radius:20px; white-space:nowrap; }
	.badge-approved { background:rgba(34,197,94,0.15); color:#4ade80; }
	.badge-pending { background:rgba(234,179,8,0.15); color:#facc15; }
	.badge-rejected { background:rgba(239,68,68,0.15); color:#f87171; }
	.team-card-meta { display:flex; flex-wrap:wrap; gap:0.75rem; font-size:0.8rem; color:#8899aa; border-top:1px solid #1e2d45; padding-top:0.75rem; }
	.score { color:#4a90e2; font-weight:500; }
	.submitted { color:#4ade80; }
	.not-submitted { color:#facc15; }
</style>
