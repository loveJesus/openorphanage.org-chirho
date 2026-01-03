// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho } from '$lib/server/schema_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { createSessionCookieChirho } from '$lib/server/auth_chirho';
import { eq, or } from 'drizzle-orm';

interface AppleUserInfoChirho {
	subChirho: string; // Apple's unique user ID
	emailChirho: string;
	nameChirho: string;
}

interface AppleTokenClaimsChirho {
	iss: string;
	aud: string;
	exp: number;
	iat: number;
	sub: string;
	email?: string;
	email_verified?: string | boolean;
	is_private_email?: string | boolean;
	auth_time?: number;
}

interface AppleUserDataChirho {
	name?: {
		firstName?: string;
		lastName?: string;
	};
	email?: string;
}

/**
 * Generate Apple client_secret JWT
 * Apple requires the client_secret to be a signed JWT
 */
async function generateClientSecretChirho(
	teamIdChirho: string,
	clientIdChirho: string,
	keyIdChirho: string,
	privateKeyPemChirho: string
): Promise<string> {
	const nowChirho = Math.floor(Date.now() / 1000);
	const expirationChirho = nowChirho + 86400 * 180; // 180 days (Apple max)

	// JWT Header
	const headerChirho = {
		alg: 'ES256',
		kid: keyIdChirho,
		typ: 'JWT'
	};

	// JWT Payload
	const payloadChirho = {
		iss: teamIdChirho,
		iat: nowChirho,
		exp: expirationChirho,
		aud: 'https://appleid.apple.com',
		sub: clientIdChirho
	};

	// Base64URL encode
	const base64UrlEncodeChirho = (dataChirho: object | Uint8Array): string => {
		let strChirho: string;
		if (dataChirho instanceof Uint8Array) {
			strChirho = String.fromCharCode(...dataChirho);
		} else {
			strChirho = JSON.stringify(dataChirho);
		}
		return btoa(strChirho).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
	};

	const headerB64Chirho = base64UrlEncodeChirho(headerChirho);
	const payloadB64Chirho = base64UrlEncodeChirho(payloadChirho);
	const messageChirho = `${headerB64Chirho}.${payloadB64Chirho}`;

	// Import the private key
	// Remove PEM headers and newlines
	const pemContentsChirho = privateKeyPemChirho
		.replace('-----BEGIN PRIVATE KEY-----', '')
		.replace('-----END PRIVATE KEY-----', '')
		.replace(/\s/g, '');

	const binaryDerChirho = Uint8Array.from(atob(pemContentsChirho), (cChirho) =>
		cChirho.charCodeAt(0)
	);

	const keyChirho = await crypto.subtle.importKey(
		'pkcs8',
		binaryDerChirho,
		{
			name: 'ECDSA',
			namedCurve: 'P-256'
		},
		false,
		['sign']
	);

	// Sign the message
	const signatureChirho = await crypto.subtle.sign(
		{
			name: 'ECDSA',
			hash: { name: 'SHA-256' }
		},
		keyChirho,
		new TextEncoder().encode(messageChirho)
	);

	const signatureB64Chirho = base64UrlEncodeChirho(new Uint8Array(signatureChirho));

	return `${messageChirho}.${signatureB64Chirho}`;
}

/**
 * Decode JWT without verification (id_token from Apple is already verified by Apple's response)
 */
function decodeIdTokenChirho(idTokenChirho: string): AppleTokenClaimsChirho {
	const partsChirho = idTokenChirho.split('.');
	if (partsChirho.length !== 3) {
		throw new Error('Invalid JWT format');
	}

	// Decode payload (second part)
	const payloadB64Chirho = partsChirho[1];
	// Add padding if needed
	const paddedChirho = payloadB64Chirho + '='.repeat((4 - (payloadB64Chirho.length % 4)) % 4);
	const payloadJsonChirho = atob(paddedChirho.replace(/-/g, '+').replace(/_/g, '/'));

	return JSON.parse(payloadJsonChirho);
}

/**
 * Handle Apple OAuth callback
 * Apple uses POST with form_post response mode
 * Exchanges code for tokens, extracts user info from id_token, creates/updates user, creates session
 */
