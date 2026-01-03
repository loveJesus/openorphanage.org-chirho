<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const orphanagesChirho = $derived(data.orphanagesChirho);
	const paginationChirho = $derived(data.paginationChirho);
	const filtersChirho = $derived(data.filtersChirho);
	const statusCountsChirho = $derived(data.statusCountsChirho);

	let searchInputChirho = $state('');
	let statusFilterChirho = $state('all');
	let rejectingIdChirho = $state<number | null>(null);
	let rejectReasonChirho = $state('');

	// Sync initial values from server
	$effect(() => {
		if (filtersChirho) {
			searchInputChirho = filtersChirho.searchChirho || '';
			statusFilterChirho = filtersChirho.statusChirho || 'all';
		}
	});

	function applyFiltersChirho() {
		const paramsChirho = new URLSearchParams();
		if (searchInputChirho) paramsChirho.set('search', searchInputChirho);
		if (statusFilterChirho !== 'all') paramsChirho.set('status', statusFilterChirho);
		window.location.href = `/admin-chirho/orphanages-chirho?${paramsChirho.toString()}`;
	}

	function getStatusBadgeChirho(statusChirho: string) {
		switch (statusChirho) {
			case 'verified':
				return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
			case 'pending':
				return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
			case 'rejected':
				return 'bg-red-500/20 text-red-400 border-red-500/30';
			default:
				return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
		}
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
	<title>Manage Orphanages | OpenOrphanage Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold">Manage Orphanages</h1>
			<p class="text-slate-400">Review, verify, and manage registered orphanages</p>
		</div>
		<a
			href="/admin-chirho/orphanages-chirho/new-chirho"
			class="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
		>
			<span aria-hidden="true">➕</span>
			Add Orphanage
		</a>
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
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
		<button
			onclick={() => { statusFilterChirho = 'all'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'all' ? 'border-rose-500' : 'border-slate-700'}"
		>
			<p class="text-slate-400 text-sm">Total</p>
			<p class="text-2xl font-bold">{statusCountsChirho.total}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'pending'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'pending' ? 'border-amber-500' : 'border-slate-700'}"
		>
			<p class="text-amber-400 text-sm">Pending</p>
			<p class="text-2xl font-bold text-amber-400">{statusCountsChirho.pending}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'verified'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'verified' ? 'border-emerald-500' : 'border-slate-700'}"
		>
			<p class="text-emerald-400 text-sm">Verified</p>
			<p class="text-2xl font-bold text-emerald-400">{statusCountsChirho.verified}</p>
		</button>
		<button
			onclick={() => { statusFilterChirho = 'rejected'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {statusFilterChirho === 'rejected' ? 'border-red-500' : 'border-slate-700'}"
		>
			<p class="text-red-400 text-sm">Rejected</p>
			<p class="text-2xl font-bold text-red-400">{statusCountsChirho.rejected}</p>
		</button>
	</div>

	<!-- Search -->
	<div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-grow">
				<label for="search" class="sr-only">Search orphanages</label>
				<input
					type="text"
					id="search"
					bind:value={searchInputChirho}
					placeholder="Search by name, country, or email..."
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

	<!-- Orphanages Table -->
	<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-900">
					<tr>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Orphanage</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Location</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Status</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Children</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Created</th>
						<th class="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					{#each orphanagesChirho as orphanageChirho (orphanageChirho.idChirho)}
						<tr class="hover:bg-slate-700/50 transition-colors {!orphanageChirho.isActiveChirho ? 'opacity-50' : ''}">
							<td class="px-4 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
										{orphanageChirho.nameChirho?.charAt(0) || '?'}
									</div>
									<div>
										<a
											href="/admin-chirho/orphanages-chirho/{orphanageChirho.idChirho}"
											class="font-medium hover:text-rose-400 transition-colors"
										>
											{orphanageChirho.nameChirho}
										</a>
										{#if orphanageChirho.contactEmailChirho}
											<p class="text-sm text-slate-500">{orphanageChirho.contactEmailChirho}</p>
										{/if}
									</div>
								</div>
							</td>
							<td class="px-4 py-4">
								<span class="text-slate-300">{orphanageChirho.countryChirho}</span>
								{#if orphanageChirho.regionChirho}
									<span class="text-slate-500 text-sm block">{orphanageChirho.regionChirho}</span>
								{/if}
							</td>
							<td class="px-4 py-4">
								<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border {getStatusBadgeChirho(orphanageChirho.verificationStatusChirho)}">
									{orphanageChirho.verificationStatusChirho}
								</span>
								{#if !orphanageChirho.isActiveChirho}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600/20 text-slate-400 border border-slate-500/30 ml-1">
										Inactive
									</span>
								{/if}
							</td>
							<td class="px-4 py-4 text-slate-300">
								{orphanageChirho.childrenCountChirho || 0}
								{#if orphanageChirho.capacityChirho}
									<span class="text-slate-500">/ {orphanageChirho.capacityChirho}</span>
								{/if}
							</td>
							<td class="px-4 py-4 text-slate-400 text-sm">
								{formatDateChirho(orphanageChirho.createdAtChirho)}
							</td>
							<td class="px-4 py-4">
								<div class="flex items-center justify-end gap-2">
									<!-- View -->
									<a
										href="/orphanages-chirho/{orphanageChirho.idChirho}"
										class="p-2 text-slate-400 hover:text-white transition-colors"
										title="View public page"
										target="_blank"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>

									<!-- Edit -->
									<a
										href="/admin-chirho/orphanages-chirho/{orphanageChirho.idChirho}"
										class="p-2 text-slate-400 hover:text-amber-400 transition-colors"
										title="Edit orphanage"
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
										</svg>
									</a>

									{#if orphanageChirho.verificationStatusChirho === 'pending'}
										<!-- Verify -->
										<form method="POST" action="?/verify" use:enhance>
											<input type="hidden" name="id" value={orphanageChirho.idChirho} />
											<button
												type="submit"
												class="p-2 text-slate-400 hover:text-emerald-400 transition-colors"
												title="Verify orphanage"
											>
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
												</svg>
											</button>
										</form>

										<!-- Reject -->
										<button
											onclick={() => { rejectingIdChirho = orphanageChirho.idChirho; rejectReasonChirho = ''; }}
											class="p-2 text-slate-400 hover:text-red-400 transition-colors"
											title="Reject orphanage"
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
											</svg>
										</button>
									{/if}

									<!-- Toggle Active -->
									<form method="POST" action="?/toggleActive" use:enhance>
										<input type="hidden" name="id" value={orphanageChirho.idChirho} />
										<input type="hidden" name="isActive" value={orphanageChirho.isActiveChirho} />
										<button
											type="submit"
											class="p-2 text-slate-400 hover:text-amber-400 transition-colors"
											title={orphanageChirho.isActiveChirho ? 'Deactivate' : 'Activate'}
										>
											{#if orphanageChirho.isActiveChirho}
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
												</svg>
											{:else}
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											{/if}
										</button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="px-4 py-12 text-center text-slate-400">
								<p class="text-lg">No orphanages found</p>
								<p class="text-sm">Try adjusting your search or filters</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if paginationChirho.totalPagesChirho > 1}
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

<!-- Reject Modal -->
{#if rejectingIdChirho}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
		onclick={() => rejectingIdChirho = null}
		onkeydown={(eChirho) => eChirho.key === 'Escape' && (rejectingIdChirho = null)}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md"
			role="dialog"
			aria-modal="true"
			aria-labelledby="reject-modal-title"
			tabindex="-1"
			onclick={(eChirho) => eChirho.stopPropagation()}
		>
			<div class="p-6">
				<h2 id="reject-modal-title" class="text-xl font-bold mb-4">Reject Orphanage</h2>
				<p class="text-slate-400 mb-4">Please provide a reason for rejection. This will be visible to the submitter.</p>
				<form method="POST" action="?/reject" use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							rejectingIdChirho = null;
						}
						update();
					};
				}}>
					<input type="hidden" name="id" value={rejectingIdChirho} />
					<textarea
						name="reason"
						bind:value={rejectReasonChirho}
						placeholder="Reason for rejection..."
						rows="3"
						class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
						required
					></textarea>
					<div class="flex gap-3 justify-end">
						<button
							type="button"
							onclick={() => rejectingIdChirho = null}
							class="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
						>
							Reject
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
