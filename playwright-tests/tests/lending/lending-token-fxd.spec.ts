import { test, expect } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
dotenv.config();

test.describe("Fathom App Test Suite: Lending - FXD Token Tests", () => {
  test.beforeEach(async ({ lendingPage }) => {
    test.setTimeout(60000 * 3);
    // TO DO - Cleanup, repay all tokens if any and withrdraw all tokens if any
    await lendingPage.navigate();
    await lendingPage.connectWallet(WalletConnectOptions.Metamask);
    await lendingPage.validateConnectedWalletAddress();
    await lendingPage.repayAllBorrowedAssetsFullyIfAny();
    await lendingPage.withdrawAllSuppliedAssetsFullyIfAny();
  });

  test("Supply FXD Token when no FXD is supplied is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
  });

  test("Supply FXD Token when FXD is already supplied is successful", async ({
    lendingPage,
  }) => {
    await lendingPage.navigate();
  });

  test("Borrow FXD Token when no FXD is borrowed is successful", async ({
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

  test("Repay FXD fully with fmFXD is successfull", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Withdraw FXD partially is successfull", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Disable FXD as collateral is successfull", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Enable FXD as collateral is successfull", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });

  test("Withdraw FXD fully is successfull", async ({ lendingPage }) => {
    await lendingPage.navigate();
  });
});
