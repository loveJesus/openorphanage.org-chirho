<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let { data } = $props();

	const orphanageChirho = $derived(data.orphanageChirho);
	const needsChirho = $derived(data.needsChirho);
	const childrenCountChirho = $derived(data.childrenCountChirho);

	function getVerificationBadgeChirho(statusChirho: string) {
		switch (statusChirho) {
			case 'verified':
				return { classChirho: 'bg-green-500/20 text-green-400 border-green-500/30', textChirho: 'Verified Orphanage', iconChirho: '✓' };
			case 'pending':
				return { classChirho: 'bg-amber-500/20 text-amber-400 border-amber-500/30', textChirho: 'Verification Pending', iconChirho: '⏳' };
			default:
				return { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', textChirho: 'Awaiting Verification', iconChirho: '○' };
		}
	}

	function getPriorityBadgeChirho(priorityChirho: string) {
		switch (priorityChirho) {
			case 'urgent':
				return { classChirho: 'bg-red-500/20 text-red-400 border-red-500/30', textChirho: 'Urgent' };
			case 'high':
				return { classChirho: 'bg-orange-500/20 text-orange-400 border-orange-500/30', textChirho: 'High Priority' };
			case 'medium':
				return { classChirho: 'bg-amber-500/20 text-amber-400 border-amber-500/30', textChirho: 'Medium' };
			default:
				return { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', textChirho: 'Normal' };
		}
	}

	function getCategoryIconChirho(categoryChirho: string) {
		const iconsChirho: Record<string, string> = {
			food: '🍚',
			medical: '💊',
			education: '📚',
			clothing: '👕',
			infrastructure: '🏗️',
			staff: '👨‍👩‍👧',
			utilities: '💡',
			transportation: '🚐',
			other: '📦'
		};
		return iconsChirho[categoryChirho] || '📦';
	}

	function formatCurrencyChirho(amountChirho: number, currencyChirho: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyChirho || 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amountChirho);
	}

	function getProgressPercentChirho(raisedChirho: number, neededChirho: number) {
		if (neededChirho === 0) return 100;
		return Math.min(100, Math.round((raisedChirho / neededChirho) * 100));
	}

	const badgeChirho = $derived(getVerificationBadgeChirho(orphanageChirho.verificationStatusChirho));
</script>

<svelte:head>
	<title>{orphanageChirho.nameChirho} — OpenOrphanage</title>
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-rose-950/10 to-slate-950">
	<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Back link -->
		<a href="/orphanages-chirho" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
			← Back to all orphanages
		</a>

		<!-- Hero Section -->
		<div class="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden mb-8">
			<!-- Header Image -->
			<div class="aspect-[21/9] bg-gradient-to-br from-rose-500/20 to-teal-500/20 relative">
				{#if orphanageChirho.primaryPhotoUrlChirho}
					<img
						src={orphanageChirho.primaryPhotoUrlChirho}
						alt={orphanageChirho.nameChirho}
						class="w-full h-full object-cover"
					/>
				{:else}
					<div class="w-full h-full flex items-center justify-center">
						<span class="text-8xl opacity-30">🏠</span>
					</div>
				{/if}
				<div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
			</div>

			<!-- Main Info -->
			<div class="p-8 -mt-24 relative">
				<div class="flex flex-col md:flex-row md:items-end gap-6">
					<!-- Icon -->
					<div class="w-32 h-32 bg-gradient-to-br from-rose-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl border-4 border-slate-800">
						<span class="text-5xl">🏠</span>
					</div>

					<div class="flex-grow">
						<span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border mb-3 {badgeChirho.classChirho}">
							{badgeChirho.iconChirho} {badgeChirho.textChirho}
						</span>
						<h1 class="text-3xl md:text-4xl font-bold mb-2">{orphanageChirho.nameChirho}</h1>
						<p class="text-slate-400 flex items-center gap-2 text-lg">
							<span>📍</span>
							{orphanageChirho.regionChirho ? `${orphanageChirho.regionChirho}, ` : ''}{orphanageChirho.countryChirho}
						</p>
					</div>

					<!-- Quick stats -->
					<div class="flex gap-6">
						<div class="text-center">
							<div class="text-3xl font-bold text-rose-400">{childrenCountChirho}</div>
							<div class="text-slate-400 text-sm">Children</div>
						</div>
						<div class="text-center">
							<div class="text-3xl font-bold text-teal-400">{needsChirho.length}</div>
							<div class="text-slate-400 text-sm">Active Needs</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-8">
				<!-- About -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
					<h2 class="text-2xl font-bold mb-4">About This Orphanage</h2>
					{#if orphanageChirho.fullDescriptionChirho}
						<div class="prose prose-invert prose-slate max-w-none">
							<p class="text-slate-300 whitespace-pre-wrap">{orphanageChirho.fullDescriptionChirho}</p>
						</div>
					{:else}
						<p class="text-slate-400 italic">No description available yet.</p>
					{/if}
				</div>

				<!-- Active Needs -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
					<h2 class="text-2xl font-bold mb-6">Current Needs</h2>

					{#if needsChirho.length > 0}
						<div class="space-y-4">
							{#each needsChirho as needChirho}
								{@const priorityBadgeChirho = getPriorityBadgeChirho(needChirho.priorityChirho)}
								{@const progressChirho = getProgressPercentChirho(needChirho.amountRaisedChirho, needChirho.amountNeededChirho)}
								<div class="bg-slate-900/50 border border-slate-600 rounded-xl p-6 hover:border-rose-500/30 transition-colors">
									<div class="flex items-start justify-between mb-4">
										<div class="flex items-center gap-3">
											<span class="text-3xl">{getCategoryIconChirho(needChirho.categoryChirho)}</span>
											<div>
												<h3 class="font-bold text-lg">{needChirho.titleChirho}</h3>
												<span class="text-slate-400 text-sm capitalize">{needChirho.categoryChirho}</span>
											</div>
										</div>
										<span class="px-2 py-1 rounded-full text-xs font-medium border {priorityBadgeChirho.classChirho}">
											{priorityBadgeChirho.textChirho}
										</span>
									</div>

									<!-- Progress bar -->
									<div class="mb-3">
										<div class="flex justify-between text-sm mb-1">
											<span class="text-slate-400">Progress</span>
											<span class="text-white font-medium">{progressChirho}%</span>
										</div>
										<div class="h-3 bg-slate-700 rounded-full overflow-hidden">
											<div
												class="h-full bg-gradient-to-r from-rose-500 to-teal-500 rounded-full transition-all duration-500"
												style="width: {progressChirho}%"
											></div>
										</div>
									</div>

									<div class="flex justify-between items-center">
										<div class="text-sm">
											<span class="text-teal-400 font-bold">{formatCurrencyChirho(needChirho.amountRaisedChirho, needChirho.currencyChirho)}</span>
											<span class="text-slate-400"> raised of </span>
											<span class="text-white font-bold">{formatCurrencyChirho(needChirho.amountNeededChirho, needChirho.currencyChirho)}</span>
										</div>
										<a
											href="https://kingdominvest.ing/need/{needChirho.idChirho}"
											class="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
										>
											Donate
										</a>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-center py-12">
							<span class="text-5xl mb-4 block opacity-50">✓</span>
							<p class="text-slate-400">All current needs are being met. Thank you!</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Contact Card -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="font-bold text-lg mb-4">Get Involved</h3>
					<div class="space-y-3">
						<a
							href="https://kingdominvest.ing"
							class="flex items-center gap-3 w-full bg-gradient-to-r from-rose-500 to-teal-500 text-white py-3 px-4 rounded-lg font-bold hover:opacity-90 transition-opacity justify-center"
						>
							💝 Support This Orphanage
						</a>
						<a
							href="/contact-fe"
							class="flex items-center gap-3 w-full bg-slate-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-600 transition-colors justify-center"
						>
							✉️ Contact Us
						</a>
					</div>
				</div>

				<!-- Quick Facts -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="font-bold text-lg mb-4">Quick Facts</h3>
					<ul class="space-y-4">
						<li class="flex items-start gap-3">
							<span class="text-xl">📍</span>
							<div>
								<div class="text-slate-400 text-sm">Location</div>
								<div class="font-medium">{orphanageChirho.regionChirho || orphanageChirho.countryChirho}</div>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-xl">👶</span>
							<div>
								<div class="text-slate-400 text-sm">Children in Care</div>
								<div class="font-medium">{childrenCountChirho} children</div>
							</div>
						</li>
						<li class="flex items-start gap-3">
							<span class="text-xl">📅</span>
							<div>
								<div class="text-slate-400 text-sm">Joined Platform</div>
								<div class="font-medium">
									{new Date(orphanageChirho.createdAtChirho).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long'
									})}
								</div>
							</div>
						</li>
					</ul>
				</div>

				<!-- Safety Notice -->
				<div class="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
					<h3 class="font-bold text-teal-400 mb-3">🛡️ Child Safety</h3>
					<p class="text-slate-300 text-sm">
						We protect children's privacy. Individual child profiles are not publicly visible.
						All communications are moderated for safety.
					</p>
					<a href="/privacy-fe" class="text-teal-400 text-sm hover:underline mt-2 inline-block">
						Learn about our privacy practices →
					</a>
				</div>

				<!-- Report -->
				<div class="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
					<h3 class="font-bold text-amber-400 mb-3">⚠️ Report a Concern</h3>
					<p class="text-slate-400 text-sm mb-4">
						If you have concerns about this orphanage or child safety, please let us know.
					</p>
					<a
						href="/feedback-chirho?type=safety_concern&orphanage={orphanageChirho.idChirho}"
						class="text-amber-400 text-sm hover:underline"
					>
						Report a concern →
					</a>
				</div>
			</div>
		</div>

		<!-- Scripture -->
		<div class="mt-16 text-center">
			<blockquote class="text-slate-400 italic">
				"Defend the weak and the fatherless; uphold the cause of the poor and the oppressed."
				<cite class="block mt-2 text-rose-400 not-italic">— Psalm 82:3</cite>
			</blockquote>
		</div>
	</div>
</section>
