// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Initiate Apple OAuth login flow
 * Redirects to Apple's OAuth authorization screen
 *
 * Apple Sign In requires:
 * - APPLE_OAUTH_CLIENT_ID_CHIRHO: Your Service ID (com.example.app.auth)
 * - APPLE_OAUTH_TEAM_ID_CHIRHO: Your Apple Developer Team ID
 * - APPLE_OAUTH_KEY_ID_CHIRHO: The Key ID for your private key
 * - APPLE_OAUTH_PRIVATE_KEY_CHIRHO: The private key (PEM format) for signing client_secret JWT
 */
export const GET: RequestHandler = async ({ url, platform }) => {
	const envChirho = platform?.env;

	const clientIdChirho = envChirho?.APPLE_OAUTH_CLIENT_ID_CHIRHO;
	if (!clientIdChirho) {
		console.error('APPLE_OAUTH_CLIENT_ID_CHIRHO not configured');
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_not_configured');
	}

	// Build the callback URL dynamically
	const callbackUrlChirho = `${url.origin}/api-chirho/auth-chirho/oauth-chirho/apple-chirho/callback-chirho`;

	// Generate state for CSRF protection
	const stateChirho = crypto.randomUUID();

	// Store state in KV for verification
	const kvChirho = envChirho?.KV_CHIRHO;
	if (kvChirho) {
		await kvChirho.put(`oauth_state:${stateChirho}`, 'valid', { expirationTtl: 600 }); // 10 min
	}

	// Build Apple OAuth URL
	// Apple uses OpenID Connect, so we request the openid, email, and name scopes
	const appleAuthUrlChirho = new URL('https://appleid.apple.com/auth/authorize');
	appleAuthUrlChirho.searchParams.set('client_id', clientIdChirho);
	appleAuthUrlChirho.searchParams.set('redirect_uri', callbackUrlChirho);
	appleAuthUrlChirho.searchParams.set('response_type', 'code id_token');
	appleAuthUrlChirho.searchParams.set('response_mode', 'form_post'); // Apple uses POST for callback
	appleAuthUrlChirho.searchParams.set('scope', 'name email');
	appleAuthUrlChirho.searchParams.set('state', stateChirho);

	throw redirect(302, appleAuthUrlChirho.toString());
};
