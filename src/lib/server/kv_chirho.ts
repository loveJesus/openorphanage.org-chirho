// For God so loved the world that He gave His only begotten Son...

// KV key patterns for organized storage
export const KV_PREFIXES_CHIRHO = {
	// Sessions
	SESSION: 'session:',

	// Large text content
	ORPHANAGE_BIO: 'orphanage:bio:',
	ORPHANAGE_MISSION: 'orphanage:mission:',
	CHILD_STORY: 'child:story:',
	CHILD_NEEDS: 'child:needs:',
	NEED_DETAILS: 'need:details:',
	FEEDBACK_CONTENT: 'feedback:content:',

	// Rate limiting
	RATE_LIMIT: 'rate:',

	// CSRF tokens
	CSRF: 'csrf:'
} as const;

// Session data structure
export interface SessionDataChirho {
	userIdChirho: string;
	emailChirho: string;
	roleChirho: 'public' | 'donor' | 'staff' | 'admin' | 'super_admin';
	orphanageIdChirho?: string;
	createdAtChirho: number;
	expiresAtChirho: number;
}

// KV helper class
export class KvHelperChirho {
	constructor(private kvChirho: KVNamespace) {}

	// ==========================================================================
	// SESSION MANAGEMENT
	// ==========================================================================

	async createSessionChirho(
		tokenChirho: string,
		dataChirho: Omit<SessionDataChirho, 'createdAtChirho' | 'expiresAtChirho'>
	): Promise<void> {
		const nowChirho = Date.now();
		const expiresInDaysChirho = 30;
		const sessionChirho: SessionDataChirho = {
			...dataChirho,
			createdAtChirho: nowChirho,
			expiresAtChirho: nowChirho + (expiresInDaysChirho * 24 * 60 * 60 * 1000)
		};

		await this.kvChirho.put(
			`${KV_PREFIXES_CHIRHO.SESSION}${tokenChirho}`,
			JSON.stringify(sessionChirho),
			{ expirationTtl: expiresInDaysChirho * 24 * 60 * 60 }
		);
	}

	async getSessionChirho(tokenChirho: string): Promise<SessionDataChirho | null> {
		const dataChirho = await this.kvChirho.get(`${KV_PREFIXES_CHIRHO.SESSION}${tokenChirho}`);
		if (!dataChirho) return null;

		const sessionChirho = JSON.parse(dataChirho) as SessionDataChirho;

		// Check if expired
		if (sessionChirho.expiresAtChirho < Date.now()) {
			await this.deleteSessionChirho(tokenChirho);
			return null;
		}

		return sessionChirho;
	}

	async deleteSessionChirho(tokenChirho: string): Promise<void> {
		await this.kvChirho.delete(`${KV_PREFIXES_CHIRHO.SESSION}${tokenChirho}`);
	}

	async refreshSessionChirho(tokenChirho: string): Promise<boolean> {
		const sessionChirho = await this.getSessionChirho(tokenChirho);
		if (!sessionChirho) return false;

		// Refresh if more than 15 days old
		const fifteenDaysChirho = 15 * 24 * 60 * 60 * 1000;
		if (Date.now() - sessionChirho.createdAtChirho > fifteenDaysChirho) {
			await this.createSessionChirho(tokenChirho, {
				userIdChirho: sessionChirho.userIdChirho,
				emailChirho: sessionChirho.emailChirho,
				roleChirho: sessionChirho.roleChirho,
				orphanageIdChirho: sessionChirho.orphanageIdChirho
			});
		}

		return true;
	}

	// ==========================================================================
	// LARGE TEXT STORAGE
	// ==========================================================================

	async setLargeTextChirho(keyChirho: string, textChirho: string): Promise<void> {
		await this.kvChirho.put(keyChirho, textChirho);
	}

	async getLargeTextChirho(keyChirho: string): Promise<string | null> {
		return await this.kvChirho.get(keyChirho);
	}

