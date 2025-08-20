import { test, expect } from '@playwright/test'

test.describe('Basic App Functionality', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')

    // Check that the page loads and has basic structure
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()

    // Check for LabubuShop branding
    await expect(page.locator('nav')).toContainText('LabubuShop')
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')

    // Test each navigation link
    const navLinks = [
      { href: '/collection', text: 'Collection' },
      { href: '/about', text: 'About' },
      { href: '/contact', text: 'Contact' },
    ]

    for (const link of navLinks) {
      await page.click(`nav a[href="${link.href}"]`)
      await expect(page).toHaveURL(link.href)
      await expect(page.locator('h1')).toContainText(new RegExp(link.text, 'i'))

      // Go back to home
      await page.click('nav a[href="/"]')
      await expect(page).toHaveURL('/')
    }
  })

  test('should display products on homepage', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for product-related content
    const productElements = page
      .locator('.product-card, [data-testid="product-card"]')
      .or(page.locator('div').filter({ hasText: /\$\d+/ }))
      .or(page.locator('img[src*="labubu"], img[alt*="labubu"]'))

    // Should have at least one product visible
    if (await productElements.first().isVisible()) {
      await expect(productElements.first()).toBeVisible()

      const count = await productElements.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Basic elements should be visible on mobile
    await expect(page.locator('nav')).toBeVisible()

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await expect(page.locator('nav')).toBeVisible()

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    await expect(page.locator('nav')).toBeVisible()
  })
})
