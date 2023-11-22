import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const headlessMode = process.env.HEADLESS_MODE === "true";
let appBaseUrl: string;
let dexBaseUrl: string;

// TO DO, set base urls to corresponding url according to env, stage, qa, etc., by default set to prod for now
switch (process.env.ENVIRONMENT) {
  case "prod":
    appBaseUrl = "https://dapp.fathom.fi";
    dexBaseUrl = "https://swap.fathom.fi";
    break;
  case "dev":
    appBaseUrl = "https://dev-app-frontend-wpa8a.ondigitalocean.app/";
    dexBaseUrl = "https://dev-dex-frontend-38aof.ondigitalocean.app/";
    break;
  case "local-dev":
    appBaseUrl = "http://127.0.0.1:3000";
    dexBaseUrl = "http://127.0.0.1:3000";
    break;
  default:
    appBaseUrl = "https://dev-app-frontend-wpa8a.ondigitalocean.app/";
    dexBaseUrl = "https://dev-dex-frontend-38aof.ondigitalocean.app/";
}

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
    ["html", { outputFolder: "./playwright-tests/test-report", open: "never" }],
  ],
  timeout: process.env.CI ? 100000 : 60000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    // video: 'retain-on-failure',
    headless: headlessMode,
  },
  projects: [
    {
      name: "fathom_app_tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: appBaseUrl,
      },
      testDir: "./playwright-tests/tests/fathomApp",
    },
    {
      name: "fathom_dex_tests",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: dexBaseUrl,
      },
      testDir: "./playwright-tests/tests/fathomDex",
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: "npm run start:dev",
  //   url: "http://127.0.0.1:3001",
  //   reuseExistingServer: !process.env.CI,
  // },
});
