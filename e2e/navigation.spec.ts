import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display main navigation elements', async ({ page }) => {
    // Check if logo is present
    await expect(page.locator('nav').getByText('LabubuShop')).toBeVisible()

    // Check if navigation links are present
    await expect(page.locator('nav').getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.locator('nav').getByRole('link', { name: 'Collection' })).toBeVisible()
    await expect(page.locator('nav').getByRole('link', { name: 'About' })).toBeVisible()
    await expect(page.locator('nav').getByRole('link', { name: 'Contact' })).toBeVisible()
  })

  test('should navigate to collection page', async ({ page }) => {
    await page.click('nav a[href="/collection"]')
    await expect(page).toHaveURL('/collection')
    await expect(page.locator('h1')).toContainText('Collection')
  })

  test('should navigate to about page', async ({ page }) => {
    await page.click('nav a[href="/about"]')
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toContainText('About')
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.click('nav a[href="/contact"]')
    await expect(page).toHaveURL('/contact')
    await expect(page.locator('h1')).toContainText('Contact')
  })

  test('should navigate back to home from logo', async ({ page }) => {
    // Go to collection first
    await page.click('nav a[href="/collection"]')
    await expect(page).toHaveURL('/collection')

    // Click logo to go back home
    await page.click('nav a[href="/"]')
    await expect(page).toHaveURL('/')
  })

  test('should work on mobile breakpoint', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check if mobile menu button is visible
    const menuButton = page
      .locator('button')
      .filter({ hasText: /menu/i })
      .or(page.locator('button[aria-label*="menu"]'))
      .or(page.locator('nav button').first())

    // Try to find and click the mobile menu if it exists
    if (await menuButton.isVisible()) {
      await menuButton.click()

      // Check if navigation links become visible after menu click
      await expect(page.locator('nav').getByRole('link', { name: 'Collection' })).toBeVisible()
    }
  })
})
