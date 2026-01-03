// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho } from '$lib/server/schema_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { createSessionCookieChirho } from '$lib/server/auth_chirho';
import { eq, or } from 'drizzle-orm';

interface GitHubUserInfoChirho {
	idChirho: string;
	emailChirho: string;
	nameChirho: string;
	avatarUrlChirho: string;
	loginChirho: string;
}

interface GitHubEmailChirho {
	email: string;
	primary: boolean;
	verified: boolean;
	visibility: string | null;
}

/**
 * Handle GitHub OAuth callback
 * Exchanges code for tokens, fetches user info, creates/updates user, creates session
 */
export const GET: RequestHandler = async ({ url, platform, cookies }) => {
	const envChirho = platform?.env;

	// Get OAuth parameters from URL
	const codeChirho = url.searchParams.get('code');
	const stateChirho = url.searchParams.get('state');
	const errorChirho = url.searchParams.get('error');
	const errorDescriptionChirho = url.searchParams.get('error_description');

	// Handle OAuth errors
	if (errorChirho) {
		console.error('GitHub OAuth error:', errorChirho, errorDescriptionChirho);
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
	const clientIdChirho = envChirho?.GITHUB_OAUTH_CLIENT_ID_CHIRHO;
	const clientSecretChirho = envChirho?.GITHUB_OAUTH_CLIENT_SECRET_CHIRHO;

	if (!clientIdChirho || !clientSecretChirho) {
		console.error('GitHub OAuth credentials not configured');
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_not_configured');
	}

	try {
		// Exchange code for access token
		const tokenResponseChirho = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				client_id: clientIdChirho,
				client_secret: clientSecretChirho,
				code: codeChirho
			})
		});

		if (!tokenResponseChirho.ok) {
			const errorDataChirho = await tokenResponseChirho.text();
			console.error('Token exchange failed:', errorDataChirho);
			throw redirect(302, '/auth-chirho/login-chirho?error=token_exchange_failed');
		}

		const tokensChirho = await tokenResponseChirho.json();

		if (tokensChirho.error) {
			console.error('GitHub token error:', tokensChirho.error, tokensChirho.error_description);
			throw redirect(302, '/auth-chirho/login-chirho?error=token_exchange_failed');
		}

		const accessTokenChirho = tokensChirho.access_token;

		// Fetch user info from GitHub
		const userInfoResponseChirho = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${accessTokenChirho}`,
				Accept: 'application/vnd.github+json',
				'User-Agent': 'OpenOrphanage'
			}
		});

		if (!userInfoResponseChirho.ok) {
			console.error('Failed to fetch user info');
			throw redirect(302, '/auth-chirho/login-chirho?error=userinfo_failed');
		}

		const githubUserChirho = await userInfoResponseChirho.json();

		// GitHub doesn't always provide email in the user endpoint, need to fetch from /user/emails
		let emailChirho = githubUserChirho.email;

		if (!emailChirho) {
			// Fetch user's emails
			const emailsResponseChirho = await fetch('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${accessTokenChirho}`,
					Accept: 'application/vnd.github+json',
					'User-Agent': 'OpenOrphanage'
				}
			});

			if (emailsResponseChirho.ok) {
				const emailsChirho: GitHubEmailChirho[] = await emailsResponseChirho.json();
				// Find primary verified email
				const primaryEmailChirho = emailsChirho.find(
					(eChirho) => eChirho.primary && eChirho.verified
				);
				emailChirho = primaryEmailChirho?.email || emailsChirho[0]?.email;
			}
		}

		if (!emailChirho) {
			console.error('No email available from GitHub');
			throw redirect(302, '/auth-chirho/login-chirho?error=no_email');
		}

		const userInfoChirho: GitHubUserInfoChirho = {
			idChirho: githubUserChirho.id.toString(),
			emailChirho: emailChirho,
			nameChirho: githubUserChirho.name || githubUserChirho.login,
			avatarUrlChirho: githubUserChirho.avatar_url || '',
			loginChirho: githubUserChirho.login
		};

		// Get database and KV helper
		const dbChirho = getDbChirho(platform);
		const kvHelperChirho = getKvChirho(platform);

		// Check if user exists by GitHub ID or email
		const existingUserChirho = await dbChirho
			.select()
			.from(usersChirho)
			.where(
				or(
					eq(usersChirho.githubIdChirho, userInfoChirho.idChirho),
					eq(usersChirho.emailChirho, userInfoChirho.emailChirho.toLowerCase())
				)
			)
			.get();

		let userIdChirho: number;
		let userRoleChirho: 'public' | 'donor' | 'staff' | 'admin' | 'super_admin' = 'public';
		let orphanageIdChirho: number | undefined;

		if (existingUserChirho) {
			// User exists - update GitHub ID if not set
			userIdChirho = existingUserChirho.idChirho;
			userRoleChirho = existingUserChirho.roleChirho;
			orphanageIdChirho = existingUserChirho.orphanageIdChirho ?? undefined;

			if (!existingUserChirho.githubIdChirho) {
				// Link GitHub account to existing user
				await dbChirho
					.update(usersChirho)
					.set({
						githubIdChirho: userInfoChirho.idChirho,
						avatarUrlChirho: existingUserChirho.avatarUrlChirho || userInfoChirho.avatarUrlChirho,
						emailVerifiedChirho: true, // GitHub emails are verified
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
					avatarUrlChirho: userInfoChirho.avatarUrlChirho,
					githubIdChirho: userInfoChirho.idChirho,
					authProviderChirho: 'github',
					emailVerifiedChirho: true, // GitHub emails are verified
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

		// Redirect to dashboard
		throw redirect(302, '/dashboard-chirho');
	} catch (errChirho) {
		if (errChirho instanceof Response) {
			throw errChirho; // Re-throw redirects
		}
		console.error('GitHub OAuth callback error:', errChirho);
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_failed');
	}
};
