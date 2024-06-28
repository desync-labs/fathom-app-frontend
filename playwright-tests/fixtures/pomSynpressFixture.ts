import { test as base, chromium, type BrowserContext } from "@playwright/test";
// @ts-ignore
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
// @ts-ignore
import { prepareMetamask } from "@synthetixio/synpress/helpers";
// @ts-ignore
import { setExpectInstance } from "@synthetixio/synpress/commands/playwright";
// @ts-ignore
import { resetState } from "@synthetixio/synpress/commands/synpress";
import dotenv from "dotenv";
import FxdPage from "../pages/fxd.page";
import VaultPage from "../pages/vault.page";
import DexPage from "../pages/dex.page";
import LendingPage from "../pages/lending.page";
import DaoPage from "../pages/dao.page";
import { XDC_RPC } from "../../src/connectors/networks";
import { APOTHEM_RPC_INTERNAL } from "./global.data";
dotenv.config();

let networkName: string;
let rpcUrl: string;
let chainId: string;
let symbol: string;
let blockExplorer: string;

switch (process.env.ENVIRONMENT_URL) {
  case "https://dapp.fathom.fi":
    networkName = "XDC";
    rpcUrl = XDC_RPC;
    chainId = "50";
    symbol = "XDC";
    blockExplorer = "https://explorer.xinfin.network/";
    break;
  case "https://dev-app-frontend-wpa8a.ondigitalocean.app" ||
    "http://127.0.0.1:3000":
    networkName = "XDC Test";
    rpcUrl = APOTHEM_RPC_INTERNAL;
    chainId = "51";
    symbol = "TXDC";
    blockExplorer = "https://apothem.blocksscan.io/";
    break;
  default:
    networkName = "XDC Test";
    rpcUrl = APOTHEM_RPC_INTERNAL;
    chainId = "51";
    symbol = "TXDC";
    blockExplorer = "https://apothem.blocksscan.io/";
}
interface pagesAndContext {
  context: BrowserContext;
  fxdPage: FxdPage;
  vaultPage: VaultPage;
  dexPage: DexPage;
  lendingPage: LendingPage;
  daoPage: DaoPage;
}

export const test = base.extend<pagesAndContext>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    // required for synpress as it shares same expect instance as playwright
    await setExpectInstance(expect);
    // download metamask
    const metamaskPath: string = await prepareMetamask(
      process.env.METAMASK_VERSION != null || "10.25.0"
    );
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
    ];
    if (process.env.CI != null) {
      browserArgs.push("--disable-gpu");
    }
    if (process.env.HEADLESS_MODE === "true") {
      browserArgs.push("--headless=new");
    }
    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey: process.env.METAMASK_SETUP_PRIVATE_KEY,
      network: {
        name: networkName,
        rpcUrl,
        chainId,
        symbol,
        blockExplorer,
      },
      password: process.env.METAMASK_SETUP_PASSWORD,
      enableAdvancedSettings: true,
      enableExperimentalSettings: false,
    });
    // Set cookie consent to true
    const [page] = context.pages();
    await page.goto(process.env.ENVIRONMENT_URL as string);
    await page.evaluate(() => {
      localStorage.setItem("cookieConsent", "true");
    });
    await use(context);
    await context.close();
    await resetState();
  },
  fxdPage: async ({ page }, use) => {
    await use(new FxdPage(page));
  },
  vaultPage: async ({ page }, use) => {
    await use(new VaultPage(page));
  },
  dexPage: async ({ page }, use) => {
    await use(new DexPage(page));
  },
  lendingPage: async ({ page }, use) => {
    await use(new LendingPage(page));
  },
  daoPage: async ({ page }, use) => {
    await use(new DaoPage(page));
  },
});

export const expect = test.expect;
