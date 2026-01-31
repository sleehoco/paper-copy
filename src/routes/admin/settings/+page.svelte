<script lang="ts">
	type Provider = 'groq' | 'xai';

	let primaryProvider: Provider = $state('xai');
	let fallbackEnabled = $state(true);
	let groqKey = $state('sk-groq-xxxxxxxxxxxx');
	let xaiKey = $state('xai-xxxxxxxxxxxx');
	let showGroqKey = $state(false);
	let showXaiKey = $state(false);
	let dailyLimitAnon = $state(3);
	let dailyLimitAuth = $state(20);
	let saving = $state(false);
	let saveMessage = $state('');

	async function saveSettings() {
		saving = true;
		saveMessage = '';

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));

		saveMessage = 'Settings saved successfully';
		saving = false;

		setTimeout(() => {
			saveMessage = '';
		}, 3000);
	}

	async function testProvider(provider: Provider) {
		console.log('Testing provider:', provider);
		// TODO: Implement provider test
	}
</script>

<div class="settings-page">
	<div class="container">
		<header class="page-header">
			<div>
				<a href="/admin" class="back-link">← Admin Dashboard</a>
				<h1>Settings</h1>
			</div>
		</header>

		<form onsubmit={(e) => { e.preventDefault(); saveSettings(); }}>
			<!-- AI Provider Settings -->
			<section class="settings-section card">
				<h2>AI Provider Configuration</h2>
				<p class="section-desc">Configure which AI providers to use for paper analysis.</p>

				<div class="form-group">
					<label for="primary-provider">Primary Provider</label>
					<select id="primary-provider" class="input" bind:value={primaryProvider}>
						<option value="groq">Groq (Llama 3)</option>
						<option value="xai">x.ai (Grok)</option>
					</select>
					<p class="form-hint">The main AI provider used for analysis requests.</p>
				</div>

				<div class="form-group">
					<label class="checkbox-label">
						<input type="checkbox" bind:checked={fallbackEnabled} />
						<span>Enable Fallback Provider</span>
					</label>
					<p class="form-hint">Automatically switch to the other provider if the primary fails.</p>
				</div>

				<div class="provider-keys">
					<div class="key-group">
						<div class="key-header">
							<label for="groq-key">Groq API Key</label>
							<div class="key-actions">
								<button type="button" class="btn btn-secondary btn-sm" onclick={() => testProvider('groq')}>
									Test
								</button>
							</div>
						</div>
						<div class="key-input">
							<input
								id="groq-key"
								type={showGroqKey ? 'text' : 'password'}
								class="input"
								bind:value={groqKey}
								placeholder="sk-groq-..."
							/>
							<button
								type="button"
								class="show-btn"
								onclick={() => (showGroqKey = !showGroqKey)}
							>
								{showGroqKey ? 'Hide' : 'Show'}
							</button>
						</div>
						<span class="key-status valid">✓ Valid</span>
					</div>

					<div class="key-group">
						<div class="key-header">
							<label for="xai-key">x.ai API Key</label>
							<div class="key-actions">
								<button type="button" class="btn btn-secondary btn-sm" onclick={() => testProvider('xai')}>
									Test
								</button>
							</div>
						</div>
						<div class="key-input">
							<input
								id="xai-key"
								type={showXaiKey ? 'text' : 'password'}
								class="input"
								bind:value={xaiKey}
								placeholder="xai-..."
							/>
							<button
								type="button"
								class="show-btn"
								onclick={() => (showXaiKey = !showXaiKey)}
							>
								{showXaiKey ? 'Hide' : 'Show'}
							</button>
						</div>
						<span class="key-status valid">✓ Valid</span>
					</div>
				</div>
			</section>

			<!-- Rate Limiting -->
			<section class="settings-section card">
				<h2>Rate Limiting</h2>
				<p class="section-desc">Control how many analyses users can perform.</p>

				<div class="limits-grid">
					<div class="form-group">
						<label for="limit-anon">Anonymous Users (per day)</label>
						<input
							id="limit-anon"
							type="number"
							class="input"
							min="0"
							max="100"
							bind:value={dailyLimitAnon}
						/>
						<p class="form-hint">Tracked by IP address. Set to 0 to disable anonymous usage.</p>
					</div>

					<div class="form-group">
						<label for="limit-auth">Free Users (lifetime total)</label>
						<input
							id="limit-auth"
							type="number"
							class="input"
							min="1"
							max="100"
							value="10"
							disabled
						/>
						<p class="form-hint">This is set at 10 lifetime analyses for free users.</p>
					</div>
				</div>
			</section>

			<!-- Subscription Settings -->
			<section class="settings-section card">
				<h2>Subscription Settings</h2>
				<p class="section-desc">Manage pricing and subscription options.</p>

				<div class="form-group">
					<label>Monthly Price</label>
					<div class="price-display">
						<span class="price-value">$9.00</span>
						<span class="price-note">/ month</span>
					</div>
					<p class="form-hint">To change pricing, update your Stripe product configuration.</p>
				</div>

				<div class="stripe-link">
					<a href="https://dashboard.stripe.com" target="_blank" rel="noopener" class="btn btn-secondary">
						Open Stripe Dashboard →
					</a>
				</div>
			</section>

			<!-- Save Button -->
			<div class="save-section">
				{#if saveMessage}
					<span class="save-message success">{saveMessage}</span>
				{/if}
				<button type="submit" class="btn btn-primary btn-lg" disabled={saving}>
					{saving ? 'Saving...' : 'Save Settings'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.settings-page {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		min-height: 100vh;
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.back-link {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.back-link:hover {
		color: var(--color-primary);
	}

	.page-header h1 {
		font-size: 1.75rem;
		margin-top: 0.25rem;
	}

	.settings-section {
		margin-bottom: 1.5rem;
	}

	.settings-section h2 {
		font-size: 1.25rem;
		margin-bottom: 0.25rem;
	}

	.section-desc {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.form-hint {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
		margin-top: 0.5rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}

	.checkbox-label input {
		width: 1.25rem;
		height: 1.25rem;
	}

	.provider-keys {
		display: grid;
		gap: 1.5rem;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.key-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.key-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.key-header label {
		margin-bottom: 0;
	}

	.btn-sm {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
	}

	.key-input {
		display: flex;
		gap: 0.5rem;
	}

	.key-input input {
		flex: 1;
		font-family: var(--font-mono);
		font-size: 0.875rem;
	}

	.show-btn {
		padding: 0.625rem 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		cursor: pointer;
	}

	.show-btn:hover {
		background: var(--color-border);
	}

	.key-status {
		font-size: 0.8125rem;
	}

	.key-status.valid {
		color: var(--color-success);
	}

	.key-status.invalid {
		color: var(--color-error);
	}

	.limits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
	}

	.limits-grid input {
		width: 100%;
		max-width: 150px;
	}

	.price-display {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
	}

	.price-value {
		font-size: 2rem;
		font-weight: 700;
	}

	.price-note {
		color: var(--color-text-muted);
	}

	.stripe-link {
		margin-top: 1rem;
	}

	.save-section {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 1rem;
		padding: 1.5rem;
		background: var(--color-background);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.save-message {
		font-size: 0.875rem;
	}

	.save-message.success {
		color: var(--color-success);
	}

	.btn-lg {
		padding: 0.875rem 2rem;
		font-size: 1rem;
	}

	@media (max-width: 768px) {
		.key-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.key-input {
			flex-direction: column;
		}

		.show-btn {
			width: 100%;
		}
	}
</style>
