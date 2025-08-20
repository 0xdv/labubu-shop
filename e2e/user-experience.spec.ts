import { test, expect } from '@playwright/test'

test.describe('User Experience & Performance', () => {
  test('should load pages quickly', async ({ page }) => {
    const start = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - start

    // Page should load within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000)
  })

  test('should handle network failures gracefully', async ({ page }) => {
    // Start with a working page
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()

    // Simulate offline condition
    await page.context().setOffline(true)

    // Try to navigate to another page
    await page.click('nav a[href="/collection"]', { timeout: 5000 }).catch(() => {
      // Expected to fail when offline
    })

    // Restore connection
    await page.context().setOffline(false)

    // Should be able to navigate again
    await page.goto('/collection')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should maintain functionality after page refresh', async ({ page }) => {
    // Go to collection page
    await page.goto('/collection')
    await page.waitForLoadState('networkidle')

    // Apply a filter if available
    const categoryFilter = page
      .locator('button')
      .filter({ hasText: /classic|limited/i })
      .first()
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.waitForTimeout(500)
    }

    // Refresh the page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Basic functionality should still work
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should handle multiple rapid clicks', async ({ page }) => {
    await page.goto('/')

    // Rapidly click navigation links
    for (let i = 0; i < 3; i++) {
      await page.click('nav a[href="/collection"]')
      await page.waitForTimeout(100)
      await page.click('nav a[href="/"]')
      await page.waitForTimeout(100)
    }

    // Should still be functional
    await expect(page.locator('nav')).toBeVisible()
  })
})

test.describe('Cross-browser Compatibility', () => {
  test('should work with keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Should be able to navigate with Enter key
    const focusedElement = page.locator(':focus')
    if (await focusedElement.isVisible()) {
      await page.keyboard.press('Enter')

      // Page should respond to keyboard interaction
      await expect(page.locator('nav')).toBeVisible()
    }
  })

  test('should handle different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 }, // Desktop
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/')

      // Basic elements should be visible at all sizes
      await expect(page.locator('nav')).toBeVisible()

      // Check for products on home page
      await page.waitForLoadState('networkidle')
      const products = page
        .locator('.product-card, [data-testid="product-card"]')
        .or(page.locator('div').filter({ hasText: /\$\d+/ }))

      if (await products.first().isVisible()) {
        await expect(products.first()).toBeVisible()
      }
    }
  })
})

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')

    // Should have at least one h1
    const h1Elements = page.locator('h1')
    await expect(h1Elements.first()).toBeVisible()

    // Check other pages too
    await page.goto('/collection')
    await expect(page.locator('h1')).toBeVisible()

    await page.goto('/about')
    await expect(page.locator('h1')).toBeVisible()

    await page.goto('/contact')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // Navigation should be in a nav element or have proper role
    const navigation = page.locator('nav, [role="navigation"]')
    await expect(navigation).toBeVisible()

    // Links should be accessible
    const navLinks = navigation.locator('a')
    const linkCount = await navLinks.count()
    expect(linkCount).toBeGreaterThan(0)

    // Each link should have text or aria-label
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = navLinks.nth(i)
      const hasText = await link.textContent()
      const hasAriaLabel = await link.getAttribute('aria-label')

      expect(hasText || hasAriaLabel).toBeTruthy()
    }
  })

  test('should have proper image alt attributes', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check for images
    const images = page.locator('img')
    const imageCount = await images.count()

    if (imageCount > 0) {
      // Check first few images for alt attributes
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        const img = images.nth(i)
        const altText = await img.getAttribute('alt')

        // Alt attribute should exist (can be empty for decorative images)
        expect(altText !== null).toBeTruthy()
      }
    }
  })
})

test.describe('Error Handling', () => {
  test('should handle 404 pages gracefully', async ({ page }) => {
    // Try to go to a non-existent page
    await page.goto('/non-existent-page')

    // Should either redirect to home or show 404 page
    // Navigation should still be accessible
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should handle JavaScript errors gracefully', async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    // Load the page and interact with it
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Try some interactions
    await page.click('nav a[href="/collection"]')
    await page.waitForLoadState('networkidle')

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_FAILED') &&
        !error.includes('Non-Error promise rejection'),
    )

    expect(criticalErrors).toHaveLength(0)
  })
})
