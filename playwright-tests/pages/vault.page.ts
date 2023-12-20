import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
import { extractNumericValue, transformToSameDecimals } from "../utils/helpers";
import {
  GraphOperationName,
  ValidateVaultDataParams,
  VaultDepositData,
  VaultDetailsTabs,
  VaultFilterName,
} from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { graphAPIEndpoints } from "../fixtures/api.data";
export default class VaultPage extends BasePage {
  readonly path: string;
  readonly dialogManageVault: Locator;
  readonly spanDepositedValueAfterManageVaultDialog: Locator;
  readonly spanPoolShareValueAfterManageVaultDialog: Locator;
  readonly spanShareTokensValueAfterManageVaultDialog: Locator;
  readonly inputDepositAmount: Locator;
  readonly inputReceiveSharesTokenAmount: Locator;
  readonly inputWithdrawAmount: Locator;
  readonly inputBurnSharesTokenAmount: Locator;
  readonly btnMax: Locator;
  readonly btnConfirmDepositManageDialogModal: Locator;
  readonly btnCloseManageDialogModal: Locator;
  readonly btnConfirmWithdrawManageDialogModal: Locator;
  readonly btnLiveNow: Locator;
  readonly btnFinished: Locator;
  readonly progressBar: Locator;
  readonly divDialogModalPositionOpenedSuccessfully: Locator;
  readonly btnCloseModal: Locator;
  readonly doneIconModal: Locator;
  readonly headingFourModal: Locator;
  readonly spanBodyOneModal: Locator;
  readonly spanBodyTwoModal: Locator;
  readonly btnDepositNavManageDialogModal: Locator;
  readonly btnWithdrawNavManageDialogModal: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#/vault";

