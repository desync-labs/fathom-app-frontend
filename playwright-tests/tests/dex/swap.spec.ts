import { test, expect } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
import { tokenIds } from "../../fixtures/dex.data";
dotenv.config();

test.describe("Fathom App Test Suite: Positions Operations", () => {
  test("Swapping XDC with xUSDT is successful", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.swap({
      fromToken: tokenIds.XDC,
      toToken: tokenIds.xUSDT,
      fromAmount: 0.5,
    });
    await dexPage.validateSwapSuccessPopup({
      fromAmountExpected: expectedData.fromAmountExpected,
      fromTokenNameExpected: expectedData.fromTokenNameExpected,
      toAmountExpected: expectedData.toAmountExpected,
      toTokenNameExpected: expectedData.toTokenNameExpected,
    });
  });

  test("Wrapping XDC to WXDC is successful", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.wrap({
      fromToken: tokenIds.XDC,
      toToken: tokenIds.WXDC,
      fromAmount: 0.5,
    });
    await dexPage.validateWrapSuccessPopup({
      fromAmountExpected: expectedData.fromAmountExpected,
      fromTokenNameExpected: expectedData.fromTokenNameExpected,
      toAmountExpected: expectedData.toAmountExpected,
      toTokenNameExpected: expectedData.toTokenNameExpected,
    });
  });

  test("Unwrapping WXDC to XDC is successful", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    const expectedData = await dexPage.wrap({
      fromToken: tokenIds.WXDC,
      toToken: tokenIds.XDC,
      fromAmount: 0.5,
    });
    await dexPage.validateUnwrapSuccessPopup({
      fromAmountExpected: expectedData.fromAmountExpected,
      fromTokenNameExpected: expectedData.fromTokenNameExpected,
      toAmountExpected: expectedData.toAmountExpected,
      toTokenNameExpected: expectedData.toTokenNameExpected,
    });
  });

  test("Swap: Insufficient balance is correctly displayed", async ({
    dexPage,
  }) => {
    const tokenFrom = tokenIds.XDC;
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.selectFromToken({ tokenId: tokenFrom });
    await dexPage.selectToToken({ tokenId: tokenIds.xUSDT });
    const fromBalance = await dexPage.getFromBalance();
    await dexPage.fillFromValue({ inputValue: fromBalance + 1 });
    await expect(dexPage.swapButton).toBeVisible();
    await expect(dexPage.swapButton).toHaveText(
      `Insufficient ${tokenFrom} balance`
    );
    await expect(dexPage.swapButton).toBeDisabled();
  });

  test("Wrap: Insufficient balance is correctly displayed", async ({
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
});
