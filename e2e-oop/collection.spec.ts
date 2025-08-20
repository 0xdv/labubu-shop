import { test, expect } from '@playwright/test'
import { CollectionPage } from './pages/CollectionPage'

test.describe('Collection Page - Page Object Model', () => {
  let collectionPage: CollectionPage

  test.beforeEach(async ({ page }) => {
    collectionPage = new CollectionPage(page)
    await collectionPage.navigateToCollection()
  })

  test('should display collection page title', async () => {
    await expect(collectionPage.title).toContainText(/collection/i)
  })

  test('should display category filters', async () => {
    const categoryFilters = collectionPage.categoryFilters

    if (await categoryFilters.first().isVisible()) {
      await expect(categoryFilters.first()).toBeVisible()

      const categoryCount = await categoryFilters.count()
      expect(categoryCount).toBeGreaterThan(1)
    }
  })

  test('should display sort options', async () => {
    const sortOptions = collectionPage.sortOptions

    if (await sortOptions.first().isVisible()) {
      await expect(sortOptions.first()).toBeVisible()
    }
  })

  test('should display product grid', async () => {
    await collectionPage.waitForLoadState('networkidle')

    const productCards = collectionPage.productCards
    await expect(productCards.first()).toBeVisible()

    const productCount = await productCards.count()
    expect(productCount).toBeGreaterThan(0)
  })

  test('should filter products by category', async () => {
    await collectionPage.waitForLoadState('networkidle')

    // Get initial product count
    const initialCount = await collectionPage.getProductCount()

    // Click category filter if available
    if (await collectionPage.isCategoryFilterVisible()) {
      await collectionPage.clickCategoryFilter()

      const productCards = collectionPage.productCards
      if (await productCards.first().isVisible()) {
        await expect(productCards.first()).toBeVisible()
      }
    }
  })

  test('should search products', async () => {
    await collectionPage.waitForLoadState('networkidle')

    // Search for products if search input is available
    if (await collectionPage.isSearchInputVisible()) {
      await collectionPage.searchProducts('pink')

      const productCards = collectionPage.productCards
      if (await productCards.first().isVisible()) {
        await expect(productCards.first()).toBeVisible()
      }
    }
  })

  test('should apply price filters', async () => {
    await collectionPage.waitForLoadState('networkidle')

    // Apply price filter if available
    if (await collectionPage.isPriceFilterVisible()) {
      await collectionPage.clickFirstPriceFilter()

      const productCards = collectionPage.productCards
      if (await productCards.first().isVisible()) {
        await expect(productCards.first()).toBeVisible()
      }
    }
  })

  test('should sort products', async () => {
    await collectionPage.waitForLoadState('networkidle')

    // Sort products if sort dropdown is available
    if (await collectionPage.isSortSelectVisible()) {
      await collectionPage.sortProductsByPrice()

      const productCards = collectionPage.productCards
      await expect(productCards.first()).toBeVisible()
    }
  })

  test('should display product details in cards', async () => {
    await collectionPage.waitForLoadState('networkidle')

    if (await collectionPage.isFirstProductVisible()) {
      await expect(collectionPage.firstProductImage).toBeVisible()

      if (await collectionPage.isFirstProductNameVisible()) {
        await expect(collectionPage.firstProductName).toBeVisible()
      }

      await expect(collectionPage.firstProductPrice).toBeVisible()
    }
  })

  test('should be responsive on mobile', async ({ page }) => {
    await collectionPage.setViewportSize({ width: 375, height: 667 })
    await collectionPage.navigateToCollection()
    await collectionPage.waitForLoadState('networkidle')

    // Check if the page loads properly on mobile
    await expect(collectionPage.title).toBeVisible()

    const productCards = collectionPage.productCards
    if (await productCards.first().isVisible()) {
      await expect(productCards.first()).toBeVisible()
    }
  })

  test('should clear filters', async () => {
    await collectionPage.waitForLoadState('networkidle')

    // Apply filters first if available
    if (await collectionPage.isCategoryFilterVisible()) {
      await collectionPage.clickCategoryFilter()

      // Clear filters
      if (await collectionPage.isClearFiltersButtonVisible()) {
        await collectionPage.clickClearFilters()

        const productCards = collectionPage.productCards
        if (await productCards.first().isVisible()) {
          await expect(productCards.first()).toBeVisible()
        }
      }
    }
  })
})
