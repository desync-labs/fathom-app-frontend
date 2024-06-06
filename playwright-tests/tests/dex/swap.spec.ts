import { test, expect } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
import { wxdcData, xUsdtData, xdcData } from "../../fixtures/dex.data";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
dotenv.config();

test.describe("Fathom App Test Suite: DEX Swap", () => {
  test("Swapping XDC with xUSDT is successful @smoke", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.swap({
      fromTokenData: xdcData,
      toTokenData: xUsdtData,
      fromAmount: 0.5,
    });
    await dexPage.validateSwapSuccessPopup({
      fromAmountExpected: expectedData.fromAmountExpected,
      fromTokenNameExpected: expectedData.fromTokenNameExpected,
      toAmountExpected: expectedData.toAmountExpected,
      toTokenNameExpected: expectedData.toTokenNameExpected,
    });
  });

  test("Wrapping XDC to WXDC is successful @smoke", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.wrap({
      fromTokenData: xdcData,
      toTokenData: wxdcData,
      fromAmount: 0.05,
    });
    await dexPage.validateWrapSuccessPopup({
      fromAmountExpected: expectedData.fromAmountExpected,
      fromTokenNameExpected: expectedData.fromTokenNameExpected,
      toAmountExpected: expectedData.toAmountExpected,
      toTokenNameExpected: expectedData.toTokenNameExpected,
    });
  });

  test("Unwrapping WXDC to XDC is successful @smoke", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.wrap({
      fromTokenData: wxdcData,
      toTokenData: xdcData,
      fromAmount: 0.05,
    });
    await dexPage.validateUnwrapSuccessPopup({
      fromAmountExpected: expectedData.fromAmountExpected,
      fromTokenNameExpected: expectedData.fromTokenNameExpected,
      toAmountExpected: expectedData.toAmountExpected,
      toTokenNameExpected: expectedData.toTokenNameExpected,
    });
  });

  test("Swap: 'Insufficient balance' is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = wxdcData;
    const tokenTo = xUsdtData;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenData: tokenFrom });
    await dexPage.selectToToken({ tokenData: tokenTo });
    const fromBalance = await dexPage.getFromBalance();
    await dexPage.page.waitForTimeout(2000);
    await dexPage.fillFromValue({ inputValue: fromBalance + 1 });
    await expect(dexPage.swapButton).toBeVisible({ timeout: 20000 });
    await expect(dexPage.swapButton).toHaveText(`Insufficient WXDC balance`);
    await expect(dexPage.swapButton).toBeDisabled();
  });

  test("Wrap: 'Insufficient balance' is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = xdcData;
    const tokenTo = wxdcData;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenData: tokenFrom });
    await dexPage.selectToToken({ tokenData: tokenTo });
    await dexPage.page.waitForTimeout(2000);
    const fromBalance = await dexPage.getFromBalance();
    await dexPage.fillFromValue({ inputValue: fromBalance + 1 });
    await expect(dexPage.wrapButton).toBeVisible({ timeout: 20000 });
    await expect(dexPage.wrapButton).toHaveText(
      `Insufficient ${tokenFrom.name} balance`
    );
    await expect(dexPage.wrapButton).toBeDisabled();
  });

  test("Wallet not connected state layout is correct, dex connect wallet functionality is successful", async ({
    dexPage,
  }) => {
    const tokenFrom = xdcData;
    const tokenTo = xUsdtData;
    await dexPage.navigate();
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.selectFromToken({ tokenData: tokenFrom });
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.selectToToken({ tokenData: tokenTo });
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.fillFromValue({ inputValue: 1 });
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.fillToValue({ inputValue: 1 });
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.swapConnectWalletButton.click();
    await dexPage.page.getByText("Metamask").click();
    await metamask.acceptAccess();
    await dexPage.validateConnectedWalletAddress();
  });

  test("Swap: 'Enter an amount' is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = xdcData;
    const tokenTo = xUsdtData;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenData: tokenFrom });
    await dexPage.selectToToken({ tokenData: tokenTo });
    await expect(dexPage.swapButton).toBeVisible();
    await expect(dexPage.swapButton).toHaveText(`Enter an amount`);
    await expect(dexPage.swapButton).toBeDisabled();
  });

  test("Wrap: 'Enter an amount' is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = xdcData;
    const tokenTo = wxdcData;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenData: tokenFrom });
    await dexPage.selectToToken({ tokenData: tokenTo });
    await expect(dexPage.wrapButton).toBeVisible();
    await expect(dexPage.wrapButton).toHaveText(`Enter an amount`);
    await expect(dexPage.wrapButton).toBeDisabled();
  });
});
