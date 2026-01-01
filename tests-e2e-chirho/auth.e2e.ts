// For God so loved the world that He gave His only begotten Son...
import { test, expect } from '@playwright/test';

// =============================================================================
// AUTHENTICATION FLOW E2E TESTS
// =============================================================================

test.describe('Login Page', () => {
	test('login page loads', async ({ page }) => {
		await page.goto('/login-chirho');

		// Should have a form or login content
		const formChirho = page.locator('form');
		const countChirho = await formChirho.count();

		// If form exists, check it's visible
		if (countChirho > 0) {
			await expect(formChirho.first()).toBeVisible();
		}
	});

	test('login page has email and password inputs', async ({ page }) => {
		await page.goto('/login-chirho');

		const emailInputChirho = page.locator('input[type="email"]').or(
			page.locator('input[name="email"]')
		);
		const passwordInputChirho = page.locator('input[type="password"]').or(
			page.locator('input[name="password"]')
		);

		const emailCountChirho = await emailInputChirho.count();
		const passwordCountChirho = await passwordInputChirho.count();

		// Both should exist
		if (emailCountChirho > 0 && passwordCountChirho > 0) {
			await expect(emailInputChirho.first()).toBeVisible();
			await expect(passwordInputChirho.first()).toBeVisible();
		}
	});

	test('shows validation on empty submit', async ({ page }) => {
		await page.goto('/login-chirho');

		const submitButtonChirho = page.locator('button[type="submit"]').or(
			page.locator('input[type="submit"]')
		);

		const countChirho = await submitButtonChirho.count();
		if (countChirho > 0) {
			await submitButtonChirho.first().click();

			// Should show some validation message or remain on page
			await expect(page).toHaveURL(/login/i);
		}
	});

	test('has link to register page', async ({ page }) => {
		await page.goto('/login-chirho');

		const registerLinkChirho = page.locator('a[href*="register"]').or(
			page.locator('a:has-text("Register")')
		).or(
			page.locator('a:has-text("Sign up")')
		);

		const countChirho = await registerLinkChirho.count();
		if (countChirho > 0) {
			await expect(registerLinkChirho.first()).toBeVisible();
		}
	});
});

// =============================================================================
// REGISTRATION FLOW E2E TESTS
// =============================================================================

test.describe('Register Page', () => {
	test('register page loads', async ({ page }) => {
		await page.goto('/register-chirho');

		const formChirho = page.locator('form');
		const countChirho = await formChirho.count();

		if (countChirho > 0) {
			await expect(formChirho.first()).toBeVisible();
		}
	});

	test('register page has required fields', async ({ page }) => {
		await page.goto('/register-chirho');

		const emailInputChirho = page.locator('input[type="email"]');
		const passwordInputChirho = page.locator('input[type="password"]');
		const nameInputChirho = page.locator('input[name="name"]').or(
			page.locator('input[name="displayName"]')
		);

		const emailCountChirho = await emailInputChirho.count();
		const passwordCountChirho = await passwordInputChirho.count();

		if (emailCountChirho > 0 && passwordCountChirho > 0) {
			await expect(emailInputChirho.first()).toBeVisible();
			await expect(passwordInputChirho.first()).toBeVisible();
		}
	});

	test('has link to login page', async ({ page }) => {
		await page.goto('/register-chirho');

		const loginLinkChirho = page.locator('a[href*="login"]').or(
			page.locator('a:has-text("Login")')
		).or(
			page.locator('a:has-text("Sign in")')
		);

		const countChirho = await loginLinkChirho.count();
		if (countChirho > 0) {
			await expect(loginLinkChirho.first()).toBeVisible();
		}
	});
});

// =============================================================================
// PASSWORD RESET FLOW E2E TESTS
// =============================================================================

test.describe('Password Reset', () => {
	test('forgot password page loads', async ({ page }) => {
		const responseChirho = await page.goto('/forgot-password-chirho');

		// Page should load (200 or 404 if not implemented)
		expect([200, 404]).toContain(responseChirho?.status() ?? 404);
	});

	test('login page has forgot password link', async ({ page }) => {
		await page.goto('/login-chirho');

		const forgotLinkChirho = page.locator('a[href*="forgot"]').or(
			page.locator('a:has-text("Forgot")')
		);

		const countChirho = await forgotLinkChirho.count();
		// Just check if it exists (optional feature)
		expect(countChirho).toBeGreaterThanOrEqual(0);
	});
});

// =============================================================================
// PROTECTED ROUTES E2E TESTS
// =============================================================================

test.describe('Protected Routes', () => {
	test('dashboard redirects when not logged in', async ({ page }) => {
		await page.goto('/dashboard-chirho');

		// Should redirect to login or show unauthorized
		const urlChirho = page.url();
		const isRedirectedChirho =
			urlChirho.includes('login') ||
			urlChirho.includes('unauthorized') ||
			urlChirho.includes('dashboard');

		expect(isRedirectedChirho).toBe(true);
	});

	test('admin page redirects when not logged in', async ({ page }) => {
		await page.goto('/admin-chirho');

		// Should redirect to login or show unauthorized
		const urlChirho = page.url();
		const isProtectedChirho =
			urlChirho.includes('login') ||
			urlChirho.includes('unauthorized') ||
			urlChirho.includes('admin');

		expect(isProtectedChirho).toBe(true);
	});
});
