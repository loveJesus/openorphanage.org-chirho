// For God so loved the world that He gave His only begotten Son...
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, platform }) => {
	return {
		userChirho: locals.userChirho,
		turnstileSiteKeyChirho: platform?.env?.TURNSTILE_SITE_KEY_CHIRHO || ''
	};
};
