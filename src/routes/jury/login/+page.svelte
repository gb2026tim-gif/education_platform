<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
  let loading = $state(false);
</script>

<svelte:head><title>Вхід — Панель журі</title></svelte:head>

<style>
  :global(body){margin:0;background:#0d1117;}
  .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0d1117;padding:24px;}
  .card{background:#161b22;border:1px solid #21262d;border-radius:16px;padding:40px 44px;width:100%;max-width:420px;}
  .logo{font-size:26px;font-weight:800;margin-bottom:28px;text-decoration:none;display:block;}
  .lv{color:#e6edf3;}.up{color:#1f6feb;}
  h1{font-size:22px;font-weight:700;color:#e6edf3;margin-bottom:6px;}
  .sub{font-size:14px;color:#8b949e;margin-bottom:28px;}
  .field{margin-bottom:16px;}
  label{display:block;font-size:13px;color:#8b949e;margin-bottom:6px;}
  input{width:100%;padding:11px 14px;border-radius:8px;border:1px solid #21262d;background:#0d1117;color:#e6edf3;font-size:15px;outline:none;box-sizing:border-box;transition:border-color .14s;font-family:inherit;}
  input:focus{border-color:#1f6feb;}
  .btn{width:100%;padding:12px;border-radius:9px;border:none;background:#1f6feb;color:#fff;font-size:15px;font-weight:700;cursor:pointer;margin-top:8px;font-family:inherit;transition:background .14s;}
  .btn:hover:not(:disabled){background:#388bfd;}
  .btn:disabled{opacity:.5;cursor:not-allowed;}
  .err{background:rgba(248,81,73,.1);border:1px solid rgba(248,81,73,.3);color:#f85149;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:18px;}
</style>

<div class="wrap">
  <div class="card">
    <a href="/" class="logo"><span class="lv">Lv</span><span class="up">Up</span></a>
    <h1>Панель журі</h1>
    <p class="sub">Введіть ваш email та пароль для входу</p>

    {#if form?.error}
      <div class="err">{form.error}</div>
    {/if}

    <form method="POST" action="?/login" use:enhance={() => {
      loading = true;
      return async ({ update }) => { await update(); loading = false; };
    }}>
      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" name="email" type="email" placeholder="ivan@jury.lvlup.com" required autocomplete="email" />
      </div>
      <div class="field">
        <label for="password">Пароль</label>
        <input id="password" name="password" type="password" placeholder="••••••••" required autocomplete="current-password" />
      </div>
      <button type="submit" class="btn" disabled={loading}>
        {loading ? "Вхід..." : "Увійти"}
      </button>
    </form>
  </div>
</div>
