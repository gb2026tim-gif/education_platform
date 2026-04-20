<script lang="ts">
	import { signIn } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let errorMsg = $state('');

	async function handleLogin() {
		if (!email || !password) { errorMsg = 'Заповніть всі поля'; return; }
		loading = true; errorMsg = '';
		const res = await signIn.email({ email, password });
		if (res.error) { errorMsg = 'Невірний email або пароль'; loading = false; return; }
		await goto('/dashboard');
	}
</script>

<div class="page">
	<div class="left">
		<a href="/" class="brand"><span class="lv">Lv</span><span class="up">Up</span></a>

		<div class="content">
			<h1>Увійди та<br/>розвивайся<br/>разом з нами</h1>
			<p>Приєднуйся до тисяч учасників які вже навчаються та змагаються на платформі.</p>

			<div class="visual">
				<video
					src="/videos/login-robot.webm"
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
			<h2>Увійти</h2>
			<p class="sub">Вхід до платформи LvUp</p>
			{#if errorMsg}<div class="error">{errorMsg}</div>{/if}
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
:global(body){margin:0;background:#0a0e1a;}
.page{display:flex;min-height:100vh;font-family:'Manrope',sans-serif;background:#0a0e1a;color:#fff;}

.left{flex:1;background:linear-gradient(160deg,#0d1b3e 0%,#080e1c 100%);display:flex;flex-direction:column;padding:2.5rem 3rem;position:relative;overflow:hidden;}
.left::before{content:'';position:absolute;top:-150px;right:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(62,131,255,0.06) 0%,transparent 70%);border-radius:50%;}

.brand{font-size:1.75rem;font-weight:800;text-decoration:none;position:relative;z-index:1;}
.lv{color:#fff;}.up{color:#3E83FF;}

.content{flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1;max-width:480px;}
.content h1{font-size:clamp(1.75rem,2.5vw,2.25rem);font-weight:800;line-height:1.2;margin-bottom:0.75rem;margin-top:2rem;}
.content p{color:rgba(255,255,255,0.5);font-size:0.88rem;line-height:1.6;margin-bottom:2rem;max-width:340px;}

.visual{position:relative;display:flex;flex-direction:column;align-items:center;margin-bottom:2rem;}












.stats-row{display:flex;align-items:center;gap:1.5rem;}
.stat-item{text-align:center;}
.n{display:block;font-size:1.15rem;font-weight:800;color:#3E83FF;}
.l{display:block;font-size:0.7rem;color:rgba(255,255,255,0.4);margin-top:2px;}
.divider{width:1px;height:30px;background:rgba(255,255,255,0.1);}

.right{flex:1;display:flex;align-items:center;justify-content:center;padding:2rem;background:#080e1c;border-left:1px solid rgba(255,255,255,0.04);}
.card{width:100%;max-width:380px;}
.card h2{font-size:1.75rem;font-weight:700;margin-bottom:0.4rem;}
.sub{color:rgba(255,255,255,0.45);font-size:0.875rem;margin-bottom:2rem;}
.error{background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#f87171;padding:0.7rem 1rem;border-radius:8px;font-size:0.875rem;margin-bottom:1.25rem;}
.field{margin-bottom:1.25rem;}
.field label{display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.45rem;}
.field input{width:100%;background:#111827;border:1px solid #1e2d45;border-radius:8px;padding:0.75rem 1rem;color:#fff;font-size:0.95rem;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
.field input:focus{border-color:#3E83FF;}
.field input::placeholder{color:#2a3a4a;}
.btn-primary{width:100%;background:#3E83FF;color:#fff;border:none;border-radius:8px;padding:0.85rem;font-size:0.95rem;font-weight:600;cursor:pointer;transition:background 0.2s;margin-top:0.25rem;}
.btn-primary:hover:not(:disabled){background:#2d6fd4;}
.btn-primary:disabled{opacity:0.55;cursor:not-allowed;}
.switch{text-align:center;margin-top:1.5rem;color:rgba(255,255,255,0.45);font-size:0.875rem;}
.switch a{color:#3E83FF;text-decoration:none;font-weight:600;}







.robot-video{width:min(320px,90%);border-radius:20px;position:relative;z-index:2;}
@media(max-width:768px){.left{display:none;}.right{flex:1;}}
</style>
