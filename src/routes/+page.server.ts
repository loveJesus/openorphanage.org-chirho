// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { orphanagesChirho, needsChirho, childrenChirho } from '$lib/server/schema_chirho';
import { eq, desc, and, sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ platform }) => {
	const dbChirho = getDbChirho(platform);

	// Get featured orphanages (verified, most children)
	const featuredOrphanagesChirho = await dbChirho
		.select({
			idChirho: orphanagesChirho.idChirho,
			nameChirho: orphanagesChirho.nameChirho,
			countryChirho: orphanagesChirho.countryChirho,
			regionChirho: orphanagesChirho.regionChirho,
			childrenCountChirho: orphanagesChirho.childrenCountChirho,
			primaryPhotoUrlChirho: orphanagesChirho.primaryPhotoUrlChirho,
			shortDescriptionChirho: orphanagesChirho.shortDescriptionChirho,
			verificationStatusChirho: orphanagesChirho.verificationStatusChirho
		})
		.from(orphanagesChirho)
		.where(and(eq(orphanagesChirho.isActiveChirho, true), eq(orphanagesChirho.verificationStatusChirho, 'verified')))
		.orderBy(desc(orphanagesChirho.childrenCountChirho))
		.limit(3);

	// Get urgent needs
	const urgentNeedsChirho = await dbChirho
		.select({
			idChirho: needsChirho.idChirho,
			titleChirho: needsChirho.titleChirho,
			categoryChirho: needsChirho.categoryChirho,
			priorityChirho: needsChirho.priorityChirho,
			amountNeededChirho: needsChirho.amountNeededChirho,
			amountRaisedChirho: needsChirho.amountRaisedChirho,
			currencyChirho: needsChirho.currencyChirho,
			orphanageNameChirho: orphanagesChirho.nameChirho,
			orphanageIdChirho: orphanagesChirho.idChirho
		})
		.from(needsChirho)
		.leftJoin(orphanagesChirho, eq(needsChirho.orphanageIdChirho, orphanagesChirho.idChirho))
		.where(and(eq(needsChirho.statusChirho, 'active'), eq(needsChirho.priorityChirho, 'urgent')))
		.orderBy(desc(needsChirho.createdAtChirho))
		.limit(4);

	// Get stats
	const [orphanageCountChirho, childrenCountChirho, activeNeedsChirho] = await Promise.all([
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(orphanagesChirho)
			.where(eq(orphanagesChirho.isActiveChirho, true)),
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(childrenChirho)
			.where(eq(childrenChirho.isActiveChirho, true)),
		dbChirho
			.select({ countChirho: sql<number>`count(*)` })
			.from(needsChirho)
			.where(eq(needsChirho.statusChirho, 'active'))
	]);

	return {
		featuredOrphanagesChirho,
		urgentNeedsChirho,
		statsChirho: {
			orphanagesChirho: orphanageCountChirho[0]?.countChirho || 0,
			childrenChirho: childrenCountChirho[0]?.countChirho || 0,
			needsChirho: activeNeedsChirho[0]?.countChirho || 0
		}
	};
};
