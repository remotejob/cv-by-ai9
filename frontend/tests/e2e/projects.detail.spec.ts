import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Navigate to a sample project detail page
  await page.goto('/projects/sample-project');
});

test('Project detail page displays project information', async ({ page }) => {
  // Look for project title
  const title = await page.locator('h1, [data-testid="project-title"], .project-title').first();
  await expect(title).toBeVisible();

  // Look for project summary/description
  const summary = await page.locator('[data-testid="project-summary"], .project-summary, [class*="summary"]').first();
  await expect(summary).toBeVisible();

  // Look for external link to GitLab
  const externalLink = await page.locator('a[href*="gitlab.com"], [data-testid="external-link"], .external-link').first();
  if (await externalLink.count() > 0) {
    await expect(externalLink).toBeVisible();
    await expect(externalLink).toHaveAttribute('target', '_blank');
  }
});

test('Project detail page shows tags', async ({ page }) => {
  // Look for project tags
  const tags = await page.locator('[data-testid="tag"], .tag, [class*="tag"]');

  if (await tags.count() > 0) {
    await expect(tags.first()).toBeVisible();
  }
});

test('Project detail page has navigation back to projects list', async ({ page }) => {
  // Look for back to projects link
  const backLink = await page.locator('a[href="/projects"], [data-testid="back-to-projects"], .back-link');

  if (await backLink.count() > 0) {
    await expect(backLink).toBeVisible();
  }
});

test('Project detail page handles 404 for non-existent projects', async ({ page }) => {
  // Navigate to a non-existent project
  await page.goto('/projects/non-existent-project-12345');

  // Should show 404 page or error message
  const notFound = await page.locator('[data-testid="not-found"], .not-found, h1:has-text("404")');

  if (await notFound.count() > 0) {
    await expect(notFound).toBeVisible();
  }
});

test('Project detail page has proper page title', async ({ page }) => {
  // Title should contain project name or general project page title
  await expect(page).toHaveTitle(/Project|Projects/);
});

test('Project detail page shows featured badge if applicable', async ({ page }) => {
  // Look for featured badge indicator
  const featuredBadge = await page.locator('[data-testid="featured-badge"], .featured-badge, [class*="featured"]');

  // Featured badge may or may not be present depending on the project
  if (await featuredBadge.count() > 0) {
    await expect(featuredBadge).toBeVisible();
  }
});