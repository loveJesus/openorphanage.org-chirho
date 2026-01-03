<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { page } from '$app/stores';

	const userChirho = $derived($page.data?.userChirho);

	let formDataChirho = $state({
		nameChirho: userChirho?.nameChirho || '',
		emailChirho: userChirho?.emailChirho || '',
		categoryChirho: 'general',
		subjectChirho: '',
		contentChirho: ''
	});

	let submittingChirho = $state(false);
	let successChirho = $state(false);
	let errorChirho = $state('');
	let ticketIdChirho = $state<number | null>(null);

	async function submitTicketChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		submittingChirho = true;
		errorChirho = '';

		try {
			const responseChirho = await fetch('/api-chirho/support-chirho', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formDataChirho)
			});

			const dataChirho = await responseChirho.json();

			if (!responseChirho.ok) {
				throw new Error(dataChirho.message || 'Failed to submit ticket');
			}

			successChirho = true;
			ticketIdChirho = dataChirho.ticketIdChirho;
		} catch (errChirho) {
			errorChirho = errChirho instanceof Error ? errChirho.message : 'An error occurred';
		} finally {
			submittingChirho = false;
		}
	}

	const categoriesChirho = [
		{ value: 'general', label: 'General Inquiry' },
		{ value: 'donation', label: 'Donation Issue' },
		{ value: 'technical', label: 'Technical Problem' },
		{ value: 'orphanage', label: 'Orphanage Related' },
		{ value: 'safety', label: 'Safety Concern' },
		{ value: 'gdpr', label: 'GDPR / Data Request' },
		{ value: 'other', label: 'Other' }
	];
</script>

<svelte:head>
	<title>Support | OpenOrphanage</title>
	<meta name="description" content="Get help with OpenOrphanage. Submit a support ticket." />
</svelte:head>

<section class="py-24 min-h-screen">
	<div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
		<h1 class="text-4xl font-bold mb-4 text-gradient-compassion">Support Center</h1>
		<p class="text-slate-400 mb-8">
			Need help? Submit a support ticket and we'll respond within 48 hours.
		</p>

		{#if successChirho}
			<div class="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
				<div class="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-green-400 mb-2">Ticket Submitted!</h2>
				<p class="text-slate-300 mb-4">
					Your ticket #{ticketIdChirho} has been received. We'll respond to your email within 48 hours.
				</p>
				<a
					href="/"
					class="inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-500 transition-colors"
				>
					Return Home
				</a>
			</div>
		{:else}
			<form onsubmit={submitTicketChirho} class="space-y-6">
				{#if errorChirho}
					<div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
						{errorChirho}
					</div>
				{/if}

				<div class="grid md:grid-cols-2 gap-6">
					<div>
						<label for="name" class="block text-sm font-medium text-slate-300 mb-2">
							Your Name
						</label>
						<input
							type="text"
							id="name"
							bind:value={formDataChirho.nameChirho}
							class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
							placeholder="John Doe"
						/>
					</div>

					<div>
						<label for="email" class="block text-sm font-medium text-slate-300 mb-2">
							Email Address <span class="text-rose-400">*</span>
						</label>
						<input
							type="email"
							id="email"
							bind:value={formDataChirho.emailChirho}
							required
							class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
							placeholder="your@email.com"
						/>
					</div>
				</div>

				<div>
					<label for="category" class="block text-sm font-medium text-slate-300 mb-2">
						Category
					</label>
					<select
						id="category"
						bind:value={formDataChirho.categoryChirho}
						class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
					>
						{#each categoriesChirho as catChirho}
							<option value={catChirho.value}>{catChirho.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="subject" class="block text-sm font-medium text-slate-300 mb-2">
						Subject <span class="text-rose-400">*</span>
					</label>
					<input
						type="text"
						id="subject"
						bind:value={formDataChirho.subjectChirho}
						required
						class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
						placeholder="Brief description of your issue"
					/>
				</div>

				<div>
					<label for="content" class="block text-sm font-medium text-slate-300 mb-2">
						Message <span class="text-rose-400">*</span>
					</label>
					<textarea
						id="content"
						bind:value={formDataChirho.contentChirho}
						required
						rows="6"
						class="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none resize-none"
						placeholder="Please describe your issue in detail..."
					></textarea>
				</div>

				<div class="flex items-center gap-4">
					<button
						type="submit"
						disabled={submittingChirho}
						class="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{submittingChirho ? 'Submitting...' : 'Submit Ticket'}
					</button>
					<a href="/contact-fe" class="text-slate-400 hover:text-white transition-colors">
						Or contact us directly
					</a>
				</div>
			</form>

			<div class="mt-12 pt-8 border-t border-slate-800">
				<h2 class="text-xl font-semibold text-white mb-4">Common Questions</h2>
				<div class="space-y-4">
					<details class="bg-slate-800/50 border border-slate-700 rounded-lg">
						<summary class="px-4 py-3 text-slate-300 cursor-pointer hover:text-white">
							How do I request a refund?
						</summary>
						<p class="px-4 pb-4 text-slate-400">
							Please see our <a href="/refund-policy-fe" class="text-teal-400 hover:text-teal-300">Refund Policy</a>.
							Submit a ticket with category "Donation Issue" for refund requests.
						</p>
					</details>

					<details class="bg-slate-800/50 border border-slate-700 rounded-lg">
						<summary class="px-4 py-3 text-slate-300 cursor-pointer hover:text-white">
							How do I request my data (GDPR)?
						</summary>
						<p class="px-4 pb-4 text-slate-400">
							If logged in, visit your dashboard to export your data. For data deletion,
							use the "GDPR / Data Request" category above.
						</p>
					</details>

					<details class="bg-slate-800/50 border border-slate-700 rounded-lg">
						<summary class="px-4 py-3 text-slate-300 cursor-pointer hover:text-white">
							How do I report a safety concern?
						</summary>
						<p class="px-4 pb-4 text-slate-400">
							Use the "Safety Concern" category for urgent matters. These tickets are
							prioritized and reviewed immediately.
						</p>
					</details>
				</div>
			</div>
		{/if}

		<div class="mt-8 pt-8 border-t border-slate-800">
			<p class="text-slate-500 text-sm italic">
				"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7
			</p>
			<p class="text-slate-500 text-sm mt-2">JESUS CHRIST IS LORD.</p>
		</div>
	</div>
</section>
