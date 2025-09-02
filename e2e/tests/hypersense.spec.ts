import { test, expect } from '@playwright/test';

test.describe('HyperSense Authentication', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display login page correctly', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Welcome to HyperSense');
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
        // Fill in login form
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');

        // Submit form
        await page.click('button[type="submit"]');

        // Wait for navigation to dashboard
        await expect(page).toHaveURL(/.*products/);

        // Verify dashboard elements
        await expect(page.locator('h1')).toContainText('Products');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        // Fill in invalid credentials
        await page.fill('input[type="email"]', 'invalid@test.com');
        await page.fill('input[type="password"]', 'wrongpassword');

        // Submit form
        await page.click('button[type="submit"]');

        // Verify error message
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
        await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    });

    test('should use demo user selection', async ({ page }) => {
        // Click on admin demo user
        await page.click('[data-testid="demo-user-admin"]');

        // Verify fields are filled
        await expect(page.locator('input[type="email"]')).toHaveValue('admin@hypesoft.com');
        await expect(page.locator('input[type="password"]')).toHaveValue('admin123');
    });
});

test.describe('HyperSense Product Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login before each test
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL(/.*products/);
    });

    test('should display products list', async ({ page }) => {
        // Verify products page elements
        await expect(page.locator('h1')).toContainText('Products');
        await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();
        await expect(page.locator('[data-testid="add-product-button"]')).toBeVisible();
    });

    test('should create new product', async ({ page }) => {
        // Click add product button
        await page.click('[data-testid="add-product-button"]');

        // Fill product form
        await page.fill('input[name="name"]', 'Test Product E2E');
        await page.fill('textarea[name="description"]', 'Product created by E2E test');
        await page.fill('input[name="price"]', '199.99');
        await page.fill('input[name="stockQuantity"]', '50');
        await page.selectOption('select[name="categoryId"]', { label: 'Electronics' });

        // Submit form
        await page.click('button[type="submit"]');

        // Verify product was created
        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
        await expect(page.locator('[data-testid="toast-success"]')).toContainText('Product created successfully');
    });

    test('should edit existing product', async ({ page }) => {
        // Click on first product edit button
        await page.click('[data-testid="product-card"]:first-child [data-testid="edit-product"]');

        // Update product name
        await page.fill('input[name="name"]', 'Updated Product Name');

        // Submit form
        await page.click('button[type="submit"]');

        // Verify product was updated
        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
        await expect(page.locator('[data-testid="toast-success"]')).toContainText('Product updated successfully');
    });

    test('should delete product', async ({ page }) => {
        // Click on first product delete button
        await page.click('[data-testid="product-card"]:first-child [data-testid="delete-product"]');

        // Confirm deletion
        await page.click('[data-testid="confirm-delete"]');

        // Verify product was deleted
        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
        await expect(page.locator('[data-testid="toast-success"]')).toContainText('Product deleted successfully');
    });

    test('should filter products by search', async ({ page }) => {
        // Type in search box
        await page.fill('[data-testid="search-input"]', 'laptop');

        // Wait for search results
        await page.waitForTimeout(500);

        // Verify filtered results
        const productCards = page.locator('[data-testid="product-card"]');
        await expect(productCards).toHaveCount(1);
        await expect(productCards.first()).toContainText('laptop');
    });

    test('should switch between grid and list view', async ({ page }) => {
        // Verify default grid view
        await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();

        // Switch to list view
        await page.click('[data-testid="list-view-button"]');
        await expect(page.locator('[data-testid="products-list"]')).toBeVisible();

        // Switch back to grid view
        await page.click('[data-testid="grid-view-button"]');
        await expect(page.locator('[data-testid="products-grid"]')).toBeVisible();
    });
});

test.describe('HyperSense Categories Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login and navigate to categories
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
        await page.click('[data-testid="nav-categories"]');
        await expect(page).toHaveURL(/.*categories/);
    });

    test('should display categories list', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Categories');
        await expect(page.locator('[data-testid="categories-grid"]')).toBeVisible();
        await expect(page.locator('[data-testid="add-category-button"]')).toBeVisible();
    });

    test('should create new category', async ({ page }) => {
        // Click add category button
        await page.click('[data-testid="add-category-button"]');

        // Fill category form
        await page.fill('input[name="name"]', 'E2E Test Category');
        await page.fill('textarea[name="description"]', 'Category created by E2E test');

        // Submit form
        await page.click('button[type="submit"]');

        // Verify category was created
        await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    });
});

test.describe('HyperSense Navigation', () => {
    test.beforeEach(async ({ page }) => {
        // Login
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');
    });

    test('should navigate between pages', async ({ page }) => {
        // Test navigation to different pages
        await page.click('[data-testid="nav-categories"]');
        await expect(page).toHaveURL(/.*categories/);

        await page.click('[data-testid="nav-customers"]');
        await expect(page).toHaveURL(/.*customers/);

        await page.click('[data-testid="nav-invoices"]');
        await expect(page).toHaveURL(/.*invoices/);

        await page.click('[data-testid="nav-help"]');
        await expect(page).toHaveURL(/.*help/);

        await page.click('[data-testid="nav-settings"]');
        await expect(page).toHaveURL(/.*settings/);
    });

    test('should toggle theme', async ({ page }) => {
        // Click theme toggle
        await page.click('[data-testid="theme-toggle"]');

        // Verify dark theme is applied
        await expect(page.locator('html')).toHaveClass(/dark/);

        // Toggle back to light theme
        await page.click('[data-testid="theme-toggle"]');

        // Verify light theme is applied
        await expect(page.locator('html')).not.toHaveClass(/dark/);
    });
});

test.describe('HyperSense Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        // Login
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Verify mobile navigation
        await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

        // Open mobile menu
        await page.click('[data-testid="mobile-menu-button"]');
        await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

        // Navigate to categories
        await page.click('[data-testid="mobile-nav-categories"]');
        await expect(page).toHaveURL(/.*categories/);
    });

    test('should work on tablet devices', async ({ page }) => {
        // Set tablet viewport
        await page.setViewportSize({ width: 768, height: 1024 });

        // Login
        await page.goto('/');
        await page.fill('input[type="email"]', 'admin@hypesoft.com');
        await page.fill('input[type="password"]', 'admin123');
        await page.click('button[type="submit"]');

        // Verify responsive grid
        const productCards = page.locator('[data-testid="product-card"]');
        await expect(productCards.first()).toBeVisible();
    });
});
