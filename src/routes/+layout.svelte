<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import '../app.css';

	let { children, data } = $props();

	const userChirho = $derived(data?.userChirho);

	// Mobile menu state
	let mobileMenuOpenChirho = $state(false);

	function toggleMobileMenuChirho() {
		mobileMenuOpenChirho = !mobileMenuOpenChirho;
	}

	function closeMobileMenuChirho() {
		mobileMenuOpenChirho = false;
	}
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
</svelte:head>

<!-- Skip to main content link for accessibility -->
<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-rose-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none"
>
	Skip to main content
</a>

<div class="min-h-screen bg-slate-950 text-white">
	<!-- Navigation -->
	<header class="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
			<a href="/" class="flex items-center gap-3" aria-label="OpenOrphanage - Home">
				<div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-teal-500 rounded-xl flex items-center justify-center" aria-hidden="true">
					<span class="text-white text-xl" role="img" aria-hidden="true">🏠</span>
				</div>
				<span class="font-bold text-xl">
					<span class="text-gradient-compassion">Open</span><span class="text-white">Orphanage</span>
				</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden md:flex items-center gap-6">
				<a href="/orphanages-chirho" class="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1">Orphanages</a>
				<a href="/feedback-chirho" class="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1">Feedback</a>
				<a href="https://kingdominvest.ing" class="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1" target="_blank" rel="noopener noreferrer">
					Support
					<span class="sr-only">(opens in new tab)</span>
				</a>

				{#if userChirho}
					<a href="/dashboard-chirho" class="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1">Dashboard</a>
					{#if userChirho.roleChirho === 'admin' || userChirho.roleChirho === 'super_admin'}
						<a href="/admin-chirho" class="text-amber-400 hover:text-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1">Admin</a>
					{/if}
					<a href="/auth-chirho/logout-chirho" class="bg-slate-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950">
						Logout
					</a>
				{:else}
					<a href="/auth-chirho/login-chirho" class="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1">Login</a>
					<a href="/auth-chirho/register-chirho" class="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950">
						Register
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<button
				class="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-lg"
				onclick={toggleMobileMenuChirho}
				aria-expanded={mobileMenuOpenChirho}
				aria-controls="mobile-menu"
				aria-label={mobileMenuOpenChirho ? 'Close menu' : 'Open menu'}
			>
				{#if mobileMenuOpenChirho}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				{:else}
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				{/if}
			</button>
		</nav>

		<!-- Mobile Navigation Menu -->
		{#if mobileMenuOpenChirho}
			<div
				id="mobile-menu"
				class="md:hidden bg-slate-900 border-b border-slate-800 animate-slideDown"
				role="navigation"
				aria-label="Mobile navigation"
			>
				<div class="px-4 py-4 space-y-3">
					<a
						href="/orphanages-chirho"
						class="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
						onclick={closeMobileMenuChirho}
					>
						<span aria-hidden="true" class="mr-2">🏠</span>
						Orphanages
					</a>
					<a
						href="/feedback-chirho"
						class="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
						onclick={closeMobileMenuChirho}
					>
						<span aria-hidden="true" class="mr-2">💬</span>
						Feedback
					</a>
					<a
						href="https://kingdominvest.ing"
						class="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span aria-hidden="true" class="mr-2">❤️</span>
						Support
						<span class="text-xs text-slate-500 ml-2">(external)</span>
					</a>

					<div class="border-t border-slate-800 pt-3 mt-3">
						{#if userChirho}
							<a
								href="/dashboard-chirho"
								class="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
								onclick={closeMobileMenuChirho}
							>
								<span aria-hidden="true" class="mr-2">📊</span>
								Dashboard
							</a>
							{#if userChirho.roleChirho === 'admin' || userChirho.roleChirho === 'super_admin'}
								<a
									href="/admin-chirho"
									class="block px-4 py-3 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
									onclick={closeMobileMenuChirho}
								>
									<span aria-hidden="true" class="mr-2">🛡️</span>
									Admin Panel
								</a>
							{/if}
							<a
								href="/auth-chirho/logout-chirho"
								class="block px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors mt-2"
							>
								<span aria-hidden="true" class="mr-2">🚪</span>
								Logout
							</a>
						{:else}
							<a
								href="/auth-chirho/login-chirho"
								class="block px-4 py-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
								onclick={closeMobileMenuChirho}
							>
								Login
							</a>
							<a
								href="/auth-chirho/register-chirho"
								class="block px-4 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white text-center font-medium mt-2"
								onclick={closeMobileMenuChirho}
							>
								Register
							</a>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</header>

	<!-- Main Content -->
	<main id="main-content" class="pt-16" tabindex="-1">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-slate-900 border-t border-slate-800 py-12" role="contentinfo">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-4 gap-8">
				<!-- Brand -->
				<div>
					<div class="flex items-center gap-2 mb-4">
						<div class="w-8 h-8 bg-gradient-to-br from-rose-500 to-teal-500 rounded-lg flex items-center justify-center" aria-hidden="true">
							<span aria-hidden="true">🏠</span>
						</div>
						<span class="font-bold">OpenOrphanage</span>
					</div>
					<p class="text-slate-400 text-sm">
						Transparent orphan care administration. Part of FaithStack.
					</p>
				</div>

				<!-- The Journey -->
				<div>
					<h2 class="font-semibold mb-4 text-rose-400">The Journey</h2>
					<ul class="space-y-2 text-sm text-slate-400" aria-label="FaithStack Journey platforms">
						<li><a href="https://openorphanage.org" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded" aria-current="page">1. OpenOrphanage</a></li>
						<li><a href="https://makingfriends.faith" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded">2. MakingFriends</a></li>
						<li><a href="https://sonshinecoders.org" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded">3. SonshineCoders</a></li>
						<li><a href="https://koinainia.com" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded">4. Koinainia</a></li>
						<li><a href="https://perffection.com" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 rounded">5. Perffection</a></li>
					</ul>
				</div>

				<!-- Legal -->
				<div>
					<h2 class="font-semibold mb-4 text-teal-400">Legal</h2>
					<ul class="space-y-2 text-sm text-slate-400" aria-label="Legal and support links">
						<li><a href="/privacy-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Privacy Policy</a></li>
						<li><a href="/terms-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Terms of Service</a></li>
						<li><a href="/contact-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Contact Us</a></li>
						<li><a href="/feedback-chirho" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Give Feedback</a></li>
					</ul>
				</div>

				<!-- Scripture -->
				<div>
					<h2 class="font-semibold mb-4 text-amber-400">Our Foundation</h2>
					<blockquote class="text-slate-400 text-sm italic">
						<p>"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."</p>
						<footer class="mt-2 text-amber-400 not-italic">
							<cite>— James 1:27</cite>
						</footer>
					</blockquote>
				</div>
			</div>

			<div class="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-slate-500 text-sm">
					In Jesus' Name. Part of <a href="https://stack.faith" class="text-rose-400 hover:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded">FaithStack</a>.
				</p>
				<a
					href="https://kingdominvest.ing/campaigns-chirho/openorphanage-campaign-chirho"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-teal-500 hover:from-rose-600 hover:to-teal-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900"
					aria-label="Support OpenOrphanage on KingdomInvest.ing (opens in new tab)"
				>
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
					</svg>
					Support Us
				</a>
				<p class="text-slate-500 text-sm font-medium">
					JESUS CHRIST IS LORD
				</p>
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-slideDown {
		animation: slideDown 0.2s ease-out;
	}
</style>
