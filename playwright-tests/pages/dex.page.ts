import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { formatNumberToFixedLength } from "../utils/helpers";

export default class DexPage extends BasePage {
  readonly path: string;
  readonly fromCurrencySelectButton: Locator;
  readonly toCurrencySelectButton: Locator;
  readonly fromTokenAmountInput: Locator;
  readonly toTokenAmountInput: Locator;
  readonly swapButton: Locator;
  readonly confirmSwapButton: Locator;
  readonly waitingForConfirmationModal: Locator;
  readonly transactionSubmittedConfirmationModal: Locator;
  readonly closeButtonSelectTokenModal: Locator;
  readonly swapTransactionPopupStatusIcon: Locator;
  readonly swapTransactionPopupBodyText: Locator;
  readonly swapTransactionPopupFooterText: Locator;
  readonly swapTransactionPopup: Locator;
  readonly fromTokenSymbolContainer: Locator;
  readonly toTokenSymbolContainer: Locator;

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
    this.confirmSwapButton = this.page.locator("#confirm-swap-or-send");
    this.waitingForConfirmationModal = this.page.locator(
      '//div[text()="Waiting For Confirmation"]//ancestor::div[@data-reach-dialog-content]'
    );
    this.transactionSubmittedConfirmationModal = this.page.locator(
      '//div[text()="Transaction Submitted"]//ancestor::div[@data-reach-dialog-content]'
    );
    this.closeButtonSelectTokenModal = this.page.locator(
      '//div[text()="Select a token"]//following-sibling::*[local-name()="svg"]'
    );
    this.swapTransactionPopup = this.page.getByTestId("dex-fixedPopupColumn");
    this.swapTransactionPopupStatusIcon = this.page.locator(
      '[data-testid="dex-fixedPopupColumn"] > div > div svg'
    );
    this.swapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//div[contains(text(), "Swap")]'
    );
    this.swapTransactionPopupFooterText = this.page.locator(
      '[data-testid="dex-fixedPopupColumn"] a'
    );
    this.fromTokenSymbolContainer = this.page.locator(
      "#swap-currency-input .token-symbol-container"
    );
    this.toTokenSymbolContainer = this.page.locator(
      "#swap-currency-output .token-symbol-container"
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  getTokenItemLocator({ tokenId }: { tokenId: string }): Locator {
    const locator = this.page.locator(`.token-item-${tokenId}`);
    return locator;
  }

  async selectFromToken({ tokenId }: { tokenId: string }): Promise<void> {
    await this.fromCurrencySelectButton.click();
    const tokenItem = this.getTokenItemLocator({ tokenId });
    await expect(tokenItem.locator("svg")).not.toBeVisible({ timeout: 15000 });
    const isDisabled = (await tokenItem.getAttribute("disabled")) !== null;
    if (!isDisabled) {
      console.log("Disabled is not null");
      await tokenItem.click();
    }
    await this.closeButtonSelectTokenModal.click();
  }

  async selectToToken({ tokenId }: { tokenId: string }): Promise<void> {
    await this.toCurrencySelectButton.click();
    const tokenItem = this.getTokenItemLocator({ tokenId });
    await expect(tokenItem.locator("svg")).not.toBeVisible({ timeout: 15000 });
    const isDisabled = (await tokenItem.getAttribute("disabled")) !== null;
    if (!isDisabled) {
      await tokenItem.click();
    }
    await this.closeButtonSelectTokenModal.click();
  }

  async fillFromValue({ inputValue }: { inputValue: number }): Promise<void> {
    await this.fromTokenAmountInput.click();
    await this.fromTokenAmountInput.clear();
    await this.fromTokenAmountInput.pressSequentially(inputValue.toString());
  }

  async fillToValue({ inputValue }: { inputValue: number }): Promise<void> {
    await this.toTokenAmountInput.click();
    await this.fromTokenAmountInput.clear();
    await this.toTokenAmountInput.fill(inputValue.toString());
  }

  async clickSwapButton(): Promise<void> {
    await this.swapButton.click();
  }

  async clickConfirmSwapButton(): Promise<void> {
    await this.confirmSwapButton.click();
  }

  async swap({
    fromToken,
    toToken,
    fromAmount,
  }: {
    fromToken: string;
    toToken: string;
    fromAmount: number;
  }): Promise<{
    fromValueString: string;
    fromTokenName: string;
    toValueString: string;
    toTokenName: string;
  }> {
    await this.selectFromToken({ tokenId: fromToken });
    await this.selectToToken({ tokenId: toToken });
    await this.fillFromValue({ inputValue: fromAmount });
    await this.page.waitForTimeout(2000);
    const fromAmountString = await this.fromTokenAmountInput.getAttribute(
      "value"
    );
    const toAmountString = await this.toTokenAmountInput.getAttribute("value");
    const fromTokenName = await this.fromTokenSymbolContainer.textContent();
    const toTokenName = await this.toTokenSymbolContainer.textContent();
    expect(Number(toAmountString)).toBeGreaterThan(0);
    await this.clickSwapButton();
    await this.clickConfirmSwapButton();
    await expect(this.waitingForConfirmationModal).toBeVisible();
    await metamask.confirmTransaction();
    await expect(this.transactionSubmittedConfirmationModal).toBeVisible();
    return {
      fromValueString: fromAmountString as string,
      fromTokenName: fromTokenName as string,
      toValueString: toAmountString as string,
      toTokenName: toTokenName as string,
    };
  }

  async validateSwapSuccessPopup({
    fromAmountExpected,
    fromTokenNameExpected,
    toAmountExpected,
    toTokenNameExpected,
  }: {
    fromAmountExpected: string;
    fromTokenNameExpected: string;
    toAmountExpected: string;
    toTokenNameExpected: string;
  }): Promise<void> {
    await expect(this.swapTransactionPopup).toBeVisible({ timeout: 30000 });
    await expect
      .soft(this.swapTransactionPopupStatusIcon)
      .toHaveAttribute("stroke", "#27AE60");
    await expect.soft(this.swapTransactionPopupBodyText).toBeVisible();
    await expect
      .soft(this.swapTransactionPopupBodyText)
      .toHaveText(
        `Swap ${fromAmountExpected} ${fromTokenNameExpected} for ${formatNumberToFixedLength(
          toAmountExpected,
          16
        )} ${toTokenNameExpected}`
      );
    await expect.soft(this.swapTransactionPopupFooterText).toBeVisible();
    await expect
      .soft(this.swapTransactionPopupFooterText)
      .toHaveText("View on Blocksscan");
  }
}
