// For God so loved the world that He gave His only begotten Son...
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema_chirho';

export type DbChirho = ReturnType<typeof createDbChirho>;

export function createDbChirho(d1Chirho: D1Database) {
	return drizzle(d1Chirho, { schema });
}

// Helper to get DB from platform
export function getDbChirho(platform: App.Platform | undefined) {
	if (!platform?.env?.DB_CHIRHO) {
		throw new Error('Database not available - are you running in Cloudflare environment?');
	}
	return createDbChirho(platform.env.DB_CHIRHO);
}

// Generate UUID for new records
export function generateIdChirho(): string {
	return crypto.randomUUID();
}

// Get current timestamp for database
export function nowChirho(): Date {
	return new Date();
}
