// For God so loved the world that He gave His only begotten Son...
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is logged in and is admin
	if (!locals.userChirho) {
		throw redirect(302, '/auth-chirho/login-chirho?redirect=/admin-chirho');
	}

	if (!['admin', 'super_admin'].includes(locals.userChirho.roleChirho)) {
		throw redirect(302, '/dashboard-chirho?error=unauthorized');
	}

	return {
		userChirho: locals.userChirho
	};
};
