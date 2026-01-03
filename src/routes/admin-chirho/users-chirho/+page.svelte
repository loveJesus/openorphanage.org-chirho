<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const usersChirho = $derived(data.usersChirho || []);
	const paginationChirho = $derived(data.paginationChirho);
	const filtersChirho = $derived(data.filtersChirho);
	const roleCountsChirho = $derived(data.roleCountsChirho);
	const orphanagesChirho = $derived(data.orphanagesChirho || []);

	let searchInputChirho = $state('');
	let roleFilterChirho = $state('all');

	// Sync initial values from server
	$effect(() => {
		if (filtersChirho) {
			searchInputChirho = filtersChirho.searchChirho || '';
			roleFilterChirho = filtersChirho.roleChirho || 'all';
		}
	});

	function applyFiltersChirho() {
		const paramsChirho = new URLSearchParams();
		if (searchInputChirho) paramsChirho.set('search', searchInputChirho);
		if (roleFilterChirho !== 'all') paramsChirho.set('role', roleFilterChirho);
		window.location.href = `/admin-chirho/users-chirho?${paramsChirho.toString()}`;
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

	function formatDateChirho(dateStrChirho: string | null) {
		if (!dateStrChirho) return 'N/A';
		return new Date(dateStrChirho).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	const rolesChirho = ['public', 'donor', 'staff', 'admin', 'super_admin'];
</script>

<svelte:head>
	<title>Manage Users | OpenOrphanage Admin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-bold">Manage Users</h1>
		<p class="text-slate-400">View and manage platform users, assign roles and orphanages</p>
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

	<!-- Role Cards -->
	<div class="grid grid-cols-2 md:grid-cols-6 gap-4">
		<button
			onclick={() => { roleFilterChirho = 'all'; applyFiltersChirho(); }}
			class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {roleFilterChirho === 'all' ? 'border-rose-500' : 'border-slate-700'}"
		>
			<p class="text-slate-400 text-sm">Total</p>
			<p class="text-2xl font-bold">{roleCountsChirho?.total || 0}</p>
		</button>
		{#each rolesChirho as roleChirho}
			<button
				onclick={() => { roleFilterChirho = roleChirho; applyFiltersChirho(); }}
				class="bg-slate-800 rounded-xl p-4 text-left hover:bg-slate-700 transition-colors border {roleFilterChirho === roleChirho ? 'border-rose-500' : 'border-slate-700'}"
			>
				<p class="text-slate-400 text-sm capitalize">{roleChirho.replace('_', ' ')}</p>
				<p class="text-2xl font-bold">{roleCountsChirho?.[roleChirho] || 0}</p>
			</button>
		{/each}
	</div>

	<!-- Search -->
	<div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
		<div class="flex flex-col sm:flex-row gap-4">
			<div class="flex-grow">
				<label for="search" class="sr-only">Search users</label>
				<input
					type="text"
					id="search"
					bind:value={searchInputChirho}
					placeholder="Search by email or name..."
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

	<!-- Users Table -->
	<div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-slate-900">
					<tr>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">User</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Role</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Orphanage</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Status</th>
						<th class="text-left px-4 py-3 text-sm font-medium text-slate-400">Joined</th>
						<th class="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-700">
					{#each usersChirho as userChirho (userChirho.idChirho)}
						<tr class="hover:bg-slate-700/50 transition-colors {!userChirho.isActiveChirho ? 'opacity-50' : ''}">
							<td class="px-4 py-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
										{userChirho.emailChirho?.charAt(0).toUpperCase() || '?'}
									</div>
									<div>
										<p class="font-medium">{userChirho.nameChirho || 'Unnamed'}</p>
										<p class="text-sm text-slate-500">{userChirho.emailChirho}</p>
									</div>
								</div>
							</td>
							<td class="px-4 py-4">
								<form method="POST" action="?/updateRole" use:enhance class="inline">
									<input type="hidden" name="userId" value={userChirho.idChirho} />
									<select
										name="role"
										class="bg-transparent border border-slate-600 rounded-lg px-2 py-1 text-sm {getRoleBadgeChirho(userChirho.roleChirho)} focus:outline-none focus:ring-2 focus:ring-rose-500"
										onchange={(e) => e.target.form?.requestSubmit()}
									>
										{#each rolesChirho as roleChirho}
											<option value={roleChirho} selected={userChirho.roleChirho === roleChirho} class="bg-slate-900 text-white">
												{roleChirho.replace('_', ' ')}
											</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="px-4 py-4">
								<form method="POST" action="?/assignOrphanage" use:enhance class="inline">
									<input type="hidden" name="userId" value={userChirho.idChirho} />
									<select
										name="orphanageId"
										class="bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
										onchange={(e) => e.target.form?.requestSubmit()}
									>
										<option value="" class="bg-slate-900">None</option>
										{#each orphanagesChirho as orphChirho}
											<option value={orphChirho.idChirho} selected={userChirho.orphanageIdChirho === orphChirho.idChirho} class="bg-slate-900">
												{orphChirho.nameChirho}
											</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="px-4 py-4">
								<div class="flex items-center gap-2">
									{#if userChirho.isActiveChirho}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
											Active
										</span>
									{:else}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
											Inactive
										</span>
									{/if}
									{#if userChirho.emailVerifiedChirho}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-400 border border-teal-500/30">
											Verified
										</span>
									{/if}
								</div>
							</td>
							<td class="px-4 py-4 text-slate-400 text-sm">
								{formatDateChirho(userChirho.createdAtChirho)}
							</td>
							<td class="px-4 py-4">
								<div class="flex items-center justify-end gap-2">
									<!-- Toggle Active -->
									<form method="POST" action="?/toggleActive" use:enhance>
										<input type="hidden" name="userId" value={userChirho.idChirho} />
										<input type="hidden" name="isActive" value={userChirho.isActiveChirho} />
										<button
											type="submit"
											class="p-2 text-slate-400 hover:text-amber-400 transition-colors"
											title={userChirho.isActiveChirho ? 'Deactivate user' : 'Activate user'}
										>
											{#if userChirho.isActiveChirho}
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
								<p class="text-lg">No users found</p>
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
							href="?page={paginationChirho.pageChirho - 1}&search={filtersChirho.searchChirho}&role={filtersChirho.roleChirho}"
							class="px-3 py-1 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
						>
							Previous
						</a>
					{/if}
					{#if paginationChirho.pageChirho < paginationChirho.totalPagesChirho}
						<a
							href="?page={paginationChirho.pageChirho + 1}&search={filtersChirho.searchChirho}&role={filtersChirho.roleChirho}"
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
