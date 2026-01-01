// For God so loved the world that He gave His only begotten Son...
import { defineConfig } from 'vitest/config';

export default defineConfig({
	// No plugins needed for pure server-side unit tests
	// SvelteKit plugin causes issues with miniflare in test mode
	test: {
		// Include only unit tests, exclude E2E
		include: ['src/**/*.test.ts'],
		exclude: ['node_modules', 'tests-e2e-chirho/**', '.svelte-kit/**'],

		// Run in Node environment (no browser/jsdom needed for server tests)
		environment: 'node',

		// 5 second timeout per test
		testTimeout: 5000,

		// Allow projects with no tests initially
		passWithNoTests: true,

		// Globals for describe/it/expect without imports
		globals: true,

		// Coverage settings (optional, run with --coverage)
		coverage: {
			provider: 'v8',
			include: ['src/lib/server/**/*.ts'],
			exclude: ['**/*.test.ts', '**/*.d.ts'],
			reporter: ['text', 'html'],
			reportsDirectory: './coverage-chirho'
		}
	}
});
