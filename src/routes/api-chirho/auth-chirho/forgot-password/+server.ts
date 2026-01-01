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
	const kvChirho = new KvHelperChirho(locals.platformChirho.KV_CHIRHO);

	// Rate limiting
	const ipChirho = getClientIpChirho(request);
	const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'auth/password-reset');

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
		const bodyChirho = await request.json();
		const emailChirho = bodyChirho.emailChirho?.trim().toLowerCase();

		if (!emailChirho) {
			return json({ successChirho: false, errorChirho: 'Email is required' }, { status: 400 });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		// Look up user - don't reveal if user exists or not
		const existingUsersChirho = await dbChirho
			.select({ idChirho: usersChirho.idChirho, emailChirho: usersChirho.emailChirho })
			.from(usersChirho)
			.where(eq(usersChirho.emailChirho, emailChirho))
			.limit(1);

		// Always return success to prevent email enumeration
		if (existingUsersChirho.length === 0) {
			return json({ successChirho: true });
		}

		const userChirho = existingUsersChirho[0];

		// Generate reset token (UUID)
		const resetTokenChirho = crypto.randomUUID();

		// Store token in KV with 1 hour expiry
		await kvChirho.setChirho(
			`password-reset:${resetTokenChirho}`,
			JSON.stringify({
				userIdChirho: userChirho.idChirho,
				emailChirho: userChirho.emailChirho,
				createdAtChirho: new Date().toISOString()
			}),
			3600 // 1 hour
		);

		// Send reset email
		const resetUrlChirho = `${locals.platformChirho.SITE_URL_CHIRHO}/auth-chirho/reset-password-chirho?token=${resetTokenChirho}`;

		await sendEmailChirho(
			env.MASTER_2SMTP_API_KEY_CHIRHO || '',
			{
				toChirho: userChirho.emailChirho,
				subjectChirho: 'Reset Your OpenOrphanage Password',
				htmlChirho: `
					<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
						<div style="background: linear-gradient(to right, #f43f5e, #14b8a6); padding: 2px; border-radius: 16px;">
							<div style="background: #1e293b; padding: 32px; border-radius: 14px;">
								<h1 style="color: white; margin: 0 0 16px 0;">Password Reset Request</h1>
								<p style="color: #94a3b8; margin: 0 0 24px 0;">
									We received a request to reset your password for your OpenOrphanage account.
								</p>
								<p style="color: #94a3b8; margin: 0 0 24px 0;">
									Click the button below to reset your password. This link expires in 1 hour.
								</p>
								<a href="${resetUrlChirho}" style="display: inline-block; background: linear-gradient(to right, #f43f5e, #14b8a6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold;">
									Reset Password
								</a>
								<p style="color: #64748b; font-size: 14px; margin: 24px 0 0 0;">
									If you didn't request this, you can safely ignore this email.
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
Password Reset Request

We received a request to reset your password for your OpenOrphanage account.

Click here to reset your password: ${resetUrlChirho}

This link expires in 1 hour.

If you didn't request this, you can safely ignore this email.

In Jesus' Name - OpenOrphanage
				`
			}
		);

		return json({ successChirho: true });
	} catch (errorChirho) {
		console.error('Password reset error:', errorChirho);
		// Don't reveal internal errors
		return json({ successChirho: true });
	}
};
