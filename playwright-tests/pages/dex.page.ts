import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { formatNumberToFixedLength } from "../utils/helpers";
import { SwapData } from "../types";

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
  readonly transactionPopupStatusIcon: Locator;
  readonly swapTransactionPopupBodyText: Locator;
  readonly transactionPopupFooterText: Locator;
  readonly transactionPopupColumn: Locator;
  readonly fromTokenSymbolContainer: Locator;
  readonly toTokenSymbolContainer: Locator;
  readonly confirmSwapModal: Locator;
  readonly confirmSwapModalFromAmount: Locator;
  readonly confirmSwapModalFromTokenName: Locator;
  readonly confirmSwapModalToAmount: Locator;
  readonly confirmSwapModalToTokenName: Locator;
  readonly waitingForConfirmationModalBodyText: Locator;
  readonly waitingForConfirmationModalHeaderText: Locator;
  readonly waitingForConfirmationModalFooterText: Locator;
  readonly transactionSubmittedModalHeaderText: Locator;
  readonly transactionSubmittedModalFooterText: Locator;
  readonly transactionSubmittedModalCloseButton: Locator;
  readonly wrapButton: Locator;
  readonly wrapTransactionPopupBodyText: Locator;
  readonly unwrapButton: Locator;
  readonly unwrapTransactionPopupBodyText: Locator;

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
    this.transactionPopupColumn = this.page.getByTestId("dex-fixedPopupColumn");
    this.transactionPopupStatusIcon = this.page.locator(
      '[data-testid="dex-fixedPopupColumn"] > div > div svg'
    );
    this.swapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//div[contains(text(), "Swap")]'
    );
    this.wrapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//div[contains(text(), "Wrap")]'
    );
    this.unwrapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//div[contains(text(), "Unwrap")]'
    );
    this.transactionPopupFooterText = this.page.locator(
      '[data-testid="dex-fixedPopupColumn"] a'
    );
    this.fromTokenSymbolContainer = this.page.locator(
      "#swap-currency-input .token-symbol-container"
    );
    this.toTokenSymbolContainer = this.page.locator(
      "#swap-currency-output .token-symbol-container"
    );
    this.confirmSwapModal = this.page.locator(
      '//div[text()="Confirm Swap"]//ancestor::div[@data-reach-dialog-content]'
    );
    this.confirmSwapModalFromAmount = this.page.getByTestId(
      "dex-swapModalHeader-fromAmount"
    );
    this.confirmSwapModalFromTokenName = this.page.getByTestId(
      "dex-swapModalHeader-fromTokenName"
    );
    this.confirmSwapModalToAmount = this.page.getByTestId(
      "dex-swapModalHeader-toAmount"
    );
    this.confirmSwapModalToTokenName = this.page.getByTestId(
      "dex-swapModalHeader-toTokenName"
    );
    this.waitingForConfirmationModalBodyText = this.page.getByTestId(
      "dex-waitingForConfirmationModal-bodyText"
    );
    this.waitingForConfirmationModalHeaderText = this.page.getByTestId(
      "dex-waitingForConfirmationModal-headerText"
    );
    this.waitingForConfirmationModalFooterText = this.page.getByTestId(
      "dex-waitingForConfirmationModal-footerText"
    );
    this.transactionSubmittedModalHeaderText = this.page.getByTestId(
      "dex-transactionSubmittedModal-headerText"
    );
    this.transactionSubmittedModalFooterText = this.page.getByTestId(
      "dex-transactionSubmittedModal-footerText"
    );
    this.transactionSubmittedModalCloseButton = this.page.getByTestId(
      "dex-transactionSubmittedModal-closeButton"
    );
    this.wrapButton = this.page.locator('//button[text()="Wrap"]');
    this.unwrapButton = this.page.locator('//button[text()="Unwrap"]');
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

  async clickWrapButton(): Promise<void> {
    await this.wrapButton.click();
  }

  async clickUnwrapButton(): Promise<void> {
    await this.unwrapButton.click();
  }

  async swap({
    fromToken,
    toToken,
    fromAmount,
  }: {
    fromToken: string;
    toToken: string;
    fromAmount: number;
  }): Promise<SwapData> {
    await this.selectFromToken({ tokenId: fromToken });
    await this.selectToToken({ tokenId: toToken });
    await this.fillFromValue({ inputValue: fromAmount });
    await this.page.waitForTimeout(2000);
    const fromAmountString = await this.fromTokenAmountInput.getAttribute(
      "value"
    );
    const toAmountString = await this.toTokenAmountInput.getAttribute("value");
    expect(Number(toAmountString)).toBeGreaterThan(0);
    const fromTokenName = await this.fromTokenSymbolContainer.textContent();
    const toTokenName = await this.toTokenSymbolContainer.textContent();
    const expectedData: SwapData = {
      fromAmountExpected: fromAmountString as string,
      fromTokenNameExpected: fromTokenName as string,
      toAmountExpected: toAmountString as string,
      toTokenNameExpected: toTokenName as string,
    };
    await this.clickSwapButton();
    await this.validateConfirmSwapModal(expectedData);
    await this.clickConfirmSwapButton();
    await this.validateWaitingForConfirmationModal(expectedData);
    await metamask.confirmTransaction();
    await this.validateTransactionSubmittedModal();
    await this.transactionSubmittedModalCloseButton.click();
    return expectedData;
  }

  async wrap({
    fromToken,
    toToken,
    fromAmount,
  }: {
    fromToken: string;
    toToken: string;
    fromAmount: number;
  }): Promise<SwapData> {
    await this.selectFromToken({ tokenId: fromToken });
    await this.selectToToken({ tokenId: toToken });
    await this.fillFromValue({ inputValue: fromAmount });
    await this.page.waitForTimeout(2000);
    const fromAmountString = await this.fromTokenAmountInput.getAttribute(
      "value"
    );
    const toAmountString = await this.toTokenAmountInput.getAttribute("value");
    expect(Number(toAmountString)).toBeGreaterThan(0);
    const fromTokenName = await this.fromTokenSymbolContainer.textContent();
    const toTokenName = await this.toTokenSymbolContainer.textContent();
    const expectedData: SwapData = {
      fromAmountExpected: fromAmountString as string,
      fromTokenNameExpected: fromTokenName as string,
      toAmountExpected: toAmountString as string,
      toTokenNameExpected: toTokenName as string,
    };
    await this.clickWrapButton();
    await metamask.confirmTransaction();
    return expectedData;
  }

  async unwrap({
    fromToken,
    toToken,
    fromAmount,
  }: {
    fromToken: string;
    toToken: string;
    fromAmount: number;
  }): Promise<SwapData> {
    await this.selectFromToken({ tokenId: fromToken });
    await this.selectToToken({ tokenId: toToken });
    await this.fillFromValue({ inputValue: fromAmount });
    await this.page.waitForTimeout(2000);
    const fromAmountString = await this.fromTokenAmountInput.getAttribute(
      "value"
    );
    const toAmountString = await this.toTokenAmountInput.getAttribute("value");
    expect(Number(toAmountString)).toBeGreaterThan(0);
    const fromTokenName = await this.fromTokenSymbolContainer.textContent();
    const toTokenName = await this.toTokenSymbolContainer.textContent();
    const expectedData: SwapData = {
      fromAmountExpected: fromAmountString as string,
      fromTokenNameExpected: fromTokenName as string,
      toAmountExpected: toAmountString as string,
      toTokenNameExpected: toTokenName as string,
    };
    await this.clickUnwrapButton();
    await metamask.confirmTransaction();
    return expectedData;
  }

  async validateConfirmSwapModal({
    fromAmountExpected,
    fromTokenNameExpected,
    toAmountExpected,
    toTokenNameExpected,
  }: SwapData): Promise<void> {
    await expect(this.confirmSwapModal).toBeVisible();
    await expect
      .soft(this.confirmSwapModalFromAmount)
      .toHaveText(fromAmountExpected);
    await expect
      .soft(this.confirmSwapModalFromTokenName)
      .toHaveText(fromTokenNameExpected);
    await expect
      .soft(this.confirmSwapModalToAmount)
      .toHaveText(toAmountExpected);
    await expect
      .soft(this.confirmSwapModalToTokenName)
      .toHaveText(toTokenNameExpected);
  }

  async validateWaitingForConfirmationModal({
    fromAmountExpected,
    fromTokenNameExpected,
    toAmountExpected,
    toTokenNameExpected,
  }: SwapData): Promise<void> {
    await expect(this.waitingForConfirmationModal).toBeVisible();
    const expectedText = `Swapping ${fromAmountExpected} ${fromTokenNameExpected} for ${toAmountExpected} ${toTokenNameExpected}`;
    await expect(this.waitingForConfirmationModalHeaderText).toHaveText(
      "Waiting For Confirmation"
    );
    await expect
      .soft(this.waitingForConfirmationModalBodyText)
      .toHaveText(expectedText);
    await expect(this.waitingForConfirmationModalFooterText).toHaveText(
      "Confirm this transaction in your wallet"
    );
  }

  async validateTransactionSubmittedModal(): Promise<void> {
    await expect(this.transactionSubmittedConfirmationModal).toBeVisible();
    await expect
      .soft(this.transactionSubmittedModalHeaderText)
      .toHaveText("Transaction Submitted");
    await expect
      .soft(this.transactionSubmittedModalFooterText)
      .toHaveText("View on Blocksscan");
    await expect.soft(this.transactionSubmittedModalCloseButton).toBeVisible();
  }

  async validateSwapSuccessPopup({
    fromAmountExpected,
    fromTokenNameExpected,
    toAmountExpected,
    toTokenNameExpected,
  }: SwapData): Promise<void> {
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 30000 });
    await expect
      .soft(this.transactionPopupStatusIcon)
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
    await expect.soft(this.transactionPopupFooterText).toBeVisible();
    await expect
      .soft(this.transactionPopupFooterText)
      .toHaveText("View on Blocksscan");
  }

  async validateWrapSuccessPopup({
    fromAmountExpected,
    fromTokenNameExpected,
    toTokenNameExpected,
  }: SwapData): Promise<void> {
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 30000 });
    await expect
      .soft(this.transactionPopupStatusIcon)
      .toHaveAttribute("stroke", "#27AE60");
    await expect.soft(this.wrapTransactionPopupBodyText).toBeVisible();
    await expect
      .soft(this.wrapTransactionPopupBodyText)
      .toHaveText(
        `Wrap ${fromAmountExpected} ${fromTokenNameExpected} to ${toTokenNameExpected}`
      );
    await expect.soft(this.transactionPopupFooterText).toBeVisible();
    await expect
      .soft(this.transactionPopupFooterText)
      .toHaveText("View on Blocksscan");
  }

  async validateUnwrapSuccessPopup({
    fromAmountExpected,
    fromTokenNameExpected,
    toTokenNameExpected,
  }: SwapData): Promise<void> {
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 30000 });
    await expect
      .soft(this.transactionPopupStatusIcon)
      .toHaveAttribute("stroke", "#27AE60");
    await expect.soft(this.unwrapTransactionPopupBodyText).toBeVisible();
    await expect
      .soft(this.unwrapTransactionPopupBodyText)
      .toHaveText(
        `Unwrap ${fromAmountExpected} ${fromTokenNameExpected} to ${toTokenNameExpected}`
      );
    await expect.soft(this.transactionPopupFooterText).toBeVisible();
    await expect
      .soft(this.transactionPopupFooterText)
      .toHaveText("View on Blocksscan");
  }
}
