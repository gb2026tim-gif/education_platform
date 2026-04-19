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
		loading = true; errorMsg = '';
		const res = await signUp.email({ email, password, name: name.trim() });
		if (res.error) { errorMsg = res.error.message ?? 'Помилка реєстрації'; loading = false; return; }
		await goto('/dashboard');
	}
</script>

<div class="page">
	<!-- Ліва частина -->
	<div class="left">
		<a href="/" class="brand">
			<span class="lv">Lv</span><span class="up">Up</span>
		</a>

		<div class="left-content">
			<h1>Create new<br />account</h1>
			<p>Sign up to start learning and developing future-ready tech skills.</p>

			<div class="illustration">
				<div class="circle-bg"></div>

				<div class="floating-icon icon-1">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
				</div>
				<div class="floating-icon icon-2">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
				</div>
				<div class="floating-icon icon-3">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
				</div>

				<svg class="main-illustration" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
					<!-- Фон планети/глобус -->
					<circle cx="140" cy="100" r="75" fill="none" stroke="rgba(62,131,255,0.15)" stroke-width="1"/>
					<circle cx="140" cy="100" r="55" fill="rgba(13,27,64,0.5)" stroke="rgba(62,131,255,0.2)" stroke-width="1"/>
					<ellipse cx="140" cy="100" rx="55" ry="20" fill="none" stroke="rgba(62,131,255,0.15)" stroke-width="1"/>

					<!-- Кубок -->
					<g transform="translate(108, 45)">
						<path d="M22 0 L42 0 L42 28 Q42 44 32 48 Q22 44 22 28 Z" fill="#1a3a6a" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M22 6 L14 6 Q6 6 6 16 Q6 26 20 29" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M42 6 L50 6 Q58 6 58 16 Q58 26 44 29" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<rect x="26" y="48" width="12" height="7" rx="2" fill="#1a3a6a" stroke="#3E83FF" stroke-width="1"/>
						<rect x="19" y="55" width="26" height="4" rx="2" fill="#3E83FF"/>
						<!-- Зірка на кубку -->
						<path d="M32 15 L33.5 20 L38 20 L34.5 23 L36 28 L32 25 L28 28 L29.5 23 L26 20 L30.5 20 Z" fill="#3E83FF" opacity="0.8"/>
					</g>

					<!-- Шестерні -->
					<g transform="translate(30, 30)" opacity="0.5">
						<circle cx="18" cy="18" r="12" fill="none" stroke="#3E83FF" stroke-width="2"/>
						<circle cx="18" cy="18" r="5" fill="rgba(62,131,255,0.3)"/>
						<line x1="18" y1="4" x2="18" y2="8" stroke="#3E83FF" stroke-width="2" stroke-linecap="round"/>
						<line x1="18" y1="28" x2="18" y2="32" stroke="#3E83FF" stroke-width="2" stroke-linecap="round"/>
						<line x1="4" y1="18" x2="8" y2="18" stroke="#3E83FF" stroke-width="2" stroke-linecap="round"/>
						<line x1="28" y1="18" x2="32" y2="18" stroke="#3E83FF" stroke-width="2" stroke-linecap="round"/>
					</g>
					<g transform="translate(215, 50)" opacity="0.35">
						<circle cx="14" cy="14" r="9" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
						<circle cx="14" cy="14" r="4" fill="rgba(96,165,250,0.2)"/>
						<line x1="14" y1="3" x2="14" y2="7" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
						<line x1="14" y1="21" x2="14" y2="25" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
						<line x1="3" y1="14" x2="7" y2="14" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
						<line x1="21" y1="14" x2="25" y2="14" stroke="#60a5fa" stroke-width="1.5" stroke-linecap="round"/>
					</g>

					<!-- Люди внизу -->
					<g transform="translate(30, 130)">
						<circle cx="20" cy="0" r="9" fill="#2a4a8a"/>
						<path d="M4 22 Q20 12 36 22" fill="#2a4a8a"/>
						<rect x="10" y="22" width="20" height="14" rx="3" fill="#1e3a6e"/>
					</g>
					<g transform="translate(110, 125)">
						<circle cx="30" cy="0" r="10" fill="#3a5a9a"/>
						<path d="M12 24 Q30 13 48 24" fill="#3a5a9a"/>
						<rect x="18" y="24" width="24" height="16" rx="3" fill="#1e3a6e"/>
					</g>
					<g transform="translate(200, 130)">
						<circle cx="20" cy="0" r="9" fill="#2a4a8a"/>
						<path d="M4 22 Q20 12 36 22" fill="#2a4a8a"/>
						<rect x="10" y="22" width="20" height="14" rx="3" fill="#1e3a6e"/>
					</g>

					<!-- Джойстик внизу -->
					<g transform="translate(120, 175)" opacity="0.6">
						<circle cx="20" cy="12" r="12" fill="#1a3a6a" stroke="#3E83FF" stroke-width="1.5"/>
						<circle cx="20" cy="12" r="5" fill="#3E83FF" opacity="0.5"/>
						<circle cx="20" cy="5" r="2" fill="#3E83FF"/>
						<circle cx="20" cy="19" r="2" fill="#3E83FF"/>
						<circle cx="13" cy="12" r="2" fill="#3E83FF"/>
						<circle cx="27" cy="12" r="2" fill="#3E83FF"/>
					</g>

					<!-- Зірки/точки декор -->
					{#each [[20,80],[260,70],[15,150],[265,140],[240,175]] as [cx, cy]}
						<circle {cx} {cy} r="2" fill="#3E83FF" opacity="0.4"/>
					{/each}
				</svg>
			</div>

			<div class="stats">
				<div class="stat">
					<span class="stat-num">500+</span>
					<span class="stat-label">Учасників</span>
				</div>
				<div class="stat-divider"></div>
				<div class="stat">
					<span class="stat-num">12</span>
					<span class="stat-label">Турнірів</span>
				</div>
				<div class="stat-divider"></div>
				<div class="stat">
					<span class="stat-num">30+</span>
					<span class="stat-label">Курсів</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Права частина — форма -->
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
	:global(body) { margin:0; background:#0a0e1a; }

	.page { display:flex; min-height:100vh; background:#0a0e1a; color:#fff; font-family:'Manrope',sans-serif; }

	.left {
		flex:1;
		background: linear-gradient(160deg, #0d1b3e 0%, #0a0e1a 70%);
		display:flex; flex-direction:column;
		padding:2.5rem 3rem;
		position:relative; overflow:hidden;
	}

	.brand { font-size:1.75rem; font-weight:800; text-decoration:none; margin-bottom:2rem; display:inline-block; }
	.lv { color:#fff; }
	.up { color:#3E83FF; }

	.left-content { flex:1; display:flex; flex-direction:column; justify-content:center; }
	.left h1 { font-size:1.75rem; font-weight:800; line-height:1.25; margin-bottom:0.75rem; }
	.left p { color:rgba(255,255,255,0.5); font-size:0.9rem; line-height:1.6; margin-bottom:1.5rem; max-width:340px; }

	.illustration { position:relative; margin:0 auto 1.5rem; width:100%; max-width:300px; }

	.circle-bg {
		position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
		width:200px; height:200px; border-radius:50%;
		background: radial-gradient(circle, rgba(62,131,255,0.1) 0%, transparent 70%);
		border: 1px solid rgba(62,131,255,0.12);
	}

	.main-illustration { width:100%; height:auto; position:relative; z-index:1; }

	.floating-icon {
		position:absolute; z-index:2;
		background:rgba(13,27,64,0.85);
		border:1px solid rgba(62,131,255,0.25);
		border-radius:10px; padding:7px;
	}
	.icon-1 { top:5px; left:0; }
	.icon-2 { top:0; right:0; }
	.icon-3 { bottom:20px; right:0; }

	.stats { display:flex; align-items:center; gap:1rem; }
	.stat { text-align:center; }
	.stat-num { display:block; font-size:1.25rem; font-weight:800; color:#3E83FF; }
	.stat-label { display:block; font-size:0.72rem; color:rgba(255,255,255,0.4); }
	.stat-divider { width:1px; height:30px; background:rgba(255,255,255,0.1); }

	.right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem; }

	.card { width:100%; max-width:520px; }
	.card h2 { font-size:1.5rem; font-weight:700; margin-bottom:0.4rem; }
	.sub { color:rgba(255,255,255,0.5); font-size:0.85rem; margin-bottom:1.75rem; }

	.error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1.25rem; }

	.row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
	.field { display:flex; flex-direction:column; }
	.field label { font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:0.4rem; }
	.field input { background:#111827; border:1px solid #1e2d45; border-radius:8px; padding:0.7rem 0.9rem; color:#fff; font-size:0.9rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
	.field input:focus { border-color:#3E83FF; }
	.field input::placeholder { color:#2a3a4a; }

	.phone-wrap { display:flex; align-items:center; background:#111827; border:1px solid #1e2d45; border-radius:8px; overflow:hidden; }
	.flag { padding:0.7rem 0.75rem; color:rgba(255,255,255,0.5); font-size:0.82rem; border-right:1px solid #1e2d45; white-space:nowrap; }
	.phone-wrap input { background:transparent; border:none; border-radius:0; padding-left:0.75rem; flex:1; outline:none; color:#fff; font-size:0.9rem; }

	.actions { display:flex; gap:1rem; margin-top:1.5rem; }
	.btn-primary { flex:1; background:#3E83FF; color:#fff; border:none; border-radius:8px; padding:0.8rem; font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s; }
	.btn-primary:hover:not(:disabled) { background:#2d6fd4; }
	.btn-primary:disabled { opacity:0.55; cursor:not-allowed; }
	.btn-secondary { flex:1; background:transparent; color:rgba(255,255,255,0.6); border:1px solid #1e2d45; border-radius:8px; padding:0.8rem; font-size:0.95rem; font-weight:600; cursor:pointer; }
	.btn-secondary:hover { border-color:#3E83FF; color:#fff; }

	.switch { text-align:center; margin-top:1.25rem; color:rgba(255,255,255,0.5); font-size:0.85rem; }
	.switch a { color:#3E83FF; text-decoration:none; font-weight:600; }

	@media (max-width:768px) { .left { display:none; } .row { grid-template-columns:1fr; } }
</style>
