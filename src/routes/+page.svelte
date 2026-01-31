<script lang="ts">
	const features = [
		{
			title: 'Structure & Flow',
			description: 'Check your paragraph organization, transitions, and logical progression.',
			icon: '1'
		},
		{
			title: 'Evidence & Citations',
			description: 'Are claims supported? Sources cited correctly? We\'ll tell you.',
			icon: '2'
		},
		{
			title: 'Language & Style',
			description: 'Academic tone, clarity, sentence variety, and grammar check.',
			icon: '3'
		},
		{
			title: 'Rubric Alignment',
			description: 'See how you score against your assignment rubric.',
			icon: '4'
		}
	];

	const steps = [
		{
			number: '1',
			title: 'Upload',
			description: 'Drop your paper (.docx, .pdf, .txt)'
		},
		{
			number: '2',
			title: 'Add Rubric',
			description: 'Paste from Canvas or skip'
		},
		{
			number: '3',
			title: 'Get Feedback',
			description: 'See scores and actionable tips'
		}
	];
</script>

<section class="hero">
	<div class="container hero-content">
		<h1>Improve Your Paper Before You Submit</h1>
		<p class="hero-subtitle">
			AI-powered feedback on structure, evidence, and style.
			Know your grade before your professor does.
		</p>
		<div class="hero-actions">
			<a href="/analyze" class="btn btn-primary btn-lg">Try Free - No Account Required</a>
		</div>
		<p class="hero-note">Works with Canvas rubrics</p>
	</div>
</section>

<section id="features" class="features">
	<div class="container">
		<h2 class="section-title">What We Check</h2>
		<div class="features-grid">
			{#each features as feature}
				<div class="feature-card card">
					<div class="feature-icon">{feature.icon}</div>
					<h3>{feature.title}</h3>
					<p>{feature.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="how-it-works">
	<div class="container">
		<h2 class="section-title">How It Works</h2>
		<div class="steps">
			{#each steps as step, i}
				<div class="step">
					<div class="step-number">{step.number}</div>
					<h3>{step.title}</h3>
					<p>{step.description}</p>
				</div>
				{#if i < steps.length - 1}
					<div class="step-arrow">→</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<section id="pricing" class="pricing">
	<div class="container">
		<h2 class="section-title">Pricing</h2>
		<div class="pricing-grid">
			<div class="pricing-card card">
				<h3>Free</h3>
				<div class="price">$0</div>
				<p class="price-desc">10 analyses lifetime</p>
				<ul class="pricing-features">
					<li>All feedback categories</li>
					<li>Rubric alignment</li>
					<li>No account required</li>
				</ul>
				<a href="/analyze" class="btn btn-secondary">Start Free</a>
			</div>
			<div class="pricing-card card popular">
				<div class="popular-badge">Most Popular</div>
				<h3>Pro</h3>
				<div class="price">$9<span>/month</span></div>
				<p class="price-desc">Unlimited analyses</p>
				<ul class="pricing-features">
					<li>Everything in Free</li>
					<li>Unlimited analyses</li>
					<li>Save all history</li>
					<li>Priority AI processing</li>
				</ul>
				<a href="/login" class="btn btn-primary">Subscribe</a>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 6rem 0;
		text-align: center;
		background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
	}

	.hero-content {
		max-width: 700px;
	}

	.hero h1 {
		font-size: 3rem;
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: 1.5rem;
		color: var(--color-text);
	}

	.hero-subtitle {
		font-size: 1.25rem;
		color: var(--color-text-muted);
		margin-bottom: 2rem;
	}

	.hero-actions {
		margin-bottom: 1rem;
	}

	.btn-lg {
		padding: 1rem 2rem;
		font-size: 1.125rem;
	}

	.hero-note {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.section-title {
		text-align: center;
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 3rem;
	}

	.features {
		padding: 5rem 0;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.feature-card {
		text-align: center;
	}

	.feature-icon {
		width: 3rem;
		height: 3rem;
		margin: 0 auto 1rem;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
	}

	.feature-card h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
	}

	.feature-card p {
		color: var(--color-text-muted);
		font-size: 0.9375rem;
	}

	.how-it-works {
		padding: 5rem 0;
		background: var(--color-surface);
	}

	.steps {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.step {
		text-align: center;
		max-width: 200px;
	}

	.step-number {
		width: 3rem;
		height: 3rem;
		margin: 0 auto 1rem;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.25rem;
	}

	.step h3 {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
	}

	.step p {
		color: var(--color-text-muted);
		font-size: 0.875rem;
	}

	.step-arrow {
		font-size: 1.5rem;
		color: var(--color-text-muted);
		margin-top: 0.75rem;
	}

	.pricing {
		padding: 5rem 0;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		max-width: 700px;
		margin: 0 auto;
	}

	.pricing-card {
		text-align: center;
		position: relative;
	}

	.pricing-card.popular {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-lg);
	}

	.popular-badge {
		position: absolute;
		top: -0.75rem;
		left: 50%;
		transform: translateX(-50%);
		background: var(--color-primary);
		color: white;
		padding: 0.25rem 1rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.pricing-card h3 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.price {
		font-size: 3rem;
		font-weight: 800;
		color: var(--color-primary);
	}

	.price span {
		font-size: 1rem;
		font-weight: 400;
		color: var(--color-text-muted);
	}

	.price-desc {
		color: var(--color-text-muted);
		margin-bottom: 1.5rem;
	}

	.pricing-features {
		list-style: none;
		text-align: left;
		margin-bottom: 1.5rem;
	}

	.pricing-features li {
		padding: 0.5rem 0;
		padding-left: 1.5rem;
		position: relative;
	}

	.pricing-features li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--color-success);
		font-weight: 700;
	}

	@media (max-width: 768px) {
		.hero h1 {
			font-size: 2rem;
		}

		.hero-subtitle {
			font-size: 1rem;
		}

		.step-arrow {
			display: none;
		}

		.steps {
			flex-direction: column;
			align-items: center;
		}
	}
</style>
