import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { graphAPIEndpoints } from "../fixtures/api.data";
import { GraphOperationName, WalletConnectOptions } from "../types";
import { extractNumericValue } from "../utils/helpers";
import { logoLinks } from "../fixtures/global.data";

export default class DaoPage extends BasePage {
  readonly stakingPath: string;
  readonly governancePath: string;
  readonly inputStakingAmount: Locator;
  readonly inputLockPeriod: Locator;
  readonly btnStake: Locator;
  readonly myWalletBalanceFTHM: Locator;
  readonly myWalletBalanceFXD: Locator;
  readonly myWalletBalanceXDC: Locator;
  readonly progressBar: Locator;
  readonly btnNextPage: Locator;
  readonly earlyUnstakeDialog: Locator;
  readonly btnConfirmUnstakeEarlyUnstakeDialog: Locator;
  readonly btnCancelEarlyUnstakeDialog: Locator;
  readonly titleEarlyUnstakeDialog: Locator;
  readonly descriptionEarlyUnstakeDialog: Locator;
  readonly requestingUnstakeContentEarlyUnstakeDialog: Locator;
  readonly totalAvailableEarlyUnstakeDialog: Locator;
  readonly penaltyFeeEarlyUnstakeDialog: Locator;
  readonly maximumReceivedEarlyUnstakeDialog: Locator;
  readonly unstakCooldownDialog: Locator;
  readonly titleUnstakeCooldownDialog: Locator;
  readonly descriptionUnstakeCooldownDialog: Locator;
  readonly coolingDownContentUnstakeCooldownDialog: Locator;
  readonly btnDaoConnectWallet: Locator;

  constructor(page: Page) {
    super(page);
    this.stakingPath = "/#/dao/staking";
    this.governancePath = "/#/dao/governance";
    this.inputStakingAmount = this.page
      .getByTestId("dao-stakingAmount-input")
      .locator("input");
    this.inputLockPeriod = this.page
      .getByTestId("dao-lockPeriod-input")
      .locator("input");
    this.btnStake = this.page.getByTestId("dao-stake-button");
    this.myWalletBalanceFTHM = this.page.getByTestId("dao-FTHM-balance");
    this.myWalletBalanceFXD = this.page.getByTestId("dao-FXD-balance");
    this.myWalletBalanceXDC = this.page.getByTestId("dao-XDC-balance");
    this.progressBar = this.page.locator("[role='progressbar']");
    this.btnNextPage = this.page.locator("[aria-label='Go to next page']");
    this.earlyUnstakeDialog = this.page.getByTestId("dao-early-unstake-dialog");
    this.btnConfirmUnstakeEarlyUnstakeDialog =
      this.page.getByText("Yes, Unstake");
    this.btnCancelEarlyUnstakeDialog = this.page.getByText("Cancel");
    this.titleEarlyUnstakeDialog = this.page.getByTestId(
      "dao-early-unstake-dialog-title"
    );
    this.descriptionEarlyUnstakeDialog = this.page.getByTestId(
      "dao-early-unstake-dialog-description"
    );
    this.requestingUnstakeContentEarlyUnstakeDialog = this.page.getByTestId(
      "dao-early-unstake-dialog-requesting-unstake-content"
    );
    this.totalAvailableEarlyUnstakeDialog = this.page.locator(
      "//p[text()='Total Available']/following-sibling::p"
    );
    this.penaltyFeeEarlyUnstakeDialog = this.page.locator(
      "//p[text()='Penalty Fee']/following-sibling::p"
    );
    this.maximumReceivedEarlyUnstakeDialog = this.page.locator(
      "//p[text()='Maximum Received']/following-sibling::p"
    );
    this.unstakCooldownDialog = this.page.getByTestId(
      "dao-unstake-cooldown-dialog"
    );
    this.titleUnstakeCooldownDialog = this.page.getByTestId(
      "dao-unstake-cooldown-dialog-title"
    );
    this.descriptionUnstakeCooldownDialog = this.page.getByTestId(
      "dao-unstake-cooldown-dialog-description"
    );
    this.coolingDownContentUnstakeCooldownDialog = this.page.getByTestId(
      "dao-unstake-cooldown-dialog-cooling-down-content"
    );
    this.btnDaoConnectWallet = this.page.getByTestId(
      "dao-connect-wallet-button"
    );
  }

