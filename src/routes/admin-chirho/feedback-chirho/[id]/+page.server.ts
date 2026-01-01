// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { feedbackChirho, usersChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { KvHelperChirho } from '$lib/server/kv_chirho';

export const load: PageServerLoad = async ({ platform, params, locals }) => {
	const dbChirho = getDbChirho(platform);
	const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);
	const feedbackIdChirho = parseInt(params.id);

	if (isNaN(feedbackIdChirho)) {
		throw error(400, 'Invalid feedback ID');
	}

	const feedbackResultChirho = await dbChirho
		.select({
			idChirho: feedbackChirho.idChirho,
			userIdChirho: feedbackChirho.userIdChirho,
			typeChirho: feedbackChirho.typeChirho,
			statusChirho: feedbackChirho.statusChirho,
			ratingChirho: feedbackChirho.ratingChirho,
			contentPreviewChirho: feedbackChirho.contentPreviewChirho,
			contentKvKeyChirho: feedbackChirho.contentKvKeyChirho,
			emailChirho: feedbackChirho.emailChirho,
			isAnonymousChirho: feedbackChirho.isAnonymousChirho,
			publicVisibleChirho: feedbackChirho.publicVisibleChirho,
			adminNotesChirho: feedbackChirho.adminNotesChirho,
			adminResponseChirho: feedbackChirho.adminResponseChirho,
			respondedAtChirho: feedbackChirho.respondedAtChirho,
			createdAtChirho: feedbackChirho.createdAtChirho,
			userEmailChirho: usersChirho.emailChirho,
			userRoleChirho: usersChirho.roleChirho
		})
		.from(feedbackChirho)
		.leftJoin(usersChirho, eq(feedbackChirho.userIdChirho, usersChirho.idChirho))
		.where(eq(feedbackChirho.idChirho, feedbackIdChirho))
		.limit(1);

	if (feedbackResultChirho.length === 0) {
		throw error(404, 'Feedback not found');
	}

	const feedbackItemChirho = feedbackResultChirho[0];

	// Get full content from KV if available
	let fullContentChirho = feedbackItemChirho.contentPreviewChirho || '';
	if (feedbackItemChirho.contentKvKeyChirho) {
		const kvContentChirho = await kvChirho.getChirho(feedbackItemChirho.contentKvKeyChirho);
		if (kvContentChirho) {
			fullContentChirho = kvContentChirho;
		}
	}

	// Get metadata from KV (from admin notes)
	let metadataChirho = null;
	if (feedbackItemChirho.adminNotesChirho) {
		try {
			const notesChirho = JSON.parse(feedbackItemChirho.adminNotesChirho);
			if (notesChirho.metadataKeyChirho) {
				const metadataStrChirho = await kvChirho.getChirho(notesChirho.metadataKeyChirho);
				if (metadataStrChirho) {
					metadataChirho = JSON.parse(metadataStrChirho);
				}
			}
			// Include parsed notes
			feedbackItemChirho.parsedNotesChirho = notesChirho;
		} catch {
			// Ignore parse errors
		}
	}

	return {
		feedbackChirho: {
			...feedbackItemChirho,
			fullContentChirho
		},
		metadataChirho
	};
};

