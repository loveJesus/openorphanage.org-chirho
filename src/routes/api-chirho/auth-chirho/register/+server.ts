// For God so loved the world that He gave His only begotten Son...
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { registerUserChirho } from '$lib/server/auth_chirho';
import { checkRateLimitChirho, createRateLimitHeadersChirho, getClientIpChirho } from '$lib/server/security_chirho';
import { sendEmailChirho, createWelcomeEmailChirho } from '$lib/server/email_chirho';

export const POST: RequestHandler = async ({ request, platform, cookies }) => {
	try {
		if (!platform?.env) {
			return json({ successChirho: false, errorChirho: 'Platform not available' }, { status: 500 });
		}

		const kvChirho = getKvChirho(platform);

		// Rate limiting
		const ipChirho = getClientIpChirho(request);
		const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'auth/register');

		if (!rateLimitChirho.allowedChirho) {
			return json(
				{ successChirho: false, errorChirho: 'Too many registration attempts. Please try again later.' },
				{ status: 429, headers: createRateLimitHeadersChirho(rateLimitChirho) }
			);
		}

		const { nameChirho, emailChirho, passwordChirho } = await request.json();

		if (!nameChirho || !emailChirho || !passwordChirho) {
			return json({ successChirho: false, errorChirho: 'All fields are required' }, { status: 400 });
		}

		const dbChirho = getDbChirho(platform);
		const resultChirho = await registerUserChirho(dbChirho, kvChirho, emailChirho, passwordChirho, nameChirho);

		if (resultChirho.successChirho && resultChirho.tokenChirho) {
			// Set session cookie
			cookies.set('session_chirho', resultChirho.tokenChirho, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 30 * 24 * 60 * 60 // 30 days
			});

			// Send welcome email asynchronously
			if (platform.context && platform.env.MASTER_2SMTP_API_KEY_CHIRHO) {
				platform.context.waitUntil((async () => {
					const welcomeEmailChirho = createWelcomeEmailChirho(nameChirho);
					await sendEmailChirho(platform.env.MASTER_2SMTP_API_KEY_CHIRHO!, {
						toChirho: emailChirho,
						subjectChirho: welcomeEmailChirho.subjectChirho,
						htmlChirho: welcomeEmailChirho.htmlChirho,
						textChirho: welcomeEmailChirho.textChirho
					});
				})());
			}
		}

		return json(resultChirho, { headers: createRateLimitHeadersChirho(rateLimitChirho) });
	} catch (errorChirho) {
		console.error('Registration error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Internal server error' }, { status: 500 });
	}
};
