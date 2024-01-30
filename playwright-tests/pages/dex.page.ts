import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";

export default class DexPage extends BasePage {
  readonly path: string;
  readonly fromCurrencySelectButton: Locator;
  readonly toCurrencySelectButton: Locator;
  readonly fromTokenAmountInput: Locator;
  readonly toTokenAmountInput: Locator;
  readonly swapButton: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#/swap";
    this.fromCurrencySelectButton = this.page.locator(
      "#swap-currency-input .open-currency-select-button"
    );
    this.toCurrencySelectButton = this.page.locator(
      "#swap-currency-output .open-currency-select-button"
    );
    this.fromTokenAmountInput = this.page.locator(
      "#swap-currency-input .token-amount-input"
    );
    this.toTokenAmountInput = this.page.locator(
      "#swap-currency-output .token-amount-input"
    );
    this.swapButton = this.page.locator("#swap-button");
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  getTokenItemLocator({ tokenId }: { tokenId: string }): Locator {
    const locator = this.page.locator(`token-item-${tokenId}`);
    return locator;
  }
}
