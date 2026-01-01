<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let nameChirho = $state('');
	let emailChirho = $state('');
	let subjectChirho = $state('general');
	let messageChirho = $state('');
	let submittingChirho = $state(false);
	let successChirho = $state(false);
	let errorChirho = $state('');

	const subjectsChirho = [
		{ valueChirho: 'general', labelChirho: 'General Inquiry' },
		{ valueChirho: 'orphanage', labelChirho: 'Orphanage Registration' },
		{ valueChirho: 'donation', labelChirho: 'Donation Questions' },
		{ valueChirho: 'partnership', labelChirho: 'Partnership Opportunities' },
		{ valueChirho: 'technical', labelChirho: 'Technical Support' },
		{ valueChirho: 'privacy', labelChirho: 'Privacy Concerns' }
	];

	async function handleSubmitChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		submittingChirho = true;
		errorChirho = '';

		// For now, redirect to email since we don't have a contact form API
		const mailtoChirho = `mailto:contact.fe@openorphanage.org?subject=${encodeURIComponent(`[${subjectChirho}] ${nameChirho}`)}&body=${encodeURIComponent(`From: ${nameChirho} (${emailChirho})\n\n${messageChirho}`)}`;
		window.location.href = mailtoChirho;

		submittingChirho = false;
		successChirho = true;
	}
</script>

<svelte:head>
	<title>Contact Us — OpenOrphanage</title>
</svelte:head>

<section class="py-24 min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/10 to-slate-950">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold mb-4">
				<span class="text-gradient-compassion">Contact</span> Us
			</h1>
			<p class="text-slate-400 text-lg">
				We'd love to hear from you. Reach out with questions, partnership ideas, or just to say hello.
			</p>
		</div>

		<div class="grid md:grid-cols-2 gap-12">
			<!-- Contact Form -->
			<div>
				<form onsubmit={handleSubmitChirho} class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-6">
					<div>
						<label for="name-chirho" class="block text-sm font-medium mb-2">Your Name</label>
						<input
							type="text"
							id="name-chirho"
							bind:value={nameChirho}
							required
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
							placeholder="John Doe"
						/>
					</div>

					<div>
						<label for="email-chirho" class="block text-sm font-medium mb-2">Email Address</label>
						<input
							type="email"
							id="email-chirho"
							bind:value={emailChirho}
							required
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label for="subject-chirho" class="block text-sm font-medium mb-2">Subject</label>
						<select
							id="subject-chirho"
							bind:value={subjectChirho}
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
						>
							{#each subjectsChirho as subChirho}
								<option value={subChirho.valueChirho}>{subChirho.labelChirho}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="message-chirho" class="block text-sm font-medium mb-2">Message</label>
						<textarea
							id="message-chirho"
							bind:value={messageChirho}
							required
							rows="5"
							class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
							placeholder="How can we help you?"
						></textarea>
					</div>

					<button
						type="submit"
						disabled={submittingChirho}
						class="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
					>
						{submittingChirho ? 'Opening email...' : 'Send Message'}
					</button>
				</form>
			</div>

			<!-- Contact Info -->
			<div class="space-y-8">
				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h2 class="text-xl font-bold mb-4">📧 Email Contacts</h2>
					<ul class="space-y-4 text-slate-300">
						<li>
							<strong class="text-amber-400">General:</strong><br />
							<a href="mailto:contact.fe@openorphanage.org" class="hover:text-white">contact.fe@openorphanage.org</a>
						</li>
						<li>
							<strong class="text-amber-400">Support:</strong><br />
							<a href="mailto:support.fe@openorphanage.org" class="hover:text-white">support.fe@openorphanage.org</a>
						</li>
						<li>
							<strong class="text-amber-400">Privacy:</strong><br />
							<a href="mailto:privacy.fe@openorphanage.org" class="hover:text-white">privacy.fe@openorphanage.org</a>
						</li>
					</ul>
				</div>

				<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
					<h2 class="text-xl font-bold mb-4">🌍 Part of FaithStack</h2>
					<p class="text-slate-300 mb-4">
						OpenOrphanage is part of the FaithStack ecosystem, building technology for God's kingdom.
					</p>
					<a href="https://stack.faith" class="text-amber-400 hover:text-amber-300">
						Learn more about FaithStack →
					</a>
				</div>

				<div class="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6">
					<h2 class="text-xl font-bold text-rose-400 mb-4">🚨 Report Safety Concerns</h2>
					<p class="text-slate-300 mb-4">
						If you have concerns about child safety, please report immediately through our
						<a href="/feedback-chirho" class="text-rose-400 hover:text-rose-300">feedback form</a>
						selecting "Safety Concern" or email us directly.
					</p>
					<p class="text-slate-400 text-sm">
						Safety concerns are escalated immediately to our team.
					</p>
				</div>
			</div>
		</div>

		<div class="mt-12 text-center">
			<blockquote class="text-slate-400 italic">
				"Bear one another's burdens, and so fulfill the law of Christ."
				<cite class="block mt-2 text-amber-400 not-italic">— Galatians 6:2</cite>
			</blockquote>
		</div>
	</div>
</section>
