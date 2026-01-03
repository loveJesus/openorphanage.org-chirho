<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let { data } = $props();

	const ticketChirho = $derived(data.ticketChirho);
	const auditHistoryChirho = $derived(data.auditHistoryChirho);
	const adminsChirho = $derived(data.adminsChirho);
	const userChirho = $derived($page.data?.userChirho);

	let showDeleteConfirmChirho = $state(false);
	let isSubmittingChirho = $state(false);

	function formatDateChirho(dateStrChirho: string | null) {
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
		const badgesChirho: Record<string, { classChirho: string; iconChirho: string; textChirho: string }> = {
			urgent: { classChirho: 'bg-red-500/20 text-red-400 border-red-500/30', iconChirho: '🔴', textChirho: 'Urgent' },
			high: { classChirho: 'bg-orange-500/20 text-orange-400 border-orange-500/30', iconChirho: '🟠', textChirho: 'High' },
			normal: { classChirho: 'bg-blue-500/20 text-blue-400 border-blue-500/30', iconChirho: '🔵', textChirho: 'Normal' },
			low: { classChirho: 'bg-slate-500/20 text-slate-400 border-slate-500/30', iconChirho: '⚪', textChirho: 'Low' }
		};
		return badgesChirho[priorityChirho] || badgesChirho.normal;
	}

	function getCategoryInfoChirho(categoryChirho: string) {
		const categoriesChirho: Record<string, { iconChirho: string; labelChirho: string }> = {
			general: { iconChirho: '💬', labelChirho: 'General Inquiry' },
			donation: { iconChirho: '💰', labelChirho: 'Donation Issue' },
			technical: { iconChirho: '🔧', labelChirho: 'Technical Problem' },
			orphanage: { iconChirho: '🏠', labelChirho: 'Orphanage Related' },
			safety: { iconChirho: '🚨', labelChirho: 'Safety Concern' },
			gdpr: { iconChirho: '🔒', labelChirho: 'GDPR / Data Request' },
			other: { iconChirho: '📋', labelChirho: 'Other' }
		};
		return categoriesChirho[categoryChirho] || categoriesChirho.general;
	}

	const statusBadgeChirho = $derived(getStatusBadgeChirho(ticketChirho?.statusChirho || 'open'));
	const priorityBadgeChirho = $derived(getPriorityBadgeChirho(ticketChirho?.priorityChirho || 'normal'));
	const categoryInfoChirho = $derived(getCategoryInfoChirho(ticketChirho?.categoryChirho || 'general'));
</script>

<svelte:head>
	<title>Ticket #{ticketChirho?.idChirho} — Admin — OpenOrphanage</title>
</svelte:head>

