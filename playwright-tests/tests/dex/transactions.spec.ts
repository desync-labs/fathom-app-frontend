import { test, expect } from "../../fixtures/pomSynpressFixture";
import { DexTabs, WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
import { wxdcData, xUsdtData, xdcData } from "../../fixtures/dex.data";
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
    ).toBeVisible({ timeout: 10000 });
    const transactionStatusTextActual =
      await dexPage.getTransactionStatusTextByHash({
        transactionHash,
      });
    expect
      .soft(transactionStatusTextActual)
      .toContain(`Swap ${expectedData.fromAmountExpected} WXDC for`);
    expect.soft(transactionStatusTextActual).toContain(`USDTx`);
    expect.soft(transactionStatusTextActual).toContain(`seconds ago`);
    expect
      .soft(dexPage.getTransactionSuccessIconByHash({ transactionHash }))
      .toBeVisible();
  });

  test.skip("Successful Wrap transaction is correctly displayed in transactions page", async ({
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
    ).toBeVisible({ timeout: 10000 });
    const transactionStatusTextActual =
      await dexPage.getTransactionStatusTextByHash({
        transactionHash,
      });
    expect
      .soft(transactionStatusTextActual)
      .toContain(
        `Wrap ${expectedData.fromAmountExpected} ${expectedData.fromTokenNameExpected} to ${expectedData.toTokenNameExpected}`
      );
    expect
      .soft(dexPage.getTransactionSuccessIconByHash({ transactionHash }))
      .toBeVisible();
  });

  test.skip("Successful Unwrap transaction is correctly displayed in transactions page", async ({
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
    expect
      .soft(dexPage.getTransactionSuccessIconByHash({ transactionHash }))
      .toBeVisible();
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
