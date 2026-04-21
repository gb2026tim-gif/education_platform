<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/Header.svelte';
	let { data }: { data: PageData } = $props();
</script>

<Header />

<div class="page">
	<nav class="breadcrumb">Кабінет</nav>
	<h1>Вітаємо, {data.user.name}!</h1>
	<p class="sub">Твій особистий кабінет</p>

	<div class="grid">
		<a href="/my-teams" class="card">
			<div class="icon">👥</div>
			<div class="card-title">Мої команди</div>
			<div class="card-desc">Переглянути склад команд</div>
		</a>
		<a href="/tourments" class="card">
			<div class="icon">🏆</div>
			<div class="card-title">Турніри</div>
			<div class="card-desc">Активні та завершені</div>
		</a>
		<a href="/courses" class="card">
			<div class="icon">📚</div>
			<div class="card-title">Мої курси</div>
			<div class="card-desc">Навчальні матеріали</div>
		</a>
		<a href="/profile" class="card">
			<div class="icon">👤</div>
			<div class="card-title">Мій акаунт</div>
			<div class="card-desc">Особисті дані</div>
		</a>
	</div>
</div>

<style>
	.page { max-width:900px; margin:0 auto; padding:2rem; }
	.breadcrumb { font-size:0.8rem; color:#8899aa; margin-bottom:0.75rem; }
	h1 { font-size:1.75rem; font-weight:700; color:#fff; margin-bottom:0.25rem; }
	.sub { color:#8899aa; font-size:0.9rem; margin-bottom:2rem; }
	.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; }
	.card { background:#111827; border:1px solid #1e2d45; border-radius:12px; padding:1.25rem; text-decoration:none; color:#fff; transition:border-color 0.2s; }
	.card:hover { border-color:#3E83FF; }
	.icon { font-size:1.5rem; margin-bottom:0.75rem; }
	.card-title { font-weight:600; font-size:0.95rem; margin-bottom:0.2rem; }
	.card-desc { color:#8899aa; font-size:0.8rem; }
</style>
