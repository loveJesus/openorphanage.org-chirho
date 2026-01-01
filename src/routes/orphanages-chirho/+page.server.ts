// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { orphanagesChirho } from '$lib/server/schema_chirho';
import { eq, desc, and, like, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform, url }) => {
	const dbChirho = getDbChirho(platform);

	// Get query params for filtering
	const searchChirho = url.searchParams.get('search') || '';
	const countryChirho = url.searchParams.get('country') || '';
	const verifiedOnlyChirho = url.searchParams.get('verified') === 'true';
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = 12;
	const offsetChirho = (pageChirho - 1) * limitChirho;

	// Build conditions
	const conditionsChirho = [eq(orphanagesChirho.isActiveChirho, true)];

	if (searchChirho) {
		conditionsChirho.push(
			like(orphanagesChirho.nameChirho, `%${searchChirho}%`)
		);
	}

	if (countryChirho) {
		conditionsChirho.push(eq(orphanagesChirho.countryChirho, countryChirho));
	}

	if (verifiedOnlyChirho) {
		conditionsChirho.push(eq(orphanagesChirho.verificationStatusChirho, 'verified'));
	}

	// Get orphanages
	const orphanagesResultChirho = await dbChirho
		.select({
			idChirho: orphanagesChirho.idChirho,
			nameChirho: orphanagesChirho.nameChirho,
			countryChirho: orphanagesChirho.countryChirho,
			regionChirho: orphanagesChirho.regionChirho,
			childrenCountChirho: orphanagesChirho.childrenCountChirho,
			verificationStatusChirho: orphanagesChirho.verificationStatusChirho,
			primaryPhotoUrlChirho: orphanagesChirho.primaryPhotoUrlChirho,
			shortDescriptionChirho: orphanagesChirho.shortDescriptionChirho,
			createdAtChirho: orphanagesChirho.createdAtChirho
		})
		.from(orphanagesChirho)
		.where(and(...conditionsChirho))
		.orderBy(desc(orphanagesChirho.verificationStatusChirho), desc(orphanagesChirho.createdAtChirho))
		.limit(limitChirho)
		.offset(offsetChirho);

	// Get total count for pagination
	const countResultChirho = await dbChirho
		.select({ countChirho: sql<number>`count(*)` })
		.from(orphanagesChirho)
		.where(and(...conditionsChirho));

	const totalChirho = countResultChirho[0]?.countChirho || 0;
	const totalPagesChirho = Math.ceil(totalChirho / limitChirho);

	// Get unique countries for filter dropdown
	const countriesResultChirho = await dbChirho
		.selectDistinct({ countryChirho: orphanagesChirho.countryChirho })
		.from(orphanagesChirho)
		.where(eq(orphanagesChirho.isActiveChirho, true));

	return {
		orphanagesChirho: orphanagesResultChirho,
		countriesChirho: countriesResultChirho.map(c => c.countryChirho).filter(Boolean),
		paginationChirho: {
			currentPageChirho: pageChirho,
			totalPagesChirho,
			totalChirho,
			hasNextChirho: pageChirho < totalPagesChirho,
			hasPrevChirho: pageChirho > 1
		},
		filtersChirho: {
			searchChirho,
			countryChirho,
			verifiedOnlyChirho
		}
	};
};
