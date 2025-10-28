import { test, expect } from '@playwright/test'

test('Signup page should have a form', async ({ page }) => {
  await page.goto('http://localhost:5173')
  expect(page.locator('form')).toBeTruthy()
})
