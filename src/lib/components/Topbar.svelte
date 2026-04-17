<script lang="ts">
</script>

<header class="topbar">
	<nav class="top-nav">
		<a href="/courses" class="nav-link active">Курси</a>
		<a href="/calendar" class="nav-link">Календар</a>
		<a href="/my-teams" class="nav-link">Команда</a>
		<a href="/leaderboard" class="nav-link">Рейтинг</a>
		<a href="/info" class="nav-link">Інформація</a>
	</nav>

	<div class="top-actions">
		<button class="icon-btn" aria-label="Пошук">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
		</button>
		<a href="/profile" class="icon-btn" aria-label="Профіль">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
		</a>
	</div>
</header>

<style>
	.topbar {
		background: #080c18;
		border-bottom: 1px solid #1e2d45;
		padding: 0 2rem;
		height: 56px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;
	}

	.top-nav {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav-link {
		color: #8899aa;
		text-decoration: none;
		font-size: 0.88rem;
		padding: 0.4rem 0.85rem;
		border-radius: 20px;
		transition: background 0.15s, color 0.15s;
	}

	.nav-link:hover {
		color: #fff;
	}

	.nav-link.active {
		background: #0d1b3e;
		color: #4a90e2;
		border: 1px solid #1e2d45;
	}

	.top-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon-btn {
		width: 36px;
		height: 36px;
		border-radius: 8px;
		background: none;
		border: none;
		color: #8899aa;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		text-decoration: none;
		transition: background 0.15s, color 0.15s;
	}

	.icon-btn:hover {
		background: #111827;
		color: #fff;
	}
</style>
