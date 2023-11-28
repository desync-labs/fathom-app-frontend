import {
  type Page,
  type Locator,
  expect,
  type Request,
} from "@playwright/test";
import dotenv from "dotenv";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import {
  type AvailableNetworks,
  type GraphOperationName,
  type WalletConnectOptions,
} from "../types";
dotenv.config();

export default class BasePage {
  readonly page: Page;
  readonly btnWalletIcon: Locator;
  readonly divConnectedWalletAddress: Locator;
  readonly btnExit: Locator;
  readonly imgMetamask: Locator;
  readonly divNetworkHeader: Locator;
  readonly graphAPIBaseUrl: string;
  readonly divAlert: Locator;
  readonly divAlertMessage: Locator;
  readonly divAlertTitle: Locator;
  readonly paragraphAlertBody: Locator;
  readonly timeoutTransactionPending = process.env.CI ? 90000 : 60000;

  constructor(page: Page) {
    this.page = page;

    switch (process.env.ENVIRONMENT_URL) {
      case "https://dapp.fathom.fi":
        this.graphAPIBaseUrl = "https://xinfin-graph.fathom.fi";
        break;
      case "https://dev-app-frontend-wpa8a.ondigitalocean.app" ||
        "http://127.0.0.1:3000":
        this.graphAPIBaseUrl = "https://dev.fathom.fi";
        break;
      default:
        this.graphAPIBaseUrl = "https://dev.fathom.fi";
    }

    // Locators
    this.btnWalletIcon = this.page.locator(
      '[data-testid="AccountBalanceWalletIcon"]'
    );
    this.divConnectedWalletAddress = this.page.locator(
      '//div[contains(text(), "0x") and contains(text(), "…")]'
    );
    this.btnExit = this.page.locator('button:has(img[alt="exit"])');
    this.imgMetamask = this.page.locator('img[alt="metamask"]');
    this.divNetworkHeader = this.page.locator('//img[@alt="xdc"]//parent::div');
    this.divAlert = this.page.locator('div[role="alert"]');
    this.divAlertMessage = this.page.locator(".MuiAlert-message");
    this.divAlertTitle = this.divAlertMessage.locator("> .MuiAlertTitle-root");
    this.paragraphAlertBody = this.divAlertMessage.locator("> p");
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async connectWallet(
    wallet: WalletConnectOptions,
    options?: { allAccounts: boolean }
  ): Promise<void> {
    await this.btnWalletIcon.click();
    await this.page.getByText(wallet).click();
    if (options) {
      await metamask.acceptAccess(options);
    } else {
      await metamask.acceptAccess();
    }
  }

  async disconnectWallet(): Promise<void> {
    await this.btnExit.click();
  }

  async getConnectedWalletAddressFromHeader(): Promise<string> {
    const walletAddress = await this.divConnectedWalletAddress.textContent();
    return walletAddress!;
  }

  async validateConnectedWalletAddress(): Promise<void> {
    const walletAddressHeader =
      await this.getConnectedWalletAddressFromHeader();
    const connectedAddressMetamask = await metamask.getWalletAddress();
    expect(connectedAddressMetamask).toContain(
      walletAddressHeader?.substring(0, 6)
    );
    expect(connectedAddressMetamask).toContain(
      walletAddressHeader?.substring(
        walletAddressHeader.length - 4,
        walletAddressHeader.length
      )
    );
  }

  async validateExitButton(): Promise<void> {
    await expect(this.btnExit).toBeVisible();
    await expect.soft(this.btnExit).toBeEnabled();
    expect
      .soft(await this.btnExit.locator("img").getAttribute("src"))
      .toContain("exit");
    expect
      .soft(await this.btnExit.locator("img").getAttribute("src"))
      .toContain(".svg");
  }

  async validateMetamaskLogo(): Promise<void> {
    await expect(this.imgMetamask).toBeVisible();
    expect
      .soft(await this.imgMetamask.getAttribute("src"))
      .toContain("metamask");
    expect.soft(await this.imgMetamask.getAttribute("src")).toContain(".svg");
  }

  async validateNetworkBlock(
    connectedNetworkName: AvailableNetworks
  ): Promise<void> {
    await expect(this.divNetworkHeader).toBeVisible();
    await expect.soft(this.divNetworkHeader).toHaveText(connectedNetworkName);
    await expect.soft(this.divNetworkHeader.locator("img")).toBeVisible();
    expect
      .soft(await this.divNetworkHeader.locator("img").getAttribute("src"))
      .toContain("logo.png");
  }

  async validateWalletDisconnected(): Promise<void> {
    await expect.soft(this.btnWalletIcon).toBeVisible();
    await expect.soft(this.divConnectedWalletAddress).not.toBeVisible();
    await expect.soft(this.divNetworkHeader).not.toBeVisible();
  }

  async waitForGraphRequestByOperationName(
    endpoint: string,
    operationName: GraphOperationName
  ): Promise<Request> {
    const request = await this.page.waitForRequest(
      (request) => {
        const includesFxdPositions = request
          .postData()
          ?.includes(operationName);
        if (includesFxdPositions !== undefined) {
          return (
            request.url() === `${this.graphAPIBaseUrl}${endpoint}` &&
            includesFxdPositions
          );
        } else {
          return false;
        }
      },
      { timeout: this.timeoutTransactionPending }
    );
    return request;
  }

  async validateAlertMessage({
    status,
    title,
    body,
  }: {
    status: "pending" | "success" | "error";
    title: string;
    body?: string;
  }): Promise<void> {
    if (status === "pending") {
      await expect
        .soft(this.divAlertMessage.getByText(title))
        .toBeVisible({ timeout: this.timeoutTransactionPending });
      if (body) {
        await expect
          .soft(this.divAlertMessage.getByText(body))
          .toBeVisible({ timeout: this.timeoutTransactionPending });
      }
    } else if (status === "success" || status === "error") {
      await expect
        .soft(this.divAlert.getByText(title))
        .toBeVisible({ timeout: this.timeoutTransactionPending });
    }
  }
}
