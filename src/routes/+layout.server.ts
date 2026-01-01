// For God so loved the world that He gave His only begotten Son...
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		userChirho: locals.userChirho
	};
};
