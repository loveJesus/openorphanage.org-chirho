<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const feedbackChirho = $derived(data.feedbackChirho);
	const metadataChirho = $derived(data.metadataChirho);

	let responseTextChirho = $state('');
	let isSubmittingChirho = $state(false);
	let showDeleteConfirmChirho = $state(false);

	function formatDateChirho(dateStrChirho: string | null) {
		if (!dateStrChirho) return 'N/A';
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
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
		const badgesChirho: Record<string, { classChirho: string; iconChirho: string; labelChirho: string }> = {
			bug: { classChirho: 'bg-red-500/20 text-red-400', iconChirho: '🐛', labelChirho: 'Bug Report' },
			feature_request: { classChirho: 'bg-purple-500/20 text-purple-400', iconChirho: '💡', labelChirho: 'Feature Request' },
			safety_concern: { classChirho: 'bg-amber-500/20 text-amber-400', iconChirho: '🚨', labelChirho: 'Safety Concern' },
			general: { classChirho: 'bg-teal-500/20 text-teal-400', iconChirho: '💬', labelChirho: 'General' }
		};
		return badgesChirho[typeChirho] || badgesChirho.general;
	}

	const statusBadgeChirho = $derived(getStatusBadgeChirho(feedbackChirho.statusChirho));
	const typeBadgeChirho = $derived(getTypeBadgeChirho(feedbackChirho.typeChirho));
</script>

<svelte:head>
	<title>Feedback #{feedbackChirho.idChirho} — Admin — OpenOrphanage</title>
</svelte:head>

