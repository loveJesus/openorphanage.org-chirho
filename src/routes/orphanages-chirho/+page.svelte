<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let { data } = $props();

	const orphanagesChirho = $derived(data.orphanagesChirho);
	const countriesChirho = $derived(data.countriesChirho);
	const paginationChirho = $derived(data.paginationChirho);
	const filtersChirho = $derived(data.filtersChirho);

	let searchInputChirho = $state('');
	let countrySelectChirho = $state('');
	let verifiedOnlyChirho = $state(false);

	// Sync initial values from server
	$effect(() => {
		if (filtersChirho) {
			searchInputChirho = filtersChirho.searchChirho || '';
			countrySelectChirho = filtersChirho.countryChirho || '';
			verifiedOnlyChirho = filtersChirho.verifiedOnlyChirho || false;
		}
	});

	function buildUrlChirho(paramsChirho: Record<string, string | boolean | number>) {
		const urlChirho = new URL(window.location.href);
		Object.entries(paramsChirho).forEach(([key, value]) => {
			if (value) {
				urlChirho.searchParams.set(key, String(value));
			} else {
				urlChirho.searchParams.delete(key);
			}
		});
		return urlChirho.toString();
	}

	function applyFiltersChirho() {
		const urlChirho = buildUrlChirho({
			search: searchInputChirho,
			country: countrySelectChirho,
			verified: verifiedOnlyChirho,
			page: 1
		});
		window.location.href = urlChirho;
	}

	function getVerificationBadgeChirho(statusChirho: string) {
		switch (statusChirho) {
			case 'verified':
				return { classChirho: 'bg-green-500/20 text-green-400 border-green-500/30', textChirho: 'Verified', iconChirho: '✓' };
			case 'pending':
				return { classChirho: 'bg-amber-500/20 text-amber-400 border-amber-500/30', textChirho: 'Pending', iconChirho: '⏳' };
			case 'rejected':
				return { classChirho: 'bg-red-500/20 text-red-400 border-red-500/30', textChirho: 'Unverified', iconChirho: '✗' };
			default:
				return { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', textChirho: 'New', iconChirho: '○' };
		}
	}
</script>

<svelte:head>
	<title>Browse Orphanages — OpenOrphanage</title>
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/10 to-slate-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">
				<span class="text-gradient-hope">Discover</span> Orphanages
			</h1>
			<p class="text-slate-400 text-lg max-w-2xl mx-auto">
				Explore verified orphanages around the world and find opportunities to make a difference
				in children's lives.
			</p>
		</div>

		<!-- Filters -->
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8">
			<div class="grid md:grid-cols-4 gap-4">
				<div class="md:col-span-2">
					<label for="search-chirho" class="block text-sm font-medium mb-2 text-slate-300">Search</label>
					<input
						type="text"
						id="search-chirho"
						bind:value={searchInputChirho}
						placeholder="Search orphanages..."
						class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
						onkeydown={(e) => e.key === 'Enter' && applyFiltersChirho()}
					/>
				</div>

				<div>
					<label for="country-chirho" class="block text-sm font-medium mb-2 text-slate-300">Country</label>
					<div class="relative">
						<select
							id="country-chirho"
							bind:value={countrySelectChirho}
							class="w-full appearance-none bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent cursor-pointer"
						>
							<option value="">All Countries</option>
							{#each countriesChirho as countryChirho}
								<option value={countryChirho}>{countryChirho}</option>
							{/each}
						</select>
						<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
							<svg class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
							</svg>
						</div>
					</div>
				</div>

				<div class="flex flex-col justify-end">
					<label class="flex items-center gap-3 mb-3 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={verifiedOnlyChirho}
							class="w-5 h-5 rounded border-slate-600 bg-slate-900/50 text-rose-500 focus:ring-rose-500"
						/>
						<span class="text-slate-300 text-sm">Verified only</span>
					</label>
					<button
						onclick={applyFiltersChirho}
						class="bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-6 rounded-lg font-bold hover:opacity-90 transition-opacity"
					>
						Apply Filters
					</button>
				</div>
			</div>
		</div>

		<!-- Results count -->
		<div class="flex justify-between items-center mb-6">
			<p class="text-slate-400">
				Showing <span class="text-white font-semibold">{orphanagesChirho.length}</span> of
				<span class="text-white font-semibold">{paginationChirho.totalChirho}</span> orphanages
			</p>
			{#if filtersChirho.searchChirho || filtersChirho.countryChirho || filtersChirho.verifiedOnlyChirho}
				<a href="/orphanages-chirho" class="text-rose-400 hover:text-rose-300 text-sm">
					Clear filters ✕
				</a>
			{/if}
		</div>

		<!-- Orphanages Grid -->
		{#if orphanagesChirho.length > 0}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
				{#each orphanagesChirho as orphanageChirho}
					{@const badgeChirho = getVerificationBadgeChirho(orphanageChirho.verificationStatusChirho)}
					<a
						href="/orphanages-chirho/{orphanageChirho.idChirho}"
						class="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all card-hover"
					>
						<!-- Image -->
						<div class="aspect-video bg-gradient-to-br from-rose-500/20 to-teal-500/20 relative overflow-hidden">
							{#if orphanageChirho.primaryPhotoUrlChirho}
								<img
									src={orphanageChirho.primaryPhotoUrlChirho}
									alt={orphanageChirho.nameChirho}
									class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center">
									<span class="text-6xl opacity-50">🏠</span>
								</div>
							{/if}
							<!-- Verification badge -->
							<div class="absolute top-3 right-3">
								<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border {badgeChirho.classChirho}">
									{badgeChirho.iconChirho} {badgeChirho.textChirho}
								</span>
							</div>
						</div>

						<!-- Content -->
						<div class="p-6">
							<h3 class="font-bold text-lg mb-2 group-hover:text-rose-400 transition-colors">
								{orphanageChirho.nameChirho}
							</h3>
							<p class="text-slate-400 text-sm mb-4 flex items-center gap-2">
								<span>📍</span>
								{orphanageChirho.regionChirho ? `${orphanageChirho.regionChirho}, ` : ''}{orphanageChirho.countryChirho}
							</p>
							{#if orphanageChirho.shortDescriptionChirho}
								<p class="text-slate-300 text-sm mb-4 line-clamp-2">
									{orphanageChirho.shortDescriptionChirho}
								</p>
							{/if}
							<div class="flex items-center justify-between pt-4 border-t border-slate-700">
								<div class="flex items-center gap-2">
									<span class="text-2xl">👶</span>
									<span class="text-slate-300">
										<span class="font-bold text-white">{orphanageChirho.childrenCountChirho || 0}</span> children
									</span>
								</div>
								<span class="text-rose-400 text-sm font-medium group-hover:underline">
									Learn more →
								</span>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			{#if paginationChirho.totalPagesChirho > 1}
				<div class="flex justify-center gap-2">
					{#if paginationChirho.hasPrevChirho}
						<a
							href="?page={paginationChirho.currentPageChirho - 1}&search={filtersChirho.searchChirho}&country={filtersChirho.countryChirho}&verified={filtersChirho.verifiedOnlyChirho}"
							class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-rose-500/50 transition-colors"
						>
							← Previous
						</a>
					{/if}

					<div class="flex items-center gap-1">
						{#each Array.from({ length: paginationChirho.totalPagesChirho }, (_, i) => i + 1) as pageNumChirho}
							{#if pageNumChirho === paginationChirho.currentPageChirho}
								<span class="px-4 py-2 bg-rose-500 text-white rounded-lg font-bold">
									{pageNumChirho}
								</span>
							{:else if pageNumChirho === 1 || pageNumChirho === paginationChirho.totalPagesChirho || Math.abs(pageNumChirho - paginationChirho.currentPageChirho) <= 1}
								<a
									href="?page={pageNumChirho}&search={filtersChirho.searchChirho}&country={filtersChirho.countryChirho}&verified={filtersChirho.verifiedOnlyChirho}"
									class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-rose-500/50 transition-colors"
								>
									{pageNumChirho}
								</a>
							{:else if Math.abs(pageNumChirho - paginationChirho.currentPageChirho) === 2}
								<span class="px-2 text-slate-500">...</span>
							{/if}
						{/each}
					</div>

					{#if paginationChirho.hasNextChirho}
						<a
							href="?page={paginationChirho.currentPageChirho + 1}&search={filtersChirho.searchChirho}&country={filtersChirho.countryChirho}&verified={filtersChirho.verifiedOnlyChirho}"
							class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-rose-500/50 transition-colors"
						>
							Next →
						</a>
					{/if}
				</div>
			{/if}
		{:else}
			<!-- Empty state -->
			<div class="text-center py-24">
				<div class="w-24 h-24 bg-gradient-to-br from-rose-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
					<span class="text-5xl">🔍</span>
				</div>
				<h2 class="text-2xl font-bold mb-4">No orphanages found</h2>
				<p class="text-slate-400 mb-8">
					Try adjusting your search criteria or browse all orphanages.
				</p>
				<a href="/orphanages-chirho" class="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
					View All Orphanages
				</a>
			</div>
		{/if}

		<!-- CTA Section -->
		<div class="mt-16 bg-gradient-to-r from-rose-500/10 to-teal-500/10 border border-rose-500/30 rounded-2xl p-8 text-center">
			<h2 class="text-2xl font-bold mb-4">Are you an orphanage administrator?</h2>
			<p class="text-slate-300 mb-6 max-w-2xl mx-auto">
				Join OpenOrphanage to connect with donors worldwide, manage your needs transparently,
				and receive support for the children in your care.
			</p>
			<a href="/contact-fe" class="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
				Register Your Orphanage
			</a>
		</div>

		<!-- Scripture -->
		<div class="mt-12 text-center">
			<blockquote class="text-slate-400 italic">
				"Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress."
				<cite class="block mt-2 text-rose-400 not-italic">— James 1:27</cite>
			</blockquote>
		</div>
	</div>
</section>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.card-hover {
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.card-hover:hover {
		transform: translateY(-4px);
		box-shadow: 0 20px 40px -15px rgba(244, 63, 94, 0.2);
	}

	.text-gradient-hope {
		background: linear-gradient(135deg, #f43f5e, #ec4899, #f97316);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
</style>
