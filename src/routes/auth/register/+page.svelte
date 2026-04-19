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
	<div class="left">
		<a href="/" class="brand"><span class="lv">Lv</span><span class="up">Up</span></a>

		<div class="content">
			<h1>Create new<br/>account</h1>
			<p>Sign up to start learning and developing future-ready tech skills.</p>

			<div class="visual">
				<!-- Кругле фото -->
				<div class="circle-photo">
					<img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80" alt="hackathon" />
					<div class="circle-ring"></div>
				</div>

				<div class="icon-badge badge-1 float-1">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
				</div>
				<div class="icon-badge badge-2 float-2">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
				</div>
				<div class="icon-badge badge-3 float-3">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
				</div>

				<!-- Floating нотифікація -->
				<div class="notif float-2">
					<div class="dot"></div>
					<span>Нова команда зареєструвалась!</span>
				</div>

				<svg class="illustration" viewBox="0 0 320 120" fill="none">
					<rect x="10" y="80" width="300" height="6" rx="3" fill="#1e3a6e"/>
					<rect x="30" y="86" width="6" height="25" rx="3" fill="#1e3a6e"/>
					<rect x="284" y="86" width="6" height="25" rx="3" fill="#1e3a6e"/>
					<rect x="20" y="45" width="80" height="37" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="26" y="51" width="68" height="24" rx="3" fill="#1a3a6a"/>
					<rect x="30" y="56" width="30" height="2" rx="1" fill="#3E83FF" opacity="0.8"/>
					<rect x="30" y="61" width="45" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="30" y="66" width="25" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<rect x="120" y="40" width="80" height="42" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="126" y="46" width="68" height="28" rx="3" fill="#1a3a6a"/>
					<rect x="130" y="51" width="35" height="2" rx="1" fill="#3E83FF" opacity="0.8"/>
					<rect x="130" y="56" width="50" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="130" y="61" width="28" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<rect x="130" y="66" width="40" height="2" rx="1" fill="#60a5fa" opacity="0.4"/>
					<rect x="220" y="45" width="80" height="37" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="226" y="51" width="68" height="24" rx="3" fill="#1a3a6a"/>
					<rect x="230" y="56" width="32" height="2" rx="1" fill="#3E83FF" opacity="0.7"/>
					<rect x="230" y="61" width="48" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<circle cx="60" cy="30" r="11" fill="#2a4a8a"/>
					<path d="M43 48 Q60 38 77 48" fill="#2a4a8a"/>
					<circle cx="160" cy="25" r="11" fill="#3a5a9a"/>
					<path d="M143 43 Q160 33 177 43" fill="#3a5a9a"/>
					<circle cx="260" cy="30" r="11" fill="#2a4a8a"/>
					<path d="M243 48 Q260 38 277 48" fill="#2a4a8a"/>
					<g transform="translate(136,0)">
						<path d="M12 0 L22 0 L22 18 Q22 26 17 29 Q12 26 12 18 Z" fill="#1e3a6e" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M12 4 L7 4 Q2 4 2 11 Q2 17 10 19" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M22 4 L27 4 Q32 4 32 11 Q32 17 24 19" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<rect x="14" y="29" width="6" height="4" rx="1" fill="#1e3a6e" stroke="#3E83FF" stroke-width="1"/>
						<rect x="10" y="33" width="14" height="3" rx="1.5" fill="#3E83FF"/>
					</g>
				</svg>
			</div>

			<div class="stats-row">
				<div class="stat-item"><span class="n">500+</span><span class="l">Учасників</span></div>
				<div class="divider"></div>
				<div class="stat-item"><span class="n">12</span><span class="l">Турнірів</span></div>
				<div class="divider"></div>
				<div class="stat-item"><span class="n">30+</span><span class="l">Курсів</span></div>
			</div>
		</div>
	</div>

	<div class="right">
		<div class="card">
			<h2>Create new account</h2>
			<p class="sub">Sign up to start learning and developing future-ready tech skills.</p>
			{#if errorMsg}<div class="error">{errorMsg}</div>{/if}
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
:global(body){margin:0;background:#0a0e1a;}
.page{display:flex;min-height:100vh;font-family:'Manrope',sans-serif;background:#0a0e1a;color:#fff;}

.left{flex:1;background:linear-gradient(160deg,#0d1b3e 0%,#080e1c 100%);display:flex;flex-direction:column;padding:2.5rem 3rem;position:relative;overflow:hidden;}
.left::before{content:'';position:absolute;top:-150px;right:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(62,131,255,0.06) 0%,transparent 70%);border-radius:50%;}

.brand{font-size:1.75rem;font-weight:800;text-decoration:none;position:relative;z-index:1;}
.lv{color:#fff;}.up{color:#3E83FF;}

.content{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1;max-width:480px;}
.content h1{font-size:clamp(1.75rem,2.5vw,2.25rem);font-weight:800;line-height:1.2;margin-bottom:0.75rem;margin-top:2rem;}
.content p{color:rgba(255,255,255,0.5);font-size:0.88rem;line-height:1.6;margin-bottom:1.75rem;max-width:340px;}

.visual{position:relative;display:flex;flex-direction:column;align-items:center;margin-bottom:1.75rem;}

.circle-photo{width:120px;height:120px;border-radius:50%;overflow:hidden;border:3px solid rgba(62,131,255,0.4);position:relative;z-index:2;margin-bottom:-15px;box-shadow:0 0 0 8px rgba(62,131,255,0.07);}
.circle-photo img{width:100%;height:100%;object-fit:cover;}
.circle-ring{position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(62,131,255,0.2);animation:spin 12s linear infinite;}

.icon-badge{position:absolute;background:rgba(13,27,64,0.9);border:1px solid rgba(62,131,255,0.3);border-radius:12px;padding:8px;z-index:3;box-shadow:0 4px 12px rgba(0,0,0,0.3);}
.badge-1{top:0;left:5%;}
.badge-2{top:0;right:5%;}
.badge-3{top:45%;right:-5px;transform:translateY(-50%);}

.notif{position:absolute;top:-15px;left:50%;transform:translateX(-50%);background:rgba(13,27,64,0.95);border:1px solid rgba(62,131,255,0.25);border-radius:20px;padding:5px 12px;display:flex;align-items:center;gap:6px;font-size:0.68rem;white-space:nowrap;z-index:4;box-shadow:0 4px 16px rgba(0,0,0,0.3);}
.dot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:blink 1.5s infinite;}

.illustration{width:100%;max-width:340px;}

.stats-row{display:flex;align-items:center;gap:1.5rem;}
.stat-item{text-align:center;}
.n{display:block;font-size:1.15rem;font-weight:800;color:#3E83FF;}
.l{display:block;font-size:0.7rem;color:rgba(255,255,255,0.4);margin-top:2px;}
.divider{width:1px;height:30px;background:rgba(255,255,255,0.1);}

.right{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;background:#080e1c;border-left:1px solid rgba(255,255,255,0.04);overflow-y:auto;}
.card{width:100%;max-width:440px;padding:1rem 0;}
.card h2{font-size:1.5rem;font-weight:700;margin-bottom:0.4rem;}
.sub{color:rgba(255,255,255,0.45);font-size:0.85rem;margin-bottom:1.5rem;}
.error{background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#f87171;padding:0.7rem 1rem;border-radius:8px;font-size:0.875rem;margin-bottom:1rem;}
.row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem;}
.field{display:flex;flex-direction:column;}
.field label{font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:0.35rem;}
.field input{background:#111827;border:1px solid #1e2d45;border-radius:8px;padding:0.65rem 0.9rem;color:#fff;font-size:0.875rem;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
.field input:focus{border-color:#3E83FF;}
.field input::placeholder{color:#2a3a4a;}
.phone-wrap{display:flex;align-items:center;background:#111827;border:1px solid #1e2d45;border-radius:8px;overflow:hidden;}
.flag{padding:0.65rem 0.6rem;color:rgba(255,255,255,0.5);font-size:0.78rem;border-right:1px solid #1e2d45;white-space:nowrap;}
.phone-wrap input{background:transparent;border:none;border-radius:0;padding-left:0.6rem;flex:1;outline:none;color:#fff;font-size:0.875rem;}
.actions{display:flex;gap:0.75rem;margin-top:1.25rem;}
.btn-primary{flex:1;background:#3E83FF;color:#fff;border:none;border-radius:8px;padding:0.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;transition:background 0.2s;}
.btn-primary:hover:not(:disabled){background:#2d6fd4;}
.btn-primary:disabled{opacity:0.55;cursor:not-allowed;}
.btn-secondary{flex:1;background:transparent;color:rgba(255,255,255,0.55);border:1px solid #1e2d45;border-radius:8px;padding:0.75rem;font-size:0.9rem;font-weight:600;cursor:pointer;}
.btn-secondary:hover{border-color:#3E83FF;color:#fff;}
.switch{text-align:center;margin-top:1rem;color:rgba(255,255,255,0.45);font-size:0.85rem;}
.switch a{color:#3E83FF;text-decoration:none;font-weight:600;}

.float-1{animation:floaty 3s ease-in-out infinite;}
.float-2{animation:floaty 3s ease-in-out infinite 1s;}
.float-3{animation:floaty 3s ease-in-out infinite 2s;}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

@media(max-width:768px){.left{display:none;}.right{flex:1;}.row{grid-template-columns:1fr;}}
</style>
