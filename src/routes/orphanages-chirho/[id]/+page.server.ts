// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { orphanagesChirho, needsChirho, childrenChirho } from '$lib/server/schema_chirho';
import { eq, and, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, platform }) => {
	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(404, 'Orphanage not found');
	}

	// Get orphanage details
	const orphanageResultChirho = await dbChirho
		.select()
		.from(orphanagesChirho)
		.where(and(eq(orphanagesChirho.idChirho, idChirho), eq(orphanagesChirho.isActiveChirho, true)))
		.limit(1);

	if (orphanageResultChirho.length === 0) {
		throw error(404, 'Orphanage not found');
	}

	const orphanageChirho = orphanageResultChirho[0];

	// Get full description from KV if stored there
	let fullDescriptionChirho = orphanageChirho.shortDescriptionChirho || '';
	if (orphanageChirho.descriptionKvKeyChirho) {
		const kvDescriptionChirho = await kvChirho.getLargeTextChirho(orphanageChirho.descriptionKvKeyChirho);
		if (kvDescriptionChirho) {
			fullDescriptionChirho = kvDescriptionChirho;
		}
	}

	// Get active needs for this orphanage
	const needsResultChirho = await dbChirho
		.select({
			idChirho: needsChirho.idChirho,
			titleChirho: needsChirho.titleChirho,
			categoryChirho: needsChirho.categoryChirho,
			priorityChirho: needsChirho.priorityChirho,
			amountNeededChirho: needsChirho.amountNeededChirho,
			amountRaisedChirho: needsChirho.amountRaisedChirho,
			currencyChirho: needsChirho.currencyChirho,
			statusChirho: needsChirho.statusChirho,
			createdAtChirho: needsChirho.createdAtChirho
		})
		.from(needsChirho)
		.where(and(eq(needsChirho.orphanageIdChirho, idChirho), eq(needsChirho.statusChirho, 'active')))
		.orderBy(desc(needsChirho.priorityChirho), desc(needsChirho.createdAtChirho))
		.limit(10);

	// Get child count (we don't expose individual children publicly for safety)
	const childrenCountChirho = await dbChirho
		.select()
		.from(childrenChirho)
		.where(and(eq(childrenChirho.orphanageIdChirho, idChirho), eq(childrenChirho.isActiveChirho, true)));

	return {
		orphanageChirho: {
			...orphanageChirho,
			fullDescriptionChirho
		},
		needsChirho: needsResultChirho,
		childrenCountChirho: childrenCountChirho.length
	};
};
