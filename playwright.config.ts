import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/* Turn .feature files into Playwright tests (generated into .features-gen/). */
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'features/steps/**/*.ts',
});

export default defineConfig({
  testDir,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://testautomationpractice.blogspot.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Capture a screenshot only when a test fails. */
    screenshot: 'only-on-failure',

    /* Record video for every test, but keep it only when the test fails. */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    /* Disabled for now to focus on Chrome. Uncomment to test these browsers again. */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
