import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { LendingAssets } from "../types";

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
  readonly spanLoadingActionButton: Locator;
  readonly btnVariableApyRateBorrowModal: Locator;
  readonly btnStableApyRateBorrowModal: Locator;

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
    this.spanLoadingActionButton = this.btnAction.locator(
      "span[class*='MuiCircularProgress-root']"
    );
    this.btnVariableApyRateBorrowModal = this.page.locator(
      "[data-cy='Modal'] button[value='Variable']"
    );
    this.btnStableApyRateBorrowModal = this.page.locator(
      "[data-cy='Modal'] button[value='Stable']"
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async repayAllBorrowedAssetsFullyIfAny(): Promise<void> {
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
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
        await expect(this.spanLoadingActionButton).toBeVisible();
        await expect(this.spanLoadingActionButton).not.toBeVisible({
          timeout: 10000,
        });
        const isApprovalButtonVisible = await this.btnApproval.isVisible();
        const isApproveChangeVisible = await this.btnApproveChange.isVisible();
        if (isApprovalButtonVisible && isApproveChangeVisible) {
          await this.btnApproval.click();
          await metamask.confirmDataSignatureRequest();
        } else if (isApprovalButtonVisible && !isApproveChangeVisible) {
          await this.btnApproval.click();
          await metamask.confirmPermissionToSpend();
        }
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
    await this.page.waitForTimeout(2000);
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
        await expect(this.spanLoadingActionButton).toBeVisible();
        await expect(this.spanLoadingActionButton).not.toBeVisible({
          timeout: 10000,
        });
        const isApprovalButtonVisible = await this.btnApproval.isVisible();
        const isApproveChangeVisible = await this.btnApproveChange.isVisible();
        if (isApprovalButtonVisible && isApproveChangeVisible) {
          await this.btnApproval.click();
          await metamask.confirmDataSignatureRequest();
        } else if (isApprovalButtonVisible && !isApproveChangeVisible) {
          await this.btnApproval.click();
          await metamask.confirmPermissionToSpend();
        }
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

  getDashboardSupplyListItemLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.page.locator(
      `[data-cy='dashboardSupplyListItem_${assetName}']`
    );
  }

  getDashboardSupplyListItemSupplyButtonLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardSupplyListItemLocator({ assetName }).locator(
      "button"
    );
  }

  getDashboardSupplyListItemDetailsButtonLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardSupplyListItemLocator({ assetName }).locator(
      "//a[text()='Details']"
    );
  }

  getDashboardSuppliedListItemLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.page.locator(
      `[data-cy*='dashboardSuppliedListItem_${assetName}']`
    );
  }

  getDashboardSuppliedListItemSupplyButtonLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardSuppliedListItemLocator({ assetName }).locator(
      "//button[text()='Supply']"
    );
  }

  getDashboardSuppliedListItemNativeAmountLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardSuppliedListItemLocator({ assetName }).locator(
      "[data-cy='nativeAmount']"
    );
  }

  async getSuppliedAssetNativeAmount({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Promise<number> {
    await this.page.waitForLoadState("load");
    const isSuppliedEmpty = await this.paragraphSupplyEmpty.isVisible();
    const isAssetSupplied = await this.getDashboardSuppliedListItemLocator({
      assetName,
    }).isVisible();
    if (!isSuppliedEmpty && isAssetSupplied) {
      const nativeAmount =
        await this.getDashboardSuppliedListItemNativeAmountLocator({
          assetName,
        }).innerText();
      return parseFloat(nativeAmount);
    } else {
      return 0;
    }
  }

  getDashboardBorrowListItemLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.page.locator(
      `[data-cy='dashboardBorrowListItem_${assetName}']`
    );
  }

  getDashboardBorrowListItemBorrowButtonLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardBorrowListItemLocator({ assetName }).locator(
      "button"
    );
  }

  getDashboardBorrowListItemDetailsButtonLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardBorrowListItemLocator({ assetName }).locator(
      "//a[text()='Details']"
    );
  }

  getDashboardBorrowedListItemLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.page.locator(
      `[data-cy*='dashboardBorrowedListItem_${assetName}']`
    );
  }

  getDashboardBorrowedListItemBorrowButtonLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardBorrowedListItemLocator({ assetName }).locator(
      "//button[text()='Supply']"
    );
  }

  getDashboardBorrowedListItemNativeAmountLocator({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Locator {
    return this.getDashboardBorrowedListItemLocator({ assetName }).locator(
      "[data-cy='nativeAmount']"
    );
  }

  async getBorrowedAssetNativeAmount({
    assetName,
  }: {
    assetName: LendingAssets;
  }): Promise<number> {
    await this.page.waitForLoadState("load");
    const isSuppliedEmpty = await this.paragraphSupplyEmpty.isVisible();
    const isAssetSupplied = await this.getDashboardBorrowedListItemLocator({
      assetName,
    }).isVisible();
    if (!isSuppliedEmpty && isAssetSupplied) {
      const nativeAmount =
        await this.getDashboardBorrowedListItemNativeAmountLocator({
          assetName,
        }).innerText();
      return parseFloat(nativeAmount);
    } else {
      return 0;
    }
  }

  async supplyAsset({
    assetName,
    amount,
    isSupplied,
    isMax,
  }: {
    assetName: LendingAssets;
    amount: number;
    isSupplied?: boolean;
    isMax?: boolean;
  }): Promise<void> {
    if (isSupplied) {
      await this.getDashboardSuppliedListItemSupplyButtonLocator({
        assetName,
      }).click();
    } else {
      await this.getDashboardSupplyListItemSupplyButtonLocator({
        assetName,
      }).click();
    }
    if (isMax) {
      await this.btnMax.click();
    } else {
      await this.inputModal.fill(amount.toString());
    }
    await this.page.waitForTimeout(1000);
    const isApprovalButtonVisible = await this.btnApproval.isVisible();
    const isApproveChangeVisible = await this.btnApproveChange.isVisible();
    if (isApprovalButtonVisible && isApproveChangeVisible) {
      await this.btnApproval.click();
      await metamask.confirmDataSignatureRequest();
    } else if (isApprovalButtonVisible && !isApproveChangeVisible) {
      await this.btnApproval.click();
      await metamask.confirmPermissionToSpend();
    }
    await this.btnAction.click();
    await metamask.confirmTransaction();
    await expect(this.headingTwoAllDoneModal).toBeVisible({
      timeout: 50000,
    });
    await this.btnCloseAllDoneModal.click();
    await this.page.waitForTimeout(1000);
  }

  async borrowAsset({
    assetName,
    amount,
    isBorrowed,
    isMax,
    isStable,
  }: {
    assetName: LendingAssets;
    amount: number;
    isStable: boolean;
    isBorrowed?: boolean;
    isMax?: boolean;
  }): Promise<void> {
    if (isBorrowed) {
      await this.getDashboardBorrowedListItemBorrowButtonLocator({
        assetName,
      }).click();
    } else {
      await this.getDashboardBorrowListItemBorrowButtonLocator({
        assetName,
      }).click();
    }
    if (isStable) {
      await this.btnStableApyRateBorrowModal.click();
    }
    if (isMax) {
      await this.btnMax.click();
    } else {
      await this.inputModal.fill(amount.toString());
    }
    await this.page.waitForTimeout(1000);
    const isApprovalButtonVisible = await this.btnApproval.isVisible();
    const isApproveChangeVisible = await this.btnApproveChange.isVisible();
    if (isApprovalButtonVisible && isApproveChangeVisible) {
      await this.btnApproval.click();
      await metamask.confirmDataSignatureRequest();
    } else if (isApprovalButtonVisible && !isApproveChangeVisible) {
      await this.btnApproval.click();
      await metamask.confirmPermissionToSpend();
    }
    await this.btnAction.click();
    await metamask.confirmTransaction();
    await expect(this.headingTwoAllDoneModal).toBeVisible({
      timeout: 50000,
    });
    await this.btnCloseAllDoneModal.click();
    await this.page.waitForTimeout(1000);
  }
}
