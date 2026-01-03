// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Initiate Google OAuth login flow
 * Redirects to Google's OAuth consent screen
 */
export const GET: RequestHandler = async ({ url, platform }) => {
	const envChirho = platform?.env;

	const clientIdChirho = envChirho?.GOOGLE_OAUTH_CLIENT_ID_CHIRHO;
	if (!clientIdChirho) {
		console.error('GOOGLE_OAUTH_CLIENT_ID_CHIRHO not configured');
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_not_configured');
	}

	// Build the callback URL dynamically
	const callbackUrlChirho = `${url.origin}/api-chirho/auth-chirho/oauth-chirho/google-chirho/callback-chirho`;

	// Generate state for CSRF protection
	const stateChirho = crypto.randomUUID();

	// Store state in KV for verification (or use a signed cookie)
	const kvChirho = envChirho?.KV_CHIRHO;
	if (kvChirho) {
		await kvChirho.put(`oauth_state:${stateChirho}`, 'valid', { expirationTtl: 600 }); // 10 min
	}

	// Build Google OAuth URL
	const googleAuthUrlChirho = new URL('https://accounts.google.com/o/oauth2/v2/auth');
	googleAuthUrlChirho.searchParams.set('client_id', clientIdChirho);
	googleAuthUrlChirho.searchParams.set('redirect_uri', callbackUrlChirho);
	googleAuthUrlChirho.searchParams.set('response_type', 'code');
	googleAuthUrlChirho.searchParams.set('scope', 'openid email profile');
	googleAuthUrlChirho.searchParams.set('state', stateChirho);
	googleAuthUrlChirho.searchParams.set('access_type', 'offline');
	googleAuthUrlChirho.searchParams.set('prompt', 'consent');

	throw redirect(302, googleAuthUrlChirho.toString());
};
