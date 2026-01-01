// For God so loved the world that He gave His only begotten Son...
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { loginUserChirho, createSessionCookieChirho } from '$lib/server/auth_chirho';
import { checkRateLimitChirho, createRateLimitHeadersChirho, getClientIpChirho } from '$lib/server/security_chirho';

export const POST: RequestHandler = async ({ request, platform, cookies }) => {
	try {
		if (!platform?.env) {
			return json({ successChirho: false, errorChirho: 'Platform not available' }, { status: 500 });
		}

		const kvChirho = getKvChirho(platform);

		// Rate limiting
		const ipChirho = getClientIpChirho(request);
		const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'auth/login');

		if (!rateLimitChirho.allowedChirho) {
			return json(
				{ successChirho: false, errorChirho: 'Too many login attempts. Please try again later.' },
				{ status: 429, headers: createRateLimitHeadersChirho(rateLimitChirho) }
			);
		}

		const { emailChirho, passwordChirho } = await request.json();

		if (!emailChirho || !passwordChirho) {
			return json({ successChirho: false, errorChirho: 'Email and password required' }, { status: 400 });
		}

		const dbChirho = getDbChirho(platform);
		const resultChirho = await loginUserChirho(dbChirho, kvChirho, emailChirho, passwordChirho);

		if (resultChirho.successChirho && resultChirho.tokenChirho) {
			// Set session cookie
			cookies.set('session_chirho', resultChirho.tokenChirho, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 30 * 24 * 60 * 60 // 30 days
			});
		}

		return json(resultChirho, { headers: createRateLimitHeadersChirho(rateLimitChirho) });
	} catch (errorChirho) {
		console.error('Login error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Internal server error' }, { status: 500 });
	}
};
