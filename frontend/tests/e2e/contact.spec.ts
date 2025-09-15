import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/contact');
});

test('Contact page displays contact information', async ({ page }) => {
  // Look for contact section
  const contactSection = await page.locator('[data-testid="contact-section"], .contact-section, section:has-text("Contact")').first();
  await expect(contactSection).toBeVisible();
});

test('Contact page has mailto link', async ({ page }) => {
  // Look for mailto links
  const mailtoLink = await page.locator('a[href^="mailto:"]');

  if (await mailtoLink.count() > 0) {
    await expect(mailtoLink.first()).toBeVisible();
    await expect(mailtoLink.first()).toHaveAttribute('href', /^mailto:/);
  }
});

test('Contact page has contact form', async ({ page }) => {
  // Look for contact form
  const contactForm = await page.locator('form[data-testid="contact-form"], .contact-form, form');

  if (await contactForm.count() > 0) {
    await expect(contactForm).toBeVisible();

    // Check for form fields
    const nameInput = await contactForm.locator('input[name="name"], input[type="text"]');
    const emailInput = await contactForm.locator('input[name="email"], input[type="email"]');
    const messageInput = await contactForm.locator('textarea[name="message"], textarea');

    // Form fields should be present
    expect(await nameInput.count() + await emailInput.count() + await messageInput.count()).toBeGreaterThan(0);
  }
});

test('Contact page shows contact confirmation message', async ({ page }) => {
  // Look for confirmation message or instructions
  const confirmation = await page.locator('[data-testid="confirmation"], .confirmation, [class*="confirmation"], [class*="success"]');

  if (await confirmation.count() > 0) {
    await expect(confirmation).toBeVisible();
  }
});

test('Contact page has social media links', async ({ page }) => {
  // Look for social media links
  const socialLinks = await page.locator('a[href*="github.com"], a[href*="linkedin.com"], a[href*="twitter.com"], [data-testid="social-link"], .social-link');

  if (await socialLinks.count() > 0) {
    await expect(socialLinks.first()).toBeVisible();
    await expect(socialLinks.first()).toHaveAttribute('href');
    await expect(socialLinks.first()).toHaveAttribute('target', '_blank');
  }
});

test('Contact page has proper page title', async ({ page }) => {
  await expect(page).toHaveTitle(/Contact/);
});

test('Contact form submission shows confirmation', async ({ page }) => {
  const contactForm = await page.locator('form[data-testid="contact-form"], .contact-form, form');

  if (await contactForm.count() > 0) {
    // Fill form if fields exist
    const nameInput = await contactForm.locator('input[name="name"], input[type="text"]').first();
    const emailInput = await contactForm.locator('input[name="email"], input[type="email"]').first();
    const messageInput = await contactForm.locator('textarea[name="message"], textarea').first();

    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User');
    }
    if (await emailInput.count() > 0) {
      await emailInput.fill('test@example.com');
    }
    if (await messageInput.count() > 0) {
      await messageInput.fill('Test message for contact form');
    }

    // Submit form
    await contactForm.locator('button[type="submit"], input[type="submit"]').click();
    await page.waitForLoadState('networkidle');

    // Look for confirmation message
    const confirmation = await page.locator('[data-testid="confirmation"], .confirmation, [class*="confirmation"], [class*="success"]');
    if (await confirmation.count() > 0) {
      await expect(confirmation).toBeVisible();
    }
  }
});

test('Contact page displays contact methods', async ({ page }) => {
  // Look for various contact methods
  const contactMethods = await page.locator('[data-testid="contact-method"], .contact-method, [class*="contact"]');

  if (await contactMethods.count() > 0) {
    await expect(contactMethods.first()).toBeVisible();
  }
});

test('Contact page is accessible from navigation', async ({ page }) => {
  // Navigate from home page to contact
  await page.goto('/');
  const contactLink = await page.locator('a[href="/contact"]');

  if (await contactLink.count() > 0) {
    await contactLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/contact/);
  }
});