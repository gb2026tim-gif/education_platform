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
				<video
					src="/videos/register-robot.webm"
					autoplay
					loop
					muted
					playsinline
					class="robot-video"
				></video>
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

@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}

.robot-video{width:min(320px,90%);border-radius:20px;position:relative;z-index:2;}
@media(max-width:768px){.left{display:none;}.right{flex:1;}.row{grid-template-columns:1fr;}}
</style>
