<script lang="ts">
	import { page } from '$app/stores';

	// Mock analysis results
	const results = {
		overallScore: 7.4,
		categories: [
			{
				name: 'Structure & Flow',
				score: 7,
				color: '#10b981',
				feedback: [
					{ type: 'strength', text: 'Clear introduction with good hook that engages readers' },
					{ type: 'improvement', text: 'Paragraph 3 lacks a clear topic sentence', location: 'Para 3' },
					{ type: 'improvement', text: 'Transition between sections 2 and 3 is abrupt', location: 'Para 4' },
					{ type: 'strength', text: 'Conclusion effectively summarizes main points' }
				]
			},
			{
				name: 'Evidence & Citations',
				score: 8,
				color: '#3b82f6',
				feedback: [
					{ type: 'strength', text: 'Good variety of credible sources used' },
					{ type: 'strength', text: 'Quotes are well-integrated into arguments' },
					{ type: 'improvement', text: 'Claim in paragraph 5 needs supporting evidence', location: 'Para 5' },
					{ type: 'improvement', text: 'Consider adding a counterargument source' }
				]
			},
			{
				name: 'Language & Style',
				score: 6,
				color: '#f59e0b',
				feedback: [
					{ type: 'improvement', text: 'Several sentences are overly complex and hard to follow', location: 'Para 2, 6' },
					{ type: 'improvement', text: 'Inconsistent tone - shifts from formal to casual', location: 'Para 4' },
					{ type: 'strength', text: 'Good use of academic vocabulary' },
					{ type: 'improvement', text: '3 grammar issues detected', location: 'Various' }
				]
			},
			{
				name: 'Rubric Alignment',
				score: 8,
				color: '#8b5cf6',
				feedback: [
					{ type: 'strength', text: 'Thesis addresses the prompt effectively' },
					{ type: 'strength', text: 'Required sources quota met (5/5)' },
					{ type: 'improvement', text: 'MLA formatting has minor inconsistencies' },
					{ type: 'strength', text: 'Word count within required range' }
				]
			}
		],
		highlights: [
			{ start: 0, end: 50, type: 'strength', category: 'Structure' },
			{ start: 120, end: 180, type: 'improvement', category: 'Language' }
		]
	};

	let expandedCategory: string | null = $state(null);

	function toggleCategory(name: string) {
		expandedCategory = expandedCategory === name ? null : name;
	}

	function getScoreClass(score: number): string {
		if (score >= 8) return 'score-high';
		if (score >= 6) return 'score-medium';
		return 'score-low';
	}

	function getScoreLabel(score: number): string {
		if (score >= 9) return 'Excellent';
		if (score >= 8) return 'Great';
		if (score >= 7) return 'Good';
		if (score >= 6) return 'Fair';
		return 'Needs Work';
	}
</script>

