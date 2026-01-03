<!-- For God so loved the world, that He gave His only begotten Son,
     that all who believe in Him should not perish but have everlasting life. — John 3:16 -->

<script lang="ts">
	let { data } = $props();

	const featuredOrphanagesChirho = $derived(data.featuredOrphanagesChirho || []);
	const urgentNeedsChirho = $derived(data.urgentNeedsChirho || []);
	const statsChirho = $derived(data.statsChirho || { orphanagesChirho: 0, childrenChirho: 0, needsChirho: 0 });

	function getCategoryIconChirho(categoryChirho: string) {
		const iconsChirho: Record<string, string> = {
			food: '🍚', medical: '💊', education: '📚', clothing: '👕',
			infrastructure: '🏗️', staff: '👨‍👩‍👧', utilities: '💡', transportation: '🚐', other: '📦'
		};
		return iconsChirho[categoryChirho] || '📦';
	}

	function formatCurrencyChirho(amountChirho: number, currencyChirho: string) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency', currency: currencyChirho || 'USD',
			minimumFractionDigits: 0, maximumFractionDigits: 0
		}).format(amountChirho);
	}

	function getProgressChirho(raisedChirho: number, neededChirho: number) {
		if (neededChirho === 0) return 100;
		return Math.min(100, Math.round((raisedChirho / neededChirho) * 100));
	}

	const journeyStepsChirho = [
		{
			numberChirho: '1',
			titleChirho: 'OpenOrphanage',
			subtitleChirho: 'Transparent Care',
			descChirho: 'Orphanages administer care transparently, tracking needs and reporting to donors in real-time.',
			urlChirho: 'https://openorphanage.org',
			colorChirho: 'from-rose-500 to-pink-600',
			imageChirho: '/journey-openorphanage-chirho.png',
			currentChirho: true
		},
		{
			numberChirho: '2',
			titleChirho: 'MakingFriends',
			subtitleChirho: 'Sponsorship & Discipleship',
			descChirho: 'Children receive sponsors who provide support, prayer, and connection through age-appropriate discipleship.',
			urlChirho: 'https://makingfriends.faith',
			colorChirho: 'from-purple-500 to-violet-600',
			imageChirho: '/journey-makingfriends-chirho.png'
		},
		{
			numberChirho: '3',
			titleChirho: 'SonshineCoders',
			subtitleChirho: 'Education & Skills',
			descChirho: 'As children mature, they learn valuable technology skills through Christ-centered coding education.',
			urlChirho: 'https://sonshinecoders.org',
			colorChirho: 'from-amber-500 to-orange-600',
			imageChirho: '/journey-sonshinecoders-chirho.png'
		},
		{
			numberChirho: '4',
			titleChirho: 'Koinainia',
			subtitleChirho: 'Employment',
			descChirho: 'Graduates find meaningful work through the faith-forward AI integrator marketplace.',
			urlChirho: 'https://koinainia.com',
			colorChirho: 'from-green-500 to-emerald-600',
			imageChirho: '/journey-koinainia-chirho.png'
		},
		{
			numberChirho: '5',
			titleChirho: 'Perffection',
			subtitleChirho: 'Tools for Excellence',
			descChirho: 'Professional tools help them build businesses and serve clients with excellence.',
			urlChirho: 'https://perffection.com',
			colorChirho: 'from-blue-500 to-cyan-600',
			imageChirho: '/journey-perffection-chirho.png'
		}
	];

	const featuresChirho = [
		{
			imageChirho: '/feature-transparency-chirho.png',
			titleChirho: 'Radical Transparency',
			descChirho: 'Every donation tracked. Every need visible. Every outcome reported. Donors see exactly where funds go.'
		},
		{
			imageChirho: '/feature-dashboard-chirho.png',
			titleChirho: 'Real-Time Dashboard',
			descChirho: 'Orphanage administrators manage children, resources, and staff with comprehensive digital tools.'
		},
		{
			imageChirho: '/feature-ecosystem-chirho.png',
			titleChirho: 'Integrated Ecosystem',
			descChirho: 'Seamlessly connects with KingdomInvest.ing for donations and MakingFriends.faith for sponsorships.'
		},
		{
			imageChirho: '/feature-protection-chirho.png',
			titleChirho: 'Child Protection',
			descChirho: 'Privacy-first design protects children while enabling meaningful sponsor connections.'
		},
		{
			imageChirho: '/feature-tracking-chirho.png',
			titleChirho: 'Outcome Tracking',
			descChirho: 'Follow each child\'s journey from care through education to employment and independence.'
		},
		{
			imageChirho: '/feature-verified-chirho.png',
			titleChirho: 'Verified Orphanages',
			descChirho: 'FaithStack Trust Network verification ensures legitimacy and accountability.'
		}
	];
