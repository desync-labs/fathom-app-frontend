import { test } from "../../fixtures/pomSynpressFixture";
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
    const expectedData = await dexPage.unwrap({
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
});
