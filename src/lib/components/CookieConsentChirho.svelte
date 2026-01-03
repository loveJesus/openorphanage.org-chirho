<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	interface ConsentStateChirho {
		essential: boolean;
		functional: boolean;
		analytics: boolean;
		acceptedAt?: string;
	}

	let showBannerChirho = $state(false);
	let showDetailsChirho = $state(false);
	let consentChirho = $state<ConsentStateChirho>({
		essential: true, // Always required
		functional: false,
		analytics: false
	});

	const CONSENT_KEY_CHIRHO = 'cookie_consent_chirho';
	const CONSENT_VERSION_CHIRHO = '1.0';

	onMount(() => {
		const storedChirho = localStorage.getItem(CONSENT_KEY_CHIRHO);
		if (storedChirho) {
			try {
				const parsedChirho = JSON.parse(storedChirho);
				if (parsedChirho.version === CONSENT_VERSION_CHIRHO) {
					consentChirho = parsedChirho.consent;
					showBannerChirho = false;
				} else {
					// Version mismatch, ask again
					showBannerChirho = true;
				}
			} catch {
				showBannerChirho = true;
			}
		} else {
			showBannerChirho = true;
		}
	});

	function saveConsentChirho(): void {
		const dataChirho = {
			version: CONSENT_VERSION_CHIRHO,
			consent: {
				...consentChirho,
				acceptedAt: new Date().toISOString()
			}
		};
		localStorage.setItem(CONSENT_KEY_CHIRHO, JSON.stringify(dataChirho));
		showBannerChirho = false;
	}

	function acceptAllChirho(): void {
		consentChirho = {
			essential: true,
			functional: true,
			analytics: true
		};
		saveConsentChirho();
	}

	function acceptEssentialChirho(): void {
		consentChirho = {
			essential: true,
			functional: false,
			analytics: false
		};
		saveConsentChirho();
	}

	function savePreferencesChirho(): void {
		saveConsentChirho();
		showDetailsChirho = false;
	}
</script>

{#if browser && showBannerChirho}
	<div
		class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700"
		role="dialog"
		aria-labelledby="cookie-title-chirho"
		aria-describedby="cookie-desc-chirho"
	>
		<div class="max-w-6xl mx-auto">
			{#if !showDetailsChirho}
				<!-- Simple view -->
				<div class="flex flex-col md:flex-row items-start md:items-center gap-4">
					<div class="flex-1">
						<h2 id="cookie-title-chirho" class="text-lg font-semibold text-white mb-1">
							Cookie Preferences
						</h2>
						<p id="cookie-desc-chirho" class="text-slate-300 text-sm">
							We use cookies to enhance your experience. Essential cookies are required for the site to function.
							<a href="/cookie-policy-fe" class="text-teal-400 hover:text-teal-300 underline">Learn more</a>
						</p>
					</div>
					<div class="flex flex-wrap gap-3">
						<button
							onclick={acceptEssentialChirho}
							class="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
						>
							Essential Only
						</button>
						<button
							onclick={() => (showDetailsChirho = true)}
							class="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
						>
							Customize
						</button>
						<button
							onclick={acceptAllChirho}
							class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors"
						>
							Accept All
						</button>
					</div>
				</div>
			{:else}
				<!-- Detailed view -->
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold text-white">Cookie Preferences</h2>
						<button
							onclick={() => (showDetailsChirho = false)}
							class="text-slate-400 hover:text-white"
							aria-label="Close details"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					<div class="grid gap-4 md:grid-cols-3">
						<!-- Essential -->
						<div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h3 class="font-medium text-green-400">Essential</h3>
								<span class="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">Required</span>
							</div>
							<p class="text-sm text-slate-400">
								Required for the website to function. Cannot be disabled.
							</p>
						</div>

						<!-- Functional -->
						<div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h3 class="font-medium text-amber-400">Functional</h3>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={consentChirho.functional}
										class="sr-only peer"
									/>
									<div class="w-9 h-5 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
								</label>
							</div>
							<p class="text-sm text-slate-400">
								Remember preferences like theme and language.
							</p>
						</div>

						<!-- Analytics -->
						<div class="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
							<div class="flex items-center justify-between mb-2">
								<h3 class="font-medium text-blue-400">Analytics</h3>
								<label class="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										bind:checked={consentChirho.analytics}
										class="sr-only peer"
									/>
									<div class="w-9 h-5 bg-slate-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
								</label>
							</div>
							<p class="text-sm text-slate-400">
								Privacy-focused analytics (no tracking).
							</p>
						</div>
					</div>

					<div class="flex justify-end gap-3">
						<button
							onclick={acceptEssentialChirho}
							class="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
						>
							Essential Only
						</button>
						<button
							onclick={savePreferencesChirho}
							class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors"
						>
							Save Preferences
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
