import { test, expect } from "../../fixtures/pomSynpressFixture";
import { LendingAssets, WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Lending - FXD Token Tests", () => {
  test.beforeEach(async ({ lendingPage }) => {
    await lendingPage.navigate();
    await lendingPage.connectWallet(WalletConnectOptions.Metamask);
    await lendingPage.validateConnectedWalletAddress();
    await lendingPage.repayAllBorrowedAssetsFullyIfAny();
    await lendingPage.withdrawAllSuppliedAssetsFullyIfAny();
  });

  test("Supply FXD Token when no FXD is supplied is successful", async ({
    lendingPage,
  }) => {
    const supplyAmount = 1.43;
    const assetNativeAmountBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmount,
    });
    const assetNativeAmountAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    expect(assetNativeAmountAfter).toEqual(
      assetNativeAmountBefore + supplyAmount
    );
  });

  test("Supply FXD Token when FXD is already supplied is successful", async ({
    lendingPage,
  }) => {
    // Supply token first
    const supplyAmountFirst = 1.832;
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmountFirst,
    });
    const assetNativeAmountBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    // Supply token when token is already supplied
    const supplyAmountSecond = 2;
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmountSecond,
      isSupplied: true,
    });
    const assetNativeAmountAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    expect(assetNativeAmountAfter).toEqual(
      assetNativeAmountBefore + supplyAmountSecond
    );
  });

  test("Borrow FXD Token with variable APY rate is successful", async ({
    lendingPage,
  }) => {
    // Supply token first
    const supplyAmount = 10;
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmount,
    });
    // Borrow token
    const borrowAmount = 1;
    const assetNativeAmountBorrowedBefore =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    await lendingPage.borrowAsset({
      assetName: LendingAssets.FXD,
      amount: borrowAmount,
      isStable: false,
    });
    const assetNativeAmountBorrowedAfter =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    expect(assetNativeAmountBorrowedAfter).toEqual(
      assetNativeAmountBorrowedBefore + borrowAmount
    );
  });

  test("Borrow FXD Token with stable APY rate is successful", async ({
    lendingPage,
  }) => {
    // Supply tokens first
    const supplyAmountFXD = 10;
    const supplyAmountCGO = 10;
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmountFXD,
    });
    await lendingPage.supplyAsset({
      assetName: LendingAssets.CGO,
      amount: supplyAmountCGO,
    });
    // Borrow token
    const borrowAmount = supplyAmountFXD + 1;
    const assetNativeAmountBorrowedBefore =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    await lendingPage.borrowAsset({
      assetName: LendingAssets.FXD,
      amount: borrowAmount,
      isStable: true,
    });
    const assetNativeAmountBorrowedAfter =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    expect(assetNativeAmountBorrowedAfter).toEqual(
      assetNativeAmountBorrowedBefore + borrowAmount
    );
  });

  test("Toggling FXD token APY type to variable and stable is successful", async ({
    lendingPage,
  }) => {
    // Supply tokens first
    const supplyAmountFXD = 10;
    const supplyAmountCGO = 10;
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmountFXD,
    });
    await lendingPage.supplyAsset({
      assetName: LendingAssets.CGO,
      amount: supplyAmountCGO,
    });
    // Borrow token
    const borrowAmount = 11;
    await lendingPage.borrowAsset({
      assetName: LendingAssets.FXD,
      amount: borrowAmount,
      isStable: false,
    });
    // Toggle Apy to stable and validate
    await lendingPage.toggleApyTypeAndValidate({
      assetName: LendingAssets.FXD,
    });
    // Toggle Apy to variable and validate
    await lendingPage.toggleApyTypeAndValidate({
      assetName: LendingAssets.FXD,
    });
  });

  test("Repay FXD with regular FXD partially is successfull", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
  });

  test("Repay FXD fully with fmFXD is successful", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Withdraw FXD partially is successful", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Disable FXD as collateral is successful", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Enable FXD as collateral is successful", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Withdraw FXD fully is successful", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });
});
