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
				<!-- Кругле фото -->
				<div class="circle-photo">
					<img src="https://images.unsplash.com/photo-1603354350317-6f7aaa5911c5?w=400&q=80" alt="coding" />
					<div class="circle-ring"></div>
				</div>

				<!-- Іконки навколо -->
				<div class="icon-badge badge-1 float-1">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
				</div>
				<div class="icon-badge badge-2 float-2">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3E83FF" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
				</div>
				<div class="icon-badge badge-3 float-3">
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
				</div>

				<!-- SVG ілюстрація під колом -->
				<svg class="illustration" viewBox="0 0 320 140" fill="none">
					<rect x="10" y="90" width="300" height="6" rx="3" fill="#1e3a6e"/>
					<rect x="30" y="96" width="6" height="30" rx="3" fill="#1e3a6e"/>
					<rect x="284" y="96" width="6" height="30" rx="3" fill="#1e3a6e"/>
					<rect x="20" y="52" width="80" height="40" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="26" y="58" width="68" height="26" rx="3" fill="#1a3a6a"/>
					<rect x="30" y="63" width="30" height="2" rx="1" fill="#3E83FF" opacity="0.8"/>
					<rect x="30" y="68" width="45" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="30" y="73" width="25" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<rect x="120" y="46" width="80" height="46" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="126" y="52" width="68" height="32" rx="3" fill="#1a3a6a"/>
					<rect x="130" y="57" width="35" height="2" rx="1" fill="#3E83FF" opacity="0.8"/>
					<rect x="130" y="62" width="50" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="130" y="67" width="28" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<rect x="130" y="72" width="40" height="2" rx="1" fill="#60a5fa" opacity="0.4"/>
					<rect x="220" y="52" width="80" height="40" rx="6" fill="#0f2050" stroke="#3E83FF" stroke-width="1.5"/>
					<rect x="226" y="58" width="68" height="26" rx="3" fill="#1a3a6a"/>
					<rect x="230" y="63" width="32" height="2" rx="1" fill="#3E83FF" opacity="0.7"/>
					<rect x="230" y="68" width="48" height="2" rx="1" fill="#60a5fa" opacity="0.5"/>
					<rect x="230" y="73" width="22" height="2" rx="1" fill="#3E83FF" opacity="0.6"/>
					<circle cx="60" cy="36" r="12" fill="#2a4a8a"/>
					<path d="M42 55 Q60 44 78 55" fill="#2a4a8a"/>
					<circle cx="160" cy="30" r="12" fill="#3a5a9a"/>
					<path d="M142 49 Q160 38 178 49" fill="#3a5a9a"/>
					<circle cx="260" cy="36" r="12" fill="#2a4a8a"/>
					<path d="M242 55 Q260 44 278 55" fill="#2a4a8a"/>
					<g transform="translate(133,0)">
						<path d="M14 0 L26 0 L26 22 Q26 32 20 35 Q14 32 14 22 Z" fill="#1e3a6e" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M14 5 L8 5 Q2 5 2 13 Q2 21 12 23" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<path d="M26 5 L32 5 Q38 5 38 13 Q38 21 28 23" fill="none" stroke="#3E83FF" stroke-width="1.5"/>
						<rect x="16" y="35" width="8" height="5" rx="2" fill="#1e3a6e" stroke="#3E83FF" stroke-width="1"/>
						<rect x="12" y="40" width="16" height="3" rx="1.5" fill="#3E83FF"/>
					</g>
					<g opacity="0.35" transform="translate(4,4)">
						<circle cx="12" cy="12" r="8" fill="none" stroke="#3E83FF" stroke-width="1.5" stroke-dasharray="4 2"/>
						<circle cx="12" cy="12" r="4" fill="none" stroke="#3E83FF" stroke-width="1"/>
					</g>
					<g opacity="0.25" transform="translate(290,10)">
						<circle cx="10" cy="10" r="7" fill="none" stroke="#60a5fa" stroke-width="1.5" stroke-dasharray="3 2"/>
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

.circle-photo{width:130px;height:130px;border-radius:50%;overflow:hidden;border:3px solid rgba(62,131,255,0.4);position:relative;z-index:2;margin-bottom:-20px;box-shadow:0 0 0 8px rgba(62,131,255,0.08);}
.circle-photo img{width:100%;height:100%;object-fit:cover;}
.circle-ring{position:absolute;inset:-8px;border-radius:50%;border:1px solid rgba(62,131,255,0.2);animation:spin 12s linear infinite;}

.icon-badge{position:absolute;background:rgba(13,27,64,0.9);border:1px solid rgba(62,131,255,0.3);border-radius:12px;padding:8px;z-index:3;box-shadow:0 4px 12px rgba(0,0,0,0.3);}
.badge-1{top:0;left:10%;}
.badge-2{top:0;right:10%;}
.badge-3{top:50%;right:0;transform:translateY(-50%);}

.illustration{width:100%;max-width:360px;position:relative;z-index:1;}

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

.float-1{animation:floaty 3s ease-in-out infinite;}
.float-2{animation:floaty 3s ease-in-out infinite 1s;}
.float-3{animation:floaty 3s ease-in-out infinite 2s;}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

@media(max-width:768px){.left{display:none;}.right{flex:1;}}
</style>
