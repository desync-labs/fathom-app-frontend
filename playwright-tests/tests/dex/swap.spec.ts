import { test, expect } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
import { tokenIds } from "../../fixtures/dex.data";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
dotenv.config();

test.describe("Fathom App Test Suite: DEX Swap", () => {
  test("Swapping XDC with xUSDT is successful @smoke", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.swap({
      fromToken: tokenIds.XDC,
      toToken: tokenIds.xUSDT,
      fromAmount: 0.025,
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
      fromToken: tokenIds.XDC,
      toToken: tokenIds.WXDC,
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
      fromToken: tokenIds.WXDC,
      toToken: tokenIds.XDC,
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
    const tokenFrom = tokenIds.WXDC;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenId: tokenFrom });
    await dexPage.selectToToken({ tokenId: tokenIds.xUSDT });
    const fromBalance = await dexPage.getFromBalance();
    await dexPage.fillFromValue({ inputValue: fromBalance + 1 });
    await expect(dexPage.swapButton).toBeVisible();
    await expect(dexPage.swapButton).toHaveText(`Insufficient WXDC balance`);
    await expect(dexPage.swapButton).toBeDisabled();
  });

  test("Wrap: 'Insufficient balance' is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = tokenIds.XDC;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenId: tokenFrom });
    await dexPage.selectToToken({ tokenId: tokenIds.WXDC });
    await dexPage.page.waitForTimeout(2000);
    const fromBalance = await dexPage.getFromBalance();
    await dexPage.fillFromValue({ inputValue: fromBalance + 1 });
    await expect(dexPage.wrapButton).toBeVisible();
    await expect(dexPage.wrapButton).toHaveText(
      `Insufficient ${tokenFrom} balance`
    );
    await expect(dexPage.wrapButton).toBeDisabled();
  });

  test("Wallet not connected state layout is correct, dex connect wallet functionality is successful", async ({
    dexPage,
  }) => {
    const tokenFrom = tokenIds.XDC;
    await dexPage.navigate();
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.selectFromToken({ tokenId: tokenFrom });
    await expect(dexPage.swapConnectWalletButton).toBeVisible();
    await expect(dexPage.swapConnectWalletButton).toHaveText("Connect Wallet");
    await dexPage.selectToToken({ tokenId: tokenIds.xUSDT });
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
    const tokenFrom = tokenIds.XDC;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenId: tokenFrom });
    await dexPage.selectToToken({ tokenId: tokenIds.xUSDT });
    await expect(dexPage.swapButton).toBeVisible();
    await expect(dexPage.swapButton).toHaveText(`Enter an amount`);
    await expect(dexPage.swapButton).toBeDisabled();
  });

  test("Wrap: 'Enter an amount' is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = tokenIds.XDC;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenId: tokenFrom });
    await dexPage.selectToToken({ tokenId: tokenIds.WXDC });
    await expect(dexPage.wrapButton).toBeVisible();
    await expect(dexPage.wrapButton).toHaveText(`Enter an amount`);
    await expect(dexPage.wrapButton).toBeDisabled();
  });
});
