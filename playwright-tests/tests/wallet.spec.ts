import { test } from "../fixtures/pomSynpressFixture";
import { AvailableNetworks, WalletConnectOptions } from "../types";
import dotenv from "dotenv";
dotenv.config();

const network =
  process.env.ENVIRONMENT === "prod"
    ? AvailableNetworks.XDC
    : AvailableNetworks.Apothem;

test.describe("Fathom App Test Suite: Wallet Connectivity", () => {
  test("Connecting Metamask wallet to the application is successful @smoke", async ({
    fxdPage,
  }) => {
    await fxdPage.navigate();
    await fxdPage.connectWallet(WalletConnectOptions.Metamask);
    await fxdPage.validateConnectedWalletAddress();
    await fxdPage.validateExitButton();
    await fxdPage.validateMetamaskLogo();
    await fxdPage.validateNetworkBlock(network);
  });

  test("Disconnecting Metamask wallet from the application is successful @smoke", async ({
    fxdPage,
  }) => {
    await fxdPage.navigate();
    await fxdPage.connectWallet(WalletConnectOptions.Metamask);
    await fxdPage.validateConnectedWalletAddress();
    await fxdPage.disconnectWallet();
    await fxdPage.validateWalletDisconnected();
  });
});
