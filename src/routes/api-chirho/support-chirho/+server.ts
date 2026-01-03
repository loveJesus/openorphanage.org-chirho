// For God so loved the world that He gave His only begotten Son...
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { supportTicketsChirho } from '$lib/server/schema_chirho';
import { logAuditChirho, AUDIT_ACTIONS_CHIRHO, getClientIpChirho as getClientIpAuditChirho, getUserAgentChirho } from '$lib/server/audit_chirho';
import { checkRateLimitChirho, createRateLimitHeadersChirho, getClientIpChirho } from '$lib/server/security_chirho';
import { verifyTurnstileChirho, getTurnstileSecretChirho } from '$lib/server/turnstile_chirho';
import { desc, eq } from 'drizzle-orm';

/**
 * Create a new support ticket
 */
export const POST: RequestHandler = async ({ request, locals, platform }) => {
	if (!platform?.env) {
		throw error(500, 'Platform not available');
	}

	const kvChirho = getKvChirho(platform);

	// Rate limiting
	const ipChirho = getClientIpChirho(request);
	const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'support/ticket');

	if (!rateLimitChirho.allowedChirho) {
		return json(
			{ successChirho: false, errorChirho: 'Too many requests. Please try again later.' },
			{ status: 429, headers: createRateLimitHeadersChirho(rateLimitChirho) }
		);
	}

	const dbChirho = getDbChirho(platform);
	const sessionChirho = locals.sessionChirho;

	try {
		const bodyChirho = await request.json();
		const { subjectChirho, categoryChirho, contentChirho, emailChirho, nameChirho, turnstileTokenChirho } = bodyChirho;

		// Verify Turnstile (skip for authenticated users)
		if (!sessionChirho?.userChirho) {
			const turnstileSecretChirho = getTurnstileSecretChirho(platform);
			const isTurnstileValidChirho = await verifyTurnstileChirho(
				turnstileTokenChirho || '',
				ipChirho,
				turnstileSecretChirho
			);
			if (!isTurnstileValidChirho) {
				return json(
					{ successChirho: false, errorChirho: 'Security verification failed. Please try again.' },
					{ status: 400 }
				);
			}
		}

		// Validation
		if (!subjectChirho || !contentChirho) {
			throw error(400, 'Subject and content are required');
		}

		// Use logged in user email or require email for anonymous
		const userEmailChirho = sessionChirho?.userChirho?.emailChirho || emailChirho;
		if (!userEmailChirho) {
			throw error(400, 'Email is required');
		}

		// Create preview (first 200 chars)
		const previewChirho = contentChirho.substring(0, 200) + (contentChirho.length > 200 ? '...' : '');

		// TODO: Store full content in KV if > 500 chars
		const kvKeyChirho = contentChirho.length > 500 ? `ticket_content_${Date.now()}` : null;

		const resultChirho = await dbChirho.insert(supportTicketsChirho).values({
			userIdChirho: sessionChirho?.userChirho?.idChirho || null,
			emailChirho: userEmailChirho,
			nameChirho: nameChirho || sessionChirho?.userChirho?.nameChirho || null,
			subjectChirho,
			categoryChirho: categoryChirho || 'general',
			priorityChirho: 'normal',
			statusChirho: 'open',
			contentPreviewChirho: previewChirho,
			contentKvKeyChirho: kvKeyChirho,
			createdAtChirho: new Date().toISOString()
		}).returning({ idChirho: supportTicketsChirho.idChirho });

		// Audit log
		await logAuditChirho(dbChirho, {
			userIdChirho: sessionChirho?.userChirho?.idChirho,
			actionChirho: AUDIT_ACTIONS_CHIRHO.TICKET_CREATED,
			entityTypeChirho: 'support_ticket',
			entityIdChirho: resultChirho[0]?.idChirho,
			detailsChirho: { categoryChirho, subjectChirho },
			ipAddressChirho: getClientIpAuditChirho(request),
			userAgentChirho: getUserAgentChirho(request)
		});

		return json({
			successChirho: true,
			ticketIdChirho: resultChirho[0]?.idChirho,
			messageChirho: 'Support ticket created successfully. We will respond within 48 hours.'
		});
	} catch (errChirho) {
		console.error('Support ticket error:', errChirho);
		if (errChirho instanceof Error && 'status' in errChirho) {
			throw errChirho;
		}
		throw error(500, 'Failed to create support ticket');
	}
};

/**
 * Get user's support tickets (if logged in)
 */
export const GET: RequestHandler = async ({ locals, platform }) => {
	const sessionChirho = locals.sessionChirho;

	if (!sessionChirho?.userChirho) {
		throw error(401, 'Authentication required to view tickets');
	}

	const dbChirho = getDbChirho(platform);

	try {
		const ticketsChirho = await dbChirho
			.select({
				idChirho: supportTicketsChirho.idChirho,
				subjectChirho: supportTicketsChirho.subjectChirho,
				categoryChirho: supportTicketsChirho.categoryChirho,
				statusChirho: supportTicketsChirho.statusChirho,
				priorityChirho: supportTicketsChirho.priorityChirho,
				createdAtChirho: supportTicketsChirho.createdAtChirho,
				resolvedAtChirho: supportTicketsChirho.resolvedAtChirho
			})
			.from(supportTicketsChirho)
			.where(eq(supportTicketsChirho.userIdChirho, sessionChirho.userChirho.idChirho))
			.orderBy(desc(supportTicketsChirho.createdAtChirho))
			.all();

		return json({ ticketsChirho });
	} catch (errChirho) {
		console.error('Get tickets error:', errChirho);
		throw error(500, 'Failed to fetch tickets');
	}
};
