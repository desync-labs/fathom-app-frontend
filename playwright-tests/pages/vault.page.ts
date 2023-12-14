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
    return this.page.locator(`//div[contains(text(), "${name}")]/ancestor::tr`);
  }

  getActionButtonLocatorForVault(name: string): Locator {
    return this.getVaultRowLocatorByName(name).locator("//td[last()]/button");
  }
}
