// For God so loved the world that He gave His only begotten Son...

interface TurnstileResponseChirho {
	success: boolean;
	'error-codes'?: string[];
	challenge_ts?: string;
	hostname?: string;
}

/**
 * Verify a Cloudflare Turnstile token
 * @param tokenChirho - The Turnstile token from the client
 * @param ipChirho - The client's IP address
 * @param secretKeyChirho - The Turnstile secret key
 * @returns true if valid, false otherwise
 */
export async function verifyTurnstileChirho(
	tokenChirho: string,
	ipChirho: string,
	secretKeyChirho: string | undefined
): Promise<boolean> {
	if (!secretKeyChirho) {
		console.warn('Turnstile secret key not configured - skipping verification');
		return true; // Skip verification if not configured (dev mode)
	}

	if (!tokenChirho) {
		console.warn('No Turnstile token provided');
		return false;
	}

	try {
		const formDataChirho = new FormData();
		formDataChirho.append('secret', secretKeyChirho);
		formDataChirho.append('response', tokenChirho);
		formDataChirho.append('remoteip', ipChirho);

		const responseChirho = await fetch(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{
				method: 'POST',
				body: formDataChirho
			}
		);

		const resultChirho: TurnstileResponseChirho = await responseChirho.json();

		if (!resultChirho.success && resultChirho['error-codes']) {
			console.warn('Turnstile verification failed:', resultChirho['error-codes']);
		}

		return resultChirho.success;
	} catch (errorChirho) {
		console.error('Turnstile verification error:', errorChirho);
		return false;
	}
}

/**
 * Helper to get Turnstile secret key from platform env
 */
export function getTurnstileSecretChirho(platform: App.Platform | undefined): string | undefined {
	return platform?.env?.TURNSTILE_SECRET_KEY_CHIRHO;
}
