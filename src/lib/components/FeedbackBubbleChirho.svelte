<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface PropsChirho {
		userChirho?: { userIdChirho: string; emailChirho: string; roleChirho: string } | null;
		turnstileSiteKeyChirho: string;
	}

	let { userChirho = null, turnstileSiteKeyChirho }: PropsChirho = $props();

	let isOpenChirho = $state(false);
	let feedbackTypeChirho = $state<'bug' | 'feature' | 'general' | 'praise'>('general');
	let feedbackTextChirho = $state('');
	let isSubmittingChirho = $state(false);
	let submittedChirho = $state(false);
	let errorChirho = $state('');
	let turnstileTokenChirho = $state('');
	let turnstileWidgetIdChirho: string | null = null;

	const currentPageChirho = $derived($page.url.pathname);

	function toggleBubbleChirho() {
		isOpenChirho = !isOpenChirho;
		if (!isOpenChirho) {
			resetFormChirho();
		}
	}

	function resetFormChirho() {
		feedbackTypeChirho = 'general';
		feedbackTextChirho = '';
		submittedChirho = false;
		errorChirho = '';
		turnstileTokenChirho = '';
		// Reset Turnstile
		if (turnstileWidgetIdChirho && window.turnstile) {
			window.turnstile.reset(turnstileWidgetIdChirho);
		}
	}

	async function submitFeedbackChirho() {
		if (!feedbackTextChirho.trim()) {
			errorChirho = 'Please enter some feedback';
			return;
		}

		if (!turnstileTokenChirho) {
			errorChirho = 'Please complete the security check';
			return;
		}

		isSubmittingChirho = true;
		errorChirho = '';

		try {
			const responseChirho = await fetch('/api-chirho/feedback-bubble-chirho', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					typeChirho: feedbackTypeChirho,
					contentChirho: feedbackTextChirho,
					pageChirho: currentPageChirho,
					turnstileTokenChirho
				})
			});

			const dataChirho = await responseChirho.json();

			if (dataChirho.successChirho) {
				submittedChirho = true;
				setTimeout(() => {
					isOpenChirho = false;
					resetFormChirho();
				}, 2000);
			} else {
				errorChirho = dataChirho.errorChirho || 'Failed to submit feedback';
				// Reset Turnstile on error
				if (turnstileWidgetIdChirho && window.turnstile) {
					window.turnstile.reset(turnstileWidgetIdChirho);
				}
			}
		} catch (errChirho) {
			errorChirho = 'An error occurred. Please try again.';
		} finally {
			isSubmittingChirho = false;
		}
	}

	function onTurnstileSuccessChirho(tokenChirho: string) {
		turnstileTokenChirho = tokenChirho;
	}

	onMount(() => {
		// Load Turnstile script if not already loaded
		if (!document.getElementById('turnstile-script')) {
			const scriptChirho = document.createElement('script');
			scriptChirho.id = 'turnstile-script';
			scriptChirho.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
			scriptChirho.async = true;
			scriptChirho.defer = true;
			document.head.appendChild(scriptChirho);
		}

		return () => {
			// Cleanup Turnstile widget
			if (turnstileWidgetIdChirho && window.turnstile) {
				window.turnstile.remove(turnstileWidgetIdChirho);
			}
		};
	});

	// Render Turnstile when popup opens
	$effect(() => {
		if (isOpenChirho && turnstileSiteKeyChirho && !submittedChirho) {
			// Wait for DOM and Turnstile to be ready
			setTimeout(() => {
				const containerChirho = document.getElementById('turnstile-container-chirho');
				if (containerChirho && window.turnstile && !turnstileWidgetIdChirho) {
					turnstileWidgetIdChirho = window.turnstile.render(containerChirho, {
						sitekey: turnstileSiteKeyChirho,
						callback: onTurnstileSuccessChirho,
						theme: 'dark',
						size: 'compact'
					});
				}
			}, 100);
		}
	});

	const feedbackTypesChirho = [
		{ valueChirho: 'bug', labelChirho: 'Bug Report', iconChirho: '🐛' },
		{ valueChirho: 'feature', labelChirho: 'Feature Request', iconChirho: '💡' },
		{ valueChirho: 'general', labelChirho: 'General', iconChirho: '💬' },
		{ valueChirho: 'praise', labelChirho: 'Praise', iconChirho: '🙏' }
	];
