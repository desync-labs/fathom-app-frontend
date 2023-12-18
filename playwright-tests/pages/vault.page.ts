import { type Page, type Locator } from "@playwright/test";
import BasePage from "./base.page";
import { extractNumericValue } from "../utils/helpers";
export default class VaultPage extends BasePage {
  readonly path: string;
  readonly btnManageVault: Locator;
  readonly btnDeposit: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#/vault";
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  getVaultRowLocatorByName(name: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${name}"]`);
  }

  getVaultRowDetailsLocatorByName(name: string): Locator {
    return this.page.locator(`[data-testid="vaultRowDetails-${name}"]`);
  }

  getActionButtonRowLocatorByName(name: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${name}-depositButton"]`);
  }

  getActionButtonRowDetailsLocatorByName(name: string): Locator {
    return this.getVaultRowDetailsLocatorByName(name).locator("button");
  }

  async getTvlVaultRowValue(name: string): Promise<number | null> {
    const tvlValue = await this.page
      .locator(`[data-testid="vaultRow-${name}-tvlValueCell"] > div`)
      .textContent();
    if (tvlValue !== null) {
      return extractNumericValue(tvlValue);
    } else {
      return null;
    }
  }

  async getAvailableVaultRowValue(name: string): Promise<number | null> {
    const availableValue = await this.page
      .locator(`[data-testid="vaultRow-${name}-availableValueCell"] > div`)
      .textContent();
    if (availableValue !== null) {
      return extractNumericValue(availableValue);
    } else {
      return null;
    }
  }

  async getStakedVaultRowValue(name: string): Promise<number | null> {
    const stakedValue = await this.page
      .locator(
        `[data-testid="vaultRow-${name}-stakedValueCell"] div[class*="value"]`
      )
      .textContent();
    if (stakedValue !== null) {
      return extractNumericValue(stakedValue);
    } else {
      return null;
    }
  }

  async getPooledVaultRowDetailsValue(name: string): Promise<number | null> {
    const pooledValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${name}-itemPositionInfo-earningDetails-pooledValue"]`
      )
      .textContent();
    if (pooledValue !== null) {
      return extractNumericValue(pooledValue);
    } else {
      return null;
    }
  }

  async getYourShareVaultRowDetailsValue(name: string): Promise<number | null> {
    const yourShareValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${name}-itemPositionInfo-earningDetails-yourShareValue"]`
      )
      .textContent();
    if (yourShareValue !== null) {
      return extractNumericValue(yourShareValue);
    } else {
      return null;
    }
  }

  async getShareTokenVaultRowDetailsValue(
    name: string
  ): Promise<number | null> {
    const shareTokenValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${name}-itemPositionInfo-earningDetails-shareTokenValue"]`
      )
      .textContent();
    if (shareTokenValue !== null) {
      return extractNumericValue(shareTokenValue);
    } else {
      return null;
    }
  }
}
