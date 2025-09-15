import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Home page displays exactly 3 featured projects', async ({ page }) => {
  // Find all project cards or featured project elements
  const featuredProjects = await page.locator('[data-testid="featured-project"], .featured-project, [class*="featured"]').count();

  // If no featured projects are found yet, this test should fail (as expected before implementation)
  // After implementation, we expect exactly 3 featured projects
  expect(featuredProjects).toBe(3);
});

test('Home page displays navigation links', async ({ page }) => {
  // Check that navigation exists
  const nav = await page.locator('nav').first();
  await expect(nav).toBeVisible();

  // Check for expected navigation links
  const aboutLink = await page.locator('a[href="/"]');
  const knowledgeLink = await page.locator('a[href="/knowledge"]');
  const projectsLink = await page.locator('a[href="/projects"]');

  await expect(aboutLink).toBeVisible();
  await expect(knowledgeLink).toBeVisible();
  await expect(projectsLink).toBeVisible();
});

test('Home page has proper page title', async ({ page }) => {
  await expect(page).toHaveTitle(/DevOps Portfolio/);
});

test('Home page shows hero section', async ({ page }) => {
  // Look for hero content
  const heroSection = await page.locator('[class*="hero"], section, main').first();
  await expect(heroSection).toBeVisible();
});

test('Featured projects link to project detail pages', async ({ page }) => {
  // Find featured project links
  const featuredLinks = await page.locator('[data-testid="featured-project"] a, .featured-project a');

  if (await featuredLinks.count() > 0) {
    // Test that featured projects have working links
    await expect(featuredLinks.first()).toHaveAttribute('href', /\/projects\//);
  }
});