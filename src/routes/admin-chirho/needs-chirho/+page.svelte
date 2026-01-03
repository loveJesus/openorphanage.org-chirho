<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const needsChirho = $derived(data.needsChirho || []);
	const paginationChirho = $derived(data.paginationChirho);
	const filtersChirho = $derived(data.filtersChirho);
	const statusCountsChirho = $derived(data.statusCountsChirho);

	let searchInputChirho = $state('');
	let statusFilterChirho = $state('all');

	// Sync initial values from server
	$effect(() => {
		if (filtersChirho) {
			searchInputChirho = filtersChirho.searchChirho || '';
			statusFilterChirho = filtersChirho.statusChirho || 'all';
		}
	});

	const categoriesChirho = ['food', 'medical', 'education', 'clothing', 'infrastructure', 'staff', 'utilities', 'transportation', 'other'];
	const prioritiesChirho = ['low', 'medium', 'high', 'urgent'];
	const statusesChirho = ['active', 'funded', 'completed', 'cancelled'];

	function applyFiltersChirho() {
		const paramsChirho = new URLSearchParams();
		if (searchInputChirho) paramsChirho.set('search', searchInputChirho);
		if (statusFilterChirho !== 'all') paramsChirho.set('status', statusFilterChirho);
		window.location.href = `/admin-chirho/needs-chirho?${paramsChirho.toString()}`;
	}

	function getCategoryIconChirho(categoryChirho: string) {
		const iconsChirho: Record<string, string> = {
			food: '🍚', medical: '💊', education: '📚', clothing: '👕',
			infrastructure: '🏗️', staff: '👨‍👩‍👧', utilities: '💡', transportation: '🚐', other: '📦'
		};
		return iconsChirho[categoryChirho] || '📦';
	}

	function getPriorityBadgeChirho(priorityChirho: string) {
		switch (priorityChirho) {
			case 'urgent':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			case 'high':
				return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
			case 'medium':
				return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
			default:
				return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
		}
	}

	function getStatusBadgeChirho(statusChirho: string) {
		switch (statusChirho) {
			case 'active':
				return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
			case 'funded':
				return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
			case 'completed':
				return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
			case 'cancelled':
				return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
			default:
				return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
		}
	}

	function formatCurrencyChirho(amountChirho: number | null, currencyChirho: string | null) {
		if (amountChirho === null) return '$0';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyChirho || 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amountChirho);
	}

	function getProgressChirho(raisedChirho: number | null, neededChirho: number | null) {
		if (!neededChirho || neededChirho === 0) return 0;
		return Math.min(100, Math.round(((raisedChirho || 0) / neededChirho) * 100));
	}

	function formatDateChirho(dateStrChirho: string | null) {
		if (!dateStrChirho) return 'N/A';
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Manage Needs | OpenOrphanage Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold">Manage Needs</h1>
			<p class="text-slate-400">Track and manage orphanage needs and fundraising</p>
		</div>
	</div>

	<!-- Status notification -->
	{#if form?.successChirho}
		<div class="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg" role="alert">
			{form.messageChirho}
		</div>
	{/if}
	{#if form?.errorChirho}
		<div class="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg" role="alert">
			{form.errorChirho}
		</div>
	{/if}

	<!-- Status Cards -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-4">
		<button
			onclick={() => { statusFilterChirho = 'all'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'all' ? 'border-rose-500' : 'border-slate-700'}"
		>
			<p class="text-slate-400 text-sm">Total</p>
			<p class="text-2xl font-bold">{statusCountsChirho?.total || 0}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'active'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'active' ? 'border-emerald-500' : 'border-slate-700'}"
		>
			<p class="text-emerald-400 text-sm">Active</p>
			<p class="text-2xl font-bold text-emerald-400">{statusCountsChirho?.active || 0}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'funded'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'funded' ? 'border-teal-500' : 'border-slate-700'}"
		>
			<p class="text-teal-400 text-sm">Funded</p>
			<p class="text-2xl font-bold text-teal-400">{statusCountsChirho?.funded || 0}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'completed'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'completed' ? 'border-blue-500' : 'border-slate-700'}"
		>
			<p class="text-blue-400 text-sm">Completed</p>
			<p class="text-2xl font-bold text-blue-400">{statusCountsChirho?.completed || 0}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'cancelled'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'cancelled' ? 'border-slate-500' : 'border-slate-700'}"
		>
			<p class="text-slate-400 text-sm">Cancelled</p>
			<p class="text-2xl font-bold">{statusCountsChirho?.cancelled || 0}</p>
		</button>
	</div>

	<!-- Search -->
	<div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-grow">
				<label for="search" class="sr-only">Search needs</label>
				<input
					type="text"
					id="search"
					bind:value={searchInputChirho}
					placeholder="Search by title or description..."
					class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
					onkeydown={(e) => e.key === 'Enter' && applyFiltersChirho()}
				/>
			</div>
			<button
				onclick={applyFiltersChirho}
				class="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
			>
				Search
			</button>
		</div>
	</div>

	<!-- Needs Table -->
	<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-900">
					<tr>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Need</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Orphanage</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Priority</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Progress</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Status</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Created</th>
						<th class="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					{#each needsChirho as needChirho (needChirho.idChirho)}
						<tr class="hover:bg-slate-700/50 transition-colors {needChirho.statusChirho === 'cancelled' ? 'opacity-50' : ''}">
							<td class="px-4 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-xl">
										{getCategoryIconChirho(needChirho.categoryChirho)}
									</div>
									<div>
										<p class="font-medium">{needChirho.titleChirho}</p>
										<p class="text-sm text-slate-500 capitalize">{needChirho.categoryChirho}</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-4">
								<a href="/admin-chirho/orphanages-chirho/{needChirho.orphanageIdChirho}" class="text-rose-400 hover:text-rose-300">
									{needChirho.orphanageNameChirho || 'Unknown'}
								</a>
							</td>
							<td class="px-4 py-4">
								<form method="POST" action="?/updatePriority" use:enhance class="inline">
									<input type="hidden" name="needId" value={needChirho.idChirho} />
									<select
										name="priority"
										class="bg-transparent border border-slate-600 rounded-lg px-2 py-1 text-sm {getPriorityBadgeChirho(needChirho.priorityChirho)} focus:outline-none focus:ring-2 focus:ring-rose-500"
										onchange={(e) => e.target.form?.requestSubmit()}
									>
										{#each prioritiesChirho as priorityChirho}
											<option value={priorityChirho} selected={needChirho.priorityChirho === priorityChirho} class="bg-slate-900 text-white">
												{priorityChirho}
											</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="px-4 py-4">
								<div class="w-32">
									<div class="flex justify-between text-xs mb-1">
										<span class="text-slate-400">{formatCurrencyChirho(needChirho.amountRaisedChirho, needChirho.currencyChirho)}</span>
										<span class="text-slate-500">{formatCurrencyChirho(needChirho.amountNeededChirho, needChirho.currencyChirho)}</span>
									</div>
									<div class="h-2 bg-slate-700 rounded-full overflow-hidden">
										<div
											class="h-full bg-gradient-to-r from-rose-500 to-teal-500 transition-all duration-300"
											style="width: {getProgressChirho(needChirho.amountRaisedChirho, needChirho.amountNeededChirho)}%"
										></div>
									</div>
									<p class="text-xs text-slate-500 mt-1">{getProgressChirho(needChirho.amountRaisedChirho, needChirho.amountNeededChirho)}% funded</p>
								</div>
							</td>
							<td class="px-4 py-4">
								<form method="POST" action="?/updateStatus" use:enhance class="inline">
									<input type="hidden" name="needId" value={needChirho.idChirho} />
									<select
										name="status"
										class="bg-transparent border border-slate-600 rounded-lg px-2 py-1 text-sm {getStatusBadgeChirho(needChirho.statusChirho)} focus:outline-none focus:ring-2 focus:ring-rose-500"
										onchange={(e) => e.target.form?.requestSubmit()}
									>
										{#each statusesChirho as statusChirho}
											<option value={statusChirho} selected={needChirho.statusChirho === statusChirho} class="bg-slate-900 text-white">
												{statusChirho}
											</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="px-4 py-4 text-slate-400 text-sm">
								{formatDateChirho(needChirho.createdAtChirho)}
							</td>
							<td class="px-4 py-4">
								<div class="flex items-center justify-end gap-2">
									<!-- View on public site -->
									<a
										href="/orphanages-chirho/{needChirho.orphanageIdChirho}#need-{needChirho.idChirho}"
										class="p-2 text-slate-400 hover:text-white transition-colors"
										title="View on site"
										target="_blank"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>

									<!-- Delete -->
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="needId" value={needChirho.idChirho} />
										<button
											type="submit"
											class="p-2 text-slate-400 hover:text-red-400 transition-colors"
											title="Delete need"
											onclick={(e) => !confirm('Are you sure you want to delete this need?') && e.preventDefault()}
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
											</svg>
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-4 py-12 text-center text-slate-400">
								<p class="text-lg">No needs found</p>
								<p class="text-sm">Try adjusting your search or filters</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if paginationChirho && paginationChirho.totalPagesChirho > 1}
			<div class="border-t border-slate-700 px-4 py-3 flex items-center justify-between bg-slate-900">
				<p class="text-sm text-slate-400">
					Showing {(paginationChirho.pageChirho - 1) * paginationChirho.limitChirho + 1} to {Math.min(paginationChirho.pageChirho * paginationChirho.limitChirho, paginationChirho.totalChirho)} of {paginationChirho.totalChirho}
				</p>
				<div class="flex gap-2">
					{#if paginationChirho.pageChirho > 1}
						<a
							href="?page={paginationChirho.pageChirho - 1}&search={filtersChirho.searchChirho}&status={filtersChirho.statusChirho}"
							class="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
						>
							Previous
						</a>
					{/if}
					{#if paginationChirho.pageChirho < paginationChirho.totalPagesChirho}
						<a
							href="?page={paginationChirho.pageChirho + 1}&search={filtersChirho.searchChirho}&status={filtersChirho.statusChirho}"
							class="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
						>
							Next
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
