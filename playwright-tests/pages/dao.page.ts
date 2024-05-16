import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { graphAPIEndpoints } from "../fixtures/api.data";
import { GraphOperationName } from "../types";
import { extractNumericValue } from "../utils/helpers";

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
}
