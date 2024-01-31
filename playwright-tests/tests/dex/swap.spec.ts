import { test } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
import { tokenIds } from "../../fixtures/dex.data";
dotenv.config();

test.describe("Fathom App Test Suite: Positions Operations", () => {
  test("Swapping 1.5 XDC with xUSDT is successful.", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    await dexPage.swap({
      fromToken: tokenIds.XDC,
      toToken: tokenIds.xUSDT,
      fromAmount: 1.5,
    });
  });
});
