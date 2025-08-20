import { Page, Locator } from '@playwright/test'

export abstract class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url)
  }

  async waitForLoadState(
    state: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle',
  ): Promise<void> {
    await this.page.waitForLoadState(state)
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout)
  }

  async setViewportSize(size: { width: number; height: number }): Promise<void> {
    await this.page.setViewportSize(size)
  }
}
