// For God so loved the world that He gave His only begotten Son...
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { getKvChirho } from '$lib/server/kv_chirho';
import { newsletterSubscribersChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { sendEmailChirho, createNewsletterConfirmEmailChirho } from '$lib/server/email_chirho';
import { checkRateLimitChirho, createRateLimitHeadersChirho, getClientIpChirho } from '$lib/server/security_chirho';
import { verifyTurnstileChirho, getTurnstileSecretChirho } from '$lib/server/turnstile_chirho';

// Generate secure random token
function generateTokenChirho(): string {
	const arrayChirho = new Uint8Array(32);
	crypto.getRandomValues(arrayChirho);
	return Array.from(arrayChirho, (bChirho) => bChirho.toString(16).padStart(2, '0')).join('');
}

export const POST: RequestHandler = async ({ request, platform }) => {
	try {
		if (!platform?.env) {
			return json({ successChirho: false, errorChirho: 'Platform not available' }, { status: 500 });
		}

		const kvChirho = getKvChirho(platform);

		// Rate limiting
		const ipChirho = getClientIpChirho(request);
		const rateLimitChirho = await checkRateLimitChirho(kvChirho, ipChirho, 'newsletter/subscribe');

		if (!rateLimitChirho.allowedChirho) {
			return json(
				{ successChirho: false, errorChirho: 'Too many requests. Please try again later.' },
				{ status: 429, headers: createRateLimitHeadersChirho(rateLimitChirho) }
			);
		}

		const bodyChirho = await request.json();
		const { emailChirho, nameChirho, sourceChirho, turnstileTokenChirho } = bodyChirho;

		// Verify Turnstile
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

		// Validate email
		if (!emailChirho || typeof emailChirho !== 'string') {
			return json({ successChirho: false, errorChirho: 'Email is required' }, { status: 400 });
		}

		const emailLowerChirho = emailChirho.toLowerCase().trim();
		const emailRegexChirho = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegexChirho.test(emailLowerChirho)) {
			return json({ successChirho: false, errorChirho: 'Invalid email format' }, { status: 400 });
		}

		const dbChirho = getDbChirho(platform);

		// Check if already subscribed
		const existingChirho = await dbChirho
			.select()
			.from(newsletterSubscribersChirho)
			.where(eq(newsletterSubscribersChirho.emailChirho, emailLowerChirho))
			.get();

		if (existingChirho) {
			if (existingChirho.statusChirho === 'confirmed') {
				return json({
					successChirho: true,
					messageChirho: 'You are already subscribed to our newsletter!'
				});
			} else if (existingChirho.statusChirho === 'pending') {
				// Resend confirmation email
				const confirmTokenChirho = generateTokenChirho();
				const expiresChirho = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

				await dbChirho
					.update(newsletterSubscribersChirho)
					.set({
						confirmTokenChirho,
						confirmTokenExpiresChirho: expiresChirho,
						nameChirho: nameChirho || existingChirho.nameChirho
					})
					.where(eq(newsletterSubscribersChirho.idChirho, existingChirho.idChirho));

				// Send confirmation email
				const siteUrlChirho = platform?.env?.SITE_URL_CHIRHO || 'https://openorphanage.org';
				const confirmUrlChirho = `${siteUrlChirho}/newsletter-chirho/confirm-chirho?token=${confirmTokenChirho}`;

				const smtpKeyChirho = platform?.env?.SMTP_API_KEY_CHIRHO;
				if (smtpKeyChirho) {
					const emailContentChirho = createNewsletterConfirmEmailChirho(confirmUrlChirho, nameChirho);
					await sendEmailChirho(smtpKeyChirho, {
						toChirho: emailLowerChirho,
						...emailContentChirho
					});
				}

				return json({
					successChirho: true,
					messageChirho: 'Please check your email to confirm your subscription.'
				});
			} else if (existingChirho.statusChirho === 'unsubscribed') {
				// Re-subscribe
				const confirmTokenChirho = generateTokenChirho();
				const unsubscribeTokenChirho = generateTokenChirho();
				const expiresChirho = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

				await dbChirho
					.update(newsletterSubscribersChirho)
					.set({
						statusChirho: 'pending',
						confirmTokenChirho,
						confirmTokenExpiresChirho: expiresChirho,
						unsubscribeTokenChirho,
						nameChirho: nameChirho || existingChirho.nameChirho,
						unsubscribedAtChirho: null
					})
					.where(eq(newsletterSubscribersChirho.idChirho, existingChirho.idChirho));

				// Send confirmation email
				const siteUrlChirho = platform?.env?.SITE_URL_CHIRHO || 'https://openorphanage.org';
				const confirmUrlChirho = `${siteUrlChirho}/newsletter-chirho/confirm-chirho?token=${confirmTokenChirho}`;

				const smtpKeyChirho = platform?.env?.SMTP_API_KEY_CHIRHO;
				if (smtpKeyChirho) {
					const emailContentChirho = createNewsletterConfirmEmailChirho(confirmUrlChirho, nameChirho);
					await sendEmailChirho(smtpKeyChirho, {
						toChirho: emailLowerChirho,
						...emailContentChirho
					});
				}

				return json({
					successChirho: true,
					messageChirho: 'Please check your email to confirm your subscription.'
				});
			}
		}

		// Create new subscriber
		const confirmTokenChirho = generateTokenChirho();
		const unsubscribeTokenChirho = generateTokenChirho();
		const expiresChirho = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

		await dbChirho.insert(newsletterSubscribersChirho).values({
			emailChirho: emailLowerChirho,
			nameChirho: nameChirho || null,
			statusChirho: 'pending',
			confirmTokenChirho,
			confirmTokenExpiresChirho: expiresChirho,
			unsubscribeTokenChirho,
			subscribedFromChirho: sourceChirho || 'unknown',
			createdAtChirho: new Date().toISOString()
		});

		// Send confirmation email
		const siteUrlChirho = platform?.env?.SITE_URL_CHIRHO || 'https://openorphanage.org';
		const confirmUrlChirho = `${siteUrlChirho}/newsletter-chirho/confirm-chirho?token=${confirmTokenChirho}`;

		const smtpKeyChirho = platform?.env?.SMTP_API_KEY_CHIRHO;
		if (smtpKeyChirho) {
			const emailContentChirho = createNewsletterConfirmEmailChirho(confirmUrlChirho, nameChirho);
			await sendEmailChirho(smtpKeyChirho, {
				toChirho: emailLowerChirho,
				...emailContentChirho
			});
		}

		return json({
			successChirho: true,
			messageChirho: 'Please check your email to confirm your subscription.'
		});

	} catch (errorChirho) {
		console.error('Newsletter subscribe error:', errorChirho);
		return json({
			successChirho: false,
			errorChirho: 'An error occurred. Please try again.'
		}, { status: 500 });
	}
};
