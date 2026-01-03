// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { newsletterSubscribersChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, platform }) => {
	const tokenChirho = url.searchParams.get('token');

	if (!tokenChirho) {
		return {
			validChirho: false,
			errorChirho: 'Invalid unsubscribe link'
		};
	}

	const dbChirho = getDbChirho(platform);

	// Find subscriber by unsubscribe token
	const subscriberChirho = await dbChirho
		.select()
		.from(newsletterSubscribersChirho)
		.where(eq(newsletterSubscribersChirho.unsubscribeTokenChirho, tokenChirho))
		.get();

	if (!subscriberChirho) {
		return {
			validChirho: false,
			errorChirho: 'Invalid unsubscribe link'
		};
	}

	if (subscriberChirho.statusChirho === 'unsubscribed') {
		return {
			validChirho: true,
			alreadyUnsubscribedChirho: true,
			emailChirho: subscriberChirho.emailChirho.replace(/(.{2}).*(@.*)/, '$1***$2')
		};
	}

	return {
		validChirho: true,
		tokenChirho,
		emailChirho: subscriberChirho.emailChirho.replace(/(.{2}).*(@.*)/, '$1***$2')
	};
};

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const formDataChirho = await request.formData();
		const tokenChirho = formDataChirho.get('token') as string;

		if (!tokenChirho) {
			return { successChirho: false, errorChirho: 'Invalid request' };
		}

		const dbChirho = getDbChirho(platform);

		// Find and unsubscribe
		const subscriberChirho = await dbChirho
			.select()
			.from(newsletterSubscribersChirho)
			.where(eq(newsletterSubscribersChirho.unsubscribeTokenChirho, tokenChirho))
			.get();

		if (!subscriberChirho) {
			return { successChirho: false, errorChirho: 'Invalid unsubscribe link' };
		}

		await dbChirho
			.update(newsletterSubscribersChirho)
			.set({
				statusChirho: 'unsubscribed',
				unsubscribedAtChirho: new Date().toISOString()
			})
			.where(eq(newsletterSubscribersChirho.idChirho, subscriberChirho.idChirho));

		return { successChirho: true };
	}
};
