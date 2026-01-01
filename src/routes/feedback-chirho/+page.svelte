<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import type { FeedbackCategoryChirho } from '$lib/types_chirho';

	
	let { data } = $props();

	// Form state
	let categoryChirho = $state<FeedbackCategoryChirho>('general');
	let ratingChirho = $state<number | undefined>(undefined);
	let contentChirho = $state('');
	let anonymousChirho = $state(false);
	let publicVisibleChirho = $state(false);
	let submittingChirho = $state(false);
	let successChirho = $state(false);
	let errorChirho = $state('');

	const categoriesChirho: { valueChirho: FeedbackCategoryChirho; labelChirho: string; iconChirho: string; colorChirho: string }[] = [
		{ valueChirho: 'general', labelChirho: 'General Feedback', iconChirho: '💬', colorChirho: 'bg-blue-500/20 border-blue-500/50 text-blue-400' },
		{ valueChirho: 'feature', labelChirho: 'Feature Request', iconChirho: '✨', colorChirho: 'bg-purple-500/20 border-purple-500/50 text-purple-400' },
		{ valueChirho: 'bug', labelChirho: 'Report a Bug', iconChirho: '🐛', colorChirho: 'bg-amber-500/20 border-amber-500/50 text-amber-400' },
		{ valueChirho: 'safety_concern', labelChirho: 'Safety Concern', iconChirho: '🚨', colorChirho: 'bg-red-500/20 border-red-500/50 text-red-400' }
	];

	async function handleSubmitChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		submittingChirho = true;
		errorChirho = '';

		try {
			const responseChirho = await fetch('/api-chirho/feedback-chirho', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					categoryChirho,
					ratingChirho,
					contentChirho,
					anonymousChirho,
					publicVisibleChirho
				})
			});

			const resultChirho = await responseChirho.json();

			if (resultChirho.successChirho) {
				successChirho = true;
				// Reset form
				contentChirho = '';
				ratingChirho = undefined;
			} else {
				errorChirho = resultChirho.errorChirho || 'Failed to submit feedback';
			}
		} catch (errChirho) {
			errorChirho = 'Network error. Please try again.';
		} finally {
			submittingChirho = false;
		}
	}
</script>

<svelte:head>
	<title>Feedback — OpenOrphanage</title>
	<meta name="description" content="Share your feedback to help us serve orphans better. Report bugs, request features, or share general thoughts." />
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/10 to-slate-950">
	<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<div class="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-6">
				<span class="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
				Your Voice Matters
			</div>

			<h1 class="text-4xl md:text-5xl font-bold mb-4">
				Share Your <span class="text-gradient-compassion">Feedback</span>
			</h1>

			<p class="text-slate-400 text-lg max-w-xl mx-auto">
				Help us serve orphans better. Your feedback directly shapes how we build and improve this platform.
			</p>
		</div>

		{#if successChirho}
			<!-- Success Message -->
			<div class="bg-green-500/20 border border-green-500/50 rounded-2xl p-8 text-center">
				<div class="text-5xl mb-4">✅</div>
				<h2 class="text-2xl font-bold text-green-400 mb-2">Thank You!</h2>
				<p class="text-slate-300 mb-6">
					Your feedback has been received. We appreciate you taking the time to help us improve.
				</p>
				<button
					onclick={() => { successChirho = false; }}
					class="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-400 transition-colors"
				>
					Submit More Feedback
				</button>
			</div>
		{:else}
			<!-- Feedback Form -->
			<form onsubmit={handleSubmitChirho} class="space-y-8">
				<!-- Category Selection -->
				<div>
					<label class="block text-lg font-semibold mb-4">What type of feedback?</label>
					<div class="grid sm:grid-cols-2 gap-4">
						{#each categoriesChirho as catChirho}
							<button
								type="button"
								onclick={() => { categoryChirho = catChirho.valueChirho; }}
								class="p-4 rounded-xl border-2 transition-all text-left {categoryChirho === catChirho.valueChirho ? catChirho.colorChirho + ' border-current' : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}"
							>
								<div class="text-2xl mb-2">{catChirho.iconChirho}</div>
								<div class="font-semibold">{catChirho.labelChirho}</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Rating (Optional) -->
				<div>
					<label class="block text-lg font-semibold mb-4">
						Overall Experience <span class="text-slate-500 font-normal text-sm">(optional)</span>
					</label>
					<div class="flex gap-2">
						{#each [1, 2, 3, 4, 5] as starChirho}
							<button
								type="button"
								onclick={() => { ratingChirho = ratingChirho === starChirho ? undefined : starChirho; }}
								class="text-4xl transition-transform hover:scale-110 {ratingChirho && ratingChirho >= starChirho ? 'text-amber-400' : 'text-slate-600'}"
							>
								★
							</button>
						{/each}
					</div>
				</div>

				<!-- Content -->
				<div>
					<label for="content-chirho" class="block text-lg font-semibold mb-4">
						Your Feedback
					</label>
					<textarea
						id="content-chirho"
						bind:value={contentChirho}
						required
						minlength="10"
						rows="6"
						placeholder="Share your thoughts, suggestions, or concerns..."
						class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
					></textarea>
					<p class="text-slate-500 text-sm mt-2">{contentChirho.length} characters</p>
				</div>

				<!-- Options -->
				<div class="space-y-4">
					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={anonymousChirho}
							class="w-5 h-5 rounded bg-slate-800 border-slate-600 text-purple-500 focus:ring-purple-500"
						/>
						<span class="text-slate-300">Submit anonymously</span>
					</label>

					<label class="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={publicVisibleChirho}
							class="w-5 h-5 rounded bg-slate-800 border-slate-600 text-purple-500 focus:ring-purple-500"
						/>
						<span class="text-slate-300">Make visible on public feedback page</span>
					</label>
				</div>

				{#if categoryChirho === 'safety_concern'}
					<div class="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
						<div class="flex items-start gap-3">
							<span class="text-2xl">🚨</span>
							<div>
								<h3 class="font-semibold text-red-400">Safety Concerns are Priority</h3>
								<p class="text-slate-300 text-sm">
									Your safety concern will be immediately flagged for admin review. If there's an immediate danger, please also contact local authorities.
								</p>
							</div>
						</div>
					</div>
				{/if}

				{#if errorChirho}
					<div class="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-400">
						{errorChirho}
					</div>
				{/if}

				<!-- Submit -->
				<button
					type="submit"
					disabled={submittingChirho || contentChirho.length < 10}
					class="w-full bg-gradient-to-r from-purple-500 to-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
				>
					{#if submittingChirho}
						<svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Submitting...
					{:else}
						Submit Feedback
					{/if}
				</button>
			</form>
		{/if}

		<!-- Public Feedback Display (placeholder for now) -->
		<div class="mt-16">
			<h2 class="text-2xl font-bold mb-6">Recent Public Feedback</h2>
			<p class="text-slate-400">Public feedback will be displayed here once the feature is fully implemented.</p>
		</div>
	</div>
</section>