<div class="results-page">
	<div class="container">
		<!-- Header -->
		<header class="results-header">
			<div class="header-content">
				<a href="/analyze" class="back-link">← New Analysis</a>
				<h1>Analysis Results</h1>
			</div>
			<div class="header-actions">
				<button class="btn btn-secondary">Export PDF</button>
				<button class="btn btn-primary">Save to Dashboard</button>
			</div>
		</header>

		<!-- Overall Score Card -->
		<div class="overall-score card">
			<div class="score-circle {getScoreClass(results.overallScore)}">
				<span class="score-value">{results.overallScore}</span>
				<span class="score-max">/10</span>
			</div>
			<div class="score-info">
				<h2>{getScoreLabel(results.overallScore)}</h2>
				<p>Your paper shows solid work with room for improvement in a few areas.</p>
			</div>
			<div class="score-breakdown">
				{#each results.categories as cat}
					<div class="breakdown-item">
						<span class="breakdown-label">{cat.name}</span>
						<div class="breakdown-bar">
							<div
								class="breakdown-fill"
								style="width: {cat.score * 10}%; background: {cat.color}"
							></div>
						</div>
						<span class="breakdown-score">{cat.score}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Category Details -->
		<div class="categories-grid">
			{#each results.categories as category}
				<div class="category-card card">
					<button
						class="category-header"
						onclick={() => toggleCategory(category.name)}
						aria-expanded={expandedCategory === category.name}
					>
						<div class="category-title">
							<div class="category-dot" style="background: {category.color}"></div>
							<h3>{category.name}</h3>
						</div>
						<div class="category-score {getScoreClass(category.score)}">
							{category.score}/10
						</div>
						<span class="expand-icon" class:expanded={expandedCategory === category.name}>
							▼
						</span>
					</button>

					{#if expandedCategory === category.name}
						<div class="category-content">
							<ul class="feedback-list">
								{#each category.feedback as item}
									<li class="feedback-item {item.type}">
										<span class="feedback-icon">
											{item.type === 'strength' ? '✓' : '!'}
										</span>
										<span class="feedback-text">{item.text}</span>
										{#if item.location}
											<span class="feedback-location">{item.location}</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Action Items -->
		<div class="action-items card">
			<h3>Priority Improvements</h3>
			<p class="action-subtitle">Focus on these to boost your score</p>

			<div class="action-list">
				<div class="action-item high">
					<span class="action-badge">High Impact</span>
					<p>Add a clear topic sentence to paragraph 3</p>
					<span class="action-potential">+0.5 pts potential</span>
				</div>
				<div class="action-item high">
					<span class="action-badge">High Impact</span>
					<p>Simplify complex sentences in paragraphs 2 and 6</p>
					<span class="action-potential">+0.5 pts potential</span>
				</div>
				<div class="action-item medium">
					<span class="action-badge">Medium Impact</span>
					<p>Add supporting evidence for claim in paragraph 5</p>
					<span class="action-potential">+0.3 pts potential</span>
				</div>
				<div class="action-item low">
					<span class="action-badge">Quick Win</span>
					<p>Fix 3 grammar/spelling issues</p>
					<span class="action-potential">+0.2 pts potential</span>
				</div>
			</div>

			<div class="potential-score">
				<span>If you address all items:</span>
				<strong class="score-high">7.4 → 8.9</strong>
			</div>
		</div>

		<!-- CTA for non-logged in users -->
		<div class="save-cta card">
			<div class="cta-content">
				<h3>Save your progress</h3>
				<p>Sign in to save this analysis and track your improvement over time.</p>
			</div>
			<a href="/login" class="btn btn-primary">Sign In to Save</a>
		</div>
	</div>
</div>

<style>
	.results-page {
		padding: 2rem 0 4rem;
		background: var(--color-surface);
		min-height: 100vh;
	}

	.results-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.back-link {
		font-size: 0.875rem;
		color: var(--color-text-muted);
		text-decoration: none;
	}

	.back-link:hover {
		color: var(--color-primary);
	}

	.results-header h1 {
		font-size: 1.75rem;
		margin-top: 0.25rem;
	}

	.header-actions {
		display: flex;
		gap: 0.75rem;
	}

	/* Overall Score Card */
	.overall-score {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto auto;
		gap: 1.5rem 2rem;
		margin-bottom: 2rem;
		padding: 2rem;
	}

	.score-circle {
		grid-row: span 2;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
		border: 4px solid currentColor;
	}

	.score-circle.score-high {
		color: var(--color-success);
		background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
	}

	.score-circle.score-medium {
		color: var(--color-warning);
		background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
	}

	.score-circle.score-low {
		color: var(--color-error);
		background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
	}

	.score-value {
		font-size: 2.5rem;
		font-weight: 800;
		line-height: 1;
	}

	.score-max {
		font-size: 1rem;
		opacity: 0.7;
	}

	.score-info h2 {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.score-info p {
		color: var(--color-text-muted);
	}

	.score-breakdown {
		grid-column: 2;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.breakdown-item {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.breakdown-label {
		width: 140px;
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.breakdown-bar {
		flex: 1;
		height: 8px;
		background: var(--color-border);
		border-radius: 4px;
		overflow: hidden;
	}

	.breakdown-fill {
		height: 100%;
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.breakdown-score {
		width: 30px;
		font-weight: 600;
		text-align: right;
	}

	/* Category Cards */
	.categories-grid {
		display: grid;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.category-card {
		padding: 0;
		overflow: hidden;
	}

	.category-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem 1.5rem;
		background: none;
		border: none;
		text-align: left;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.category-header:hover {
		background: var(--color-surface);
	}

	.category-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.category-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.category-title h3 {
		font-size: 1rem;
		font-weight: 600;
	}

	.category-score {
		font-weight: 700;
		font-size: 1.125rem;
	}

	.expand-icon {
		color: var(--color-text-muted);
		font-size: 0.75rem;
		transition: transform 0.2s ease;
	}

	.expand-icon.expanded {
		transform: rotate(180deg);
	}

	.category-content {
		padding: 0 1.5rem 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.feedback-list {
		list-style: none;
		margin-top: 1rem;
	}

	.feedback-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid var(--color-border);
	}

	.feedback-item:last-child {
		border-bottom: none;
	}

	.feedback-icon {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.feedback-item.strength .feedback-icon {
		background: #dcfce7;
		color: var(--color-success);
	}

	.feedback-item.improvement .feedback-icon {
		background: #fef3c7;
		color: var(--color-warning);
	}

	.feedback-text {
		flex: 1;
	}

	.feedback-location {
		font-size: 0.75rem;
		color: var(--color-text-muted);
		background: var(--color-surface);
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
	}

	/* Action Items */
	.action-items {
		margin-bottom: 2rem;
	}

	.action-items h3 {
		font-size: 1.25rem;
		margin-bottom: 0.25rem;
	}

	.action-subtitle {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.action-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: var(--color-surface);
		border-radius: var(--radius-md);
		border-left: 4px solid;
	}

	.action-item.high {
		border-color: var(--color-error);
	}

	.action-item.medium {
		border-color: var(--color-warning);
	}

	.action-item.low {
		border-color: var(--color-success);
	}

	.action-badge {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.5rem;
		border-radius: var(--radius-sm);
		white-space: nowrap;
	}

	.action-item.high .action-badge {
		background: #fef2f2;
		color: var(--color-error);
	}

	.action-item.medium .action-badge {
		background: #fffbeb;
		color: var(--color-warning);
	}

	.action-item.low .action-badge {
		background: #f0fdf4;
		color: var(--color-success);
	}

	.action-item p {
		flex: 1;
	}

	.action-potential {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.potential-score {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 1.125rem;
	}

	.potential-score strong {
		font-size: 1.25rem;
	}

	/* Save CTA */
	.save-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
		background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
		border: 1px solid #c4b5fd;
	}

	.cta-content h3 {
		font-size: 1.125rem;
		margin-bottom: 0.25rem;
	}

	.cta-content p {
		color: var(--color-text-muted);
	}

	@media (max-width: 768px) {
		.overall-score {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.score-circle {
			margin: 0 auto;
		}

		.score-breakdown {
			grid-column: 1;
		}

		.breakdown-label {
			width: 100px;
			font-size: 0.75rem;
		}

		.header-actions {
			width: 100%;
		}

		.header-actions .btn {
			flex: 1;
		}

		.action-item {
			flex-wrap: wrap;
		}

		.action-potential {
			width: 100%;
			margin-top: 0.5rem;
		}

		.save-cta {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
