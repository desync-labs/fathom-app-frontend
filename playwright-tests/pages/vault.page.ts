import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";

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
    return this.page.locator(`tr[data-testid="vaultRow-${name}"]`);
  }

  getVaultRowDetailsLocatorByName(name: string): Locator {
    return this.page.locator(`tr[data-testid="vaultRowDetails-${name}"]`);
  }

  getActionButtonRowLocatorByName(name: string): Locator {
    return this.getVaultRowLocatorByName(name).locator("//td[last()]/button");
  }

  getActionButtonRowDetailsLocatorByName(name: string): Locator {
    return this.getVaultRowDetailsLocatorByName(name).locator("button");
  }

  async getStakedVaultRowValue(name: string): Promise<number | null> {
    const stakedValue = await this.getVaultRowLocatorByName(name)
      .locator(`//td[7]//div[contains(@class, "value")]`)
      .textContent();
    const stakedValueFormatted = this.extractStakedValue(stakedValue!);
    return stakedValueFormatted;
  }

  getStakedValueVaultRowDetails(name: string): Locator {
    return this.getVaultRowLocatorByName(name).locator("//td[3]");
  }

  extractStakedValue(inputString: string): number | null {
    const match = inputString.match(/(\d+(,\d{3})*|\d+)/);
    if (match) {
      const numericPart = match[0];
      const numericValue = parseInt(numericPart.replace(/,/g, ""), 10);
      return numericValue;
    } else {
      return null;
    }
  }
}
