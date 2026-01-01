// For God so loved the world that He gave His only begotten Son...
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDbChirho } from '$lib/server/db_chirho';
import { feedbackChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { KvHelperChirho } from '$lib/server/kv_chirho';
import { checkRateLimitChirho, getClientIpChirho, sanitizeStringChirho } from '$lib/server/security_chirho';
import { env } from '$env/dynamic/private';

interface TurnstileResponseChirho {
	success: boolean;
	'error-codes'?: string[];
}

async function verifyTurnstileChirho(tokenChirho: string, ipChirho: string): Promise<boolean> {
	const secretKeyChirho = env.TURNSTILE_SECRET_KEY_CHIRHO;

	if (!secretKeyChirho) {
		console.warn('Turnstile secret key not configured - skipping verification');
		return true; // Skip verification if not configured
	}

	try {
		const formDataChirho = new FormData();
		formDataChirho.append('secret', secretKeyChirho);
		formDataChirho.append('response', tokenChirho);
		formDataChirho.append('remoteip', ipChirho);

		const responseChirho = await fetch(
			'https://challenges.cloudflare.com/turnstile/v0/siteverify',
			{
				method: 'POST',
				body: formDataChirho
			}
		);

		const resultChirho: TurnstileResponseChirho = await responseChirho.json();
		return resultChirho.success;
	} catch (errorChirho) {
		console.error('Turnstile verification error:', errorChirho);
		return false;
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const userChirho = locals.userChirho;
	const kvChirho = new KvHelperChirho(locals.platformChirho.KV_CHIRHO);

	// Rate limiting
	const ipChirho = getClientIpChirho(request);
	const rateLimitKeyChirho = userChirho ? `feedback-bubble:${userChirho.userIdChirho}` : `feedback-bubble:${ipChirho}`;
	const rateLimitChirho = await checkRateLimitChirho(kvChirho, rateLimitKeyChirho, 'feedback/bubble');

	if (!rateLimitChirho.allowedChirho) {
		return json({
			successChirho: false,
			errorChirho: 'Too many submissions. Please try again later.'
		}, {
			status: 429,
			headers: { 'Retry-After': rateLimitChirho.retryAfterSecondsChirho?.toString() || '3600' }
		});
	}

	try {
		const bodyChirho = await request.json();
		const {
			typeChirho,
			contentChirho,
			pageChirho,
			turnstileTokenChirho
		} = bodyChirho;

		// Validate required fields
		if (!typeChirho || !contentChirho || !turnstileTokenChirho) {
			return json({ successChirho: false, errorChirho: 'Missing required fields' }, { status: 400 });
		}

		// Validate feedback type
		const validTypesChirho = ['bug', 'feature', 'general', 'praise'];
		if (!validTypesChirho.includes(typeChirho)) {
			return json({ successChirho: false, errorChirho: 'Invalid feedback type' }, { status: 400 });
		}

		// Verify Turnstile token
		const isTurnstileValidChirho = await verifyTurnstileChirho(turnstileTokenChirho, ipChirho);
		if (!isTurnstileValidChirho) {
			return json({ successChirho: false, errorChirho: 'Security verification failed. Please try again.' }, { status: 400 });
		}

		// Sanitize content
		const sanitizedContentChirho = sanitizeStringChirho(contentChirho.trim());

		if (sanitizedContentChirho.length < 5) {
			return json({ successChirho: false, errorChirho: 'Feedback is too short' }, { status: 400 });
		}

		if (sanitizedContentChirho.length > 2000) {
			return json({ successChirho: false, errorChirho: 'Feedback is too long (max 2000 characters)' }, { status: 400 });
		}

		const dbChirho = getDbChirho(locals.platformChirho);
		const timestampChirho = new Date().toISOString();
		const feedbackIdChirho = crypto.randomUUID();

		// Collect metadata
		const userAgentChirho = request.headers.get('User-Agent') || 'unknown';
		const refererChirho = request.headers.get('Referer') || 'direct';

		const metadataChirho = {
			feedbackIdChirho,
			pageChirho: pageChirho || '/',
			ipChirho,
			userAgentChirho,
			refererChirho,
			userIdChirho: userChirho?.userIdChirho || null,
			userEmailChirho: userChirho?.emailChirho || null,
			userRoleChirho: userChirho?.roleChirho || null,
			timestampChirho,
			typeChirho,
			contentPreviewChirho: sanitizedContentChirho.substring(0, 100)
		};

		// Store full metadata in KV (for admin review and analytics)
		await kvChirho.setChirho(
			`feedback-metadata:${feedbackIdChirho}`,
			JSON.stringify({
				...metadataChirho,
				fullContentChirho: sanitizedContentChirho
			}),
			60 * 60 * 24 * 90 // 90 days
		);

		// Store content in KV if it's long
		let contentKvKeyChirho: string | null = null;
		if (sanitizedContentChirho.length > 500) {
			contentKvKeyChirho = `feedback-content:${feedbackIdChirho}`;
			await kvChirho.setChirho(contentKvKeyChirho, sanitizedContentChirho, 60 * 60 * 24 * 365);
		}

		// Map bubble types to database types
		const dbTypeMapChirho: Record<string, 'bug' | 'feature_request' | 'general'> = {
			'bug': 'bug',
			'feature': 'feature_request',
			'general': 'general',
			'praise': 'general'
		};

		// Insert into database
		await dbChirho.insert(feedbackChirho).values({
			userIdChirho: userChirho ? parseInt(userChirho.userIdChirho) : null,
			emailChirho: userChirho?.emailChirho || null,
			typeChirho: dbTypeMapChirho[typeChirho] || 'general',
			contentPreviewChirho: sanitizedContentChirho.substring(0, 200),
			contentKvKeyChirho,
			isAnonymousChirho: !userChirho,
			publicVisibleChirho: false,
			statusChirho: 'pending',
			adminNotesChirho: JSON.stringify({
				sourceChirho: 'bubble',
				originalTypeChirho: typeChirho,
				pageChirho,
				metadataKeyChirho: `feedback-metadata:${feedbackIdChirho}`
			}),
			createdAtChirho: timestampChirho
		});

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: userChirho ? parseInt(userChirho.userIdChirho) : null,
			actionChirho: 'feedback_bubble_submit',
			entityTypeChirho: 'feedback',
			detailsChirho: JSON.stringify({
				feedbackIdChirho,
				typeChirho,
				pageChirho,
				ipChirho: ipChirho.substring(0, 20) // Partial IP for privacy
			}),
			ipAddressChirho: ipChirho,
			userAgentChirho: userAgentChirho.substring(0, 200),
			createdAtChirho: timestampChirho
		});

		// Track feedback count per page (for analytics)
		const pageStatsKeyChirho = `feedback-page-stats:${encodeURIComponent(pageChirho || '/')}`;
		const existingStatsChirho = await kvChirho.getChirho(pageStatsKeyChirho);
		const statsChirho = existingStatsChirho ? JSON.parse(existingStatsChirho) : { totalChirho: 0, typesChirho: {} };
		statsChirho.totalChirho += 1;
		statsChirho.typesChirho[typeChirho] = (statsChirho.typesChirho[typeChirho] || 0) + 1;
		statsChirho.lastFeedbackChirho = timestampChirho;
		await kvChirho.setChirho(pageStatsKeyChirho, JSON.stringify(statsChirho), 60 * 60 * 24 * 365);

		return json({
			successChirho: true,
			feedbackIdChirho,
			messageChirho: 'Thank you for your feedback!'
		});
	} catch (errorChirho) {
		console.error('Feedback bubble error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Failed to submit feedback' }, { status: 500 });
	}
};

// GET - Health check / stats (admin only)
export const GET: RequestHandler = async ({ locals }) => {
	const userChirho = locals.userChirho;

	if (!userChirho || !['admin', 'super_admin'].includes(userChirho.roleChirho)) {
		return json({ errorChirho: 'Unauthorized' }, { status: 403 });
	}

	return json({
		statusChirho: 'healthy',
		serviceChirho: 'Feedback Bubble API',
		timestampChirho: new Date().toISOString()
	});
};
