<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { page } from '$app/stores';

	let { data, children } = $props();

	const userChirho = $derived(data?.userChirho);

	const navItemsChirho = [
		{ hrefChirho: '/admin-chirho', labelChirho: 'Dashboard', iconChirho: '📊' },
		{ hrefChirho: '/admin-chirho/orphanages-chirho', labelChirho: 'Orphanages', iconChirho: '🏠' },
		{ hrefChirho: '/admin-chirho/needs-chirho', labelChirho: 'Needs', iconChirho: '📋' },
		{ hrefChirho: '/admin-chirho/feedback-chirho', labelChirho: 'Feedback', iconChirho: '💬' },
		{ hrefChirho: '/admin-chirho/users-chirho', labelChirho: 'Users', iconChirho: '👥' }
	];

	function isActiveChirho(hrefChirho: string) {
		if (hrefChirho === '/admin-chirho') {
			return $page.url.pathname === '/admin-chirho';
		}
		return $page.url.pathname.startsWith(hrefChirho);
	}
</script>

<div class="min-h-screen bg-slate-950 flex">
	<!-- Sidebar -->
	<aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">
		<!-- Logo -->
		<div class="p-6 border-b border-slate-800">
			<a href="/admin-chirho" class="flex items-center gap-3">
				<div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
					<span class="text-xl">🛡️</span>
				</div>
				<div>
					<span class="font-bold text-lg">Admin Panel</span>
					<span class="block text-xs text-amber-400 capitalize">{userChirho.roleChirho.replace('_', ' ')}</span>
				</div>
			</a>
		</div>

		<!-- Navigation -->
		<nav class="flex-grow p-4">
			<ul class="space-y-2">
				{#each navItemsChirho as itemChirho}
					<li>
						<a
							href={itemChirho.hrefChirho}
							class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors {isActiveChirho(itemChirho.hrefChirho)
								? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
								: 'text-slate-400 hover:bg-slate-800 hover:text-white'}"
						>
							<span class="text-xl">{itemChirho.iconChirho}</span>
							<span class="font-medium">{itemChirho.labelChirho}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- User section -->
		<div class="p-4 border-t border-slate-800">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-teal-500 rounded-full flex items-center justify-center">
					<span class="text-lg">{userChirho.emailChirho.charAt(0).toUpperCase()}</span>
				</div>
				<div class="overflow-hidden">
					<p class="font-medium truncate">{userChirho.emailChirho.split('@')[0]}</p>
					<p class="text-xs text-slate-500 truncate">{userChirho.emailChirho}</p>
				</div>
			</div>
			<div class="space-y-2">
				<a href="/dashboard-chirho" class="block text-center py-2 px-4 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-sm">
					User Dashboard
				</a>
				<a href="/auth-chirho/logout-chirho" class="block text-center py-2 px-4 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm">
					Sign Out
				</a>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-grow ml-64 p-8">
		{@render children()}
	</main>
</div>
