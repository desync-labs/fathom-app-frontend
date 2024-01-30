import { test } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Positions Operations", () => {
  test("Swapping XDC with xUSDT is successful.", async ({ dexPage }) => {
    await dexPage.navigate();
    await dexPage.connectWallet(WalletConnectOptions.Metamask);
    await dexPage.validateConnectedWalletAddress();
    // TO DO
  });
});
