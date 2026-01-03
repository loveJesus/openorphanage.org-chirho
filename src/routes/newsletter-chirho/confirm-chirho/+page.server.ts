// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { newsletterSubscribersChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { sendEmailChirho, createNewsletterWelcomeEmailChirho } from '$lib/server/email_chirho';

export const load: PageServerLoad = async ({ url, platform }) => {
	const tokenChirho = url.searchParams.get('token');

	if (!tokenChirho) {
		return {
			successChirho: false,
			errorChirho: 'Invalid confirmation link'
		};
	}

	const dbChirho = getDbChirho(platform);

	// Find subscriber by token
	const subscriberChirho = await dbChirho
		.select()
		.from(newsletterSubscribersChirho)
		.where(eq(newsletterSubscribersChirho.confirmTokenChirho, tokenChirho))
		.get();

	if (!subscriberChirho) {
		return {
			successChirho: false,
			errorChirho: 'Invalid or expired confirmation link'
		};
	}

	// Check if already confirmed
	if (subscriberChirho.statusChirho === 'confirmed') {
		return {
			successChirho: true,
			alreadyConfirmedChirho: true,
			messageChirho: 'Your subscription is already confirmed!'
		};
	}

	// Check if token expired
	if (subscriberChirho.confirmTokenExpiresChirho) {
		const expiresChirho = new Date(subscriberChirho.confirmTokenExpiresChirho);
		if (expiresChirho < new Date()) {
			return {
				successChirho: false,
				errorChirho: 'Confirmation link has expired. Please subscribe again.'
			};
		}
	}

	// Confirm subscription
	await dbChirho
		.update(newsletterSubscribersChirho)
		.set({
			statusChirho: 'confirmed',
			confirmedAtChirho: new Date().toISOString(),
			confirmTokenChirho: null,
			confirmTokenExpiresChirho: null
		})
		.where(eq(newsletterSubscribersChirho.idChirho, subscriberChirho.idChirho));

	// Send welcome email
	const siteUrlChirho = platform?.env?.SITE_URL_CHIRHO || 'https://openorphanage.org';
	const unsubscribeUrlChirho = `${siteUrlChirho}/newsletter-chirho/unsubscribe-chirho?token=${subscriberChirho.unsubscribeTokenChirho}`;

	const smtpKeyChirho = platform?.env?.SMTP_API_KEY_CHIRHO;
	if (smtpKeyChirho) {
		const emailContentChirho = createNewsletterWelcomeEmailChirho(
			unsubscribeUrlChirho,
			subscriberChirho.nameChirho || undefined
		);
		await sendEmailChirho(smtpKeyChirho, {
			toChirho: subscriberChirho.emailChirho,
			...emailContentChirho
		});
	}

	return {
		successChirho: true,
		messageChirho: 'Your subscription has been confirmed! Welcome aboard.'
	};
};
