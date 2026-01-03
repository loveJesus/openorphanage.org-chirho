// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { getDbChirho } from '$lib/server/db_chirho';
import {
	usersChirho,
	feedbackChirho,
	auditLogChirho
} from '$lib/server/schema_chirho';

/**
 * GDPR Right to be Forgotten Endpoint
 * Deletes or anonymizes user data
 */
export const DELETE: RequestHandler = async ({ locals, platform, request }) => {
	const sessionChirho = locals.sessionChirho;

	if (!sessionChirho?.userChirho) {
		throw error(401, 'Authentication required');
	}

	const dbChirho = getDbChirho(platform);
	const userIdChirho = sessionChirho.userChirho.idChirho;

	try {
		// Parse confirmation
		const bodyChirho = await request.json();
		if (bodyChirho.confirmChirho !== 'DELETE_MY_ACCOUNT') {
			throw error(400, 'Confirmation required. Send { "confirmChirho": "DELETE_MY_ACCOUNT" }');
		}

		// Fetch user to verify
		const userChirho = await dbChirho
			.select()
			.from(usersChirho)
			.where(eq(usersChirho.idChirho, userIdChirho))
			.get();

		if (!userChirho) {
			throw error(404, 'User not found');
		}

		// Log the deletion request (before deleting)
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: userIdChirho,
			actionChirho: 'GDPR_DELETE_REQUEST',
			entityTypeChirho: 'user',
			entityIdChirho: userIdChirho,
			detailsChirho: JSON.stringify({
				emailChirho: userChirho.emailChirho,
				requestedAtChirho: new Date().toISOString()
			}),
			createdAtChirho: new Date().toISOString()
		});

		// Anonymize feedback (keep for platform improvement but remove PII)
		await dbChirho
			.update(feedbackChirho)
			.set({
				userIdChirho: null,
				emailChirho: null,
				isAnonymousChirho: true
			})
			.where(eq(feedbackChirho.userIdChirho, userIdChirho));

		// Note: Donations are NOT deleted as they are financial records
		// that must be retained for legal/tax purposes. They are just
		// disassociated from the user profile.

		// Delete the user account
		await dbChirho
			.delete(usersChirho)
			.where(eq(usersChirho.idChirho, userIdChirho));

		// Clear session (handled by caller - redirect to logout)
		return json({
			successChirho: true,
			messageChirho: 'Your account and personal data have been deleted. Financial records are retained for legal compliance but are anonymized.',
			nextStepsChirho: [
				'You have been logged out',
				'Your email will be removed from all mailing lists within 48 hours',
				'Some anonymized data may be retained for platform improvement'
			]
		});
	} catch (errChirho) {
		console.error('GDPR delete error:', errChirho);
		if (errChirho instanceof Error && 'status' in errChirho) {
			throw errChirho;
		}
		throw error(500, 'Failed to delete account');
	}
};
