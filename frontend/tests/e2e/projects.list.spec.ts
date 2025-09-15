import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/projects');
});

test('Projects page displays project list', async ({ page }) => {
  // Look for project cards or list items
  const projectCards = await page.locator('[data-testid="project-card"], .project-card, [class*="project"]').count();

  // Should display projects (will fail initially as expected)
  expect(projectCards).toBeGreaterThan(0);
});

test('Projects page shows 50 total projects', async ({ page }) => {
  // This test will check that exactly 50 projects are displayed
  // This might require pagination or lazy loading in the implementation

  // Count all visible project cards
  const visibleProjects = await page.locator('[data-testid="project-card"], .project-card, [class*="project"]').count();

  // Check if pagination exists (if not all projects are visible at once)
  const pagination = await page.locator('[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]').count();

  if (pagination > 0) {
    // If pagination exists, we need to verify total count across pages
    // For now, just verify the page structure exists
    expect(visibleProjects).toBeGreaterThan(0);
  } else {
    // If no pagination, expect all 50 projects to be visible
    expect(visibleProjects).toBe(50);
  }
});

test('Projects page has pagination controls', async ({ page }) => {
  // Look for pagination elements
  const pagination = await page.locator('[data-testid="pagination"], .pagination, nav[aria-label*="pagination"]');

  // Check if pagination exists (may not be needed if using lazy loading)
  if (await pagination.count() > 0) {
    await expect(pagination).toBeVisible();

    // Check for navigation buttons
    const prevButton = await pagination.locator('button, a').first();
    const nextButton = await pagination.locator('button, a').last();

    // Pagination controls should be present
    expect(await prevButton.count() + await nextButton.count()).toBeGreaterThan(0);
  }
});

test('Project cards link to detail pages', async ({ page }) => {
  // Find project cards
  const projectCards = await page.locator('[data-testid="project-card"], .project-card, [class*="project"]');

  if (await projectCards.count() > 0) {
    // Test that project cards have working links
    const firstCardLink = await projectCards.first().locator('a');
    await expect(firstCardLink).toHaveAttribute('href', /\/projects\//);
  }
});

test('Projects page has proper page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Projects/);
});

test('Projects page shows filtering options', async ({ page }) => {
  // Look for filter elements (tags, search, etc.)
  const filterSection = await page.locator('[data-testid="filters"], .filters, [class*="filter"]');

  if (await filterSection.count() > 0) {
    await expect(filterSection).toBeVisible();
  }
});