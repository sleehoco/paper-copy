<script lang="ts">
	import { goto } from '$app/navigation';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import RubricInput from '$lib/components/RubricInput.svelte';

	type Step = 'upload' | 'rubric' | 'analyzing';

	let currentStep: Step = $state('upload');
	let uploadedFile: File | null = $state(null);
	let paperContent = $state('');
	let rubricText = $state('');
	let analyzing = $state(false);
	let progress = $state(0);

	function handleFileUploaded(event: CustomEvent<{ file: File; content: string }>) {
		uploadedFile = event.detail.file;
		paperContent = event.detail.content;
		currentStep = 'rubric';
	}

	function handleRubricSubmit(event: CustomEvent<{ rubric: string }>) {
		rubricText = event.detail.rubric;
		startAnalysis();
	}

	function skipRubric() {
		rubricText = '';
		startAnalysis();
	}

	async function startAnalysis() {
		currentStep = 'analyzing';
		analyzing = true;
		progress = 0;

		// Simulate analysis progress
		const steps = [
			{ progress: 20, label: 'Reading document...' },
			{ progress: 40, label: 'Analyzing structure...' },
			{ progress: 60, label: 'Checking evidence...' },
			{ progress: 80, label: 'Evaluating language...' },
			{ progress: 100, label: 'Generating feedback...' }
		];

		for (const step of steps) {
			await new Promise((resolve) => setTimeout(resolve, 800));
			progress = step.progress;
		}

		// Navigate to results (mock ID for now)
		const mockId = 'demo-' + Date.now();
		goto(`/analyze/${mockId}`);
	}

	function goBack() {
		if (currentStep === 'rubric') {
			currentStep = 'upload';
			uploadedFile = null;
			paperContent = '';
		}
	}
</script>

<div class="analyze-page">
	<div class="container">
		{#if currentStep === 'upload'}
			<div class="step-header">
				<h1>Upload Your Paper</h1>
				<p>Drag and drop your document or click to browse</p>
			</div>
			<FileUpload on:uploaded={handleFileUploaded} />
		{:else if currentStep === 'rubric'}
			<div class="step-header">
				<button class="back-btn" onclick={goBack}>← Back</button>
				<h1>Add Your Rubric (Optional)</h1>
				<p>Paste your rubric from Canvas for more accurate feedback</p>
			</div>
			<RubricInput on:submit={handleRubricSubmit} />
			<div class="skip-section">
				<button class="btn btn-secondary" onclick={skipRubric}>Skip - Analyze without rubric</button>
			</div>
		{:else if currentStep === 'analyzing'}
			<div class="analyzing-state">
				<div class="progress-container">
					<div class="progress-bar">
						<div class="progress-fill" style="width: {progress}%"></div>
					</div>
					<p class="progress-text">
						{#if progress < 20}
							Reading document...
						{:else if progress < 40}
							Analyzing structure...
						{:else if progress < 60}
							Checking evidence...
						{:else if progress < 80}
							Evaluating language...
						{:else}
							Generating feedback...
						{/if}
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.analyze-page {
		padding: 3rem 0;
		min-height: calc(100vh - 12rem);
	}

	.step-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.step-header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.step-header p {
		color: var(--color-text-muted);
	}

	.back-btn {
		background: none;
		border: none;
		color: var(--color-text-muted);
		font-size: 0.875rem;
		margin-bottom: 1rem;
		cursor: pointer;
	}

	.back-btn:hover {
		color: var(--color-primary);
	}

	.skip-section {
		text-align: center;
		margin-top: 1.5rem;
	}

	.analyzing-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}

	.progress-container {
		width: 100%;
		max-width: 400px;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: var(--color-surface);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		border-radius: 4px;
		transition: width 0.3s ease;
	}

	.progress-text {
		text-align: center;
		color: var(--color-text-muted);
	}
</style>
