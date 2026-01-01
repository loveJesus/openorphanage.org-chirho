// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { needsChirho, orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc, like, or, and, count } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const dbChirho = getDbChirho(locals.platformChirho);

	// Get query parameters
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = 20;
	const offsetChirho = (pageChirho - 1) * limitChirho;
	const searchChirho = url.searchParams.get('search') || '';
	const statusChirho = url.searchParams.get('status') || 'all';
	const categoryChirho = url.searchParams.get('category') || 'all';
	const priorityChirho = url.searchParams.get('priority') || 'all';

	// Build conditions
	const conditionsChirho = [];

	if (searchChirho) {
		conditionsChirho.push(
			or(
				like(needsChirho.titleChirho, `%${searchChirho}%`),
				like(needsChirho.shortDescriptionChirho, `%${searchChirho}%`)
			)
		);
	}

	if (statusChirho !== 'all') {
		conditionsChirho.push(eq(needsChirho.statusChirho, statusChirho as 'active' | 'funded' | 'completed' | 'cancelled'));
	}

	if (categoryChirho !== 'all') {
		conditionsChirho.push(eq(needsChirho.categoryChirho, categoryChirho as 'food' | 'medical' | 'education' | 'clothing' | 'infrastructure' | 'staff' | 'utilities' | 'transportation' | 'other'));
	}

	if (priorityChirho !== 'all') {
		conditionsChirho.push(eq(needsChirho.priorityChirho, priorityChirho as 'low' | 'medium' | 'high' | 'urgent'));
	}

	// Get needs with orphanage info
	const [needsListChirho, totalCountChirho] = await Promise.all([
		dbChirho
			.select({
				idChirho: needsChirho.idChirho,
				orphanageIdChirho: needsChirho.orphanageIdChirho,
				titleChirho: needsChirho.titleChirho,
				shortDescriptionChirho: needsChirho.shortDescriptionChirho,
				categoryChirho: needsChirho.categoryChirho,
				priorityChirho: needsChirho.priorityChirho,
				amountNeededChirho: needsChirho.amountNeededChirho,
				amountRaisedChirho: needsChirho.amountRaisedChirho,
				currencyChirho: needsChirho.currencyChirho,
				statusChirho: needsChirho.statusChirho,
				createdAtChirho: needsChirho.createdAtChirho,
				orphanageNameChirho: orphanagesChirho.nameChirho
			})
			.from(needsChirho)
			.leftJoin(orphanagesChirho, eq(needsChirho.orphanageIdChirho, orphanagesChirho.idChirho))
			.where(conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined)
			.orderBy(desc(needsChirho.createdAtChirho))
			.limit(limitChirho)
			.offset(offsetChirho),
		dbChirho
			.select({ countChirho: count() })
			.from(needsChirho)
			.where(conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined)
	]);

	// Get status counts
	const statusCountsChirho = await dbChirho
		.select({
			statusChirho: needsChirho.statusChirho,
			countChirho: count()
		})
		.from(needsChirho)
		.groupBy(needsChirho.statusChirho);

	const countsByStatusChirho: Record<string, number> = {
		active: 0,
		funded: 0,
		completed: 0,
		cancelled: 0,
		total: 0
	};

	for (const rowChirho of statusCountsChirho) {
		if (rowChirho.statusChirho) {
			countsByStatusChirho[rowChirho.statusChirho] = rowChirho.countChirho;
		}
		countsByStatusChirho.total += rowChirho.countChirho;
	}

	// Get orphanages for filter
	const orphanagesListChirho = await dbChirho
		.select({
			idChirho: orphanagesChirho.idChirho,
			nameChirho: orphanagesChirho.nameChirho
		})
		.from(orphanagesChirho)
		.where(eq(orphanagesChirho.isActiveChirho, true))
		.orderBy(orphanagesChirho.nameChirho);

	return {
		needsChirho: needsListChirho,
		paginationChirho: {
			pageChirho,
			limitChirho,
			totalChirho: totalCountChirho[0]?.countChirho || 0,
			totalPagesChirho: Math.ceil((totalCountChirho[0]?.countChirho || 0) / limitChirho)
		},
		filtersChirho: {
			searchChirho,
			statusChirho,
			categoryChirho,
			priorityChirho
		},
		statusCountsChirho: countsByStatusChirho,
		orphanagesChirho: orphanagesListChirho
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho || (userChirho.roleChirho !== 'admin' && userChirho.roleChirho !== 'super_admin' && userChirho.roleChirho !== 'staff')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const needIdChirho = parseInt(formDataChirho.get('needId') as string);
		const newStatusChirho = formDataChirho.get('status') as string;

		const validStatusesChirho = ['active', 'funded', 'completed', 'cancelled'];
		if (!validStatusesChirho.includes(newStatusChirho)) {
			return fail(400, { errorChirho: 'Invalid status' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		const updatesChirho: Record<string, unknown> = {
			statusChirho: newStatusChirho as 'active' | 'funded' | 'completed' | 'cancelled',
			updatedAtChirho: new Date().toISOString()
		};

		if (newStatusChirho === 'completed') {
			updatesChirho.fulfilledAtChirho = new Date().toISOString();
		}

		await dbChirho
			.update(needsChirho)
			.set(updatesChirho)
			.where(eq(needsChirho.idChirho, needIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'update_need_status',
			entityTypeChirho: 'need',
			entityIdChirho: needIdChirho,
			detailsChirho: JSON.stringify({ newStatusChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Need status updated successfully' };
	},

	updatePriority: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho || (userChirho.roleChirho !== 'admin' && userChirho.roleChirho !== 'super_admin' && userChirho.roleChirho !== 'staff')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const needIdChirho = parseInt(formDataChirho.get('needId') as string);
		const newPriorityChirho = formDataChirho.get('priority') as string;

		const validPrioritiesChirho = ['low', 'medium', 'high', 'urgent'];
		if (!validPrioritiesChirho.includes(newPriorityChirho)) {
			return fail(400, { errorChirho: 'Invalid priority' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(needsChirho)
			.set({
				priorityChirho: newPriorityChirho as 'low' | 'medium' | 'high' | 'urgent',
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(needsChirho.idChirho, needIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'update_need_priority',
			entityTypeChirho: 'need',
			entityIdChirho: needIdChirho,
			detailsChirho: JSON.stringify({ newPriorityChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Need priority updated' };
	},

	delete: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho || (userChirho.roleChirho !== 'admin' && userChirho.roleChirho !== 'super_admin')) {
			return fail(403, { errorChirho: 'Only admins can delete needs' });
		}

		const formDataChirho = await request.formData();
		const needIdChirho = parseInt(formDataChirho.get('needId') as string);

		const dbChirho = getDbChirho(locals.platformChirho);

		// Soft delete by setting status to cancelled
		await dbChirho
			.update(needsChirho)
			.set({
				statusChirho: 'cancelled',
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(needsChirho.idChirho, needIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'delete_need',
			entityTypeChirho: 'need',
			entityIdChirho: needIdChirho,
			detailsChirho: JSON.stringify({ actionChirho: 'soft_delete' }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Need deleted' };
	}
};