  async navigateStaking(): Promise<void> {
    await super.navigate(this.stakingPath);
  }

  async navigateGovernance(): Promise<void> {
    await super.navigate(this.governancePath);
  }

  async enterStakingAmount({
    stakingAmount,
  }: {
    stakingAmount: number;
  }): Promise<void> {
    await this.inputStakingAmount.clear();
    await this.inputStakingAmount.fill(stakingAmount.toString());
  }

  async enterLockPeriod({ lockPeriod }: { lockPeriod: number }): Promise<void> {
    await this.inputLockPeriod.clear();
    await this.inputLockPeriod.fill(lockPeriod.toString());
  }

  async getMyWalletFTHMBalanceValue(): Promise<number> {
    await expect(this.myWalletBalanceFTHM).toBeVisible();
    const walletBalanceText =
      (await this.myWalletBalanceFTHM.textContent()) as string;
    const walletBalanceValue = extractNumericValue(walletBalanceText) as number;
    return walletBalanceValue;
  }

  async createStakeFTHMPosition({
    stakingAmount,
    lockPeriod,
  }: {
    stakingAmount: number;
    lockPeriod: number;
  }): Promise<number> {
    await this.enterStakingAmount({ stakingAmount });
    await this.enterLockPeriod({ lockPeriod });
    await this.btnStake.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await metamask.confirmTransaction();
    const results = await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Creating Position Pending.",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Lock position created successfully!",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.daoSubgraph,
        GraphOperationName.Stakers
      ),
    ]);
    const response = await results[2].response();
    const responseBody = await response?.json();
    const newPositionLockId =
      responseBody.data.stakers[0].lockPositions[0].lockId;
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(1000);
    return Number(newPositionLockId);
  }

  getStakedPositionLocatorByLockId({ lockId }: { lockId: number }): Locator {
    const stakedPositionLocator = this.page.getByTestId(
      `dao-position-${lockId}`
    );
    return stakedPositionLocator;
  }

  async validatePositionDataByLockId({
    lockId,
    stakingAmountExpected,
    lockedPeriodExpected,
  }: {
    lockId: number;
    stakingAmountExpected: number;
    lockedPeriodExpected: number;
  }): Promise<void> {
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(1000);
    let isPositionVisible = await this.getStakedPositionLocatorByLockId({
      lockId,
    }).isVisible();
    while (!isPositionVisible) {
      await Promise.all([
        this.btnNextPage.click(),
        this.waitForGraphRequestByOperationName(
          graphAPIEndpoints.daoSubgraph,
          GraphOperationName.Stakers
        ),
      ]);
      await this.page.waitForLoadState("load");
      await this.page.waitForTimeout(1000);
      isPositionVisible = await this.getStakedPositionLocatorByLockId({
        lockId,
      }).isVisible();
    }
    const lockedValueLocator = this.page.getByTestId(
      `dao-position-${lockId}-lockedValue`
    );
    const lockedValueText = (await lockedValueLocator.textContent()) as string;
    const lockedValue = extractNumericValue(lockedValueText);
    const votingPowerLocator = this.page.getByTestId(
      `dao-position-${lockId}-votingPowerValue`
    );
    const votingPowerText = (await votingPowerLocator.textContent()) as string;
    const votingPowerValue = extractNumericValue(votingPowerText);
    const lockingTimeLocator = this.page.getByTestId(
      `dao-position-${lockId}-lockingTimeValue`
    );
    const lockingTimeText = (await lockingTimeLocator.textContent()) as string;
    const match = lockingTimeText.match(/(\d+)\s+days/);
    const lockingDaysValue = match ? parseInt(match[1], 10) : null;
    const unstakeLockedValueLocator = this.page.getByTestId(
      `dao-position-${lockId}-unstakeLockedValue`
    );
    const unstakeLockedValueText =
      (await unstakeLockedValueLocator.textContent()) as string;
    const unstakeLockedValue = extractNumericValue(unstakeLockedValueText);
    const penaltyFeeLocator = this.page.getByTestId(
      `dao-position-${lockId}-penaltyFee`
    );
    const penaltyFeeText = (await penaltyFeeLocator.textContent()) as string;
    const cooldownInfoLocator = this.page.getByTestId(
      `dao-position-${lockId}-cooldownInfo`
    );
    const cooldownInfoText =
      (await cooldownInfoLocator.textContent()) as string;
    const earlyUnstakeButton = this.page.getByTestId(
      `dao-position-${lockId}-earlyUnstakeButton`
    );
    expect.soft(lockedValue).toEqual(stakingAmountExpected);
    expect.soft(votingPowerValue).toBeGreaterThan(0);
    expect.soft(lockingDaysValue).toEqual(lockedPeriodExpected - 1);
    expect.soft(unstakeLockedValue).toEqual(stakingAmountExpected);
    expect.soft(penaltyFeeText).toContain("Penalty Fee: Yes");
    expect.soft(cooldownInfoText).toEqual("Cooldown Period: 5 days");
    await expect.soft(earlyUnstakeButton).toBeVisible();
    await expect.soft(earlyUnstakeButton).toBeEnabled();
    await expect.soft(earlyUnstakeButton).toHaveText("Early Unstake");
  }

  getEarlyUnstakeButtonByLockId({ lockId }: { lockId: number }): Locator {
    const earlyUnstakeButton = this.page.getByTestId(
      `dao-position-${lockId}-earlyUnstakeButton`
    );
    return earlyUnstakeButton;
  }

  async clickEarlyUnstakeButtonByLockId({
    lockId,
  }: {
    lockId: number;
  }): Promise<void> {
    const earlyUnstakeButton = this.getEarlyUnstakeButtonByLockId({ lockId });
    await earlyUnstakeButton.click();
  }

  async confirmUnstakeEarlyUnstakeDialog(): Promise<void> {
    await this.btnConfirmUnstakeEarlyUnstakeDialog.click();
    await metamask.confirmTransaction();
  }

  async validateEarlyUnstakeDialog({
    stakingAmountExpected,
  }: {
    stakingAmountExpected: number;
  }): Promise<void> {
    await this.page.waitForLoadState("load");
    await expect(this.earlyUnstakeDialog).toBeVisible();
    await expect.soft(this.titleEarlyUnstakeDialog).toBeVisible();
    await expect.soft(this.titleEarlyUnstakeDialog).toHaveText("Early Unstake");
    await expect.soft(this.descriptionEarlyUnstakeDialog).toBeVisible();
    await expect
      .soft(this.descriptionEarlyUnstakeDialog)
      .toContainText("Position lock time has not yet passed - by requesting");
    await expect
      .soft(this.descriptionEarlyUnstakeDialog)
      .toContainText("Early Unstake - you will pay the penalty.");
    await expect
      .soft(this.descriptionEarlyUnstakeDialog)
      .toContainText(
        "Ensure you Claim Rewards before Unstaking so as not to lose your rewards."
      );
    await expect
      .soft(this.requestingUnstakeContentEarlyUnstakeDialog.locator("img"))
      .toBeVisible();
    await expect
      .soft(this.requestingUnstakeContentEarlyUnstakeDialog.locator("img"))
      .toHaveAttribute("src", logoLinks.daoFTHMLogo);
    await expect
      .soft(
        this.requestingUnstakeContentEarlyUnstakeDialog.locator(
          "div:nth-child(2)"
        )
      )
      .toBeVisible();
    await expect
      .soft(
        this.requestingUnstakeContentEarlyUnstakeDialog.locator(
          "div:nth-child(2)"
        )
      )
      .toHaveText("You’re requesting to unstake");
    await expect
      .soft(
        this.requestingUnstakeContentEarlyUnstakeDialog.locator(
          "div:nth-child(1)"
        )
      )
      .toBeVisible();
    await expect
      .soft(
        this.requestingUnstakeContentEarlyUnstakeDialog.locator(
          "div:nth-child(1)"
        )
      )
      .toHaveText(stakingAmountExpected.toString());
    await expect
      .soft(this.requestingUnstakeContentEarlyUnstakeDialog.locator("span"))
      .toBeVisible();
    await expect
      .soft(this.requestingUnstakeContentEarlyUnstakeDialog.locator("span"))
      .toHaveText("FTHM");
    await expect.soft(this.totalAvailableEarlyUnstakeDialog).toBeVisible();
    await expect
      .soft(this.totalAvailableEarlyUnstakeDialog)
      .toHaveText(`${stakingAmountExpected} FTHM`);
    await expect.soft(this.penaltyFeeEarlyUnstakeDialog).toBeVisible();
    await expect.soft(this.maximumReceivedEarlyUnstakeDialog).toBeVisible();
    const maximumReceivedEarlyUnstakeDialogText =
      (await this.maximumReceivedEarlyUnstakeDialog.textContent()) as string;
    const maximumReceivedEarlyUnstakeDialogValue = extractNumericValue(
      maximumReceivedEarlyUnstakeDialogText
    );
    expect
      .soft(maximumReceivedEarlyUnstakeDialogValue)
      .toBeLessThan(stakingAmountExpected);
    await expect
      .soft(this.page.getByText("Penalty fee will be applied."))
      .toBeVisible();
    await expect.soft(this.btnCancelEarlyUnstakeDialog).toBeVisible();
    await expect.soft(this.btnConfirmUnstakeEarlyUnstakeDialog).toBeVisible();
  }

  async validateConfirmEarlyUnstake({
    lockId,
  }: {
    lockId: number;
  }): Promise<void> {
    const results = await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Early Unlock Pending.",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Early unlock was successful!",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.daoSubgraph,
        GraphOperationName.Stakers
      ),
    ]);
    const response = await results[2].response();
    const responseBody = await response?.json();
    const lastPositionLockId =
      responseBody.data.stakers[0].lockPositions[0].lockId;
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(1000);
    expect.soft(lastPositionLockId).toEqual((lockId - 1).toString());
    expect
      .soft(this.page.getByTestId(`dao-position-${lockId}`))
      .not.toBeVisible();
  }

  async validateUnstakeCooldownDialog({
    stakingAmount,
  }: {
    stakingAmount: number;
  }): Promise<void> {
    await this.page.waitForLoadState("load");
    await expect(this.unstakCooldownDialog).toBeVisible();
    await expect.soft(this.titleUnstakeCooldownDialog).toBeVisible();
    await expect
      .soft(this.titleUnstakeCooldownDialog)
      .toHaveText("Unstake Cooling Down ...");
    await expect.soft(this.descriptionUnstakeCooldownDialog).toBeVisible();
    await expect
      .soft(this.descriptionUnstakeCooldownDialog)
      .toContainText(
        "You successfully requested to unstake. Now it's going to a “Cooldown\" period for 2 days. After this period, you'll be able to Withdraw it at My Stats > Ready-to-Withdraw. Learn more"
      );
    await expect
      .soft(this.coolingDownContentUnstakeCooldownDialog.locator("img"))
      .toBeVisible();
    await expect
      .soft(this.coolingDownContentUnstakeCooldownDialog.locator("img"))
      .toHaveAttribute("src", logoLinks.daoFTHMLogo);
    await expect
      .soft(
        this.coolingDownContentUnstakeCooldownDialog.locator("div:nth-child(2)")
      )
      .toBeVisible();
    await expect
      .soft(
        this.coolingDownContentUnstakeCooldownDialog.locator("div:nth-child(2)")
      )
      .toHaveText("Cooling down ...");
    await expect
      .soft(
        this.coolingDownContentUnstakeCooldownDialog.locator("div:nth-child(1)")
      )
      .toBeVisible();
    const cooldownAmountText =
      (await this.coolingDownContentUnstakeCooldownDialog
        .locator("div:nth-child(1)")
        .textContent()) as string;
    const cooldownAmountValue = extractNumericValue(cooldownAmountText);
    expect(cooldownAmountValue).toBeLessThan(stakingAmount);
    await expect
      .soft(this.coolingDownContentUnstakeCooldownDialog.locator("span"))
      .toBeVisible();
    await expect
      .soft(this.coolingDownContentUnstakeCooldownDialog.locator("span"))
      .toHaveText("FTHM");
    await expect(this.page.getByText("Back to My Positions")).toBeVisible();
  }

  async connectWalletDao(
    wallet: WalletConnectOptions,
    options?: { allAccounts: boolean }
  ): Promise<void> {
    await this.btnDaoConnectWallet.click();
    await this.page.getByText(wallet).click();
    if (options) {
      await metamask.acceptAccess(options);
    } else {
      await metamask.acceptAccess();
    }
  }
}
