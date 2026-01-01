// For God so loved the world that He gave His only begotten Son...
import type { Handle } from '@sveltejs/kit';
import { getSessionTokenFromCookiesChirho } from '$lib/server/auth_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize user as null
	event.locals.userChirho = null;
	event.locals.sessionTokenChirho = null;

	// Check for session cookie
	const cookieHeaderChirho = event.request.headers.get('cookie');
	const sessionTokenChirho = getSessionTokenFromCookiesChirho(cookieHeaderChirho);

	if (sessionTokenChirho && event.platform?.env?.KV_CHIRHO) {
		const kvChirho = new KvHelperChirho(event.platform.env.KV_CHIRHO);
		const sessionChirho = await kvChirho.getSessionChirho(sessionTokenChirho);

		if (sessionChirho) {
			event.locals.userChirho = {
				userIdChirho: sessionChirho.userIdChirho,
				emailChirho: sessionChirho.emailChirho,
				roleChirho: sessionChirho.roleChirho,
				orphanageIdChirho: sessionChirho.orphanageIdChirho
			};
			event.locals.sessionTokenChirho = sessionTokenChirho;

			// Refresh session if needed
			await kvChirho.refreshSessionChirho(sessionTokenChirho);
		}
	}

	// Resolve the request
	const responseChirho = await resolve(event);

	// Add security headers
	responseChirho.headers.set('X-Content-Type-Options', 'nosniff');
	responseChirho.headers.set('X-Frame-Options', 'DENY');
	responseChirho.headers.set('X-XSS-Protection', '1; mode=block');
	responseChirho.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	return responseChirho;
};