</script>

<svelte:head>
	<title>OpenOrphanage - Transparent Global Orphan Care Administration</title>
	<meta name="description" content="Transparent orphanage administration platform. Track needs, manage resources, and report to donors. Part of the complete journey from care to career." />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-animated">
	<!-- Background image with overlay -->
	<div class="absolute inset-0">
		<img src="/hero-bg-gradient-chirho.png" alt="" class="w-full h-full object-cover opacity-40" aria-hidden="true" />
		<div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950"></div>
	</div>
	<!-- Animated background -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
	</div>

	<div class="relative z-10 max-w-5xl mx-auto px-4 text-center">
		<!-- Logo -->
		<div class="mb-8 flex justify-center">
			<div class="relative">
				<div class="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl glow-rose ring-2 ring-rose-500/30">
					<img src="/logo-icon-chirho.png" alt="OpenOrphanage" class="w-full h-full object-cover" />
				</div>
				<div class="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full animate-pulse flex items-center justify-center shadow-lg">
					<span class="text-white text-sm font-bold">✝</span>
				</div>
			</div>
		</div>

		<h1 class="text-5xl md:text-7xl font-black mb-6">
			<span class="text-gradient-compassion">Open</span><span class="text-white">Orphanage</span>
		</h1>

		<p class="text-xl md:text-2xl text-slate-300 mb-4">
			Transparent Global Orphan Care Administration
		</p>

		<p class="text-lg text-slate-400 mb-8 max-w-3xl mx-auto">
			A platform for orphanages to manage care transparently, integrate with donors through
			<a href="https://kingdominvest.ing" class="text-rose-400 hover:text-rose-300">KingdomInvest.ing</a>,
			and walk with children on their complete journey to flourishing.
		</p>

		<div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
			<a href="/dashboard-chirho" class="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
				Register Orphanage
			</a>
			<a href="https://kingdominvest.ing/campaigns-chirho?category=Compassion" class="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700">
				Support Orphanages
			</a>
		</div>

		<!-- Live Stats -->
		<div class="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
			<div class="text-center">
				<div class="text-4xl font-bold text-rose-400 mb-1">{statsChirho.orphanagesChirho}</div>
				<div class="text-slate-400 text-sm">Orphanages</div>
			</div>
			<div class="text-center">
				<div class="text-4xl font-bold text-teal-400 mb-1">{statsChirho.childrenChirho}</div>
				<div class="text-slate-400 text-sm">Children</div>
			</div>
			<div class="text-center">
				<div class="text-4xl font-bold text-amber-400 mb-1">{statsChirho.needsChirho}</div>
				<div class="text-slate-400 text-sm">Active Needs</div>
			</div>
		</div>

		<!-- Scripture -->
		<blockquote class="text-slate-400 italic max-w-2xl mx-auto">
			"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."
			<cite class="block mt-2 text-rose-400 not-italic font-medium">— James 1:27</cite>
		</blockquote>
	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
		</svg>
	</div>
</section>

