<script lang="ts">
	// Mock user data
	const user = {
		name: 'Alex Student',
		email: 'alex@university.edu',
		freeAnalysesUsed: 7,
		subscriptionStatus: null as 'active' | null
	};

	const freeLimit = 10;
	const remaining = freeLimit - user.freeAnalysesUsed;

	// Mock analyses history
	const analyses = [
		{
			id: '1',
			title: 'Research Paper - Climate Change Effects',
			score: 8.2,
			date: '2026-01-30',
			categories: { structure: 8, evidence: 9, language: 7, rubric: 8 }
		},
		{
			id: '2',
			title: 'English Essay - Literary Analysis',
			score: 7.4,
			date: '2026-01-28',
			categories: { structure: 7, evidence: 8, language: 6, rubric: 8 }
		},
		{
			id: '3',
			title: 'History Paper - World War II',
			score: 6.8,
			date: '2026-01-25',
			categories: { structure: 6, evidence: 7, language: 7, rubric: 7 }
		},
		{
			id: '4',
			title: 'Biology Report - Cell Division',
			score: 8.5,
			date: '2026-01-20',
			categories: { structure: 9, evidence: 8, language: 8, rubric: 9 }
		}
	];

	function getScoreClass(score: number): string {
		if (score >= 8) return 'score-high';
		if (score >= 6) return 'score-medium';
		return 'score-low';
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="dashboard-page">
	<div class="container">
		<!-- Header -->
		<header class="dashboard-header">
			<div>
				<h1>Welcome back, {user.name.split(' ')[0]}</h1>
				<p class="subtitle">Track your progress and improve your writing</p>
			</div>
			<a href="/analyze" class="btn btn-primary">+ New Analysis</a>
		</header>

		<!-- Usage Banner -->
		{#if !user.subscriptionStatus}
			<div class="usage-banner card">
				<div class="usage-info">
					<div class="usage-meter">
						<div class="usage-bar">
							<div
								class="usage-fill"
								style="width: {(user.freeAnalysesUsed / freeLimit) * 100}%"
							></div>
						</div>
						<span class="usage-count">{remaining} of {freeLimit} free analyses remaining</span>
					</div>
				</div>
				<a href="/login?upgrade=true" class="btn btn-primary">Upgrade to Pro</a>
			</div>
		{/if}

		<!-- Stats Grid -->
		<div class="stats-grid">
			<div class="stat-card card">
				<span class="stat-value">{analyses.length}</span>
				<span class="stat-label">Papers Analyzed</span>
			</div>
			<div class="stat-card card">
				<span class="stat-value {getScoreClass(7.7)}">7.7</span>
				<span class="stat-label">Average Score</span>
			</div>
			<div class="stat-card card">
				<span class="stat-value score-high">+1.4</span>
				<span class="stat-label">Score Improvement</span>
			</div>
			<div class="stat-card card">
				<span class="stat-value">Structure</span>
				<span class="stat-label">Top Strength</span>
			</div>
		</div>

		<!-- Recent Analyses -->
		<section class="recent-section">
			<div class="section-header">
				<h2>Recent Analyses</h2>
				<button class="btn btn-secondary btn-sm">View All</button>
			</div>

			<div class="analyses-list">
				{#each analyses as analysis}
					<a href="/analyze/{analysis.id}" class="analysis-card card">
						<div class="analysis-main">
							<h3>{analysis.title}</h3>
							<span class="analysis-date">{formatDate(analysis.date)}</span>
						</div>

						<div class="analysis-scores">
							<div class="mini-scores">
								<div class="mini-score" title="Structure">
									<span class="mini-label">S</span>
									<span class="mini-value">{analysis.categories.structure}</span>
								</div>
								<div class="mini-score" title="Evidence">
									<span class="mini-label">E</span>
									<span class="mini-value">{analysis.categories.evidence}</span>
								</div>
								<div class="mini-score" title="Language">
									<span class="mini-label">L</span>
									<span class="mini-value">{analysis.categories.language}</span>
								</div>
								<div class="mini-score" title="Rubric">
									<span class="mini-label">R</span>
									<span class="mini-value">{analysis.categories.rubric}</span>
								</div>
							</div>

							<div class="overall-badge {getScoreClass(analysis.score)}">
								{analysis.score}
							</div>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- Progress Chart Placeholder -->
		<section class="progress-section card">
			<h2>Your Progress</h2>
			<div class="chart-placeholder">
				<div class="chart-bars">
					{#each [6.8, 7.4, 8.2, 8.5] as score, i}
						<div class="chart-bar-container">
							<div
								class="chart-bar {getScoreClass(score)}"
								style="height: {score * 10}%"
							></div>
							<span class="chart-label">Week {i + 1}</span>
						</div>
					{/each}
				</div>
				<p class="chart-insight">Your scores have improved by 25% over the past month!</p>
			</div>
		</section>
	</div>
</div>

<style>
	.dashboard-page {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		min-height: 100vh;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.dashboard-header h1 {
		font-size: 1.75rem;
	}

	.subtitle {
		color: var(--color-text-muted);
	}

	/* Usage Banner */
	.usage-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		margin-bottom: 2rem;
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
		border: 1px solid #fbbf24;
	}

	.usage-info {
		flex: 1;
	}

	.usage-meter {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.usage-bar {
		height: 8px;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 4px;
		overflow: hidden;
		max-width: 300px;
	}

	.usage-fill {
		height: 100%;
		background: #f59e0b;
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.usage-count {
		font-size: 0.875rem;
		font-weight: 500;
		color: #92400e;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		text-align: center;
		padding: 1.5rem 1rem;
	}

	.stat-value {
		display: block;
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 0.25rem;
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	/* Recent Section */
	.recent-section {
		margin-bottom: 2rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.section-header h2 {
		font-size: 1.25rem;
	}

	.btn-sm {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.analyses-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.analysis-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.15s ease, transform 0.15s ease;
	}

	.analysis-card:hover {
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.analysis-main h3 {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.analysis-date {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.analysis-scores {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.mini-scores {
		display: flex;
		gap: 0.5rem;
	}

	.mini-score {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.125rem;
	}

	.mini-label {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.mini-value {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.overall-badge {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1rem;
	}

	.overall-badge.score-high {
		background: #dcfce7;
		color: var(--color-success);
	}

	.overall-badge.score-medium {
		background: #fef3c7;
		color: var(--color-warning);
	}

	.overall-badge.score-low {
		background: #fecaca;
		color: var(--color-error);
	}

	/* Progress Section */
	.progress-section h2 {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.chart-placeholder {
		text-align: center;
	}

	.chart-bars {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		gap: 2rem;
		height: 150px;
		margin-bottom: 1.5rem;
	}

	.chart-bar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		height: 100%;
	}

	.chart-bar {
		width: 40px;
		border-radius: var(--radius-sm) var(--radius-sm) 0 0;
		transition: height 0.5s ease;
	}

	.chart-bar.score-high {
		background: linear-gradient(180deg, #10b981 0%, #059669 100%);
	}

	.chart-bar.score-medium {
		background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
	}

	.chart-label {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.chart-insight {
		color: var(--color-success);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.usage-banner {
			flex-direction: column;
			text-align: center;
		}

		.usage-bar {
			max-width: 100%;
		}

		.analysis-card {
			flex-direction: column;
			align-items: flex-start;
		}

		.analysis-scores {
			width: 100%;
			justify-content: space-between;
		}

		.mini-scores {
			flex: 1;
		}
	}
</style>
