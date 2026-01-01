<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const userChirho = $derived(data.userChirho);
	const orphanageChirho = $derived(data.orphanageChirho);
	const feedbackChirho = $derived(data.feedbackChirho || []);
	const donationStatsChirho = $derived(data.donationStatsChirho);
	const recentActivityChirho = $derived(data.recentActivityChirho || []);

	let editingProfileChirho = $state(false);
	let changingPasswordChirho = $state(false);
	let nameInputChirho = $state(userChirho?.nameChirho || '');

	function formatDateChirho(dateStrChirho: string | null) {
		if (!dateStrChirho) return 'N/A';
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatRelativeDateChirho(dateStrChirho: string | null) {
		if (!dateStrChirho) return 'N/A';
		const dateChirho = new Date(dateStrChirho);
		const nowChirho = new Date();
		const diffChirho = nowChirho.getTime() - dateChirho.getTime();
		const daysChirho = Math.floor(diffChirho / (1000 * 60 * 60 * 24));

		if (daysChirho === 0) return 'Today';
		if (daysChirho === 1) return 'Yesterday';
		if (daysChirho < 7) return `${daysChirho} days ago`;
		if (daysChirho < 30) return `${Math.floor(daysChirho / 7)} weeks ago`;
		return formatDateChirho(dateStrChirho);
	}

	function getRoleLabelChirho(roleChirho: string) {
		const labelsChirho: Record<string, string> = {
			public: 'Public User',
			donor: 'Donor',
			staff: 'Staff Member',
			admin: 'Administrator',
			super_admin: 'Super Administrator'
		};
		return labelsChirho[roleChirho] || roleChirho;
	}

	function getRoleBadgeChirho(roleChirho: string) {
		switch (roleChirho) {
			case 'super_admin':
				return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
			case 'admin':
				return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
			case 'staff':
				return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
			case 'donor':
				return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
			default:
				return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
		}
	}

	function getFeedbackTypeBadgeChirho(typeChirho: string) {
		switch (typeChirho) {
			case 'bug':
				return 'bg-red-500/20 text-red-400';
			case 'feature_request':
				return 'bg-blue-500/20 text-blue-400';
			case 'safety_concern':
				return 'bg-amber-500/20 text-amber-400';
			default:
				return 'bg-slate-500/20 text-slate-400';
		}
	}
</script>

<svelte:head>
	<title>Dashboard | OpenOrphanage</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold mb-2">Welcome back{userChirho?.nameChirho ? `, ${userChirho.nameChirho}` : ''}!</h1>
		<p class="text-slate-400">Manage your account and view your activity</p>
	</div>

	<!-- Status notification -->
	{#if form?.successChirho}
		<div class="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg mb-6" role="alert">
			{form.messageChirho}
		</div>
	{/if}
	{#if form?.errorChirho}
		<div class="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6" role="alert">
			{form.errorChirho}
		</div>
	{/if}

	<div class="grid lg:grid-cols-3 gap-8">
		<!-- Main Content -->
		<div class="lg:col-span-2 space-y-6">
			<!-- Profile Card -->
			<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
				<div class="bg-gradient-to-r from-rose-500/20 to-teal-500/20 p-6 border-b border-slate-700">
					<div class="flex items-center gap-4">
						<div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							{userChirho?.emailChirho?.charAt(0).toUpperCase() || '?'}
						</div>
						<div class="flex-grow">
							<h2 class="text-xl font-bold">{userChirho?.nameChirho || 'Unnamed User'}</h2>
							<p class="text-slate-400">{userChirho?.emailChirho}</p>
						</div>
						<span class="px-3 py-1 rounded-full text-sm font-medium border {getRoleBadgeChirho(userChirho?.roleChirho || 'public')}">
							{getRoleLabelChirho(userChirho?.roleChirho || 'public')}
						</span>
					</div>
				</div>

				<div class="p-6">
					{#if editingProfileChirho}
						<form method="POST" action="?/updateProfile" use:enhance={() => {
							return async ({ result, update }) => {
								if (result.type === 'success') {
									editingProfileChirho = false;
								}
								update();
							};
						}}>
							<div class="space-y-4">
								<div>
									<label for="name" class="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
									<input
										type="text"
										id="name"
										name="name"
										bind:value={nameInputChirho}
										class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
										required
										minlength="2"
									/>
								</div>
								<div class="flex gap-3">
									<button
										type="submit"
										class="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
									>
										Save Changes
									</button>
									<button
										type="button"
										onclick={() => editingProfileChirho = false}
										class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
									>
										Cancel
									</button>
								</div>
							</div>
						</form>
					{:else}
						<div class="flex justify-between items-center">
							<div>
								<p class="text-sm text-slate-400">Member since</p>
								<p class="font-medium">{formatDateChirho(userChirho?.createdAtChirho)}</p>
							</div>
							<button
								onclick={() => { editingProfileChirho = true; nameInputChirho = userChirho?.nameChirho || ''; }}
								class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
							>
								Edit Profile
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Security Card -->
			<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
				<h3 class="text-lg font-bold mb-4 flex items-center gap-2">
					<span aria-hidden="true">🔒</span>
					Security
				</h3>

				{#if changingPasswordChirho}
					<form method="POST" action="?/changePassword" use:enhance={() => {
						return async ({ result, update }) => {
							if (result.type === 'success') {
								changingPasswordChirho = false;
							}
							update();
						};
					}}>
						<div class="space-y-4">
							<div>
								<label for="currentPassword" class="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
								<input
									type="password"
									id="currentPassword"
									name="currentPassword"
									class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
									required
								/>
							</div>
							<div>
								<label for="newPassword" class="block text-sm font-medium text-slate-300 mb-2">New Password</label>
								<input
									type="password"
									id="newPassword"
									name="newPassword"
									class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
									required
									minlength="8"
								/>
								<p class="text-xs text-slate-500 mt-1">Min 8 characters with uppercase, lowercase, and number</p>
							</div>
							<div>
								<label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
								<input
									type="password"
									id="confirmPassword"
									name="confirmPassword"
									class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
									required
								/>
							</div>
							<div class="flex gap-3">
								<button
									type="submit"
									class="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
								>
									Change Password
								</button>
								<button
									type="button"
									onclick={() => changingPasswordChirho = false}
									class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
								>
									Cancel
								</button>
							</div>
						</div>
					</form>
				{:else}
					<div class="flex justify-between items-center">
						<div>
							<p class="text-slate-300">Password</p>
							<p class="text-sm text-slate-500">Last changed: Unknown</p>
						</div>
						<button
							onclick={() => changingPasswordChirho = true}
							class="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
						>
							Change Password
						</button>
					</div>
				{/if}

				<div class="border-t border-slate-700 mt-4 pt-4">
					<div class="flex justify-between items-center">
						<div>
							<p class="text-slate-300">Email Verification</p>
							<p class="text-sm text-slate-500">{userChirho?.emailChirho}</p>
						</div>
						{#if userChirho?.emailVerifiedChirho}
							<span class="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
								Verified
							</span>
						{:else}
							<button class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
								Verify Email
							</button>
						{/if}
					</div>
				</div>
			</div>

			<!-- Recent Feedback -->
			{#if feedbackChirho.length > 0}
				<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
					<h3 class="text-lg font-bold mb-4 flex items-center gap-2">
						<span aria-hidden="true">💬</span>
						Your Feedback
					</h3>
					<div class="space-y-3">
						{#each feedbackChirho as fbChirho}
							<div class="flex items-center justify-between p-3 bg-slate-900 rounded-lg">
								<div class="flex items-center gap-3">
									<span class="px-2 py-1 rounded text-xs font-medium {getFeedbackTypeBadgeChirho(fbChirho.typeChirho)}">
										{fbChirho.typeChirho.replace('_', ' ')}
									</span>
									<span class="text-slate-300 truncate max-w-xs">{fbChirho.contentPreviewChirho || 'No preview'}</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="text-sm text-slate-500">{formatRelativeDateChirho(fbChirho.createdAtChirho)}</span>
									<span class="px-2 py-1 rounded text-xs font-medium {fbChirho.statusChirho === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-600/20 text-slate-400'}">
										{fbChirho.statusChirho}
									</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Quick Stats -->
			<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
				<h3 class="text-lg font-bold mb-4">Quick Stats</h3>
				<div class="space-y-4">
					<div class="flex justify-between items-center">
						<span class="text-slate-400">Donations Made</span>
						<span class="font-bold text-rose-400">{donationStatsChirho?.totalDonationsChirho || 0}</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-slate-400">Total Donated</span>
						<span class="font-bold text-emerald-400">
							${(donationStatsChirho?.totalAmountChirho || 0).toLocaleString()}
						</span>
					</div>
					<div class="flex justify-between items-center">
						<span class="text-slate-400">Feedback Submitted</span>
						<span class="font-bold">{feedbackChirho.length}</span>
					</div>
				</div>
			</div>

			<!-- Assigned Orphanage -->
			{#if orphanageChirho}
				<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
					<h3 class="text-lg font-bold mb-4 flex items-center gap-2">
						<span aria-hidden="true">🏠</span>
						Your Orphanage
					</h3>
					<div class="space-y-3">
						<div>
							<a href="/orphanages-chirho/{orphanageChirho.idChirho}" class="text-rose-400 hover:text-rose-300 font-medium text-lg">
								{orphanageChirho.nameChirho}
							</a>
							<p class="text-sm text-slate-500">{orphanageChirho.countryChirho}</p>
						</div>
						<div class="flex gap-2">
							<span class="px-2 py-1 rounded text-xs font-medium {orphanageChirho.verificationStatusChirho === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
								{orphanageChirho.verificationStatusChirho}
							</span>
							{#if !orphanageChirho.isActiveChirho}
								<span class="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">Inactive</span>
							{/if}
						</div>
						<div class="border-t border-slate-700 pt-3 mt-3">
							<p class="text-sm text-slate-400">Children: <span class="text-white font-medium">{orphanageChirho.childrenCountChirho || 0}</span></p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Quick Actions -->
			<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
				<h3 class="text-lg font-bold mb-4">Quick Actions</h3>
				<div class="space-y-2">
					<a href="/orphanages-chirho" class="block w-full text-center py-2 px-4 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
						Browse Orphanages
					</a>
					<a href="/feedback-chirho" class="block w-full text-center py-2 px-4 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">
						Submit Feedback
					</a>
					<a href="https://kingdominvest.ing" class="block w-full text-center py-2 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white hover:opacity-90 transition-opacity" target="_blank" rel="noopener noreferrer">
						Support an Orphanage
					</a>
				</div>
			</div>

			<!-- Recent Activity -->
			{#if recentActivityChirho.length > 0}
				<div class="bg-slate-800 rounded-xl border border-slate-700 p-6">
					<h3 class="text-lg font-bold mb-4">Recent Activity</h3>
					<div class="space-y-3">
						{#each recentActivityChirho.slice(0, 5) as activityChirho}
							<div class="flex items-center gap-3 text-sm">
								<div class="w-2 h-2 rounded-full bg-rose-500"></div>
								<span class="text-slate-400 capitalize">{activityChirho.actionChirho?.replace(/_/g, ' ')}</span>
								<span class="text-slate-500 ml-auto">{formatRelativeDateChirho(activityChirho.createdAtChirho)}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
