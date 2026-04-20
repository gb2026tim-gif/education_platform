<script lang="ts">
	import { signUp } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let birthDate = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let errorMsg = $state('');

	function validate() {
		if (!name.trim() || name.trim().length < 2) return 'Введіть ПІБ (мінімум 2 символи)';
		if (!email.includes('@')) return 'Введіть коректний email';
		if (password.length < 8) return 'Пароль мінімум 8 символів';
		if (password !== confirmPassword) return 'Паролі не співпадають';
		return null;
	}

	async function handleRegister() {
		const err = validate();
		if (err) { errorMsg = err; return; }
		loading = true;
		errorMsg = '';
		const res = await signUp.email({ email, password, name: name.trim() });
		if (res.error) {
			errorMsg = res.error.message ?? 'Помилка реєстрації. Спробуй ще раз.';
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
			<h1>Create new<br />account</h1>
			<p>Sign up to start learning and developing future-ready tech skills.</p>
		</div>
	</div>

	<div class="right">
		<div class="card">
			<h2>Create new account</h2>
			<p class="sub">Sign up to start learning and developing future-ready tech skills.</p>

			{#if errorMsg}
				<div class="error">{errorMsg}</div>
			{/if}

			<div class="row">
				<div class="field">
					<label for="name">ПІБ</label>
					<input id="name" type="text" bind:value={name} placeholder="Іван Шевченко" autocomplete="name" />
				</div>
				<div class="field">
					<label for="email">Email</label>
					<input id="email" type="email" bind:value={email} placeholder="example@gmail.com" autocomplete="email" />
				</div>
			</div>

			<div class="row">
				<div class="field">
					<label for="birthDate">Дата народження</label>
					<input id="birthDate" type="text" bind:value={birthDate} placeholder="DD-MM-YYYY" />
				</div>
				<div class="field">
					<label for="phone">Номер телефону</label>
					<div class="phone-wrap">
						<span class="flag">🇺🇦 +380</span>
						<input id="phone" type="tel" bind:value={phone} placeholder="XX XXX XX XX" autocomplete="tel" />
					</div>
				</div>
			</div>

			<div class="row">
				<div class="field">
					<label for="password">Пароль</label>
					<input id="password" type="password" bind:value={password} placeholder="••••••••" autocomplete="new-password" />
				</div>
				<div class="field">
					<label for="confirm">Підтвердити</label>
					<input id="confirm" type="password" bind:value={confirmPassword} placeholder="••••••••" autocomplete="new-password" />
				</div>
			</div>

			<div class="actions">
				<button class="btn-secondary" onclick={() => goto('/auth/login')}>Скасувати</button>
				<button class="btn-primary" onclick={handleRegister} disabled={loading}>
					{loading ? 'Реєстрація...' : 'Зареєструватись'}
				</button>
			</div>

			<p class="switch">Вже маєш акаунт? <a href="/auth/login">Ввійти</a></p>
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
	.card { width:100%; max-width:520px; }
	.card h2 { font-size:1.5rem; font-weight:700; color:#fff; margin-bottom:0.4rem; }
	.sub { color:#8899aa; font-size:0.85rem; margin-bottom:1.75rem; }
	.error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1.25rem; }
	.row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
	.field { display:flex; flex-direction:column; }
	.field label { font-size:0.8rem; color:#8899aa; margin-bottom:0.4rem; }
	.field input { background:#111827; border:1px solid #1e2d45; border-radius:8px; padding:0.7rem 0.9rem; color:#fff; font-size:0.9rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
	.field input:focus { border-color:#3E83FF; }
	.field input::placeholder { color:#2a3a4a; }
	.phone-wrap { display:flex; align-items:center; background:#111827; border:1px solid #1e2d45; border-radius:8px; overflow:hidden; }
	.flag { padding:0.7rem 0.75rem; color:#8899aa; font-size:0.82rem; border-right:1px solid #1e2d45; white-space:nowrap; }
	.phone-wrap input { background:transparent; border:none; border-radius:0; padding-left:0.75rem; flex:1; }
	.phone-wrap input:focus { border:none; outline:none; }
	.actions { display:flex; gap:1rem; margin-top:1.5rem; }
	.btn-primary { flex:1; background:#3E83FF; color:#fff; border:none; border-radius:8px; padding:0.8rem; font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s; }
	.btn-primary:hover:not(:disabled) { background:#2d6fd4; }
	.btn-primary:disabled { opacity:0.55; cursor:not-allowed; }
	.btn-secondary { flex:1; background:transparent; color:#8899aa; border:1px solid #1e2d45; border-radius:8px; padding:0.8rem; font-size:0.95rem; font-weight:600; cursor:pointer; transition:border-color 0.2s; }
	.btn-secondary:hover { border-color:#3E83FF; color:#fff; }
	.switch { text-align:center; margin-top:1.25rem; color:#8899aa; font-size:0.85rem; }
	.switch a { color:#3E83FF; text-decoration:none; font-weight:600; }
	.switch a:hover { text-decoration:underline; }
	@media (max-width:768px) { .left { display:none; } .row { grid-template-columns:1fr; } }
</style>
