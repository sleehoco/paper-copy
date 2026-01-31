<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		uploaded: { file: File; content: string };
	}>();

	let dragOver = $state(false);
	let error = $state('');
	let processing = $state(false);

	const acceptedTypes = [
		'application/pdf',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'text/plain'
	];

	const acceptedExtensions = ['.pdf', '.docx', '.txt'];

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files[0];
		if (file) processFile(file);
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) processFile(file);
	}

	async function processFile(file: File) {
		error = '';

		// Validate file type
		const ext = '.' + file.name.split('.').pop()?.toLowerCase();
		if (!acceptedExtensions.includes(ext)) {
			error = 'Please upload a .pdf, .docx, or .txt file';
			return;
		}

		// Validate file size (10MB max)
		if (file.size > 10 * 1024 * 1024) {
			error = 'File size must be under 10MB';
			return;
		}

		processing = true;

		try {
			let content = '';

			if (ext === '.txt') {
				content = await file.text();
			} else {
				// For PDF and DOCX, we'd normally use a library
				// For now, just simulate extraction
				content = `[Content extracted from ${file.name}]\n\nThis is a placeholder. In production, we would extract actual text from the ${ext} file using appropriate libraries.`;
			}

			dispatch('uploaded', { file, content });
		} catch (err) {
			error = 'Failed to read file. Please try again.';
		} finally {
			processing = false;
		}
	}
</script>

<div
	class="upload-zone"
	class:drag-over={dragOver}
	class:processing
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
>
	<input
		type="file"
		accept=".pdf,.docx,.txt"
		onchange={handleFileSelect}
		class="file-input"
		id="file-upload"
	/>

	<label for="file-upload" class="upload-content">
		{#if processing}
			<div class="upload-icon processing-icon">
				<svg viewBox="0 0 24 24" width="48" height="48" class="spinner">
					<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="60" stroke-linecap="round" />
				</svg>
			</div>
			<p class="upload-text">Processing file...</p>
		{:else}
			<div class="upload-icon">
				<svg viewBox="0 0 24 24" width="48" height="48">
					<path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
					<path fill="currentColor" d="M12 12l-4 4h3v4h2v-4h3l-4-4z"/>
				</svg>
			</div>
			<p class="upload-text">
				<strong>Drop your paper here</strong> or click to browse
			</p>
			<p class="upload-formats">Supports .pdf, .docx, .txt (max 10MB)</p>
		{/if}
	</label>

	{#if error}
		<p class="upload-error">{error}</p>
	{/if}
</div>

<style>
	.upload-zone {
		position: relative;
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		padding: 3rem 2rem;
		text-align: center;
		transition: all 0.2s ease;
		background: var(--color-background);
		max-width: 600px;
		margin: 0 auto;
	}

	.upload-zone:hover,
	.upload-zone.drag-over {
		border-color: var(--color-primary);
		background: #f5f3ff;
	}

	.upload-zone.processing {
		pointer-events: none;
		opacity: 0.8;
	}

	.file-input {
		position: absolute;
		inset: 0;
		opacity: 0;
		cursor: pointer;
	}

	.upload-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
	}

	.upload-icon {
		color: var(--color-text-muted);
	}

	.upload-zone:hover .upload-icon,
	.upload-zone.drag-over .upload-icon {
		color: var(--color-primary);
	}

	.processing-icon {
		color: var(--color-primary);
	}

	.spinner {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.upload-text {
		font-size: 1.125rem;
		color: var(--color-text);
	}

	.upload-text strong {
		color: var(--color-primary);
	}

	.upload-formats {
		font-size: 0.875rem;
		color: var(--color-text-muted);
	}

	.upload-error {
		margin-top: 1rem;
		color: var(--color-error);
		font-size: 0.875rem;
	}
</style>
