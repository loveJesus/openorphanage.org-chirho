<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	const tokenChirho = $derived($page.url.searchParams.get('token') || '');

	let statusChirho = $state<'verifying' | 'success' | 'already_verified' | 'error'>('verifying');
	let errorMessageChirho = $state('');

	async function verifyEmailChirho() {
		if (!tokenChirho) {
			statusChirho = 'error';
			errorMessageChirho = 'No verification token provided';
			return;
		}

		try {
			const responseChirho = await fetch('/api-chirho/auth-chirho/verify-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tokenChirho })
			});

			const dataChirho = await responseChirho.json();

			if (dataChirho.successChirho) {
				if (dataChirho.alreadyVerifiedChirho) {
					statusChirho = 'already_verified';
				} else {
					statusChirho = 'success';
				}
				// Redirect to dashboard after 3 seconds
				setTimeout(() => {
					goto('/dashboard-chirho');
				}, 3000);
			} else {
				statusChirho = 'error';
				errorMessageChirho = dataChirho.errorChirho || 'Failed to verify email';
			}
		} catch (errChirho) {
			statusChirho = 'error';
			errorMessageChirho = 'An error occurred. Please try again.';
		}
	}

	onMount(() => {
		verifyEmailChirho();
	});
</script>

<svelte:head>
	<title>Verify Email | OpenOrphanage</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
	<div class="w-full max-w-md">
		<div class="bg-slate-800 rounded-2xl border border-slate-700 p-8">
			<!-- Header -->
			<div class="text-center mb-8">
				<div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
					{#if statusChirho === 'verifying'}
						<svg class="animate-spin h-8 w-8 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					{:else if statusChirho === 'success' || statusChirho === 'already_verified'}
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{/if}
				</div>

				{#if statusChirho === 'verifying'}
					<h1 class="text-2xl font-bold">Verifying Email...</h1>
					<p class="text-slate-400 mt-2">Please wait while we verify your email address</p>
				{:else if statusChirho === 'success'}
					<h1 class="text-2xl font-bold text-emerald-400">Email Verified!</h1>
					<p class="text-slate-400 mt-2">Your email has been successfully verified</p>
				{:else if statusChirho === 'already_verified'}
					<h1 class="text-2xl font-bold text-teal-400">Already Verified</h1>
					<p class="text-slate-400 mt-2">Your email is already verified</p>
				{:else}
					<h1 class="text-2xl font-bold text-red-400">Verification Failed</h1>
					<p class="text-slate-400 mt-2">{errorMessageChirho}</p>
				{/if}
			</div>

			<!-- Content based on status -->
			{#if statusChirho === 'success' || statusChirho === 'already_verified'}
				<div class="text-center">
					<div class="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<p class="text-slate-400 mb-6">
						You'll be redirected to your dashboard shortly.
					</p>
					<a
						href="/dashboard-chirho"
						class="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white text-center font-medium hover:opacity-90 transition-opacity"
					>
						Go to Dashboard Now
					</a>
				</div>
			{:else if statusChirho === 'error'}
				<div class="text-center">
					<div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<p class="text-slate-400 mb-6">
						The verification link may have expired or is invalid. You can request a new verification email from your dashboard.
					</p>
					<div class="space-y-3">
						<a
							href="/dashboard-chirho"
							class="block w-full py-3 px-4 rounded-lg bg-gradient-to-r from-rose-500 to-teal-500 text-white text-center font-medium hover:opacity-90 transition-opacity"
						>
							Go to Dashboard
						</a>
						<a
							href="/auth-chirho/login-chirho"
							class="block w-full py-3 px-4 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors text-center"
						>
							Back to Login
						</a>
					</div>
				</div>
			{:else}
				<!-- Loading state -->
				<div class="flex items-center justify-center py-8">
					<svg class="animate-spin h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				</div>
			{/if}
		</div>
	</div>
</div>
