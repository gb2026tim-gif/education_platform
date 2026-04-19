<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.user) {
			if (data.user.role === 'ADMIN') goto('/admin');
			else if (data.user.role === 'JURY') goto('/jury/dashboard');
		}
	});
</script>

</div>
