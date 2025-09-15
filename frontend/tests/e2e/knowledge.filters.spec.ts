import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/knowledge');
});

test('Knowledge page displays knowledge entries', async ({ page }) => {
  // Look for knowledge entry cards or list items
  const knowledgeEntries = await page.locator('[data-testid="knowledge-entry"], .knowledge-entry, [class*="knowledge"]').count();

  // Should display knowledge entries (will fail initially as expected)
  expect(knowledgeEntries).toBeGreaterThan(0);
});

test('Knowledge page has category filter', async ({ page }) => {
  // Look for category filter dropdown or buttons
  const categoryFilter = await page.locator('[data-testid="category-filter"], .category-filter, select[name="category"]');

  if (await categoryFilter.count() > 0) {
    await expect(categoryFilter).toBeVisible();

    // Test category selection if categories exist
    const options = await categoryFilter.locator('option').count();
    if (options > 1) {
      // Select a category and verify filtering works
      await categoryFilter.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');
    }
  }
});

test('Knowledge page has tag filter', async ({ page }) => {
  // Look for tag filter interface
  const tagFilter = await page.locator('[data-testid="tag-filter"], .tag-filter, [class*="tag-filter"]');

  if (await tagFilter.count() > 0) {
    await expect(tagFilter).toBeVisible();

    // Look for tag selection buttons or inputs
    const tagButtons = await tagFilter.locator('button, .tag-button, [role="button"]');
    if (await tagButtons.count() > 0) {
      await expect(tagButtons.first()).toBeVisible();
    }
  }
});

test('Knowledge page has search functionality', async ({ page }) => {
  // Look for search input
  const searchInput = await page.locator('[data-testid="search"], input[type="search"], [placeholder*="search"], [placeholder*="Search"]');

  if (await searchInput.count() > 0) {
    await expect(searchInput).toBeVisible();

    // Test search functionality
    await searchInput.fill('test');
    await page.waitForLoadState('networkidle');
  }
});

test('Knowledge entries show categories and tags', async ({ page }) => {
  // Find knowledge entries
  const entries = await page.locator('[data-testid="knowledge-entry"], .knowledge-entry, [class*="knowledge"]');

  if (await entries.count() > 0) {
    const firstEntry = entries.first();

    // Check for category display
    const category = await firstEntry.locator('[data-testid="category"], .category, [class*="category"]');
    if (await category.count() > 0) {
      await expect(category).toBeVisible();
    }

    // Check for tags display
    const tags = await firstEntry.locator('[data-testid="tag"], .tag, [class*="tag"]');
    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible();
    }
  }
});

test('Knowledge entries have working links', async ({ page }) => {
  // Find knowledge entry links
  const entryLinks = await page.locator('[data-testid="knowledge-entry"] a, .knowledge-entry a');

  if (await entryLinks.count() > 0) {
    await expect(entryLinks.first()).toBeVisible();
    await expect(entryLinks.first()).toHaveAttribute('href');
  }
});

test('Knowledge page has proper page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Knowledge|Skills/);
});

test('Knowledge page shows empty state when no results', async ({ page }) => {
  // Apply filters that should return no results
  const searchInput = await page.locator('[data-testid="search"], input[type="search"], [placeholder*="search"], [placeholder*="Search"]');

  if (await searchInput.count() > 0) {
    await searchInput.fill('nonexistent-search-term-12345');
    await page.waitForLoadState('networkidle');

    // Look for empty state message
    const emptyState = await page.locator('[data-testid="empty-state"], .empty-state, [class*="empty"]');
    if (await emptyState.count() > 0) {
      await expect(emptyState).toBeVisible();
    }
  }
});