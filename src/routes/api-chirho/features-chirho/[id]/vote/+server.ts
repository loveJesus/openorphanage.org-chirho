// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { featureRequestsChirho, featureVotesChirho } from '$lib/server/schema_chirho';
import { logAuditChirho, AUDIT_ACTIONS_CHIRHO, getClientIpChirho, getUserAgentChirho } from '$lib/server/audit_chirho';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Vote on a feature request
 */
export const POST: RequestHandler = async ({ params, request, locals, platform }) => {
	const sessionChirho = locals.sessionChirho;

	if (!sessionChirho?.userChirho) {
		throw error(401, 'You must be logged in to vote');
	}

	const featureIdChirho = parseInt(params.id, 10);
	if (isNaN(featureIdChirho)) {
		throw error(400, 'Invalid feature ID');
	}

	const dbChirho = getDbChirho(platform);

	try {
		const bodyChirho = await request.json();
		const voteTypeChirho = bodyChirho.voteTypeChirho || 'upvote';

		if (!['upvote', 'downvote'].includes(voteTypeChirho)) {
			throw error(400, 'Invalid vote type');
		}

		// Check if feature exists
		const featureChirho = await dbChirho
			.select()
			.from(featureRequestsChirho)
			.where(eq(featureRequestsChirho.idChirho, featureIdChirho))
			.get();

		if (!featureChirho) {
			throw error(404, 'Feature not found');
		}

		// Check if user already voted
		const existingVoteChirho = await dbChirho
			.select()
			.from(featureVotesChirho)
			.where(
				and(
					eq(featureVotesChirho.featureIdChirho, featureIdChirho),
					eq(featureVotesChirho.userIdChirho, sessionChirho.userChirho.idChirho)
				)
			)
			.get();

		let voteChangeChirho = 0;

		if (existingVoteChirho) {
			if (existingVoteChirho.voteTypeChirho === voteTypeChirho) {
				// Same vote - remove it (toggle off)
				await dbChirho
					.delete(featureVotesChirho)
					.where(eq(featureVotesChirho.idChirho, existingVoteChirho.idChirho));

				voteChangeChirho = voteTypeChirho === 'upvote' ? -1 : 1;
			} else {
				// Different vote - update it
				await dbChirho
					.update(featureVotesChirho)
					.set({ voteTypeChirho, createdAtChirho: new Date().toISOString() })
					.where(eq(featureVotesChirho.idChirho, existingVoteChirho.idChirho));

				voteChangeChirho = voteTypeChirho === 'upvote' ? 2 : -2;
			}
		} else {
			// New vote
			await dbChirho.insert(featureVotesChirho).values({
				featureIdChirho,
				userIdChirho: sessionChirho.userChirho.idChirho,
				voteTypeChirho,
				createdAtChirho: new Date().toISOString()
			});

			voteChangeChirho = voteTypeChirho === 'upvote' ? 1 : -1;
		}

		// Update vote count
		const newVoteCountChirho = Math.max(0, featureChirho.voteCountChirho + voteChangeChirho);
		await dbChirho
			.update(featureRequestsChirho)
			.set({
				voteCountChirho: newVoteCountChirho,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(featureRequestsChirho.idChirho, featureIdChirho));

		// Audit log
		await logAuditChirho(dbChirho, {
			userIdChirho: sessionChirho.userChirho.idChirho,
			actionChirho: AUDIT_ACTIONS_CHIRHO.FEATURE_VOTED,
			entityTypeChirho: 'feature_request',
			entityIdChirho: featureIdChirho,
			detailsChirho: { voteTypeChirho, voteChangeChirho },
			ipAddressChirho: getClientIpChirho(request),
			userAgentChirho: getUserAgentChirho(request)
		});

		return json({
			successChirho: true,
			voteCountChirho: newVoteCountChirho
		});
	} catch (errChirho) {
		console.error('Vote error:', errChirho);
		if (errChirho instanceof Error && 'status' in errChirho) {
			throw errChirho;
		}
		throw error(500, 'Failed to vote');
	}
};