<div class="max-w-5xl">
	<!-- Back link and header -->
	<div class="mb-6">
		<a
			href="/admin-chirho/support-chirho"
			class="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2"
		>
			← Back to Tickets
		</a>
	</div>

	{#if ticketChirho}
		<div class="flex items-start justify-between mb-8">
			<div>
				<div class="flex items-center gap-3 mb-2">
					<h1 class="text-2xl font-bold">Ticket #{ticketChirho.idChirho}</h1>
					<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border {priorityBadgeChirho.classChirho}">
						{priorityBadgeChirho.iconChirho} {priorityBadgeChirho.textChirho}
					</span>
					<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium border {statusBadgeChirho.classChirho}">
						{statusBadgeChirho.textChirho}
					</span>
				</div>
				<h2 class="text-xl text-slate-300">{ticketChirho.subjectChirho}</h2>
			</div>

			<!-- Quick Actions -->
			<div class="flex gap-2">
				{#if ticketChirho.statusChirho === 'open'}
					<form method="POST" action="?/updateTicketChirho" use:enhance={() => {
						isSubmittingChirho = true;
						return async ({ update }) => {
							await update();
							isSubmittingChirho = false;
						};
					}}>
						<input type="hidden" name="statusChirho" value="in_progress" />
						<button
							type="submit"
							disabled={isSubmittingChirho}
							class="px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50"
						>
							Start Working
						</button>
					</form>
				{/if}
				{#if ticketChirho.statusChirho !== 'resolved' && ticketChirho.statusChirho !== 'closed'}
					<form method="POST" action="?/updateTicketChirho" use:enhance={() => {
						isSubmittingChirho = true;
						return async ({ update }) => {
							await update();
							isSubmittingChirho = false;
						};
					}}>
						<input type="hidden" name="statusChirho" value="resolved" />
						<button
							type="submit"
							disabled={isSubmittingChirho}
							class="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50"
						>
							Mark Resolved
						</button>
					</form>
				{/if}
			</div>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Ticket Content -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
						<span>{categoryInfoChirho.iconChirho}</span>
						{categoryInfoChirho.labelChirho}
					</h3>
					<div class="prose prose-invert max-w-none">
						<p class="text-slate-300 whitespace-pre-wrap">{ticketChirho.fullContentChirho}</p>
					</div>
				</div>

				<!-- Resolution Notes Form -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="text-lg font-semibold mb-4">Resolution Notes</h3>
					<form method="POST" action="?/updateTicketChirho" use:enhance={() => {
						isSubmittingChirho = true;
						return async ({ update }) => {
							await update();
							isSubmittingChirho = false;
						};
					}}>
						<textarea
							name="resolutionNotesChirho"
							rows="4"
							placeholder="Add notes about how this ticket was resolved..."
							class="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
						>{ticketChirho.resolutionNotesChirho || ''}</textarea>
						<div class="flex justify-end mt-4">
							<button
								type="submit"
								disabled={isSubmittingChirho}
								class="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
							>
								{isSubmittingChirho ? 'Saving...' : 'Save Notes'}
							</button>
						</div>
					</form>
				</div>

				<!-- Activity History -->
				{#if auditHistoryChirho && auditHistoryChirho.length > 0}
					<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
						<h3 class="text-lg font-semibold mb-4">Activity History</h3>
						<div class="space-y-4">
							{#each auditHistoryChirho as entryChirho}
								<div class="flex gap-4 text-sm border-l-2 border-slate-600 pl-4">
									<div class="flex-grow">
										<p class="text-slate-300">
											<span class="font-medium">{entryChirho.userEmailChirho || 'System'}</span>
											<span class="text-slate-500"> - {entryChirho.actionChirho.replace(/_/g, ' ')}</span>
										</p>
										{#if entryChirho.detailsChirho}
											<p class="text-slate-500 text-xs mt-1 font-mono">
												{typeof entryChirho.detailsChirho === 'string' ? entryChirho.detailsChirho : JSON.stringify(entryChirho.detailsChirho)}
											</p>
										{/if}
									</div>
									<span class="text-slate-500 text-xs whitespace-nowrap">
										{formatDateChirho(entryChirho.createdAtChirho)}
									</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Contact Info -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="text-lg font-semibold mb-4">Contact</h3>
					<div class="space-y-3">
						{#if ticketChirho.nameChirho}
							<div>
								<span class="text-slate-500 text-sm">Name</span>
								<p class="font-medium">{ticketChirho.nameChirho}</p>
							</div>
						{/if}
						<div>
							<span class="text-slate-500 text-sm">Email</span>
							<p class="font-medium">
								<a href="mailto:{ticketChirho.emailChirho}" class="text-amber-400 hover:text-amber-300">
									{ticketChirho.emailChirho}
								</a>
							</p>
						</div>
						{#if ticketChirho.userIdChirho}
							<div>
								<span class="text-slate-500 text-sm">User ID</span>
								<p class="font-mono text-sm">#{ticketChirho.userIdChirho}</p>
							</div>
						{:else}
							<div>
								<span class="inline-flex px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs">
									Guest User
								</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Ticket Details -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="text-lg font-semibold mb-4">Details</h3>
					<form method="POST" action="?/updateTicketChirho" use:enhance class="space-y-4">
						<!-- Status -->
						<div>
							<label for="statusChirho" class="block text-slate-500 text-sm mb-2">Status</label>
							<select
								id="statusChirho"
								name="statusChirho"
								class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
							>
								<option value="open" selected={ticketChirho.statusChirho === 'open'}>Open</option>
								<option value="in_progress" selected={ticketChirho.statusChirho === 'in_progress'}>In Progress</option>
								<option value="waiting_response" selected={ticketChirho.statusChirho === 'waiting_response'}>Waiting Response</option>
								<option value="resolved" selected={ticketChirho.statusChirho === 'resolved'}>Resolved</option>
								<option value="closed" selected={ticketChirho.statusChirho === 'closed'}>Closed</option>
							</select>
						</div>

						<!-- Priority -->
						<div>
							<label for="priorityChirho" class="block text-slate-500 text-sm mb-2">Priority</label>
							<select
								id="priorityChirho"
								name="priorityChirho"
								class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
							>
								<option value="low" selected={ticketChirho.priorityChirho === 'low'}>⚪ Low</option>
								<option value="normal" selected={ticketChirho.priorityChirho === 'normal'}>🔵 Normal</option>
								<option value="high" selected={ticketChirho.priorityChirho === 'high'}>🟠 High</option>
								<option value="urgent" selected={ticketChirho.priorityChirho === 'urgent'}>🔴 Urgent</option>
							</select>
						</div>

						<!-- Assigned To -->
						<div>
							<label for="assignedToChirho" class="block text-slate-500 text-sm mb-2">Assigned To</label>
							<select
								id="assignedToChirho"
								name="assignedToChirho"
								class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
							>
								<option value="unassigned">Unassigned</option>
								{#each adminsChirho || [] as adminChirho}
									<option value={adminChirho.idChirho} selected={ticketChirho.assignedToChirho === adminChirho.idChirho}>
										{adminChirho.nameChirho || adminChirho.emailChirho}
									</option>
								{/each}
							</select>
						</div>

						<button
							type="submit"
							class="w-full px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
						>
							Update Ticket
						</button>
					</form>
				</div>

				<!-- Timestamps -->
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h3 class="text-lg font-semibold mb-4">Timeline</h3>
					<div class="space-y-3 text-sm">
						<div>
							<span class="text-slate-500">Created</span>
							<p>{formatDateChirho(ticketChirho.createdAtChirho)}</p>
						</div>
						{#if ticketChirho.updatedAtChirho}
							<div>
								<span class="text-slate-500">Last Updated</span>
								<p>{formatDateChirho(ticketChirho.updatedAtChirho)}</p>
							</div>
						{/if}
						{#if ticketChirho.resolvedAtChirho}
							<div>
								<span class="text-slate-500">Resolved</span>
								<p class="text-green-400">{formatDateChirho(ticketChirho.resolvedAtChirho)}</p>
							</div>
						{/if}
					</div>
				</div>

				<!-- Danger Zone (Super Admin Only) -->
				{#if userChirho?.roleChirho === 'super_admin'}
					<div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
						<h3 class="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
						{#if showDeleteConfirmChirho}
							<p class="text-sm text-slate-400 mb-4">
								Are you sure you want to delete this ticket? This cannot be undone.
							</p>
							<div class="flex gap-2">
								<form method="POST" action="?/deleteTicketChirho" use:enhance>
									<button
										type="submit"
										class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
									>
										Yes, Delete
									</button>
								</form>
								<button
									type="button"
									onclick={() => { showDeleteConfirmChirho = false; }}
									class="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
								>
									Cancel
								</button>
							</div>
						{:else}
							<button
								type="button"
								onclick={() => { showDeleteConfirmChirho = true; }}
								class="w-full px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
							>
								Delete Ticket
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
			<span class="text-5xl mb-4 block">❌</span>
			<h3 class="text-xl font-bold mb-2">Ticket Not Found</h3>
			<p class="text-slate-400">This ticket may have been deleted.</p>
		</div>
	{/if}
</div>
