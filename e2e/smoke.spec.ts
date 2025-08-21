import { test, expect } from '@playwright/test'

test.describe('Smoke test', () => {
  // test('', async ({ page }) => {
  //   await page.goto('https://dou.ua')
  //   await page.waitForTimeout(2000)

  //   const searchInput = page.getByRole('textbox', { name: 'пошук' })

  //   await searchInput.click()
  //   await searchInput.fill('react')
  //   await searchInput.press('Enter')

  //   await page.waitForTimeout(2000)

  //   const title = page.getByText('Приблизна кількість результатів:')
  //   console.log(await title.innerText())
  //   expect(title).toHaveClass('gsc-result-info')
  // })

  test('', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.goto('/collection')
    await page.waitForLoadState('networkidle')

    const products = await page.locator('.product-card')
    await expect(products).toHaveCount(8)

    const searchInput = page.getByRole('textbox', { name: 'Search Labubu...' })
    searchInput.click()
    searchInput.fill('pink')

    await page.waitForTimeout(500)

    await expect(products).toHaveCount(1)
  })
})
