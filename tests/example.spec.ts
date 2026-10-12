import { test, expect } from '@playwright/test';

test('opens the practice site', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Automation Testing Practice/);
});