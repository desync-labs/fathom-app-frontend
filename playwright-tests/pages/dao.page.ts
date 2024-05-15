import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";

export default class DaoPage extends BasePage {
  readonly stakingPath: string;
  readonly governancePath: string;
  readonly inputStakingAmount: Locator;
  readonly inputLockPeriod: Locator;
  readonly btnStake: Locator;
  readonly myWalletBalanceFTHM: Locator;
  readonly myWalletBalanceFXD: Locator;
  readonly myWalletBalanceXDC: Locator;

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
  }

  async navigateStaking(): Promise<void> {
    await super.navigate(this.stakingPath);
  }

  async navigateGovernance(): Promise<void> {
    await super.navigate(this.governancePath);
  }
}
