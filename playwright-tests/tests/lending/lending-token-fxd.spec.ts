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
    await lendingPage.navigate();
    const assetNativeAmoundBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmount,
    });
    const assetNativeAmoundAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    expect(assetNativeAmoundAfter).toEqual(
      assetNativeAmoundBefore + supplyAmount
    );
  });

  test("Supply FXD Token when FXD is already supplied is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
    const supplyAmountFirst = 1.832;
    await lendingPage.navigate();
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmountFirst,
    });
    const assetNativeAmoundBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    const supplyAmountSecond = 2;
    await lendingPage.supplyAsset({
      assetName: LendingAssets.FXD,
      amount: supplyAmountSecond,
    });
    const assetNativeAmoundAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName: LendingAssets.FXD,
      });
    expect(assetNativeAmoundAfter).toEqual(
      assetNativeAmoundBefore + supplyAmountSecond
    );
  });

  test("Borrow FXD Token when no FXD is borrowed is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
  });

  test("Borrow FXD Token when FXD is already borrowed is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
  });

  test("Change FXD Token APY type to Stable is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
  });

  test("Change FXD Token APY type to Variable is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
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
