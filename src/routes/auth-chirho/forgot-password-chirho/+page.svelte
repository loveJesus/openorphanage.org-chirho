<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	let emailChirho = $state('');
	let submittedChirho = $state(false);
	let loadingChirho = $state(false);
	let errorChirho = $state('');

	async function handleSubmitChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		loadingChirho = true;
		errorChirho = '';

		try {
			const responseChirho = await fetch('/api-chirho/auth-chirho/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ emailChirho })
			});

			const dataChirho = await responseChirho.json();

			if (dataChirho.successChirho) {
				submittedChirho = true;
			} else {
				errorChirho = dataChirho.errorChirho || 'Failed to send reset email';
			}
		} catch (errChirho) {
			errorChirho = 'An error occurred. Please try again.';
		} finally {
			loadingChirho = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password | OpenOrphanage</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800 rounded-2xl border border-slate-700 p-8">
			<!-- Header -->
			<div class="text-center mb-8">
				<div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
					<span class="text-3xl" aria-hidden="true">🔑</span>
				</div>
				<h1 class="text-2xl font-bold">Reset Password</h1>
				<p class="text-slate-400 mt-2">Enter your email to receive a password reset link</p>
			</div>

			{#if submittedChirho}
				<!-- Success state -->
				<div class="text-center">
					<div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-emerald-400 mb-2">Check Your Email</h2>
					<p class="text-slate-400 mb-6">
						If an account exists with that email, we've sent password reset instructions.
					</p>
					<p class="text-sm text-slate-500 mb-6">
						Didn't receive the email? Check your spam folder or try again.
					</p>
					<div class="space-y-3">
						<button
							onclick={() => { submittedChirho = false; emailChirho = ''; }}
							class="w-full py-3 px-4 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
						>
							Try Again
						</button>
						<a
							href="/auth-chirho/login-chirho"
							class="block w-full py-3 px-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-center"
						>
							Back to Login
						</a>
					</div>
				</div>
			{:else}
				<!-- Form -->
				<form onsubmit={handleSubmitChirho} class="space-y-6">
					{#if errorChirho}
						<div class="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm" role="alert">
							{errorChirho}
						</div>
					{/if}

					<div>
						<label for="email" class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
						<input
							type="email"
							id="email"
							bind:value={emailChirho}
							required
							class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
							placeholder="Enter your email"
						/>
					</div>

					<button
						type="submit"
						disabled={loadingChirho}
						class="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if loadingChirho}
							<span class="inline-flex items-center gap-2">
								<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Sending...
							</span>
						{:else}
							Send Reset Link
						{/if}
					</button>

					<div class="text-center">
						<a href="/auth-chirho/login-chirho" class="text-rose-400 hover:text-rose-300 text-sm">
							Back to Login
						</a>
					</div>
				</form>
			{/if}
		</div>

		<!-- Security note -->
		<p class="text-center text-slate-500 text-sm mt-6">
			For security, password reset links expire after 1 hour.
		</p>
	</div>
</div>
