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
  workers: process.env.GRAPH_API_BASE_URL ? 2 : 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-tests/test-report", open: "never" }],
    ["json", { outputFile: "playwright-tests/test-report/results.json" }],
    [
      "playwright-qase-reporter",
      {
        captureLogs: true,
        testops: {
          api: {
            token: process.env.QASE_PW_API_TOKEN,
          },
          project: "FATHOM",
          uploadAttachments: true,
          environment: process.env.QASE_ENVIRONMENT,
          basePath: "playwright-tests/test-results",
          run: {
            complete: true,
            title: `${process.env.QASE_TEST_RUN_NAME}`,
          },
        },
      },
    ],
  ],
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
      name: "e2e",
      use: {
        ...devices["Desktop Chrome"],
      },
      timeout: process.env.CI ? 150000 : 120000,
      testDir: "./playwright-tests/tests/e2e",
      testMatch: "**.spec.ts",
    },
    {
      name: "api",
      use: {
        trace: "off",
        screenshot: "off",
      },
      testDir: "./playwright-tests/tests/api",
      testMatch: "**.api.spec.ts",
      timeout: 15000,
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
