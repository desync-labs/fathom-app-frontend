import { test, expect } from "../fixtures/pomSynpressFixture";
import { fxdVaultData } from "../fixtures/vaults.data";
import { WalletConnectOptions } from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Vault Operations", () => {
  test("FXD Vault: Manage Vault: Depositing 100 FXD is successful", async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultDeposit({
      id: fxdVaultData.id,
      depositAmount: 100,
    });
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      stakedAmount: vaultExpectedData.stakedAmount,
      poolShare: vaultExpectedData.poolShare,
      shareTokens: vaultExpectedData.shareTokens,
    });
  });

  test("FXD Vault: Manage Vault: Partially withdrawing 100 FXD is successful", async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultWithdrawPartially({
      id: fxdVaultData.id,
      withdrawAmount: 100,
    });
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      stakedAmount: vaultExpectedData.stakedAmount,
      poolShare: vaultExpectedData.poolShare,
      shareTokens: vaultExpectedData.shareTokens,
    });
  });

  test("FXD Vault: Deposit: Depositing first 1 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 1;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.validateRowActionButton(fxdVaultData.id, "Deposit");
    await vaultPage.validateYourPositionTabNotVisible(fxdVaultData.id);
    const vaultExpectedData = await vaultPage.depositFirstTime({
      id: fxdVaultData.id,
      depositAmount,
    });
    await vaultPage.validateYourPositionTabIsVisible(fxdVaultData.id);
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      stakedAmount: vaultExpectedData.stakedAmount,
      poolShare: vaultExpectedData.poolShare,
      shareTokens: vaultExpectedData.shareTokens,
    });
  });

  test("FXD Vault: Manage Vault: Fully withdrawing all FXD is successful", async ({
    vaultPage,
  }) => {
    test.setTimeout(150000);
    const depositAmount = 1;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.navigate();
    await vaultPage.mintStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.depositFirstTime({
      id: fxdVaultData.id,
      depositAmount,
    });
    await vaultPage.manageVaultWithdrawFully({ id: fxdVaultData.id });
    await vaultPage.validateRowActionButton(fxdVaultData.id, "Deposit");
    await vaultPage.validateYourPositionTabNotVisible(fxdVaultData.id);
    expect(await vaultPage.getStakedVaultRowValue(fxdVaultData.id)).toEqual(0);
  });
});
