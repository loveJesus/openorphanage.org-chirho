<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
</svelte:head>

<div class="min-h-screen bg-slate-950 text-white">
	<!-- Navigation -->
	<header class="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
		<nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
			<a href="/" class="flex items-center gap-3">
				<div class="w-10 h-10 bg-gradient-to-br from-rose-500 to-teal-500 rounded-xl flex items-center justify-center">
					<span class="text-white text-xl">🏠</span>
				</div>
				<span class="font-bold text-xl">
					<span class="text-gradient-compassion">Open</span><span class="text-white">Orphanage</span>
				</span>
			</a>

			<div class="hidden md:flex items-center gap-6">
				<a href="/journey-chirho" class="text-slate-300 hover:text-white transition-colors">The Journey</a>
				<a href="/orphanages-chirho" class="text-slate-300 hover:text-white transition-colors">Orphanages</a>
				<a href="https://kingdominvest.ing" class="text-slate-300 hover:text-white transition-colors">Support</a>
				<a href="/dashboard-chirho" class="bg-gradient-to-r from-rose-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
					Dashboard
				</a>
			</div>
		</nav>
	</header>

	<!-- Main Content -->
	<main class="pt-16">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-slate-900 border-t border-slate-800 py-12">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="grid md:grid-cols-4 gap-8">
				<!-- Brand -->
				<div>
					<div class="flex items-center gap-2 mb-4">
						<div class="w-8 h-8 bg-gradient-to-br from-rose-500 to-teal-500 rounded-lg flex items-center justify-center">
							<span class="text-white">🏠</span>
						</div>
						<span class="font-bold">OpenOrphanage</span>
					</div>
					<p class="text-slate-400 text-sm">
						Transparent orphan care administration. Part of FaithStack.
					</p>
				</div>

				<!-- The Journey -->
				<div>
					<h4 class="font-semibold mb-4 text-rose-400">The Journey</h4>
					<ul class="space-y-2 text-sm text-slate-400">
						<li><a href="https://openorphanage.org" class="hover:text-white transition-colors">1. OpenOrphanage</a></li>
						<li><a href="https://makingfriends.faith" class="hover:text-white transition-colors">2. MakingFriends</a></li>
						<li><a href="https://sonshinecoders.org" class="hover:text-white transition-colors">3. SonshineCoders</a></li>
						<li><a href="https://koinainia.com" class="hover:text-white transition-colors">4. Koinainia</a></li>
						<li><a href="https://perffection.com" class="hover:text-white transition-colors">5. Perffection</a></li>
					</ul>
				</div>

				<!-- FaithStack -->
				<div>
					<h4 class="font-semibold mb-4 text-teal-400">FaithStack</h4>
					<ul class="space-y-2 text-sm text-slate-400">
						<li><a href="https://stack.faith" class="hover:text-white transition-colors">Ecosystem</a></li>
						<li><a href="https://kingdominvest.ing" class="hover:text-white transition-colors">Support Projects</a></li>
						<li><a href="https://bible.systems" class="hover:text-white transition-colors">Bible.Systems</a></li>
					</ul>
				</div>

				<!-- Scripture -->
				<div>
					<h4 class="font-semibold mb-4 text-amber-400">Our Foundation</h4>
					<blockquote class="text-slate-400 text-sm italic">
						"Religion that is pure and undefiled before God the Father is this: to visit orphans and widows in their affliction."
						<cite class="block mt-2 text-amber-400 not-italic">— James 1:27</cite>
					</blockquote>
				</div>
			</div>

			<div class="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
				<p class="text-slate-500 text-sm">
					In Jesus' Name. Part of <a href="https://stack.faith" class="text-rose-400 hover:text-rose-300">FaithStack</a>.
				</p>
				<p class="text-slate-500 text-sm">
					JESUS CHRIST IS LORD
				</p>
			</div>
		</div>
	</footer>
</div>
