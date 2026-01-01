// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { needsChirho, orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { sanitizeInputChirho } from '$lib/server/security_chirho';

// GET - Get single need
export const GET: RequestHandler = async ({ params, platform }) => {
	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(400, 'Invalid need ID');
	}

	const resultChirho = await dbChirho
		.select({
			idChirho: needsChirho.idChirho,
			orphanageIdChirho: needsChirho.orphanageIdChirho,
			orphanageNameChirho: orphanagesChirho.nameChirho,
			orphanageCountryChirho: orphanagesChirho.countryChirho,
			titleChirho: needsChirho.titleChirho,
			shortDescriptionChirho: needsChirho.shortDescriptionChirho,
			descriptionKvKeyChirho: needsChirho.descriptionKvKeyChirho,
			categoryChirho: needsChirho.categoryChirho,
			priorityChirho: needsChirho.priorityChirho,
			amountNeededChirho: needsChirho.amountNeededChirho,
			amountRaisedChirho: needsChirho.amountRaisedChirho,
			currencyChirho: needsChirho.currencyChirho,
			statusChirho: needsChirho.statusChirho,
			createdAtChirho: needsChirho.createdAtChirho,
			updatedAtChirho: needsChirho.updatedAtChirho
		})
		.from(needsChirho)
		.leftJoin(orphanagesChirho, eq(needsChirho.orphanageIdChirho, orphanagesChirho.idChirho))
		.where(eq(needsChirho.idChirho, idChirho))
		.limit(1);

	if (resultChirho.length === 0) {
		throw error(404, 'Need not found');
	}

	const needChirho = resultChirho[0];

	// Get full description from KV if exists
	let fullDescriptionChirho = needChirho.shortDescriptionChirho || '';
	if (needChirho.descriptionKvKeyChirho) {
		const kvDescChirho = await kvChirho.getLargeTextChirho(needChirho.descriptionKvKeyChirho);
		if (kvDescChirho) {
			fullDescriptionChirho = kvDescChirho;
		}
	}

	return json({
		successChirho: true,
		dataChirho: {
			...needChirho,
			fullDescriptionChirho
		}
	});
};

// PUT - Update need (admin/staff only)
export const PUT: RequestHandler = async ({ params, request, platform, locals }) => {
	if (!locals.userChirho || !['admin', 'super_admin', 'staff'].includes(locals.userChirho.roleChirho)) {
		throw error(403, 'Unauthorized');
	}

	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(400, 'Invalid need ID');
	}

	const bodyChirho = await request.json();

	// Build update object
	const updateDataChirho: Record<string, unknown> = {
		updatedAtChirho: new Date().toISOString()
	};

	if (bodyChirho.titleChirho) {
		updateDataChirho.titleChirho = sanitizeInputChirho(bodyChirho.titleChirho).slice(0, 200);
	}

	if (bodyChirho.descriptionChirho !== undefined) {
		const descChirho = bodyChirho.descriptionChirho || '';
		updateDataChirho.shortDescriptionChirho = descChirho.slice(0, 500);

		if (descChirho.length > 500) {
			// Get existing KV key or create new
			const existingChirho = await dbChirho
				.select({ descriptionKvKeyChirho: needsChirho.descriptionKvKeyChirho })
				.from(needsChirho)
				.where(eq(needsChirho.idChirho, idChirho))
				.limit(1);

			let kvKeyChirho = existingChirho[0]?.descriptionKvKeyChirho;
			if (!kvKeyChirho) {
				kvKeyChirho = `need_desc_${idChirho}_${Date.now()}`;
				updateDataChirho.descriptionKvKeyChirho = kvKeyChirho;
			}

			await kvChirho.setLargeTextChirho(kvKeyChirho, descChirho);
		}
	}

	const validCategoriesChirho = ['food', 'medical', 'education', 'clothing', 'infrastructure', 'staff', 'utilities', 'transportation', 'other'];
	const validPrioritiesChirho = ['low', 'medium', 'high', 'urgent'];
	const validStatusesChirho = ['active', 'funded', 'completed', 'cancelled'];

	if (bodyChirho.categoryChirho && validCategoriesChirho.includes(bodyChirho.categoryChirho)) {
		updateDataChirho.categoryChirho = bodyChirho.categoryChirho;
	}

	if (bodyChirho.priorityChirho && validPrioritiesChirho.includes(bodyChirho.priorityChirho)) {
		updateDataChirho.priorityChirho = bodyChirho.priorityChirho;
	}

	if (bodyChirho.statusChirho && validStatusesChirho.includes(bodyChirho.statusChirho)) {
		updateDataChirho.statusChirho = bodyChirho.statusChirho;
	}

	if (bodyChirho.amountNeededChirho !== undefined) {
		updateDataChirho.amountNeededChirho = parseFloat(bodyChirho.amountNeededChirho) || 0;
	}

	if (bodyChirho.amountRaisedChirho !== undefined) {
		updateDataChirho.amountRaisedChirho = parseFloat(bodyChirho.amountRaisedChirho) || 0;
	}

	const resultChirho = await dbChirho
		.update(needsChirho)
		.set(updateDataChirho)
		.where(eq(needsChirho.idChirho, idChirho))
		.returning();

	if (resultChirho.length === 0) {
		throw error(404, 'Need not found');
	}

	// Audit log
	await dbChirho.insert(auditLogChirho).values({
		userIdChirho: locals.userChirho.idChirho,
		actionChirho: 'update_need',
		entityTypeChirho: 'need',
		entityIdChirho: idChirho,
		detailsChirho: JSON.stringify({ fieldsUpdatedChirho: Object.keys(updateDataChirho) })
	});

	return json({
		successChirho: true,
		dataChirho: resultChirho[0]
	});
};

// DELETE - Delete need (admin only)
export const DELETE: RequestHandler = async ({ params, platform, locals }) => {
	if (!locals.userChirho || !['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
		throw error(403, 'Unauthorized');
	}

	const dbChirho = getDbChirho(platform);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(400, 'Invalid need ID');
	}

	// Set status to cancelled instead of hard delete
	const resultChirho = await dbChirho
		.update(needsChirho)
		.set({
			statusChirho: 'cancelled',
			updatedAtChirho: new Date().toISOString()
		})
		.where(eq(needsChirho.idChirho, idChirho))
		.returning();

	if (resultChirho.length === 0) {
		throw error(404, 'Need not found');
	}

	// Audit log
	await dbChirho.insert(auditLogChirho).values({
		userIdChirho: locals.userChirho.idChirho,
		actionChirho: 'delete_need',
		entityTypeChirho: 'need',
		entityIdChirho: idChirho
	});

	return json({
		successChirho: true,
		messageChirho: 'Need deleted successfully'
	});
};