export const actions: Actions = {
	updateStatus: async ({ request, params, platform, locals }) => {
		const dbChirho = getDbChirho(platform);
		const feedbackIdChirho = parseInt(params.id);

		if (isNaN(feedbackIdChirho)) {
			return fail(400, { errorChirho: 'Invalid feedback ID' });
		}

		const formDataChirho = await request.formData();
		const newStatusChirho = formDataChirho.get('status')?.toString();

		const validStatusesChirho = ['pending', 'reviewed', 'resolved', 'dismissed'];
		if (!newStatusChirho || !validStatusesChirho.includes(newStatusChirho)) {
			return fail(400, { errorChirho: 'Invalid status' });
		}

		await dbChirho
			.update(feedbackChirho)
			.set({ statusChirho: newStatusChirho })
			.where(eq(feedbackChirho.idChirho, feedbackIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: locals.userChirho ? parseInt(locals.userChirho.userIdChirho) : null,
			actionChirho: 'feedback_status_update',
			entityTypeChirho: 'feedback',
			entityIdChirho: feedbackIdChirho,
			detailsChirho: JSON.stringify({ newStatusChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Status updated' };
	},

	addResponse: async ({ request, params, platform, locals }) => {
		const dbChirho = getDbChirho(platform);
		const feedbackIdChirho = parseInt(params.id);

		if (isNaN(feedbackIdChirho)) {
			return fail(400, { errorChirho: 'Invalid feedback ID' });
		}

		const formDataChirho = await request.formData();
		const responseChirho = formDataChirho.get('response')?.toString()?.trim();

		if (!responseChirho || responseChirho.length < 5) {
			return fail(400, { errorChirho: 'Response must be at least 5 characters' });
		}

		if (responseChirho.length > 2000) {
			return fail(400, { errorChirho: 'Response must be less than 2000 characters' });
		}

		await dbChirho
			.update(feedbackChirho)
			.set({
				adminResponseChirho: responseChirho,
				respondedAtChirho: new Date().toISOString(),
				statusChirho: 'reviewed'
			})
			.where(eq(feedbackChirho.idChirho, feedbackIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: locals.userChirho ? parseInt(locals.userChirho.userIdChirho) : null,
			actionChirho: 'feedback_response_add',
			entityTypeChirho: 'feedback',
			entityIdChirho: feedbackIdChirho,
			detailsChirho: JSON.stringify({ responsePreviewChirho: responseChirho.substring(0, 100) }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Response added' };
	},

	togglePublic: async ({ params, platform, locals }) => {
		const dbChirho = getDbChirho(platform);
		const feedbackIdChirho = parseInt(params.id);

		if (isNaN(feedbackIdChirho)) {
			return fail(400, { errorChirho: 'Invalid feedback ID' });
		}

		// Get current visibility
		const currentChirho = await dbChirho
			.select({ publicVisibleChirho: feedbackChirho.publicVisibleChirho })
			.from(feedbackChirho)
			.where(eq(feedbackChirho.idChirho, feedbackIdChirho))
			.limit(1);

		if (currentChirho.length === 0) {
			return fail(404, { errorChirho: 'Feedback not found' });
		}

		const newVisibilityChirho = !currentChirho[0].publicVisibleChirho;

		await dbChirho
			.update(feedbackChirho)
			.set({ publicVisibleChirho: newVisibilityChirho })
			.where(eq(feedbackChirho.idChirho, feedbackIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: locals.userChirho ? parseInt(locals.userChirho.userIdChirho) : null,
			actionChirho: 'feedback_visibility_toggle',
			entityTypeChirho: 'feedback',
			entityIdChirho: feedbackIdChirho,
			detailsChirho: JSON.stringify({ publicVisibleChirho: newVisibilityChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: newVisibilityChirho ? 'Made public' : 'Made private' };
	},

	delete: async ({ params, platform, locals }) => {
		const dbChirho = getDbChirho(platform);
		const kvChirho = new KvHelperChirho(platform?.env?.KV_CHIRHO);
		const feedbackIdChirho = parseInt(params.id);

		if (isNaN(feedbackIdChirho)) {
			return fail(400, { errorChirho: 'Invalid feedback ID' });
		}

		// Get feedback to clean up KV
		const feedbackResultChirho = await dbChirho
			.select({
				contentKvKeyChirho: feedbackChirho.contentKvKeyChirho,
				adminNotesChirho: feedbackChirho.adminNotesChirho
			})
			.from(feedbackChirho)
			.where(eq(feedbackChirho.idChirho, feedbackIdChirho))
			.limit(1);

		if (feedbackResultChirho.length > 0) {
			const itemChirho = feedbackResultChirho[0];

			// Delete KV content
			if (itemChirho.contentKvKeyChirho) {
				await kvChirho.deleteChirho(itemChirho.contentKvKeyChirho);
			}

			// Delete KV metadata
			if (itemChirho.adminNotesChirho) {
				try {
					const notesChirho = JSON.parse(itemChirho.adminNotesChirho);
					if (notesChirho.metadataKeyChirho) {
						await kvChirho.deleteChirho(notesChirho.metadataKeyChirho);
					}
				} catch {
					// Ignore parse errors
				}
			}
		}

		// Delete from database
		await dbChirho.delete(feedbackChirho).where(eq(feedbackChirho.idChirho, feedbackIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: locals.userChirho ? parseInt(locals.userChirho.userIdChirho) : null,
			actionChirho: 'feedback_delete',
			entityTypeChirho: 'feedback',
			entityIdChirho: feedbackIdChirho,
			createdAtChirho: new Date().toISOString()
		});

		throw redirect(303, '/admin-chirho/feedback-chirho');
	}
};
