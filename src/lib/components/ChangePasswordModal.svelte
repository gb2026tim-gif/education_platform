<script lang="ts">
  // src/lib/components/ChangePasswordModal.svelte
  // Попап примусової зміни пароля

  let { onSuccess }: { onSuccess: () => void } = $props();

  let newPassword    = $state('');
  let confirmPassword = $state('');
  let loading        = $state(false);
  let error          = $state('');
  let showNew        = $state(false);
  let showConfirm    = $state(false);

  async function handleSubmit() {
    error = '';
    if (newPassword.length < 8) {
      error = 'Пароль має містити мінімум 8 символів';
      return;
    }
    if (newPassword !== confirmPassword) {
      error = 'Паролі не збігаються';
      return;
    }

    loading = true;
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Помилка');
      onSuccess();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Помилка сервера';
    } finally {
      loading = false;
    }
  }
</script>

<!-- Overlay -->
<div style="position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:99999;
            display:flex;align-items:center;justify-content:center;padding:1rem;">
  <div style="background:#0d1b3e;border:1px solid rgba(62,131,255,0.3);border-radius:16px;
              padding:2rem;width:100%;max-width:420px;">

    <div style="margin-bottom:1.5rem;">
      <h2 style="margin:0 0 6px;font-size:1.4rem;font-weight:700;color:#fff;">
        Встановіть новий пароль
      </h2>
      <p style="margin:0;font-size:0.875rem;color:rgba(255,255,255,0.5);">
        Ви увійшли з одноразовим паролем. Будь ласка, встановіть власний пароль для продовження.
      </p>
    </div>

    {#if error}
      <div style="background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);
                  color:#f87171;padding:0.75rem 1rem;border-radius:8px;font-size:0.875rem;margin-bottom:1rem;">
        {error}
      </div>
    {/if}

    <div style="margin-bottom:1rem;">
      <label for="new-password" style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
        Новий пароль
      </label>
      <div style="position:relative;">
        <input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                bind:value={newPassword}
                placeholder="Мінімум 8 символів"
                style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                 padding:0.8rem 2.5rem 0.8rem 1rem;color:#fff;font-size:1rem;
                 outline:none;box-sizing:border-box;"
        />
        <button type="button" onclick={() => showNew = !showNew}
                style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);
                       background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;padding:0;">
          {#if showNew}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {/if}
        </button>
      </div>
    </div>

    <div style="margin-bottom:1.5rem;">
      <label for="confirm-password" style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
        Повторіть пароль
      </label>
      <div style="position:relative;">
        <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                bind:value={confirmPassword}
                placeholder="Повторіть пароль"
                style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                 padding:0.8rem 2.5rem 0.8rem 1rem;color:#fff;font-size:1rem;
                 outline:none;box-sizing:border-box;"
        />
        <button type="button" onclick={() => showConfirm = !showConfirm}
                style="position:absolute;right:0.75rem;top:50%;transform:translateY(-50%);
                       background:none;border:none;color:rgba(255,255,255,0.35);cursor:pointer;padding:0;">
          {#if showConfirm}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          {:else}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {/if}
        </button>
      </div>
    </div>

    <button
            onclick={handleSubmit}
            disabled={loading}
            style="width:100%;background:#3E83FF;color:#fff;border:none;border-radius:10px;
             padding:0.9rem;font-size:1rem;font-weight:600;cursor:pointer;
             opacity:{loading ? '0.6' : '1'};">
      {loading ? 'Зберігаємо...' : 'Зберегти пароль'}
    </button>
  </div>
</div>