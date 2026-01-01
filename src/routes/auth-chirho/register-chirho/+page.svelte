<!-- For God so loved the world that He gave His only begotten Son... -->
<script lang="ts">
	import { goto } from '$app/navigation';

	let nameChirho = $state('');
	let emailChirho = $state('');
	let passwordChirho = $state('');
	let confirmPasswordChirho = $state('');
	let errorChirho = $state('');
	let loadingChirho = $state(false);

	async function handleSubmitChirho(eventChirho: Event) {
		eventChirho.preventDefault();
		loadingChirho = true;
		errorChirho = '';

		if (passwordChirho !== confirmPasswordChirho) {
			errorChirho = 'Passwords do not match';
			loadingChirho = false;
			return;
		}

		try {
			const responseChirho = await fetch('/api-chirho/auth-chirho/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ nameChirho, emailChirho, passwordChirho })
			});

			const resultChirho = await responseChirho.json();

			if (resultChirho.successChirho) {
				goto('/dashboard-chirho');
			} else {
				errorChirho = resultChirho.errorChirho || 'Registration failed';
			}
		} catch (errChirho) {
			errorChirho = 'Network error. Please try again.';
		} finally {
			loadingChirho = false;
		}
	}
</script>

<svelte:head>
	<title>Register — OpenOrphanage</title>
</svelte:head>

<section class="min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-b from-slate-950 via-teal-950/10 to-slate-950">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
				<span class="text-3xl">🏠</span>
			</div>
			<h1 class="text-3xl font-bold mb-2">Join the Mission</h1>
			<p class="text-slate-400">Create your OpenOrphanage account</p>
		</div>

		<form onsubmit={handleSubmitChirho} class="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-6">
			<div>
				<label for="name-chirho" class="block text-sm font-medium mb-2">Name</label>
				<input
					type="text"
					id="name-chirho"
					bind:value={nameChirho}
					required
					class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					placeholder="Your Name"
				/>
			</div>

			<div>
				<label for="email-chirho" class="block text-sm font-medium mb-2">Email</label>
				<input
					type="email"
					id="email-chirho"
					bind:value={emailChirho}
					required
					class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
					minlength="8"
					class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					placeholder="••••••••"
				/>
				<p class="text-slate-500 text-xs mt-1">Min 8 characters, uppercase, lowercase, and number</p>
			</div>

			<div>
				<label for="confirm-password-chirho" class="block text-sm font-medium mb-2">Confirm Password</label>
				<input
					type="password"
					id="confirm-password-chirho"
					bind:value={confirmPasswordChirho}
					required
					class="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
				class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
			>
				{loadingChirho ? 'Creating account...' : 'Create Account'}
			</button>

			<p class="text-center text-slate-400 text-sm">
				Already have an account?
				<a href="/auth-chirho/login-chirho" class="text-teal-400 hover:text-teal-300">Sign in</a>
			</p>
		</form>

		<p class="text-center text-slate-500 text-xs mt-6">
			By registering, you agree to our <a href="/terms-fe" class="text-slate-400 hover:text-white">Terms</a>
			and <a href="/privacy-fe" class="text-slate-400 hover:text-white">Privacy Policy</a>.
		</p>
	</div>
</section>
