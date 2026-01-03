// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Initiate GitHub OAuth login flow
 * Redirects to GitHub's OAuth authorization screen
 */
export const GET: RequestHandler = async ({ url, platform }) => {
	const envChirho = platform?.env;

	const clientIdChirho = envChirho?.GITHUB_OAUTH_CLIENT_ID_CHIRHO;
	if (!clientIdChirho) {
		console.error('GITHUB_OAUTH_CLIENT_ID_CHIRHO not configured');
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_not_configured');
	}

	// Build the callback URL dynamically
	const callbackUrlChirho = `${url.origin}/api-chirho/auth-chirho/oauth-chirho/github-chirho/callback-chirho`;

	// Generate state for CSRF protection
	const stateChirho = crypto.randomUUID();

	// Store state in KV for verification
	const kvChirho = envChirho?.KV_CHIRHO;
	if (kvChirho) {
		await kvChirho.put(`oauth_state:${stateChirho}`, 'valid', { expirationTtl: 600 }); // 10 min
	}

	// Build GitHub OAuth URL
	const githubAuthUrlChirho = new URL('https://github.com/login/oauth/authorize');
	githubAuthUrlChirho.searchParams.set('client_id', clientIdChirho);
	githubAuthUrlChirho.searchParams.set('redirect_uri', callbackUrlChirho);
	githubAuthUrlChirho.searchParams.set('scope', 'user:email read:user');
	githubAuthUrlChirho.searchParams.set('state', stateChirho);

	throw redirect(302, githubAuthUrlChirho.toString());
};
