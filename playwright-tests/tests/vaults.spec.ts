import { test, expect } from "../fixtures/pomSynpressFixture";
import { lendingLiquidationVaultData } from "../fixtures/vaults.data";
import { VaultAction, WalletConnectOptions } from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Vault Operations", () => {
  test.beforeAll(async ({ vaultPage }) => {
    const depositAmount = 3000;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.page.waitForLoadState("load");
    await vaultPage.page.waitForTimeout(3000);
    const isDepositButtonVisible = await vaultPage
      .getDepositButtonRowLocatorById(lendingLiquidationVaultData.id)
      .isVisible();
    if (isDepositButtonVisible) {
      await vaultPage.depositFirstTime({
        id: lendingLiquidationVaultData.id,
        shareTokenName: lendingLiquidationVaultData.shareTokenName,
        depositAmount,
      });
    }
  });

  test("FXD Vault: Manage Vault: Depositing 50 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 50;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultDialogDeposit({
      id: lendingLiquidationVaultData.id,
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    await vaultPage.validateVaultDataDetailManagePage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("FXD Vault: Manage Vault: Partially withdrawing 50 FXD is successful", async ({
    vaultPage,
  }) => {
    const withdrawAmount = 50;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultWithdrawPartially({
      id: lendingLiquidationVaultData.id,
      withdrawAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Withdraw,
      amountChanged: withdrawAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    await vaultPage.validateVaultDataDetailManagePage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: withdrawAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("FXD Vault: Deposit: Depositing first 0.5 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 0.5;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintVaultsStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.page.waitForTimeout(5000);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await expect(
      vaultPage.getDepositButtonRowLocatorById(lendingLiquidationVaultData.id)
    ).toBeVisible();
    await expect(
      vaultPage.getDepositButtonRowLocatorById(lendingLiquidationVaultData.id)
    ).toHaveText("Deposit");
    const vaultExpectedData = await vaultPage.depositFirstTime({
      id: lendingLiquidationVaultData.id,
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    await vaultPage.validateVaultDataDetailManagePage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test.skip("FXD Vault: Manage Vault: Fully withdrawing all FXD is successful @smoke", async ({
    vaultPage,
  }) => {
    test.setTimeout(180000);
    const depositAmount = 0.5;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintVaultsStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.page.waitForTimeout(5000);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.depositFirstTime({
      id: lendingLiquidationVaultData.id,
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.manageVaultWithdrawFully({
      id: lendingLiquidationVaultData.id,
    });
    await vaultPage.validateVaultListItemDepositState({
      id: lendingLiquidationVaultData.id,
    });
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    await vaultPage.validateVaultDataDetailDepositPage({
      id: lendingLiquidationVaultData.id,
    });
  });

  test("FXD Vault: Wallet not connected state layout is correct, vault connect wallet functionality is successful", async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    await vaultPage.page.waitForTimeout(2000);
    expect
      .soft(
        await vaultPage.getStakedVaultRowValue(lendingLiquidationVaultData.id)
      )
      .toEqual(0);
    expect
      .soft(
        await vaultPage.getEarnedVaultRowValue(lendingLiquidationVaultData.id)
      )
      .toEqual(0);
    await expect
      .soft(
        vaultPage.getDepositButtonRowLocatorById(lendingLiquidationVaultData.id)
      )
      .toBeVisible();
    await vaultPage
      .getDepositButtonRowLocatorById(lendingLiquidationVaultData.id)
      .click();
    await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
    await expect(vaultPage.btnConnectWallet).toBeVisible();
    await vaultPage.connectWalletVault(WalletConnectOptions.Metamask);
    await vaultPage.page.waitForTimeout(2000);
    await expect(
      vaultPage.getEarnedLoadingVaultRowLocatorById(
        lendingLiquidationVaultData.id
      )
    ).not.toBeVisible({ timeout: 10000 });
    expect
      .soft(
        await vaultPage.getStakedVaultRowValue(lendingLiquidationVaultData.id)
      )
      .toBeGreaterThan(0);
    expect
      .soft(
        await vaultPage.getEarnedVaultRowValue(lendingLiquidationVaultData.id)
      )
      .toBeGreaterThan(0);
    await expect
      .soft(
        vaultPage.getManageVaultButtonRowLocatorById(
          lendingLiquidationVaultData.id
        )
      )
      .toBeVisible();
  });
});
