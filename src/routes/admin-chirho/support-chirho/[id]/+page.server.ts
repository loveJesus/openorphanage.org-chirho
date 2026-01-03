// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { supportTicketsChirho, usersChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { logAuditChirho, AUDIT_ACTIONS_CHIRHO, getClientIpChirho, getUserAgentChirho } from '$lib/server/audit_chirho';

export const load: PageServerLoad = async ({ params, platform }) => {
	const ticketIdChirho = parseInt(params.id);

	if (isNaN(ticketIdChirho)) {
		throw error(400, 'Invalid ticket ID');
	}

	const dbChirho = getDbChirho(platform);

	// Get ticket with user info
	const ticketResultChirho = await dbChirho
		.select({
			idChirho: supportTicketsChirho.idChirho,
			userIdChirho: supportTicketsChirho.userIdChirho,
			emailChirho: supportTicketsChirho.emailChirho,
			nameChirho: supportTicketsChirho.nameChirho,
			subjectChirho: supportTicketsChirho.subjectChirho,
			categoryChirho: supportTicketsChirho.categoryChirho,
			priorityChirho: supportTicketsChirho.priorityChirho,
			statusChirho: supportTicketsChirho.statusChirho,
			contentPreviewChirho: supportTicketsChirho.contentPreviewChirho,
			contentKvKeyChirho: supportTicketsChirho.contentKvKeyChirho,
			assignedToChirho: supportTicketsChirho.assignedToChirho,
			resolvedByChirho: supportTicketsChirho.resolvedByChirho,
			resolutionNotesChirho: supportTicketsChirho.resolutionNotesChirho,
			createdAtChirho: supportTicketsChirho.createdAtChirho,
			updatedAtChirho: supportTicketsChirho.updatedAtChirho,
			resolvedAtChirho: supportTicketsChirho.resolvedAtChirho,
			userEmailChirho: usersChirho.emailChirho
		})
		.from(supportTicketsChirho)
		.leftJoin(usersChirho, eq(supportTicketsChirho.userIdChirho, usersChirho.idChirho))
		.where(eq(supportTicketsChirho.idChirho, ticketIdChirho))
		.limit(1);

	if (!ticketResultChirho.length) {
		throw error(404, 'Ticket not found');
	}

	const ticketChirho = ticketResultChirho[0];

	// Get full content from KV if stored there
	let fullContentChirho = ticketChirho.contentPreviewChirho || '';
	if (ticketChirho.contentKvKeyChirho && platform?.env?.KV_CHIRHO) {
		const kvChirho = getKvChirho(platform);
		const kvContentChirho = await kvChirho.getChirho(ticketChirho.contentKvKeyChirho);
		if (kvContentChirho) {
			fullContentChirho = kvContentChirho;
		}
	}

	// Get audit log for this ticket
	const auditHistoryChirho = await dbChirho
		.select({
			actionChirho: auditLogChirho.actionChirho,
			detailsChirho: auditLogChirho.detailsChirho,
			createdAtChirho: auditLogChirho.createdAtChirho,
			userEmailChirho: usersChirho.emailChirho
		})
		.from(auditLogChirho)
		.leftJoin(usersChirho, eq(auditLogChirho.userIdChirho, usersChirho.idChirho))
		.where(eq(auditLogChirho.entityIdChirho, ticketIdChirho))
		.orderBy(desc(auditLogChirho.createdAtChirho))
		.limit(20);

	// Get list of admins for assignment dropdown
	const adminsChirho = await dbChirho
		.select({
			idChirho: usersChirho.idChirho,
			emailChirho: usersChirho.emailChirho,
			nameChirho: usersChirho.nameChirho
		})
		.from(usersChirho)
		.where(eq(usersChirho.roleChirho, 'admin'));

	return {
		ticketChirho: {
			...ticketChirho,
			fullContentChirho
		},
		auditHistoryChirho,
		adminsChirho
	};
};

export const actions: Actions = {
	updateTicketChirho: async ({ params, request, platform, locals }) => {
		if (!locals.userChirho || !['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const ticketIdChirho = parseInt(params.id);
		const formDataChirho = await request.formData();
		const statusChirho = formDataChirho.get('statusChirho') as string;
		const priorityChirho = formDataChirho.get('priorityChirho') as string;
		const assignedToChirho = formDataChirho.get('assignedToChirho') as string;
		const resolutionNotesChirho = formDataChirho.get('resolutionNotesChirho') as string;

		const dbChirho = getDbChirho(platform);
		const nowChirho = new Date().toISOString();

		const updateDataChirho: Record<string, unknown> = {
			updatedAtChirho: nowChirho
		};

		if (statusChirho) {
			updateDataChirho.statusChirho = statusChirho;
			if (statusChirho === 'resolved' || statusChirho === 'closed') {
				updateDataChirho.resolvedAtChirho = nowChirho;
				updateDataChirho.resolvedByChirho = parseInt(locals.userChirho.userIdChirho);
			}
		}

		if (priorityChirho) {
			updateDataChirho.priorityChirho = priorityChirho;
		}

		if (assignedToChirho) {
			updateDataChirho.assignedToChirho = assignedToChirho === 'unassigned' ? null : parseInt(assignedToChirho);
		}

		if (resolutionNotesChirho !== undefined) {
			updateDataChirho.resolutionNotesChirho = resolutionNotesChirho;
		}

		await dbChirho
			.update(supportTicketsChirho)
			.set(updateDataChirho)
			.where(eq(supportTicketsChirho.idChirho, ticketIdChirho));

		// Audit log
		await logAuditChirho(dbChirho, {
			userIdChirho: parseInt(locals.userChirho.userIdChirho),
			actionChirho: AUDIT_ACTIONS_CHIRHO.TICKET_UPDATED,
			entityTypeChirho: 'support_ticket',
			entityIdChirho: ticketIdChirho,
			detailsChirho: {
				statusChirho,
				priorityChirho,
				assignedToChirho,
				hasResolutionNotesChirho: !!resolutionNotesChirho
			},
			ipAddressChirho: getClientIpChirho(request),
			userAgentChirho: getUserAgentChirho(request)
		});

		return { successChirho: true };
	},

	deleteTicketChirho: async ({ params, platform, locals }) => {
		if (!locals.userChirho || locals.userChirho.roleChirho !== 'super_admin') {
			return fail(403, { errorChirho: 'Only super admins can delete tickets' });
		}

		const ticketIdChirho = parseInt(params.id);
		const dbChirho = getDbChirho(platform);

		await dbChirho
			.delete(supportTicketsChirho)
			.where(eq(supportTicketsChirho.idChirho, ticketIdChirho));

		throw redirect(303, '/admin-chirho/support-chirho');
	}
};