	async deleteLargeTextChirho(keyChirho: string): Promise<void> {
		await this.kvChirho.delete(keyChirho);
	}

	// Specific helpers for common patterns
	async setOrphanageBioChirho(orphanageIdChirho: string, bioChirho: string): Promise<string> {
		const keyChirho = `${KV_PREFIXES_CHIRHO.ORPHANAGE_BIO}${orphanageIdChirho}`;
		await this.setLargeTextChirho(keyChirho, bioChirho);
		return keyChirho;
	}

	async setChildStoryChirho(childIdChirho: string, storyChirho: string): Promise<string> {
		const keyChirho = `${KV_PREFIXES_CHIRHO.CHILD_STORY}${childIdChirho}`;
		await this.setLargeTextChirho(keyChirho, storyChirho);
		return keyChirho;
	}

	async setFeedbackContentChirho(feedbackIdChirho: string, contentChirho: string): Promise<string> {
		const keyChirho = `${KV_PREFIXES_CHIRHO.FEEDBACK_CONTENT}${feedbackIdChirho}`;
		await this.setLargeTextChirho(keyChirho, contentChirho);
		return keyChirho;
	}

	// ==========================================================================
	// RATE LIMITING
	// ==========================================================================

	async checkRateLimitChirho(
		ipChirho: string,
		endpointChirho: string,
		limitChirho: number,
		windowSecondsChirho: number
	): Promise<{ allowedChirho: boolean; remainingChirho: number; resetAtChirho: number }> {
		const keyChirho = `${KV_PREFIXES_CHIRHO.RATE_LIMIT}${ipChirho}:${endpointChirho}`;
		const nowChirho = Date.now();

		const dataChirho = await this.kvChirho.get(keyChirho);
		let countChirho = 0;
		let windowStartChirho = nowChirho;

		if (dataChirho) {
			const parsedChirho = JSON.parse(dataChirho);
			// Check if within window
			if (nowChirho - parsedChirho.startChirho < windowSecondsChirho * 1000) {
				countChirho = parsedChirho.countChirho;
				windowStartChirho = parsedChirho.startChirho;
			}
		}

		const allowedChirho = countChirho < limitChirho;

		if (allowedChirho) {
			// Increment counter
			await this.kvChirho.put(keyChirho, JSON.stringify({
				countChirho: countChirho + 1,
				startChirho: windowStartChirho
			}), { expirationTtl: windowSecondsChirho });
		}

		return {
			allowedChirho,
			remainingChirho: Math.max(0, limitChirho - countChirho - 1),
			resetAtChirho: windowStartChirho + (windowSecondsChirho * 1000)
		};
	}

	// ==========================================================================
	// CSRF TOKENS
	// ==========================================================================

	async createCsrfTokenChirho(sessionTokenChirho: string): Promise<string> {
		const csrfTokenChirho = crypto.randomUUID();
		const keyChirho = `${KV_PREFIXES_CHIRHO.CSRF}${sessionTokenChirho}`;

		await this.kvChirho.put(keyChirho, csrfTokenChirho, { expirationTtl: 3600 }); // 1 hour

		return csrfTokenChirho;
	}

	async validateCsrfTokenChirho(sessionTokenChirho: string, csrfTokenChirho: string): Promise<boolean> {
		const keyChirho = `${KV_PREFIXES_CHIRHO.CSRF}${sessionTokenChirho}`;
		const storedTokenChirho = await this.kvChirho.get(keyChirho);

		return storedTokenChirho === csrfTokenChirho;
	}
}

// Helper to get KV from platform
export function getKvChirho(platform: App.Platform | undefined): KvHelperChirho {
	if (!platform?.env?.KV_CHIRHO) {
		throw new Error('KV not available - are you running in Cloudflare environment?');
	}
	return new KvHelperChirho(platform.env.KV_CHIRHO);
}