export const POST: RequestHandler = async ({ request, url, platform, cookies }) => {
	const envChirho = platform?.env;

	// Apple sends data as form-urlencoded POST
	const formDataChirho = await request.formData();
	const codeChirho = formDataChirho.get('code') as string | null;
	const stateChirho = formDataChirho.get('state') as string | null;
	const idTokenChirho = formDataChirho.get('id_token') as string | null;
	const userDataRawChirho = formDataChirho.get('user') as string | null; // Only on first auth
	const errorChirho = formDataChirho.get('error') as string | null;

	// Handle OAuth errors
	if (errorChirho) {
		console.error('Apple OAuth error:', errorChirho);
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
	const clientIdChirho = envChirho?.APPLE_OAUTH_CLIENT_ID_CHIRHO;
	const teamIdChirho = envChirho?.APPLE_OAUTH_TEAM_ID_CHIRHO;
	const keyIdChirho = envChirho?.APPLE_OAUTH_KEY_ID_CHIRHO;
	const privateKeyChirho = envChirho?.APPLE_OAUTH_PRIVATE_KEY_CHIRHO;

	if (!clientIdChirho || !teamIdChirho || !keyIdChirho || !privateKeyChirho) {
		console.error('Apple OAuth credentials not fully configured');
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_not_configured');
	}

	try {
		// Generate client_secret JWT
		const clientSecretChirho = await generateClientSecretChirho(
			teamIdChirho,
			clientIdChirho,
			keyIdChirho,
			privateKeyChirho
		);

		// Build callback URL for token request
		const callbackUrlChirho = `${url.origin}/api-chirho/auth-chirho/oauth-chirho/apple-chirho/callback-chirho`;

		// Exchange code for tokens
		const tokenResponseChirho = await fetch('https://appleid.apple.com/auth/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: clientIdChirho,
				client_secret: clientSecretChirho,
				code: codeChirho,
				grant_type: 'authorization_code',
				redirect_uri: callbackUrlChirho
			})
		});

		if (!tokenResponseChirho.ok) {
			const errorDataChirho = await tokenResponseChirho.text();
			console.error('Apple token exchange failed:', errorDataChirho);
			throw redirect(302, '/auth-chirho/login-chirho?error=token_exchange_failed');
		}

		const tokensChirho = await tokenResponseChirho.json();

		if (tokensChirho.error) {
			console.error('Apple token error:', tokensChirho.error, tokensChirho.error_description);
			throw redirect(302, '/auth-chirho/login-chirho?error=token_exchange_failed');
		}

		// Use the id_token from the response (more reliable) or from the form POST
		const finalIdTokenChirho = tokensChirho.id_token || idTokenChirho;

		if (!finalIdTokenChirho) {
			console.error('No id_token from Apple');
			throw redirect(302, '/auth-chirho/login-chirho?error=no_id_token');
		}

		// Decode the id_token to get user info
		const tokenClaimsChirho = decodeIdTokenChirho(finalIdTokenChirho);

		// Extract email from token claims
		let emailChirho = tokenClaimsChirho.email;

		// Apple only sends user data (name) on the FIRST authorization
		// Subsequent logins won't include it, so we store it in our DB
		let userNameChirho = '';
		if (userDataRawChirho) {
			try {
				const appleUserDataChirho: AppleUserDataChirho = JSON.parse(userDataRawChirho);
				const firstNameChirho = appleUserDataChirho.name?.firstName || '';
				const lastNameChirho = appleUserDataChirho.name?.lastName || '';
				userNameChirho = `${firstNameChirho} ${lastNameChirho}`.trim();
				// Apple might also provide email here
				if (!emailChirho && appleUserDataChirho.email) {
					emailChirho = appleUserDataChirho.email;
				}
			} catch {
				console.warn('Failed to parse Apple user data');
			}
		}

		if (!emailChirho) {
			console.error('No email available from Apple');
			throw redirect(302, '/auth-chirho/login-chirho?error=no_email');
		}

		const userInfoChirho: AppleUserInfoChirho = {
			subChirho: tokenClaimsChirho.sub,
			emailChirho: emailChirho,
			nameChirho: userNameChirho || emailChirho.split('@')[0] // Fallback to email prefix
		};

		// Get database and KV helper
		const dbChirho = getDbChirho(platform);
		const kvHelperChirho = getKvChirho(platform);

		// Check if user exists by Apple ID or email
		const existingUserChirho = await dbChirho
			.select()
			.from(usersChirho)
			.where(
				or(
					eq(usersChirho.appleIdChirho, userInfoChirho.subChirho),
					eq(usersChirho.emailChirho, userInfoChirho.emailChirho.toLowerCase())
				)
			)
			.get();

		let userIdChirho: number;
		let userRoleChirho: 'public' | 'donor' | 'staff' | 'admin' | 'super_admin' = 'public';
		let orphanageIdChirho: number | undefined;

		if (existingUserChirho) {
			// User exists - update Apple ID if not set
			userIdChirho = existingUserChirho.idChirho;
			userRoleChirho = existingUserChirho.roleChirho;
			orphanageIdChirho = existingUserChirho.orphanageIdChirho ?? undefined;

			if (!existingUserChirho.appleIdChirho) {
				// Link Apple account to existing user
				await dbChirho
					.update(usersChirho)
					.set({
						appleIdChirho: userInfoChirho.subChirho,
						// Only update name if we have one and user doesn't have one
						...(userInfoChirho.nameChirho &&
							!existingUserChirho.nameChirho && { nameChirho: userInfoChirho.nameChirho }),
						emailVerifiedChirho: true, // Apple emails are verified
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
					appleIdChirho: userInfoChirho.subChirho,
					authProviderChirho: 'apple',
					emailVerifiedChirho: true, // Apple emails are verified
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
		console.error('Apple OAuth callback error:', errChirho);
		throw redirect(302, '/auth-chirho/login-chirho?error=oauth_failed');
	}
};

/**
 * Handle GET requests (in case Apple redirects with GET in some scenarios)
 * This redirects to login with an error since Apple should use POST
 */
export const GET: RequestHandler = async () => {
	throw redirect(302, '/auth-chirho/login-chirho?error=invalid_method');
};
