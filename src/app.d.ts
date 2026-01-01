// For God so loved the world that He gave His only begotten Son...
// See https://svelte.dev/docs/kit/types#app.d.ts

declare global {
	namespace App {
		interface Error {
			messageChirho?: string;
			codeChirho?: string;
		}

		interface Locals {
			userChirho: {
				userIdChirho: string;
				emailChirho: string;
				roleChirho: 'public' | 'donor' | 'staff' | 'admin' | 'super_admin';
				orphanageIdChirho?: string;
			} | null;
			sessionTokenChirho: string | null;
		}

		interface PageData {
			userChirho?: App.Locals['userChirho'];
		}

		interface Platform {
			env: {
				DB_CHIRHO: D1Database;
				KV_CHIRHO: KVNamespace;
				R2_CHIRHO: R2Bucket;
				// Environment variables
				EMAIL_FROM_CHIRHO: string;
				EMAIL_SUPPORT_CHIRHO: string;
				EMAIL_ADMIN_CHIRHO: string;
				SITE_URL_CHIRHO: string;
				SITE_NAME_CHIRHO: string;
				// Secrets (set via wrangler secret put)
				MASTER_2SMTP_API_KEY_CHIRHO?: string;
				MAILU_API_TOKEN_CHIRHO?: string;
				SESSION_SECRET_CHIRHO?: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
