import { test, expect } from "../fixtures/pomSynpressFixture";
import { fxdVaultData } from "../fixtures/vaults.data";
import { VaultAction, WalletConnectOptions } from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Vault Operations", () => {
  test("FXD Vault: Manage Vault: Depositing 1 FXD is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 1;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultDeposit({
      id: fxdVaultData.id,
      shareTokenName: fxdVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
    });
  });

  test("FXD Vault: Manage Vault: Partially withdrawing 1 FXD is successful", async ({
    vaultPage,
  }) => {
    const withdrawAmount = 1;
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    const vaultExpectedData = await vaultPage.manageVaultWithdrawPartially({
      id: fxdVaultData.id,
      withdrawAmount,
    });
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      action: VaultAction.Withdraw,
      amountChanged: withdrawAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
    });
  });

  test("FXD Vault: Deposit: Depositing first 0.001 FXD is successful @smoke", async ({
    vaultPage,
  }) => {
    const depositAmount = 0.001;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintVaultsStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.page.waitForTimeout(3000);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await expect(
      vaultPage.getDepositButtonRowLocatorById(fxdVaultData.id)
    ).toBeVisible();
    await expect(
      vaultPage.getDepositButtonRowLocatorById(fxdVaultData.id)
    ).toHaveText("Deposit");
    await vaultPage.validateYourPositionTabNotVisible(fxdVaultData.id);
    const vaultExpectedData = await vaultPage.depositFirstTime({
      id: fxdVaultData.id,
      shareTokenName: fxdVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateYourPositionTabIsVisible(fxdVaultData.id);
    await vaultPage.validateVaultData({
      id: fxdVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
    });
  });

  test("FXD Vault: Manage Vault: Fully withdrawing all FXD is successful @smoke", async ({
    vaultPage,
  }) => {
    test.setTimeout(150000);
    const depositAmount = 0.001;
    await metamask.switchAccount("Account 1");
    const newAddress = await metamask.getWalletAddress();
    console.log(newAddress);
    await vaultPage.mintVaultsStableCoinToAddress(newAddress, depositAmount);
    await vaultPage.transferTestXdcToAddress(newAddress, 1);
    await vaultPage.page.waitForTimeout(3000);
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.depositFirstTime({
      id: fxdVaultData.id,
      shareTokenName: fxdVaultData.shareTokenName,
      depositAmount,
    });
    const earnedValueRowBefore = Number(
      await vaultPage.getEarnedVaultRowValue(fxdVaultData.id)
    );
    await vaultPage.manageVaultWithdrawFully({ id: fxdVaultData.id });
    await expect
      .soft(vaultPage.getDepositButtonRowLocatorById(fxdVaultData.id))
      .toBeVisible();
    await expect
      .soft(vaultPage.getDepositButtonRowLocatorById(fxdVaultData.id))
      .toHaveText("Deposit");
    await vaultPage.validateYourPositionTabNotVisible(fxdVaultData.id);
    expect
      .soft(await vaultPage.getStakedVaultRowValue(fxdVaultData.id))
      .toEqual(0);
    const earnedValueRowAfter = Number(
      await vaultPage.getEarnedVaultRowValue(fxdVaultData.id)
    );
    expect.soft(earnedValueRowAfter).toBeGreaterThan(earnedValueRowBefore);
  });

  test("FXD Vault: Wallet not connected state layout is correct, vault connect wallet functionality is successful", async ({
    vaultPage,
  }) => {
    await vaultPage.navigate();
    await expect
      .soft(vaultPage.getConnectWalletButtonRowLocatorById(fxdVaultData.id))
      .toBeVisible();
    await expect
      .soft(vaultPage.getConnectWalletButtonRowLocatorById(fxdVaultData.id))
      .toContainText("Connect Wallet");
    await vaultPage.validateYourPositionTabNotVisible(fxdVaultData.id);
    await vaultPage.validateAboutTabIsVisible(fxdVaultData.id);
    await vaultPage.validateStrategiesTabIsVisible(fxdVaultData.id);
    expect
      .soft(await vaultPage.getStakedVaultRowValue(fxdVaultData.id))
      .toEqual(0);
    await vaultPage.connectWalletVault(
      fxdVaultData.id,
      WalletConnectOptions.Metamask
    );
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.validateYourPositionTabIsVisible(fxdVaultData.id);
    await vaultPage.validateAboutTabIsVisible(fxdVaultData.id);
    await vaultPage.validateStrategiesTabIsVisible(fxdVaultData.id);
    await expect(
      vaultPage.getManageVaultButtonRowDetailsLocatorById(fxdVaultData.id)
    ).toBeVisible();
    await expect
      .soft(vaultPage.getConnectWalletButtonRowLocatorById(fxdVaultData.id))
      .not.toBeVisible();
  });
});
