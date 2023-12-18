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
}
