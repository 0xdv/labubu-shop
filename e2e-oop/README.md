# E2E Tests with Page Object Model

This directory contains end-to-end tests implemented using the Page Object Model (POM) pattern for better maintainability and reusability.

## Structure

```
e2e-oop/
├── pages/
│   ├── BasePage.ts          # Base page class with common functionality
│   ├── CollectionPage.ts    # Collection page object with specific methods
│   └── index.ts            # Export barrel for easy imports
├── collection.spec.ts      # Collection page tests using POM
└── README.md              # This file
```

## Page Object Model Benefits

1. **Maintainability**: Page elements and actions are centralized in page objects
2. **Reusability**: Page methods can be reused across multiple test files
3. **Readability**: Tests are more descriptive and easier to understand
4. **DRY Principle**: Eliminates code duplication across test files
5. **Easier Updates**: UI changes only require updates in page objects

## Usage

### Creating a Page Object

```typescript
import { BasePage } from './BasePage'

export class MyPage extends BasePage {
  private readonly myElement: Locator

  constructor(page: Page) {
    super(page)
    this.myElement = this.page.locator('#my-element')
  }

  async clickMyElement(): Promise<void> {
    await this.myElement.click()
  }
}
```

### Using in Tests

```typescript
import { test } from '@playwright/test'
import { MyPage } from './pages/MyPage'

test('should interact with page', async ({ page }) => {
  const myPage = new MyPage(page)
  await myPage.goto('/my-path')
  await myPage.clickMyElement()
})
```

## Running Tests

```bash
# Run all POM tests
npx playwright test e2e-oop/

# Run specific test file
npx playwright test e2e-oop/collection.spec.ts

# Run with UI mode
npx playwright test e2e-oop/ --ui
```
