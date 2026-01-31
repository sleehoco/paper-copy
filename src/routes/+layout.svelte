<script lang="ts">
	import '../styles/global.css';
	import { page } from '$app/stores';

	let { children } = $props();

	interface User {
		id: string;
		name: string;
		email: string;
		avatar?: string;
		freeAnalysesUsed: number;
		subscriptionStatus: 'active' | 'canceled' | 'past_due' | null;
	}

	let user: User | null = $state(null);
	let showMobileMenu = $state(false);

	const isAdmin = $derived.by(() => {
		if (user === null) return false;
		return user.email.endsWith('@admin.com');
	});
	const isAuthPage = $derived($page.url.pathname === '/login');
</script>

<svelte:head>
	<title>PaperReview - AI-Powered Paper Feedback</title>
	<meta name="description" content="Get AI-powered feedback on your academic papers before submission. Improve structure, evidence, and style." />
</svelte:head>

{#if !isAuthPage}
	<header class="header">
		<div class="header-content container">
			<a href="/" class="logo">
				<span class="logo-icon">P</span>
				PaperReview
			</a>

			<nav class="nav-desktop">
				{#if user}
					<a href="/dashboard">Dashboard</a>
					<a href="/analyze">Analyze</a>
					{#if isAdmin}
						<a href="/admin">Admin</a>
					{/if}
				{:else}
					<a href="/#features">Features</a>
					<a href="/#pricing">Pricing</a>
				{/if}
			</nav>

			<div class="header-actions">
				{#if user}
					<div class="user-menu">
						<span class="user-name">{user.name}</span>
						<button class="btn btn-secondary" onclick={() => (user = null)}>Sign Out</button>
					</div>
				{:else}
					<a href="/login" class="btn btn-primary">Sign In</a>
				{/if}
			</div>

			<button class="mobile-menu-btn" onclick={() => (showMobileMenu = !showMobileMenu)} aria-label="Toggle menu">
				<span class="hamburger"></span>
			</button>
		</div>

		{#if showMobileMenu}
			<nav class="nav-mobile">
				{#if user}
					<a href="/dashboard" onclick={() => (showMobileMenu = false)}>Dashboard</a>
					<a href="/analyze" onclick={() => (showMobileMenu = false)}>Analyze</a>
					{#if isAdmin}
						<a href="/admin" onclick={() => (showMobileMenu = false)}>Admin</a>
					{/if}
				{:else}
					<a href="/#features" onclick={() => (showMobileMenu = false)}>Features</a>
					<a href="/#pricing" onclick={() => (showMobileMenu = false)}>Pricing</a>
					<a href="/login" onclick={() => (showMobileMenu = false)}>Sign In</a>
				{/if}
			</nav>
		{/if}
	</header>
{/if}

<main>
	{@render children()}
</main>

{#if !isAuthPage}
	<footer class="footer">
		<div class="container footer-content">
			<div class="footer-links">
				<a href="/about">About</a>
				<a href="/privacy">Privacy</a>
				<a href="/terms">Terms</a>
				<a href="/contact">Contact</a>
			</div>
			<p class="footer-copy">&copy; 2026 PaperReview. All rights reserved.</p>
		</div>
	</footer>
{/if}

<style>
	.header {
		position: sticky;
		top: 0;
		background: var(--color-background);
		border-bottom: 1px solid var(--color-border);
		z-index: 100;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 4rem;
		gap: 2rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--color-text);
		text-decoration: none;
	}

	.logo-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-md);
		font-size: 1rem;
	}

	.nav-desktop {
		display: flex;
		gap: 1.5rem;
	}

	.nav-desktop a {
		color: var(--color-text-muted);
		font-weight: 500;
		text-decoration: none;
	}

	.nav-desktop a:hover {
		color: var(--color-text);
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.user-name {
		font-weight: 500;
	}

	.mobile-menu-btn {
		display: none;
		padding: 0.5rem;
		background: none;
		border: none;
	}

	.hamburger {
		display: block;
		width: 1.5rem;
		height: 2px;
		background: var(--color-text);
		position: relative;
	}

	.hamburger::before,
	.hamburger::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: inherit;
		left: 0;
	}

	.hamburger::before {
		top: -6px;
	}

	.hamburger::after {
		top: 6px;
	}

	.nav-mobile {
		display: none;
		flex-direction: column;
		padding: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.nav-mobile a {
		padding: 0.75rem 0;
		color: var(--color-text);
		font-weight: 500;
		border-bottom: 1px solid var(--color-border);
	}

	@media (max-width: 768px) {
		.nav-desktop,
		.header-actions {
			display: none;
		}

		.mobile-menu-btn {
			display: block;
		}

		.nav-mobile {
			display: flex;
		}
	}

	main {
		min-height: calc(100vh - 4rem - 8rem);
	}

	.footer {
		background: var(--color-surface);
		border-top: 1px solid var(--color-border);
		padding: 2rem 0;
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.footer-links {
		display: flex;
		gap: 1.5rem;
	}

	.footer-links a {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.footer-copy {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}
</style>
