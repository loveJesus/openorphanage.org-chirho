<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let unsubscribedChirho = $state(false);
</script>

<svelte:head>
	<title>Unsubscribe from Newsletter — OpenOrphanage</title>
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/10 to-slate-950">
	<div class="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 text-center">
			{#if !data.validChirho}
				<div class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold mb-4 text-red-400">Invalid Link</h1>
				<p class="text-slate-300 mb-6">{data.errorChirho}</p>
			{:else if data.alreadyUnsubscribedChirho || form?.successChirho || unsubscribedChirho}
				<div class="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold mb-4 text-amber-400">Unsubscribed</h1>
				<p class="text-slate-300 mb-6">
					{data.emailChirho} has been unsubscribed from our newsletter.
				</p>
				<p class="text-slate-400 text-sm mb-8">
					We're sorry to see you go. You can always subscribe again from our website.
				</p>
			{:else}
				<div class="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold mb-4">Unsubscribe</h1>
				<p class="text-slate-300 mb-6">
					Are you sure you want to unsubscribe <strong>{data.emailChirho}</strong> from the OpenOrphanage newsletter?
				</p>

				{#if form?.errorChirho}
					<div class="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
						{form.errorChirho}
					</div>
				{/if}

				<form method="POST" use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success' && result.data?.successChirho) {
							unsubscribedChirho = true;
						}
						update();
					};
				}}>
					<input type="hidden" name="token" value={data.tokenChirho} />
					<div class="flex gap-4 justify-center">
						<a
							href="/"
							class="px-6 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
						>
							Cancel
						</a>
						<button
							type="submit"
							class="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors"
						>
							Unsubscribe
						</button>
					</div>
				</form>
			{/if}

			<div class="mt-8 pt-6 border-t border-slate-700">
				<a
					href="/"
					class="text-slate-400 hover:text-white transition-colors"
				>
					Return to OpenOrphanage
				</a>
			</div>
		</div>
	</div>
</section>
