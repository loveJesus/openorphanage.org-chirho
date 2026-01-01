// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc, and, like, sql } from 'drizzle-orm';
import { sanitizeInputChirho } from '$lib/server/security_chirho';

// GET - List orphanages (public)
export const GET: RequestHandler = async ({ platform, url }) => {
	const dbChirho = getDbChirho(platform);

	const searchChirho = url.searchParams.get('search') || '';
	const countryChirho = url.searchParams.get('country') || '';
	const verifiedOnlyChirho = url.searchParams.get('verified') === 'true';
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
	const offsetChirho = (pageChirho - 1) * limitChirho;

	const conditionsChirho = [eq(orphanagesChirho.isActiveChirho, true)];

	if (searchChirho) {
		conditionsChirho.push(like(orphanagesChirho.nameChirho, `%${searchChirho}%`));
	}

	if (countryChirho) {
		conditionsChirho.push(eq(orphanagesChirho.countryChirho, countryChirho));
	}

	if (verifiedOnlyChirho) {
		conditionsChirho.push(eq(orphanagesChirho.verificationStatusChirho, 'verified'));
	}

	const orphanagesResultChirho = await dbChirho
		.select({
			idChirho: orphanagesChirho.idChirho,
			nameChirho: orphanagesChirho.nameChirho,
			countryChirho: orphanagesChirho.countryChirho,
			regionChirho: orphanagesChirho.regionChirho,
			childrenCountChirho: orphanagesChirho.childrenCountChirho,
			verificationStatusChirho: orphanagesChirho.verificationStatusChirho,
			primaryPhotoUrlChirho: orphanagesChirho.primaryPhotoUrlChirho,
			shortDescriptionChirho: orphanagesChirho.shortDescriptionChirho
		})
		.from(orphanagesChirho)
		.where(and(...conditionsChirho))
		.orderBy(desc(orphanagesChirho.verificationStatusChirho), desc(orphanagesChirho.createdAtChirho))
		.limit(limitChirho)
		.offset(offsetChirho);

	const countResultChirho = await dbChirho
		.select({ countChirho: sql<number>`count(*)` })
		.from(orphanagesChirho)
		.where(and(...conditionsChirho));

	return json({
		successChirho: true,
		dataChirho: orphanagesResultChirho,
		paginationChirho: {
			pageChirho,
			limitChirho,
			totalChirho: countResultChirho[0]?.countChirho || 0
		}
	});
};

// POST - Create orphanage (admin/staff only)
export const POST: RequestHandler = async ({ request, platform, locals }) => {
	if (!locals.userChirho || !['admin', 'super_admin', 'staff'].includes(locals.userChirho.roleChirho)) {
		throw error(403, 'Unauthorized');
	}

	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);
	const bodyChirho = await request.json();

	// Validate required fields
	const requiredFieldsChirho = ['nameChirho', 'countryChirho'];
	for (const fieldChirho of requiredFieldsChirho) {
		if (!bodyChirho[fieldChirho]) {
			throw error(400, `Missing required field: ${fieldChirho}`);
		}
	}

	// Sanitize inputs
	const nameChirho = sanitizeInputChirho(bodyChirho.nameChirho);
	const countryChirho = sanitizeInputChirho(bodyChirho.countryChirho);
	const regionChirho = bodyChirho.regionChirho ? sanitizeInputChirho(bodyChirho.regionChirho) : null;
	const shortDescriptionChirho = bodyChirho.shortDescriptionChirho
		? sanitizeInputChirho(bodyChirho.shortDescriptionChirho).slice(0, 500)
		: null;

	// Store long description in KV
	let descriptionKvKeyChirho: string | null = null;
	if (bodyChirho.descriptionChirho && bodyChirho.descriptionChirho.length > 500) {
		descriptionKvKeyChirho = `orphanage_desc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
		await kvChirho.setLargeTextChirho(descriptionKvKeyChirho, bodyChirho.descriptionChirho);
	}

	const resultChirho = await dbChirho
		.insert(orphanagesChirho)
		.values({
			nameChirho,
			countryChirho,
			regionChirho,
			shortDescriptionChirho,
			descriptionKvKeyChirho,
			contactEmailChirho: bodyChirho.contactEmailChirho || null,
			contactPhoneChirho: bodyChirho.contactPhoneChirho || null,
			websiteChirho: bodyChirho.websiteChirho || null,
			primaryPhotoUrlChirho: bodyChirho.primaryPhotoUrlChirho || null,
			verificationStatusChirho: 'pending',
			isActiveChirho: true,
			createdByChirho: locals.userChirho.idChirho
		})
		.returning();

	// Audit log
	await dbChirho.insert(auditLogChirho).values({
		userIdChirho: locals.userChirho.idChirho,
		actionChirho: 'create_orphanage',
		entityTypeChirho: 'orphanage',
		entityIdChirho: resultChirho[0].idChirho,
		detailsChirho: JSON.stringify({ nameChirho })
	});

	return json({
		successChirho: true,
		dataChirho: resultChirho[0]
	}, { status: 201 });
};
