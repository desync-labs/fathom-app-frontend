import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { extractNumericValue } from "../utils/helpers";

export default class LendingPage extends BasePage {
  readonly path: string;
  readonly btnMax: Locator;
  readonly btnAction: Locator;
  readonly btnApproveChange: Locator;
  readonly btnApproval: Locator;
  readonly inputModal: Locator;
  readonly headingTwoAllDoneModal: Locator;
  readonly btnCloseAllDoneModal: Locator;
  readonly paragraphBorrowEmpty: Locator;
  readonly paragraphSupplyEmpty: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#/lending";

    // Locators
    this.btnMax = this.page.locator("//button[text()='Max']");
    this.btnAction = this.page.locator("[data-cy='actionButton']");
    this.btnApproveChange = this.page.locator(
      "[data-cy='approveButtonChange']"
    );
    this.btnApproval = this.page.locator("[data-cy='approvalButton']");
    this.inputModal = this.page.locator(
      "[data-cy='Modal'] input[inputMode=numeric]"
    );
    this.headingTwoAllDoneModal = this.page.locator("//h2[text()='All done!']");
    this.btnCloseAllDoneModal = this.page.locator("[data-cy='closeButton']");
    this.paragraphBorrowEmpty = this.page.locator(
      "//p[text()='Nothing borrowed yet.']"
    );
    this.paragraphSupplyEmpty = this.page.locator(
      "//p[text()='Nothing supplied yet.']"
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async repayAllBorrowedAssetsFullyIfAny(): Promise<void> {
    await this.page.waitForLoadState("load");
    const isBorrowedEmpty = await this.paragraphBorrowEmpty.isVisible();
    if (isBorrowedEmpty) {
      expect(isBorrowedEmpty).toEqual(true);
    } else {
      await this.page.waitForSelector(
        "//div[contains(@data-cy, 'dashboardBorrowedListItem')]"
      );
      const borrowedAssetsList = this.page.locator(
        "//div[contains(@data-cy, 'dashboardBorrowedListItem')]"
      );
      const borrowedAssetsCount = await borrowedAssetsList.count();
      for (let i = 0; i < borrowedAssetsCount; i++) {
        const borrowedAsset = borrowedAssetsList.nth(0);
        const repayButton = borrowedAsset.locator("//button[text()='Repay']");
        await repayButton.click();
        await this.btnMax.click();
        await this.page.waitForSelector("[data-cy='actionButton']");
        await this.btnAction.click();
        await metamask.confirmTransaction();
        await expect(this.headingTwoAllDoneModal).toBeVisible({
          timeout: 50000,
        });
        await this.btnCloseAllDoneModal.click();
        await this.page.waitForTimeout(1000);
      }
      const isBorrowedEmpty = await this.paragraphBorrowEmpty.isVisible();
      expect(isBorrowedEmpty).toEqual(true);
    }
  }

  async withdrawAllSuppliedAssetsFullyIfAny(): Promise<void> {
    await this.page.waitForLoadState("load");
    const isSuppliedEmpty = await this.paragraphSupplyEmpty.isVisible();
    if (isSuppliedEmpty) {
      expect(isSuppliedEmpty).toEqual(true);
    } else {
      await this.page.waitForSelector(
        "//div[contains(@data-cy, 'dashboardSuppliedListItem')]"
      );
      const suppliedAssetsList = this.page.locator(
        "//div[contains(@data-cy, 'dashboardSuppliedListItem')]"
      );
      const suppliedAssetsCount = await suppliedAssetsList.count();
      for (let i = 0; i < suppliedAssetsCount; i++) {
        const suppliedAsset = suppliedAssetsList.nth(0);
        const withdrawButton = suppliedAsset.locator(
          "//button[text()='Withdraw']"
        );
        await withdrawButton.click();
        await this.btnMax.click();
        await this.page.waitForSelector("[data-cy='actionButton']");
        await this.btnAction.click();
        await metamask.confirmTransaction();
        await expect(this.headingTwoAllDoneModal).toBeVisible({
          timeout: 50000,
        });
        await this.btnCloseAllDoneModal.click();
        await this.page.waitForTimeout(1000);
      }
      const isSuppliedEmpty = await this.paragraphSupplyEmpty.isVisible();
      expect(isSuppliedEmpty).toEqual(true);
    }
  }
}