<!-- The Complete Journey -->
<section class="py-24 bg-slate-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<div class="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 px-4 py-2 rounded-full text-sm mb-6">
				<span class="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
				The Complete Journey — In Jesus' Name
			</div>

			<h2 class="text-3xl md:text-4xl font-bold mb-4">
				From <span class="text-gradient-compassion">Care</span> to <span class="text-gradient-trust">Career</span>
			</h2>

			<p class="text-slate-400 text-lg max-w-3xl mx-auto">
				OpenOrphanage is part of a holistic FaithStack ecosystem that walks with children from vulnerability to flourishing — God willing and if we live, all things.
			</p>
		</div>

		<!-- Journey Timeline -->
		<div class="relative">
			<!-- Connection line -->
			<div class="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 via-amber-500 via-green-500 to-blue-500 opacity-30"></div>

			<div class="grid lg:grid-cols-5 gap-6">
				{#each journeyStepsChirho as step}
					<a
						href={step.urlChirho}
						class="group relative bg-slate-800/50 rounded-2xl overflow-hidden border transition-all card-hover {step.currentChirho ? 'border-rose-500 glow-rose' : 'border-slate-700 hover:border-slate-600'}"
					>
						<!-- Step number badge -->
						<div class="absolute top-3 left-3 z-10 w-8 h-8 bg-gradient-to-br {step.colorChirho} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
							{step.numberChirho}
						</div>

						<!-- AI-generated icon image -->
						<div class="relative h-32 overflow-hidden">
							<img
								src={step.imageChirho}
								alt=""
								class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
								aria-hidden="true"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/50 to-transparent"></div>
						</div>

						<div class="p-5 -mt-8 relative z-10">
							<h3 class="font-bold text-lg mb-1 group-hover:text-rose-400 transition-colors">{step.titleChirho}</h3>
							<p class="text-sm text-slate-400 mb-2">{step.subtitleChirho}</p>
							<p class="text-xs text-slate-500 line-clamp-2">{step.descChirho}</p>

							{#if step.currentChirho}
								<div class="mt-3">
									<span class="text-xs bg-rose-500/20 text-rose-400 px-2 py-1 rounded-full border border-rose-500/30">You are here</span>
								</div>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>

		<div class="mt-12 text-center">
			<p class="text-slate-400 text-sm">
				Every step builds on the last. From care → sponsorship → education → employment → independence.
			</p>
		</div>
	</div>
</section>

<!-- Urgent Needs -->
{#if urgentNeedsChirho.length > 0}
<section class="py-24 bg-gradient-to-b from-slate-900 to-slate-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between mb-12">
			<div>
				<span class="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1 text-red-400 text-sm mb-4">
					🚨 Urgent
				</span>
				<h2 class="text-3xl md:text-4xl font-bold">
					<span class="text-gradient-compassion">Immediate</span> Needs
				</h2>
			</div>
			<a href="/orphanages-chirho" class="hidden md:inline-flex text-rose-400 hover:text-rose-300">
				View all →
			</a>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each urgentNeedsChirho as needChirho}
				{@const progressChirho = getProgressChirho(needChirho.amountRaisedChirho, needChirho.amountNeededChirho)}
				<div class="bg-slate-800/50 border border-red-500/30 rounded-2xl p-6 card-hover">
					<div class="flex items-center gap-3 mb-4">
						<span class="text-2xl">{getCategoryIconChirho(needChirho.categoryChirho)}</span>
						<div>
							<h3 class="font-bold">{needChirho.titleChirho}</h3>
							<p class="text-slate-500 text-sm">{needChirho.orphanageNameChirho}</p>
						</div>
					</div>
					<div class="mb-4">
						<div class="flex justify-between text-sm mb-1">
							<span class="text-slate-400">{progressChirho}% funded</span>
							<span class="text-rose-400 font-medium">{formatCurrencyChirho(needChirho.amountNeededChirho - needChirho.amountRaisedChirho, needChirho.currencyChirho)} needed</span>
						</div>
						<div class="h-2 bg-slate-700 rounded-full overflow-hidden">
							<div class="h-full bg-gradient-to-r from-rose-500 to-teal-500 rounded-full" style="width: {progressChirho}%"></div>
						</div>
					</div>
					<a href="https://kingdominvest.ing/need/{needChirho.idChirho}" class="block text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
						Donate Now
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>
{/if}

<!-- Featured Orphanages -->
{#if featuredOrphanagesChirho.length > 0}
<section class="py-24 bg-slate-950 relative overflow-hidden">
	<!-- Background image -->
	<div class="absolute inset-0 opacity-5">
		<img src="/hero-children-chirho.png" alt="" class="w-full h-full object-cover" aria-hidden="true" />
	</div>
	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">
				<span class="text-gradient-trust">Featured</span> Orphanages
			</h2>
			<p class="text-slate-400 text-lg">Verified organizations making a difference</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			{#each featuredOrphanagesChirho as orphanageChirho}
				<a href="/orphanages-chirho/{orphanageChirho.idChirho}" class="group bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-rose-500/50 transition-all card-hover">
					<div class="aspect-video bg-gradient-to-br from-rose-500/20 to-teal-500/20 relative">
						{#if orphanageChirho.primaryPhotoUrlChirho}
							<img src={orphanageChirho.primaryPhotoUrlChirho} alt={orphanageChirho.nameChirho} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
						{:else}
							<div class="w-full h-full flex items-center justify-center"><span class="text-5xl opacity-50">🏠</span></div>
						{/if}
						<div class="absolute top-3 right-3">
							<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">✓ Verified</span>
						</div>
					</div>
					<div class="p-6">
						<h3 class="font-bold text-lg mb-2 group-hover:text-rose-400 transition-colors">{orphanageChirho.nameChirho}</h3>
						<p class="text-slate-400 text-sm mb-2">📍 {orphanageChirho.regionChirho ? `${orphanageChirho.regionChirho}, ` : ''}{orphanageChirho.countryChirho}</p>
						{#if orphanageChirho.shortDescriptionChirho}
							<p class="text-slate-300 text-sm line-clamp-2">{orphanageChirho.shortDescriptionChirho}</p>
						{/if}
					</div>
				</a>
			{/each}
		</div>

		<div class="text-center mt-12">
			<a href="/orphanages-chirho" class="inline-flex bg-slate-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors border border-slate-700">
				Browse All Orphanages →
			</a>
		</div>
	</div>
</section>
{/if}

<!-- Features -->
<section class="py-24 bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold mb-4">Transparent Administration</h2>
			<p class="text-slate-400 text-lg max-w-2xl mx-auto">
				Tools designed for orphanages to serve children excellently while building trust with donors.
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each featuresChirho as feature}
				<div class="group bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700 hover:border-rose-500/50 transition-all card-hover">
					<!-- AI-generated feature image -->
					<div class="relative h-40 overflow-hidden">
						<img
							src={feature.imageChirho}
							alt=""
							class="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
							aria-hidden="true"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/30 to-transparent"></div>
					</div>
					<div class="p-6 -mt-6 relative z-10">
						<h3 class="font-semibold text-lg mb-2 group-hover:text-rose-400 transition-colors">{feature.titleChirho}</h3>
						<p class="text-slate-400 text-sm">{feature.descChirho}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- For Orphanages -->
<section class="py-24 bg-slate-900">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div>
				<div class="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm mb-6">
					<span class="w-2 h-2 bg-teal-400 rounded-full"></span>
					For Orphanages
				</div>

				<h2 class="text-3xl md:text-4xl font-bold mb-6">
					Administer Care with <span class="text-gradient-trust">Excellence</span>
				</h2>

				<p class="text-slate-300 text-lg mb-6">
					OpenOrphanage gives you the tools to manage your children, staff, and resources while automatically reporting to donors and connecting with the FaithStack ecosystem.
				</p>

				<ul class="space-y-4 mb-8">
					<li class="flex items-start gap-3">
						<span class="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
							<span class="text-teal-400 text-sm">✓</span>
						</span>
						<div>
							<span class="font-medium">Child Record Management</span>
							<p class="text-slate-400 text-sm">Track health, education, and development for each child</p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
							<span class="text-teal-400 text-sm">✓</span>
						</span>
						<div>
							<span class="font-medium">Needs Publishing</span>
							<p class="text-slate-400 text-sm">Post needs directly to KingdomInvest.ing for donor support</p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
							<span class="text-teal-400 text-sm">✓</span>
						</span>
						<div>
							<span class="font-medium">Financial Transparency</span>
							<p class="text-slate-400 text-sm">Full audit trail for every transaction</p>
						</div>
					</li>
					<li class="flex items-start gap-3">
						<span class="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
							<span class="text-teal-400 text-sm">✓</span>
						</span>
						<div>
							<span class="font-medium">Transition Planning</span>
							<p class="text-slate-400 text-sm">Connect aging-out youth with SonshineCoders for education</p>
						</div>
					</li>
				</ul>

				<a href="/dashboard-chirho" class="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
					Register Your Orphanage
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</a>
			</div>

			<div class="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
				<h3 class="font-bold text-lg mb-6 text-center">Dashboard Preview</h3>

				<!-- Dashboard image -->
				<div class="rounded-xl overflow-hidden mb-6 border border-slate-600 shadow-xl">
					<img src="/dashboard-preview-chirho.png" alt="OpenOrphanage Dashboard Preview" class="w-full h-auto" />
				</div>

				<!-- Mock dashboard -->
				<div class="space-y-4">
					<div class="bg-slate-900/50 rounded-lg p-4">
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm text-slate-400">Children in Care</span>
							<span class="text-2xl font-bold text-white">47</span>
						</div>
						<div class="h-2 bg-slate-700 rounded-full">
							<div class="h-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full w-3/4"></div>
						</div>
					</div>

					<div class="bg-slate-900/50 rounded-lg p-4">
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm text-slate-400">Active Sponsorships</span>
							<span class="text-2xl font-bold text-white">31</span>
						</div>
						<div class="h-2 bg-slate-700 rounded-full">
							<div class="h-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full w-2/3"></div>
						</div>
					</div>

					<div class="bg-slate-900/50 rounded-lg p-4">
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm text-slate-400">Monthly Donations</span>
							<span class="text-2xl font-bold text-teal-400">$12,450</span>
						</div>
						<div class="h-2 bg-slate-700 rounded-full">
							<div class="h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full w-4/5"></div>
						</div>
					</div>

					<div class="grid grid-cols-3 gap-2 mt-4">
						<div class="bg-rose-500/20 rounded-lg p-3 text-center">
							<span class="text-rose-400 text-xl font-bold">3</span>
							<p class="text-xs text-slate-400">Urgent Needs</p>
						</div>
						<div class="bg-amber-500/20 rounded-lg p-3 text-center">
							<span class="text-amber-400 text-xl font-bold">5</span>
							<p class="text-xs text-slate-400">Transitioning</p>
						</div>
						<div class="bg-green-500/20 rounded-lg p-3 text-center">
							<span class="text-green-400 text-xl font-bold">8</span>
							<p class="text-xs text-slate-400">In Training</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- For Donors -->
<section class="py-24 relative overflow-hidden">
	<!-- Full background image with overlay -->
	<div class="absolute inset-0">
		<img src="/donor-bg-children-chirho.png" alt="" class="w-full h-full object-cover" aria-hidden="true" />
		<div class="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/85 to-slate-950/95"></div>
	</div>

	<div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<div class="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">
				<span class="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
				For Donors & Sponsors
			</div>

			<h2 class="text-3xl md:text-5xl font-bold mb-4">
				See Your <span class="text-gradient-compassion">Impact</span>
			</h2>

			<p class="text-slate-300 text-lg max-w-2xl mx-auto">
				Through KingdomInvest.ing, you can support verified orphanages with complete transparency. Watch your giving make a real difference.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-8">
			<!-- Browse Panel -->
			<div class="group relative overflow-hidden rounded-3xl aspect-[4/5] card-hover">
				<img src="/panel-search-chirho.png" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
				<div class="absolute inset-0 flex flex-col justify-end p-6">
					<div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
						<svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<h3 class="font-bold text-xl mb-2 text-white">Browse Verified Orphanages</h3>
					<p class="text-slate-300 text-sm leading-relaxed">Only orphanages verified through FaithStack Trust Network appear on our platform.</p>
				</div>
			</div>

			<!-- Give Panel -->
			<div class="group relative overflow-hidden rounded-3xl aspect-[4/5] card-hover">
				<img src="/panel-give-chirho.png" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
				<div class="absolute inset-0 flex flex-col justify-end p-6">
					<div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
						<svg class="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
						</svg>
					</div>
					<h3 class="font-bold text-xl mb-2 text-white">Give or Sponsor</h3>
					<p class="text-slate-300 text-sm leading-relaxed">Give to specific needs or sponsor a child through MakingFriends.faith for ongoing support.</p>
				</div>
			</div>

			<!-- Track Panel -->
			<div class="group relative overflow-hidden rounded-3xl aspect-[4/5] card-hover">
				<img src="/panel-impact-chirho.png" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
				<div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
				<div class="absolute inset-0 flex flex-col justify-end p-6">
					<div class="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
						<svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
						</svg>
					</div>
					<h3 class="font-bold text-xl mb-2 text-white">Track Impact</h3>
					<p class="text-slate-300 text-sm leading-relaxed">Receive regular updates showing exactly how your giving helps children flourish.</p>
				</div>
			</div>
		</div>

		<div class="mt-12 text-center">
			<a href="https://kingdominvest.ing/campaigns-chirho?category=Compassion" class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25">
				Support Orphanages on KingdomInvest.ing
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
				</svg>
			</a>
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-24 bg-slate-900 relative overflow-hidden">
	<!-- Journey background image -->
	<div class="absolute inset-0">
		<img src="/journey-sunrise-chirho.png" alt="" class="w-full h-full object-cover opacity-20" aria-hidden="true" />
		<div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900"></div>
	</div>

	<div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<h2 class="text-3xl md:text-4xl font-bold mb-6">
			Join the <span class="text-gradient-compassion">Journey</span>
		</h2>

		<p class="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
			Whether you run an orphanage seeking better tools, or you want to support children with transparency and confidence — there's a place for you.
		</p>

		<blockquote class="text-slate-400 italic mb-8 max-w-xl mx-auto">
			"I will not leave you as orphans; I will come to you."
			<cite class="block mt-2 text-rose-400 not-italic font-medium">— Jesus (John 14:18)</cite>
		</blockquote>

		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/dashboard-chirho" class="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
				Register Orphanage
			</a>
			<a href="https://kingdominvest.ing" class="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700">
				Support on KingdomInvest.ing
			</a>
		</div>

		<p class="mt-8 text-slate-500 text-sm">
			In Jesus' Name — God willing and if we live, all things.
		</p>
	</div>
</section>
