<script lang="ts">
  import { enhance } from '$app/forms';

  interface Template { id: string; name: string; fileSize: number; createdAt: string; }
  interface TRow     { id: string; title: string; certTemplateId: string | null; status: string; }

  let { data, form }: {
    data: { templates: Template[]; tournaments: TRow[]; courses: TRow[]; };
    form: { error?: string; success?: boolean; message?: string } | null;
  } = $props();

  let uploading   = $state(false);
  let uploadError = $state('');
  let uploadName  = $state('');
  let uploadFile  = $state<File | null>(null);

  function handleFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    uploadFile = input.files?.[0] ?? null;
  }

  async function handleUpload() {
    if (!uploadFile || !uploadName.trim()) {
      uploadError = 'Вкажіть назву та оберіть файл';
      return;
    }
    uploading   = true;
    uploadError = '';
    const fd = new FormData();
    fd.append('file', uploadFile);
    fd.append('name', uploadName);
    const res = await fetch('/api/upload/cert-template', { method: 'POST', body: fd });
    if (!res.ok) {
      const d = await res.json().catch(() => ({})) as { message?: string };
      uploadError = d.message ?? 'Помилка завантаження';
      uploading = false;
      return;
    }
    window.location.reload();
  }

  function submitOnChange(e: Event) {
    const sel = e.currentTarget as HTMLSelectElement;
    sel.closest('form')?.requestSubmit();
  }

  const entityRows = $derived<Array<TRow & { type: 'tournament' | 'course'; typeName: string }>>([
    ...data.tournaments.map(t => ({ ...t, type: 'tournament' as const, typeName: 'Турнір' })),
    ...data.courses.map(c    => ({ ...c, type: 'course'     as const, typeName: 'Курс'   })),
  ]);
</script>

<svelte:head><title>Сертифікати — LvUp Admin</title></svelte:head>

