import { test, expect } from "../fixtures/pomSynpressFixture";
import { fxdVaultData } from "../fixtures/vaults.data";
import { WalletConnectOptions } from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Vault Operations", () => {
  test('FXD Vault: "Deposit" button is visible for a first time user', async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    // Switch to account that has no vaults ever created
    await metamask.importAccount(process.env.METAMASK_TEST_TWO_PRIVATE_KEY);
    await metamask.switchAccount("Account 3");
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await expect
      .soft(vaultPage.getActionButtonRowLocatorById(fxdVaultData.id))
      .toHaveText("Deposit");
  });

  test("FXD Vault: Manage Vault: Depositing 10 FXD is successful", async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.depositVault({
      id: fxdVaultData.id,
      depositAmount: 10,
    });
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      stakedAmount: vaultExpectedData.stakedAmount,
      poolShare: vaultExpectedData.poolShare,
      shareTokens: vaultExpectedData.shareTokens,
    });
  });
});
