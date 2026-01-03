<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const userChirho = $derived($page.data?.userChirho);

	interface FeatureChirho {
		idChirho: number;
		titleChirho: string;
		descriptionChirho: string;
		categoryChirho: string;
		statusChirho: string;
		voteCountChirho: number;
		adminResponseChirho: string | null;
		createdAtChirho: string;
	}

	let featuresChirho = $state<FeatureChirho[]>([]);
	let loadingChirho = $state(true);
	let errorChirho = $state('');
	let filterChirho = $state('all');
	let showFormChirho = $state(false);

	let newFeatureChirho = $state({
		titleChirho: '',
		descriptionChirho: '',
		categoryChirho: 'platform'
	});
	let submittingChirho = $state(false);

	const statusColorsChirho: Record<string, string> = {
		proposed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
		under_review: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
		planned: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
		in_progress: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
		completed: 'bg-green-500/20 text-green-400 border-green-500/30',
		declined: 'bg-red-500/20 text-red-400 border-red-500/30'
	};

	const statusLabelsChirho: Record<string, string> = {
		proposed: 'Proposed',
		under_review: 'Under Review',
		planned: 'Planned',
		in_progress: 'In Progress',
		completed: 'Completed',
		declined: 'Declined'
	};

	const categoriesChirho = [
		{ value: 'platform', label: 'Platform' },
		{ value: 'donors', label: 'For Donors' },
		{ value: 'orphanages', label: 'For Orphanages' },
		{ value: 'children', label: 'For Children' },
		{ value: 'mobile', label: 'Mobile App' },
		{ value: 'accessibility', label: 'Accessibility' },
		{ value: 'other', label: 'Other' }
	];

	async function loadFeaturesChirho() {
		loadingChirho = true;
		try {
			const responseChirho = await fetch('/api-chirho/features-chirho');
			const dataChirho = await responseChirho.json();
			featuresChirho = dataChirho.featuresChirho || [];
		} catch (errChirho) {
			errorChirho = 'Failed to load features';
		} finally {
			loadingChirho = false;
		}
	}

	async function submitFeatureChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		if (!userChirho) return;

		submittingChirho = true;
		try {
			const responseChirho = await fetch('/api-chirho/features-chirho', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newFeatureChirho)
			});

			if (!responseChirho.ok) {
				const dataChirho = await responseChirho.json();
				throw new Error(dataChirho.message || 'Failed to submit');
			}

			newFeatureChirho = { titleChirho: '', descriptionChirho: '', categoryChirho: 'platform' };
			showFormChirho = false;
			await loadFeaturesChirho();
		} catch (errChirho) {
			errorChirho = errChirho instanceof Error ? errChirho.message : 'An error occurred';
		} finally {
			submittingChirho = false;
		}
	}

	async function voteChirho(featureIdChirho: number, voteTypeChirho: 'upvote' | 'downvote') {
		if (!userChirho) {
			errorChirho = 'Please log in to vote';
			return;
		}

		try {
			const responseChirho = await fetch(`/api-chirho/features-chirho/${featureIdChirho}/vote`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ voteTypeChirho })
			});

			if (!responseChirho.ok) {
				throw new Error('Failed to vote');
			}

			const dataChirho = await responseChirho.json();
			const featureChirho = featuresChirho.find((f) => f.idChirho === featureIdChirho);
			if (featureChirho) {
				featureChirho.voteCountChirho = dataChirho.voteCountChirho;
			}
		} catch (errChirho) {
			errorChirho = 'Failed to vote';
		}
	}

	const filteredFeaturesChirho = $derived(
		filterChirho === 'all'
			? featuresChirho
			: featuresChirho.filter((f) => f.statusChirho === filterChirho)
	);

	onMount(() => {
		loadFeaturesChirho();
	});
</script>

<svelte:head>
	<title>Feature Requests | OpenOrphanage</title>
	<meta name="description" content="Vote on feature requests and help shape the future of OpenOrphanage." />
</svelte:head>