</script>

<svelte:head>
	{#if isOpenChirho}
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
	{/if}
</svelte:head>

<!-- Feedback Bubble Button -->
<div class="fixed bottom-6 right-6 z-50">
	{#if isOpenChirho}
		<!-- Feedback Panel -->
		<div class="absolute bottom-16 right-0 w-80 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden animate-slideUp">
			<!-- Header -->
			<div class="bg-gradient-to-r from-rose-500/20 to-teal-500/20 px-4 py-3 border-b border-slate-700">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-white">Quick Feedback</h3>
					<button
						onclick={toggleBubbleChirho}
						class="text-slate-400 hover:text-white transition-colors"
						aria-label="Close feedback"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<p class="text-xs text-slate-400 mt-1">On: {currentPageChirho}</p>
			</div>

			{#if submittedChirho}
				<!-- Success State -->
				<div class="p-6 text-center">
					<div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
						<svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<p class="text-emerald-400 font-medium">Thank you!</p>
					<p class="text-slate-400 text-sm mt-1">Your feedback has been submitted.</p>
				</div>
			{:else}
				<!-- Form -->
				<div class="p-4 space-y-4">
					{#if errorChirho}
						<div class="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm">
							{errorChirho}
						</div>
					{/if}

					<!-- Feedback Type -->
					<div>
						<label class="block text-sm text-slate-400 mb-2">Type</label>
						<div class="grid grid-cols-4 gap-2">
							{#each feedbackTypesChirho as ftChirho}
								<button
									type="button"
									onclick={() => feedbackTypeChirho = ftChirho.valueChirho as typeof feedbackTypeChirho}
									class="flex flex-col items-center p-2 rounded-lg border transition-all {feedbackTypeChirho === ftChirho.valueChirho ? 'bg-rose-500/20 border-rose-500/50 text-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}"
								>
									<span class="text-lg">{ftChirho.iconChirho}</span>
									<span class="text-xs mt-1">{ftChirho.labelChirho.split(' ')[0]}</span>
								</button>
							{/each}
						</div>
					</div>

					<!-- Feedback Text -->
					<div>
						<label for="feedback-text" class="block text-sm text-slate-400 mb-2">Your feedback</label>
						<textarea
							id="feedback-text"
							bind:value={feedbackTextChirho}
							rows="3"
							class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
							placeholder="Tell us what you think..."
						></textarea>
					</div>

					<!-- User Info -->
					{#if userChirho}
						<p class="text-xs text-slate-500">Submitting as {userChirho.emailChirho}</p>
					{:else}
						<p class="text-xs text-slate-500">Submitting anonymously</p>
					{/if}

					<!-- Turnstile -->
					<div id="turnstile-container-chirho" class="flex justify-center"></div>

					<!-- Submit Button -->
					<button
						onclick={submitFeedbackChirho}
						disabled={isSubmittingChirho || !turnstileTokenChirho}
						class="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if isSubmittingChirho}
							<span class="inline-flex items-center gap-2">
								<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Submitting...
							</span>
						{:else}
							Send Feedback
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Floating Button -->
	<button
		onclick={toggleBubbleChirho}
		class="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center {isOpenChirho ? 'rotate-45' : ''}"
		aria-label={isOpenChirho ? 'Close feedback' : 'Open feedback'}
		aria-expanded={isOpenChirho}
	>
		{#if isOpenChirho}
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
			</svg>
		{/if}
	</button>
</div>

<style>
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slideUp {
		animation: slideUp 0.2s ease-out;
	}
</style>
