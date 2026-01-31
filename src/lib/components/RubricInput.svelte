<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		submit: { rubric: string };
	}>();

	type InputMethod = 'paste' | 'upload' | 'manual';

	let activeMethod: InputMethod = $state('paste');
	let pastedRubric = $state('');
	let uploadedRubric = $state('');
	let manualCriteria = $state([
		{ name: '', points: '', description: '' }
	]);
	let parsing = $state(false);
	let error = $state('');

	function addCriterion() {
		manualCriteria = [...manualCriteria, { name: '', points: '', description: '' }];
	}

	function removeCriterion(index: number) {
		manualCriteria = manualCriteria.filter((_, i) => i !== index);
	}

	async function handleFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		error = '';
		parsing = true;

		try {
			if (file.name.endsWith('.txt')) {
				uploadedRubric = await file.text();
			} else {
				// Simulate parsing for PDF/DOCX
				uploadedRubric = `[Rubric extracted from ${file.name}]\n\nThis is a placeholder. In production, we would extract actual rubric content.`;
			}
		} catch (err) {
			error = 'Failed to read file';
		} finally {
			parsing = false;
		}
	}

	function submitRubric() {
		let rubricText = '';

		if (activeMethod === 'paste') {
			rubricText = pastedRubric;
		} else if (activeMethod === 'upload') {
			rubricText = uploadedRubric;
		} else if (activeMethod === 'manual') {
			const validCriteria = manualCriteria.filter(c => c.name.trim());
			rubricText = validCriteria
				.map(c => `${c.name} (${c.points} pts): ${c.description}`)
				.join('\n');
		}

		if (!rubricText.trim()) {
			error = 'Please add your rubric before continuing';
			return;
		}

		dispatch('submit', { rubric: rubricText });
	}

	const canSubmit = $derived(() => {
		const method = activeMethod;
		if (method === 'paste') return pastedRubric.trim().length > 0;
		if (method === 'upload') return uploadedRubric.trim().length > 0;
		if (method === 'manual') return manualCriteria.some(c => c.name.trim());
		return false;
	});
</script>

<div class="rubric-input card">
	<div class="method-tabs">
		<button
			class="tab"
			class:active={activeMethod === 'paste'}
			onclick={() => (activeMethod = 'paste')}
		>
			Paste Text
		</button>
		<button
			class="tab"
			class:active={activeMethod === 'upload'}
			onclick={() => (activeMethod = 'upload')}
		>
			Upload File
		</button>
		<button
			class="tab"
			class:active={activeMethod === 'manual'}
			onclick={() => (activeMethod = 'manual')}
		>
			Enter Manually
		</button>
	</div>

	<div class="method-content">
		{#if activeMethod === 'paste'}
			<div class="paste-method">
				<label for="rubric-paste">Paste your rubric from Canvas or your syllabus:</label>
				<textarea
					id="rubric-paste"
					class="input"
					rows="10"
					placeholder="Example:

Thesis Statement (20 pts)
- Exemplary: Clear, arguable thesis that addresses the prompt
- Proficient: Thesis is present but could be more specific
- Developing: Thesis is unclear or too broad

Evidence & Support (25 pts)
- Exemplary: Strong, relevant evidence from credible sources
..."
					bind:value={pastedRubric}
				></textarea>
			</div>
		{:else if activeMethod === 'upload'}
			<div class="upload-method">
				<label class="file-upload-label">
					<input
						type="file"
						accept=".pdf,.docx,.txt,.csv"
						onchange={handleFileUpload}
						class="file-input"
					/>
					<span class="file-upload-btn btn btn-secondary">
						{parsing ? 'Processing...' : 'Choose File'}
					</span>
					<span class="file-formats">Supports .pdf, .docx, .txt, .csv</span>
				</label>

				{#if uploadedRubric}
					<div class="uploaded-preview">
						<label for="uploaded-rubric">Extracted rubric:</label>
						<textarea
							id="uploaded-rubric"
							class="input"
							rows="8"
							bind:value={uploadedRubric}
						></textarea>
					</div>
				{/if}
			</div>
		{:else if activeMethod === 'manual'}
			<div class="manual-method">
				<p class="manual-intro">Add each criterion from your rubric:</p>

				{#each manualCriteria as criterion, i}
					<div class="criterion-row">
						<input
							type="text"
							class="input"
							placeholder="Criterion name (e.g., Thesis)"
							bind:value={criterion.name}
						/>
						<input
							type="text"
							class="input points-input"
							placeholder="Points"
							bind:value={criterion.points}
						/>
						<input
							type="text"
							class="input"
							placeholder="Description (optional)"
							bind:value={criterion.description}
						/>
						{#if manualCriteria.length > 1}
							<button class="remove-btn" onclick={() => removeCriterion(i)}>×</button>
						{/if}
					</div>
				{/each}

				<button class="add-btn" onclick={addCriterion}>+ Add Criterion</button>
			</div>
		{/if}
	</div>

	{#if error}
		<p class="error-message">{error}</p>
	{/if}

	<div class="submit-section">
		<button class="btn btn-primary" onclick={submitRubric} disabled={!canSubmit}>
			Continue with Rubric
		</button>
	</div>
</div>

<style>
	.rubric-input {
		max-width: 700px;
		margin: 0 auto;
	}

	.method-tabs {
		display: flex;
		border-bottom: 1px solid var(--color-border);
		margin: -1.5rem -1.5rem 1.5rem;
		padding: 0 1.5rem;
	}

	.tab {
		padding: 1rem 1.5rem;
		background: none;
		border: none;
		color: var(--color-text-muted);
		font-weight: 500;
		position: relative;
		transition: color 0.15s ease;
	}

	.tab:hover {
		color: var(--color-text);
	}

	.tab.active {
		color: var(--color-primary);
	}

	.tab.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-primary);
	}

	.method-content {
		min-height: 300px;
	}

	label {
		display: block;
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	textarea.input {
		resize: vertical;
		font-family: var(--font-mono);
		font-size: 0.875rem;
	}

	.file-upload-label {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		padding: 2rem;
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: border-color 0.15s ease;
	}

	.file-upload-label:hover {
		border-color: var(--color-primary);
	}

	.file-input {
		display: none;
	}

	.file-formats {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.uploaded-preview {
		margin-top: 1.5rem;
	}

	.manual-intro {
		margin-bottom: 1rem;
		color: var(--color-text-muted);
	}

	.criterion-row {
		display: grid;
		grid-template-columns: 1fr 80px 1fr auto;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
		align-items: center;
	}

	.points-input {
		text-align: center;
	}

	.remove-btn {
		width: 2rem;
		height: 2rem;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		font-size: 1.25rem;
		cursor: pointer;
	}

	.remove-btn:hover {
		background: var(--color-error);
		border-color: var(--color-error);
		color: white;
	}

	.add-btn {
		background: none;
		border: none;
		color: var(--color-primary);
		font-weight: 500;
		cursor: pointer;
		padding: 0.5rem 0;
	}

	.add-btn:hover {
		text-decoration: underline;
	}

	.error-message {
		color: var(--color-error);
		font-size: 0.875rem;
		margin-top: 1rem;
	}

	.submit-section {
		margin-top: 2rem;
		text-align: center;
	}

	@media (max-width: 600px) {
		.criterion-row {
			grid-template-columns: 1fr;
		}

		.points-input {
			text-align: left;
		}
	}
</style>
