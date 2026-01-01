<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let { data } = $props();

	const userChirho = $derived(data.userChirho);
</script>

<svelte:head>
	<title>Dashboard — OpenOrphanage</title>
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-teal-950/10 to-slate-950">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		{#if userChirho}
			<!-- Welcome Header -->
			<div class="mb-12">
				<h1 class="text-4xl font-bold mb-2">
					Welcome back, <span class="text-gradient-trust">{userChirho.emailChirho.split('@')[0]}</span>
				</h1>
				<p class="text-slate-400">
					Role: <span class="text-teal-400 capitalize">{userChirho.roleChirho.replace('_', ' ')}</span>
				</p>
			</div>

			<!-- Quick Actions -->
			<div class="grid md:grid-cols-3 gap-6 mb-12">
				<a href="/orphanages-chirho" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-rose-500/50 transition-colors card-hover">
					<div class="text-3xl mb-4">🏠</div>
					<h3 class="font-bold text-lg mb-2">Browse Orphanages</h3>
					<p class="text-slate-400 text-sm">Explore verified orphanages and their needs</p>
				</a>

				<a href="https://kingdominvest.ing" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-amber-500/50 transition-colors card-hover">
					<div class="text-3xl mb-4">💝</div>
					<h3 class="font-bold text-lg mb-2">Support a Need</h3>
					<p class="text-slate-400 text-sm">Donate to specific needs on KingdomInvest.ing</p>
				</a>

				<a href="/feedback-chirho" class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-purple-500/50 transition-colors card-hover">
					<div class="text-3xl mb-4">💬</div>
					<h3 class="font-bold text-lg mb-2">Give Feedback</h3>
					<p class="text-slate-400 text-sm">Help us improve this platform</p>
				</a>
			</div>

			<!-- Dashboard Stats Placeholder -->
			<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
				<h2 class="text-2xl font-bold mb-6">Your Impact</h2>

				<div class="grid md:grid-cols-4 gap-6">
					<div class="bg-slate-900/50 rounded-xl p-6 text-center">
						<div class="text-4xl font-bold text-rose-400 mb-2">0</div>
						<p class="text-slate-400 text-sm">Donations</p>
					</div>
					<div class="bg-slate-900/50 rounded-xl p-6 text-center">
						<div class="text-4xl font-bold text-teal-400 mb-2">$0</div>
						<p class="text-slate-400 text-sm">Total Given</p>
					</div>
					<div class="bg-slate-900/50 rounded-xl p-6 text-center">
						<div class="text-4xl font-bold text-amber-400 mb-2">0</div>
						<p class="text-slate-400 text-sm">Children Supported</p>
					</div>
					<div class="bg-slate-900/50 rounded-xl p-6 text-center">
						<div class="text-4xl font-bold text-purple-400 mb-2">0</div>
						<p class="text-slate-400 text-sm">Needs Fulfilled</p>
					</div>
				</div>

				<p class="text-slate-500 text-sm mt-6 text-center">
					Stats will populate as you engage with the platform
				</p>
			</div>

			<!-- Admin Section -->
			{#if userChirho.roleChirho === 'admin' || userChirho.roleChirho === 'super_admin'}
				<div class="mt-12">
					<h2 class="text-2xl font-bold mb-6 text-amber-400">Admin Tools</h2>
					<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						<a href="/admin-chirho/feedback-chirho" class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
							<div class="text-2xl mb-2">📝</div>
							<h3 class="font-semibold">Manage Feedback</h3>
						</a>
						<a href="/admin-chirho/orphanages-chirho" class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
							<div class="text-2xl mb-2">🏠</div>
							<h3 class="font-semibold">Manage Orphanages</h3>
						</a>
						<a href="/admin-chirho/users-chirho" class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
							<div class="text-2xl mb-2">👥</div>
							<h3 class="font-semibold">Manage Users</h3>
						</a>
						{#if userChirho.roleChirho === 'super_admin'}
							<a href="/admin-chirho" class="bg-red-500/10 border border-red-500/30 rounded-xl p-6 hover:border-red-500/50 transition-colors">
								<div class="text-2xl mb-2">⚙️</div>
								<h3 class="font-semibold">System Settings</h3>
							</a>
						{/if}
					</div>
				</div>
			{/if}
		{:else}
			<!-- Not logged in -->
			<div class="text-center py-24">
				<div class="w-24 h-24 bg-gradient-to-br from-rose-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
					<span class="text-5xl">🔐</span>
				</div>
				<h1 class="text-4xl font-bold mb-4">Sign In Required</h1>
				<p class="text-slate-400 text-lg mb-8">
					Please sign in or register to access your dashboard
				</p>
				<div class="flex gap-4 justify-center">
					<a href="/auth-chirho/login-chirho" class="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
						Sign In
					</a>
					<a href="/auth-chirho/register-chirho" class="bg-slate-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700">
						Register
					</a>
				</div>
			</div>
		{/if}
	</div>
</section>
