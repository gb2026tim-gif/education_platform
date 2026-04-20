<script lang="ts">
	import { signIn } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMsg = $state('');

	async function handleLogin() {
		if (!email || !password) { errorMsg = 'Заповніть всі поля'; return; }
		loading = true;
		errorMsg = '';
		const res = await signIn.email({ email, password });
		if (res.error) {
			errorMsg = 'Невірний email або пароль';
			loading = false;
			return;
		}
		await goto('/dashboard');
	}
</script>

<div class="page">
	<div class="left">
		<a href="/" class="brand"><span class="lv">Lv</span><span class="up">Up</span></a>
		<div class="left-content">
			<h1>Empower Child with<br />Future-Ready Tech<br />Skills</h1>
			<p>Join us in creating tech leaders of tomorrow while supporting underprivileged children globally.</p>
		</div>
	</div>

	<div class="right">
		<div class="card">
			<h2>Увійти</h2>
			<p class="sub">Вхід до платформи LvUp</p>

			{#if errorMsg}
				<div class="error">{errorMsg}</div>
			{/if}

			<div class="field">
				<label for="email">E-mail</label>
				<input id="email" type="email" bind:value={email} placeholder="example@gmail.com" autocomplete="email" />
			</div>

			<div class="field">
				<label for="password">Пароль</label>
				<input id="password" type="password" bind:value={password} placeholder="••••••••" autocomplete="current-password" />
			</div>

			<button class="btn-primary" onclick={handleLogin} disabled={loading}>
				{loading ? 'Завантаження...' : 'Увійти'}
			</button>

			<p class="switch">Немає акаунту? <a href="/auth/register">Зареєструватись</a></p>
		</div>
	</div>
</div>

<style>
	.page { display:flex; min-height:100vh; background:#0a0e1a; }
	.left { flex:1; background:linear-gradient(160deg,#0d1b3e 0%,#0a0e1a 60%); display:flex; flex-direction:column; padding:2.5rem 3rem; }
	.brand { font-size:1.75rem; font-weight:800; text-decoration:none; margin-bottom:auto; }
	.lv { color:#fff; }
	.up { color:#3E83FF; }
	.left-content { flex:1; display:flex; flex-direction:column; justify-content:center; }
	.left h1 { font-size:2.25rem; font-weight:800; line-height:1.25; margin-bottom:1.25rem; color:#fff; }
	.left p { color:#8899aa; font-size:0.95rem; line-height:1.7; max-width:380px; }
	.right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem; }
	.card { width:100%; max-width:420px; }
	.card h2 { font-size:1.75rem; font-weight:700; color:#fff; margin-bottom:0.4rem; }
	.sub { color:#8899aa; font-size:0.88rem; margin-bottom:2rem; }
	.error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1.25rem; }
	.field { margin-bottom:1.25rem; }
	.field label { display:block; font-size:0.82rem; color:#8899aa; margin-bottom:0.45rem; }
	.field input { width:100%; background:#111827; border:1px solid #1e2d45; border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.95rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
	.field input:focus { border-color:#3E83FF; }
	.field input::placeholder { color:#2a3a4a; }
	.btn-primary { width:100%; background:#3E83FF; color:#fff; border:none; border-radius:8px; padding:0.85rem; font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s; margin-top:0.25rem; }
	.btn-primary:hover:not(:disabled) { background:#2d6fd4; }
	.btn-primary:disabled { opacity:0.55; cursor:not-allowed; }
	.switch { text-align:center; margin-top:1.5rem; color:#8899aa; font-size:0.875rem; }
	.switch a { color:#3E83FF; text-decoration:none; font-weight:600; }
	.switch a:hover { text-decoration:underline; }
	@media (max-width:768px) { .left { display:none; } }
</style>
