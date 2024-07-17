import { test } from "../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: FXD Positions Operations", () => {
  test.describe.serial("Scenario 1 @smoke", () => {
    test("Creating a position with 100 collateral and safe max borrow amount is successful", async ({
      fxdPage,
    }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      const positionData = await fxdPage.openPosition({
        collateralAmount: 100,
        borrowAmount: "safeMax",
      });
      await fxdPage.page.waitForTimeout(5000);
      await fxdPage.validateLatestPositionDisplayedData({
        positionIdExpected: positionData.positionId,
        borrowAmountExpected: positionData.borrowAmount,
        collateralAmountExpected: positionData.collateralAmount,
        safetyBufferPercentageExpected: positionData.safetyBufferPercentage,
      });
    });

    test("Fully repaying a newly created position is successful", async ({
      fxdPage,
    }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      await fxdPage.fullyCloseLatestPositionAndValidate();
    });
  });

  test.describe.serial("Scenario 2", () => {
    test("Creating a position with 150 collateral and 1 borrow amount is successful", async ({
      fxdPage,
    }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      const positionData = await fxdPage.openPosition({
        collateralAmount: 150,
        borrowAmount: 1,
      });
      await fxdPage.page.waitForTimeout(5000);
      await fxdPage.validateLatestPositionDisplayedData({
        positionIdExpected: positionData.positionId,
        borrowAmountExpected: positionData.borrowAmount,
        collateralAmountExpected: positionData.collateralAmount,
        safetyBufferPercentageExpected: positionData.safetyBufferPercentage,
      });
    });

    test("Topping up a position is successful", async ({ fxdPage }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      const toppedUpPositionData = await fxdPage.topUpLatestPosition({
        collateralAmount: 60,
        borrowAmount: 1,
      });
      await fxdPage.page.waitForTimeout(5000);
      await fxdPage.validateLatestPositionDisplayedData({
        positionIdExpected: toppedUpPositionData.positionId,
        borrowAmountExpected: toppedUpPositionData.borrowAmount,
        collateralAmountExpected: toppedUpPositionData.collateralAmount,
        safetyBufferPercentageExpected:
          toppedUpPositionData.safetyBufferPercentage,
      });
    });

    test("Fully repaying a topped up position is successful", async ({
      fxdPage,
    }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      await fxdPage.fullyCloseLatestPositionAndValidate();
    });
  });

  test.describe.serial("Scenario 3", () => {
    test("Creating a position with 105.5 collateral and 1.5 borrow amount is successful", async ({
      fxdPage,
    }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      const positionData = await fxdPage.openPosition({
        collateralAmount: 105.5,
        borrowAmount: 1.5,
      });
      await fxdPage.page.waitForTimeout(5000);
      await fxdPage.validateLatestPositionDisplayedData({
        positionIdExpected: positionData.positionId,
        borrowAmountExpected: positionData.borrowAmount,
        collateralAmountExpected: positionData.collateralAmount,
        safetyBufferPercentageExpected: positionData.safetyBufferPercentage,
      });
    });

    test("Partially repaying a position is successful", async ({ fxdPage }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      const positionData = await fxdPage.partiallyCloseLatestPosition({
        repayAmount: 0.5,
      });
      await fxdPage.page.waitForTimeout(5000);
      await fxdPage.validateLatestPositionDisplayedData({
        positionIdExpected: positionData.positionId,
        borrowAmountExpected: positionData.borrowAmount,
        collateralAmountExpected: positionData.collateralAmount,
        safetyBufferPercentageExpected: positionData.safetyBufferPercentage,
      });
    });

    test("Fully repaying a partially repaid position is successful", async ({
      fxdPage,
    }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      await fxdPage.fullyCloseLatestPositionAndValidate();
    });
  });

  test("Switching Metamask accounts is succesfull and correctly updates the positions list", async ({
    fxdPage,
  }) => {
    // Import accounts
    // Account 3
    await metamask.importAccount(process.env.METAMASK_TEST_ONE_PRIVATE_KEY);
    // Account 4
    await metamask.importAccount(process.env.METAMASK_TEST_TWO_PRIVATE_KEY);
    // Switch to first account with positions and validate
    await metamask.switchAccount("Account 3");
    await fxdPage.navigate();
    await fxdPage.connectWallet(WalletConnectOptions.Metamask, {
      allAccounts: true,
    });
    await fxdPage.validateConnectedWalletAddress();
    await fxdPage.validatePositionsOnPageCount(4);
    // Switch to second account without any position and validate
    await metamask.switchAccount("Account 4");
    await fxdPage.validateConnectedWalletAddress();
    await fxdPage.validateNoPositions();
    // Switch back to first account with positions again and validate
    await metamask.switchAccount("Account 3");
    await fxdPage.validateConnectedWalletAddress();
    await fxdPage.validatePositionsOnPageCount(4);
  });

  test("Changing positions pages is successful and position list is correctly updated", async ({
    fxdPage,
  }) => {
    await metamask.importAccount(process.env.METAMASK_TEST_ONE_PRIVATE_KEY);
    await fxdPage.navigate();
    await fxdPage.connectWallet(WalletConnectOptions.Metamask);
    await fxdPage.validateConnectedWalletAddress();
    await fxdPage.validatePositionsOnPageCount(4);
    const countExpectedNextPage = await fxdPage.goToNextPage();
    await fxdPage.validatePositionsOnPageCount(countExpectedNextPage);
    const countExpectedSecondPage = await fxdPage.goToPreviousPage();
    await fxdPage.validatePositionsOnPageCount(countExpectedSecondPage);
  });
});
