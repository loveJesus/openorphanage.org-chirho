<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const tokenChirho = $derived($page.url.searchParams.get('token') || '');

	let passwordChirho = $state('');
	let confirmPasswordChirho = $state('');
	let loadingChirho = $state(false);
	let errorChirho = $state('');
	let successChirho = $state(false);

	async function handleSubmitChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		errorChirho = '';

		// Validation
		if (passwordChirho.length < 8) {
			errorChirho = 'Password must be at least 8 characters';
			return;
		}

		if (!/[A-Z]/.test(passwordChirho) || !/[a-z]/.test(passwordChirho) || !/[0-9]/.test(passwordChirho)) {
			errorChirho = 'Password must contain uppercase, lowercase, and a number';
			return;
		}

		if (passwordChirho !== confirmPasswordChirho) {
			errorChirho = 'Passwords do not match';
			return;
		}

		loadingChirho = true;

		try {
			const responseChirho = await fetch('/api-chirho/auth-chirho/reset-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tokenChirho,
					passwordChirho
				})
			});

			const dataChirho = await responseChirho.json();

			if (dataChirho.successChirho) {
				successChirho = true;
				// Redirect to login after 3 seconds
				setTimeout(() => {
					goto('/auth-chirho/login-chirho');
				}, 3000);
			} else {
				errorChirho = dataChirho.errorChirho || 'Failed to reset password';
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
					<span class="text-3xl" aria-hidden="true">🔐</span>
				</div>
				<h1 class="text-2xl font-bold">Set New Password</h1>
				<p class="text-slate-400 mt-2">Enter your new password below</p>
			</div>

			{#if !tokenChirho}
				<!-- No token error -->
				<div class="text-center">
					<div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-red-400 mb-2">Invalid Link</h2>
					<p class="text-slate-400 mb-6">
						This password reset link is invalid or missing the required token.
					</p>
					<a
						href="/auth-chirho/forgot-password-chirho"
						class="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white text-center font-medium hover:opacity-90 transition-opacity"
					>
						Request New Reset Link
					</a>
				</div>
			{:else if successChirho}
				<!-- Success state -->
				<div class="text-center">
					<div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 class="text-xl font-bold text-emerald-400 mb-2">Password Reset!</h2>
					<p class="text-slate-400 mb-6">
						Your password has been successfully reset. You'll be redirected to login shortly.
					</p>
					<a
						href="/auth-chirho/login-chirho"
						class="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white text-center font-medium hover:opacity-90 transition-opacity"
					>
						Go to Login Now
					</a>
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
						<label for="password" class="block text-sm font-medium text-slate-300 mb-2">New Password</label>
						<input
							type="password"
							id="password"
							bind:value={passwordChirho}
							required
							minlength="8"
							class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
							placeholder="Enter new password"
						/>
						<p class="text-xs text-slate-500 mt-1">Min 8 characters with uppercase, lowercase, and number</p>
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPasswordChirho}
							required
							class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
							placeholder="Confirm new password"
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
								Resetting...
							</span>
						{:else}
							Reset Password
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
	</div>
</div>
