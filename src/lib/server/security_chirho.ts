// For God so loved the world that He gave His only begotten Son...
import type { KvHelperChirho } from './kv_chirho';

// =============================================================================
// RATE LIMITING CONFIGURATION
// =============================================================================

export const RATE_LIMITS_CHIRHO = {
	// Auth endpoints
	'auth/login': { limitChirho: 5, windowSecondsChirho: 60 }, // 5 per minute
	'auth/register': { limitChirho: 3, windowSecondsChirho: 3600 }, // 3 per hour
	'auth/password-reset': { limitChirho: 3, windowSecondsChirho: 3600 }, // 3 per hour
	'auth/oauth': { limitChirho: 10, windowSecondsChirho: 60 }, // 10 per minute

	// Feedback & Support
	'feedback/submit': { limitChirho: 10, windowSecondsChirho: 3600 }, // 10 per hour
	'support/ticket': { limitChirho: 3, windowSecondsChirho: 300 }, // 3 per 5 min

	// Newsletter
	'newsletter/subscribe': { limitChirho: 3, windowSecondsChirho: 60 }, // 3 per minute

	// API general
	'api/general': { limitChirho: 100, windowSecondsChirho: 60 }, // 100 per minute

	// File uploads
	'upload/image': { limitChirho: 20, windowSecondsChirho: 3600 }, // 20 per hour
	'upload/document': { limitChirho: 10, windowSecondsChirho: 3600 } // 10 per hour
} as const;

export type RateLimitKeyChirho = keyof typeof RATE_LIMITS_CHIRHO;

// =============================================================================
// RATE LIMITING
// =============================================================================

export interface RateLimitResultChirho {
	allowedChirho: boolean;
	remainingChirho: number;
	resetAtChirho: number;
	retryAfterSecondsChirho?: number;
}

export async function checkRateLimitChirho(
	kvChirho: KvHelperChirho,
	ipChirho: string,
	endpointChirho: RateLimitKeyChirho
): Promise<RateLimitResultChirho> {
	const configChirho = RATE_LIMITS_CHIRHO[endpointChirho];
	const resultChirho = await kvChirho.checkRateLimitChirho(
		ipChirho,
		endpointChirho,
		configChirho.limitChirho,
		configChirho.windowSecondsChirho
	);

	return {
		...resultChirho,
		retryAfterSecondsChirho: resultChirho.allowedChirho
			? undefined
			: Math.ceil((resultChirho.resetAtChirho - Date.now()) / 1000)
	};
}

export function createRateLimitHeadersChirho(resultChirho: RateLimitResultChirho): Record<string, string> {
	const headersChirho: Record<string, string> = {
		'X-RateLimit-Remaining': resultChirho.remainingChirho.toString(),
		'X-RateLimit-Reset': new Date(resultChirho.resetAtChirho).toISOString()
	};

	if (!resultChirho.allowedChirho && resultChirho.retryAfterSecondsChirho) {
		headersChirho['Retry-After'] = resultChirho.retryAfterSecondsChirho.toString();
	}

	return headersChirho;
}

// =============================================================================
// CSRF PROTECTION
// =============================================================================

export async function generateCsrfTokenChirho(
	kvChirho: KvHelperChirho,
	sessionTokenChirho: string
): Promise<string> {
	return kvChirho.createCsrfTokenChirho(sessionTokenChirho);
}

export async function validateCsrfTokenChirho(
	kvChirho: KvHelperChirho,
	sessionTokenChirho: string,
	csrfTokenChirho: string
): Promise<boolean> {
	return kvChirho.validateCsrfTokenChirho(sessionTokenChirho, csrfTokenChirho);
}

// =============================================================================
// IP EXTRACTION
// =============================================================================

export function getClientIpChirho(requestChirho: Request): string {
	// Cloudflare provides the real IP in CF-Connecting-IP
	const cfIpChirho = requestChirho.headers.get('CF-Connecting-IP');
	if (cfIpChirho) return cfIpChirho;

	// Fallback to X-Forwarded-For
	const forwardedChirho = requestChirho.headers.get('X-Forwarded-For');
	if (forwardedChirho) {
		const ipsChirho = forwardedChirho.split(',').map(ipChirho => ipChirho.trim());
		return ipsChirho[0] || 'unknown';
	}

	// Last resort
	const realIpChirho = requestChirho.headers.get('X-Real-IP');
	if (realIpChirho) return realIpChirho;

	return 'unknown';
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

export const SECURITY_HEADERS_CHIRHO: Record<string, string> = {
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'DENY',
	'X-XSS-Protection': '1; mode=block',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Content-Security-Policy': [
		"default-src 'self'",
		"script-src 'self' 'unsafe-inline'", // Needed for Svelte
		"style-src 'self' 'unsafe-inline'", // Needed for Tailwind
		"img-src 'self' data: https:",
		"font-src 'self'",
		"connect-src 'self' https://api.2smtp.com",
		"frame-ancestors 'none'",
		"form-action 'self'",
		"base-uri 'self'"
	].join('; ')
};

export function applySecurityHeadersChirho(responseChirho: Response): Response {
	const newHeadersChirho = new Headers(responseChirho.headers);

	for (const [keyChirho, valueChirho] of Object.entries(SECURITY_HEADERS_CHIRHO)) {
		newHeadersChirho.set(keyChirho, valueChirho);
	}

	return new Response(responseChirho.body, {
		status: responseChirho.status,
		statusText: responseChirho.statusText,
		headers: newHeadersChirho
	});
}

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeStringChirho(inputChirho: string): string {
	return inputChirho
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

/**
 * Sanitize any input value - handles strings, nulls, undefined
 */
export function sanitizeInputChirho(inputChirho: unknown): string {
	if (inputChirho === null || inputChirho === undefined) {
		return '';
	}
	if (typeof inputChirho === 'string') {
		return sanitizeStringChirho(inputChirho.trim());
	}
	return sanitizeStringChirho(String(inputChirho));
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmailChirho(emailChirho: string): string | null {
	const trimmedChirho = emailChirho.trim().toLowerCase();
	const emailRegexChirho = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegexChirho.test(trimmedChirho)) {
		return null;
	}

	return trimmedChirho;
}

/**
 * Validate UUID format
 */
export function isValidUuidChirho(uuidChirho: string): boolean {
	const uuidRegexChirho = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
	return uuidRegexChirho.test(uuidChirho);
}

// =============================================================================
// AUDIT LOGGING
// =============================================================================

export interface AuditLogEntryChirho {
	userIdChirho: string | null;
	actionChirho: string;
	resourceTypeChirho: string;
	resourceIdChirho?: string;
	detailsChirho?: Record<string, unknown>;
	ipAddressChirho: string;
	userAgentChirho: string;
}

// Log sensitive actions for audit trail
// In production, this would write to the audit_log_chirho table
export function createAuditLogChirho(
	requestChirho: Request,
	userChirho: App.Locals['userChirho'],
	actionChirho: string,
	resourceTypeChirho: string,
	resourceIdChirho?: string,
	detailsChirho?: Record<string, unknown>
): AuditLogEntryChirho {
	return {
		userIdChirho: userChirho?.userIdChirho || null,
		actionChirho,
		resourceTypeChirho,
		resourceIdChirho,
		detailsChirho,
		ipAddressChirho: getClientIpChirho(requestChirho),
		userAgentChirho: requestChirho.headers.get('User-Agent') || 'unknown'
	};
}
