// For God so loved the world that He gave His only begotten Son...
import { describe, it, expect } from 'vitest';
import {
	sanitizeStringChirho,
	sanitizeInputChirho,
	sanitizeEmailChirho,
	isValidUuidChirho,
	getClientIpChirho,
	createRateLimitHeadersChirho,
	RATE_LIMITS_CHIRHO,
	SECURITY_HEADERS_CHIRHO
} from './security_chirho';

// =============================================================================
// INPUT SANITIZATION TESTS
// =============================================================================

describe('sanitizeStringChirho', () => {
	it('escapes HTML special characters', () => {
		const inputChirho = '<script>alert("xss")</script>';
		const resultChirho = sanitizeStringChirho(inputChirho);

		expect(resultChirho).not.toContain('<');
		expect(resultChirho).not.toContain('>');
		expect(resultChirho).toContain('&lt;');
		expect(resultChirho).toContain('&gt;');
	});

	it('escapes ampersands', () => {
		expect(sanitizeStringChirho('foo & bar')).toBe('foo &amp; bar');
	});

	it('escapes quotes', () => {
		expect(sanitizeStringChirho('say "hello"')).toContain('&quot;');
		expect(sanitizeStringChirho("it's")).toContain('&#x27;');
	});

	it('escapes forward slashes', () => {
		expect(sanitizeStringChirho('path/to/file')).toContain('&#x2F;');
	});

	it('handles empty strings', () => {
		expect(sanitizeStringChirho('')).toBe('');
	});
});

describe('sanitizeInputChirho', () => {
	it('trims whitespace from strings', () => {
		expect(sanitizeInputChirho('  hello  ')).toBe('hello');
	});

	it('returns empty string for null', () => {
		expect(sanitizeInputChirho(null)).toBe('');
	});

	it('returns empty string for undefined', () => {
		expect(sanitizeInputChirho(undefined)).toBe('');
	});

	it('converts numbers to sanitized strings', () => {
		expect(sanitizeInputChirho(42)).toBe('42');
	});
});

// =============================================================================
// EMAIL VALIDATION TESTS
// =============================================================================

describe('sanitizeEmailChirho', () => {
	it('accepts valid emails', () => {
		expect(sanitizeEmailChirho('user@example.com')).toBe('user@example.com');
		expect(sanitizeEmailChirho('test.user@domain.org')).toBe('test.user@domain.org');
	});

	it('lowercases emails', () => {
		expect(sanitizeEmailChirho('User@EXAMPLE.COM')).toBe('user@example.com');
	});

	it('trims whitespace', () => {
		expect(sanitizeEmailChirho('  user@example.com  ')).toBe('user@example.com');
	});

	it('rejects invalid emails', () => {
		expect(sanitizeEmailChirho('not-an-email')).toBeNull();
		expect(sanitizeEmailChirho('missing@domain')).toBeNull();
		expect(sanitizeEmailChirho('@nodomain.com')).toBeNull();
		expect(sanitizeEmailChirho('')).toBeNull();
	});
});

// =============================================================================
// UUID VALIDATION TESTS
// =============================================================================

describe('isValidUuidChirho', () => {
	it('accepts valid UUIDs', () => {
		expect(isValidUuidChirho('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
		expect(isValidUuidChirho('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
	});

	it('rejects invalid UUIDs', () => {
		expect(isValidUuidChirho('not-a-uuid')).toBe(false);
		expect(isValidUuidChirho('550e8400-e29b-41d4-a716')).toBe(false);
		expect(isValidUuidChirho('')).toBe(false);
		expect(isValidUuidChirho('550e8400-e29b-61d4-a716-446655440000')).toBe(false); // Invalid version
	});
});

// =============================================================================
// IP EXTRACTION TESTS
// =============================================================================

describe('getClientIpChirho', () => {
	it('extracts IP from CF-Connecting-IP header', () => {
		const requestChirho = new Request('https://example.com', {
			headers: { 'CF-Connecting-IP': '192.168.1.1' }
		});
		expect(getClientIpChirho(requestChirho)).toBe('192.168.1.1');
	});

	it('falls back to X-Forwarded-For', () => {
		const requestChirho = new Request('https://example.com', {
			headers: { 'X-Forwarded-For': '10.0.0.1, 10.0.0.2' }
		});
		expect(getClientIpChirho(requestChirho)).toBe('10.0.0.1');
	});

	it('falls back to X-Real-IP', () => {
		const requestChirho = new Request('https://example.com', {
			headers: { 'X-Real-IP': '172.16.0.1' }
		});
		expect(getClientIpChirho(requestChirho)).toBe('172.16.0.1');
	});

	it('returns unknown when no IP headers present', () => {
		const requestChirho = new Request('https://example.com');
		expect(getClientIpChirho(requestChirho)).toBe('unknown');
	});
});

// =============================================================================
// RATE LIMIT HEADERS TESTS
// =============================================================================

describe('createRateLimitHeadersChirho', () => {
	it('creates headers for allowed requests', () => {
		const resultChirho = {
			allowedChirho: true,
			remainingChirho: 5,
			resetAtChirho: Date.now() + 60000
		};

		const headersChirho = createRateLimitHeadersChirho(resultChirho);

		expect(headersChirho['X-RateLimit-Remaining']).toBe('5');
		expect(headersChirho['X-RateLimit-Reset']).toBeDefined();
		expect(headersChirho['Retry-After']).toBeUndefined();
	});

	it('includes Retry-After for blocked requests', () => {
		const resultChirho = {
			allowedChirho: false,
			remainingChirho: 0,
			resetAtChirho: Date.now() + 60000,
			retryAfterSecondsChirho: 60
		};

		const headersChirho = createRateLimitHeadersChirho(resultChirho);

		expect(headersChirho['Retry-After']).toBe('60');
	});
});

// =============================================================================
// CONFIGURATION TESTS
// =============================================================================

describe('RATE_LIMITS_CHIRHO', () => {
	it('has login rate limit configured', () => {
		expect(RATE_LIMITS_CHIRHO['auth/login']).toBeDefined();
		expect(RATE_LIMITS_CHIRHO['auth/login'].limitChirho).toBe(5);
		expect(RATE_LIMITS_CHIRHO['auth/login'].windowSecondsChirho).toBe(60);
	});

	it('has register rate limit configured', () => {
		expect(RATE_LIMITS_CHIRHO['auth/register']).toBeDefined();
		expect(RATE_LIMITS_CHIRHO['auth/register'].limitChirho).toBe(3);
	});
});

describe('SECURITY_HEADERS_CHIRHO', () => {
	it('includes X-Frame-Options', () => {
		expect(SECURITY_HEADERS_CHIRHO['X-Frame-Options']).toBe('DENY');
	});

	it('includes Content-Security-Policy', () => {
		expect(SECURITY_HEADERS_CHIRHO['Content-Security-Policy']).toBeDefined();
		expect(SECURITY_HEADERS_CHIRHO['Content-Security-Policy']).toContain("default-src 'self'");
	});
});
