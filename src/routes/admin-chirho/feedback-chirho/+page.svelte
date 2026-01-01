<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let { data } = $props();

	const feedbackListChirho = $derived(data.feedbackListChirho);
	const statusCountsChirho = $derived(data.statusCountsChirho);
	const paginationChirho = $derived(data.paginationChirho);
	const filtersChirho = $derived(data.filtersChirho);

	function formatDateChirho(dateStrChirho: string) {
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusBadgeChirho(statusChirho: string) {
		const badgesChirho: Record<string, { classChirho: string; textChirho: string }> = {
			pending: { classChirho: 'bg-amber-500/20 text-amber-400 border-amber-500/30', textChirho: 'Pending' },
			reviewed: { classChirho: 'bg-blue-500/20 text-blue-400 border-blue-500/30', textChirho: 'Reviewed' },
			resolved: { classChirho: 'bg-green-500/20 text-green-400 border-green-500/30', textChirho: 'Resolved' },
			dismissed: { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', textChirho: 'Dismissed' }
		};
		return badgesChirho[statusChirho] || badgesChirho.pending;
	}

	function getTypeBadgeChirho(typeChirho: string) {
		const badgesChirho: Record<string, { classChirho: string; iconChirho: string }> = {
			bug: { classChirho: 'bg-red-500/20 text-red-400', iconChirho: '🐛' },
			feature_request: { classChirho: 'bg-purple-500/20 text-purple-400', iconChirho: '💡' },
			safety_concern: { classChirho: 'bg-amber-500/20 text-amber-400', iconChirho: '🚨' },
			general: { classChirho: 'bg-teal-500/20 text-teal-400', iconChirho: '💬' }
		};
		return badgesChirho[typeChirho] || badgesChirho.general;
	}
</script>

<svelte:head>
	<title>Manage Feedback — Admin — OpenOrphanage</title>
</svelte:head>

<div class="max-w-7xl">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold mb-2">Feedback Management</h1>
			<p class="text-slate-400">Review and respond to user feedback</p>
		</div>
	</div>

	<!-- Status Tabs -->
	<div class="flex gap-2 mb-6 flex-wrap">
		<a
			href="/admin-chirho/feedback-chirho"
			class="px-4 py-2 rounded-lg font-medium transition-colors {!filtersChirho.statusChirho
				? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			All ({Object.values(statusCountsChirho).reduce((a, b) => a + b, 0)})
		</a>
		<a
			href="/admin-chirho/feedback-chirho?status=pending"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho.statusChirho === 'pending'
				? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			Pending ({statusCountsChirho.pending || 0})
		</a>
		<a
			href="/admin-chirho/feedback-chirho?status=reviewed"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho.statusChirho === 'reviewed'
				? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			Reviewed ({statusCountsChirho.reviewed || 0})
		</a>
		<a
			href="/admin-chirho/feedback-chirho?status=resolved"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho.statusChirho === 'resolved'
				? 'bg-green-500/20 text-green-400 border border-green-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			Resolved ({statusCountsChirho.resolved || 0})
		</a>
	</div>

	<!-- Type Filter -->
	<div class="flex gap-2 mb-8 flex-wrap">
		<span class="text-slate-500 py-2">Filter by type:</span>
		<a
			href="/admin-chirho/feedback-chirho{filtersChirho.statusChirho ? `?status=${filtersChirho.statusChirho}` : ''}"
			class="px-3 py-1 rounded-full text-sm transition-colors {!filtersChirho.typeChirho
				? 'bg-slate-600 text-white'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			All
		</a>
		{#each ['bug', 'feature_request', 'safety_concern', 'general'] as typeChirho}
			{@const typeBadgeChirho = getTypeBadgeChirho(typeChirho)}
			<a
				href="/admin-chirho/feedback-chirho?type={typeChirho}{filtersChirho.statusChirho ? `&status=${filtersChirho.statusChirho}` : ''}"
				class="px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 {filtersChirho.typeChirho === typeChirho
					? typeBadgeChirho.classChirho
					: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
			>
				<span>{typeBadgeChirho.iconChirho}</span>
				<span class="capitalize">{typeChirho.replace('_', ' ')}</span>
			</a>
		{/each}
	</div>

	<!-- Feedback List -->
	{#if feedbackListChirho.length > 0}
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
			<table class="w-full">
				<thead class="bg-slate-900/50">
					<tr>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Type</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Content</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">From</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Date</th>
						<th class="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					{#each feedbackListChirho as feedbackItemChirho}
						{@const typeBadgeChirho = getTypeBadgeChirho(feedbackItemChirho.typeChirho)}
						{@const statusBadgeChirho = getStatusBadgeChirho(feedbackItemChirho.statusChirho)}
						<tr class="hover:bg-slate-800/50 transition-colors">
							<td class="px-6 py-4">
								<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm {typeBadgeChirho.classChirho}">
									<span>{typeBadgeChirho.iconChirho}</span>
									<span class="capitalize">{feedbackItemChirho.typeChirho.replace('_', ' ')}</span>
								</span>
							</td>
							<td class="px-6 py-4">
								<p class="text-sm line-clamp-2 max-w-xs">
									{feedbackItemChirho.contentPreviewChirho || 'No content'}
								</p>
								{#if feedbackItemChirho.ratingChirho}
									<p class="text-xs text-amber-400 mt-1">
										{'⭐'.repeat(feedbackItemChirho.ratingChirho)}
									</p>
								{/if}
							</td>
							<td class="px-6 py-4">
								{#if feedbackItemChirho.isAnonymousChirho}
									<span class="text-slate-500 italic text-sm">Anonymous</span>
								{:else}
									<span class="text-sm">{feedbackItemChirho.emailChirho || feedbackItemChirho.userEmailChirho || 'Unknown'}</span>
								{/if}
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium border {statusBadgeChirho.classChirho}">
									{statusBadgeChirho.textChirho}
								</span>
							</td>
							<td class="px-6 py-4 text-sm text-slate-400">
								{formatDateChirho(feedbackItemChirho.createdAtChirho)}
							</td>
							<td class="px-6 py-4 text-right">
								<a
									href="/admin-chirho/feedback-chirho/{feedbackItemChirho.idChirho}"
									class="text-amber-400 hover:text-amber-300 text-sm font-medium"
								>
									View →
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if paginationChirho.totalPagesChirho > 1}
			<div class="flex justify-center gap-2 mt-8">
				{#if paginationChirho.currentPageChirho > 1}
					<a
						href="?page={paginationChirho.currentPageChirho - 1}&status={filtersChirho.statusChirho}&type={filtersChirho.typeChirho}"
						class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-amber-500/50 transition-colors"
					>
						← Previous
					</a>
				{/if}
				<span class="px-4 py-2 text-slate-400">
					Page {paginationChirho.currentPageChirho} of {paginationChirho.totalPagesChirho}
				</span>
				{#if paginationChirho.currentPageChirho < paginationChirho.totalPagesChirho}
					<a
						href="?page={paginationChirho.currentPageChirho + 1}&status={filtersChirho.statusChirho}&type={filtersChirho.typeChirho}"
						class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-amber-500/50 transition-colors"
					>
						Next →
					</a>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
			<span class="text-5xl mb-4 block">📭</span>
			<h3 class="text-xl font-bold mb-2">No feedback found</h3>
			<p class="text-slate-400">
				{#if filtersChirho.statusChirho || filtersChirho.typeChirho}
					Try adjusting your filters
				{:else}
					No feedback has been submitted yet
				{/if}
			</p>
		</div>
	{/if}
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
