// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { needsChirho, orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc, and, sql } from 'drizzle-orm';
import { sanitizeInputChirho } from '$lib/server/security_chirho';

// GET - List needs (public)
export const GET: RequestHandler = async ({ platform, url }) => {
	const dbChirho = getDbChirho(platform);

	const orphanageIdChirho = url.searchParams.get('orphanage_id');
	const categoryChirho = url.searchParams.get('category');
	const priorityChirho = url.searchParams.get('priority');
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
	const offsetChirho = (pageChirho - 1) * limitChirho;

	const conditionsChirho = [eq(needsChirho.statusChirho, 'active')];

	if (orphanageIdChirho) {
		conditionsChirho.push(eq(needsChirho.orphanageIdChirho, parseInt(orphanageIdChirho)));
	}

	if (categoryChirho) {
		conditionsChirho.push(eq(needsChirho.categoryChirho, categoryChirho));
	}

	if (priorityChirho) {
		conditionsChirho.push(eq(needsChirho.priorityChirho, priorityChirho));
	}

	const needsResultChirho = await dbChirho
		.select({
			idChirho: needsChirho.idChirho,
			orphanageIdChirho: needsChirho.orphanageIdChirho,
			orphanageNameChirho: orphanagesChirho.nameChirho,
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
		.leftJoin(orphanagesChirho, eq(needsChirho.orphanageIdChirho, orphanagesChirho.idChirho))
		.where(and(...conditionsChirho))
		.orderBy(desc(needsChirho.priorityChirho), desc(needsChirho.createdAtChirho))
		.limit(limitChirho)
		.offset(offsetChirho);

	const countResultChirho = await dbChirho
		.select({ countChirho: sql<number>`count(*)` })
		.from(needsChirho)
		.where(and(...conditionsChirho));

	return json({
		successChirho: true,
		dataChirho: needsResultChirho,
		paginationChirho: {
			pageChirho,
			limitChirho,
			totalChirho: countResultChirho[0]?.countChirho || 0
		}
	});
};

// POST - Create need (admin/staff only)
export const POST: RequestHandler = async ({ request, platform, locals }) => {
	if (!locals.userChirho || !['admin', 'super_admin', 'staff'].includes(locals.userChirho.roleChirho)) {
		throw error(403, 'Unauthorized');
	}

	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);
	const bodyChirho = await request.json();

	// Validate required fields
	const requiredFieldsChirho = ['orphanageIdChirho', 'titleChirho', 'categoryChirho', 'amountNeededChirho'];
	for (const fieldChirho of requiredFieldsChirho) {
		if (!bodyChirho[fieldChirho]) {
			throw error(400, `Missing required field: ${fieldChirho}`);
		}
	}

	// Verify orphanage exists
	const orphanageChirho = await dbChirho
		.select({ idChirho: orphanagesChirho.idChirho })
		.from(orphanagesChirho)
		.where(eq(orphanagesChirho.idChirho, bodyChirho.orphanageIdChirho))
		.limit(1);

	if (orphanageChirho.length === 0) {
		throw error(400, 'Invalid orphanage ID');
	}

	// Store description in KV if large
	let descriptionKvKeyChirho: string | null = null;
	const descriptionChirho = bodyChirho.descriptionChirho || '';
	if (descriptionChirho.length > 1000) {
		descriptionKvKeyChirho = `need_desc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
		await kvChirho.setLargeTextChirho(descriptionKvKeyChirho, descriptionChirho);
	}

	const validCategoriesChirho = ['food', 'medical', 'education', 'clothing', 'infrastructure', 'staff', 'utilities', 'transportation', 'other'];
	const validPrioritiesChirho = ['low', 'medium', 'high', 'urgent'];

	const resultChirho = await dbChirho
		.insert(needsChirho)
		.values({
			orphanageIdChirho: bodyChirho.orphanageIdChirho,
			titleChirho: sanitizeInputChirho(bodyChirho.titleChirho).slice(0, 200),
			shortDescriptionChirho: descriptionChirho.slice(0, 500),
			descriptionKvKeyChirho,
			categoryChirho: validCategoriesChirho.includes(bodyChirho.categoryChirho) ? bodyChirho.categoryChirho : 'other',
			priorityChirho: validPrioritiesChirho.includes(bodyChirho.priorityChirho) ? bodyChirho.priorityChirho : 'medium',
			amountNeededChirho: parseFloat(bodyChirho.amountNeededChirho) || 0,
			amountRaisedChirho: 0,
			currencyChirho: bodyChirho.currencyChirho || 'USD',
			statusChirho: 'active',
			createdByChirho: locals.userChirho.idChirho
		})
		.returning();

	// Audit log
	await dbChirho.insert(auditLogChirho).values({
		userIdChirho: locals.userChirho.idChirho,
		actionChirho: 'create_need',
		entityTypeChirho: 'need',
		entityIdChirho: resultChirho[0].idChirho,
		detailsChirho: JSON.stringify({ titleChirho: bodyChirho.titleChirho, orphanageIdChirho: bodyChirho.orphanageIdChirho })
	});

	return json({
		successChirho: true,
		dataChirho: resultChirho[0]
	}, { status: 201 });
};
