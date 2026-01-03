// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { eq } from 'drizzle-orm';
import { getDbChirho } from '$lib/server/db_chirho';
import {
	usersChirho,
	donationsChirho,
	feedbackChirho
} from '$lib/server/schema_chirho';

/**
 * GDPR Data Export Endpoint
 * Returns all user data in a portable JSON format
 */
export const GET: RequestHandler = async ({ locals, platform }) => {
	const sessionChirho = locals.sessionChirho;

	if (!sessionChirho?.userChirho) {
		throw error(401, 'Authentication required');
	}

	const dbChirho = getDbChirho(platform);
	const userIdChirho = sessionChirho.userChirho.idChirho;

	try {
		// Fetch user profile
		const userChirho = await dbChirho
			.select({
				idChirho: usersChirho.idChirho,
				emailChirho: usersChirho.emailChirho,
				nameChirho: usersChirho.nameChirho,
				roleChirho: usersChirho.roleChirho,
				emailVerifiedChirho: usersChirho.emailVerifiedChirho,
				createdAtChirho: usersChirho.createdAtChirho
			})
			.from(usersChirho)
			.where(eq(usersChirho.idChirho, userIdChirho))
			.get();

		if (!userChirho) {
			throw error(404, 'User not found');
		}

		// Fetch donations
		const userDonationsChirho = await dbChirho
			.select({
				idChirho: donationsChirho.idChirho,
				amountChirho: donationsChirho.amountChirho,
				currencyChirho: donationsChirho.currencyChirho,
				statusChirho: donationsChirho.statusChirho,
				messageChirho: donationsChirho.messageChirho,
				anonymousChirho: donationsChirho.anonymousChirho,
				createdAtChirho: donationsChirho.createdAtChirho
			})
			.from(donationsChirho)
			.where(eq(donationsChirho.donorIdChirho, userIdChirho))
			.all();

		// Fetch feedback
		const userFeedbackChirho = await dbChirho
			.select({
				idChirho: feedbackChirho.idChirho,
				typeChirho: feedbackChirho.typeChirho,
				ratingChirho: feedbackChirho.ratingChirho,
				contentPreviewChirho: feedbackChirho.contentPreviewChirho,
				statusChirho: feedbackChirho.statusChirho,
				createdAtChirho: feedbackChirho.createdAtChirho
			})
			.from(feedbackChirho)
			.where(eq(feedbackChirho.userIdChirho, userIdChirho))
			.all();

		// Compile export data
		const exportDataChirho = {
			exportDateChirho: new Date().toISOString(),
			userChirho: {
				profileChirho: userChirho,
				donationsChirho: userDonationsChirho,
				feedbackChirho: userFeedbackChirho
			},
			metadataChirho: {
				formatVersionChirho: '1.0',
				platformChirho: 'OpenOrphanage.org',
				gdprCompliantChirho: true
			}
		};

		// Return as downloadable JSON
		return new Response(JSON.stringify(exportDataChirho, null, 2), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Content-Disposition': `attachment; filename="openorphanage-data-export-${userIdChirho}-${Date.now()}.json"`
			}
		});
	} catch (errChirho) {
		console.error('GDPR export error:', errChirho);
		throw error(500, 'Failed to export data');
	}
};
