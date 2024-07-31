import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import {
  extractNumericValueDex,
  extractTransactionHash,
  formatNumberDexSuccessPopup,
} from "../utils/helpers";
import { DexTabs, DexTokenData, SwapData } from "../types";
import { wxdcData, xdcData } from "../fixtures/dex.data";

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
  readonly unwrapTransactionPopupBodyText: Locator;
  readonly fromBalanceDiv: Locator;
  readonly toBalanceDiv: Locator;
  readonly swapConnectWalletButton: Locator;
  readonly inputTokenSearch: Locator;

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
      '//p[text()="Waiting For Confirmation"]//ancestor::div[@role="dialog"]'
    );
    this.transactionSubmittedConfirmationModal = this.page.locator(
      '//p[text()="Transaction Submitted"]//ancestor::div[@role="dialog"]'
    );
    this.closeButtonSelectTokenModal = this.page.locator(
      '//p[text()="Select a token"]//following-sibling::*[local-name()="svg"]'
    );
    this.transactionPopupColumn = this.page.getByTestId("dex-fixedPopupColumn");
    this.transactionPopupStatusIcon = this.page.locator(
      '[data-testid="dex-fixedPopupColumn"] [data-testid="TaskAltIcon"]'
    );
    this.swapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//p[contains(text(), "Swap")]'
    );
    this.wrapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//p[contains(text(), "Wrap")]'
    );
    this.unwrapTransactionPopupBodyText = this.page.locator(
      '//div[@data-testid="dex-fixedPopupColumn"]//p[contains(text(), "Unwrap")]'
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
      '//p[text()="Confirm Swap"]//ancestor::div[@role="dialog"]'
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
    this.wrapButton = this.page.getByTestId("dex-wrap-button");
    this.fromBalanceDiv = this.page.locator(
      '//div[@id="swap-currency-input"]//div[contains(text(), "Balance")]'
    );
    this.toBalanceDiv = this.page.locator(
      '//div[@id="swap-currency-output"]//div[contains(text(), "Balance")]'
    );
    this.swapConnectWalletButton = this.page.getByTestId(
      "dex-swap-connectWalletButton"
    );
    this.inputTokenSearch = this.page.getByPlaceholder("Search Token");
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async openTab({ tabName }: { tabName: DexTabs }): Promise<void> {
    let href: string;
    switch (tabName) {
      case DexTabs.Swap:
        href = "#/swap";
        break;
      case DexTabs.Pool:
        href = "#/swap/pool";
        break;
      case DexTabs.Transactions: {
        href = "#/swap/transactions";
        break;
      }
    }
    await this.page.locator(`main nav > a[href="${href}"]`).click();
    expect(
      await this.page
        .locator(`main nav > a[href="${href}"]`)
        .getAttribute("class")
    ).toContain("active");
  }

  getTokenItemLocator({ tokenId }: { tokenId: string }): Locator {
    const locator = this.page.locator(`.token-item-${tokenId}`);
    return locator;
  }

  async selectFromToken({
    tokenData,
  }: {
    tokenData: DexTokenData;
  }): Promise<void> {
    await this.fromCurrencySelectButton.click();
    await this.inputTokenSearch.clear();
    await this.inputTokenSearch.fill(tokenData.name);
    const tokenItem = this.getTokenItemLocator({ tokenId: tokenData.tokenId });
    await expect(tokenItem.locator("svg")).not.toBeVisible({ timeout: 25000 });
    const isDisabled = (await tokenItem.getAttribute("disabled")) !== null;
    if (!isDisabled) {
      await tokenItem.click();
    } else {
      await this.closeButtonSelectTokenModal.click();
    }
  }

  async selectToToken({
    tokenData,
  }: {
    tokenData: DexTokenData;
  }): Promise<void> {
    await this.toCurrencySelectButton.click();
    await this.inputTokenSearch.clear();
    await this.inputTokenSearch.fill(tokenData.name);
    const tokenItem = this.getTokenItemLocator({ tokenId: tokenData.tokenId });
    await expect(tokenItem.locator("svg")).not.toBeVisible({ timeout: 25000 });
    const isDisabled = (await tokenItem.getAttribute("disabled")) !== null;
    if (!isDisabled) {
      await tokenItem.click();
    } else {
      await this.closeButtonSelectTokenModal.click();
    }
  }

  async fillFromValue({ inputValue }: { inputValue: number }): Promise<void> {
    await this.fromTokenAmountInput.click();
    await this.fromTokenAmountInput.clear();
    await this.fromTokenAmountInput.pressSequentially(inputValue.toString());
    await this.fromTokenAmountInput.blur();
  }

  async fillToValue({ inputValue }: { inputValue: number }): Promise<void> {
    await this.toTokenAmountInput.click();
    await this.toTokenAmountInput.clear();
    await this.toTokenAmountInput.pressSequentially(inputValue.toString());
    await this.toTokenAmountInput.blur();
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

  async swap({
    fromTokenData,
    toTokenData,
    fromAmount,
  }: {
    fromTokenData: DexTokenData;
    toTokenData: DexTokenData;
    fromAmount: number;
  }): Promise<SwapData> {
    await this.selectFromToken({ tokenData: fromTokenData });
    await this.selectToToken({ tokenData: toTokenData });
    await this.fillFromValue({ inputValue: fromAmount });
    const fromAmountString = await this.fromTokenAmountInput.getAttribute(
      "value"
    );
    await expect(this.swapButton).toHaveText("Swap", { timeout: 20000 });
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
    fromTokenData,
    toTokenData,
    fromAmount,
  }: {
    fromTokenData: DexTokenData;
    toTokenData: DexTokenData;
    fromAmount: number;
  }): Promise<SwapData> {
    await this.selectFromToken({ tokenData: fromTokenData });
    await this.selectToToken({ tokenData: toTokenData });
    await this.fillFromValue({ inputValue: fromAmount });
    const fromAmountString = await this.fromTokenAmountInput.getAttribute(
      "value"
    );
    if (fromTokenData.tokenId === xdcData.tokenId) {
      await expect(this.wrapButton).toHaveText("Wrap", { timeout: 20000 });
    } else if (fromTokenData.tokenId === wxdcData.tokenId) {
      await expect(this.wrapButton).toHaveText("Unwrap", { timeout: 20000 });
    }
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

  async getFromBalance(): Promise<number> {
    const fromBalance = await this.fromBalanceDiv.textContent();
    const fromBalanceNumber = extractNumericValueDex(
      fromBalance as string
    ) as number;
    return fromBalanceNumber;
  }

  async getToBalance(): Promise<number> {
    const toBalance = await this.toBalanceDiv.textContent();
    const toBalanceNumber = extractNumericValueDex(
      toBalance as string
    ) as number;
    return toBalanceNumber;
  }

  async getCompletedTransactionHashFromPopup(): Promise<string> {
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 60000 });
    await expect(this.transactionPopupFooterText).toBeVisible();
    const hrefValue = await this.transactionPopupFooterText.getAttribute(
      "href"
    );
    const transactionHash = extractTransactionHash(hrefValue as string);
    return transactionHash as string;
  }

  getTransactionListItemByHash({
    transactionHash,
  }: {
    transactionHash: string;
  }): Locator {
    const transactionListItem = this.page.locator(
      `li:has(a[href*="${transactionHash}"])`
    );
    return transactionListItem;
  }

  getTransactionStatusTextLocatorByHash({
    transactionHash,
  }: {
    transactionHash: string;
  }): Locator {
    const transactionStatusText = this.getTransactionListItemByHash({
      transactionHash,
    }).locator("> div[class*='MuiStack-root'] > div:nth-child(1) > span");

    return transactionStatusText;
  }

  async getTransactionStatusTextByHash({
    transactionHash,
  }: {
    transactionHash: string;
  }): Promise<string> {
    const transactionStatusText =
      await this.getTransactionStatusTextLocatorByHash({
        transactionHash,
      }).textContent();
    return transactionStatusText as string;
  }

  getTransactionSuccessIconByHash({
    transactionHash,
  }: {
    transactionHash: string;
  }): Locator {
    const transactionStatusSuccessIcon = this.getTransactionListItemByHash({
      transactionHash,
    }).getByTestId("TaskAltIcon");
    return transactionStatusSuccessIcon;
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
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 60000 });
    await expect.soft(this.transactionPopupStatusIcon).toBeVisible();
    await expect.soft(this.swapTransactionPopupBodyText).toBeVisible();
    await expect
      .soft(this.swapTransactionPopupBodyText)
      .toHaveText(
        `Swap ${fromAmountExpected} ${fromTokenNameExpected} for ${formatNumberDexSuccessPopup(
          Number(toAmountExpected)
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
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 60000 });
    await expect.soft(this.transactionPopupStatusIcon).toBeVisible();
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
    await expect(this.transactionPopupColumn).toBeVisible({ timeout: 60000 });
    await expect.soft(this.transactionPopupStatusIcon).toBeVisible();
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
