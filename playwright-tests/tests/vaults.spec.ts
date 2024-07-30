import { test, expect } from "../fixtures/pomSynpressFixture";
import { lendingLiquidationVaultData } from "../fixtures/vaults.data";
import { VaultAction, WalletConnectOptions } from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Vault Operations - Lending & Liquidation Vault", () => {
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
      await vaultPage.depositFirstTimeVaultListItem({
        id: lendingLiquidationVaultData.id,
        shareTokenName: lendingLiquidationVaultData.shareTokenName,
        depositAmount,
      });
    }
  });

  test("Vault List Item Page - Manage Vault: Depositing 50 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 50;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultListItemDeposit({
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

  test("Vault List Item Page - Manage Vault: Partially withdrawing 50 FXD is successful", async ({
    vaultPage,
  }) => {
    const withdrawAmount = 50;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData =
      await vaultPage.manageVaultListItemWithdrawPartially({
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

  test("Vault List Item Page - Deposit: Depositing first 0.5 FXD is successful", async ({
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
    const vaultExpectedData = await vaultPage.depositFirstTimeVaultListItem({
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

  test.skip("Vault List Item Page - Manage Vault: Fully withdrawing all FXD is successful", async ({
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
    await vaultPage.depositFirstTimeVaultListItem({
      id: lendingLiquidationVaultData.id,
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.manageVaultListItemWithdrawFully({
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

  test("Vault List Item Page: Wallet not connected state layout is correct, vault connect wallet functionality is successful", async ({
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

  test("Vault Detail Page - Manage Vault: Depositing 100.5 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 100.5;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    const vaultExpectedData = await vaultPage.manageVaultDetailDeposit({
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataDetailManagePage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("Vault Detail Page - Manage Vault: Partially withdrawing 100.5 FXD is successful", async ({
    vaultPage,
  }) => {
    const withdrawAmount = 100.5;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    const vaultExpectedData =
      await vaultPage.manageVaultDetailWithdrawPartially({
        withdrawAmount,
      });
    await vaultPage.validateVaultDataDetailManagePage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: withdrawAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("Vault Detail Page - Deposit: Depositing first 0.85 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 0.85;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintVaultsStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.page.waitForTimeout(5000);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    const vaultExpectedData = await vaultPage.depositFirstTimeVaultDetail({
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataDetailManagePage({
      id: lendingLiquidationVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("Vault Detail Page - Manage Vault: Fully withdrawing all FXD is successful @smoke", async ({
    vaultPage,
  }) => {
    test.setTimeout(200000);
    const depositAmount = 0.9;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintVaultsStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.page.waitForTimeout(5000);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    await vaultPage.depositFirstTimeVaultDetail({
      shareTokenName: lendingLiquidationVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.manageVaultDetailWithdrawFully();
    await vaultPage.validateVaultDataDetailDepositPage({
      id: lendingLiquidationVaultData.id,
    });
  });

  test("Vault Detail Page: Wallet not connected state layout is correct, vault connect wallet functionality is successful", async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    await vaultPage.openVaultDetails(lendingLiquidationVaultData.id);
    await expect(vaultPage.btnConnectWallet).toBeVisible({ timeout: 5000 });
    const balanceValue = await vaultPage.getBalanceVaultDetailValue();
    expect(balanceValue).toEqual(0);
    const earnedValue = await vaultPage.getEarnedVaultDetailValue();
    expect(earnedValue).toEqual(0);
    await vaultPage.connectWalletVault(WalletConnectOptions.Metamask);
    await expect(vaultPage.btnDepositDetailManageModal).toBeVisible({
      timeout: 5000,
    });
    await expect(vaultPage.btnConnectWallet).not.toBeVisible({ timeout: 5000 });
    const balanceValueConnected = await vaultPage.getBalanceVaultDetailValue();
    expect(balanceValueConnected).toBeGreaterThan(0);
    const earnedValueConnected = await vaultPage.getEarnedVaultDetailValue();
    expect(earnedValueConnected).toBeGreaterThan(0);
  });
});
