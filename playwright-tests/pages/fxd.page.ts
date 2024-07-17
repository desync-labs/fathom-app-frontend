import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import {
  PositionData,
  type OpenPositionParams,
  GraphOperationName,
} from "../types";
import { graphAPIEndpoints } from "../fixtures/api.data";
import { extractNumericValue } from "../utils/helpers";

export default class FxdPage extends BasePage {
  readonly path: string;
  readonly btnXDCOpenPosition: Locator;
  readonly inputCollateral: Locator;
  readonly inputBorrowAmount: Locator;
  readonly btnConfirmOpenPosition: Locator;
  readonly btnMax: Locator;
  readonly btnSafeMax: Locator;
  readonly dialogOpenNewPosition: Locator;
  readonly dialogTopUpPosition: Locator;
  readonly dialogRepayPosition: Locator;
  readonly tableYourPositions: Locator;
  readonly rowLatestPosition: Locator;
  readonly idLatestPositionRow: Locator;
  readonly borrowAmountLatestPositionRow: Locator;
  readonly collateralAmountLatestPositionRow: Locator;
  readonly safetyBufferLatestPositionRow: Locator;
  readonly btnManagePositionLatestPositionRow: Locator;
  readonly btnRepayPositionDialog: Locator;
  readonly inputRepaying: Locator;
  readonly btnConfirmRepayPosition: Locator;
  readonly progressBar: Locator;
  readonly safetyBufferNumberOpenPositionDialog: Locator;
  readonly btnTopUpPositionDialog: Locator;
  readonly btnConfirmTopUpPosition: Locator;
  readonly spanFxdBorrowedResultAmountTopUp: Locator;
  readonly spanCollateralLockedResultAmountTopUp: Locator;
  readonly safetyBufferResultNumberTopUp: Locator;
  readonly btnNextPage: Locator;
  readonly btnPreviousPage: Locator;
  readonly divDialogModalPositionOpenedSuccessfully: Locator;
  readonly btnCloseModal: Locator;
  readonly doneIconModal: Locator;
  readonly headingFourModal: Locator;
  readonly spanBodyOneModal: Locator;
  readonly spanBodyTwoModal: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#";

