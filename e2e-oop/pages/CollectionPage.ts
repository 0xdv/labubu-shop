import { Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class CollectionPage extends BasePage {
  constructor(page: any) {
    super(page)
  }

  // Native getters for page elements
  get title(): Locator {
    return this.page.locator('h1')
  }

  get categoryFilters(): Locator {
    return this.page
      .locator('.category, .filter')
      .or(this.page.locator('button').filter({ hasText: /all products|classic|limited|new|sale/i }))
      .or(this.page.locator('div').filter({ hasText: /all products|classic|limited/i }))
  }

  get sortOptions(): Locator {
    return this.page
      .locator('select')
      .or(this.page.locator('button').filter({ hasText: /sort|popular|newest|price/i }))
      .or(this.page.locator('.sort, [data-testid="sort"]'))
  }

  get productCards(): Locator {
    return this.page
      .locator('.product-card, [data-testid="product-card"]')
      .or(this.page.locator('article').filter({ hasText: /labubu/i }))
      .or(this.page.locator('div').filter({ hasText: /\$\d+/ }))
  }

  get searchInput(): Locator {
    return this.page
      .locator('input[type="search"]')
      .or(this.page.locator('input[placeholder*="search"]'))
      .or(this.page.locator('.search input'))
  }

  get priceFilters(): Locator {
    return this.page
      .locator('input[type="checkbox"]')
      .or(this.page.locator('button').filter({ hasText: /\$\d+|\$.*-.*\$|under|over/i }))
      .or(this.page.locator('.price-filter'))
  }

  get sortSelect(): Locator {
    return this.page.locator('select').first()
  }

  // Navigation methods
  async navigateToCollection(): Promise<void> {
    await this.goto('/collection')
  }

  // Interaction methods
  async getProductCount(): Promise<number> {
    return await this.productCards.count()
  }

  async clickCategoryFilter(filterText: RegExp = /classic/i): Promise<void> {
    const classicFilter = this.categoryFilterButton(filterText)

    if (await classicFilter.isVisible()) {
      await classicFilter.click()
      await this.waitForTimeout(500)
    }
  }

  get categoryFilterButton(): (filterText: RegExp) => Locator {
    return (filterText: RegExp): Locator => {
      return this.page
        .locator('button')
        .filter({ hasText: filterText })
        .first()
        .or(this.page.locator('.category').filter({ hasText: filterText }).first())
    }
  }

  async searchProducts(query: string): Promise<void> {
    if (await this.searchInput.isVisible()) {
      await this.searchInput.fill(query)
      await this.waitForTimeout(500)
    }
  }

  async clickFirstPriceFilter(): Promise<void> {
    if (await this.priceFilters.first().isVisible()) {
      await this.priceFilters.first().click()
      await this.waitForTimeout(500)
    }
  }

  async sortProductsByPrice(): Promise<void> {
    if (await this.sortSelect.isVisible()) {
      await this.sortSelect.selectOption('price-low')
      await this.waitForTimeout(500)
    }
  }

  get firstProduct(): Locator {
    return this.page.locator('.product-card').first()
  }

  get firstProductImage(): Locator {
    return this.firstProduct.locator('img').first()
  }

  get firstProductName(): Locator {
    return this.firstProduct.locator('h3, .product-name').first()
  }

  get firstProductPrice(): Locator {
    return this.firstProduct
      .locator('.price')
      .or(this.firstProduct.locator('span').filter({ hasText: /\$\d+/ }))
  }

  async clickClearFilters(): Promise<void> {
    const clearFilter = this.clearFiltersButton

    if (await clearFilter.isVisible()) {
      await clearFilter.click()
      await this.waitForTimeout(500)
    }
  }

  get clearFiltersButton(): Locator {
    return this.page
      .locator('button')
      .filter({ hasText: /all products|clear|reset/i })
      .first()
  }

  // Utility methods
  async isCategoryFilterVisible(filterText: RegExp = /classic|limited/i): Promise<boolean> {
    const categoryFilter = this.categoryFilterButton(filterText)
    return await categoryFilter.isVisible()
  }

  async isSearchInputVisible(): Promise<boolean> {
    return await this.searchInput.isVisible()
  }

  async isPriceFilterVisible(): Promise<boolean> {
    return await this.priceFilters.first().isVisible()
  }

  async isSortSelectVisible(): Promise<boolean> {
    return await this.sortSelect.isVisible()
  }

  async isFirstProductVisible(): Promise<boolean> {
    return await this.firstProduct.isVisible()
  }

  async isFirstProductImageVisible(): Promise<boolean> {
    return await this.firstProductImage.isVisible()
  }

  async isFirstProductNameVisible(): Promise<boolean> {
    return await this.firstProductName.isVisible()
  }

  async isClearFiltersButtonVisible(): Promise<boolean> {
    return await this.clearFiltersButton.isVisible()
  }
}