    // Locators
    this.dialogManageVault = this.page.locator(
      '//h2[text()="Manage Vault"]/parent::div'
    );
    this.spanDepositedValueAfterManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Deposited")]//ancestor::li/div[2]/span'
    );
    this.spanPoolShareValueAfterManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Pool share")]//ancestor::li/div[2]/span'
    );
    this.spanShareTokensValueAfterManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Share tokens")]//ancestor::li/div[2]/span'
    );
    this.inputDepositAmount = this.page.locator(
      '//label[contains(text(), "Deposit")]/parent::div//input'
    );
    this.inputReceiveSharesTokenAmount = this.page.locator(
      '//label[contains(text(), "Receive Shares")]/parent::div//input'
    );
    this.inputWithdrawAmount = this.page.locator(
      '//label[contains(text(), "Withdraw")]/parent::div//input'
    );
    this.inputBurnSharesTokenAmount = this.page.locator(
      '//label[contains(text(), "Burn Shares")]/parent::div//input'
    );
    this.btnMax = this.page.getByText("Max");
    this.btnConfirmDepositManageDialogModal = this.dialogManageVault.locator(
      '//button[text()="Deposit"][@type="submit"]'
    );
    this.btnConfirmWithdrawManageDialogModal = this.dialogManageVault.locator(
      '//button[text()="Withdraw"][@type="submit"]'
    );
    this.btnCloseManageDialogModal = this.dialogManageVault.locator(
      '//button[text()="Close"]'
    );
    this.btnLiveNow = this.page.locator(
      '//button[contains(text(), "Live Now")]'
    );
    this.btnFinished = this.page.locator(
      '//button[contains(text(), "Finished")]'
    );
    this.progressBar = this.page.locator('[role="progressbar"]');
    this.btnCloseModal = this.page.locator('button[aria-label="close"]');
    this.doneIconModal = this.page.locator('[data-testid="DoneIcon"]');
    this.headingFourModal = this.page.locator('div[role="dialog"] h4');
    this.spanBodyOneModal = this.page.locator(
      'div[role="dialog"] p[class*="MuiTypography-body1"]'
    );
    this.spanBodyTwoModal = this.page.locator(
      'div[role="dialog"] span[class*="MuiTypography-body2"]'
    );
    this.divDialogModalPositionOpenedSuccessfully = this.page.locator(
      '//h4[text()="All done!"]/parent::div'
    );
    this.btnDepositNavManageDialogModal = this.dialogManageVault.locator(
      '//button[text()="Deposit"][not(@type="submit")]'
    );
    this.btnWithdrawNavManageDialogModal = this.dialogManageVault.locator(
      '//button[text()="Withdraw"]'
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  getVaultRowLocatorById(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${id}"]`);
  }

  getVaultRowDetailsLocatorById(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRowDetails-${id}"]`);
  }

  getActionButtonRowLocatorById(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${id}-depositButton"]`);
  }

  getManageVaultButtonRowDetailsLocatorById(id: string): Locator {
    return this.page.locator(
      `[data-testid="vaultRowDetails-${id}-managePositionButton"]`
    );
  }

  async getTvlVaultRowValue(id: string): Promise<number | null> {
    const tvlValue = await this.page
      .locator(`[data-testid="vaultRow-${id}-tvlValueCell"] > div`)
      .textContent();
    if (tvlValue !== null) {
      return extractNumericValue(tvlValue);
    } else {
      return null;
    }
  }

  async getAvailableVaultRowValue(id: string): Promise<number | null> {
    const availableValue = await this.page
      .locator(`[data-testid="vaultRow-${id}-availableValueCell"] > div`)
      .textContent();
    if (availableValue !== null) {
      return extractNumericValue(availableValue);
    } else {
      return null;
    }
  }

  async getStakedVaultRowValue(id: string): Promise<number | null> {
    const stakedValue = await this.page
      .locator(
        `[data-testid="vaultRow-${id}-stakedValueCell"] div[class*="value"]`
      )
      .textContent();
    if (stakedValue !== null) {
      return extractNumericValue(stakedValue);
    } else {
      return null;
    }
  }

  async getPooledVaultRowDetailsValue(id: string): Promise<number | null> {
    const pooledValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${id}-itemPositionInfo-earningDetails-pooledValue"]`
      )
      .textContent();
    if (pooledValue !== null) {
      return extractNumericValue(pooledValue);
    } else {
      return null;
    }
  }

  async getYourShareVaultRowDetailsValue(id: string): Promise<number | null> {
    const yourShareValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${id}-itemPositionInfo-earningDetails-yourShareValue"]`
      )
      .textContent();
    if (yourShareValue !== null) {
      return extractNumericValue(yourShareValue);
    } else {
      return null;
    }
  }

  async getShareTokenVaultRowDetailsValue(id: string): Promise<number | null> {
    const shareTokenValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${id}-itemPositionInfo-earningDetails-shareTokenValue"]`
      )
      .textContent();
    if (shareTokenValue !== null) {
      return extractNumericValue(shareTokenValue);
    } else {
      return null;
    }
  }

  getExtendDetailsButtonVaultRow(id: string): Locator {
    return this.page.locator(`vaultRow-${id}-extendButton`);
  }

  getHideDetailsButtonVaultRow(id: string): Locator {
    return this.page.locator(`vaultRow-${id}-hideButton`);
  }

  async toggleFilter(filterName: VaultFilterName): Promise<void> {
    await expect.soft(this.btnLiveNow).toBeVisible();
    await expect.soft(this.btnFinished).toBeVisible();
    if (
      filterName === VaultFilterName.LiveNow &&
      (await this.btnLiveNow.getAttribute("aria-pressed")) === "false"
    ) {
      await this.btnLiveNow.click();
      expect(await this.btnLiveNow.getAttribute("aria-pressed")).toEqual(
        "true"
      );
    }
    if (
      filterName === VaultFilterName.Finished &&
      (await this.btnFinished.getAttribute("aria-pressed")) === "false"
    ) {
      await this.btnFinished.click();
      expect(await this.btnFinished.getAttribute("aria-pressed")).toEqual(
        "true"
      );
    }
  }

  async extendVaultDetails(id: string): Promise<void> {
    await this.page.waitForLoadState("load");
    await expect(this.getVaultRowLocatorById(id)).toBeVisible();
    if (await this.getExtendDetailsButtonVaultRow(id).isVisible()) {
      await this.getExtendDetailsButtonVaultRow(id).click();
      expect(this.getVaultRowDetailsLocatorById(id)).toBeVisible();
    }
  }

  async hideVaultDetails(id: string): Promise<void> {
    await this.page.waitForSelector(`vaultRow-${id}-extendButton`);
    await this.page.waitForSelector(`vaultRow-${id}-hideButton`);
    if (await this.getHideDetailsButtonVaultRow(id).isVisible()) {
      await this.getHideDetailsButtonVaultRow(id).click();
      expect(this.getVaultRowDetailsLocatorById(id)).not.toBeVisible();
    }
  }

  async enterDepositAmount(amount: number): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.inputDepositAmount.clear();
    await this.inputDepositAmount.fill(amount.toString());
  }

  async enterWithdrawAmount(amount: number): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.inputWithdrawAmount.clear();
    await this.inputWithdrawAmount.fill(amount.toString());
  }

  async confirmDeposit(): Promise<void> {
    await this.btnConfirmDepositManageDialogModal.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await metamask.confirmTransaction();
  }

  async confirmWithdraw(): Promise<void> {
    await this.btnConfirmWithdrawManageDialogModal.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await metamask.confirmTransaction();
  }

  async validateManagePositionDialogNotVisible(): Promise<void> {
    await expect.soft(this.dialogManageVault).not.toBeVisible({
      timeout: 20000,
    });
  }

  async validateDepositSuccessfulModal(): Promise<void> {
    await expect.soft(this.doneIconModal).toBeVisible();
    await expect.soft(this.headingFourModal).toBeVisible();
    await expect.soft(this.headingFourModal).toHaveText("All done!");
    await expect.soft(this.spanBodyOneModal).toBeVisible();
    await expect
      .soft(this.spanBodyOneModal)
      .toHaveText("Deposit was successful!");
    await expect.soft(this.spanBodyTwoModal).toBeVisible();
    await expect
      .soft(this.spanBodyTwoModal)
      .toHaveText("Add Vault Shares FXD to wallet to track your balance.");
  }

  async closeDepositSuccessfuldModal(): Promise<void> {
    await this.btnCloseModal.click();
    await expect(
      this.divDialogModalPositionOpenedSuccessfully
    ).not.toBeVisible();
  }

  async clickVaultDetailsTab(
    id: string,
    tabName: VaultDetailsTabs
  ): Promise<void> {
    await this.getVaultRowDetailsLocatorById(id)
      .locator(`//button[text()="${tabName}"]`)
      .click();
  }

  async depositVault({
    id,
    depositAmount,
  }: {
    id: string;
    depositAmount: number;
  }): Promise<VaultDepositData> {
    await this.toggleFilter(VaultFilterName.LiveNow);
    await this.extendVaultDetails(id);
    await this.clickVaultDetailsTab(id, VaultDetailsTabs.YourPosition);
    await this.getManageVaultButtonRowDetailsLocatorById(id).click();
    await expect(this.dialogManageVault).toBeVisible();
    await this.btnDepositNavManageDialogModal.click();
    await this.enterDepositAmount(depositAmount);
    await this.page.waitForTimeout(2000);
    const depositedValueAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueAfter: number | null;
    let poolShareValueAfter: number | null;
    let shareTokensValueAfter: number | null;
    if (
      depositedValueAfterText !== null &&
      poolShareValueAfterText !== null &&
      shareTokensValueAfterText !== null
    ) {
      depositedValueAfter = extractNumericValue(depositedValueAfterText);
      poolShareValueAfter = extractNumericValue(poolShareValueAfterText);
      shareTokensValueAfter = extractNumericValue(shareTokensValueAfterText);
    } else {
      depositedValueAfter = null;
      poolShareValueAfter = null;
      shareTokensValueAfter = null;
    }
    const vaultDepositDataExpected: VaultDepositData = {
      stakedAmount: depositedValueAfter,
      poolShare: poolShareValueAfter,
      shareTokens: shareTokensValueAfter,
    };
    await this.confirmDeposit();
    await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Handling New Deposit Pending",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.Vaults
      ),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.AccountVaultPositions
      ),
    ]);
    await this.validateManagePositionDialogNotVisible();
    await this.validateDepositSuccessfulModal();
    await this.closeDepositSuccessfuldModal();
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    return vaultDepositDataExpected;
  }

  async validateVaultData({
    id,
    stakedAmount,
    poolShare,
    shareTokens,
  }: ValidateVaultDataParams): Promise<void> {
    const stakedAmountActual = await this.getStakedVaultRowValue(id);
    const pooledValueActual = await this.getPooledVaultRowDetailsValue(id);
    const yourShareValueActual = await this.getYourShareVaultRowDetailsValue(
      id
    );
    const shareTokenValueActual = await this.getShareTokenVaultRowDetailsValue(
      id
    );
    expect.soft(stakedAmountActual).toEqual(Number(stakedAmount?.toFixed(2)));
    expect.soft(pooledValueActual).toEqual(stakedAmount);
    if (poolShare !== null && yourShareValueActual !== null) {
      expect
        .soft(transformToSameDecimals(poolShare, yourShareValueActual))
        .toEqual(poolShare);
    } else {
      throw Error("One of extracted values is null");
    }
    expect.soft(shareTokenValueActual).toEqual(shareTokens);
  }

  async withdrawVaultPartially({
    id,
    withdrawAmount,
  }: {
    id: string;
    withdrawAmount: number;
  }): Promise<VaultDepositData> {
    await this.toggleFilter(VaultFilterName.LiveNow);
    await this.extendVaultDetails(id);
    await this.clickVaultDetailsTab(id, VaultDetailsTabs.YourPosition);
    await this.getManageVaultButtonRowDetailsLocatorById(id).click();
    await expect(this.dialogManageVault).toBeVisible();
    await this.btnWithdrawNavManageDialogModal.click();
    await this.enterWithdrawAmount(withdrawAmount);
    await this.page.waitForTimeout(2000);
    const depositedValueAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueAfter: number | null;
    let poolShareValueAfter: number | null;
    let shareTokensValueAfter: number | null;
    if (
      depositedValueAfterText !== null &&
      poolShareValueAfterText !== null &&
      shareTokensValueAfterText !== null
    ) {
      depositedValueAfter = extractNumericValue(depositedValueAfterText);
      poolShareValueAfter = extractNumericValue(poolShareValueAfterText);
      shareTokensValueAfter = extractNumericValue(shareTokensValueAfterText);
    } else {
      depositedValueAfter = null;
      poolShareValueAfter = null;
      shareTokensValueAfter = null;
    }
    const vaultDepositDataExpected: VaultDepositData = {
      stakedAmount: depositedValueAfter,
      poolShare: poolShareValueAfter,
      shareTokens: shareTokensValueAfter,
    };
    await this.confirmWithdraw();
    await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Handling Withdraw Rewards Pending",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Withdraw was successful!",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.Vaults
      ),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.AccountVaultPositions
      ),
    ]);
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    return vaultDepositDataExpected;
  }
}
