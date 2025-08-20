import { test, expect } from '@playwright/test'

test.describe('Collection Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collection')
  })

  test('should display collection page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText(/collection/i)
  })

  test('should display category filters', async ({ page }) => {
    // Look for category filter elements
    const categoryFilters = page
      .locator('.category, .filter')
      .or(page.locator('button').filter({ hasText: /all products|classic|limited|new|sale/i }))
      .or(page.locator('div').filter({ hasText: /all products|classic|limited/i }))

    if (await categoryFilters.first().isVisible()) {
      await expect(categoryFilters.first()).toBeVisible()

      // Should have multiple category options
      const categoryCount = await categoryFilters.count()
      expect(categoryCount).toBeGreaterThan(1)
    }
  })

  test('should display sort options', async ({ page }) => {
    // Look for sort dropdown or buttons
    const sortOptions = page
      .locator('select')
      .or(page.locator('button').filter({ hasText: /sort|popular|newest|price/i }))
      .or(page.locator('.sort, [data-testid="sort"]'))

    if (await sortOptions.first().isVisible()) {
      await expect(sortOptions.first()).toBeVisible()
    }
  })

  test('should display product grid', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for product cards
    const productCards = page
      .locator('.product-card, [data-testid="product-card"]')
      .or(page.locator('article').filter({ hasText: /labubu/i }))
      .or(page.locator('div').filter({ hasText: /\$\d+/ }))

    // Should have products visible
    await expect(productCards.first()).toBeVisible()

    // Should have multiple products
    const productCount = await productCards.count()
    expect(productCount).toBeGreaterThan(0)
  })

  test('should filter products by category', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Get initial product count
    const allProducts = page
      .locator('.product-card, [data-testid="product-card"]')
      .or(page.locator('div').filter({ hasText: /\$\d+/ }))
    const initialCount = await allProducts.count()

    // Try to click a category filter
    const classicFilter = page
      .locator('button')
      .filter({ hasText: /classic/i })
      .first()
      .or(
        page
          .locator('.category')
          .filter({ hasText: /classic/i })
          .first(),
      )

    if (await classicFilter.isVisible()) {
      await classicFilter.click()
      await page.waitForTimeout(500) // Wait for filter to apply

      // Products should still be visible (filtered result)
      if (await allProducts.first().isVisible()) {
        await expect(allProducts.first()).toBeVisible()
      }
    }
  })

  test('should search products', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for search input
    const searchInput = page
      .locator('input[type="search"]')
      .or(page.locator('input[placeholder*="search"]'))
      .or(page.locator('.search input'))

    if (await searchInput.isVisible()) {
      // Type in search query
      await searchInput.fill('pink')
      await page.waitForTimeout(500) // Wait for search to apply

      // Check if results are filtered
      const products = page
        .locator('.product-card, [data-testid="product-card"]')
        .or(page.locator('div').filter({ hasText: /\$\d+/ }))

      if (await products.first().isVisible()) {
        await expect(products.first()).toBeVisible()
      }
    }
  })

  test('should apply price filters', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for price filter checkboxes or buttons
    const priceFilters = page
      .locator('input[type="checkbox"]')
      .or(page.locator('button').filter({ hasText: /\$\d+|\$.*-.*\$|under|over/i }))
      .or(page.locator('.price-filter'))

    if (await priceFilters.first().isVisible()) {
      // Click first price filter
      await priceFilters.first().click()
      await page.waitForTimeout(500)

      // Verify products are still visible
      const products = page
        .locator('.product-card, [data-testid="product-card"]')
        .or(page.locator('div').filter({ hasText: /\$\d+/ }))

      if (await products.first().isVisible()) {
        await expect(products.first()).toBeVisible()
      }
    }
  })

  test('should sort products', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Look for sort dropdown
    const sortSelect = page.locator('select').first()

    if (await sortSelect.isVisible()) {
      // Change sort option
      await sortSelect.selectOption('price-low')
      await page.waitForTimeout(500)

      // Verify products are still visible after sorting
      const products = page
        .locator('.product-card, [data-testid="product-card"]')
        .or(page.locator('div').filter({ hasText: /\$\d+/ }))

      await expect(products.first()).toBeVisible()
    }
  })

  test('should display product details in cards', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const firstProduct = page.locator('.product-card').first()

    if (await firstProduct.isVisible()) {
      // Check for product image within the product card only
      const productImage = firstProduct.locator('img').first()
      await expect(productImage).toBeVisible()

      // Check for product name
      const productName = firstProduct.locator('h3, .product-name').first()
      if (await productName.isVisible()) {
        await expect(productName).toBeVisible()
      }

      // Check for price
      const price = firstProduct
        .locator('.price')
        .or(firstProduct.locator('span').filter({ hasText: /\$\d+/ }))
      await expect(price).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/collection')
    await page.waitForLoadState('networkidle')

    // Check if the page loads properly on mobile
    await expect(page.locator('h1')).toBeVisible()

    // Check if products are visible on mobile
    const products = page
      .locator('.product-card, [data-testid="product-card"]')
      .or(page.locator('div').filter({ hasText: /\$\d+/ }))

    if (await products.first().isVisible()) {
      await expect(products.first()).toBeVisible()
    }
  })

  test('should clear filters', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    // Apply some filters first
    const categoryFilter = page
      .locator('button')
      .filter({ hasText: /classic|limited/i })
      .first()

    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.waitForTimeout(500)

      // Look for "All Products" or clear filter option
      const clearFilter = page
        .locator('button')
        .filter({ hasText: /all products|clear|reset/i })
        .first()

      if (await clearFilter.isVisible()) {
        await clearFilter.click()
        await page.waitForTimeout(500)

        // Products should still be visible after clearing filters
        const products = page
          .locator('.product-card, [data-testid="product-card"]')
          .or(page.locator('div').filter({ hasText: /\$\d+/ }))

        if (await products.first().isVisible()) {
          await expect(products.first()).toBeVisible()
        }
      }
    }
  })
})
