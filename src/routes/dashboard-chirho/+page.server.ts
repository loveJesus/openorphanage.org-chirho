// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho, orphanagesChirho, feedbackChirho, donationsChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc, count, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const load: PageServerLoad = async ({ locals }) => {
	const userChirho = locals.userChirho;

	if (!userChirho) {
		throw redirect(302, '/auth-chirho/login-chirho');
	}

	const dbChirho = getDbChirho(locals.platformChirho);

	// Get full user data
	const userDataChirho = await dbChirho
		.select({
			idChirho: usersChirho.idChirho,
			emailChirho: usersChirho.emailChirho,
			nameChirho: usersChirho.nameChirho,
			roleChirho: usersChirho.roleChirho,
			orphanageIdChirho: usersChirho.orphanageIdChirho,
			emailVerifiedChirho: usersChirho.emailVerifiedChirho,
			createdAtChirho: usersChirho.createdAtChirho
		})
		.from(usersChirho)
		.where(eq(usersChirho.idChirho, parseInt(userChirho.userIdChirho)))
		.limit(1);

	// Get user's orphanage if assigned
	let orphanageChirho = null;
	if (userDataChirho[0]?.orphanageIdChirho) {
		const orphResultChirho = await dbChirho
			.select()
			.from(orphanagesChirho)
			.where(eq(orphanagesChirho.idChirho, userDataChirho[0].orphanageIdChirho))
			.limit(1);
		orphanageChirho = orphResultChirho[0] || null;
	}

	// Get user's feedback submissions
	const userFeedbackChirho = await dbChirho
		.select()
		.from(feedbackChirho)
		.where(eq(feedbackChirho.userIdChirho, parseInt(userChirho.userIdChirho)))
		.orderBy(desc(feedbackChirho.createdAtChirho))
		.limit(5);

	// Get donation stats if user is a donor
	const donationStatsChirho = await dbChirho
		.select({
			totalDonationsChirho: count(),
			totalAmountChirho: sql<number>`COALESCE(SUM(${donationsChirho.amountChirho}), 0)`
		})
		.from(donationsChirho)
		.where(eq(donationsChirho.donorIdChirho, parseInt(userChirho.userIdChirho)));

	// Get recent activity
	const recentActivityChirho = await dbChirho
		.select()
		.from(auditLogChirho)
		.where(eq(auditLogChirho.userIdChirho, parseInt(userChirho.userIdChirho)))
		.orderBy(desc(auditLogChirho.createdAtChirho))
		.limit(10);

	return {
		userChirho: userDataChirho[0],
		orphanageChirho,
		feedbackChirho: userFeedbackChirho,
		donationStatsChirho: donationStatsChirho[0] || { totalDonationsChirho: 0, totalAmountChirho: 0 },
		recentActivityChirho
	};
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho) {
			return fail(401, { errorChirho: 'Not authenticated' });
		}

		const formDataChirho = await request.formData();
		const nameChirho = formDataChirho.get('name') as string;

		if (!nameChirho || nameChirho.trim().length < 2) {
			return fail(400, { errorChirho: 'Name must be at least 2 characters' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(usersChirho)
			.set({
				nameChirho: nameChirho.trim(),
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, parseInt(userChirho.userIdChirho)));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'update_profile',
			entityTypeChirho: 'user',
			entityIdChirho: parseInt(userChirho.userIdChirho),
			detailsChirho: JSON.stringify({ fieldChirho: 'name' }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Profile updated successfully' };
	},

	changePassword: async ({ request, locals }) => {
		const userChirho = locals.userChirho;
		if (!userChirho) {
			return fail(401, { errorChirho: 'Not authenticated' });
		}

		const formDataChirho = await request.formData();
		const currentPasswordChirho = formDataChirho.get('currentPassword') as string;
		const newPasswordChirho = formDataChirho.get('newPassword') as string;
		const confirmPasswordChirho = formDataChirho.get('confirmPassword') as string;

		if (!currentPasswordChirho || !newPasswordChirho || !confirmPasswordChirho) {
			return fail(400, { errorChirho: 'All password fields are required' });
		}

		if (newPasswordChirho !== confirmPasswordChirho) {
			return fail(400, { errorChirho: 'New passwords do not match' });
		}

		// Password complexity
		if (newPasswordChirho.length < 8) {
			return fail(400, { errorChirho: 'Password must be at least 8 characters' });
		}

		if (!/[A-Z]/.test(newPasswordChirho) || !/[a-z]/.test(newPasswordChirho) || !/[0-9]/.test(newPasswordChirho)) {
			return fail(400, { errorChirho: 'Password must contain uppercase, lowercase, and a number' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		// Get current password hash
		const currentUserChirho = await dbChirho
			.select({ passwordHashChirho: usersChirho.passwordHashChirho })
			.from(usersChirho)
			.where(eq(usersChirho.idChirho, parseInt(userChirho.userIdChirho)))
			.limit(1);

		if (!currentUserChirho[0]) {
			return fail(404, { errorChirho: 'User not found' });
		}

		// Verify current password
		const isValidChirho = await bcrypt.compare(currentPasswordChirho, currentUserChirho[0].passwordHashChirho);
		if (!isValidChirho) {
			return fail(400, { errorChirho: 'Current password is incorrect' });
		}

		// Hash new password
		const newHashChirho = await bcrypt.hash(newPasswordChirho, 12);

		await dbChirho
			.update(usersChirho)
			.set({
				passwordHashChirho: newHashChirho,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, parseInt(userChirho.userIdChirho)));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(userChirho.userIdChirho),
			actionChirho: 'change_password',
			entityTypeChirho: 'user',
			entityIdChirho: parseInt(userChirho.userIdChirho),
			detailsChirho: JSON.stringify({ successChirho: true }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Password changed successfully' };
	}
};
