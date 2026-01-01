// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		userChirho: locals.userChirho
	};
};
