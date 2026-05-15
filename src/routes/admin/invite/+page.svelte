<script lang="ts">
  import { enhance } from '$app/forms';

  interface UserRow {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    mustChangePassword: boolean;
  }

  let { data, form }: {
    data: { adminsAndJury: UserRow[] };
    form: { error?: string; success?: boolean } | null;
  } = $props();

  let loading = $state(false);

  const roleLabel: Record<string, string> = {
    ADMIN: 'Адміністратор',
    JURY:  'Журі',
    TEAM:  'Учасник',
  };
</script>

<svelte:head><title>Запросити учасника — LvUp Admin</title></svelte:head>

<div style="max-width:900px;margin:0 auto;padding:2rem;">

  <div style="margin-bottom:2rem;">
    <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin:0 0 4px;">Адмін / Команда</p>
    <h1 style="margin:0;font-size:1.75rem;font-weight:800;">Запросити адміна або журі</h1>
  </div>

  <!-- Форма -->
  <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;margin-bottom:2rem;">
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
      <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
      <h2 style="margin:0;font-size:1rem;font-weight:700;text-transform:uppercase;
                 letter-spacing:0.05em;color:rgba(255,255,255,0.6);">Нове запрошення</h2>
    </div>

    {#if form?.error}
      <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                  color:#f87171;padding:0.75rem 1rem;border-radius:8px;font-size:0.875rem;margin-bottom:1rem;">
        {form.error}
      </div>
    {/if}
    {#if form?.success}
      <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);
                  color:#4ade80;padding:0.75rem 1rem;border-radius:8px;font-size:0.875rem;margin-bottom:1rem;">
        ✓ Запрошення надіслано! Перевірте email.
      </div>
    {/if}

    <form method="POST" action="?/invite" use:enhance={() => {
      loading = true;
      return async ({ update }) => { await update(); loading = false; };
    }}>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:1rem;align-items:end;">
        <div>
          <label for="invite-name"
                 style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
            Ім'я та прізвище *
          </label>
          <input id="invite-name" name="name" required placeholder="Іван Шевченко"
                 style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                   padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
        </div>
        <div>
          <label for="invite-email"
                 style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
            Email *
          </label>
          <input id="invite-email" name="email" type="email" required placeholder="admin@example.com"
                 style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                   padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;" />
        </div>
        <div>
          <label for="invite-role"
                 style="display:block;font-size:0.82rem;color:rgba(255,255,255,0.5);margin-bottom:0.4rem;">
            Роль *
          </label>
          <select id="invite-role" name="role"
                  style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:10px;
                   padding:0.8rem 1rem;color:#fff;font-size:1rem;outline:none;box-sizing:border-box;">
            <option value="JURY">Журі</option>
            <option value="ADMIN">Адміністратор</option>
          </select>
        </div>
        <button type="submit" disabled={loading}
                style="background:#3E83FF;color:#fff;border:none;border-radius:10px;padding:0.8rem 1.5rem;
                 font-size:0.95rem;font-weight:600;cursor:pointer;white-space:nowrap;
                 opacity:{loading ? '0.6' : '1'};">
          {loading ? 'Надсилаємо...' : '+ Запросити'}
        </button>
      </div>
    </form>
  </div>

  <!-- Список адмінів та журі -->
  <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
    <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
      <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
      <h2 style="margin:0;font-size:1rem;font-weight:700;text-transform:uppercase;
                 letter-spacing:0.05em;color:rgba(255,255,255,0.6);">
        Адміни та журі ({data.adminsAndJury.length})
      </h2>
    </div>

    {#if data.adminsAndJury.length === 0}
      <p style="color:rgba(255,255,255,0.4);font-size:0.9rem;text-align:center;padding:2rem 0;">
        Поки нікого немає
      </p>
    {:else}
      <table style="width:100%;border-collapse:collapse;">
        <thead>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
          {#each ["Ім'я", "Email", "Роль", "Статус", "Додано"] as h}
            <th style="text-align:left;padding:0 0.75rem 0.75rem;font-size:0.78rem;
                         color:rgba(255,255,255,0.4);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
              {h}
            </th>
          {/each}
        </tr>
        </thead>
        <tbody>
        {#each data.adminsAndJury as u (u.id)}
          <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
            <td style="padding:0.75rem;font-weight:600;">{u.name}</td>
            <td style="padding:0.75rem;color:rgba(255,255,255,0.6);font-size:0.9rem;">{u.email}</td>
            <td style="padding:0.75rem;">
                <span style="background:{u.role === 'ADMIN' ? 'rgba(62,131,255,0.15)' : 'rgba(168,85,247,0.15)'};
                             color:{u.role === 'ADMIN' ? '#3E83FF' : '#a855f7'};
                             padding:2px 10px;border-radius:20px;font-size:0.78rem;font-weight:600;">
                  {roleLabel[u.role] ?? u.role}
                </span>
            </td>
            <td style="padding:0.75rem;">
              {#if u.mustChangePassword}
                  <span style="background:rgba(234,179,8,0.15);color:#eab308;
                               padding:2px 10px;border-radius:20px;font-size:0.78rem;">
                    Очікує зміни пароля
                  </span>
              {:else}
                  <span style="background:rgba(34,197,94,0.12);color:#4ade80;
                               padding:2px 10px;border-radius:20px;font-size:0.78rem;">
                    Активний
                  </span>
              {/if}
            </td>
            <td style="padding:0.75rem;color:rgba(255,255,255,0.4);font-size:0.85rem;">
              {new Date(u.createdAt).toLocaleDateString('uk-UA')}
            </td>
          </tr>
        {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>