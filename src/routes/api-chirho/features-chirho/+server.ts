// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { featureRequestsChirho, featureVotesChirho } from '$lib/server/schema_chirho';
import { logAuditChirho, AUDIT_ACTIONS_CHIRHO, getClientIpChirho, getUserAgentChirho } from '$lib/server/audit_chirho';
import { desc, eq, and, sql } from 'drizzle-orm';

/**
 * Get all feature requests
 */
export const GET: RequestHandler = async ({ platform, url }) => {
	const dbChirho = getDbChirho(platform);
	const statusFilterChirho = url.searchParams.get('status');

	try {
		let queryChirho = dbChirho
			.select({
				idChirho: featureRequestsChirho.idChirho,
				titleChirho: featureRequestsChirho.titleChirho,
				descriptionChirho: featureRequestsChirho.descriptionChirho,
				categoryChirho: featureRequestsChirho.categoryChirho,
				statusChirho: featureRequestsChirho.statusChirho,
				voteCountChirho: featureRequestsChirho.voteCountChirho,
				adminResponseChirho: featureRequestsChirho.adminResponseChirho,
				createdAtChirho: featureRequestsChirho.createdAtChirho
			})
			.from(featureRequestsChirho)
			.orderBy(desc(featureRequestsChirho.voteCountChirho));

		const featuresChirho = await queryChirho.all();

		// Filter by status if provided
		const filteredChirho = statusFilterChirho
			? featuresChirho.filter((f) => f.statusChirho === statusFilterChirho)
			: featuresChirho;

		return json({ featuresChirho: filteredChirho });
	} catch (errChirho) {
		console.error('Get features error:', errChirho);
		throw error(500, 'Failed to fetch features');
	}
};

/**
 * Submit a new feature request
 */
export const POST: RequestHandler = async ({ request, locals, platform }) => {
	const sessionChirho = locals.sessionChirho;

	if (!sessionChirho?.userChirho) {
		throw error(401, 'You must be logged in to submit feature requests');
	}

	const dbChirho = getDbChirho(platform);

	try {
		const bodyChirho = await request.json();
		const { titleChirho, descriptionChirho, categoryChirho } = bodyChirho;

		if (!titleChirho || !descriptionChirho) {
			throw error(400, 'Title and description are required');
		}

		const resultChirho = await dbChirho.insert(featureRequestsChirho).values({
			titleChirho,
			descriptionChirho,
			categoryChirho: categoryChirho || 'platform',
			statusChirho: 'proposed',
			voteCountChirho: 1, // Auto-upvote by submitter
			submittedByChirho: sessionChirho.userChirho.idChirho,
			createdAtChirho: new Date().toISOString()
		}).returning({ idChirho: featureRequestsChirho.idChirho });

		const featureIdChirho = resultChirho[0]?.idChirho;

		// Auto-vote for the submitter
		if (featureIdChirho) {
			await dbChirho.insert(featureVotesChirho).values({
				featureIdChirho,
				userIdChirho: sessionChirho.userChirho.idChirho,
				voteTypeChirho: 'upvote',
				createdAtChirho: new Date().toISOString()
			});
		}

		// Audit log
		await logAuditChirho(dbChirho, {
			userIdChirho: sessionChirho.userChirho.idChirho,
			actionChirho: AUDIT_ACTIONS_CHIRHO.FEATURE_SUBMITTED,
			entityTypeChirho: 'feature_request',
			entityIdChirho: featureIdChirho,
			detailsChirho: { titleChirho, categoryChirho },
			ipAddressChirho: getClientIpChirho(request),
			userAgentChirho: getUserAgentChirho(request)
		});

		return json({
			successChirho: true,
			featureIdChirho,
			messageChirho: 'Feature request submitted successfully!'
		});
	} catch (errChirho) {
		console.error('Submit feature error:', errChirho);
		if (errChirho instanceof Error && 'status' in errChirho) {
			throw errChirho;
		}
		throw error(500, 'Failed to submit feature request');
	}
};
