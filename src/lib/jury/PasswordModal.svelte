<script lang="ts">
  interface Props {
    open?: boolean;
    onChanged?: () => void;
  }
  let { open = $bindable(false), onChanged }: Props = $props();

  let password = $state("");
  let error = $state("");
  let loading = $state(false);

  function validate(p: string): string | null {
    if (p.length < 8) return "Мінімум 8 символів";
    if (!/[A-Z]/.test(p)) return "Потрібна хоча б одна велика літера";
    if (!/[0-9]/.test(p)) return "Потрібна хоча б одна цифра";
    if (!/[@#$!%^&*()_+\-=[\]{}|;':",.<>?]/.test(p)) return "Потрібен спеціальний символ (@, #, $, ...)";
    return null;
  }

  async function save() {
    error = "";
    const validationError = validate(password);
    if (validationError) { error = validationError; return; }

    loading = true;
    try {
      const res = await fetch("/jury/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { error = data.error ?? "Помилка збереження"; return; }
      password = "";
      open = false;
      onChanged?.();
    } catch {
      error = "Мережева помилка. Спробуй ще раз.";
    } finally {
      loading = false;
    }
  }

  function close() {
    open = false;
    password = "";
    error = "";
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
</script>

{#if open}
  <div class="overlay" onclick={(e) => { if (e.target === e.currentTarget) close(); }}
    onkeydown={handleKeydown} role="dialog" aria-modal="true" aria-label="Змінити пароль" tabindex="-1">
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Змінити пароль</h2>
        <button class="close-btn" onclick={close} aria-label="Закрити">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <input
          type="password"
          bind:value={password}
          placeholder="••••••••"
          class="password-input"
          class:has-error={!!error}
          onkeydown={(e) => { if (e.key === "Enter") save(); }}
          autocomplete="new-password"
        />
        {#if error}
          <p class="error-text">{error}</p>
        {/if}
        <p class="hint">
          Довжина: мінімум 8-12 символів. Має містити великі літери, цифри та спеціальні символи (наприклад, @, #, $).
        </p>
      </div>

      <div class="modal-footer">
        <button class="save-btn" onclick={save} disabled={loading || !password}>
          {loading ? "Збереження..." : "Зберегти"}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: #1c2333;
    border: 1px solid #30363d;
    border-radius: 14px;
    width: 460px;
    max-width: 95vw;
    padding: 28px 32px;
    box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
  }

  .modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #e6edf3;
    font-family: 'Space Grotesk', sans-serif;
    margin: 0;
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: none;
    border: none;
    cursor: pointer;
    color: #8b949e;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s, color 0.12s;
  }
  .close-btn:hover { background: #21262d; color: #e6edf3; }

  .modal-body { margin-bottom: 20px; }

  .password-input {
    width: 100%;
    padding: 11px 14px;
    border-radius: 8px;
    border: 1px solid #30363d;
    background: #0d1117;
    color: #e6edf3;
    font-size: 15px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 3px;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 8px;
    transition: border-color 0.12s;
  }
  .password-input:focus { border-color: #1f6feb; }
  .password-input.has-error { border-color: #f85149; }

  .error-text {
    font-size: 12px;
    color: #f85149;
    margin: 0 0 8px;
  }

  .hint {
    font-size: 12px;
    color: #8b949e;
    line-height: 1.6;
    margin: 0;
  }

  .modal-footer { display: flex; justify-content: flex-end; }

  .save-btn {
    padding: 10px 28px;
    border-radius: 8px;
    background: #1f6feb;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;
  }
  .save-btn:hover:not(:disabled) { background: #388bfd; }
  .save-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>
