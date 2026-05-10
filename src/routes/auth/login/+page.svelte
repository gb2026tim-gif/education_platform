<!-- src/routes/auth/login/+page.svelte -->
<script lang="ts">
	import { enhance } from "$app/forms";
	import type { ActionData } from "./$types";

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Увійти — LvUp</title>
</svelte:head>

<div class="page">
	<div class="left">
		<a href="/" class="brand">
			<span class="lv">Lv</span><span class="up">Up</span>
		</a>
		<div class="content">
			<h1>Увійди та розвивайся<br/>разом з нами</h1>
			<p>Приєднуйся до тисяч учасників які вже навчаються та змагаються на платформі.</p>
		</div>
		<div class="stats">
			<div class="stat"><span class="num">500+</span><span class="lab">Учасників</span></div>
			<div class="stat"><span class="num">12</span><span class="lab">Турнірів</span></div>
			<div class="stat"><span class="num">30+</span><span class="lab">Курсів</span></div>
		</div>
	</div>

	<div class="right">
		<div class="form-box">
			<h2>Увійти</h2>
			<p class="sub">Вхід до платформи LvUp</p>

			{#if form?.error}
				<div class="err">{form.error}</div>
			{/if}

			<form method="POST" action="?/login" use:enhance={() => {
        loading = true;
        return async ({ update }) => { await update(); loading = false; };
      }}>
				<div class="field">
					<label for="email">E-mail</label>
					<input id="email" name="email" type="email"
					       placeholder="your@email.com"
					       autocomplete="email" required />
				</div>
				<div class="field">
					<label for="password">Пароль</label>
					<input id="password" name="password" type="password"
					       placeholder="••••••••"
					       autocomplete="current-password" required />
				</div>
				<button class="btn-primary" type="submit" disabled={loading}>
					{loading ? "Завантаження..." : "Увійти"}
				</button>
			</form>

			<p class="switch">
				Немає акаунту? <a href="/auth/register">Зареєструватись</a>
			</p>
		</div>
	</div>
</div>

<style>
	:global(body) { margin: 0; background: #0a0e1a; }

	.page {
		display: flex;
		min-height: 100vh;
		font-family: 'Manrope', sans-serif;
		background: #0a0e1a;
		color: #fff;
	}

	/* ── Left panel ── */
	.left {
		flex: 1;
		background: linear-gradient(160deg, #0d1b3e 0%, #080e1c 100%);
		display: flex;
		flex-direction: column;
		padding: 2rem 4rem;
		position: relative;
		overflow: hidden;
	}
	.left::before {
		content: '';
		position: absolute;
		top: -130px; right: -150px;
		width: 600px; height: 900px;
		background: radial-gradient(circle, rgba(62,131,255,.07) 0%, transparent 70%);
		border-radius: 50%;
	}

	.brand {
		font-size: 2rem;
		font-weight: 800;
		text-decoration: none;
		position: relative;
		z-index: 1;
	}
	.lv { color: #fff; }
	.up { color: #3E83FF; }

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		z-index: 1;
		max-width: 640px;
	}
	.content h1 {
		font-size: clamp(2rem, 2.8vw, 2.75rem);
		font-weight: 800;
		line-height: 1.2;
		margin-bottom: 1rem;
		margin-top: 2.5rem;
	}
	.content p {
		color: rgba(255,255,255,.5);
		font-size: .95rem;
		line-height: 1.7;
		margin-bottom: 2.25rem;
		max-width: 520px;
	}

	.stats {
		display: flex;
		gap: 2.5rem;
		position: relative;
		z-index: 1;
		padding-bottom: 2rem;
	}
	.stat { display: flex; flex-direction: column; }
	.num  { font-size: 1.75rem; font-weight: 800; color: #3E83FF; }
	.lab  { font-size: .8rem; color: rgba(255,255,255,.4); margin-top: 2px; }

	/* ── Right panel ── */
	.right {
		width: 480px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: #080e1c;
	}

	.form-box { width: 100%; max-width: 360px; }
	.form-box h2 { font-size: 1.75rem; font-weight: 800; margin-bottom: .375rem; }
	.sub { color: rgba(255,255,255,.45); font-size: .9rem; margin-bottom: 2rem; }

	.field { margin-bottom: 1.125rem; }
	label {
		display: block;
		font-size: .8rem;
		font-weight: 600;
		color: rgba(255,255,255,.5);
		margin-bottom: .4rem;
	}
	input {
		width: 100%;
		padding: .7rem 1rem;
		border-radius: 10px;
		border: 1.5px solid rgba(255,255,255,.08);
		background: rgba(255,255,255,.04);
		color: #fff;
		font-size: .95rem;
		outline: none;
		box-sizing: border-box;
		transition: border-color .2s;
		font-family: inherit;
	}
	input:focus { border-color: #3E83FF; }

	.btn-primary {
		width: 100%;
		padding: .8rem;
		border-radius: 10px;
		background: #3E83FF;
		color: #fff;
		font-size: 1rem;
		font-weight: 700;
		border: none;
		cursor: pointer;
		margin-top: .5rem;
		transition: background .2s;
		font-family: inherit;
	}
	.btn-primary:hover:not(:disabled) { background: #2d6fe0; }
	.btn-primary:disabled { opacity: .6; cursor: not-allowed; }

	.err {
		background: rgba(248,113,113,.1);
		border: 1px solid rgba(248,113,113,.3);
		color: #f87171;
		padding: .65rem 1rem;
		border-radius: 8px;
		font-size: .85rem;
		margin-bottom: 1rem;
	}

	.switch {
		text-align: center;
		font-size: .85rem;
		color: rgba(255,255,255,.4);
		margin-top: 1.25rem;
	}
	.switch a { color: #3E83FF; text-decoration: none; }

	/* ── Light mode ── */
	:global(.light-mode) .page { background: #f0f4ff; color: #0a0e1a; }
	:global(.light-mode) .left { background: linear-gradient(160deg, #dde8ff 0%, #e8f0ff 100%); }
	:global(.light-mode) .content h1 { color: #0a0e1a; }
	:global(.light-mode) .content p  { color: rgba(10,14,26,.5); }
	:global(.light-mode) .lab        { color: rgba(10,14,26,.4); }
	:global(.light-mode) .right      { background: #f8faff; }
	:global(.light-mode) .form-box h2 { color: #0a0e1a; }
	:global(.light-mode) .sub        { color: rgba(10,14,26,.45); }
	:global(.light-mode) label       { color: rgba(10,14,26,.55); }
	:global(.light-mode) input {
		border-color: rgba(10,14,26,.12);
		background: #fff;
		color: #0a0e1a;
	}
	:global(.light-mode) input:focus  { border-color: #3E83FF; }
	:global(.light-mode) .switch      { color: rgba(10,14,26,.4); }

	@media (max-width: 768px) {
		.page  { flex-direction: column; }
		.left  { padding: 1.5rem 1.25rem; }
		.right { width: 100%; padding: 1.5rem 1.25rem; }
	}
</style>