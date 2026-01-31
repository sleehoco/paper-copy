<script lang="ts">
	type UserStatus = 'active' | 'paywalled' | 'past_due' | 'suspended' | 'banned';
	type Plan = 'free' | 'pro';

	interface User {
		id: string;
		name: string;
		email: string;
		plan: Plan;
		used: number;
		limit: number;
		status: UserStatus;
		joinedAt: string;
	}

	// Mock users data
	let users: User[] = $state([
		{ id: '1', name: 'Jane Doe', email: 'jane@uni.edu', plan: 'pro', used: 47, limit: -1, status: 'active', joinedAt: '2026-01-15' },
		{ id: '2', name: 'John Smith', email: 'john@gmail.com', plan: 'free', used: 8, limit: 10, status: 'active', joinedAt: '2026-01-20' },
		{ id: '3', name: 'Alex Chen', email: 'alex@school.edu', plan: 'free', used: 10, limit: 10, status: 'paywalled', joinedAt: '2026-01-18' },
		{ id: '4', name: 'Sam Wilson', email: 'sam@test.com', plan: 'pro', used: 12, limit: -1, status: 'past_due', joinedAt: '2026-01-10' },
		{ id: '5', name: 'Emma Brown', email: 'emma@college.edu', plan: 'pro', used: 156, limit: -1, status: 'active', joinedAt: '2025-12-05' },
		{ id: '6', name: 'Mike Johnson', email: 'mike@university.edu', plan: 'free', used: 3, limit: 10, status: 'active', joinedAt: '2026-01-28' },
		{ id: '7', name: 'Sarah Davis', email: 'sarah@school.edu', plan: 'free', used: 10, limit: 10, status: 'paywalled', joinedAt: '2026-01-22' },
		{ id: '8', name: 'Chris Lee', email: 'chris@banned.com', plan: 'free', used: 0, limit: 10, status: 'banned', joinedAt: '2026-01-25' }
	]);

	let searchQuery = $state('');
	let statusFilter = $state<UserStatus | 'all'>('all');
	let planFilter = $state<Plan | 'all'>('all');
	let selectedUsers = $state<Set<string>>(new Set());
	let showBulkMenu = $state(false);

	const filteredUsers = $derived(
		users.filter(user => {
			const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				user.email.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
			const matchesPlan = planFilter === 'all' || user.plan === planFilter;
			return matchesSearch && matchesStatus && matchesPlan;
		})
	);

	function toggleSelectAll() {
		if (selectedUsers.size === filteredUsers.length) {
			selectedUsers = new Set();
		} else {
			selectedUsers = new Set(filteredUsers.map(u => u.id));
		}
	}

	function toggleSelectUser(id: string) {
		const newSet = new Set(selectedUsers);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		selectedUsers = newSet;
	}

	function getStatusBadgeClass(status: UserStatus): string {
		switch (status) {
			case 'active': return 'badge-success';
			case 'paywalled': return 'badge-warning';
			case 'past_due': return 'badge-error';
			case 'suspended': return 'badge-error';
			case 'banned': return 'badge-dark';
			default: return '';
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function handleBulkAction(action: string) {
		console.log('Bulk action:', action, 'for users:', Array.from(selectedUsers));
		showBulkMenu = false;
		// TODO: Implement bulk actions
	}
</script>

<div class="users-page">
	<div class="container">
		<header class="page-header">
			<div>
				<a href="/admin" class="back-link">← Admin Dashboard</a>
				<h1>User Management</h1>
			</div>
			<button class="btn btn-primary">Export CSV</button>
		</header>

		<!-- Filters -->
		<div class="filters-bar card">
			<div class="search-box">
				<input
					type="text"
					class="input"
					placeholder="Search by name or email..."
					bind:value={searchQuery}
				/>
			</div>
			<div class="filter-group">
				<label for="status-filter">Status:</label>
				<select id="status-filter" class="input" bind:value={statusFilter}>
					<option value="all">All</option>
					<option value="active">Active</option>
					<option value="paywalled">Paywalled</option>
					<option value="past_due">Past Due</option>
					<option value="suspended">Suspended</option>
					<option value="banned">Banned</option>
				</select>
			</div>
			<div class="filter-group">
				<label for="plan-filter">Plan:</label>
				<select id="plan-filter" class="input" bind:value={planFilter}>
					<option value="all">All</option>
					<option value="free">Free</option>
					<option value="pro">Pro</option>
				</select>
			</div>
		</div>

		<!-- Bulk Actions -->
		{#if selectedUsers.size > 0}
			<div class="bulk-actions">
				<span class="selected-count">{selectedUsers.size} selected</span>
				<div class="bulk-buttons">
					<button class="btn btn-secondary" onclick={() => handleBulkAction('grant')}>
						Grant Credits
					</button>
					<button class="btn btn-secondary" onclick={() => handleBulkAction('email')}>
						Send Email
					</button>
					<button class="btn btn-secondary" onclick={() => handleBulkAction('export')}>
						Export
					</button>
					<button class="btn btn-secondary danger" onclick={() => handleBulkAction('suspend')}>
						Suspend
					</button>
				</div>
			</div>
		{/if}

		<!-- Users Table -->
		<div class="users-table card">
			<table>
				<thead>
					<tr>
						<th class="checkbox-col">
							<input
								type="checkbox"
								checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
								onchange={toggleSelectAll}
							/>
						</th>
						<th>User</th>
						<th>Plan</th>
						<th>Usage</th>
						<th>Status</th>
						<th>Joined</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredUsers as user}
						<tr class:selected={selectedUsers.has(user.id)}>
							<td class="checkbox-col">
								<input
									type="checkbox"
									checked={selectedUsers.has(user.id)}
									onchange={() => toggleSelectUser(user.id)}
								/>
							</td>
							<td class="user-cell">
								<div class="user-info">
									<span class="user-name">{user.name}</span>
									<span class="user-email">{user.email}</span>
								</div>
							</td>
							<td>
								<span class="plan-badge {user.plan}">
									{user.plan === 'pro' ? 'Pro' : 'Free'}
								</span>
							</td>
							<td class="usage-cell">
								{#if user.plan === 'pro'}
									<span>{user.used} analyses</span>
								{:else}
									<span>{user.used}/{user.limit}</span>
								{/if}
							</td>
							<td>
								<span class="status-badge {getStatusBadgeClass(user.status)}">
									{user.status.replace('_', ' ')}
								</span>
							</td>
							<td class="date-cell">{formatDate(user.joinedAt)}</td>
							<td class="actions-cell">
								<a href="/admin/users/{user.id}" class="action-link">View</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if filteredUsers.length === 0}
				<div class="empty-state">
					<p>No users match your filters</p>
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		<div class="pagination">
			<span class="pagination-info">Showing {filteredUsers.length} of {users.length} users</span>
			<div class="pagination-controls">
				<button class="btn btn-secondary" disabled>← Previous</button>
				<span class="page-indicator">Page 1 of 1</span>
				<button class="btn btn-secondary" disabled>Next →</button>
			</div>
		</div>
	</div>
</div>

<style>
	.users-page {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		min-height: 100vh;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
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

	/* Filters */
	.filters-bar {
		display: flex;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.search-box {
		flex: 1;
		min-width: 200px;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filter-group label {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.filter-group select {
		width: auto;
		min-width: 120px;
	}

	/* Bulk Actions */
	.bulk-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: #dbeafe;
		border-radius: var(--radius-md);
		margin-bottom: 1rem;
	}

	.selected-count {
		font-weight: 600;
		color: #1d4ed8;
	}

	.bulk-buttons {
		display: flex;
		gap: 0.5rem;
	}

	.bulk-buttons .danger {
		color: var(--color-error);
		border-color: var(--color-error);
	}

	.bulk-buttons .danger:hover {
		background: var(--color-error);
		color: white;
	}

	/* Table */
	.users-table {
		padding: 0;
		overflow: hidden;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th, td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid var(--color-border);
	}

	th {
		background: var(--color-surface);
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	tr:hover {
		background: var(--color-surface);
	}

	tr.selected {
		background: #dbeafe;
	}

	.checkbox-col {
		width: 40px;
	}

	.user-cell {
		min-width: 200px;
	}

	.user-info {
		display: flex;
		flex-direction: column;
	}

	.user-name {
		font-weight: 500;
	}

	.user-email {
		font-size: 0.8125rem;
		color: var(--color-text-muted);
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

	.usage-cell {
		font-variant-numeric: tabular-nums;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.badge-success {
		background: #dcfce7;
		color: var(--color-success);
	}

	.badge-warning {
		background: #fef3c7;
		color: #b45309;
	}

	.badge-error {
		background: #fecaca;
		color: var(--color-error);
	}

	.badge-dark {
		background: #374151;
		color: white;
	}

	.date-cell {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.actions-cell {
		text-align: right;
	}

	.action-link {
		font-size: 0.875rem;
		color: var(--color-primary);
	}

	.empty-state {
		padding: 3rem;
		text-align: center;
		color: var(--color-text-muted);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.pagination-info {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.page-indicator {
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.users-table {
			overflow-x: auto;
		}

		table {
			min-width: 600px;
		}

		.filters-bar {
			flex-direction: column;
			align-items: stretch;
		}

		.filter-group {
			width: 100%;
		}

		.filter-group select {
			flex: 1;
		}

		.bulk-actions {
			flex-direction: column;
			gap: 1rem;
		}

		.bulk-buttons {
			flex-wrap: wrap;
		}
	}
</style>
