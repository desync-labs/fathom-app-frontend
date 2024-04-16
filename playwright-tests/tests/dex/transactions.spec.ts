import { test, expect } from "../../fixtures/pomSynpressFixture";
import { DexTabs, WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
import { wxdcData, xUsdtData, xdcData } from "../../fixtures/dex.data";
import { formatNumberToFixedLength } from "../../utils/helpers";
dotenv.config();

test.describe("Fathom App Test Suite: DEX Transactions", () => {
  test("Successful Swap transaction is correctly displayed in transactions page @smoke", async ({
    dexPage,
  }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.swap({
      fromTokenData: xdcData,
      toTokenData: xUsdtData,
      fromAmount: 0.5,
    });
    const transactionHash =
      await dexPage.getCompletedTransactionHashFromPopup();
    await dexPage.openTab({ tabName: DexTabs.Transactions });
    await expect(
      dexPage.getTransactionStatusTextLocatorByHash({ transactionHash })
    ).toBeVisible({ timeout: 5000 });
    const transactionStatusTextActual =
      await dexPage.getTransactionStatusTextByHash({
        transactionHash,
      });
    expect
      .soft(transactionStatusTextActual)
      .toContain(
        `Swap ${expectedData.fromAmountExpected} ${
          expectedData.fromTokenNameExpected
        } for ${formatNumberToFixedLength(expectedData.toAmountExpected)} ${
          expectedData.toTokenNameExpected
        }`
      );
  });

  test("Successful Wrap transaction is correctly displayed in transactions page", async ({
    dexPage,
  }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.wrap({
      fromTokenData: xdcData,
      toTokenData: wxdcData,
      fromAmount: 0.01,
    });
    const transactionHash =
      await dexPage.getCompletedTransactionHashFromPopup();
    await dexPage.openTab({ tabName: DexTabs.Transactions });
    await expect(
      dexPage.getTransactionStatusTextLocatorByHash({ transactionHash })
    ).toBeVisible({ timeout: 5000 });
    const transactionStatusTextActual =
      await dexPage.getTransactionStatusTextByHash({
        transactionHash,
      });
    expect
      .soft(transactionStatusTextActual)
      .toContain(
        `Wrap ${expectedData.fromAmountExpected} ${expectedData.fromTokenNameExpected} to ${expectedData.toTokenNameExpected}`
      );
  });

  test("Successful Unwrap transaction is correctly displayed in transactions page", async ({
    dexPage,
  }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.wrap({
      fromTokenData: wxdcData,
      toTokenData: xdcData,
      fromAmount: 0.01,
    });
    const transactionHash =
      await dexPage.getCompletedTransactionHashFromPopup();
    await dexPage.openTab({ tabName: DexTabs.Transactions });
    await expect(
      dexPage.getTransactionStatusTextLocatorByHash({ transactionHash })
    ).toBeVisible({ timeout: 5000 });
    const transactionStatusTextActual =
      await dexPage.getTransactionStatusTextByHash({
        transactionHash,
      });
    expect
      .soft(transactionStatusTextActual)
      .toContain(
        `Unwrap ${expectedData.fromAmountExpected} ${expectedData.fromTokenNameExpected} to ${expectedData.toTokenNameExpected}`
      );
  });

  test("Transactions tab disconnected state layout is correct", async ({
    dexPage,
  }) => {
    await dexPage.navigate();
    await expect(
      dexPage.page.locator('main nav > a[href="#/swap/transactions"]')
    ).not.toBeVisible();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.openTab({ tabName: DexTabs.Transactions });
  });
});
