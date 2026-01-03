<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import '../app.css';
	import FeedbackBubbleChirho from '$lib/components/FeedbackBubbleChirho.svelte';
	import CookieConsentChirho from '$lib/components/CookieConsentChirho.svelte';

	let { children, data } = $props();

	const userChirho = $derived(data?.userChirho);
	const turnstileSiteKeyChirho = $derived(data?.turnstileSiteKeyChirho || '');

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
	<meta name="theme-color" content="#0f172a" />
	<meta name="author" content="FaithStack" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://openorphanage.org/" />
	<meta property="og:title" content="OpenOrphanage - Transparent Orphan Care" />
	<meta property="og:description" content="Discover verified orphanages, track donations transparently, and support children in need. Part of FaithStack." />
	<meta property="og:image" content="https://openorphanage.org/og-image-chirho.png" />
	<meta property="og:site_name" content="OpenOrphanage" />
	<meta property="og:locale" content="en_US" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://openorphanage.org/" />
	<meta name="twitter:title" content="OpenOrphanage - Transparent Orphan Care" />
	<meta name="twitter:description" content="Discover verified orphanages, track donations transparently, and support children in need." />
	<meta name="twitter:image" content="https://openorphanage.org/og-image-chirho.png" />

	<!-- Additional SEO -->
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://openorphanage.org/" />

	<!-- Turnstile Script -->
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

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
				<a href="https://kingdominvest.ing/campaigns-chirho/openorphanage-campaign-chirho" class="text-slate-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-950 rounded px-2 py-1" target="_blank" rel="noopener noreferrer">
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
						href="https://kingdominvest.ing/campaigns-chirho/openorphanage-campaign-chirho"
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
	<footer class="bg-slate-900 border-t border-slate-800 py-12">
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
					<h2 class="font-semibold mb-4 text-teal-400">Legal & Support</h2>
					<ul class="space-y-2 text-sm text-slate-400" aria-label="Legal and support links">
						<li><a href="/privacy-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Privacy Policy</a></li>
						<li><a href="/terms-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Terms of Service</a></li>
						<li><a href="/cookie-policy-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Cookie Policy</a></li>
						<li><a href="/refund-policy-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Refund Policy</a></li>
						<li><a href="/accessibility-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Accessibility</a></li>
						<li><a href="/contact-fe" class="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">Contact Us</a></li>
					</ul>
				</div>

				<!-- Newsletter -->
				<div>
					<h2 class="font-semibold mb-4 text-amber-400">Stay Updated</h2>
					<p class="text-slate-400 text-sm mb-4">Get occasional updates on orphanage stories and how you can help.</p>
					<form
						id="footer-newsletter-form"
						class="space-y-2"
						onsubmit={(eChirho) => {
							eChirho.preventDefault();
							const formChirho = eChirho.currentTarget as HTMLFormElement;
							const emailChirho = (formChirho.querySelector('input[type=email]') as HTMLInputElement).value;
							const submitBtnChirho = formChirho.querySelector('button[type=submit]') as HTMLButtonElement;
							const messageChirho = formChirho.querySelector('.newsletter-message-chirho') as HTMLElement;
							const turnstileInputChirho = formChirho.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement | null;
							const turnstileTokenChirho = turnstileInputChirho?.value || '';

							if (!turnstileTokenChirho && turnstileSiteKeyChirho) {
								messageChirho.textContent = 'Please complete the security check.';
								messageChirho.className = 'newsletter-message-chirho text-xs text-red-400 mt-2';
								return;
							}

							submitBtnChirho.disabled = true;
							submitBtnChirho.textContent = 'Subscribing...';

							fetch('/api-chirho/newsletter-chirho/subscribe-chirho', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ emailChirho, sourceChirho: 'footer', turnstileTokenChirho })
							})
								.then(rChirho => rChirho.json())
								.then(dataChirho => {
									if (dataChirho.successChirho) {
										messageChirho.textContent = dataChirho.messageChirho;
										messageChirho.className = 'newsletter-message-chirho text-xs text-teal-400 mt-2';
										formChirho.reset();
										// Reset Turnstile widget
										if (window.turnstile) {
											window.turnstile.reset();
										}
									} else {
										messageChirho.textContent = dataChirho.errorChirho || 'An error occurred';
										messageChirho.className = 'newsletter-message-chirho text-xs text-red-400 mt-2';
									}
								})
								.catch(() => {
									messageChirho.textContent = 'An error occurred. Please try again.';
									messageChirho.className = 'newsletter-message-chirho text-xs text-red-400 mt-2';
								})
								.finally(() => {
									submitBtnChirho.disabled = false;
									submitBtnChirho.textContent = 'Subscribe';
								});
						}}
					>
						<div class="flex gap-2">
							<label for="footer-newsletter-email" class="sr-only">Email address</label>
							<input
								type="email"
								id="footer-newsletter-email"
								placeholder="your@email.com"
								required
								class="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
							/>
							<button
								type="submit"
								class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
							>
								Subscribe
							</button>
						</div>
						{#if turnstileSiteKeyChirho}
							<div class="cf-turnstile mt-2" data-sitekey={turnstileSiteKeyChirho} data-theme="dark" data-size="compact"></div>
						{/if}
						<p class="newsletter-message-chirho text-xs text-slate-500 mt-2">No spam, unsubscribe anytime.</p>
					</form>
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
				<div class="flex items-center gap-3 text-slate-500 text-sm">
					<p class="font-medium">JESUS CHRIST IS LORD</p>
					<span class="text-slate-700">|</span>
					<a href="https://perffection.com" target="_blank" rel="noopener noreferrer" class="hover:text-rose-400 transition-colors" title="Perffection - Faith Excellence">fe</a>
					<span class="text-slate-700">|</span>
					<a href="https://lovejesus.software" target="_blank" rel="noopener noreferrer" class="hover:text-rose-400 transition-colors" title="loveJesus Software">loveJesus</a>
					<span class="text-slate-700">|</span>
					<a href="http://jesusfilm.org/watch/jesus.html/english.html" target="_blank" rel="noopener noreferrer" class="hover:text-amber-400 transition-colors text-lg" title="Watch the Jesus Film">☧</a>
				</div>
			</div>
		</div>
	</footer>

	<!-- Feedback Bubble -->
	{#if turnstileSiteKeyChirho}
		<FeedbackBubbleChirho {userChirho} {turnstileSiteKeyChirho} />
	{/if}

	<!-- Cookie Consent Banner -->
	<CookieConsentChirho />
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
