import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { graphAPIEndpoints } from "../fixtures/api.data";
import { GraphOperationName } from "../types";

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
    this.progressBar = this.page.locator('[role="progressbar"]');
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

  async createStakeFTHMPosition({
    stakingAmount,
    lockPeriod,
  }: {
    stakingAmount: number;
    lockPeriod: number;
  }): Promise<string> {
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
    return newPositionLockId;
  }
}
