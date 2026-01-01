// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { feedbackChirho, usersChirho } from '$lib/server/schema_chirho';
import { eq, desc, and, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform, url }) => {
	const dbChirho = getDbChirho(platform);

	const statusFilterChirho = url.searchParams.get('status') || '';
	const typeFilterChirho = url.searchParams.get('type') || '';
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = 20;
	const offsetChirho = (pageChirho - 1) * limitChirho;

	const conditionsChirho = [];

	if (statusFilterChirho) {
		conditionsChirho.push(eq(feedbackChirho.statusChirho, statusFilterChirho));
	}

	if (typeFilterChirho) {
		conditionsChirho.push(eq(feedbackChirho.typeChirho, typeFilterChirho));
	}

	const whereClauseChirho = conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined;

	const feedbackResultChirho = await dbChirho
		.select({
			idChirho: feedbackChirho.idChirho,
			typeChirho: feedbackChirho.typeChirho,
			statusChirho: feedbackChirho.statusChirho,
			ratingChirho: feedbackChirho.ratingChirho,
			contentPreviewChirho: feedbackChirho.contentPreviewChirho,
			emailChirho: feedbackChirho.emailChirho,
			isAnonymousChirho: feedbackChirho.isAnonymousChirho,
			createdAtChirho: feedbackChirho.createdAtChirho,
			userEmailChirho: usersChirho.emailChirho
		})
		.from(feedbackChirho)
		.leftJoin(usersChirho, eq(feedbackChirho.userIdChirho, usersChirho.idChirho))
		.where(whereClauseChirho)
		.orderBy(desc(feedbackChirho.createdAtChirho))
		.limit(limitChirho)
		.offset(offsetChirho);

	const countResultChirho = await dbChirho
		.select({ countChirho: sql<number>`count(*)` })
		.from(feedbackChirho)
		.where(whereClauseChirho);

	const totalChirho = countResultChirho[0]?.countChirho || 0;

	// Get counts by status
	const statusCountsChirho = await dbChirho
		.select({
			statusChirho: feedbackChirho.statusChirho,
			countChirho: sql<number>`count(*)`
		})
		.from(feedbackChirho)
		.groupBy(feedbackChirho.statusChirho);

	return {
		feedbackListChirho: feedbackResultChirho,
		statusCountsChirho: Object.fromEntries(statusCountsChirho.map(s => [s.statusChirho, s.countChirho])),
		paginationChirho: {
			currentPageChirho: pageChirho,
			totalPagesChirho: Math.ceil(totalChirho / limitChirho),
			totalChirho
		},
		filtersChirho: {
			statusChirho: statusFilterChirho,
			typeChirho: typeFilterChirho
		}
	};
};