<div style="max-width:1100px;margin:0 auto;padding:2rem;">

  <div style="margin-bottom:2rem;">
    <p style="color:rgba(255,255,255,0.4);font-size:0.85rem;margin:0 0 4px;">Адмін / Сертифікати</p>
    <h1 style="margin:0;font-size:1.75rem;font-weight:800;">Сертифікати</h1>
  </div>

  {#if form?.error}
    <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);
                color:#f87171;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;">
      {form.error}
    </div>
  {/if}
  {#if form?.success && form?.message}
    <div style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.3);
                color:#4ade80;padding:0.75rem 1rem;border-radius:8px;margin-bottom:1.5rem;">
      ✓ {form.message}
    </div>
  {/if}

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;align-items:start;">

    <!-- ─── Ліва: шаблони ─────────────────────────────────────────── -->
    <div>
      <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
        <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
          <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
          <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                     letter-spacing:0.06em;color:rgba(255,255,255,0.5);">Шаблони сертифікатів</h2>
        </div>

        {#each data.templates as t (t.id)}
          <div style="background:linear-gradient(135deg,#0f2552,#0d1b3e);border:1px solid rgba(62,131,255,0.15);
                      border-radius:12px;padding:1.25rem;margin-bottom:0.75rem;">
            <div style="text-align:center;padding:1rem 0;">
              <p style="margin:0 0 4px;font-size:1.1rem;font-weight:800;color:#3E83FF;">LvUp</p>
              <p style="margin:0 0 4px;font-size:0.9rem;font-weight:600;">{t.name}</p>
              <p style="margin:0;font-size:0.75rem;color:rgba(255,255,255,0.35);">[[ПІБ]] · [[Контекст]]</p>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.75rem;
                        padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.06);">
              <span style="font-size:0.78rem;color:rgba(255,255,255,0.35);">
                {(t.fileSize / 1024).toFixed(0)} KB ·
                Завантажено {new Date(t.createdAt).toLocaleDateString('uk-UA', {day:'numeric',month:'short'})}
              </span>
              <a href="/api/certificates/preview/{t.id}"
                 style="font-size:0.78rem;color:#3E83FF;text-decoration:none;">Прев'ю →</a>
            </div>
          </div>
        {/each}

        <!-- Завантажити новий шаблон -->
        <div style="border:1px dashed rgba(255,255,255,0.15);border-radius:12px;padding:1.5rem;text-align:center;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)"
               stroke-width="1.5" style="margin-bottom:0.5rem;" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p style="margin:0 0 1rem;font-size:0.85rem;color:rgba(255,255,255,0.4);">
            Додати шаблон<br/>
            <span style="font-size:0.78rem;">Завантаж PDF-шаблон</span>
          </p>

          {#if uploadError}
            <p style="color:#f87171;font-size:0.82rem;margin:0 0 0.75rem;">{uploadError}</p>
          {/if}

          <label for="tpl-name" class="sr-only">Назва шаблону</label>
          <input id="tpl-name" type="text" bind:value={uploadName} placeholder="Назва шаблону"
                 style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:8px;
                   padding:0.65rem 1rem;color:#fff;font-size:0.9rem;outline:none;
                   box-sizing:border-box;margin-bottom:0.5rem;" />

          <label for="tpl-file" class="sr-only">PDF файл шаблону</label>
          <input id="tpl-file" type="file" accept=".pdf" onchange={handleFileChange}
                 style="width:100%;background:#111827;border:1px solid #1e2d45;border-radius:8px;
                   padding:0.6rem;color:rgba(255,255,255,0.6);font-size:0.85rem;
                   box-sizing:border-box;margin-bottom:0.75rem;" />

          <button onclick={handleUpload} disabled={uploading}
                  style="background:#3E83FF;color:#fff;border:none;border-radius:8px;
                   padding:0.65rem 1.5rem;font-size:0.9rem;font-weight:600;cursor:pointer;
                   opacity:{uploading ? '0.6' : '1'}">
            {uploading ? 'Завантажуємо...' : 'Завантажити шаблон'}
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Права: прив'язка до турнірів / курсів ─────────────────── -->
    <div>
      <div style="background:#0d1b3e;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;">
        <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:1.25rem;">
          <span style="width:3px;height:18px;background:#3E83FF;border-radius:2px;display:block;"></span>
          <h2 style="margin:0;font-size:0.85rem;font-weight:700;text-transform:uppercase;
                     letter-spacing:0.06em;color:rgba(255,255,255,0.5);">
            Призначено до турнірів і курсів
          </h2>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <thead>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
            {#each ['Назва', 'Тип', 'Шаблон', 'Дія'] as h}
              <th style="text-align:left;padding:0 0.5rem 0.75rem;font-size:0.75rem;
                           color:rgba(255,255,255,0.4);font-weight:600;text-transform:uppercase;">
                {h}
              </th>
            {/each}
          </tr>
          </thead>
          <tbody>
          {#each entityRows as row (row.type + row.id)}
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
              <td style="padding:0.7rem 0.5rem;font-size:0.88rem;font-weight:600;
                           max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                {row.title}
              </td>
              <td style="padding:0.7rem 0.5rem;">
                  <span style="background:{row.type === 'tournament' ? 'rgba(62,131,255,0.15)' : 'rgba(34,197,94,0.12)'};
                               color:{row.type === 'tournament' ? '#3E83FF' : '#4ade80'};
                               padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:600;">
                    {row.typeName}
                  </span>
              </td>
              <td style="padding:0.7rem 0.5rem;">
                <form method="POST" action="?/assignTemplate" use:enhance>
                  <input type="hidden" name="entityType" value={row.type} />
                  <input type="hidden" name="entityId"   value={row.id} />
                  <label for="tpl-{row.type}-{row.id}" class="sr-only">Шаблон для {row.title}</label>
                  <select id="tpl-{row.type}-{row.id}" name="templateId" onchange={submitOnChange}
                          style="background:#111827;border:1px solid #1e2d45;border-radius:8px;
                             padding:4px 8px;color:#fff;font-size:0.82rem;outline:none;max-width:140px;">
                    <option value="">— не обрано —</option>
                    {#each data.templates as t}
                      <option value={t.id} selected={row.certTemplateId === t.id}>{t.name}</option>
                    {/each}
                  </select>
                </form>
              </td>
              <td style="padding:0.7rem 0.5rem;">
                <form method="POST" action="?/generate" use:enhance>
                  <input type="hidden" name="entityType" value={row.type} />
                  <input type="hidden" name="entityId"   value={row.id} />
                  <input type="hidden" name="templateId" value={row.certTemplateId ?? ''} />
                  <button type="submit" disabled={!row.certTemplateId}
                          style="background:{row.certTemplateId ? '#eab308' : 'rgba(255,255,255,0.05)'};
                             color:{row.certTemplateId ? '#000' : 'rgba(255,255,255,0.25)'};
                             border:none;border-radius:8px;padding:5px 12px;
                             font-size:0.78rem;font-weight:700;
                             cursor:{row.certTemplateId ? 'pointer' : 'not-allowed'}">
                    Генерувати PDF
                  </button>
                </form>
              </td>
            </tr>
          {/each}
          </tbody>
        </table>

        <div style="margin-top:1.25rem;background:rgba(62,131,255,0.06);border:1px solid rgba(62,131,255,0.15);
                    border-radius:10px;padding:1rem;">
          <p style="margin:0;font-size:0.82rem;color:rgba(255,255,255,0.5);line-height:1.6;">
            Після генерації учасники отримують сповіщення і зможуть завантажити свій сертифікат у кабінеті.
            Система підставляє ім'я, турнір/курс і дату автоматично.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>