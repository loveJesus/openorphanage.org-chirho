<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Confirm Newsletter Subscription — OpenOrphanage</title>
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-teal-950/10 to-slate-950">
	<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
			{#if data.successChirho}
				<div class="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold mb-4 text-teal-400">
					{data.alreadyConfirmedChirho ? 'Already Subscribed!' : 'Subscription Confirmed!'}
				</h1>
				<p class="text-slate-300 mb-6">{data.messageChirho}</p>
				<p class="text-slate-400 text-sm mb-8">
					You'll receive occasional updates about orphanage stories, urgent needs, and ways you can help.
				</p>
				<a
					href="/orphanages-chirho"
					class="inline-block bg-gradient-to-r from-rose-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
				>
					Explore Orphanages
				</a>
			{:else}
				<div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold mb-4 text-red-400">Confirmation Failed</h1>
				<p class="text-slate-300 mb-6">{data.errorChirho}</p>
				<a
					href="/"
					class="inline-block bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors"
				>
					Return Home
				</a>
			{/if}
		</div>

		<div class="mt-8 text-center">
			<blockquote class="text-slate-400 italic">
				"Defend the weak and the fatherless; uphold the cause of the poor and the oppressed."
				<cite class="block mt-2 text-teal-400 not-italic">— Psalm 82:3</cite>
			</blockquote>
		</div>
	</div>
</section>
