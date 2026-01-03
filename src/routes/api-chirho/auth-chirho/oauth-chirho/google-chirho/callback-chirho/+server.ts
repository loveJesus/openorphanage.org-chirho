// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho } from '$lib/server/schema_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { createSessionCookieChirho } from '$lib/server/auth_chirho';
import { eq, or } from 'drizzle-orm';

interface GoogleUserInfoChirho {
	idChirho: string;
	emailChirho: string;
	nameChirho: string;
	pictureChirho: string;
	verifiedEmailChirho: boolean;
}

/**
 * Handle Google OAuth callback
 * Exchanges code for tokens, fetches user info, creates/updates user, creates session
 */
export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const envChirho = platform?.env;

	// Get OAuth parameters from URL
	const codeChirho = url.searchParams.get('code');
	const stateChirho = url.searchParams.get('state');
	const errorChirho = url.searchParams.get('error');

	// Handle OAuth errors
	if (errorChirho) {
		console.error('Google OAuth error:', errorChirho);
		throw redirect(302, `/auth-chirho/login-chirho?error=${encodeURIComponent(errorChirho)}`);
	}

	if (!codeChirho || !stateChirho) {
		throw redirect(302, '/auth-chirho/login-chirho?error=missing_params');
	}

	// Verify state to prevent CSRF
	const kvChirho = envChirho?.KV_CHIRHO;
	if (kvChirho) {
		const storedStateChirho = await kvChirho.get(`oauth_state:${stateChirho}`);
		if (!storedStateChirho) {
			throw redirect(302, '/auth-chirho/login-chirho?error=invalid_state');
		}
		// Clean up used state
		await kvChirho.delete(`oauth_state:${stateChirho}`);
	}

	// Get credentials
	const clientIdChirho = envChirho?.GOOGLE_OAUTH_CLIENT_ID_CHIRHO;
	const clientSecretChirho = envChirho?.GOOGLE_OAUTH_CLIENT_SECRET_CHIRHO;

	if (!clientIdChirho || !clientSecretChirho) {
		console.error('Google OAuth credentials not configured');
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_not_configured');
	}

	const callbackUrlChirho = `${url.origin}/api-chirho/auth-chirho/oauth-chirho/google-chirho/callback-chirho`;

	try {
		// Exchange code for tokens
		const tokenResponseChirho = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				code: codeChirho,
				client_id: clientIdChirho,
				client_secret: clientSecretChirho,
				redirect_uri: callbackUrlChirho,
				grant_type: 'authorization_code'
			})
		});

		if (!tokenResponseChirho.ok) {
			const errorDataChirho = await tokenResponseChirho.text();
			console.error('Token exchange failed:', errorDataChirho);
			throw redirect(302, '/auth-chirho/login-chirho?error=token_exchange_failed');
		}

		const tokensChirho = await tokenResponseChirho.json();
		const accessTokenChirho = tokensChirho.access_token;

		// Fetch user info from Google
		const userInfoResponseChirho = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: { Authorization: `Bearer ${accessTokenChirho}` }
		});

		if (!userInfoResponseChirho.ok) {
			console.error('Failed to fetch user info');
			throw redirect(302, '/auth-chirho/login-chirho?error=userinfo_failed');
		}

		const googleUserChirho = await userInfoResponseChirho.json();
		const userInfoChirho: GoogleUserInfoChirho = {
			idChirho: googleUserChirho.id,
			emailChirho: googleUserChirho.email,
			nameChirho: googleUserChirho.name || googleUserChirho.email.split('@')[0],
			pictureChirho: googleUserChirho.picture || '',
			verifiedEmailChirho: googleUserChirho.verified_email || false
		};

		// Get database and KV helper
		const dbChirho = getDbChirho(platform);
		const kvHelperChirho = getKvChirho(platform);

		// Check if user exists by Google ID or email
		const existingUserChirho = await dbChirho
			.select()
			.from(usersChirho)
			.where(
				or(
					eq(usersChirho.googleIdChirho, userInfoChirho.idChirho),
					eq(usersChirho.emailChirho, userInfoChirho.emailChirho.toLowerCase())
				)
			)
			.get();

		let userIdChirho: number;
		let userRoleChirho: 'public' | 'donor' | 'staff' | 'admin' | 'super_admin' = 'public';
		let orphanageIdChirho: number | undefined;

		if (existingUserChirho) {
			// User exists - update Google ID if not set
			userIdChirho = existingUserChirho.idChirho;
			userRoleChirho = existingUserChirho.roleChirho;
			orphanageIdChirho = existingUserChirho.orphanageIdChirho ?? undefined;

			if (!existingUserChirho.googleIdChirho) {
				// Link Google account to existing user
				await dbChirho
					.update(usersChirho)
					.set({
						googleIdChirho: userInfoChirho.idChirho,
						avatarUrlChirho: existingUserChirho.avatarUrlChirho || userInfoChirho.pictureChirho,
						emailVerifiedChirho: userInfoChirho.verifiedEmailChirho,
						updatedAtChirho: new Date().toISOString()
					})
					.where(eq(usersChirho.idChirho, userIdChirho));
			}
		} else {
			// Create new user
			const resultChirho = await dbChirho
				.insert(usersChirho)
				.values({
					emailChirho: userInfoChirho.emailChirho.toLowerCase(),
					nameChirho: userInfoChirho.nameChirho,
					avatarUrlChirho: userInfoChirho.pictureChirho,
					googleIdChirho: userInfoChirho.idChirho,
					authProviderChirho: 'google',
					emailVerifiedChirho: userInfoChirho.verifiedEmailChirho,
					roleChirho: 'public',
					createdAtChirho: new Date().toISOString(),
					updatedAtChirho: new Date().toISOString()
				})
				.returning({ idChirho: usersChirho.idChirho });

			userIdChirho = resultChirho[0].idChirho;
		}

		// Create session
		const sessionTokenChirho = crypto.randomUUID();
		await kvHelperChirho.createSessionChirho(sessionTokenChirho, {
			userIdChirho: userIdChirho.toString(),
			emailChirho: userInfoChirho.emailChirho.toLowerCase(),
			roleChirho: userRoleChirho,
			orphanageIdChirho: orphanageIdChirho?.toString()
		});

		// Set session cookie
		const cookieValueChirho = createSessionCookieChirho(sessionTokenChirho);
		const cookiePartsChirho = cookieValueChirho.split(';');
		const cookieNameValueChirho = cookiePartsChirho[0].split('=');

		cookies.set(cookieNameValueChirho[0], cookieNameValueChirho[1], {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 30 * 24 * 60 * 60 // 30 days
		});

		// Redirect to dashboard or home
		throw redirect(302, '/dashboard-chirho');
	} catch (errChirho) {
		if (errChirho instanceof Response) {
			throw errChirho; // Re-throw redirects
		}
		console.error('Google OAuth callback error:', errChirho);
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_failed');
	}
};
