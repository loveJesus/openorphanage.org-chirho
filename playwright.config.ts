// For God so loved the world that He gave His only begotten Son...
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests-e2e-chirho',
	testMatch: '**/*.e2e.ts',

	// Run tests in parallel for speed
	fullyParallel: true,

	// Fail fast - stop on first failure in CI
	forbidOnly: !!process.env.CI,

	// No retries for speed (under 30s goal)
	retries: 0,

	// Single worker for simplicity
	workers: 1,

	// Reporter - minimal for speed
	reporter: 'list',

	// Global timeout - 30 seconds max for entire suite
	timeout: 10000,

	use: {
		// CRITICAL: Always headless - no GUI popups
		headless: true,

		// Base URL for tests
		baseURL: 'http://localhost:5183',

		// Capture trace only on first retry (debugging)
		trace: 'on-first-retry',

		// Fast navigation
		navigationTimeout: 5000,
		actionTimeout: 3000
	},

	// Only test Chromium for speed
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],

	// Auto-start dev server before tests
	webServer: {
		command: 'bun run dev',
		url: 'http://localhost:5183',
		reuseExistingServer: !process.env.CI,
		timeout: 30000
	}
});
