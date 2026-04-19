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
		await goto('/dashboard');
	}
</script>

<div class="page">
	<div class="left">
		<div class="left-content">
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
	.lv { color:#fff; }
	.up { color:#3E83FF; }
	.left-content { flex:1; display:flex; flex-direction:column; justify-content:center; }
	.right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem; }
	.card { width:100%; max-width:420px; }
	.error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1.25rem; }
	.field { margin-bottom:1.25rem; }
	.field input { width:100%; background:#111827; border:1px solid #1e2d45; border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.95rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
	.field input:focus { border-color:#3E83FF; }
	.field input::placeholder { color:#2a3a4a; }
	.btn-primary { width:100%; background:#3E83FF; color:#fff; border:none; border-radius:8px; padding:0.85rem; font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s; margin-top:0.25rem; }
	.btn-primary:hover:not(:disabled) { background:#2d6fd4; }
	.btn-primary:disabled { opacity:0.55; cursor:not-allowed; }
	.switch a { color:#3E83FF; text-decoration:none; font-weight:600; }
	@media (max-width:768px) { .left { display:none; } }
</style>
