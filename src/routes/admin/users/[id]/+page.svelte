<script lang="ts">
	import { page } from '$app/stores';

	// Mock user data based on ID
	const user = {
		id: $page.params.id,
		name: 'Jane Doe',
		email: 'jane@uni.edu',
		avatar: null,
		provider: 'google',
		plan: 'pro' as 'free' | 'pro',
		status: 'active' as 'active' | 'suspended' | 'banned',
		freeAnalysesUsed: 10,
		totalAnalyses: 47,
		joinedAt: '2026-01-15',
		stripeCustomerId: 'cus_xxx123',
		subscriptionStatus: 'active',
		subscriptionStartedAt: '2026-02-01',
		nextBillDate: '2026-03-01',
		adminNotes: ''
	};

	const recentActivity = [
		{ action: 'Analyzed paper', title: 'Research Paper Draft 3', date: '2026-01-30' },
		{ action: 'Analyzed paper', title: 'English Essay v2', date: '2026-01-28' },
		{ action: 'Uploaded rubric', title: 'ENG101 Final', date: '2026-01-25' },
		{ action: 'Subscribed', title: 'Pro Plan', date: '2026-02-01' },
		{ action: 'Signed up', title: 'via Google', date: '2026-01-15' }
	];

	let showGrantModal = $state(false);
	let grantAmount = $state(5);
	let adminNotes = $state(user.adminNotes);
	let impersonating = $state(false);

	function grantCredits() {
		console.log('Granting', grantAmount, 'credits to user', user.id);
		showGrantModal = false;
	}

	function cancelSubscription() {
		if (confirm('Are you sure you want to cancel this user\'s subscription?')) {
			console.log('Canceling subscription for user', user.id);
		}
	}

	function suspendUser() {
		if (confirm('Are you sure you want to suspend this user?')) {
			console.log('Suspending user', user.id);
		}
	}

	function deleteUser() {
		if (confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) {
			console.log('Deleting user', user.id);
		}
	}

	function startImpersonation() {
		impersonating = true;
		// TODO: Implement actual impersonation
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

{#if impersonating}
	<div class="impersonation-banner">
		<span>Viewing as {user.name}</span>
		<button onclick={() => (impersonating = false)}>Exit Impersonation</button>
	</div>
{/if}

<div class="user-detail-page">
	<div class="container">
		<header class="page-header">
			<div>
				<a href="/admin/users" class="back-link">← All Users</a>
				<h1>{user.name}</h1>
				<p class="user-email">{user.email}</p>
			</div>
			<button class="btn btn-secondary" onclick={startImpersonation}>
				Impersonate User
			</button>
		</header>

		<div class="detail-grid">
			<!-- Main Info -->
			<div class="main-column">
				<!-- Account Info -->
				<section class="card">
					<h2>Account Information</h2>
					<div class="info-grid">
						<div class="info-item">
							<span class="info-label">User ID</span>
							<span class="info-value mono">{user.id}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Auth Provider</span>
							<span class="info-value capitalize">{user.provider}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Joined</span>
							<span class="info-value">{formatDate(user.joinedAt)}</span>
						</div>
						<div class="info-item">
							<span class="info-label">Status</span>
							<span class="status-badge {user.status}">{user.status}</span>
						</div>
					</div>
				</section>

				<!-- Subscription -->
				<section class="card">
					<h2>Subscription</h2>
					{#if user.plan === 'pro'}
						<div class="info-grid">
							<div class="info-item">
								<span class="info-label">Plan</span>
								<span class="plan-badge pro">Pro</span>
							</div>
							<div class="info-item">
								<span class="info-label">Status</span>
								<span class="info-value capitalize">{user.subscriptionStatus}</span>
							</div>
							<div class="info-item">
								<span class="info-label">Started</span>
								<span class="info-value">{formatDate(user.subscriptionStartedAt)}</span>
							</div>
							<div class="info-item">
								<span class="info-label">Next Bill</span>
								<span class="info-value">{formatDate(user.nextBillDate)}</span>
							</div>
							<div class="info-item">
								<span class="info-label">Stripe Customer</span>
								<a href="https://dashboard.stripe.com/customers/{user.stripeCustomerId}" target="_blank" class="info-value link">
									{user.stripeCustomerId} →
								</a>
							</div>
						</div>
					{:else}
						<div class="free-plan-info">
							<span class="plan-badge free">Free</span>
							<p>Used {user.freeAnalysesUsed}/10 free analyses</p>
						</div>
					{/if}
				</section>

				<!-- Usage Stats -->
				<section class="card">
					<h2>Usage Statistics</h2>
					<div class="stats-row">
						<div class="stat-box">
							<span class="stat-value">{user.totalAnalyses}</span>
							<span class="stat-label">Total Analyses</span>
						</div>
						<div class="stat-box">
							<span class="stat-value">23</span>
							<span class="stat-label">Papers Saved</span>
						</div>
						<div class="stat-box">
							<span class="stat-value">7.8</span>
							<span class="stat-label">Avg Score</span>
						</div>
					</div>
				</section>

				<!-- Activity -->
				<section class="card">
					<h2>Recent Activity</h2>
					<ul class="activity-list">
						{#each recentActivity as activity}
							<li class="activity-item">
								<span class="activity-date">{formatDate(activity.date)}</span>
								<span class="activity-action">{activity.action}</span>
								<span class="activity-title">{activity.title}</span>
							</li>
						{/each}
					</ul>
				</section>
			</div>

			<!-- Actions Sidebar -->
			<div class="sidebar-column">
				<section class="card actions-card">
					<h2>Actions</h2>

					<div class="action-group">
						<button class="btn btn-secondary full-width" onclick={() => (showGrantModal = true)}>
							Grant Free Analyses
						</button>
					</div>

					{#if user.plan === 'pro'}
						<div class="action-group">
							<button class="btn btn-secondary full-width" onclick={cancelSubscription}>
								Cancel Subscription
							</button>
						</div>
					{/if}

					<div class="action-group danger-zone">
						<h3>Danger Zone</h3>
						{#if user.status === 'active'}
							<button class="btn btn-danger full-width" onclick={suspendUser}>
								Suspend Account
							</button>
						{:else if user.status === 'suspended'}
							<button class="btn btn-secondary full-width">
								Reactivate Account
							</button>
						{/if}
						<button class="btn btn-danger full-width" onclick={deleteUser}>
							Delete Account
						</button>
					</div>
				</section>

				<!-- Admin Notes -->
				<section class="card">
					<h2>Admin Notes</h2>
					<textarea
						class="input notes-input"
						rows="4"
						placeholder="Add notes about this user..."
						bind:value={adminNotes}
					></textarea>
					<button class="btn btn-secondary full-width">Save Notes</button>
				</section>
			</div>
		</div>
	</div>
</div>

<!-- Grant Modal -->
{#if showGrantModal}
	<div class="modal-overlay" onclick={() => (showGrantModal = false)}>
		<div class="modal card" onclick={(e) => e.stopPropagation()}>
			<h2>Grant Free Analyses</h2>
			<p>Add free analyses to {user.name}'s account.</p>

			<div class="form-group">
				<label for="grant-amount">Number of analyses</label>
				<input
					id="grant-amount"
					type="number"
					class="input"
					min="1"
					max="100"
					bind:value={grantAmount}
				/>
			</div>

			<div class="modal-actions">
				<button class="btn btn-secondary" onclick={() => (showGrantModal = false)}>Cancel</button>
				<button class="btn btn-primary" onclick={grantCredits}>Grant {grantAmount} Analyses</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.impersonation-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #fbbf24;
		color: #78350f;
		padding: 0.75rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		font-weight: 600;
		z-index: 1000;
	}

	.impersonation-banner button {
		padding: 0.375rem 0.75rem;
		background: white;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
	}

	.user-detail-page {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		min-height: 100vh;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
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

	.user-email {
		color: var(--color-text-muted);
	}

	.detail-grid {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 1.5rem;
	}

	.card {
		margin-bottom: 1.5rem;
	}

	.card h2 {
		font-size: 1.125rem;
		margin-bottom: 1rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-label {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.info-value {
		font-weight: 500;
	}

	.info-value.mono {
		font-family: var(--font-mono);
		font-size: 0.875rem;
	}

	.info-value.link {
		color: var(--color-primary);
	}

	.capitalize {
		text-transform: capitalize;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
		width: fit-content;
	}

	.status-badge.active {
		background: #dcfce7;
		color: var(--color-success);
	}

	.status-badge.suspended {
		background: #fef3c7;
		color: #b45309;
	}

	.status-badge.banned {
		background: #374151;
		color: white;
	}

	.plan-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.plan-badge.pro {
		background: #f3e8ff;
		color: #7c3aed;
	}

	.plan-badge.free {
		background: var(--color-surface);
		color: var(--color-text-muted);
	}

	.free-plan-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.stat-box {
		text-align: center;
		padding: 1rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.stat-box .stat-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.stat-box .stat-label {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.activity-list {
		list-style: none;
	}

	.activity-item {
		display: grid;
		grid-template-columns: 100px 1fr 1fr;
		gap: 1rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
		font-size: 0.875rem;
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.activity-date {
		color: var(--color-text-muted);
	}

	.activity-action {
		color: var(--color-text-muted);
	}

	.activity-title {
		font-weight: 500;
	}

	/* Sidebar */
	.actions-card h2 {
		margin-bottom: 1.5rem;
	}

	.action-group {
		margin-bottom: 1rem;
	}

	.full-width {
		width: 100%;
	}

	.danger-zone {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.danger-zone h3 {
		font-size: 0.875rem;
		color: var(--color-error);
		margin-bottom: 1rem;
	}

	.btn-danger {
		background: white;
		color: var(--color-error);
		border: 1px solid var(--color-error);
	}

	.btn-danger:hover {
		background: var(--color-error);
		color: white;
	}

	.notes-input {
		margin-bottom: 1rem;
		resize: vertical;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		width: 100%;
		max-width: 400px;
		margin: 1rem;
	}

	.modal h2 {
		margin-bottom: 0.5rem;
	}

	.modal p {
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

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	@media (max-width: 900px) {
		.detail-grid {
			grid-template-columns: 1fr;
		}

		.activity-item {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
