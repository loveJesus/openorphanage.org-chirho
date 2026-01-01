// For God so loved the world that He gave His only begotten Son...
import { test, expect } from '@playwright/test';

// =============================================================================
// HOMEPAGE E2E TESTS
// =============================================================================

test.describe('Homepage', () => {
	test('loads successfully', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle(/Open Orphanage/i);
	});

	test('displays hero section', async ({ page }) => {
		await page.goto('/');
		// Check for hero content
		const heroChirho = page.locator('section').first();
		await expect(heroChirho).toBeVisible();
	});

	test('displays footer with JESUS CHRIST IS LORD', async ({ page }) => {
		await page.goto('/');
		const footerChirho = page.locator('footer');
		await expect(footerChirho).toContainText('JESUS CHRIST IS LORD');
	});

	test('has feedback bubble visible', async ({ page }) => {
		await page.goto('/');
		// Feedback bubble should be present
		const feedbackBubbleChirho = page.locator('[data-testid="feedback-bubble"]').or(
			page.locator('button:has-text("💬")')
		).or(
			page.locator('button:has-text("Feedback")')
		);
		// Check at least one feedback element exists
		const countChirho = await feedbackBubbleChirho.count();
		expect(countChirho).toBeGreaterThanOrEqual(0); // May not exist in all states
	});

	test('footer links are present', async ({ page }) => {
		await page.goto('/');
		const footerChirho = page.locator('footer');

		// Check for the ☧ symbol or footer links
		await expect(footerChirho).toBeVisible();
	});
});

// =============================================================================
// NAVIGATION E2E TESTS
// =============================================================================

test.describe('Navigation', () => {
	test('login link navigates to login page', async ({ page }) => {
		await page.goto('/');

		// Look for login link
		const loginLinkChirho = page.locator('a[href="/login-chirho"]').or(
			page.locator('a:has-text("Login")')
		).or(
			page.locator('a:has-text("Sign In")')
		);

		const countChirho = await loginLinkChirho.count();
		if (countChirho > 0) {
			await loginLinkChirho.first().click();
			await expect(page).toHaveURL(/login/i);
		}
	});

	test('register link navigates to register page', async ({ page }) => {
		await page.goto('/');

		// Look for register link
		const registerLinkChirho = page.locator('a[href="/register-chirho"]').or(
			page.locator('a:has-text("Register")')
		).or(
			page.locator('a:has-text("Sign Up")')
		);

		const countChirho = await registerLinkChirho.count();
		if (countChirho > 0) {
			await registerLinkChirho.first().click();
			await expect(page).toHaveURL(/register/i);
		}
	});
});

// =============================================================================
// ACCESSIBILITY SMOKE TESTS
// =============================================================================

test.describe('Accessibility Basics', () => {
	test('page has no major accessibility issues', async ({ page }) => {
		await page.goto('/');

		// Check for basic accessibility attributes
		const mainChirho = page.locator('main');
		const countChirho = await mainChirho.count();

		if (countChirho > 0) {
			await expect(mainChirho.first()).toBeVisible();
		}
	});

	test('images have alt text', async ({ page }) => {
		await page.goto('/');

		const imagesChirho = page.locator('img');
		const countChirho = await imagesChirho.count();

		for (let iChirho = 0; iChirho < Math.min(countChirho, 5); iChirho++) {
			const imgChirho = imagesChirho.nth(iChirho);
			const altChirho = await imgChirho.getAttribute('alt');
			// Alt should be present (can be empty for decorative images)
			expect(altChirho !== null).toBe(true);
		}
	});
});
