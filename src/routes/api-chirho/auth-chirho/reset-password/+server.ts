// For God so loved the world that He gave His only begotten Son...
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const bodyChirho = await request.json();
		const tokenChirho = bodyChirho.tokenChirho;
		const passwordChirho = bodyChirho.passwordChirho;

		if (!tokenChirho || !passwordChirho) {
			return json({ successChirho: false, errorChirho: 'Token and password are required' }, { status: 400 });
		}

		// Validate password complexity
		if (passwordChirho.length < 8) {
			return json({ successChirho: false, errorChirho: 'Password must be at least 8 characters' }, { status: 400 });
		}

		if (!/[A-Z]/.test(passwordChirho) || !/[a-z]/.test(passwordChirho) || !/[0-9]/.test(passwordChirho)) {
			return json({ successChirho: false, errorChirho: 'Password must contain uppercase, lowercase, and a number' }, { status: 400 });
		}

		const kvChirho = new KvHelperChirho(locals.platformChirho.KV_CHIRHO);

		// Retrieve and validate token
		const tokenDataChirho = await kvChirho.getChirho(`password-reset:${tokenChirho}`);

		if (!tokenDataChirho) {
			return json({ successChirho: false, errorChirho: 'Invalid or expired reset link' }, { status: 400 });
		}

		const parsedTokenChirho = JSON.parse(tokenDataChirho);
		const userIdChirho = parsedTokenChirho.userIdChirho;

		// Hash new password
		const passwordHashChirho = await bcrypt.hash(passwordChirho, 12);

		const dbChirho = getDbChirho(locals.platformChirho);

		// Update password
		await dbChirho
			.update(usersChirho)
			.set({
				passwordHashChirho,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, userIdChirho));

		// Delete the reset token so it can't be reused
		await kvChirho.deleteChirho(`password-reset:${tokenChirho}`);

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho,
			actionChirho: 'password_reset',
			entityTypeChirho: 'user',
			entityIdChirho: userIdChirho,
			detailsChirho: JSON.stringify({ methodChirho: 'email_reset' }),
			createdAtChirho: new Date().toISOString()
		});

		return json({ successChirho: true });
	} catch (errorChirho) {
		console.error('Password reset error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Failed to reset password' }, { status: 500 });
	}
};
