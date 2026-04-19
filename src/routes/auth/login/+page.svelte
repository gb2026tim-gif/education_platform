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
		if (res.error) { errorMsg = 'Невірний email або пароль'; loading = false; return; }
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
			<h1>Увійди та розвивайся<br />разом з нами</h1>
			<p>Приєднуйся до тисяч учасників які вже навчаються та змагаються на платформі.</p>

			<!-- Ілюстрація -->
			<div class="illustration">
				<!-- Декоративне коло -->
				<div class="circle-bg"></div>

				<!-- Іконки навколо -->
				<div class="floating-icon icon-1">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
				</div>
				<div class="floating-icon icon-2">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
				</div>
				<div class="floating-icon icon-3">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
				</div>

				<!-- Центральна SVG ілюстрація -->
				<svg class="main-illustration" viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
					<!-- Стіл -->
					<rect x="20" y="160" width="240" height="8" rx="4" fill="#1e3a6e"/>
					<rect x="40" y="168" width="8" height="30" rx="4" fill="#1e3a6e"/>
					<rect x="232" y="168" width="8" height="30" rx="4" fill="#1e3a6e"/>

					<!-- Монітори -->
					<rect x="30" y="120" width="65" height="42" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="35" y="125" width="55" height="30" rx="3" fill="#1a3a6a"/>
					<rect x="55" y="162" width="16" height="4" rx="2" fill="#1e3a6e"/>
					<!-- Код на моніторі 1 -->
					<rect x="38" y="129" width="25" height="2" rx="1" fill="#3E83FF" opacity="0.7"/>
					<rect x="38" y="134" width="35" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="38" y="139" width="20" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<rect x="38" y="144" width="30" height="2" rx="1" fill="#60a5fa" opacity="0.4"/>

					<rect x="107" y="115" width="65" height="47" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="112" y="120" width="55" height="33" rx="3" fill="#1a3a6a"/>
					<rect x="132" y="162" width="16" height="4" rx="2" fill="#1e3a6e"/>
					<!-- Код на моніторі 2 -->
					<rect x="115" y="124" width="30" height="2" rx="1" fill="#3E83FF" opacity="0.8"/>
					<rect x="115" y="129" width="42" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="115" y="134" width="22" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<rect x="115" y="139" width="35" height="2" rx="1" fill="#60a5fa" opacity="0.4"/>
					<rect x="115" y="144" width="28" height="2" rx="1" fill="#3E83FF" opacity="0.5"/>

					<rect x="185" y="120" width="65" height="42" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="190" y="125" width="55" height="30" rx="3" fill="#1a3a6a"/>
					<rect x="210" y="162" width="16" height="4" rx="2" fill="#1e3a6e"/>
					<!-- Код на моніторі 3 -->
					<rect x="193" y="129" width="28" height="2" rx="1" fill="#3E83FF" opacity="0.7"/>
					<rect x="193" y="134" width="40" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="193" y="139" width="18" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>

					<!-- Люди (спрощені силуети) -->
					<!-- Людина 1 -->
					<circle cx="62" cy="102" r="10" fill="#2a4a8a"/>
					<path d="M42 130 Q62 115 82 130" fill="#2a4a8a"/>

					<!-- Людина 2 -->
					<circle cx="140" cy="96" r="10" fill="#3a5a9a"/>
					<path d="M120 125 Q140 110 160 125" fill="#3a5a9a"/>

					<!-- Людина 3 -->
					<circle cx="218" cy="102" r="10" fill="#2a4a8a"/>
					<path d="M198 130 Q218 115 238 130" fill="#2a4a8a"/>

					<!-- Кубок вгорі по центру -->
					<g transform="translate(100, 10)">
						<path d="M30 0 L50 0 L50 35 Q50 55 40 60 Q30 55 30 35 Z" fill="#1e3a6e" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M30 8 L20 8 Q10 8 10 20 Q10 32 25 35" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M50 8 L60 8 Q70 8 70 20 Q70 32 55 35" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<rect x="33" y="60" width="14" height="8" rx="2" fill="#1e3a6e" stroke="#3E83FF" stroke-width="1"/>
						<rect x="25" y="68" width="30" height="5" rx="2.5" fill="#3E83FF"/>
					</g>

					<!-- Шестерні -->
					<g transform="translate(12, 20)" opacity="0.4">
						<circle cx="16" cy="16" r="10" fill="none" stroke="#3E83FF" stroke-width="2" stroke-dasharray="4 2"/>
						<circle cx="16" cy="16" r="5" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
					</g>
					<g transform="translate(238, 30)" opacity="0.3">
						<circle cx="14" cy="14" r="8" fill="none" stroke="#60a5fa" stroke-width="2" stroke-dasharray="3 2"/>
						<circle cx="14" cy="14" r="4" fill="none" stroke="#60a5fa" stroke-width="1.5"/>
					</g>
				</svg>
			</div>

			<!-- Статистика -->
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
	:global(body) { margin:0; background:#0a0e1a; }

	.page { display:flex; min-height:100vh; background:#0a0e1a; color:#fff; font-family:'Manrope',sans-serif; }

	.left {
		flex:1;
		background: linear-gradient(160deg, #0d1b3e 0%, #0a0e1a 70%);
		display:flex; flex-direction:column;
		padding:2.5rem 3rem;
		position:relative; overflow:hidden;
	}

	.left::before {
		content:'';
		position:absolute; top:-100px; right:-100px;
		width:400px; height:400px;
		background: radial-gradient(circle, rgba(62,131,255,0.08) 0%, transparent 70%);
		border-radius:50%;
	}

	.brand { font-size:1.75rem; font-weight:800; text-decoration:none; margin-bottom:2rem; display:inline-block; }
	.lv { color:#fff; }
	.up { color:#3E83FF; }

	.left-content { flex:1; display:flex; flex-direction:column; justify-content:center; }

	.left h1 { font-size:1.75rem; font-weight:800; line-height:1.25; margin-bottom:0.75rem; }
	.left p { color:rgba(255,255,255,0.5); font-size:0.9rem; line-height:1.6; margin-bottom:1.5rem; max-width:340px; }

	.illustration { position:relative; margin:0 auto 1.5rem; width:100%; max-width:320px; }

	.circle-bg {
		position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
		width:220px; height:220px; border-radius:50%;
		background: radial-gradient(circle, rgba(62,131,255,0.12) 0%, rgba(62,131,255,0.03) 60%, transparent 100%);
		border: 1px solid rgba(62,131,255,0.15);
	}

	.main-illustration { width:100%; height:auto; position:relative; z-index:1; }

	.floating-icon {
		position:absolute; z-index:2;
		background:rgba(13,27,64,0.8);
		border:1px solid rgba(62,131,255,0.3);
		border-radius:12px; padding:8px;
		backdrop-filter:blur(4px);
	}
	.icon-1 { top:5px; left:0; }
	.icon-2 { top:10px; right:5px; }
	.icon-3 { bottom:30px; right:0; }

	.stats { display:flex; align-items:center; gap:1rem; }
	.stat { text-align:center; }
	.stat-num { display:block; font-size:1.25rem; font-weight:800; color:#3E83FF; }
	.stat-label { display:block; font-size:0.72rem; color:rgba(255,255,255,0.4); }
	.stat-divider { width:1px; height:30px; background:rgba(255,255,255,0.1); }

	.right { flex:1; display:flex; align-items:center; justify-content:center; padding:2rem; }

	.card { width:100%; max-width:420px; }
	.card h2 { font-size:1.75rem; font-weight:700; margin-bottom:0.4rem; }
	.sub { color:rgba(255,255,255,0.5); font-size:0.88rem; margin-bottom:2rem; }

	.error { background:rgba(239,68,68,0.12); border:1px solid rgba(239,68,68,0.25); color:#f87171; padding:0.7rem 1rem; border-radius:8px; font-size:0.875rem; margin-bottom:1.25rem; }

	.field { margin-bottom:1.25rem; }
	.field label { display:block; font-size:0.82rem; color:rgba(255,255,255,0.5); margin-bottom:0.45rem; }
	.field input { width:100%; background:#111827; border:1px solid #1e2d45; border-radius:8px; padding:0.75rem 1rem; color:#fff; font-size:0.95rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
	.field input:focus { border-color:#3E83FF; }
	.field input::placeholder { color:#2a3a4a; }

	.btn-primary { width:100%; background:#3E83FF; color:#fff; border:none; border-radius:8px; padding:0.85rem; font-size:0.95rem; font-weight:600; cursor:pointer; transition:background 0.2s; margin-top:0.25rem; }
	.btn-primary:hover:not(:disabled) { background:#2d6fd4; }
	.btn-primary:disabled { opacity:0.55; cursor:not-allowed; }

	.switch { text-align:center; margin-top:1.5rem; color:rgba(255,255,255,0.5); font-size:0.875rem; }
	.switch a { color:#3E83FF; text-decoration:none; font-weight:600; }

	@media (max-width:768px) { .left { display:none; } }
</style>
