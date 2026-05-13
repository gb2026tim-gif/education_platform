<script lang="ts">
  import '../app.css';
  import ChangePasswordModal from '$lib/components/ChangePasswordModal.svelte';

  let { children, data } = $props();

  // Показуємо модалку якщо mustChangePassword === true
  // Після успішної зміни ховаємо (перезавантажуємо сторінку для оновлення сесії)
  let showModal = $derived(data.mustChangePassword === true);

  function handlePasswordChanged() {
    // Перезавантажуємо, щоб layout.server отримав оновлений user
    window.location.reload();
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  {@html `<script>
    (function() {
      if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-mode');
      }
    })();
  <\/script>`}
</svelte:head>

{@render children()}

<!-- Попап примусової зміни пароля (для нових адмінів/журі) -->
{#if showModal}
  <ChangePasswordModal onSuccess={handlePasswordChanged} />
{/if}