<div class="max-w-4xl">
	<!-- Back Button -->
	<a href="/admin-chirho/feedback-chirho" class="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
		</svg>
		Back to Feedback List
	</a>

	<!-- Form Messages -->
	{#if form?.successChirho}
		<div class="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg mb-6">
			{form.messageChirho || 'Action completed successfully'}
		</div>
	{/if}

	{#if form?.errorChirho}
		<div class="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
			{form.errorChirho}
		</div>
	{/if}

	<!-- Header -->
	<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
		<div class="flex items-start justify-between flex-wrap gap-4">
			<div>
				<div class="flex items-center gap-3 mb-2">
					<span class="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm {typeBadgeChirho.classChirho}">
						<span>{typeBadgeChirho.iconChirho}</span>
						<span>{typeBadgeChirho.labelChirho}</span>
					</span>
					<span class="inline-flex px-3 py-1 rounded-full text-sm font-medium border {statusBadgeChirho.classChirho}">
						{statusBadgeChirho.textChirho}
					</span>
					{#if feedbackChirho.publicVisibleChirho}
						<span class="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
							Public
						</span>
					{/if}
				</div>
				<h1 class="text-2xl font-bold">Feedback #{feedbackChirho.idChirho}</h1>
				<p class="text-slate-400 text-sm mt-1">
					Submitted {formatDateChirho(feedbackChirho.createdAtChirho)}
				</p>
			</div>

			<!-- Quick Actions -->
			<div class="flex gap-2">
				<form method="POST" action="?/togglePublic" use:enhance>
					<button type="submit" class="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors">
						{feedbackChirho.publicVisibleChirho ? 'Make Private' : 'Make Public'}
					</button>
				</form>
				<button
					onclick={() => showDeleteConfirmChirho = true}
					class="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
				>
					Delete
				</button>
			</div>
		</div>
	</div>

	<div class="grid md:grid-cols-3 gap-6">
		<!-- Main Content -->
		<div class="md:col-span-2 space-y-6">
			<!-- Feedback Content -->
			<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
				<h2 class="font-semibold mb-4 text-lg">Feedback Content</h2>
				<div class="bg-slate-900 rounded-lg p-4">
					<p class="whitespace-pre-wrap">{feedbackChirho.fullContentChirho}</p>
				</div>

				{#if feedbackChirho.ratingChirho}
					<div class="mt-4">
						<span class="text-amber-400 text-lg">{'⭐'.repeat(feedbackChirho.ratingChirho)}</span>
						<span class="text-slate-400 text-sm ml-2">({feedbackChirho.ratingChirho}/5 stars)</span>
					</div>
				{/if}
			</div>

			<!-- Status Management -->
			<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
				<h2 class="font-semibold mb-4 text-lg">Update Status</h2>
				<form method="POST" action="?/updateStatus" use:enhance class="flex gap-2 flex-wrap">
					{#each ['pending', 'reviewed', 'resolved', 'dismissed'] as statusChirho}
						{@const badgeChirho = getStatusBadgeChirho(statusChirho)}
						<button
							type="submit"
							name="status"
							value={statusChirho}
							class="px-4 py-2 rounded-lg border transition-colors {feedbackChirho.statusChirho === statusChirho
								? badgeChirho.classChirho + ' font-medium'
								: 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'}"
						>
							{badgeChirho.textChirho}
						</button>
					{/each}
				</form>
			</div>

			<!-- Admin Response -->
			<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
				<h2 class="font-semibold mb-4 text-lg">Admin Response</h2>

				{#if feedbackChirho.adminResponseChirho}
					<div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
						<p class="whitespace-pre-wrap text-blue-100">{feedbackChirho.adminResponseChirho}</p>
						<p class="text-xs text-blue-400 mt-2">
							Responded {formatDateChirho(feedbackChirho.respondedAtChirho)}
						</p>
					</div>
				{/if}

				<form
					method="POST"
					action="?/addResponse"
					use:enhance={() => {
						isSubmittingChirho = true;
						return async ({ update }) => {
							await update();
							isSubmittingChirho = false;
							responseTextChirho = '';
						};
					}}
				>
					<textarea
						name="response"
						bind:value={responseTextChirho}
						rows="4"
						placeholder="Write a response to this feedback..."
						class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
					></textarea>
					<button
						type="submit"
						disabled={isSubmittingChirho || responseTextChirho.length < 5}
						class="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSubmittingChirho ? 'Saving...' : feedbackChirho.adminResponseChirho ? 'Update Response' : 'Add Response'}
					</button>
				</form>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Submitter Info -->
			<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
				<h2 class="font-semibold mb-4 text-lg">Submitter</h2>
				<dl class="space-y-3 text-sm">
					{#if feedbackChirho.isAnonymousChirho}
						<div>
							<dt class="text-slate-400">Type</dt>
							<dd class="text-slate-300 italic">Anonymous submission</dd>
						</div>
					{:else}
						<div>
							<dt class="text-slate-400">Email</dt>
							<dd class="text-white">{feedbackChirho.emailChirho || feedbackChirho.userEmailChirho || 'Unknown'}</dd>
						</div>
						{#if feedbackChirho.userRoleChirho}
							<div>
								<dt class="text-slate-400">Role</dt>
								<dd class="capitalize">{feedbackChirho.userRoleChirho}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			</div>

			<!-- Metadata from KV -->
			{#if metadataChirho}
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h2 class="font-semibold mb-4 text-lg">Metadata</h2>
					<dl class="space-y-3 text-sm">
						{#if metadataChirho.pageChirho}
							<div>
								<dt class="text-slate-400">Page</dt>
								<dd class="text-amber-400 font-mono text-xs">{metadataChirho.pageChirho}</dd>
							</div>
						{/if}
						{#if metadataChirho.ipChirho}
							<div>
								<dt class="text-slate-400">IP Address</dt>
								<dd class="font-mono text-xs">{metadataChirho.ipChirho}</dd>
							</div>
						{/if}
						{#if metadataChirho.userAgentChirho}
							<div>
								<dt class="text-slate-400">User Agent</dt>
								<dd class="text-xs text-slate-300 break-all">{metadataChirho.userAgentChirho}</dd>
							</div>
						{/if}
						{#if metadataChirho.refererChirho}
							<div>
								<dt class="text-slate-400">Referer</dt>
								<dd class="text-xs text-slate-300 break-all">{metadataChirho.refererChirho}</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/if}

			<!-- Source Info -->
			{#if feedbackChirho.parsedNotesChirho}
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h2 class="font-semibold mb-4 text-lg">Source</h2>
					<dl class="space-y-3 text-sm">
						<div>
							<dt class="text-slate-400">Source</dt>
							<dd class="capitalize">{feedbackChirho.parsedNotesChirho.sourceChirho || 'Unknown'}</dd>
						</div>
						{#if feedbackChirho.parsedNotesChirho.originalTypeChirho}
							<div>
								<dt class="text-slate-400">Original Type</dt>
								<dd class="capitalize">{feedbackChirho.parsedNotesChirho.originalTypeChirho}</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirmChirho}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
			<h3 class="text-xl font-bold mb-4">Delete Feedback?</h3>
			<p class="text-slate-400 mb-6">
				This action cannot be undone. The feedback and all associated data will be permanently deleted.
			</p>
			<div class="flex gap-3 justify-end">
				<button
					onclick={() => showDeleteConfirmChirho = false}
					class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
				>
					Cancel
				</button>
				<form method="POST" action="?/delete" use:enhance>
					<button
						type="submit"
						class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
					>
						Delete Forever
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}
