// For God so loved the world that He gave His only begotten Son...
import type { PageServerLoad, Actions } from './$types';
import { getDbChirho } from '$lib/server/db_chirho';
import { usersChirho, orphanagesChirho, auditLogChirho } from '$lib/server/schema_chirho';
import { eq, desc, like, or, and, count } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
	const userChirho = locals.userChirho;

	// Only super_admin can manage users
	if (userChirho?.roleChirho !== 'super_admin' && userChirho?.roleChirho !== 'admin') {
		return { usersChirho: [], errorChirho: 'Unauthorized' };
	}

	const dbChirho = getDbChirho(locals.platformChirho);

	// Get query parameters
	const pageChirho = parseInt(url.searchParams.get('page') || '1');
	const limitChirho = 20;
	const offsetChirho = (pageChirho - 1) * limitChirho;
	const searchChirho = url.searchParams.get('search') || '';
	const roleChirho = url.searchParams.get('role') || 'all';

	// Build conditions
	const conditionsChirho = [];

	if (searchChirho) {
		conditionsChirho.push(
			or(
				like(usersChirho.emailChirho, `%${searchChirho}%`),
				like(usersChirho.nameChirho, `%${searchChirho}%`)
			)
		);
	}

	if (roleChirho !== 'all') {
		conditionsChirho.push(eq(usersChirho.roleChirho, roleChirho as 'public' | 'donor' | 'staff' | 'admin' | 'super_admin'));
	}

	// Get users with count
	const [usersListChirho, totalCountChirho] = await Promise.all([
		dbChirho
			.select({
				idChirho: usersChirho.idChirho,
				emailChirho: usersChirho.emailChirho,
				nameChirho: usersChirho.nameChirho,
				roleChirho: usersChirho.roleChirho,
				orphanageIdChirho: usersChirho.orphanageIdChirho,
				emailVerifiedChirho: usersChirho.emailVerifiedChirho,
				isActiveChirho: usersChirho.isActiveChirho,
				createdAtChirho: usersChirho.createdAtChirho
			})
			.from(usersChirho)
			.where(conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined)
			.orderBy(desc(usersChirho.createdAtChirho))
			.limit(limitChirho)
			.offset(offsetChirho),
		dbChirho
			.select({ countChirho: count() })
			.from(usersChirho)
			.where(conditionsChirho.length > 0 ? and(...conditionsChirho) : undefined)
	]);

	// Get role counts
	const roleCountsChirho = await dbChirho
		.select({
			roleChirho: usersChirho.roleChirho,
			countChirho: count()
		})
		.from(usersChirho)
		.groupBy(usersChirho.roleChirho);

	const countsByRoleChirho: Record<string, number> = {
		public: 0,
		donor: 0,
		staff: 0,
		admin: 0,
		super_admin: 0,
		total: 0
	};

	for (const rowChirho of roleCountsChirho) {
		if (rowChirho.roleChirho) {
			countsByRoleChirho[rowChirho.roleChirho] = rowChirho.countChirho;
		}
		countsByRoleChirho.total += rowChirho.countChirho;
	}

	// Get orphanages for assignment dropdown
	const orphanagesListChirho = await dbChirho
		.select({
			idChirho: orphanagesChirho.idChirho,
			nameChirho: orphanagesChirho.nameChirho
		})
		.from(orphanagesChirho)
		.where(eq(orphanagesChirho.isActiveChirho, true))
		.orderBy(orphanagesChirho.nameChirho);

	return {
		usersChirho: usersListChirho,
		paginationChirho: {
			pageChirho,
			limitChirho,
			totalChirho: totalCountChirho[0]?.countChirho || 0,
			totalPagesChirho: Math.ceil((totalCountChirho[0]?.countChirho || 0) / limitChirho)
		},
		filtersChirho: {
			searchChirho,
			roleChirho
		},
		roleCountsChirho: countsByRoleChirho,
		orphanagesChirho: orphanagesListChirho
	};
};

export const actions: Actions = {
	updateRole: async ({ request, locals }) => {
		const currentUserChirho = locals.userChirho;
		if (!currentUserChirho || currentUserChirho.roleChirho !== 'super_admin') {
			return fail(403, { errorChirho: 'Only super admins can change roles' });
		}

		const formDataChirho = await request.formData();
		const userIdChirho = parseInt(formDataChirho.get('userId') as string);
		const newRoleChirho = formDataChirho.get('role') as string;

		const validRolesChirho = ['public', 'donor', 'staff', 'admin', 'super_admin'];
		if (!validRolesChirho.includes(newRoleChirho)) {
			return fail(400, { errorChirho: 'Invalid role' });
		}

		// Prevent self-demotion for safety
		if (userIdChirho === parseInt(currentUserChirho.userIdChirho)) {
			return fail(400, { errorChirho: 'Cannot change your own role' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(usersChirho)
			.set({
				roleChirho: newRoleChirho as 'public' | 'donor' | 'staff' | 'admin' | 'super_admin',
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, userIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(currentUserChirho.userIdChirho),
			actionChirho: 'update_user_role',
			entityTypeChirho: 'user',
			entityIdChirho: userIdChirho,
			detailsChirho: JSON.stringify({ newRoleChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'User role updated successfully' };
	},

	assignOrphanage: async ({ request, locals }) => {
		const currentUserChirho = locals.userChirho;
		if (!currentUserChirho || (currentUserChirho.roleChirho !== 'super_admin' && currentUserChirho.roleChirho !== 'admin')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const userIdChirho = parseInt(formDataChirho.get('userId') as string);
		const orphanageIdChirho = formDataChirho.get('orphanageId') as string;

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(usersChirho)
			.set({
				orphanageIdChirho: orphanageIdChirho ? parseInt(orphanageIdChirho) : null,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, userIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(currentUserChirho.userIdChirho),
			actionChirho: 'assign_user_orphanage',
			entityTypeChirho: 'user',
			entityIdChirho: userIdChirho,
			detailsChirho: JSON.stringify({ orphanageIdChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: 'Orphanage assignment updated' };
	},

	toggleActive: async ({ request, locals }) => {
		const currentUserChirho = locals.userChirho;
		if (!currentUserChirho || (currentUserChirho.roleChirho !== 'super_admin' && currentUserChirho.roleChirho !== 'admin')) {
			return fail(403, { errorChirho: 'Unauthorized' });
		}

		const formDataChirho = await request.formData();
		const userIdChirho = parseInt(formDataChirho.get('userId') as string);
		const isActiveChirho = formDataChirho.get('isActive') === 'true';

		// Prevent self-deactivation
		if (userIdChirho === parseInt(currentUserChirho.userIdChirho)) {
			return fail(400, { errorChirho: 'Cannot deactivate yourself' });
		}

		const dbChirho = getDbChirho(locals.platformChirho);

		await dbChirho
			.update(usersChirho)
			.set({
				isActiveChirho: !isActiveChirho,
				updatedAtChirho: new Date().toISOString()
			})
			.where(eq(usersChirho.idChirho, userIdChirho));

		// Audit log
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: parseInt(currentUserChirho.userIdChirho),
			actionChirho: isActiveChirho ? 'deactivate_user' : 'activate_user',
			entityTypeChirho: 'user',
			entityIdChirho: userIdChirho,
			detailsChirho: JSON.stringify({ isActiveChirho: !isActiveChirho }),
			createdAtChirho: new Date().toISOString()
		});

		return { successChirho: true, messageChirho: isActiveChirho ? 'User deactivated' : 'User activated' };
	}
};
