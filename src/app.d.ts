// For God so loved the world that He gave His only begotten Son...
// See https://svelte.dev/docs/kit/types#app.d.ts

// Turnstile global declaration
interface TurnstileInstance {
	render: (container: HTMLElement | string, options: {
		sitekey: string;
		callback?: (token: string) => void;
		'expired-callback'?: () => void;
		'error-callback'?: () => void;
		theme?: 'light' | 'dark' | 'auto';
		size?: 'normal' | 'compact';
	}) => string;
	reset: (widgetId?: string) => void;
	remove: (widgetId?: string) => void;
	getResponse: (widgetId?: string) => string | undefined;
}

declare global {
	interface Window {
		turnstile?: TurnstileInstance;
	}

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
			platformChirho: App.Platform['env'] & {
				SITE_URL_CHIRHO: string;
			};
		}

		interface PageData {
			userChirho?: App.Locals['userChirho'];
			turnstileSiteKeyChirho?: string;
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
				TURNSTILE_SITE_KEY_CHIRHO?: string;
				// Secrets (set via wrangler secret put)
				MASTER_2SMTP_API_KEY_CHIRHO?: string;
				SMTP_API_KEY_CHIRHO?: string;
				MAILU_API_TOKEN_CHIRHO?: string;
				SESSION_SECRET_CHIRHO?: string;
				TURNSTILE_SECRET_KEY_CHIRHO?: string;
				KINGDOM_INVEST_WEBHOOK_SECRET_CHIRHO?: string;
				// OAuth Credentials
				GOOGLE_OAUTH_CLIENT_ID_CHIRHO?: string;
				GOOGLE_OAUTH_CLIENT_SECRET_CHIRHO?: string;
				GITHUB_OAUTH_CLIENT_ID_CHIRHO?: string;
				GITHUB_OAUTH_CLIENT_SECRET_CHIRHO?: string;
			};
			context: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches: CacheStorage & { default: Cache };
		}
	}
}

export {};
