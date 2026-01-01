<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { goto } from '$app/navigation';

	let emailChirho = $state('');
	let passwordChirho = $state('');
	let errorChirho = $state('');
	let loadingChirho = $state(false);

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

		<form onsubmit={handleSubmitChirho} class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-6">
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

			{#if errorChirho}
				<div class="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
					{errorChirho}
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
</section>
