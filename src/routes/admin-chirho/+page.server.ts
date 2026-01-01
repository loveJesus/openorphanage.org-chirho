// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { orphanagesChirho, needsChirho, feedbackChirho, usersChirho } from '$lib/server/schema_chirho';
import { eq, sql, and, gte } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform }) => {
	const dbChirho = getDbChirho(platform);

	// Get stats
	const [
		orphanageCountChirho,
		activeNeedsCountChirho,
		pendingFeedbackCountChirho,
		userCountChirho,
		verifiedOrphanagesChirho,
		urgentNeedsChirho
	] = await Promise.all([
		// Total orphanages
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(orphanagesChirho)
			.where(eq(orphanagesChirho.isActiveChirho, true)),

		// Active needs
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(needsChirho)
			.where(eq(needsChirho.statusChirho, 'active')),

		// Pending feedback
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(feedbackChirho)
			.where(eq(feedbackChirho.statusChirho, 'pending')),

		// Total users
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(usersChirho)
			.where(eq(usersChirho.isActiveChirho, true)),

		// Verified orphanages
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(orphanagesChirho)
			.where(and(eq(orphanagesChirho.isActiveChirho, true), eq(orphanagesChirho.verificationStatusChirho, 'verified'))),

		// Urgent needs
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(needsChirho)
			.where(and(eq(needsChirho.statusChirho, 'active'), eq(needsChirho.priorityChirho, 'urgent')))
	]);

	// Get recent feedback
	const recentFeedbackChirho = await dbChirho
		.select({
			idChirho: feedbackChirho.idChirho,
			typeChirho: feedbackChirho.typeChirho,
			statusChirho: feedbackChirho.statusChirho,
			ratingChirho: feedbackChirho.ratingChirho,
			createdAtChirho: feedbackChirho.createdAtChirho
		})
		.from(feedbackChirho)
		.orderBy(sql`${feedbackChirho.createdAtChirho} DESC`)
		.limit(5);

	// Get orphanages pending verification
	const pendingVerificationChirho = await dbChirho
		.select({
			idChirho: orphanagesChirho.idChirho,
			nameChirho: orphanagesChirho.nameChirho,
			countryChirho: orphanagesChirho.countryChirho,
			createdAtChirho: orphanagesChirho.createdAtChirho
		})
		.from(orphanagesChirho)
		.where(and(eq(orphanagesChirho.isActiveChirho, true), eq(orphanagesChirho.verificationStatusChirho, 'pending')))
		.limit(5);

	return {
		statsChirho: {
			orphanagesChirho: orphanageCountChirho[0]?.countChirho || 0,
			verifiedOrphanagesChirho: verifiedOrphanagesChirho[0]?.countChirho || 0,
			activeNeedsChirho: activeNeedsCountChirho[0]?.countChirho || 0,
			urgentNeedsChirho: urgentNeedsChirho[0]?.countChirho || 0,
			pendingFeedbackChirho: pendingFeedbackCountChirho[0]?.countChirho || 0,
			usersChirho: userCountChirho[0]?.countChirho || 0
		},
		recentFeedbackChirho,
		pendingVerificationChirho
	};
};
