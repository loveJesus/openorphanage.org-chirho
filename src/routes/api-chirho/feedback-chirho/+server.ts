// For God so loved the world that He gave His only begotten Son...
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho, generateIdChirho, nowChirho } from '$lib/server/db_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { feedbackChirho } from '$lib/server/schema_chirho';
import { checkRateLimitChirho, createRateLimitHeadersChirho, getClientIpChirho } from '$lib/server/security_chirho';
import { sendEmailChirho, createSafetyConcernEmailChirho, createFeedbackConfirmationEmailChirho } from '$lib/server/email_chirho';
import type { FeedbackFormDataChirho } from '$lib/types_chirho';

const LARGE_CONTENT_THRESHOLD_CHIRHO = 2000; // Store in KV if > 2KB

export const POST: RequestHandler = async ({ request, platform, locals }) => {
	try {
		if (!platform?.env) {
			return json({ successChirho: false, errorChirho: 'Platform not available' }, { status: 500 });
		}

		const kvChirho = getKvChirho(platform);

		// Rate limiting
		const ipChirho = getClientIpChirho(request);
		const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'feedback/submit');

		if (!rateLimitChirho.allowedChirho) {
			return json(
				{ successChirho: false, errorChirho: 'Too many requests. Please try again later.' },
				{ status: 429, headers: createRateLimitHeadersChirho(rateLimitChirho) }
			);
		}

		// Parse request body
		const bodyChirho = await request.json() as FeedbackFormDataChirho;
		const { categoryChirho, ratingChirho, contentChirho, anonymousChirho, publicVisibleChirho } = bodyChirho;

		// Validate
		if (!contentChirho || contentChirho.length < 10) {
			return json({ successChirho: false, errorChirho: 'Feedback must be at least 10 characters' }, { status: 400 });
		}

		if (!['bug', 'feature', 'general', 'safety_concern'].includes(categoryChirho)) {
			return json({ successChirho: false, errorChirho: 'Invalid category' }, { status: 400 });
		}

		if (ratingChirho !== undefined && (ratingChirho < 1 || ratingChirho > 5)) {
			return json({ successChirho: false, errorChirho: 'Rating must be between 1 and 5' }, { status: 400 });
		}

		const dbChirho = getDbChirho(platform);
		const feedbackIdChirho = generateIdChirho();
		const timestampChirho = nowChirho();

		// Store large content in KV
		let contentKvKeyChirho: string | null = null;
		let shortContentChirho: string | null = contentChirho;

		if (contentChirho.length > LARGE_CONTENT_THRESHOLD_CHIRHO) {
			contentKvKeyChirho = await kvChirho.setFeedbackContentChirho(feedbackIdChirho, contentChirho);
			shortContentChirho = contentChirho.substring(0, 200) + '...'; // Store excerpt in D1
		}

		// Insert feedback
		await dbChirho.insert(feedbackChirho).values({
			feedbackIdChirho,
			userIdChirho: anonymousChirho ? null : (locals.userChirho?.userIdChirho || null),
			categoryChirho,
			ratingChirho: ratingChirho || null,
			contentChirho: shortContentChirho,
			contentKvKeyChirho,
			anonymousChirho,
			publicVisibleChirho,
			statusChirho: 'new',
			createdAtChirho: timestampChirho
		});

		// Send emails asynchronously
		if (platform.context) {
			platform.context.waitUntil((async () => {
				const apiKeyChirho = platform.env.MASTER_2SMTP_API_KEY_CHIRHO;
				if (!apiKeyChirho) return;

				// If safety concern, notify admin immediately
				if (categoryChirho === 'safety_concern') {
					const emailContentChirho = createSafetyConcernEmailChirho(
						feedbackIdChirho,
						contentChirho,
						anonymousChirho,
						locals.userChirho?.emailChirho
					);

					await sendEmailChirho(apiKeyChirho, {
						toChirho: platform.env.EMAIL_ADMIN_CHIRHO,
						subjectChirho: emailContentChirho.subjectChirho,
						htmlChirho: emailContentChirho.htmlChirho,
						textChirho: emailContentChirho.textChirho
					});
				}

				// Send confirmation to user if not anonymous
				if (!anonymousChirho && locals.userChirho?.emailChirho) {
					const confirmationChirho = createFeedbackConfirmationEmailChirho(feedbackIdChirho, categoryChirho);

					await sendEmailChirho(apiKeyChirho, {
						toChirho: locals.userChirho.emailChirho,
						subjectChirho: confirmationChirho.subjectChirho,
						htmlChirho: confirmationChirho.htmlChirho,
						textChirho: confirmationChirho.textChirho
					});
				}
			})());
		}

		return json({
			successChirho: true,
			dataChirho: {
				feedbackIdChirho,
				messageChirho: categoryChirho === 'safety_concern'
					? 'Your safety concern has been flagged for immediate review.'
					: 'Thank you for your feedback!'
			}
		}, { headers: createRateLimitHeadersChirho(rateLimitChirho) });
	} catch (errorChirho) {
		console.error('Feedback submission error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Internal server error' }, { status: 500 });
	}
};

// GET: Retrieve public feedback
export const GET: RequestHandler = async ({ platform, url }) => {
	try {
		if (!platform?.env) {
			return json({ successChirho: false, errorChirho: 'Platform not available' }, { status: 500 });
		}

		const dbChirho = getDbChirho(platform);
		const pageChirho = parseInt(url.searchParams.get('page') || '1');
		const limitChirho = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
		const offsetChirho = (pageChirho - 1) * limitChirho;

		// Get public feedback
		const feedbackListChirho = await dbChirho.query.feedbackChirho.findMany({
			where: (fChirho, { eq, and }) => and(
				eq(fChirho.publicVisibleChirho, true),
				eq(fChirho.statusChirho, 'resolved') // Only show resolved public feedback
			),
			orderBy: (fChirho, { desc }) => [desc(fChirho.createdAtChirho)],
			limit: limitChirho,
			offset: offsetChirho
		});

		return json({
			successChirho: true,
			dataChirho: feedbackListChirho.map(fChirho => ({
				feedbackIdChirho: fChirho.feedbackIdChirho,
				categoryChirho: fChirho.categoryChirho,
				ratingChirho: fChirho.ratingChirho,
				contentChirho: fChirho.contentChirho,
				createdAtChirho: fChirho.createdAtChirho
			}))
		});
	} catch (errorChirho) {
		console.error('Feedback retrieval error:', errorChirho);
		return json({ successChirho: false, errorChirho: 'Internal server error' }, { status: 500 });
	}
};