<section class="py-24 min-h-screen">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
			<div>
				<h1 class="text-4xl font-bold text-gradient-compassion">Feature Requests</h1>
				<p class="text-slate-400 mt-2">Vote on features and help shape the platform</p>
			</div>

			{#if userChirho}
				<button
					onclick={() => (showFormChirho = !showFormChirho)}
					class="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors"
				>
					{showFormChirho ? 'Cancel' : '+ Submit Feature'}
				</button>
			{:else}
				<a
					href="/auth-chirho/login-chirho"
					class="bg-slate-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700"
				>
					Log in to Submit & Vote
				</a>
			{/if}
		</div>

		{#if errorChirho}
			<div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
				{errorChirho}
				<button onclick={() => (errorChirho = '')} class="float-right text-red-400 hover:text-red-300">x</button>
			</div>
		{/if}

		{#if showFormChirho && userChirho}
			<form onsubmit={submitFeatureChirho} class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-8">
				<h2 class="text-xl font-semibold text-white mb-4">Submit a Feature Request</h2>

				<div class="space-y-4">
					<div>
						<label for="title" class="block text-sm font-medium text-slate-300 mb-2">
							Title <span class="text-rose-400">*</span>
						</label>
						<input
							type="text"
							id="title"
							bind:value={newFeatureChirho.titleChirho}
							required
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
							placeholder="Brief title for your feature"
						/>
					</div>

					<div>
						<label for="category" class="block text-sm font-medium text-slate-300 mb-2">
							Category
						</label>
						<select
							id="category"
							bind:value={newFeatureChirho.categoryChirho}
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
						>
							{#each categoriesChirho as catChirho}
								<option value={catChirho.value}>{catChirho.label}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-slate-300 mb-2">
							Description <span class="text-rose-400">*</span>
						</label>
						<textarea
							id="description"
							bind:value={newFeatureChirho.descriptionChirho}
							required
							rows="4"
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none resize-none"
							placeholder="Describe the feature and why it would be helpful..."
						></textarea>
					</div>

					<button
						type="submit"
						disabled={submittingChirho}
						class="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-500 transition-colors disabled:opacity-50"
					>
						{submittingChirho ? 'Submitting...' : 'Submit Feature'}
					</button>
				</div>
			</form>
		{/if}

		<!-- Filters -->
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				onclick={() => (filterChirho = 'all')}
				class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {filterChirho === 'all'
					? 'bg-teal-600 text-white'
					: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
			>
				All
			</button>
			{#each Object.entries(statusLabelsChirho) as [valueChirho, labelChirho]}
				<button
					onclick={() => (filterChirho = valueChirho)}
					class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {filterChirho === valueChirho
						? 'bg-teal-600 text-white'
						: 'bg-slate-800 text-slate-300 hover:bg-slate-700'}"
				>
					{labelChirho}
				</button>
			{/each}
		</div>

		<!-- Feature List -->
		{#if loadingChirho}
			<div class="text-center py-12">
				<div class="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
				<p class="text-slate-400 mt-4">Loading features...</p>
			</div>
		{:else if filteredFeaturesChirho.length === 0}
			<div class="text-center py-12 bg-slate-800/50 border border-slate-700 rounded-xl">
				<p class="text-slate-400">No feature requests found.</p>
				{#if userChirho}
					<button
						onclick={() => (showFormChirho = true)}
						class="mt-4 text-teal-400 hover:text-teal-300"
					>
						Be the first to submit one!
					</button>
				{/if}
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredFeaturesChirho as featureChirho (featureChirho.idChirho)}
					<div class="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex gap-6">
						<!-- Vote buttons -->
						<div class="flex flex-col items-center gap-1">
							<button
								onclick={() => voteChirho(featureChirho.idChirho, 'upvote')}
								disabled={!userChirho}
								class="p-2 text-slate-400 hover:text-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								aria-label="Upvote"
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
								</svg>
							</button>
							<span class="text-xl font-bold text-white">{featureChirho.voteCountChirho}</span>
							<button
								onclick={() => voteChirho(featureChirho.idChirho, 'downvote')}
								disabled={!userChirho}
								class="p-2 text-slate-400 hover:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								aria-label="Downvote"
							>
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
						</div>

						<!-- Content -->
						<div class="flex-1">
							<div class="flex items-start justify-between gap-4 mb-2">
								<h3 class="text-lg font-semibold text-white">{featureChirho.titleChirho}</h3>
								<span class="px-3 py-1 rounded-full text-xs font-medium border {statusColorsChirho[featureChirho.statusChirho]}">
									{statusLabelsChirho[featureChirho.statusChirho]}
								</span>
							</div>
							<p class="text-slate-300 mb-3">{featureChirho.descriptionChirho}</p>
							<div class="flex items-center gap-4 text-sm text-slate-500">
								<span class="capitalize">{featureChirho.categoryChirho}</span>
								<span>
									{new Date(featureChirho.createdAtChirho).toLocaleDateString()}
								</span>
							</div>

							{#if featureChirho.adminResponseChirho}
								<div class="mt-4 bg-slate-900/50 border-l-4 border-teal-500 p-4 rounded-r">
									<p class="text-sm text-slate-400 font-medium mb-1">Official Response:</p>
									<p class="text-slate-300">{featureChirho.adminResponseChirho}</p>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-12 pt-8 border-t border-slate-800">
			<p class="text-slate-500 text-sm italic">
				"For we are co-workers in God's service" — 1 Corinthians 3:9
			</p>
			<p class="text-slate-500 text-sm mt-2">JESUS CHRIST IS LORD.</p>
		</div>
	</div>
</section>
