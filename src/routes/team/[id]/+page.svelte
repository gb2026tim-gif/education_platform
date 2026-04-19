<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const t = $derived(data.team);

	const teamStatusLabel: Record<string, string> = {
		PENDING: 'Очікує підтвердження',
		APPROVED: 'Підтверджено',
		REJECTED: 'Відхилено'
	};

	const teamStatusClass: Record<string, string> = {
		PENDING: 'bg-yellow-100 text-yellow-700',
		APPROVED: 'bg-green-100 text-green-700',
		REJECTED: 'bg-red-100 text-red-700'
	};

	const tournamentStatusLabel: Record<string, string> = {
		DRAFT: 'Чернетка',
		REGISTRATION: 'Реєстрація',
		RUNNING: 'Активний',
		FINISHED: 'Завершено'
	};

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((w) => w[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}

	function getAssignments(submission: any): any[] {
		return submission?.assignments ?? [];
	}

	function getAverageScore() {
		const allScores = t.submissions.flatMap((s) =>
			(s as any).assignments?.map((a: any) => a.score) ?? []
		);
		const valid = allScores.filter(Boolean);
		if (!valid.length) return null;
		return (valid.reduce((sum: number, s: any) => sum + (s?.total ?? 0), 0) / valid.length).toFixed(1);
	}

	const avgScore = $derived(getAverageScore());
	const latestSubmission = $derived(t.submissions?.[0] ?? null);
</script>

<div class="mx-auto max-w-3xl px-4 py-8">
	<a href="/my-teams" class="mb-6 block text-sm text-blue-600 hover:underline">
		← Назад до команд
	</a>

	<!-- Header -->
	<div class="mb-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex items-start justify-between">
			<div>
				<h1 class="text-2xl font-bold text-gray-900">{t.name}</h1>
				<p class="mt-1 text-sm text-gray-500">
					{t.tournament.title}
					{#if t.city}
						· {t.city}
					{/if}
				</p>
			</div>
			<span class="rounded-full px-3 py-1 text-xs font-medium {teamStatusClass[t.status]}">
				{teamStatusLabel[t.status]}
			</span>
		</div>

		<!-- Stats row -->
		<div class="mt-5 grid grid-cols-3 gap-3">
			<div class="rounded-lg bg-gray-50 p-3 text-center">
				<p class="text-xs text-gray-400">Роль</p>
				<p class="mt-1 text-sm font-semibold text-gray-800">Капітан</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-3 text-center">
				<p class="text-xs text-gray-400">Учасників</p>
				<p class="mt-1 text-sm font-semibold text-gray-800">{t.members.length}</p>
			</div>
			<div class="rounded-lg bg-gray-50 p-3 text-center">
				<p class="text-xs text-gray-400">Турнір</p>
				<p class="mt-1 text-sm font-semibold text-gray-800">
					{tournamentStatusLabel[t.tournament.status]}
				</p>
			</div>
		</div>
	</div>

	<!-- Members -->
	<div class="mb-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
		<h2 class="mb-4 text-base font-semibold text-gray-900">Склад команди</h2>
		<div class="space-y-3">
			{#each t.members as member, i}
				<div class="flex items-center gap-3">
					<div
						class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700"
					>
						{getInitials(member.name)}
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-medium text-gray-900">{member.name}</p>
						<p class="text-xs text-gray-400">{member.email}</p>
					</div>
					{#if i === 0}
						<span class="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
							Капітан
						</span>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- Submission -->
	{#if t.tournament.status === 'RUNNING' || t.tournament.status === 'FINISHED'}
		<div class="mb-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-base font-semibold text-gray-900">Подача роботи</h2>

			{#if latestSubmission}
				<div class="space-y-2 text-sm">
					<div class="flex items-center gap-2">
						<span class="w-16 text-gray-400">GitHub</span>
						<a
							href={latestSubmission.githubUrl}
							target="_blank"
							class="truncate text-blue-600 hover:underline"
						>
							{latestSubmission.githubUrl}
						</a>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-16 text-gray-400">Відео</span>
						<a
							href={latestSubmission.videoUrl}
							target="_blank"
							class="truncate text-blue-600 hover:underline"
						>
							{latestSubmission.videoUrl}
						</a>
					</div>
					{#if latestSubmission.demoUrl}
						<div class="flex items-center gap-2">
							<span class="w-16 text-gray-400">Demo</span>
							<a
								href={latestSubmission.demoUrl}
								target="_blank"
								class="truncate text-blue-600 hover:underline"
							>
								{latestSubmission.demoUrl}
							</a>
						</div>
					{/if}
					{#if latestSubmission.description}
						<div class="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
							{latestSubmission.description}
						</div>
					{/if}
				</div>
			{:else if t.tournament.status === 'RUNNING'}
				<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
					Робота ще не подана.
					<a href="/tourments/{t.tournament.id}" class="ml-1 underline">Подати роботу →</a>
				</div>
			{:else}
				<p class="text-sm text-gray-400">Роботу не було подано.</p>
			{/if}
		</div>
	{/if}

	<!-- Scores -->
	{#if avgScore}
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<h2 class="mb-4 text-base font-semibold text-gray-900">Оцінки журі</h2>
			{#each t.submissions as submission}
				{#each getAssignments(submission) as assignment}
					{#if assignment.score}
						<div class="mb-4 rounded-lg border border-gray-100 p-4">
							<div class="mb-3 grid grid-cols-3 gap-2">
								{#each [
									['Backend', assignment.score.backendQuality],
									['Frontend', assignment.score.frontendQuality],
									['Функціональність', assignment.score.functionality],
									['БД', assignment.score.databaseQuality],
									['Стабільність', assignment.score.stability],
									['Зручність', assignment.score.usability]
								] as [label, val]}
									<div class="rounded-lg bg-gray-50 p-2 text-center">
										<p class="text-xs text-gray-400">{label}</p>
										<p class="mt-1 text-sm font-semibold text-gray-800">{val}</p>
									</div>
								{/each}
							</div>
							<div
								class="flex items-center justify-between rounded-lg bg-green-50 px-4 py-2"
							>
								<span class="text-sm text-green-700">Загальний бал</span>
								<span class="text-lg font-bold text-green-700">
									{assignment.score.total.toFixed(1)}
								</span>
							</div>
							{#if assignment.score.comment}
								<p class="mt-3 text-xs text-gray-500">{assignment.score.comment}</p>
							{/if}
						</div>
					{/if}
				{/each}
			{/each}
		</div>
	{/if}
</div>
