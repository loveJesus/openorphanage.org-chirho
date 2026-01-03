// For God so loved the world that He gave His only begotten Son...
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { auditLogChirho } from './schema_chirho';

/**
 * Audit action types for consistent logging
 */
export const AUDIT_ACTIONS_CHIRHO = {
	// User actions
	USER_LOGIN: 'USER_LOGIN',
	USER_LOGOUT: 'USER_LOGOUT',
	USER_REGISTER: 'USER_REGISTER',
	USER_UPDATE: 'USER_UPDATE',
	USER_DELETE: 'USER_DELETE',
	PASSWORD_CHANGE: 'PASSWORD_CHANGE',
	PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',

	// GDPR actions
	GDPR_DATA_EXPORT: 'GDPR_DATA_EXPORT',
	GDPR_DELETE_REQUEST: 'GDPR_DELETE_REQUEST',

	// Donation actions
	DONATION_CREATED: 'DONATION_CREATED',
	DONATION_COMPLETED: 'DONATION_COMPLETED',
	DONATION_REFUNDED: 'DONATION_REFUNDED',

	// Orphanage actions
	ORPHANAGE_CREATED: 'ORPHANAGE_CREATED',
	ORPHANAGE_UPDATED: 'ORPHANAGE_UPDATED',
	ORPHANAGE_VERIFIED: 'ORPHANAGE_VERIFIED',
	ORPHANAGE_SUSPENDED: 'ORPHANAGE_SUSPENDED',

	// Child actions (sensitive)
	CHILD_ADDED: 'CHILD_ADDED',
	CHILD_UPDATED: 'CHILD_UPDATED',
	CHILD_PHOTO_UPLOADED: 'CHILD_PHOTO_UPLOADED',
	CHILD_SPONSORED: 'CHILD_SPONSORED',

	// Admin actions
	ADMIN_ACTION: 'ADMIN_ACTION',
	ROLE_CHANGE: 'ROLE_CHANGE',

	// Support actions
	TICKET_CREATED: 'TICKET_CREATED',
	TICKET_RESOLVED: 'TICKET_RESOLVED',

	// Feature voting
	FEATURE_SUBMITTED: 'FEATURE_SUBMITTED',
	FEATURE_VOTED: 'FEATURE_VOTED',

	// Safety
	SAFETY_CONCERN_REPORTED: 'SAFETY_CONCERN_REPORTED',
	SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY'
} as const;

export type AuditActionChirho = (typeof AUDIT_ACTIONS_CHIRHO)[keyof typeof AUDIT_ACTIONS_CHIRHO];

/**
 * Log an audit event to the database
 */
export async function logAuditChirho(
	dbChirho: DrizzleD1Database,
	optionsChirho: {
		userIdChirho?: number | null;
		actionChirho: AuditActionChirho | string;
		entityTypeChirho: string;
		entityIdChirho?: number | string | null;
		detailsChirho?: Record<string, unknown>;
		ipAddressChirho?: string;
		userAgentChirho?: string;
	}
): Promise<void> {
	try {
		await dbChirho.insert(auditLogChirho).values({
			userIdChirho: optionsChirho.userIdChirho ?? null,
			actionChirho: optionsChirho.actionChirho,
			entityTypeChirho: optionsChirho.entityTypeChirho,
			entityIdChirho: typeof optionsChirho.entityIdChirho === 'string'
				? parseInt(optionsChirho.entityIdChirho, 10) || null
				: optionsChirho.entityIdChirho ?? null,
			detailsChirho: optionsChirho.detailsChirho
				? JSON.stringify(optionsChirho.detailsChirho)
				: null,
			ipAddressChirho: optionsChirho.ipAddressChirho ?? null,
			userAgentChirho: optionsChirho.userAgentChirho ?? null,
			createdAtChirho: new Date().toISOString()
		});
	} catch (errChirho) {
		// Log error but don't throw - audit logging should not break the main flow
		console.error('Audit log error:', errChirho);
	}
}

/**
 * Extract IP address from request headers (Cloudflare)
 */
export function getClientIpChirho(requestChirho: Request): string {
	return (
		requestChirho.headers.get('cf-connecting-ip') ||
		requestChirho.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
		requestChirho.headers.get('x-real-ip') ||
		'unknown'
	);
}

/**
 * Extract user agent from request
 */
export function getUserAgentChirho(requestChirho: Request): string {
	return requestChirho.headers.get('user-agent') || 'unknown';
}

// JESUS CHRIST IS LORD
