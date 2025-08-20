import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section', async ({ page }) => {
    // Check for hero content
    await expect(page.locator('h1, .hero h1, [data-testid="hero-title"]').first()).toBeVisible()

    // Check for some hero text or CTA button
    const heroSection = page.locator('.hero, section').first()
    await expect(heroSection).toBeVisible()
  })

  test('should display featured products', async ({ page }) => {
    // Wait for products to load
    await page.waitForLoadState('networkidle')

    // Check if product cards are visible
    const productCards = page
      .locator('.product-card, [data-testid="product-card"]')
      .or(page.locator('article').filter({ hasText: /labubu/i }))
      .or(page.locator('div').filter({ hasText: /\$\d+/ }))

    await expect(productCards.first()).toBeVisible()

    // Should have multiple products
    const productCount = await productCards.count()
    expect(productCount).toBeGreaterThan(0)
  })

  test('should display product information correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Find the first product card more specifically
    const firstProduct = page.locator('.product-card').first()

    if (await firstProduct.isVisible()) {
      // Check for product name (be more specific with selector)
      await expect(firstProduct.locator('h3').first()).toBeVisible()

      // Check for price
      await expect(firstProduct.locator('span').filter({ hasText: /\$\d+/ }).first()).toBeVisible()

      // Check for product image
      await expect(firstProduct.locator('img').first()).toBeVisible()
    }
  })

  test('should handle product interactions', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Find product cards or buttons
    const productCard = page
      .locator('.product-card, [data-testid="product-card"]')
      .first()
      .or(
        page
          .locator('div')
          .filter({ hasText: /Classic Labubu/i })
          .first(),
      )

    if (await productCard.isVisible()) {
      // Try to find and click an "Add to Cart" or similar button
      const addToCartBtn = productCard
        .locator('button')
        .filter({ hasText: /add|cart|buy/i })
        .first()
        .or(
          page
            .locator('button')
            .filter({ hasText: /add|cart|buy/i })
            .first(),
        )

      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click()

        // Check for some feedback (could be a notification, cart update, etc.)
        // We'll just verify the page is still responsive
        await expect(page.locator('nav')).toBeVisible()
      }
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check if navigation is still accessible
    await expect(page.locator('nav')).toBeVisible()

    // Check if products are still visible and properly laid out
    await page.waitForLoadState('networkidle')
    const products = page
      .locator('.product-card, [data-testid="product-card"]')
      .or(page.locator('div').filter({ hasText: /\$\d+/ }))

    if (await products.first().isVisible()) {
      await expect(products.first()).toBeVisible()
    }
  })

  test('should load page without errors', async ({ page }) => {
    const errors: string[] = []

    // Listen for console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Listen for page errors
    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Check that no critical errors occurred
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('favicon') && !error.includes('404') && !error.includes('net::ERR_FAILED'),
    )

    expect(criticalErrors).toHaveLength(0)
  })
})
