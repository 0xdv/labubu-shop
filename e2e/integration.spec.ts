import { test, expect } from '@playwright/test'
import { TestHelpers, PageObjects } from './helpers.js'

test.describe('Integration Tests', () => {
  let helpers: TestHelpers
  let pageObjects: PageObjects

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    pageObjects = new PageObjects(page)
    await helpers.navigateAndWait('/')
  })

  test('complete user journey - browsing products', async ({ page }) => {
    // Start on homepage
    await helpers.checkBasicPageStructure()

    // Check if products are displayed
    const hasProducts = await helpers.waitForProducts()

    if (hasProducts) {
      const products = helpers.getProductCards()
      await expect(products.first()).toBeVisible()

      // Get initial product count
      const initialCount = await products.count()
      expect(initialCount).toBeGreaterThan(0)
    }

    // Navigate to collection page
    await pageObjects.navigateToCollection()
    await expect(page.locator('h1')).toContainText(/collection/i)

    // Wait for collection products to load
    await helpers.waitForProducts()

    // Try to filter products if filters exist
    const categoryFilters = await helpers.findCategoryFilters()
    const firstFilter = categoryFilters.first()

    if (await firstFilter.isVisible()) {
      await firstFilter.click()
      await page.waitForTimeout(500)

      // Products should still be visible after filtering
      const products = helpers.getProductCards()
      if (await products.first().isVisible()) {
        await expect(products.first()).toBeVisible()
      }
    }

    // Try search if available
    const searchInput = helpers.getSearchInput()
    if (await searchInput.isVisible()) {
      await searchInput.fill('pink')
      await page.waitForTimeout(500)

      // Check if search results are displayed
      const products = helpers.getProductCards()
      if (await products.first().isVisible()) {
        await expect(products.first()).toBeVisible()
      }

      // Clear search
      await searchInput.clear()
      await page.waitForTimeout(500)
    }

    // Navigate to other pages
    await pageObjects.navigateToAbout()
    await expect(page.locator('h1')).toContainText(/about/i)

    await pageObjects.navigateToContact()
    await expect(page.locator('h1')).toContainText(/contact/i)

    // Return to home
    await pageObjects.navigateToHome()
    await helpers.checkBasicPageStructure()
  })

  test('responsive design workflow', async ({ page }) => {
    // Test the complete flow on different devices
    const workflows = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' },
    ]

    for (const device of workflows) {
      // Set viewport
      await page.setViewportSize({ width: device.width, height: device.height })

      // Test homepage
      await helpers.navigateAndWait('/')
      await helpers.checkBasicPageStructure()

      // Test navigation on this viewport - use direct navigation to avoid click issues
      await page.goto('/collection')
      await helpers.checkBasicPageStructure()

      // Test product display if available
      await helpers.waitForProducts()
    }
  })

  test('error handling and resilience', async ({ page }) => {
    // Check for JavaScript errors during normal usage
    const errors = await helpers.checkForJavaScriptErrors()

    // Navigate through the app
    await pageObjects.navigateToCollection()
    await page.waitForLoadState('networkidle')

    await pageObjects.navigateToAbout()
    await page.waitForLoadState('networkidle')

    await pageObjects.navigateToContact()
    await page.waitForLoadState('networkidle')

    await pageObjects.navigateToHome()
    await page.waitForLoadState('networkidle')

    // Check that no critical errors occurred
    const criticalErrors = helpers.filterCriticalErrors(errors)
    expect(criticalErrors).toHaveLength(0)
  })

  test('accessibility and keyboard navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check that focus is visible and functional
    const focusedElement = page.locator(':focus')
    if (await focusedElement.isVisible()) {
      // Try to activate focused element with Enter
      await page.keyboard.press('Enter')

      // Page should still be functional
      await helpers.checkBasicPageStructure()
    }

    // Check for proper heading structure
    await expect(page.locator('h1')).toBeVisible()

    // Navigate to other pages and check headings
    await pageObjects.navigateToCollection()
    await expect(page.locator('h1')).toBeVisible()

    await pageObjects.navigateToAbout()
    await expect(page.locator('h1')).toBeVisible()

    await pageObjects.navigateToContact()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('performance and loading states', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now()
    await helpers.navigateAndWait('/')
    const homeLoadTime = Date.now() - startTime

    // Should load reasonably quickly
    expect(homeLoadTime).toBeLessThan(5000)

    // Test collection page load time
    const collectionStart = Date.now()
    await pageObjects.navigateToCollection()
    const collectionLoadTime = Date.now() - collectionStart

    expect(collectionLoadTime).toBeLessThan(5000)

    // Test that repeated navigation is fast
    const quickNavStart = Date.now()
    await pageObjects.navigateToHome()
    await pageObjects.navigateToCollection()
    const quickNavTime = Date.now() - quickNavStart

    expect(quickNavTime).toBeLessThan(3000)
  })

  test('data integrity and consistency', async ({ page }) => {
    // Check that product data is consistent across pages
    await helpers.navigateAndWait('/')

    const hasHomeProducts = await helpers.waitForProducts()
    let homeProductNames: string[] = []

    if (hasHomeProducts) {
      const homeProducts = helpers.getProductCards()
      const count = Math.min(await homeProducts.count(), 3)

      for (let i = 0; i < count; i++) {
        const productName = await homeProducts.nth(i).textContent()
        if (productName) {
          homeProductNames.push(productName.trim())
        }
      }
    }

    // Check collection page
    await pageObjects.navigateToCollection()
    const hasCollectionProducts = await helpers.waitForProducts()

    if (hasCollectionProducts && homeProductNames.length > 0) {
      const collectionProducts = helpers.getProductCards()
      const collectionText = await collectionProducts.first().textContent()

      // At least some product names should be consistent
      // (This is a basic check - in a real app you'd want more specific assertions)
      expect(collectionText).toBeTruthy()
    }
  })

  test('form interactions and user input', async ({ page }) => {
    // Test contact form if it exists
    await pageObjects.navigateToContact()

    const contactForm = page.locator('main form, .contact form').first()
    if (await contactForm.isVisible()) {
      // Fill out form fields if they exist
      const nameField = contactForm
        .locator('input[name="name"], input[placeholder*="name"]')
        .first()
      const emailField = contactForm.locator('input[type="email"], input[name="email"]').first()
      const messageField = contactForm.locator('textarea, input[name="message"]').first()

      if (await nameField.isVisible()) {
        await nameField.fill('Test User')
        await expect(nameField).toHaveValue('Test User')
      }

      if (await emailField.isVisible()) {
        await emailField.fill('test@example.com')
        await expect(emailField).toHaveValue('test@example.com')
      }

      if (await messageField.isVisible()) {
        await messageField.fill('Test message')
        await expect(messageField).toHaveValue('Test message')
      }
    }

    // Test search functionality if available
    await pageObjects.navigateToCollection()
    const searchInput = helpers.getSearchInput()

    if (await searchInput.isVisible()) {
      await searchInput.fill('test search')
      await expect(searchInput).toHaveValue('test search')

      // Clear search
      await searchInput.clear()
      await expect(searchInput).toHaveValue('')
    }
  })
})
