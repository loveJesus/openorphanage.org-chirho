<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data } = $props();

	const ticketsChirho = $derived(data.ticketsChirho);
	const statusCountsChirho = $derived(data.statusCountsChirho);
	const priorityCountsChirho = $derived(data.priorityCountsChirho);
	const paginationChirho = $derived(data.paginationChirho);
	const filtersChirho = $derived(data.filtersChirho);

	function formatDateChirho(dateStrChirho: string) {
		if (!dateStrChirho) return 'N/A';
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
			open: { classChirho: 'bg-blue-500/20 text-blue-400 border-blue-500/30', textChirho: 'Open' },
			in_progress: { classChirho: 'bg-amber-500/20 text-amber-400 border-amber-500/30', textChirho: 'In Progress' },
			waiting_response: { classChirho: 'bg-purple-500/20 text-purple-400 border-purple-500/30', textChirho: 'Waiting' },
			resolved: { classChirho: 'bg-green-500/20 text-green-400 border-green-500/30', textChirho: 'Resolved' },
			closed: { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', textChirho: 'Closed' }
		};
		return badgesChirho[statusChirho] || badgesChirho.open;
	}

	function getPriorityBadgeChirho(priorityChirho: string) {
		const badgesChirho: Record<string, { classChirho: string; iconChirho: string }> = {
			urgent: { classChirho: 'bg-red-500/20 text-red-400 border-red-500/30', iconChirho: '🔴' },
			high: { classChirho: 'bg-orange-500/20 text-orange-400 border-orange-500/30', iconChirho: '🟠' },
			normal: { classChirho: 'bg-blue-500/20 text-blue-400 border-blue-500/30', iconChirho: '🔵' },
			low: { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', iconChirho: '⚪' }
		};
		return badgesChirho[priorityChirho] || badgesChirho.normal;
	}

	function getCategoryIconChirho(categoryChirho: string) {
		const iconsChirho: Record<string, string> = {
			general: '💬',
			donation: '💰',
			technical: '🔧',
			orphanage: '🏠',
			safety: '🚨',
			gdpr: '🔒',
			other: '📋'
		};
		return iconsChirho[categoryChirho] || '📋';
	}

	const urgentCountChirho = $derived(priorityCountsChirho?.urgent || 0);
	const highCountChirho = $derived(priorityCountsChirho?.high || 0);
</script>

<svelte:head>
	<title>Support Tickets — Admin — OpenOrphanage</title>
</svelte:head>

<div class="max-w-7xl">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold mb-2">Support Tickets</h1>
			<p class="text-slate-400">Manage and respond to user support requests</p>
		</div>

		<!-- Alert badges for urgent/high priority -->
		{#if urgentCountChirho > 0 || highCountChirho > 0}
			<div class="flex gap-2">
				{#if urgentCountChirho > 0}
					<span class="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-medium animate-pulse">
						🔴 {urgentCountChirho} Urgent
					</span>
				{/if}
				{#if highCountChirho > 0}
					<span class="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full text-sm font-medium">
						🟠 {highCountChirho} High Priority
					</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Status Tabs -->
	<div class="flex gap-2 mb-6 flex-wrap">
		<a
			href="/admin-chirho/support-chirho"
			class="px-4 py-2 rounded-lg font-medium transition-colors {!filtersChirho?.statusChirho
				? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			All ({Object.values(statusCountsChirho || {}).reduce((aChirho, bChirho) => aChirho + bChirho, 0)})
		</a>
		<a
			href="/admin-chirho/support-chirho?status=open"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho?.statusChirho === 'open'
				? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			Open ({statusCountsChirho?.open || 0})
		</a>
		<a
			href="/admin-chirho/support-chirho?status=in_progress"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho?.statusChirho === 'in_progress'
				? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			In Progress ({statusCountsChirho?.in_progress || 0})
		</a>
		<a
			href="/admin-chirho/support-chirho?status=waiting_response"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho?.statusChirho === 'waiting_response'
				? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			Waiting ({statusCountsChirho?.waiting_response || 0})
		</a>
		<a
			href="/admin-chirho/support-chirho?status=resolved"
			class="px-4 py-2 rounded-lg font-medium transition-colors {filtersChirho?.statusChirho === 'resolved'
				? 'bg-green-500/20 text-green-400 border border-green-500/30'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			Resolved ({statusCountsChirho?.resolved || 0})
		</a>
	</div>

	<!-- Category Filter -->
	<div class="flex gap-2 mb-8 flex-wrap items-center">
		<span class="text-slate-500 py-2">Category:</span>
		<a
			href="/admin-chirho/support-chirho{filtersChirho?.statusChirho ? `?status=${filtersChirho.statusChirho}` : ''}"
			class="px-3 py-1 rounded-full text-sm transition-colors {!filtersChirho?.categoryChirho
				? 'bg-slate-600 text-white'
				: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
		>
			All
		</a>
		{#each ['general', 'donation', 'technical', 'orphanage', 'safety', 'gdpr', 'other'] as catChirho}
			<a
				href="/admin-chirho/support-chirho?category={catChirho}{filtersChirho?.statusChirho ? `&status=${filtersChirho.statusChirho}` : ''}"
				class="px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 {filtersChirho?.categoryChirho === catChirho
					? 'bg-teal-500/20 text-teal-400'
					: 'bg-slate-800 text-slate-400 hover:bg-slate-700'}"
			>
				<span>{getCategoryIconChirho(catChirho)}</span>
				<span class="capitalize">{catChirho}</span>
			</a>
		{/each}
	</div>

	<!-- Tickets List -->
	{#if ticketsChirho && ticketsChirho.length > 0}
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden">
			<table class="w-full">
				<thead class="bg-slate-900/50">
					<tr>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">ID</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Subject</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">From</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Category</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Priority</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
						<th class="text-left px-6 py-4 text-sm font-medium text-slate-400">Date</th>
						<th class="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					{#each ticketsChirho as ticketChirho}
						{@const statusBadgeChirho = getStatusBadgeChirho(ticketChirho.statusChirho)}
						{@const priorityBadgeChirho = getPriorityBadgeChirho(ticketChirho.priorityChirho)}
						<tr class="hover:bg-slate-800/50 transition-colors {ticketChirho.priorityChirho === 'urgent' ? 'bg-red-500/5' : ticketChirho.priorityChirho === 'high' ? 'bg-orange-500/5' : ''}">
							<td class="px-6 py-4">
								<span class="text-slate-400 font-mono text-sm">#{ticketChirho.idChirho}</span>
							</td>
							<td class="px-6 py-4">
								<p class="font-medium text-white line-clamp-1 max-w-xs">
									{ticketChirho.subjectChirho}
								</p>
								{#if ticketChirho.contentPreviewChirho}
									<p class="text-sm text-slate-400 line-clamp-1 max-w-xs mt-1">
										{ticketChirho.contentPreviewChirho}
									</p>
								{/if}
							</td>
							<td class="px-6 py-4">
								<div>
									{#if ticketChirho.nameChirho}
										<p class="font-medium text-sm">{ticketChirho.nameChirho}</p>
									{/if}
									<p class="text-sm text-slate-400">{ticketChirho.emailChirho}</p>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm bg-slate-700/50 text-slate-300">
									<span>{getCategoryIconChirho(ticketChirho.categoryChirho)}</span>
									<span class="capitalize">{ticketChirho.categoryChirho}</span>
								</span>
							</td>
							<td class="px-6 py-4">
								<form method="POST" action="?/updatePriorityChirho" use:enhance class="inline">
									<input type="hidden" name="ticketIdChirho" value={ticketChirho.idChirho} />
									<select
										name="priorityChirho"
										class="px-2 py-1 rounded-lg text-xs font-medium border cursor-pointer bg-transparent {priorityBadgeChirho.classChirho}"
										onchange={(eChirho) => (eChirho.target as HTMLSelectElement).form?.requestSubmit()}
									>
										<option value="low" selected={ticketChirho.priorityChirho === 'low'}>⚪ Low</option>
										<option value="normal" selected={ticketChirho.priorityChirho === 'normal'}>🔵 Normal</option>
										<option value="high" selected={ticketChirho.priorityChirho === 'high'}>🟠 High</option>
										<option value="urgent" selected={ticketChirho.priorityChirho === 'urgent'}>🔴 Urgent</option>
									</select>
								</form>
							</td>
							<td class="px-6 py-4">
								<form method="POST" action="?/updateStatusChirho" use:enhance class="inline">
									<input type="hidden" name="ticketIdChirho" value={ticketChirho.idChirho} />
									<select
										name="statusChirho"
										class="px-2 py-1 rounded-full text-xs font-medium border cursor-pointer bg-transparent {statusBadgeChirho.classChirho}"
										onchange={(eChirho) => (eChirho.target as HTMLSelectElement).form?.requestSubmit()}
									>
										<option value="open" selected={ticketChirho.statusChirho === 'open'}>Open</option>
										<option value="in_progress" selected={ticketChirho.statusChirho === 'in_progress'}>In Progress</option>
										<option value="waiting_response" selected={ticketChirho.statusChirho === 'waiting_response'}>Waiting</option>
										<option value="resolved" selected={ticketChirho.statusChirho === 'resolved'}>Resolved</option>
										<option value="closed" selected={ticketChirho.statusChirho === 'closed'}>Closed</option>
									</select>
								</form>
							</td>
							<td class="px-6 py-4 text-sm text-slate-400">
								{formatDateChirho(ticketChirho.createdAtChirho)}
							</td>
							<td class="px-6 py-4 text-right">
								<a
									href="/admin-chirho/support-chirho/{ticketChirho.idChirho}"
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
		{#if paginationChirho && paginationChirho.totalPagesChirho > 1}
			<div class="flex justify-center gap-2 mt-8">
				{#if paginationChirho.currentPageChirho > 1}
					<a
						href="?page={paginationChirho.currentPageChirho - 1}&status={filtersChirho?.statusChirho || ''}&category={filtersChirho?.categoryChirho || ''}"
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
						href="?page={paginationChirho.currentPageChirho + 1}&status={filtersChirho?.statusChirho || ''}&category={filtersChirho?.categoryChirho || ''}"
						class="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-amber-500/50 transition-colors"
					>
						Next →
					</a>
				{/if}
			</div>
		{/if}
	{:else}
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
			<span class="text-5xl mb-4 block">🎫</span>
			<h3 class="text-xl font-bold mb-2">No tickets found</h3>
			<p class="text-slate-400">
				{#if filtersChirho?.statusChirho || filtersChirho?.categoryChirho}
					Try adjusting your filters
				{:else}
					No support tickets have been submitted yet
				{/if}
			</p>
		</div>
	{/if}
</div>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
