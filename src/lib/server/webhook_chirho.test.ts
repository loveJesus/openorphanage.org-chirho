// For God so loved the world that He gave His only begotten Son...
import { describe, it, expect } from 'vitest';

// =============================================================================
// WEBHOOK SIGNATURE VERIFICATION TESTS
// =============================================================================

/**
 * Generate HMAC-SHA256 signature for testing
 */
async function generateSignatureChirho(payloadChirho: string, secretChirho: string): Promise<string> {
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

	return 'sha256=' + Array.from(new Uint8Array(signatureBufferChirho))
		.map((bChirho) => bChirho.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Verify webhook signature (matches production logic)
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

		const sigChirho = signatureChirho.replace('sha256=', '');
		return sigChirho === expectedSignatureChirho;
	} catch {
		return false;
	}
}

describe('Webhook Signature Verification', () => {
	const testSecretChirho = 'test-webhook-secret-12345';

	it('verifies valid signature', async () => {
		const payloadChirho = JSON.stringify({
			eventChirho: 'donation.completed',
			donationIdChirho: 'don_12345',
			amountChirho: 100
		});

		const signatureChirho = await generateSignatureChirho(payloadChirho, testSecretChirho);
		const isValidChirho = await verifyWebhookSignatureChirho(payloadChirho, signatureChirho, testSecretChirho);

		expect(isValidChirho).toBe(true);
	});

	it('rejects invalid signature', async () => {
		const payloadChirho = JSON.stringify({ eventChirho: 'donation.completed' });
		const fakeSignatureChirho = 'sha256=invalidinvalidinvalidinvalid';

		const isValidChirho = await verifyWebhookSignatureChirho(payloadChirho, fakeSignatureChirho, testSecretChirho);

		expect(isValidChirho).toBe(false);
	});

	it('rejects null signature', async () => {
		const payloadChirho = JSON.stringify({ eventChirho: 'donation.completed' });

		const isValidChirho = await verifyWebhookSignatureChirho(payloadChirho, null, testSecretChirho);

		expect(isValidChirho).toBe(false);
	});

	it('rejects empty secret', async () => {
		const payloadChirho = JSON.stringify({ eventChirho: 'donation.completed' });
		const signatureChirho = 'sha256=some-signature';

		const isValidChirho = await verifyWebhookSignatureChirho(payloadChirho, signatureChirho, '');

		expect(isValidChirho).toBe(false);
	});

	it('rejects tampered payload', async () => {
		const originalPayloadChirho = JSON.stringify({ eventChirho: 'donation.completed', amountChirho: 100 });
		const signatureChirho = await generateSignatureChirho(originalPayloadChirho, testSecretChirho);

		// Tamper with the payload
		const tamperedPayloadChirho = JSON.stringify({ eventChirho: 'donation.completed', amountChirho: 1000000 });

		const isValidChirho = await verifyWebhookSignatureChirho(tamperedPayloadChirho, signatureChirho, testSecretChirho);

		expect(isValidChirho).toBe(false);
	});

	it('handles signature without sha256= prefix', async () => {
		const payloadChirho = JSON.stringify({ eventChirho: 'donation.completed' });
		const fullSignatureChirho = await generateSignatureChirho(payloadChirho, testSecretChirho);
		const signatureWithoutPrefixChirho = fullSignatureChirho.replace('sha256=', '');

		// Our verification handles both formats
		const isValidChirho = await verifyWebhookSignatureChirho(
			payloadChirho,
			signatureWithoutPrefixChirho,
			testSecretChirho
		);

		expect(isValidChirho).toBe(true);
	});
});

// =============================================================================
// WEBHOOK PAYLOAD VALIDATION TESTS
// =============================================================================

interface KingdomInvestWebhookChirho {
	eventChirho: string;
	donationIdChirho: string;
	amountChirho: number;
	currencyChirho: string;
	statusChirho: 'pending' | 'completed' | 'refunded' | 'failed';
	timestampChirho: string;
}

function isValidWebhookPayloadChirho(payloadChirho: unknown): payloadChirho is KingdomInvestWebhookChirho {
	if (!payloadChirho || typeof payloadChirho !== 'object') return false;

	const pChirho = payloadChirho as Record<string, unknown>;

	return (
		typeof pChirho.eventChirho === 'string' &&
		typeof pChirho.donationIdChirho === 'string' &&
		typeof pChirho.amountChirho === 'number' &&
		typeof pChirho.currencyChirho === 'string' &&
		['pending', 'completed', 'refunded', 'failed'].includes(pChirho.statusChirho as string)
	);
}

describe('Webhook Payload Validation', () => {
	it('accepts valid payload', () => {
		const payloadChirho = {
			eventChirho: 'donation.completed',
			donationIdChirho: 'don_12345',
			amountChirho: 100,
			currencyChirho: 'USD',
			statusChirho: 'completed',
			timestampChirho: new Date().toISOString()
		};

		expect(isValidWebhookPayloadChirho(payloadChirho)).toBe(true);
	});

	it('rejects payload missing required fields', () => {
		expect(isValidWebhookPayloadChirho({})).toBe(false);
		expect(isValidWebhookPayloadChirho({ eventChirho: 'test' })).toBe(false);
		expect(isValidWebhookPayloadChirho(null)).toBe(false);
		expect(isValidWebhookPayloadChirho(undefined)).toBe(false);
	});

	it('rejects payload with invalid status', () => {
		const payloadChirho = {
			eventChirho: 'donation.completed',
			donationIdChirho: 'don_12345',
			amountChirho: 100,
			currencyChirho: 'USD',
			statusChirho: 'invalid_status'
		};

		expect(isValidWebhookPayloadChirho(payloadChirho)).toBe(false);
	});

	it('rejects payload with wrong amount type', () => {
		const payloadChirho = {
			eventChirho: 'donation.completed',
			donationIdChirho: 'don_12345',
			amountChirho: '100', // String instead of number
			currencyChirho: 'USD',
			statusChirho: 'completed'
		};

		expect(isValidWebhookPayloadChirho(payloadChirho)).toBe(false);
	});
});

// =============================================================================
// DONATION EVENT MAPPING TESTS
// =============================================================================

function mapEventToStatusChirho(eventChirho: string): 'pending' | 'completed' | 'refunded' | 'failed' {
	switch (eventChirho) {
		case 'donation.completed':
			return 'completed';
		case 'donation.refunded':
			return 'refunded';
		case 'donation.failed':
			return 'failed';
		default:
			return 'pending';
	}
}

describe('Donation Event Mapping', () => {
	it('maps donation.completed to completed status', () => {
		expect(mapEventToStatusChirho('donation.completed')).toBe('completed');
	});

	it('maps donation.refunded to refunded status', () => {
		expect(mapEventToStatusChirho('donation.refunded')).toBe('refunded');
	});

	it('maps donation.failed to failed status', () => {
		expect(mapEventToStatusChirho('donation.failed')).toBe('failed');
	});

	it('maps donation.pending to pending status', () => {
		expect(mapEventToStatusChirho('donation.pending')).toBe('pending');
	});

	it('defaults unknown events to pending', () => {
		expect(mapEventToStatusChirho('unknown.event')).toBe('pending');
	});
});
