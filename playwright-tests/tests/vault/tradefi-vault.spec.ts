import { contractAddresses } from "../../fixtures/global.data";
import { test } from "../../fixtures/pomSynpressFixture";
import { tradeFintechVaultData } from "../../fixtures/vaults.data";
import { VaultAction, WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Vault Operations - TradeFintech Vault", () => {
  test.beforeEach(async ({ vaultPage }) => {
    await vaultPage.startDepositPeriod({
      strategyAddress: contractAddresses.tradeFintechStrategyMock,
    });
    await vaultPage.navigate();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.page.waitForLoadState("load");
    await vaultPage.page.waitForTimeout(3000);
    const manageButton = vaultPage.getManageVaultButtonRowLocatorById(
      tradeFintechVaultData.id
    );
    if (await manageButton.isVisible()) {
      await vaultPage.manageVaultListItemWithdrawFully({
        id: tradeFintechVaultData.id,
      });
      await vaultPage.validateVaultListItemDepositState({
        id: tradeFintechVaultData.id,
      });
    }
  });

  test("Deposit Period - Depositing more than or equal to the minimum required amount is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 10000;
    const vaultExpectedData = await vaultPage.depositFirstTimeVaultListItem({
      id: tradeFintechVaultData.id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id: tradeFintechVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(tradeFintechVaultData.id);
    await vaultPage.validateVaultDataDetailManagePage({
      id: tradeFintechVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("Deposit Period - Depositing any amount when minimum required amount is already deposited is successful", async ({
    vaultPage,
  }) => {
    const depositAmountInitial = 10000;
    const depositAmount = 1.5;
    await vaultPage.depositFirstTimeVaultListItem({
      id: tradeFintechVaultData.id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount: depositAmountInitial,
    });
    const vaultExpectedData = await vaultPage.manageVaultListItemDeposit({
      id: tradeFintechVaultData.id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id: tradeFintechVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(tradeFintechVaultData.id);
    await vaultPage.validateVaultDataDetailManagePage({
      id: tradeFintechVaultData.id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });
});
