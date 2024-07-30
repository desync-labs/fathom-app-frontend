import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const headlessMode = process.env.HEADLESS_MODE === "true";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./playwright-tests/tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !(process.env.CI == null),
  /* Retry on CI only */
  retries: process.env.CI != null ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI != null ? 1 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-tests/test-report", open: "never" }],
    ["json", { outputFile: "playwright-tests/test-report/results.json" }],
  ],
  timeout: process.env.CI ? 150000 : 120000,
  outputDir: "./playwright-tests/test-results",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    actionTimeout: 15000,
    // video: 'retain-on-failure',
    headless: headlessMode,
    baseURL: process.env.ENVIRONMENT_URL,
  },
  projects: [
    {
      name: "wallet-connectivity-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "./playwright-tests/tests/",
      testMatch: "wallet.spec.ts",
    },
    {
      name: "fxd-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "./playwright-tests/tests/",
      testMatch: "fxd-positions.spec.ts",
    },
    {
      name: "vault-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "./playwright-tests/tests/",
      testMatch: "vaults.spec.ts",
    },
    {
      name: "dex-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "./playwright-tests/tests/dex",
      testMatch: "**.spec.ts",
    },
    {
      name: "lending-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
      timeout: 60000 * 5,
      testDir: "./playwright-tests/tests/lending",
      testMatch: "**.spec.ts",
    },
    {
      name: "dao-tests",
      use: {
        ...devices["Desktop Chrome"],
      },
      testDir: "./playwright-tests/tests/dao",
      testMatch: "**.spec.ts",
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
