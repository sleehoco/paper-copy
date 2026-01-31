<script lang="ts">
	// Mock admin stats
	const stats = {
		totalUsers: 1247,
		activeSubscriptions: 312,
		analysesToday: 89,
		revenue: 2808
	};

	const recentActivity = [
		{ type: 'signup', user: 'jane@university.edu', time: '2 min ago' },
		{ type: 'subscription', user: 'mike@college.edu', time: '15 min ago' },
		{ type: 'analysis', user: 'sarah@school.edu', time: '22 min ago' },
		{ type: 'signup', user: 'alex@uni.edu', time: '45 min ago' },
		{ type: 'subscription', user: 'emma@college.edu', time: '1 hour ago' }
	];

	const aiUsage = {
		groq: { requests: 892, errors: 3, avgLatency: 1.2 },
		xai: { requests: 45, errors: 0, avgLatency: 2.1 }
	};

	function getActivityIcon(type: string): string {
		switch (type) {
			case 'signup': return '👤';
			case 'subscription': return '💳';
			case 'analysis': return '📄';
			default: return '•';
		}
	}
</script>

<div class="admin-page">
	<div class="container">
		<header class="admin-header">
			<h1>Admin Dashboard</h1>
			<div class="admin-nav">
				<a href="/admin/users" class="btn btn-secondary">Manage Users</a>
				<a href="/admin/settings" class="btn btn-secondary">Settings</a>
			</div>
		</header>

		<!-- Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card card">
				<div class="stat-icon users">👥</div>
				<div class="stat-content">
					<span class="stat-value">{stats.totalUsers.toLocaleString()}</span>
					<span class="stat-label">Total Users</span>
				</div>
			</div>
			<div class="stat-card card">
				<div class="stat-icon subs">💎</div>
				<div class="stat-content">
					<span class="stat-value">{stats.activeSubscriptions}</span>
					<span class="stat-label">Pro Subscribers</span>
				</div>
			</div>
			<div class="stat-card card">
				<div class="stat-icon analyses">📊</div>
				<div class="stat-content">
					<span class="stat-value">{stats.analysesToday}</span>
					<span class="stat-label">Analyses Today</span>
				</div>
			</div>
			<div class="stat-card card">
				<div class="stat-icon revenue">💰</div>
				<div class="stat-content">
					<span class="stat-value">${stats.revenue.toLocaleString()}</span>
					<span class="stat-label">MRR</span>
				</div>
			</div>
		</div>

		<div class="admin-grid">
			<!-- AI Provider Status -->
			<section class="card">
				<h2>AI Provider Status</h2>
				<div class="provider-list">
					<div class="provider-item">
						<div class="provider-header">
							<span class="provider-name">Groq</span>
							<span class="provider-badge primary">Primary</span>
						</div>
						<div class="provider-stats">
							<div class="provider-stat">
								<span class="stat-num">{aiUsage.groq.requests}</span>
								<span class="stat-desc">requests today</span>
							</div>
							<div class="provider-stat">
								<span class="stat-num">{aiUsage.groq.avgLatency}s</span>
								<span class="stat-desc">avg latency</span>
							</div>
							<div class="provider-stat">
								<span class="stat-num error">{aiUsage.groq.errors}</span>
								<span class="stat-desc">errors</span>
							</div>
						</div>
						<div class="provider-health healthy">
							<span class="health-dot"></span>
							Operational
						</div>
					</div>

					<div class="provider-item">
						<div class="provider-header">
							<span class="provider-name">x.ai (Grok)</span>
							<span class="provider-badge fallback">Fallback</span>
						</div>
						<div class="provider-stats">
							<div class="provider-stat">
								<span class="stat-num">{aiUsage.xai.requests}</span>
								<span class="stat-desc">requests today</span>
							</div>
							<div class="provider-stat">
								<span class="stat-num">{aiUsage.xai.avgLatency}s</span>
								<span class="stat-desc">avg latency</span>
							</div>
							<div class="provider-stat">
								<span class="stat-num">{aiUsage.xai.errors}</span>
								<span class="stat-desc">errors</span>
							</div>
						</div>
						<div class="provider-health healthy">
							<span class="health-dot"></span>
							Operational
						</div>
					</div>
				</div>
				<a href="/admin/settings" class="card-link">Configure providers →</a>
			</section>

			<!-- Recent Activity -->
			<section class="card">
				<h2>Recent Activity</h2>
				<ul class="activity-list">
					{#each recentActivity as activity}
						<li class="activity-item">
							<span class="activity-icon">{getActivityIcon(activity.type)}</span>
							<div class="activity-content">
								<span class="activity-user">{activity.user}</span>
								<span class="activity-action">
									{#if activity.type === 'signup'}
										signed up
									{:else if activity.type === 'subscription'}
										subscribed to Pro
									{:else}
										ran an analysis
									{/if}
								</span>
							</div>
							<span class="activity-time">{activity.time}</span>
						</li>
					{/each}
				</ul>
				<a href="/admin/users" class="card-link">View all users →</a>
			</section>
		</div>

		<!-- Quick Actions -->
		<section class="quick-actions card">
			<h2>Quick Actions</h2>
			<div class="actions-grid">
				<button class="action-btn">
					<span class="action-icon">📧</span>
					<span>Send Announcement</span>
				</button>
				<button class="action-btn">
					<span class="action-icon">🎁</span>
					<span>Grant Free Credits</span>
				</button>
				<button class="action-btn">
					<span class="action-icon">📊</span>
					<span>Export Reports</span>
				</button>
				<button class="action-btn">
					<span class="action-icon">🔧</span>
					<span>System Health</span>
				</button>
			</div>
		</section>
	</div>
</div>

<style>
	.admin-page {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		min-height: 100vh;
	}

	.admin-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.admin-header h1 {
		font-size: 1.75rem;
	}

	.admin-nav {
		display: flex;
		gap: 0.75rem;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.stat-icon {
		width: 3rem;
		height: 3rem;
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
	}

	.stat-icon.users { background: #dbeafe; }
	.stat-icon.subs { background: #f3e8ff; }
	.stat-icon.analyses { background: #dcfce7; }
	.stat-icon.revenue { background: #fef3c7; }

	.stat-content {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	/* Admin Grid */
	.admin-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.admin-grid h2 {
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
	}

	/* Provider Status */
	.provider-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.provider-item {
		padding: 1rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.provider-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.provider-name {
		font-weight: 600;
	}

	.provider-badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
	}

	.provider-badge.primary {
		background: #dbeafe;
		color: #1d4ed8;
	}

	.provider-badge.fallback {
		background: #f3e8ff;
		color: #7c3aed;
	}

	.provider-stats {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.provider-stat {
		display: flex;
		flex-direction: column;
	}

	.stat-num {
		font-weight: 600;
	}

	.stat-num.error {
		color: var(--color-error);
	}

	.stat-desc {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.provider-health {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
	}

	.provider-health.healthy {
		color: var(--color-success);
	}

	.health-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: currentColor;
	}

	/* Activity List */
	.activity-list {
		list-style: none;
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.activity-item:last-child {
		border-bottom: none;
	}

	.activity-icon {
		font-size: 1.25rem;
	}

	.activity-content {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.activity-user {
		font-weight: 500;
		font-size: 0.875rem;
	}

	.activity-action {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
	}

	.activity-time {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.card-link {
		display: block;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
		font-size: 0.875rem;
		color: var(--color-primary);
	}

	/* Quick Actions */
	.quick-actions h2 {
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
	}

	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
	}

	.action-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem 1rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.action-btn:hover {
		border-color: var(--color-primary);
		background: #f5f3ff;
	}

	.action-icon {
		font-size: 1.5rem;
	}

	.action-btn span:last-child {
		font-size: 0.875rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.admin-grid {
			grid-template-columns: 1fr;
		}

		.provider-stats {
			flex-wrap: wrap;
		}
	}
</style>
