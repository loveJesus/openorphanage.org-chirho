// For God so loved the world that He gave His only begotten Son...
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDbChirho } from '$lib/server/db_chirho';
import { donationsChirho, needsChirho, orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

interface KingdomInvestWebhookChirho {
	eventChirho: string;
	donationIdChirho: string;
	amountChirho: number;
	currencyChirho: string;
	statusChirho: 'pending' | 'completed' | 'refunded' | 'failed';
	donorChirho?: {
		emailChirho?: string;
		nameChirho?: string;
		userIdChirho?: string;
	};
	metadataChirho?: {
		orphanageIdChirho?: string;
		needIdChirho?: string;
		campaignIdChirho?: string;
		messageChirho?: string;
		anonymousChirho?: boolean;
	};
	timestampChirho: string;
}

/**
 * Verify webhook signature from KingdomInvest.ing
 * Uses HMAC-SHA256 signature verification
 */
async function verifyWebhookSignatureChirho(
	payloadChirho: string,
	signatureChirho: string | null,
	secretChirho: string
): Promise<boolean> {
	if (!signatureChirho || !secretChirho) {
		return false;
	}

	try {
		const encoderChirho = new TextEncoder();
		const keyChirho = await crypto.subtle.importKey(
			'raw',
			encoderChirho.encode(secretChirho),
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['sign']
		);

		const signatureBufferChirho = await crypto.subtle.sign(
			'HMAC',
			keyChirho,
			encoderChirho.encode(payloadChirho)
		);

		const expectedSignatureChirho = Array.from(new Uint8Array(signatureBufferChirho))
			.map((bChirho) => bChirho.toString(16).padStart(2, '0'))
			.join('');

		// Compare signatures in constant time
		const sigChirho = signatureChirho.replace('sha256=', '');
		return sigChirho === expectedSignatureChirho;
	} catch {
		return false;
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const rawBodyChirho = await request.text();

	// Verify webhook signature
	const signatureChirho = request.headers.get('X-KingdomInvest-Signature');
	const webhookSecretChirho = env.KINGDOM_INVEST_WEBHOOK_SECRET_CHIRHO || '';

	if (webhookSecretChirho) {
		const isValidChirho = await verifyWebhookSignatureChirho(
			rawBodyChirho,
			signatureChirho,
			webhookSecretChirho
		);

		if (!isValidChirho) {
			console.error('Invalid webhook signature');
			return json({ errorChirho: 'Invalid signature' }, { status: 401 });
		}
	}

	try {
		const webhookDataChirho: KingdomInvestWebhookChirho = JSON.parse(rawBodyChirho);

		// Only process donation events
		if (!['donation.completed', 'donation.pending', 'donation.refunded', 'donation.failed'].includes(webhookDataChirho.eventChirho)) {
			return json({ successChirho: true, messageChirho: 'Event type ignored' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		// Parse metadata
		const orphanageIdChirho = webhookDataChirho.metadataChirho?.orphanageIdChirho
			? parseInt(webhookDataChirho.metadataChirho.orphanageIdChirho)
			: null;
		const needIdChirho = webhookDataChirho.metadataChirho?.needIdChirho
			? parseInt(webhookDataChirho.metadataChirho.needIdChirho)
			: null;

		// Map event to status
		let donationStatusChirho: 'pending' | 'completed' | 'refunded' | 'failed' = 'pending';
		if (webhookDataChirho.eventChirho === 'donation.completed') {
			donationStatusChirho = 'completed';
		} else if (webhookDataChirho.eventChirho === 'donation.refunded') {
			donationStatusChirho = 'refunded';
		} else if (webhookDataChirho.eventChirho === 'donation.failed') {
			donationStatusChirho = 'failed';
		}

		// Check if donation already exists
		const existingDonationsChirho = await dbChirho
			.select({ idChirho: donationsChirho.idChirho })
			.from(donationsChirho)
			.where(eq(donationsChirho.externalIdChirho, webhookDataChirho.donationIdChirho))
			.limit(1);

		if (existingDonationsChirho.length > 0) {
			// Update existing donation status
			await dbChirho
				.update(donationsChirho)
				.set({ statusChirho: donationStatusChirho })
				.where(eq(donationsChirho.externalIdChirho, webhookDataChirho.donationIdChirho));

			// Handle refund - decrease amount raised
			if (donationStatusChirho === 'refunded' && needIdChirho) {
				await dbChirho
					.update(needsChirho)
					.set({
						amountRaisedChirho: sql`MAX(0, ${needsChirho.amountRaisedChirho} - ${webhookDataChirho.amountChirho})`,
						updatedAtChirho: new Date().toISOString()
					})
					.where(eq(needsChirho.idChirho, needIdChirho));
			}

			return json({ successChirho: true, messageChirho: 'Donation updated' });
		}

		// Insert new donation
		await dbChirho.insert(donationsChirho).values({
			externalIdChirho: webhookDataChirho.donationIdChirho,
			orphanageIdChirho,
			needIdChirho,
			donorIdChirho: webhookDataChirho.donorChirho?.userIdChirho
				? parseInt(webhookDataChirho.donorChirho.userIdChirho)
				: null,
			amountChirho: webhookDataChirho.amountChirho,
			currencyChirho: webhookDataChirho.currencyChirho || 'USD',
			statusChirho: donationStatusChirho,
			messageChirho: webhookDataChirho.metadataChirho?.messageChirho || null,
			anonymousChirho: webhookDataChirho.metadataChirho?.anonymousChirho || false,
			createdAtChirho: webhookDataChirho.timestampChirho || new Date().toISOString()
		});

		// If completed, update the need's amount raised
		if (donationStatusChirho === 'completed' && needIdChirho) {
			const existingNeedsChirho = await dbChirho
				.select({
					amountRaisedChirho: needsChirho.amountRaisedChirho,
					amountNeededChirho: needsChirho.amountNeededChirho
				})
				.from(needsChirho)
				.where(eq(needsChirho.idChirho, needIdChirho))
				.limit(1);

			if (existingNeedsChirho.length > 0) {
				const needChirho = existingNeedsChirho[0];
				const newAmountRaisedChirho = (needChirho.amountRaisedChirho || 0) + webhookDataChirho.amountChirho;

				// Determine if need is now fully funded
				const isFundedChirho = newAmountRaisedChirho >= (needChirho.amountNeededChirho || 0);

				await dbChirho
					.update(needsChirho)
					.set({
						amountRaisedChirho: newAmountRaisedChirho,
						statusChirho: isFundedChirho ? 'funded' : undefined,
						updatedAtChirho: new Date().toISOString()
					})
					.where(eq(needsChirho.idChirho, needIdChirho));
			}
		}

		// Update orphanage trust score (completed donations increase trust)
		if (donationStatusChirho === 'completed' && orphanageIdChirho) {
			// Simple trust score boost: each completed donation adds a small amount
			// In production, this could be more sophisticated
			const existingOrphanagesChirho = await dbChirho
				.select({ trustScoreChirho: orphanagesChirho.trustScoreChirho })
				.from(orphanagesChirho)
				.where(eq(orphanagesChirho.idChirho, orphanageIdChirho))
				.limit(1);

			if (existingOrphanagesChirho.length > 0) {
				const currentScoreChirho = existingOrphanagesChirho[0].trustScoreChirho || 0;
				// Cap trust score at 100, add 0.1 per donation
				const newScoreChirho = Math.min(100, currentScoreChirho + 0.1);

				await dbChirho
					.update(orphanagesChirho)
					.set({
						trustScoreChirho: newScoreChirho,
						updatedAtChirho: new Date().toISOString()
					})
					.where(eq(orphanagesChirho.idChirho, orphanageIdChirho));
			}
		}

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			actionChirho: `donation_${donationStatusChirho}`,
			entityTypeChirho: 'donation',
			detailsChirho: JSON.stringify({
				externalIdChirho: webhookDataChirho.donationIdChirho,
				amountChirho: webhookDataChirho.amountChirho,
				currencyChirho: webhookDataChirho.currencyChirho,
				orphanageIdChirho,
				needIdChirho
			}),
			createdAtChirho: new Date().toISOString()
		});

		return json({
			successChirho: true,
			messageChirho: 'Donation processed',
			donationIdChirho: webhookDataChirho.donationIdChirho
		});
	} catch (errorChirho) {
		console.error('Webhook processing error:', errorChirho);
		return json({ errorChirho: 'Failed to process webhook' }, { status: 500 });
	}
};

// Health check endpoint
export const GET: RequestHandler = async () => {
	return json({
		statusChirho: 'healthy',
		serviceChirho: 'KingdomInvest.ing Webhook',
		timestampChirho: new Date().toISOString()
	});
};
