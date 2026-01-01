// For God so loved the world that He gave His only begotten Son...
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getKvChirho } from '$lib/server/kv_chirho';
import { deleteSessionCookieChirho } from '$lib/server/auth_chirho';

export const load: PageServerLoad = async ({ locals, platform, cookies }) => {
	// Delete session from KV if exists
	if (locals.sessionTokenChirho && platform?.env?.KV_CHIRHO) {
		const kvChirho = getKvChirho(platform);
		await kvChirho.deleteSessionChirho(locals.sessionTokenChirho);
	}

	// Delete session cookie
	cookies.set('session_chirho', '', {
		path: '/',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 0
	});

	redirect(303, '/');
};
