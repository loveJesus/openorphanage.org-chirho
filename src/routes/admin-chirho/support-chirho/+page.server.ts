// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { supportTicketsChirho, usersChirho } from '$lib/server/schema_chirho';
import { eq, desc, and, sql } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, url }) => {
	const dbChirho = getDbChirho(platform);

	const statusFilterChirho = url.searchParams.get('status') || '';
	const categoryFilterChirho = url.searchParams.get('category') || '';
	const priorityFilterChirho = url.searchParams.get('priority') || '';
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = 20;
	const offsetChirho = (pageChirho - 1) * limitChirho;

	const conditionsChirho = [];

	if (statusFilterChirho) {
		conditionsChirho.push(eq(supportTicketsChirho.statusChirho, statusFilterChirho as 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed'));
	}

	if (categoryFilterChirho) {
		conditionsChirho.push(eq(supportTicketsChirho.categoryChirho, categoryFilterChirho as 'general' | 'donation' | 'technical' | 'orphanage' | 'safety' | 'gdpr' | 'other'));
	}

	if (priorityFilterChirho) {
		conditionsChirho.push(eq(supportTicketsChirho.priorityChirho, priorityFilterChirho as 'low' | 'normal' | 'high' | 'urgent'));
	}

	const whereClauseChirho = conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined;

	const ticketsResultChirho = await dbChirho
		.select({
			idChirho: supportTicketsChirho.idChirho,
			subjectChirho: supportTicketsChirho.subjectChirho,
			emailChirho: supportTicketsChirho.emailChirho,
			nameChirho: supportTicketsChirho.nameChirho,
			categoryChirho: supportTicketsChirho.categoryChirho,
			priorityChirho: supportTicketsChirho.priorityChirho,
			statusChirho: supportTicketsChirho.statusChirho,
			contentPreviewChirho: supportTicketsChirho.contentPreviewChirho,
			createdAtChirho: supportTicketsChirho.createdAtChirho,
			updatedAtChirho: supportTicketsChirho.updatedAtChirho,
			userEmailChirho: usersChirho.emailChirho
		})
		.from(supportTicketsChirho)
		.leftJoin(usersChirho, eq(supportTicketsChirho.userIdChirho, usersChirho.idChirho))
		.where(whereClauseChirho)
		.orderBy(
			// Priority order: urgent, high, normal, low
			sql`CASE ${supportTicketsChirho.priorityChirho}
				WHEN 'urgent' THEN 1
				WHEN 'high' THEN 2
				WHEN 'normal' THEN 3
				WHEN 'low' THEN 4
				ELSE 5
			END`,
			desc(supportTicketsChirho.createdAtChirho)
		)
		.limit(limitChirho)
		.offset(offsetChirho);

	const countResultChirho = await dbChirho
		.select({ countChirho: sql<number>`count(*)` })
		.from(supportTicketsChirho)
		.where(whereClauseChirho);

	const totalChirho = countResultChirho[0]?.countChirho || 0;

	// Get counts by status
	const statusCountsChirho = await dbChirho
		.select({
			statusChirho: supportTicketsChirho.statusChirho,
			countChirho: sql<number>`count(*)`
		})
		.from(supportTicketsChirho)
		.groupBy(supportTicketsChirho.statusChirho);

	// Get counts by priority (for urgent/high alerts)
	const priorityCountsChirho = await dbChirho
		.select({
			priorityChirho: supportTicketsChirho.priorityChirho,
			countChirho: sql<number>`count(*)`
		})
		.from(supportTicketsChirho)
		.where(eq(supportTicketsChirho.statusChirho, 'open'))
		.groupBy(supportTicketsChirho.priorityChirho);

	return {
		ticketsChirho: ticketsResultChirho,
		statusCountsChirho: Object.fromEntries(statusCountsChirho.map(sChirho => [sChirho.statusChirho, sChirho.countChirho])),
		priorityCountsChirho: Object.fromEntries(priorityCountsChirho.map(pChirho => [pChirho.priorityChirho, pChirho.countChirho])),
		paginationChirho: {
			currentPageChirho: pageChirho,
			totalPagesChirho: Math.ceil(totalChirho / limitChirho),
			totalChirho
		},
		filtersChirho: {
			statusChirho: statusFilterChirho,
			categoryChirho: categoryFilterChirho,
			priorityChirho: priorityFilterChirho
		}
	};
};

export const actions: Actions = {
	updateStatusChirho: async ({ request, platform, locals }) => {
		if (!locals.userChirho || !['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const ticketIdChirho = parseInt(formDataChirho.get('ticketIdChirho') as string);
		const newStatusChirho = formDataChirho.get('statusChirho') as string;

		if (!ticketIdChirho || !newStatusChirho) {
			return fail(400, { errorChirho: 'Missing required fields' });
		}

		const dbChirho = getDbChirho(platform);
		const updateDataChirho: Record<string, string> = {
			statusChirho: newStatusChirho,
			updatedAtChirho: new Date().toISOString()
		};

		if (newStatusChirho === 'resolved' || newStatusChirho === 'closed') {
			updateDataChirho.resolvedAtChirho = new Date().toISOString();
			updateDataChirho.resolvedByChirho = locals.userChirho.userIdChirho;
		}

		await dbChirho
			.update(supportTicketsChirho)
			.set(updateDataChirho)
			.where(eq(supportTicketsChirho.idChirho, ticketIdChirho));

		return { successChirho: true };
	},

	updatePriorityChirho: async ({ request, platform, locals }) => {
		if (!locals.userChirho || !['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const ticketIdChirho = parseInt(formDataChirho.get('ticketIdChirho') as string);
		const newPriorityChirho = formDataChirho.get('priorityChirho') as string;

		if (!ticketIdChirho || !newPriorityChirho) {
			return fail(400, { errorChirho: 'Missing required fields' });
		}

		const dbChirho = getDbChirho(platform);

		await dbChirho
			.update(supportTicketsChirho)
			.set({
				priorityChirho: newPriorityChirho as 'low' | 'normal' | 'high' | 'urgent',
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(supportTicketsChirho.idChirho, ticketIdChirho));

		return { successChirho: true };
	}
};
