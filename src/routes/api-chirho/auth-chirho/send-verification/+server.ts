// For God so loved the world that He gave His only begotten Son...
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { sendEmailChirho } from '$lib/server/email_chirho';
import { checkRateLimitChirho, getClientIpChirho } from '$lib/server/security_chirho';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userChirho = locals.userChirho;

	if (!userChirho) {
		return json({ successChirho: false, errorChirho: 'Authentication required' }, { status: 401 });
	}

	const kvChirho = new KvHelperChirho(locals.platformChirho.KV_CHIRHO);

	// Rate limiting
	const ipChirho = getClientIpChirho(request);
	const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'auth/verify-email');

	if (!rateLimitChirho.allowedChirho) {
		return json({
			successChirho: false,
			errorChirho: 'Too many requests. Please try again later.'
		}, {
			status: 429,
			headers: { 'Retry-After': rateLimitChirho.retryAfterSecondsChirho?.toString() || '3600' }
		});
	}

	try {
		const dbChirho = getDbChirho(locals.platformChirho);

		// Check if user exists and is not already verified
		const existingUsersChirho = await dbChirho
			.select({
				idChirho: usersChirho.idChirho,
				emailChirho: usersChirho.emailChirho,
				nameChirho: usersChirho.nameChirho,
				emailVerifiedChirho: usersChirho.emailVerifiedChirho
			})
			.from(usersChirho)
			.where(eq(usersChirho.idChirho, parseInt(userChirho.userIdChirho)))
			.limit(1);

		if (existingUsersChirho.length === 0) {
			return json({ successChirho: false, errorChirho: 'User not found' }, { status: 404 });
		}

		const userDataChirho = existingUsersChirho[0];

		if (userDataChirho.emailVerifiedChirho) {
			return json({ successChirho: false, errorChirho: 'Email is already verified' }, { status: 400 });
		}

		// Generate verification token
		const verificationTokenChirho = crypto.randomUUID();

		// Store token in KV with 24 hour expiry
		await kvChirho.setChirho(
			`email-verification:${verificationTokenChirho}`,
			JSON.stringify({
				userIdChirho: userDataChirho.idChirho,
				emailChirho: userDataChirho.emailChirho,
				createdAtChirho: new Date().toISOString()
			}),
			86400 // 24 hours
		);

		// Send verification email
		const verifyUrlChirho = `${locals.platformChirho.SITE_URL_CHIRHO}/auth-chirho/verify-email-chirho?token=${verificationTokenChirho}`;

		await sendEmailChirho(
			env.MASTER_2SMTP_API_KEY_CHIRHO || '',
			{
				toChirho: userDataChirho.emailChirho,
				subjectChirho: 'Verify Your OpenOrphanage Email',
				htmlChirho: `
					<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
						<div style="background: linear-gradient(to right, #f43f5e, #14b8a6); padding: 2px; border-radius: 16px;">
							<div style="background: #1e293b; padding: 32px; border-radius: 14px;">
								<h1 style="color: white; margin: 0 0 16px 0;">Verify Your Email</h1>
								<p style="color: #94a3b8; margin: 0 0 24px 0;">
									Hello${userDataChirho.nameChirho ? ` ${userDataChirho.nameChirho}` : ''},
								</p>
								<p style="color: #94a3b8; margin: 0 0 24px 0;">
									Please click the button below to verify your email address and complete your OpenOrphanage account setup.
								</p>
								<a href="${verifyUrlChirho}" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #14b8a6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
									Verify Email Address
								</a>
								<p style="color: #64748b; font-size: 14px; margin: 24px 0 0 0;">
									This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
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

Hello${userDataChirho.nameChirho ? ` ${userDataChirho.nameChirho}` : ''},

Please click the link below to verify your email address:

${verifyUrlChirho}

This link expires in 24 hours.

If you didn't create an account, you can safely ignore this email.

In Jesus' Name - OpenOrphanage
				`
			}
		);

		return json({ successChirho: true, messageChirho: 'Verification email sent' });
	} catch (errorChirho) {
		console.error('Send verification error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Failed to send verification email' }, { status: 500 });
	}
};
