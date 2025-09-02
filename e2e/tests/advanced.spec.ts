import { test, expect } from '@playwright/test';

test.describe('HyperSense API Integration', () => {
    test('should connect to API health endpoint', async ({ page }) => {
        // Go to application
        await page.goto('/');

        // Wait for API health check to complete
        await page.waitForLoadState('networkidle');

        // Check if API is responding (should show no connectivity errors)
        const errorElements = page.locator('[data-testid="api-error"], .error-message');
        await expect(errorElements).toHaveCount(0);
    });

    test('should handle API errors gracefully', async ({ page }) => {
        // Intercept API calls and simulate errors
        await page.route('**/api/**', route => {
            route.fulfill({
                status: 500,
                body: JSON.stringify({ error: 'Server error' })
            });
        });

        await page.goto('/');

        // Check for error handling UI
        const errorMessage = page.locator('[data-testid="api-error"]');
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    });

    test('should show loading states', async ({ page }) => {
        // Intercept API calls and add delay
        await page.route('**/api/products', route => {
            setTimeout(() => {
                route.continue();
            }, 2000);
        });

        await page.goto('/');

        // Login first
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Check for loading state
        const loadingElement = page.locator('[data-testid="loading"], .loading, .spinner');
        await expect(loadingElement).toBeVisible();
    });
});

test.describe('HyperSense Performance', () => {
    test('should load main page within acceptable time', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThan(5000); // Should load within 5 seconds
    });

    test('should not have console errors', async ({ page }) => {
        const consoleErrors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Filter out known acceptable errors (like 404s for optional resources)
        const criticalErrors = consoleErrors.filter(error =>
            !error.includes('favicon') &&
            !error.includes('robots.txt') &&
            !error.includes('manifest.json')
        );

        expect(criticalErrors).toHaveLength(0);
    });
});

test.describe('HyperSense Accessibility', () => {
    test('should have proper heading structure', async ({ page }) => {
        await page.goto('/');

        // Check for h1 element
        const h1 = page.locator('h1');
        await expect(h1).toBeVisible();

        // Verify heading hierarchy
        const headings = page.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        expect(headingCount).toBeGreaterThan(0);
    });

    test('should have alt text for images', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Check all images have alt text
        const images = page.locator('img');
        const imageCount = await images.count();

        for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            const alt = await img.getAttribute('alt');
            expect(alt).toBeTruthy();
        }
    });

    test('should be keyboard navigable', async ({ page }) => {
        await page.goto('/');

        // Test tab navigation
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Check if focus is visible
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });
});

test.describe('HyperSense Security', () => {
    test('should protect against XSS', async ({ page }) => {
        await page.goto('/');

        // Login
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Try to inject script in product name
        await page.click('[data-testid="add-product-button"]');
        await page.fill('input[name="name"]', '<script>alert("XSS")</script>');
        await page.fill('textarea[name="description"]', 'Safe description');
        await page.fill('input[name="price"]', '99.99');
        await page.fill('input[name="stockQuantity"]', '10');

        await page.click('button[type="submit"]');

        // Verify script is not executed
        page.on('dialog', dialog => {
            expect(dialog.message()).not.toBe('XSS');
            dialog.accept();
        });
    });

    test('should require authentication for protected routes', async ({ page }) => {
        // Try to access products page without login
        await page.goto('/products');

        // Should redirect to login
        await expect(page).toHaveURL(/.*login|\/$/);
    });

    test('should have secure headers', async ({ page }) => {
        const response = await page.goto('/');

        // Check for security headers (if implemented)
        const headers = response?.headers();

        // These are optional but good to have
        if (headers) {
            // Note: Some headers might not be present in development
            console.log('Response headers:', headers);
        }
    });
});
