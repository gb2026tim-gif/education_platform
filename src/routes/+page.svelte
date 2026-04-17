<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.user) {
			if (data.user.role === 'ADMIN') goto('/admin');
			else if (data.user.role === 'JURY') goto('/jury/dashboard');
			else goto('/dashboard');
		} else {
			goto('/auth/login');
		}
	});
</script>

<div style="min-height:100vh;background:#0a0e1a;display:flex;align-items:center;justify-content:center;">
	<p style="color:#8899aa;">Завантаження...</p>
</div>
