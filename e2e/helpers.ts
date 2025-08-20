import { Page, expect } from '@playwright/test'

/**
 * Common test utilities for the Labubu shop application
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a page and wait for it to load
   */
  async navigateAndWait(url: string) {
    await this.page.goto(url)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Find product cards using multiple selectors
   */
  getProductCards() {
    return this.page.locator('.product-card')
  }

  /**
   * Check if basic page structure is loaded
   */
  async checkBasicPageStructure() {
    await expect(this.page.locator('nav')).toBeVisible()
    await expect(this.page.locator('main')).toBeVisible()
  }

  /**
   * Wait for products to load on a page
   */
  async waitForProducts() {
    await this.page.waitForLoadState('networkidle')
    const products = this.getProductCards()

    // Wait for at least one product to be visible, but don't fail if none exist
    try {
      await expect(products.first()).toBeVisible({ timeout: 3000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Check navigation menu items
   */
  async checkNavigationItems() {
    const navItems = ['Home', 'Collection', 'About', 'Contact']

    for (const item of navItems) {
      await expect(this.page.locator('nav').getByRole('link', { name: item })).toBeVisible()
    }
  }

  /**
   * Test responsive behavior at different viewports
   */
  async testResponsiveViewports() {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1920, height: 1080, name: 'desktop' },
    ]

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height })
      await this.checkBasicPageStructure()
    }
  }

  /**
   * Check for JavaScript errors on the page
   */
  async checkForJavaScriptErrors(): Promise<string[]> {
    const errors: string[] = []

    this.page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    return errors
  }

  /**
   * Filter out non-critical errors
   */
  filterCriticalErrors(errors: string[]): string[] {
    return errors.filter(
      (error) =>
        !error.includes('favicon') &&
        !error.includes('404') &&
        !error.includes('net::ERR_FAILED') &&
        !error.includes('Non-Error promise rejection') &&
        !error.includes('ChunkLoadError'),
    )
  }

  /**
   * Find and interact with filters on collection page
   */
  async findCategoryFilters() {
    return this.page
      .locator('.category, .filter')
      .or(this.page.locator('button').filter({ hasText: /all products|classic|limited|new|sale/i }))
      .or(this.page.locator('div').filter({ hasText: /all products|classic|limited/i }))
  }

  /**
   * Find search input field
   */
  getSearchInput() {
    return this.page
      .locator('input[type="search"]')
      .or(this.page.locator('input[placeholder*="search"]'))
      .or(this.page.locator('.search input'))
  }

  /**
   * Find sort dropdown
   */
  getSortDropdown() {
    return this.page
      .locator('select')
      .or(this.page.locator('button').filter({ hasText: /sort|popular|newest|price/i }))
      .or(this.page.locator('.sort, [data-testid="sort"]'))
  }

  /**
   * Check if an element exists without throwing an error
   */
  async elementExists(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible({ timeout: 1000 })
    } catch {
      return false
    }
  }

  /**
   * Safe click that only clicks if element is visible
   */
  async safeClick(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector).first()
      if (await element.isVisible({ timeout: 1000 })) {
        await element.click()
        return true
      }
      return false
    } catch {
      return false
    }
  }
}

/**
 * Page Object Model for common page actions
 */
export class PageObjects {
  constructor(private page: Page) {}

  async navigateToCollection() {
    const collectionLink = this.page.locator('nav a[href="/collection"]')
    await expect(collectionLink).toBeVisible({ timeout: 10000 })
    await collectionLink.click()
    await expect(this.page).toHaveURL('/collection')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToAbout() {
    const aboutLink = this.page.locator('nav').getByRole('link', { name: 'About' })
    await expect(aboutLink).toBeVisible({ timeout: 10000 })
    await aboutLink.click()
    await expect(this.page).toHaveURL('/about')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToContact() {
    const contactLink = this.page.locator('nav').getByRole('link', { name: 'Contact' })
    await expect(contactLink).toBeVisible({ timeout: 10000 })
    await contactLink.click()
    await expect(this.page).toHaveURL('/contact')
    await this.page.waitForLoadState('networkidle')
  }

  async navigateToHome() {
    const homeLink = this.page.locator('nav').getByRole('link', { name: 'Home' })
    await expect(homeLink).toBeVisible({ timeout: 10000 })
    await homeLink.click()
    await expect(this.page).toHaveURL('/')
    await this.page.waitForLoadState('networkidle')
  }
}
