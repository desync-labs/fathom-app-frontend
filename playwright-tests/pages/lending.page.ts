import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";

export default class LendingPage extends BasePage {
  readonly path: string;

  constructor(page: Page) {
    super(page);
    this.path = "/#";

    // Locators
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }
}
