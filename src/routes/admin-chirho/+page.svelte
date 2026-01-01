<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let { data } = $props();

	const statsChirho = $derived(data.statsChirho);
	const recentFeedbackChirho = $derived(data.recentFeedbackChirho);
	const pendingVerificationChirho = $derived(data.pendingVerificationChirho);

	function formatDateChirho(dateStrChirho: string) {
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getTypeColorChirho(typeChirho: string) {
		const colorsChirho: Record<string, string> = {
			bug: 'text-red-400',
			feature_request: 'text-purple-400',
			safety_concern: 'text-amber-400',
			general: 'text-teal-400'
		};
		return colorsChirho[typeChirho] || 'text-slate-400';
	}
</script>

<svelte:head>
	<title>Admin Dashboard — OpenOrphanage</title>
</svelte:head>

<div class="max-w-7xl">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
		<p class="text-slate-400">Overview of the OpenOrphanage platform</p>
	</div>

	<!-- Stats Grid -->
	<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
					<span class="text-2xl">🏠</span>
				</div>
				<div>
					<p class="text-3xl font-bold text-rose-400">{statsChirho.orphanagesChirho}</p>
					<p class="text-slate-400 text-sm">Orphanages</p>
				</div>
			</div>
			<div class="mt-4 pt-4 border-t border-slate-700 text-sm">
				<span class="text-green-400">{statsChirho.verifiedOrphanagesChirho}</span>
				<span class="text-slate-500"> verified</span>
			</div>
		</div>

		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
					<span class="text-2xl">📋</span>
				</div>
				<div>
					<p class="text-3xl font-bold text-teal-400">{statsChirho.activeNeedsChirho}</p>
					<p class="text-slate-400 text-sm">Active Needs</p>
				</div>
			</div>
			<div class="mt-4 pt-4 border-t border-slate-700 text-sm">
				<span class="text-red-400">{statsChirho.urgentNeedsChirho}</span>
				<span class="text-slate-500"> urgent</span>
			</div>
		</div>

		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
					<span class="text-2xl">💬</span>
				</div>
				<div>
					<p class="text-3xl font-bold text-amber-400">{statsChirho.pendingFeedbackChirho}</p>
					<p class="text-slate-400 text-sm">Pending Feedback</p>
				</div>
			</div>
			<div class="mt-4 pt-4 border-t border-slate-700 text-sm">
				<a href="/admin-chirho/feedback-chirho" class="text-amber-400 hover:underline">Review now →</a>
			</div>
		</div>

		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
					<span class="text-2xl">👥</span>
				</div>
				<div>
					<p class="text-3xl font-bold text-purple-400">{statsChirho.usersChirho}</p>
					<p class="text-slate-400 text-sm">Total Users</p>
				</div>
			</div>
			<div class="mt-4 pt-4 border-t border-slate-700 text-sm">
				<a href="/admin-chirho/users-chirho" class="text-purple-400 hover:underline">Manage users →</a>
			</div>
		</div>
	</div>

	<div class="grid lg:grid-cols-2 gap-8">
		<!-- Pending Verification -->
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold">Pending Verification</h2>
				<a href="/admin-chirho/orphanages-chirho?status=pending" class="text-amber-400 text-sm hover:underline">
					View all →
				</a>
			</div>

			{#if pendingVerificationChirho.length > 0}
				<div class="space-y-4">
					{#each pendingVerificationChirho as orphanageChirho}
						<a
							href="/admin-chirho/orphanages-chirho/{orphanageChirho.idChirho}"
							class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
						>
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
									<span class="text-lg">🏠</span>
								</div>
								<div>
									<p class="font-medium">{orphanageChirho.nameChirho}</p>
									<p class="text-slate-500 text-sm">{orphanageChirho.countryChirho}</p>
								</div>
							</div>
							<span class="text-slate-500 text-sm">{formatDateChirho(orphanageChirho.createdAtChirho)}</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="text-center py-8 text-slate-500">
					<p>No orphanages pending verification</p>
				</div>
			{/if}
		</div>

		<!-- Recent Feedback -->
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold">Recent Feedback</h2>
				<a href="/admin-chirho/feedback-chirho" class="text-amber-400 text-sm hover:underline">
					View all →
				</a>
			</div>

			{#if recentFeedbackChirho.length > 0}
				<div class="space-y-4">
					{#each recentFeedbackChirho as feedbackItemChirho}
						<a
							href="/admin-chirho/feedback-chirho/{feedbackItemChirho.idChirho}"
							class="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
						>
							<div class="flex items-center gap-3">
								<div class="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
									{#if feedbackItemChirho.ratingChirho}
										<span class="text-lg">{'⭐'.repeat(Math.min(feedbackItemChirho.ratingChirho, 3))}</span>
									{:else}
										<span class="text-lg">💬</span>
									{/if}
								</div>
								<div>
									<p class="font-medium capitalize {getTypeColorChirho(feedbackItemChirho.typeChirho)}">
										{feedbackItemChirho.typeChirho.replace('_', ' ')}
									</p>
									<p class="text-slate-500 text-sm capitalize">{feedbackItemChirho.statusChirho}</p>
								</div>
							</div>
							<span class="text-slate-500 text-sm">{formatDateChirho(feedbackItemChirho.createdAtChirho)}</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="text-center py-8 text-slate-500">
					<p>No feedback yet</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Quick Actions -->
	<div class="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-8">
		<h2 class="text-xl font-bold mb-6">Quick Actions</h2>
		<div class="grid md:grid-cols-4 gap-4">
			<a
				href="/admin-chirho/orphanages-chirho/new"
				class="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
			>
				<span class="text-2xl">➕</span>
				<span>Add Orphanage</span>
			</a>
			<a
				href="/admin-chirho/needs-chirho/new"
				class="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
			>
				<span class="text-2xl">📋</span>
				<span>Create Need</span>
			</a>
			<a
				href="/admin-chirho/users-chirho"
				class="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
			>
				<span class="text-2xl">👤</span>
				<span>Manage Users</span>
			</a>
			<a
				href="/feedback-chirho"
				class="flex items-center gap-3 p-4 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors"
			>
				<span class="text-2xl">🔍</span>
				<span>View Public Site</span>
			</a>
		</div>
	</div>

	<!-- Scripture -->
	<div class="mt-8 text-center">
		<blockquote class="text-slate-500 italic text-sm">
			"For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."
			<cite class="block mt-1 text-amber-400/70 not-italic">— Ephesians 2:10</cite>
		</blockquote>
	</div>
</div>
