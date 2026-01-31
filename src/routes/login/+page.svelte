<script lang="ts">
	let loading = $state(false);

	function signInWithGoogle() {
		loading = true;
		// TODO: Implement PocketBase OAuth
		console.log('Sign in with Google');
	}

	function signInWithGithub() {
		loading = true;
		// TODO: Implement PocketBase OAuth
		console.log('Sign in with GitHub');
	}
</script>

<div class="login-page">
	<div class="login-card card">
		<div class="login-header">
			<a href="/" class="logo">
				<span class="logo-icon">P</span>
				PaperReview
			</a>
			<h1>Welcome back</h1>
			<p>Sign in to save your analyses and track your progress</p>
		</div>

		<div class="login-buttons">
			<button class="btn btn-oauth" onclick={signInWithGoogle} disabled={loading}>
				<svg viewBox="0 0 24 24" width="20" height="20">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				Continue with Google
			</button>

			<button class="btn btn-oauth" onclick={signInWithGithub} disabled={loading}>
				<svg viewBox="0 0 24 24" width="20" height="20">
					<path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
				</svg>
				Continue with GitHub
			</button>
		</div>

		<p class="login-terms">
			By signing in, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>
		</p>

		<div class="login-footer">
			<a href="/analyze">or continue without an account →</a>
		</div>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
	}

	.login-card {
		width: 100%;
		max-width: 400px;
		padding: 2.5rem;
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--color-text);
		text-decoration: none;
		margin-bottom: 1.5rem;
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

	.login-header h1 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.login-header p {
		color: var(--color-text-muted);
	}

	.login-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.btn-oauth {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.875rem 1.5rem;
		background: white;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-weight: 500;
		transition: all 0.15s ease;
	}

	.btn-oauth:hover {
		background: var(--color-surface);
		border-color: var(--color-text-muted);
	}

	.btn-oauth:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.login-terms {
		text-align: center;
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.login-footer {
		text-align: center;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.login-footer a {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.login-footer a:hover {
		color: var(--color-primary);
	}
</style>
