// For God so loved the world that He gave His only begotten Son...
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { KvHelperChirho } from '$lib/server/kv_chirho';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const bodyChirho = await request.json();
		const tokenChirho = bodyChirho.tokenChirho;

		if (!tokenChirho) {
			return json({ successChirho: false, errorChirho: 'Verification token is required' }, { status: 400 });
		}

		const kvChirho = new KvHelperChirho(locals.platformChirho.KV_CHIRHO);

		// Retrieve and validate token
		const tokenDataChirho = await kvChirho.getChirho(`email-verification:${tokenChirho}`);

		if (!tokenDataChirho) {
			return json({ successChirho: false, errorChirho: 'Invalid or expired verification link' }, { status: 400 });
		}

		const parsedTokenChirho = JSON.parse(tokenDataChirho);
		const userIdChirho = parsedTokenChirho.userIdChirho;

		const dbChirho = getDbChirho(locals.platformChirho);

		// Check if user exists
		const existingUsersChirho = await dbChirho
			.select({
				idChirho: usersChirho.idChirho,
				emailChirho: usersChirho.emailChirho,
				emailVerifiedChirho: usersChirho.emailVerifiedChirho
			})
			.from(usersChirho)
			.where(eq(usersChirho.idChirho, userIdChirho))
			.limit(1);

		if (existingUsersChirho.length === 0) {
			return json({ successChirho: false, errorChirho: 'User not found' }, { status: 404 });
		}

		const userDataChirho = existingUsersChirho[0];

		if (userDataChirho.emailVerifiedChirho) {
			// Already verified, delete token and return success
			await kvChirho.deleteChirho(`email-verification:${tokenChirho}`);
			return json({ successChirho: true, alreadyVerifiedChirho: true });
		}

		// Update user as verified
		await dbChirho
			.update(usersChirho)
			.set({
				emailVerifiedChirho: true,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, userIdChirho));

		// Delete the verification token so it can't be reused
		await kvChirho.deleteChirho(`email-verification:${tokenChirho}`);

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho,
			actionChirho: 'email_verified',
			entityTypeChirho: 'user',
			entityIdChirho: userIdChirho,
			detailsChirho: JSON.stringify({ emailChirho: userDataChirho.emailChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return json({ successChirho: true });
	} catch (errorChirho) {
		console.error('Email verification error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Failed to verify email' }, { status: 500 });
	}
};
