import { expect } from '@playwright/test';
import { Given, Then } from './fixtures';

Given('I open the home page', async ({ page }) => {
  await page.goto('/');
});

Then('the page title should contain {string}', async ({ page }, text: string) => {
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  await expect(page).toHaveTitle(new RegExp(escaped));
});