    // Locators
    this.dialogOpenNewPosition = this.page.locator(
      '//h2[text()="Open Position"]/parent::div'
    );
    this.dialogTopUpPosition = this.page.locator(
      '//h2[text()="Top Up Position"]/parent::div'
    );
    this.dialogRepayPosition = this.page.locator(
      '//h2[text()="Repay Position"]/parent::div'
    );
    this.btnXDCOpenPosition = this.page
      .locator("//p[text()='XDC']//ancestor::tr")
      .getByText("Open position");
    this.btnConfirmOpenPosition = this.dialogOpenNewPosition.locator(
      '//button[text()="Open this position"]'
    );
    this.inputCollateral = this.page.locator(
      '//label[contains(text(), "Collateral")]/parent::div/parent::div//input'
    );
    this.inputBorrowAmount = this.page.locator(
      '//label[contains(text(), "Borrow Amount")]/parent::div/parent::div//input'
    );
    this.btnMax = this.page.getByText("Max");
    this.btnSafeMax = this.page.getByText("Safe Max");
    this.tableYourPositions = this.page.locator(
      '//h2[text()="Your Positions"]/following-sibling::div/table'
    );
    this.rowLatestPosition = this.tableYourPositions.locator(
      "tbody > tr:nth-child(1)"
    );
    this.idLatestPositionRow =
      this.rowLatestPosition.locator("td:nth-child(1)");
    this.borrowAmountLatestPositionRow =
      this.rowLatestPosition.locator("td:nth-child(4)");
    this.collateralAmountLatestPositionRow =
      this.rowLatestPosition.locator("td:nth-child(5)");
    this.safetyBufferLatestPositionRow =
      this.rowLatestPosition.locator("td:nth-child(6)");
    this.btnManagePositionLatestPositionRow = this.rowLatestPosition.locator(
      '//td[7]//button[contains(text(), "Manage position")]'
    );
    this.btnRepayPositionDialog = this.page.locator(
      '//button[text()="Repay Position"]'
    );
    this.inputRepaying = this.page.locator(
      '//label[contains(text(), "Repaying")]/parent::div/parent::div//input'
    );
    this.btnConfirmRepayPosition = this.page.locator(
      '//button[text()="Repay this position"]'
    );
    this.progressBar = this.page.locator(
      '[role="dialog"] [role="progressbar"]'
    );
    this.safetyBufferNumberOpenPositionDialog = this.page.locator(
      '//span[contains(text(), "Safety Buffer (%)")]//ancestor::li/div[2]'
    );
    this.btnTopUpPositionDialog = this.page.locator(
      '//button[text()="Top Up Position"]'
    );
    this.btnConfirmTopUpPosition = this.page.locator(
      '//button[text()="Top Up this position"]'
    );
    this.spanFxdBorrowedResultAmountTopUp = this.page.locator(
      '//span[contains(text(), "FXD Borrowed")]//ancestor::li/div[2]/span'
    );
    this.spanCollateralLockedResultAmountTopUp = this.page.locator(
      '//span[contains(text(), "Collateral Locked")]//ancestor::li/div[2]/span'
    );
    this.safetyBufferResultNumberTopUp = this.page.locator(
      '//div[contains(text(), "Safety Buffer")]//ancestor::li/div[2]'
    );
    this.btnNextPage = this.page.locator(
      'button[aria-label="Go to next page"]'
    );
    this.btnPreviousPage = this.page.locator(
      'button[aria-label="Go to previous page"]'
    );
    this.btnCloseModal = this.page.locator('button[aria-label="close"]');
    this.doneIconModal = this.page.locator('[data-testid="DoneIcon"]');
    this.headingFourModal = this.page.locator('div[role="dialog"] h1');
    this.spanBodyOneModal = this.page.locator(
      'div[role="dialog"] p[class*="MuiTypography-description"]'
    );
    this.spanBodyTwoModal = this.page.locator(
      'div[role="dialog"] span[class*="MuiTypography-body2"]'
    );
    this.divDialogModalPositionOpenedSuccessfully = this.page.locator(
      '//h4[text()="All done!"]/parent::div'
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async enterCollateralAmount(amount: number): Promise<void> {
    await this.inputCollateral.clear();
    await this.inputCollateral.fill(amount.toString());
  }

  async enterBorrowAmount(amount: number): Promise<void> {
    await this.inputBorrowAmount.clear();
    await this.inputBorrowAmount.fill(amount.toString());
  }

  async enterRepayAmount(amount: number): Promise<void> {
    await this.inputRepaying.clear();
    await this.inputRepaying.fill(amount.toString());
  }

  async confirmOpenPosition(): Promise<void> {
    await this.btnConfirmOpenPosition.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await this.page.waitForTimeout(10000);
    await metamask.confirmTransaction();
  }

  async openPosition({
    collateralAmount,
    borrowAmount,
  }: OpenPositionParams): Promise<PositionData> {
    await this.btnXDCOpenPosition.click();
    if (collateralAmount === "max") {
      await this.btnMax.click();
    } else {
      await this.enterCollateralAmount(collateralAmount);
      await this.inputCollateral.blur();
    }
    await this.page.waitForTimeout(1000);
    if (borrowAmount === "safeMax") {
      await this.btnSafeMax.click();
    } else {
      await this.enterBorrowAmount(borrowAmount);
      await this.inputBorrowAmount.blur();
    }
    const collateralAmountData = Number(
      await this.inputCollateral.getAttribute("value")
    );
    const borrowAmountData = Number(
      await this.inputBorrowAmount.getAttribute("value")
    );
    const safetyBufferString =
      await this.safetyBufferNumberOpenPositionDialog.textContent();
    const safetyBufferStringFormatted = safetyBufferString?.replace(
      /[^\d.]/g,
      ""
    );
    const safetyBufferData = Number(safetyBufferStringFormatted);
    await this.confirmOpenPosition();
    const results = await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Opening Position Pending",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.stablecoinSubgraph,
        GraphOperationName.FXDPositions
      ),
    ]);
    await this.validateOpenNewPositionDialogNotVisible();
    await this.validateNewPositionOpenedModal();
    await this.closeNewPositionOpenedModal();
    const response = await results[1].response();
    const responseBody = await response?.json();
    const positionIdData = Number(responseBody.data.positions[0].positionId);
    const positionData: PositionData = {
      positionId: positionIdData,
      collateralAmount: collateralAmountData,
      borrowAmount: borrowAmountData,
      safetyBufferPercentage: safetyBufferData,
    };
    return positionData;
  }

  async validateNewPositionOpenedModal(): Promise<void> {
    await expect.soft(this.doneIconModal).toBeVisible();
    await expect.soft(this.headingFourModal).toBeVisible();
    await expect.soft(this.headingFourModal).toHaveText("All done!");
    await expect.soft(this.spanBodyOneModal).toBeVisible();
    await expect
      .soft(this.spanBodyOneModal)
      .toHaveText("New position opened successfully!");
    await expect.soft(this.spanBodyTwoModal).toBeVisible();
    await expect
      .soft(this.spanBodyTwoModal)
      .toHaveText("Add FXD to wallet to track your balance.");
  }

  async closeNewPositionOpenedModal(): Promise<void> {
    await this.btnCloseModal.click();
    await expect(
      this.divDialogModalPositionOpenedSuccessfully
    ).not.toBeVisible();
  }

  async validateNoPositions(): Promise<void> {
    await expect(this.tableYourPositions).not.toBeVisible();
    await expect(
      this.page.getByText("You have not opened any position")
    ).toBeVisible();
  }

  async validatePositionsOnPageCount(countExpected: number): Promise<void> {
    await expect(this.tableYourPositions).toBeVisible();
    const allRowsOnPageLocators = await this.page
      .locator(
        '//h2[text()="Your Positions"]//parent::div//following-sibling::div/table/tbody/tr'
      )
      .all();
    expect(allRowsOnPageLocators.length).toEqual(countExpected);
  }

  async validateOpenNewPositionDialogNotVisible(): Promise<void> {
    await expect.soft(this.dialogOpenNewPosition).not.toBeVisible({
      timeout: 20000,
    });
  }

  async validateRepayPositionDialogNotVisible(): Promise<void> {
    await expect.soft(this.dialogRepayPosition).not.toBeVisible({
      timeout: 20000,
    });
  }

  async validateTopUpPositionDialogNotVisible(): Promise<void> {
    await expect.soft(this.dialogTopUpPosition).not.toBeVisible({
      timeout: 20000,
    });
  }

  async confirmRepayPosition(): Promise<void> {
    await this.btnConfirmRepayPosition.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await this.page.waitForTimeout(10000);
    await metamask.confirmTransaction();
  }

  async fullyCloseLatestPositionAndValidate(): Promise<boolean> {
    const latestPositionIdBeforeClose = this.idLatestPositionRow.textContent();
    await this.btnManagePositionLatestPositionRow.click();
    await this.btnRepayPositionDialog.click();
    await expect(this.inputRepaying).toBeVisible();
    await this.btnMax.click();
    await this.page.waitForTimeout(1000);
    await this.confirmRepayPosition();
    const results = await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Repay Position Pending",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Position repay successful",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.stablecoinSubgraph,
        GraphOperationName.FXDPositions
      ),
    ]);
    await this.validateRepayPositionDialogNotVisible();
    const response = await results[2].response();
    const responseBody = await response?.json();
    await this.page.waitForTimeout(3000);
    if (responseBody.data.positions.length === 0) {
      await expect(
        this.page.getByText("You have not opened any position")
      ).toBeVisible();
      return true;
    } else if (
      responseBody.data.positions[0].positionId !== latestPositionIdBeforeClose
    ) {
      const latestPositionIdAfterClose =
        await this.idLatestPositionRow.textContent();
      expect(latestPositionIdAfterClose).not.toEqual(
        latestPositionIdBeforeClose
      );
      return true;
    }
    return false;
  }

  async confirmTopUpPosition(): Promise<void> {
    await this.btnConfirmTopUpPosition.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await this.page.waitForTimeout(10000);
    await metamask.confirmTransaction();
  }

  async topUpLatestPosition({
    collateralAmount,
    borrowAmount,
  }: OpenPositionParams): Promise<PositionData> {
    await this.btnManagePositionLatestPositionRow.click();
    await this.btnTopUpPositionDialog.click();
    if (collateralAmount === "max") {
      await this.btnMax.click();
    } else {
      await this.enterCollateralAmount(collateralAmount);
      await this.inputCollateral.blur();
    }
    await this.page.waitForTimeout(1000);
    if (borrowAmount === "safeMax") {
      await this.btnSafeMax.click();
    } else {
      await this.enterBorrowAmount(borrowAmount);
      await this.inputBorrowAmount.blur();
    }
    await this.page.waitForTimeout(1000);
    const collateralAmountString =
      await this.spanCollateralLockedResultAmountTopUp.textContent();
    const collateralAmountStringFormatted = collateralAmountString?.replace(
      /[^\d.]/g,
      ""
    );
    const collateralAmountData = Number(collateralAmountStringFormatted);
    const borrowAmountString =
      await this.spanFxdBorrowedResultAmountTopUp.textContent();
    const borrowAmountStringFormatted = borrowAmountString?.replace(
      /[^\d.]/g,
      ""
    );
    const borrowAmountData = Number(borrowAmountStringFormatted);
    const safetyBufferString =
      await this.safetyBufferResultNumberTopUp.textContent();
    const safetyBufferStringFormatted = safetyBufferString?.replace(
      /[^\d.]/g,
      ""
    );
    const safetyBufferData = Number(safetyBufferStringFormatted);
    await this.confirmTopUpPosition();
    const results = await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Top Up Position Pending",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Top Up position successfully!",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.stablecoinSubgraph,
        GraphOperationName.FXDPositions
      ),
    ]);
    await this.validateTopUpPositionDialogNotVisible();
    const response = await results[2].response();
    const responseBody = await response?.json();
    const positionIdData = Number(responseBody.data.positions[0].positionId);
    const toppedUpPositionData: PositionData = {
      positionId: positionIdData,
      collateralAmount: collateralAmountData,
      borrowAmount: borrowAmountData,
      safetyBufferPercentage: safetyBufferData,
    };
    return toppedUpPositionData;
  }

  async partiallyCloseLatestPosition({
    repayAmount,
  }: {
    repayAmount: number;
  }): Promise<PositionData> {
    await this.btnManagePositionLatestPositionRow.click();
    await this.btnRepayPositionDialog.click();
    await expect(this.inputRepaying).toBeVisible();
    await this.page.waitForTimeout(1000);
    await this.enterRepayAmount(repayAmount);
    await this.page.waitForTimeout(1000);
    const collateralAmountString =
      await this.spanCollateralLockedResultAmountTopUp.textContent();
    const collateralAmountStringFormatted = collateralAmountString?.replace(
      /[^\d.]/g,
      ""
    );
    const collateralAmountData = Number(collateralAmountStringFormatted);
    const borrowAmountString =
      await this.spanFxdBorrowedResultAmountTopUp.textContent();
    const borrowAmountStringFormatted = borrowAmountString?.replace(
      /[^\d.]/g,
      ""
    );
    const borrowAmountData = Number(borrowAmountStringFormatted);
    await this.confirmRepayPosition();
    const results = await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Repay Position Pending",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Position repay successful",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.stablecoinSubgraph,
        GraphOperationName.FXDPositions
      ),
    ]);
    await this.validateRepayPositionDialogNotVisible();
    const response = await results[2].response();
    const responseBody = await response?.json();
    const positionIdData = Number(responseBody.data.positions[0].positionId);
    const safetyBufferData =
      Number(responseBody.data.positions[0].safetyBufferInPercent) * 100;
    const repaidPositionData: PositionData = {
      positionId: positionIdData,
      collateralAmount: collateralAmountData,
      borrowAmount: borrowAmountData,
      safetyBufferPercentage: safetyBufferData,
    };
    return repaidPositionData;
  }

  async validateLatestPositionDisplayedData({
    positionIdExpected,
    collateralAmountExpected,
    borrowAmountExpected,
    safetyBufferPercentageExpected,
  }: {
    positionIdExpected: number;
    collateralAmountExpected: number;
    borrowAmountExpected: number;
    safetyBufferPercentageExpected: number;
  }): Promise<void> {
    const idLatestPositionDisplayed = this.idLatestPositionRow;
    expect
      .soft(idLatestPositionDisplayed)
      .toHaveText(positionIdExpected.toString());
    const borrowAmountLatestPositionDisplayed =
      this.borrowAmountLatestPositionRow;
    const borrowAmountActual = extractNumericValue(
      (await borrowAmountLatestPositionDisplayed.textContent()) as string
    ) as number;
    expect
      .soft(Math.round(borrowAmountActual * 100) / 100)
      .toEqual(Math.round(borrowAmountExpected * 100) / 100);
    expect.soft(borrowAmountLatestPositionDisplayed).toContainText("FXD");
    const collateralAmountLatestPositionDisplayed =
      this.collateralAmountLatestPositionRow;
    const collateralAmounActual = extractNumericValue(
      (await collateralAmountLatestPositionDisplayed.textContent()) as string
    ) as number;
    expect
      .soft(Math.round(collateralAmounActual * 100) / 100)
      .toEqual(Math.round(collateralAmountExpected * 100) / 100);
    expect.soft(collateralAmountLatestPositionDisplayed).toContainText("XDC");
    const safetyBufferPercentageLatestPositionDisplayed =
      this.safetyBufferLatestPositionRow;
    const safetyBufferPercentageLatestPositionDisplayedText =
      await safetyBufferPercentageLatestPositionDisplayed.textContent();
    const safetyBufferPercentageLatestPositionNumber = extractNumericValue(
      safetyBufferPercentageLatestPositionDisplayedText as string
    );
    const safetyBuffersAbsDifference = Math.abs(
      (safetyBufferPercentageLatestPositionNumber as number) -
        safetyBufferPercentageExpected
    );
    expect.soft(safetyBuffersAbsDifference).toBeLessThanOrEqual(1);
    expect
      .soft(safetyBufferPercentageLatestPositionDisplayed)
      .toContainText("%");
    await expect.soft(this.btnManagePositionLatestPositionRow).toBeVisible();
    await expect.soft(this.btnManagePositionLatestPositionRow).toBeEnabled();
  }

  async goToNextPage(): Promise<number> {
    const results = await Promise.all([
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.stablecoinSubgraph,
        GraphOperationName.FXDPositions
      ),
      await this.btnNextPage.click(),
    ]);
    const response = await results[0].response();
    const responseBody = await response?.json();
    const positionsCountOnPageAPI = responseBody.data.positions.length;
    await this.page.waitForTimeout(1000);
    return positionsCountOnPageAPI;
  }

  async goToPreviousPage(): Promise<number> {
    const results = await Promise.all([
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.stablecoinSubgraph,
        GraphOperationName.FXDPositions
      ),
      await this.btnPreviousPage.click(),
    ]);
    const response = await results[0].response();
    const responseBody = await response?.json();
    const positionsCountOnPageAPI = responseBody.data.positions.length;
    await this.page.waitForTimeout(1000);
    return positionsCountOnPageAPI;
  }
}
