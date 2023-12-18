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
dotenv.config();

let networkName: string;
let rpcUrl: string;
let chainId: string;
let symbol: string;
let blockExplorer: string;

switch (process.env.ENVIRONMENT_URL) {
  case "https://dapp.fathom.fi":
    networkName = "XDC";
    rpcUrl = "https://rpc.xinfin.network";
    chainId = "50";
    symbol = "XDC";
    blockExplorer = "https://explorer.xinfin.network/";
    break;
  case "https://dev-app-frontend-wpa8a.ondigitalocean.app" ||
    "http://127.0.0.1:3000":
    networkName = "XDC Test";
    rpcUrl = "https://earpc.apothem.network/";
    chainId = "51";
    symbol = "TXDC";
    blockExplorer = "https://apothem.blocksscan.io/";
    break;
  default:
    networkName = "XDC Test";
    rpcUrl = "https://earpc.apothem.network/";
    chainId = "51";
    symbol = "TXDC";
    blockExplorer = "https://apothem.blocksscan.io/";
}
interface pagesAndContext {
  context: BrowserContext;
  fxdPage: FxdPage;
  vaultPage: VaultPage;
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
});

export const expect = test.expect;
