<script lang="ts">
  import { signIn } from '$lib/auth-client';
  import { goto } from '$app/navigation';
  let email = $state('');
  let password = $state('');
  let error = $state('');

  async function handle() {
    const res = await signIn.email({ email, password });
    if (res.error) { error = 'Невірний email або пароль'; return; }
    await goto('/profile');
  }
</script>

<div style="min-height:100vh;background:#0a0e14;display:flex;align-items:center;justify-content:center;font-family:'Manrope',sans-serif;">
  <div style="background:#0f1520;border:1px solid #1a2535;border-radius:16px;padding:40px;width:360px;">
    <h1 style="color:#fff;font-size:22px;font-weight:800;margin-bottom:24px;">Увійти</h1>
    {#if error}<p style="color:#f87171;font-size:13px;margin-bottom:12px;">{error}</p>{/if}
    <input type="email" bind:value={email} placeholder="Email" style="width:100%;background:#080d13;border:1px solid #1a2535;border-radius:8px;padding:10px 14px;color:#e8edf5;font-size:14px;margin-bottom:12px;box-sizing:border-box;font-family:'Manrope',sans-serif;" />
    <input type="password" bind:value={password} placeholder="Пароль" style="width:100%;background:#080d13;border:1px solid #1a2535;border-radius:8px;padding:10px 14px;color:#e8edf5;font-size:14px;margin-bottom:20px;box-sizing:border-box;font-family:'Manrope',sans-serif;" />
    <button onclick={handle} style="width:100%;background:#3d8ef0;border:none;border-radius:10px;padding:12px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:'Manrope',sans-serif;">Увійти</button>
    <p style="color:#6b7a8f;font-size:13px;text-align:center;margin-top:16px;">Немає акаунту? <a href="/auth/register" style="color:#3d8ef0;">Зареєструватись</a></p>
  </div>
</div>
