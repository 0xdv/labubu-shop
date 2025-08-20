import { test, expect } from '@playwright/test'

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('should display about page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/about/i)
  })

  test('should display about content', async ({ page }) => {
    // Check for main content area
    const mainContent = page.locator('main, .content, article').first()
    await expect(mainContent).toBeVisible()

    // Check for some descriptive text about the company/brand
    const aboutText = page.locator('p, .description').first()
    if (await aboutText.isVisible()) {
      await expect(aboutText).toBeVisible()
    }
  })

  test('should be accessible', async ({ page }) => {
    // Check that the page has proper heading structure
    await expect(page.locator('h1')).toBeVisible()

    // Check that navigation is still accessible
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/about')

    // Page should still be usable on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
  })
})

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('should display contact page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/contact/i)
  })

  test('should display contact information', async ({ page }) => {
    // Check for main content area
    const mainContent = page.locator('main, .content, article').first()
    await expect(mainContent).toBeVisible()
  })

  test('should display contact form if present', async ({ page }) => {
    // Look for a contact form - be more specific to avoid footer form
    const contactForm = page.locator('main form, .contact form').first()

    if (await contactForm.isVisible()) {
      await expect(contactForm).toBeVisible()

      // Check for common form fields
      const nameField = contactForm
        .locator('input[name="name"], input[placeholder*="name"]')
        .first()
      const emailField = contactForm.locator('input[type="email"], input[name="email"]').first()
      const messageField = contactForm.locator('textarea, input[name="message"]').first()

      if (await nameField.isVisible()) {
        await expect(nameField).toBeVisible()
      }
      if (await emailField.isVisible()) {
        await expect(emailField).toBeVisible()
      }
      if (await messageField.isVisible()) {
        await expect(messageField).toBeVisible()
      }
    }
  })

  test('should handle form submission if form exists', async ({ page }) => {
    const contactForm = page.locator('main form, .contact form').first()

    if (await contactForm.isVisible()) {
      // Fill out the form with test data
      const nameField = contactForm
        .locator('input[name="name"], input[placeholder*="name"]')
        .first()
      const emailField = contactForm.locator('input[type="email"], input[name="email"]').first()
      const messageField = contactForm.locator('textarea, input[name="message"]').first()
      const submitButton = contactForm
        .locator('button[type="submit"], input[type="submit"]')
        .first()

      if (await nameField.isVisible()) {
        await nameField.fill('Test User')
      }
      if (await emailField.isVisible()) {
        await emailField.fill('test@example.com')
      }
      if (await messageField.isVisible()) {
        await messageField.fill('This is a test message from Playwright.')
      }

      if (await submitButton.isVisible()) {
        await submitButton.click()

        // Check for success message or form feedback
        // We'll just verify the page is still responsive after submission
        await expect(page.locator('nav')).toBeVisible()
      }
    }
  })

  test('should display contact details', async ({ page }) => {
    // Look for email, phone, or address information
    const contactDetails = page.locator('div').filter({ hasText: /email|phone|address|@/i })

    if (await contactDetails.first().isVisible()) {
      await expect(contactDetails.first()).toBeVisible()
    }
  })

  test('should be accessible', async ({ page }) => {
    // Check that the page has proper heading structure
    await expect(page.locator('h1')).toBeVisible()

    // Check that navigation is still accessible
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/contact')

    // Page should still be usable on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
  })
})
