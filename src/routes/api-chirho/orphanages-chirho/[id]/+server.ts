// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, and } from 'drizzle-orm';
import { sanitizeInputChirho } from '$lib/server/security_chirho';

// GET - Get single orphanage
export const GET: RequestHandler = async ({ params, platform }) => {
	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(400, 'Invalid orphanage ID');
	}

	const resultChirho = await dbChirho
		.select()
		.from(orphanagesChirho)
		.where(and(eq(orphanagesChirho.idChirho, idChirho), eq(orphanagesChirho.isActiveChirho, true)))
		.limit(1);

	if (resultChirho.length === 0) {
		throw error(404, 'Orphanage not found');
	}

	const orphanageChirho = resultChirho[0];

	// Get full description from KV if exists
	let fullDescriptionChirho = orphanageChirho.shortDescriptionChirho || '';
	if (orphanageChirho.descriptionKvKeyChirho) {
		const kvDescChirho = await kvChirho.getLargeTextChirho(orphanageChirho.descriptionKvKeyChirho);
		if (kvDescChirho) {
			fullDescriptionChirho = kvDescChirho;
		}
	}

	return json({
		successChirho: true,
		dataChirho: {
			...orphanageChirho,
			fullDescriptionChirho
		}
	});
};

// PUT - Update orphanage (admin/staff only)
export const PUT: RequestHandler = async ({ params, request, platform, locals }) => {
	if (!locals.userChirho || !['admin', 'super_admin', 'staff'].includes(locals.userChirho.roleChirho)) {
		throw error(403, 'Unauthorized');
	}

	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(400, 'Invalid orphanage ID');
	}

	const bodyChirho = await request.json();

	// Build update object
	const updateDataChirho: Record<string, unknown> = {
		updatedAtChirho: new Date().toISOString()
	};

	if (bodyChirho.nameChirho) {
		updateDataChirho.nameChirho = sanitizeInputChirho(bodyChirho.nameChirho);
	}

	if (bodyChirho.countryChirho) {
		updateDataChirho.countryChirho = sanitizeInputChirho(bodyChirho.countryChirho);
	}

	if (bodyChirho.regionChirho !== undefined) {
		updateDataChirho.regionChirho = bodyChirho.regionChirho ? sanitizeInputChirho(bodyChirho.regionChirho) : null;
	}

	if (bodyChirho.shortDescriptionChirho !== undefined) {
		updateDataChirho.shortDescriptionChirho = bodyChirho.shortDescriptionChirho
			? sanitizeInputChirho(bodyChirho.shortDescriptionChirho).slice(0, 500)
			: null;
	}

	if (bodyChirho.descriptionChirho) {
		// Get existing orphanage to check for existing KV key
		const existingChirho = await dbChirho
			.select({ descriptionKvKeyChirho: orphanagesChirho.descriptionKvKeyChirho })
			.from(orphanagesChirho)
			.where(eq(orphanagesChirho.idChirho, idChirho))
			.limit(1);

		let kvKeyChirho = existingChirho[0]?.descriptionKvKeyChirho;

		if (!kvKeyChirho) {
			kvKeyChirho = `orphanage_desc_${idChirho}_${Date.now()}`;
			updateDataChirho.descriptionKvKeyChirho = kvKeyChirho;
		}

		await kvChirho.setLargeTextChirho(kvKeyChirho, bodyChirho.descriptionChirho);
	}

	if (bodyChirho.contactEmailChirho !== undefined) {
		updateDataChirho.contactEmailChirho = bodyChirho.contactEmailChirho || null;
	}

	if (bodyChirho.contactPhoneChirho !== undefined) {
		updateDataChirho.contactPhoneChirho = bodyChirho.contactPhoneChirho || null;
	}

	if (bodyChirho.websiteChirho !== undefined) {
		updateDataChirho.websiteChirho = bodyChirho.websiteChirho || null;
	}

	if (bodyChirho.primaryPhotoUrlChirho !== undefined) {
		updateDataChirho.primaryPhotoUrlChirho = bodyChirho.primaryPhotoUrlChirho || null;
	}

	// Admin-only fields
	if (['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
		if (bodyChirho.verificationStatusChirho) {
			updateDataChirho.verificationStatusChirho = bodyChirho.verificationStatusChirho;
		}

		if (bodyChirho.isActiveChirho !== undefined) {
			updateDataChirho.isActiveChirho = bodyChirho.isActiveChirho;
		}
	}

	const resultChirho = await dbChirho
		.update(orphanagesChirho)
		.set(updateDataChirho)
		.where(eq(orphanagesChirho.idChirho, idChirho))
		.returning();

	if (resultChirho.length === 0) {
		throw error(404, 'Orphanage not found');
	}

	// Audit log
	await dbChirho.insert(auditLogChirho).values({
		userIdChirho: locals.userChirho.idChirho,
		actionChirho: 'update_orphanage',
		entityTypeChirho: 'orphanage',
		entityIdChirho: idChirho,
		detailsChirho: JSON.stringify({ fieldsUpdatedChirho: Object.keys(updateDataChirho) })
	});

	return json({
		successChirho: true,
		dataChirho: resultChirho[0]
	});
};

// DELETE - Soft delete orphanage (admin only)
export const DELETE: RequestHandler = async ({ params, platform, locals }) => {
	if (!locals.userChirho || !['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
		throw error(403, 'Unauthorized');
	}

	const dbChirho = getDbChirho(platform);

	const idChirho = parseInt(params.id);
	if (isNaN(idChirho)) {
		throw error(400, 'Invalid orphanage ID');
	}

	// Soft delete
	const resultChirho = await dbChirho
		.update(orphanagesChirho)
		.set({
			isActiveChirho: false,
			updatedAtChirho: new Date().toISOString()
		})
		.where(eq(orphanagesChirho.idChirho, idChirho))
		.returning();

	if (resultChirho.length === 0) {
		throw error(404, 'Orphanage not found');
	}

	// Audit log
	await dbChirho.insert(auditLogChirho).values({
		userIdChirho: locals.userChirho.idChirho,
		actionChirho: 'delete_orphanage',
		entityTypeChirho: 'orphanage',
		entityIdChirho: idChirho
	});

	return json({
		successChirho: true,
		messageChirho: 'Orphanage deleted successfully'
	});
};
