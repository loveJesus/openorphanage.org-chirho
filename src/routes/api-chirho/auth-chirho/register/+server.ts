// For God so loved the world that He gave His only begotten Son...
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { getKvChirho, KvHelperChirho } from '$lib/server/kv_chirho';
import { registerUserChirho } from '$lib/server/auth_chirho';
import { checkRateLimitChirho, createRateLimitHeadersChirho, getClientIpChirho } from '$lib/server/security_chirho';
import { sendEmailChirho, createWelcomeEmailChirho } from '$lib/server/email_chirho';
import { usersChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';

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

			// Send welcome email and verification email asynchronously
			if (platform.context && platform.env.MASTER_2SMTP_API_KEY_CHIRHO) {
				platform.context.waitUntil((async () => {
					// Send welcome email
					const welcomeEmailChirho = createWelcomeEmailChirho(nameChirho);
					await sendEmailChirho(platform.env.MASTER_2SMTP_API_KEY_CHIRHO!, {
						toChirho: emailChirho,
						subjectChirho: welcomeEmailChirho.subjectChirho,
						htmlChirho: welcomeEmailChirho.htmlChirho,
						textChirho: welcomeEmailChirho.textChirho
					});

					// Get user ID for verification token
					const dbChirho = getDbChirho(platform);
					const usersFoundChirho = await dbChirho
						.select({ idChirho: usersChirho.idChirho })
						.from(usersChirho)
						.where(eq(usersChirho.emailChirho, emailChirho.trim().toLowerCase()))
						.limit(1);

					if (usersFoundChirho.length > 0) {
						const userIdChirho = usersFoundChirho[0].idChirho;
						const kvHelperChirho = new KvHelperChirho(platform.env.KV_CHIRHO);

						// Generate verification token
						const verificationTokenChirho = crypto.randomUUID();

						// Store token in KV with 24 hour expiry
						await kvHelperChirho.setChirho(
							`email-verification:${verificationTokenChirho}`,
							JSON.stringify({
								userIdChirho,
								emailChirho: emailChirho.trim().toLowerCase(),
								createdAtChirho: new Date().toISOString()
							}),
							86400 // 24 hours
						);

						// Send verification email
						const verifyUrlChirho = `${platform.env.SITE_URL_CHIRHO || 'https://openorphanage.org'}/auth-chirho/verify-email-chirho?token=${verificationTokenChirho}`;

						await sendEmailChirho(platform.env.MASTER_2SMTP_API_KEY_CHIRHO!, {
							toChirho: emailChirho,
							subjectChirho: 'Verify Your OpenOrphanage Email',
							htmlChirho: `
								<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
									<div style="background: linear-gradient(to right, #f43f5e, #14b8a6); padding: 2px; border-radius: 16px;">
										<div style="background: #1e293b; padding: 32px; border-radius: 14px;">
											<h1 style="color: white; margin: 0 0 16px 0;">Verify Your Email</h1>
											<p style="color: #94a3b8; margin: 0 0 24px 0;">
												Hello${nameChirho ? ` ${nameChirho}` : ''},
											</p>
											<p style="color: #94a3b8; margin: 0 0 24px 0;">
												Please click the button below to verify your email address and complete your OpenOrphanage account setup.
											</p>
											<a href="${verifyUrlChirho}" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #14b8a6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
												Verify Email Address
											</a>
											<p style="color: #64748b; font-size: 14px; margin: 24px 0 0 0;">
												This link expires in 24 hours.
											</p>
											<hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;">
											<p style="color: #64748b; font-size: 12px; margin: 0;">
												In Jesus' Name - OpenOrphanage<br>
												Part of FaithStack
											</p>
										</div>
									</div>
								</div>
							`,
							textChirho: `
Verify Your Email Address

Hello${nameChirho ? ` ${nameChirho}` : ''},

Please click the link below to verify your email address:

${verifyUrlChirho}

This link expires in 24 hours.

In Jesus' Name - OpenOrphanage
							`
						});
					}
				})());
			}
		}

		return json(resultChirho, { headers: createRateLimitHeadersChirho(rateLimitChirho) });
	} catch (errorChirho) {
		console.error('Registration error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Internal server error' }, { status: 500 });
	}
};
