<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let emailChirho = $state('');
	let passwordChirho = $state('');
	let errorChirho = $state('');
	let loadingChirho = $state(false);

	// Check for OAuth errors in URL
	const oauthErrorChirho = $derived($page.url.searchParams.get('error'));

	// Map OAuth errors to user-friendly messages
	const oauthErrorMessagesChirho: Record<string, string> = {
		oauth_not_configured: 'OAuth is not configured. Please try email login.',
		missing_params: 'Login failed. Please try again.',
		invalid_state: 'Login session expired. Please try again.',
		token_exchange_failed: 'Could not complete login. Please try again.',
		userinfo_failed: 'Could not retrieve your account info. Please try again.',
		oauth_failed: 'Login failed. Please try again.',
		access_denied: 'You denied access. Please try again if this was a mistake.'
	};

	const displayErrorChirho = $derived(
		oauthErrorChirho
			? oauthErrorMessagesChirho[oauthErrorChirho] || 'Login failed. Please try again.'
			: errorChirho
	);

	async function handleSubmitChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		loadingChirho = true;
		errorChirho = '';

		try {
			const responseChirho = await fetch('/api-chirho/auth-chirho/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ emailChirho, passwordChirho })
			});

			const resultChirho = await responseChirho.json();

			if (resultChirho.successChirho) {
				goto('/dashboard-chirho');
			} else {
				errorChirho = resultChirho.errorChirho || 'Login failed';
			}
		} catch (errChirho) {
			errorChirho = 'Network error. Please try again.';
		} finally {
			loadingChirho = false;
		}
	}

	function handleGoogleLoginChirho() {
		window.location.href = '/api-chirho/auth-chirho/oauth-chirho/google-chirho';
	}
</script>

<svelte:head>
	<title>Login — OpenOrphanage</title>
</svelte:head>

<section class="min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-b from-slate-950 via-rose-950/10 to-slate-950">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
				<span class="text-3xl">🏠</span>
			</div>
			<h1 class="text-3xl font-bold mb-2">Welcome Back</h1>
			<p class="text-slate-400">Sign in to your OpenOrphanage account</p>
		</div>

		<div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-6">
			<!-- OAuth Login Options -->
			<div class="space-y-3">
				<button
					type="button"
					onclick={handleGoogleLoginChirho}
					class="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24">
						<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					Continue with Google
				</button>
			</div>

			<!-- Divider -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-slate-600"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="px-4 bg-slate-800/50 text-slate-400">or continue with email</span>
				</div>
			</div>

			<!-- Email/Password Form -->
			<form onsubmit={handleSubmitChirho} class="space-y-6">
				<div>
					<label for="email-chirho" class="block text-sm font-medium mb-2">Email</label>
					<input
						type="email"
						id="email-chirho"
						bind:value={emailChirho}
						required
						class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
						placeholder="your@email.com"
					/>
				</div>

				<div>
					<label for="password-chirho" class="block text-sm font-medium mb-2">Password</label>
					<input
						type="password"
						id="password-chirho"
						bind:value={passwordChirho}
						required
						class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
						placeholder="••••••••"
					/>
				</div>

				{#if displayErrorChirho}
					<div class="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
						{displayErrorChirho}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loadingChirho}
					class="w-full bg-gradient-to-r from-rose-500 to-teal-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
				>
					{loadingChirho ? 'Signing in...' : 'Sign In'}
				</button>

				<p class="text-center text-slate-400 text-sm">
					Don't have an account?
					<a href="/auth-chirho/register-chirho" class="text-rose-400 hover:text-rose-300">Register</a>
				</p>
			</form>
		</div>
	</div>
</section>
