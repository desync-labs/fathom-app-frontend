import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";

export default class VaultPage extends BasePage {
  readonly path: string;
  readonly btnManageVault: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#/vault";

    // Locators
    this.btnManageVault = this.page.getByText("Manage Vault");
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }
}
