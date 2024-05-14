import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";

export default class DaoPage extends BasePage {
  readonly stakingPath: string;
  readonly governancePath: string;

  constructor(page: Page) {
    super(page);
    this.stakingPath = "/#/dao/staking";
    this.governancePath = "/#/dao/governance";
  }

  async navigateStaking(): Promise<void> {
    await super.navigate(this.stakingPath);
  }

  async navigateGovernance(): Promise<void> {
    await super.navigate(this.governancePath);
  }
}
