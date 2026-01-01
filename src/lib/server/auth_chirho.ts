// For God so loved the world that He gave His only begotten Son...
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { DbChirho } from './db_chirho';
import { usersChirho } from './schema_chirho';
import type { KvHelperChirho } from './kv_chirho';
import { generateIdChirho, nowChirho } from './db_chirho';

// IMPORTANT: Using bcryptjs because argon2 is NOT available on Cloudflare Workers
const BCRYPT_ROUNDS_CHIRHO = 12;

// Password requirements
const MIN_PASSWORD_LENGTH_CHIRHO = 8;
const PASSWORD_REGEX_CHIRHO = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export interface AuthResultChirho {
	successChirho: boolean;
	userChirho?: {
		userIdChirho: string;
		emailChirho: string;
		nameChirho: string;
		roleChirho: 'public' | 'donor' | 'staff' | 'admin' | 'super_admin';
		orphanageIdChirho?: string;
	};
	errorChirho?: string;
	tokenChirho?: string;
}

// =============================================================================
// PASSWORD UTILITIES
// =============================================================================

export async function hashPasswordChirho(passwordChirho: string): Promise<string> {
	return bcrypt.hash(passwordChirho, BCRYPT_ROUNDS_CHIRHO);
}

export async function verifyPasswordChirho(passwordChirho: string, hashChirho: string): Promise<boolean> {
	return bcrypt.compare(passwordChirho, hashChirho);
}

export function validatePasswordChirho(passwordChirho: string): { validChirho: boolean; errorChirho?: string } {
	if (passwordChirho.length < MIN_PASSWORD_LENGTH_CHIRHO) {
		return {
			validChirho: false,
			errorChirho: `Password must be at least ${MIN_PASSWORD_LENGTH_CHIRHO} characters`
		};
	}

	if (!PASSWORD_REGEX_CHIRHO.test(passwordChirho)) {
		return {
			validChirho: false,
			errorChirho: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		};
	}

	return { validChirho: true };
}

// =============================================================================
// REGISTRATION
// =============================================================================

export async function registerUserChirho(
	dbChirho: DbChirho,
	kvChirho: KvHelperChirho,
	emailChirho: string,
	passwordChirho: string,
	nameChirho: string
): Promise<AuthResultChirho> {
	// Validate email
	const emailRegexChirho = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegexChirho.test(emailChirho)) {
		return { successChirho: false, errorChirho: 'Invalid email address' };
	}

	// Validate password
	const passwordValidationChirho = validatePasswordChirho(passwordChirho);
	if (!passwordValidationChirho.validChirho) {
		return { successChirho: false, errorChirho: passwordValidationChirho.errorChirho };
	}

	// Check if email exists
	const existingUserChirho = await dbChirho.query.usersChirho.findFirst({
		where: eq(usersChirho.emailChirho, emailChirho.toLowerCase())
	});

	if (existingUserChirho) {
		return { successChirho: false, errorChirho: 'Email already registered' };
	}

	// Hash password and create user
	const passwordHashChirho = await hashPasswordChirho(passwordChirho);
	const userIdChirho = generateIdChirho();
	const timestampChirho = nowChirho();

	await dbChirho.insert(usersChirho).values({
		userIdChirho,
		emailChirho: emailChirho.toLowerCase(),
		passwordHashChirho,
		nameChirho,
		roleChirho: 'public',
		createdAtChirho: timestampChirho,
		updatedAtChirho: timestampChirho
	});

	// Create session
	const sessionTokenChirho = crypto.randomUUID();
	await kvChirho.createSessionChirho(sessionTokenChirho, {
		userIdChirho,
		emailChirho: emailChirho.toLowerCase(),
		roleChirho: 'public'
	});

	return {
		successChirho: true,
		userChirho: {
			userIdChirho,
			emailChirho: emailChirho.toLowerCase(),
			nameChirho,
			roleChirho: 'public'
		},
		tokenChirho: sessionTokenChirho
	};
}

// =============================================================================
// LOGIN
// =============================================================================

