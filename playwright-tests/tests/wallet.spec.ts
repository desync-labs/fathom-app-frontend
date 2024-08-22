import { test } from "../fixtures/pomSynpressFixture";
import { AvailableNetworks, WalletConnectOptions } from "../types";
import { qase } from "playwright-qase-reporter";
import dotenv from "dotenv";
dotenv.config();

const network =
  process.env.ENVIRONMENT === "prod"
    ? AvailableNetworks.XDC
    : AvailableNetworks.Apothem;

test.describe("Fathom App Test Suite: Wallet Connectivity", () => {
  test(
    qase(
      3,
      "Connecting Metamask wallet to the application is successful @smoke"
    ),
    async ({ fxdPage }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      await fxdPage.validateExitButton();
      await fxdPage.validateMetamaskLogo();
      await fxdPage.validateNetworkBlock(network);
    }
  );

  test(
    qase(
      4,
      "Disconnecting Metamask wallet from the application is successful @smoke"
    ),
    async ({ fxdPage }) => {
      await fxdPage.navigate();
      await fxdPage.connectWallet(WalletConnectOptions.Metamask);
      await fxdPage.validateConnectedWalletAddress();
      await fxdPage.disconnectWallet();
      await fxdPage.validateWalletDisconnected();
    }
  );
});
