// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { orphanagesChirho, usersChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc, like, or, sql, and, count } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const dbChirho = getDbChirho(locals.platformChirho);

	// Get query parameters
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = 20;
	const offsetChirho = (pageChirho - 1) * limitChirho;
	const searchChirho = url.searchParams.get('search') || '';
	const statusChirho = url.searchParams.get('status') || 'all';

	// Build conditions
	const conditionsChirho = [];

	if (searchChirho) {
		conditionsChirho.push(
			or(
				like(orphanagesChirho.nameChirho, `%${searchChirho}%`),
				like(orphanagesChirho.countryChirho, `%${searchChirho}%`),
				like(orphanagesChirho.contactEmailChirho, `%${searchChirho}%`)
			)
		);
	}

	if (statusChirho !== 'all') {
		conditionsChirho.push(eq(orphanagesChirho.verificationStatusChirho, statusChirho as 'pending' | 'verified' | 'rejected'));
	}

	// Get orphanages with count
	const [orphanagesListChirho, totalCountChirho] = await Promise.all([
		dbChirho
			.select()
			.from(orphanagesChirho)
			.where(conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined)
			.orderBy(desc(orphanagesChirho.createdAtChirho))
			.limit(limitChirho)
			.offset(offsetChirho),
		dbChirho
			.select({ countChirho: count() })
			.from(orphanagesChirho)
			.where(conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined)
	]);

	// Get status counts
	const statusCountsChirho = await dbChirho
		.select({
			statusChirho: orphanagesChirho.verificationStatusChirho,
			countChirho: count()
		})
		.from(orphanagesChirho)
		.groupBy(orphanagesChirho.verificationStatusChirho);

	const countsByStatusChirho = {
		pending: 0,
		verified: 0,
		rejected: 0,
		total: 0
	};

	for (const rowChirho of statusCountsChirho) {
		if (rowChirho.statusChirho) {
			countsByStatusChirho[rowChirho.statusChirho as keyof typeof countsByStatusChirho] = rowChirho.countChirho;
		}
		countsByStatusChirho.total += rowChirho.countChirho;
	}

	// Get countries for filter
	const countriesChirho = await dbChirho
		.selectDistinct({ countryChirho: orphanagesChirho.countryChirho })
		.from(orphanagesChirho)
		.orderBy(orphanagesChirho.countryChirho);

	return {
		orphanagesChirho: orphanagesListChirho,
		paginationChirho: {
			pageChirho,
			limitChirho,
			totalChirho: totalCountChirho[0]?.countChirho || 0,
			totalPagesChirho: Math.ceil((totalCountChirho[0]?.countChirho || 0) / limitChirho)
		},
		filtersChirho: {
			searchChirho,
			statusChirho
		},
		statusCountsChirho: countsByStatusChirho,
		countriesChirho: countriesChirho.map(c => c.countryChirho).filter(Boolean) as string[]
	};
};

export const actions: Actions = {
	verify: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho || (userChirho.roleChirho !== 'admin' && userChirho.roleChirho !== 'super_admin')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const idChirho = parseInt(formDataChirho.get('id') as string);

		if (!idChirho) {
			return fail(400, { errorChirho: 'Invalid orphanage ID' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(orphanagesChirho)
			.set({
				verificationStatusChirho: 'verified',
				verifiedAtChirho: new Date().toISOString(),
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(orphanagesChirho.idChirho, idChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'verify_orphanage',
			entityTypeChirho: 'orphanage',
			entityIdChirho: idChirho,
			detailsChirho: JSON.stringify({ statusChirho: 'verified' }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Orphanage verified successfully' };
	},

	reject: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho || (userChirho.roleChirho !== 'admin' && userChirho.roleChirho !== 'super_admin')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const idChirho = parseInt(formDataChirho.get('id') as string);
		const reasonChirho = formDataChirho.get('reason') as string || 'No reason provided';

		if (!idChirho) {
			return fail(400, { errorChirho: 'Invalid orphanage ID' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(orphanagesChirho)
			.set({
				verificationStatusChirho: 'rejected',
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(orphanagesChirho.idChirho, idChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'reject_orphanage',
			entityTypeChirho: 'orphanage',
			entityIdChirho: idChirho,
			detailsChirho: JSON.stringify({ statusChirho: 'rejected', reasonChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Orphanage rejected' };
	},

	toggleActive: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho || (userChirho.roleChirho !== 'admin' && userChirho.roleChirho !== 'super_admin')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const idChirho = parseInt(formDataChirho.get('id') as string);
		const isActiveChirho = formDataChirho.get('isActive') === 'true';

		if (!idChirho) {
			return fail(400, { errorChirho: 'Invalid orphanage ID' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(orphanagesChirho)
			.set({
				isActiveChirho: !isActiveChirho,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(orphanagesChirho.idChirho, idChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: isActiveChirho ? 'deactivate_orphanage' : 'activate_orphanage',
			entityTypeChirho: 'orphanage',
			entityIdChirho: idChirho,
			detailsChirho: JSON.stringify({ isActiveChirho: !isActiveChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: isActiveChirho ? 'Orphanage deactivated' : 'Orphanage activated' };
	}
};