export async function loginUserChirho(
	dbChirho: DbChirho,
	kvChirho: KvHelperChirho,
	emailChirho: string,
	passwordChirho: string
): Promise<AuthResultChirho> {
	// Find user
	const userChirho = await dbChirho.query.usersChirho.findFirst({
		where: eq(usersChirho.emailChirho, emailChirho.toLowerCase())
	});

	if (!userChirho) {
		// Use same error for security (don't reveal if email exists)
		return { successChirho: false, errorChirho: 'Invalid email or password' };
	}

	// Verify password
	const validPasswordChirho = await verifyPasswordChirho(passwordChirho, userChirho.passwordHashChirho);
	if (!validPasswordChirho) {
		return { successChirho: false, errorChirho: 'Invalid email or password' };
	}

	// Create session
	const sessionTokenChirho = crypto.randomUUID();
	await kvChirho.createSessionChirho(sessionTokenChirho, {
		userIdChirho: userChirho.userIdChirho,
		emailChirho: userChirho.emailChirho,
		roleChirho: userChirho.roleChirho,
		orphanageIdChirho: userChirho.orphanageIdChirho ?? undefined
	});

	return {
		successChirho: true,
		userChirho: {
			userIdChirho: userChirho.userIdChirho,
			emailChirho: userChirho.emailChirho,
			nameChirho: userChirho.nameChirho,
			roleChirho: userChirho.roleChirho,
			orphanageIdChirho: userChirho.orphanageIdChirho ?? undefined
		},
		tokenChirho: sessionTokenChirho
	};
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

export async function validateSessionChirho(
	kvChirho: KvHelperChirho,
	tokenChirho: string
): Promise<AuthResultChirho> {
	const sessionChirho = await kvChirho.getSessionChirho(tokenChirho);

	if (!sessionChirho) {
		return { successChirho: false, errorChirho: 'Session expired or invalid' };
	}

	// Refresh session if needed
	await kvChirho.refreshSessionChirho(tokenChirho);

	return {
		successChirho: true,
		userChirho: {
			userIdChirho: sessionChirho.userIdChirho,
			emailChirho: sessionChirho.emailChirho,
			nameChirho: '', // Not stored in session, fetch from DB if needed
			roleChirho: sessionChirho.roleChirho,
			orphanageIdChirho: sessionChirho.orphanageIdChirho
		}
	};
}

export async function logoutUserChirho(kvChirho: KvHelperChirho, tokenChirho: string): Promise<void> {
	await kvChirho.deleteSessionChirho(tokenChirho);
}

// =============================================================================
// ROLE CHECKING
// =============================================================================

export function hasRoleChirho(
	userChirho: App.Locals['userChirho'],
	requiredRolesChirho: Array<'public' | 'donor' | 'staff' | 'admin' | 'super_admin'>
): boolean {
	if (!userChirho) return false;
	return requiredRolesChirho.includes(userChirho.roleChirho);
}

export function isAdminChirho(userChirho: App.Locals['userChirho']): boolean {
	return hasRoleChirho(userChirho, ['admin', 'super_admin']);
}

export function isSuperAdminChirho(userChirho: App.Locals['userChirho']): boolean {
	return hasRoleChirho(userChirho, ['super_admin']);
}

export function canAccessOrphanageChirho(
	userChirho: App.Locals['userChirho'],
	orphanageIdChirho: string
): boolean {
	if (!userChirho) return false;
	if (isSuperAdminChirho(userChirho)) return true;
	if (userChirho.roleChirho === 'admin' || userChirho.roleChirho === 'staff') {
		return userChirho.orphanageIdChirho === orphanageIdChirho;
	}
	return false;
}

// =============================================================================
// COOKIE HELPERS
// =============================================================================

export const SESSION_COOKIE_NAME_CHIRHO = 'session_chirho';

export function createSessionCookieChirho(tokenChirho: string): string {
	const maxAgeChirho = 30 * 24 * 60 * 60; // 30 days
	return `${SESSION_COOKIE_NAME_CHIRHO}=${tokenChirho}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeChirho}`;
}

export function deleteSessionCookieChirho(): string {
	return `${SESSION_COOKIE_NAME_CHIRHO}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function getSessionTokenFromCookiesChirho(cookieHeaderChirho: string | null): string | null {
	if (!cookieHeaderChirho) return null;

	const cookiesChirho = cookieHeaderChirho.split(';').map(cChirho => cChirho.trim());
	const sessionCookieChirho = cookiesChirho.find(cChirho => cChirho.startsWith(`${SESSION_COOKIE_NAME_CHIRHO}=`));

	if (!sessionCookieChirho) return null;

	return sessionCookieChirho.split('=')[1] || null;
}
