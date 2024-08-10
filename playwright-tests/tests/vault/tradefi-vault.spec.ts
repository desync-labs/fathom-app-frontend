import { contractAddresses } from "../../fixtures/global.data";
import { test, expect } from "../../fixtures/pomSynpressFixture";
import { tradeFintechVaultData } from "../../fixtures/vaults.data";
import { TradeFiPeriod, VaultAction, WalletConnectOptions } from "../../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

const id = tradeFintechVaultData.id;

test.describe("Fathom App Test Suite: Vault Operations - TradeFintech Vault", () => {
  test.beforeEach(async ({ vaultPage }) => {
    await vaultPage.startDepositPeriod({
      strategyAddress: contractAddresses.tradeFintechStrategyMock,
    });
    await vaultPage.navigate();
    await expect
      .soft(vaultPage.getDepositButtonRowLocatorById(id))
      .toHaveText("Deposit");
    await vaultPage.getDepositButtonRowLocatorById(id).click();
    await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
    await vaultPage.page.waitForTimeout(2000);
    let depositCompletedWarningMessageVisible =
      await vaultPage.depositTimeCompletedWarningMessageText.isVisible();
    while (depositCompletedWarningMessageVisible) {
      await vaultPage.page.reload({ waitUntil: "load" });
      await expect
        .soft(vaultPage.getDepositButtonRowLocatorById(id))
        .toHaveText("Deposit");
      await vaultPage.getDepositButtonRowLocatorById(id).click();
      await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
      await vaultPage.page.waitForTimeout(2000);
      depositCompletedWarningMessageVisible =
        await vaultPage.depositTimeCompletedWarningMessageText.isVisible();
    }
    await vaultPage.btnCloseModal.click();
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await vaultPage.validateConnectedWalletAddress();
    await vaultPage.page.waitForLoadState("load");
    await vaultPage.page.waitForTimeout(3000);
    const manageButton = vaultPage.getManageVaultButtonRowLocatorById(id);
    if (await manageButton.isVisible()) {
      await vaultPage.manageVaultListItemWithdrawFully({
        id,
      });
      await vaultPage.validateVaultListItemDepositState({
        id,
      });
    }
  });

  test("Deposit Period - Depositing more than or equal to the minimum required amount is successful @smoke", async ({
    vaultPage,
  }) => {
    const depositAmount = 10000;
    const vaultExpectedData = await vaultPage.depositFirstTimeVaultListItem({
      id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(id);
    await vaultPage.validateVaultDataDetailManagePage({
      id,
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
      id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount: depositAmountInitial,
    });
    const vaultExpectedData = await vaultPage.manageVaultListItemDeposit({
      id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.validateVaultDataListItemPage({
      id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(id);
    await vaultPage.validateVaultDataDetailManagePage({
      id,
      action: VaultAction.Deposit,
      amountChanged: depositAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("Deposit Period - Trying to deposit less than the required amount is not possible and returns corresponding error", async ({
    vaultPage,
  }) => {
    const depositAmount = 9999;
    await expect
      .soft(vaultPage.getDepositButtonRowLocatorById(id))
      .toHaveText("Deposit");
    await vaultPage.getDepositButtonRowLocatorById(id).click();
    await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
    await vaultPage.page.waitForTimeout(2000);
    // Vault list item modal
    await vaultPage.enterDepositAmountVaultListItemDepositModal(depositAmount);
    await expect
      .soft(vaultPage.btnConfirmDepositListItemDepositModal)
      .toBeVisible();
    await expect
      .soft(vaultPage.btnConfirmDepositListItemDepositModal)
      .toBeDisabled();
    await expect
      .soft(vaultPage.inputDepositAmountListItemDepositModal)
      .toHaveCSS("border-color", "rgb(244, 67, 54)");
    await expect
      .soft(vaultPage.inputDepositAmountListItemDepositModal)
      .toHaveCSS("color", "rgb(244, 67, 54)");
    await expect
      .soft(vaultPage.page.getByText("Minimum deposit is 10,000 Fathom USD"))
      .toBeVisible();
    await expect
      .soft(vaultPage.page.getByText("Minimum deposit is 10,000 Fathom USD"))
      .toHaveCSS("color", "rgb(221, 60, 60)");
    // Vault details
    await vaultPage.btnCloseModal.click();
    await expect(vaultPage.dialogListItemDepositModal).not.toBeVisible();
    await vaultPage.openVaultDetails(id);
    await vaultPage.enterDepositAmountVaultDetailDepositModal(depositAmount);
    await expect.soft(vaultPage.btnDepositDetailDepositModal).toBeVisible();
    await expect.soft(vaultPage.btnDepositDetailDepositModal).toBeDisabled();
    await expect
      .soft(vaultPage.inputDepositAmountDetailDepositModal)
      .toHaveCSS("border-color", "rgb(244, 67, 54)");
    await expect
      .soft(vaultPage.inputDepositAmountDetailDepositModal)
      .toHaveCSS("color", "rgb(244, 67, 54)");
    await expect
      .soft(vaultPage.page.getByText("Minimum deposit is 10,000 Fathom USD"))
      .toBeVisible();
    await expect
      .soft(vaultPage.page.getByText("Minimum deposit is 10,000 Fathom USD"))
      .toHaveCSS("color", "rgb(221, 60, 60)");
  });

  test("Deposit Period - Withdrawing amount that will result in more than or equal to required remaining amount is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 10100;
    const withdrawAmount = 100;
    await vaultPage.depositFirstTimeVaultListItem({
      id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    const vaultExpectedData =
      await vaultPage.manageVaultListItemWithdrawPartially({
        id,
        withdrawAmount,
      });
    await vaultPage.validateVaultDataListItemPage({
      id,
      action: VaultAction.Withdraw,
      amountChanged: withdrawAmount,
      stakedAmountDialogBefore: vaultExpectedData.stakedAmountDialogBefore,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
    });
    await vaultPage.openVaultDetails(id);
    await vaultPage.validateVaultDataDetailManagePage({
      id,
      action: VaultAction.Withdraw,
      amountChanged: withdrawAmount,
      stakedAmountDialogAfter: vaultExpectedData.stakedAmountDialogAfter,
      shareTokensDialogAfter: vaultExpectedData.shareTokensDialogAfter,
      poolShareDialogAfter: vaultExpectedData.poolShareDialogAfter,
    });
  });

  test("Deposit Period - Trying to withdraw amount that would result in less than required remaining amount is not possible and returns corresponding error", async ({
    vaultPage,
  }) => {
    const depositAmount = 10100;
    const withdrawAmount = 101;
    await vaultPage.depositFirstTimeVaultListItem({
      id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    // Vault List Item Modal
    await vaultPage.getManageVaultButtonRowLocatorById(id).click();
    await expect(vaultPage.dialogListItemManageModal).toBeVisible();
    await vaultPage.btnWithdrawNavItemListItemManageModal.click();
    await vaultPage.enterWithdrawAmountVaultListItemManageModal(withdrawAmount);
    await vaultPage.page.waitForTimeout(2000);
    const errorTextLocator = vaultPage.page.getByText(
      `After withdraw ${withdrawAmount} Fathom USD  you will have ${(
        depositAmount - withdrawAmount
      ).toLocaleString()} Fathom USD less then minimum allowed deposit 10k Fathom USD, you can do full withdraw instead.`
    );
    await expect.soft(errorTextLocator).toBeVisible();
    await expect
      .soft(vaultPage.btnConfirmWithdrawListItemManageModal)
      .toBeVisible();
    await expect
      .soft(vaultPage.btnConfirmWithdrawListItemManageModal)
      .toBeDisabled();
    // Vault Details
    await vaultPage.btnCloseModal.click();
    await expect(vaultPage.dialogListItemDepositModal).not.toBeVisible();
    await vaultPage.openVaultDetails(id);
    await vaultPage.btnWithdrawNavItemDetailManageModal.click();
    await vaultPage.enterWithdrawAmountVaultDetailManageModal(withdrawAmount);
    await expect.soft(errorTextLocator).toBeVisible();
    await expect.soft(vaultPage.btnWithdrawDetailManageModal).toBeVisible();
    await expect.soft(vaultPage.btnWithdrawDetailManageModal).toBeDisabled();
  });

  test("Deposit Period - Fully withdrawing all funds is successful", async ({
    vaultPage,
  }) => {
    const depositAmount = 10000;
    await vaultPage.depositFirstTimeVaultListItem({
      id,
      shareTokenName: tradeFintechVaultData.shareTokenName,
      depositAmount,
    });
    await vaultPage.manageVaultListItemWithdrawFully({
      id,
    });
    await vaultPage.validateVaultListItemDepositState({
      id,
    });
    await vaultPage.openVaultDetails(id);
    await vaultPage.validateVaultDataDetailDepositPage({
      id,
    });
  });

  test("Deposit Period - Non-KYC verified user cannot deposit and a proper warning message is displayed", async ({
    vaultPage,
  }) => {
    await metamask.disconnectWalletFromDapp();
    await metamask.switchAccount("Account 1");
    await vaultPage.connectWallet(WalletConnectOptions.Metamask);
    await expect
      .soft(vaultPage.getDepositButtonRowLocatorById(id))
      .toHaveText("Deposit");
    await vaultPage.getDepositButtonRowLocatorById(id).click();
    await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
    await vaultPage.page.waitForTimeout(2000);
    // Vault list item modal
    await expect
      .soft(vaultPage.btnConfirmDepositListItemDepositModal)
      .toBeVisible();
    await expect
      .soft(vaultPage.btnConfirmDepositListItemDepositModal)
      .toBeDisabled();
    await expect.soft(vaultPage.kycVerificationWarningText).toBeVisible();
    await expect
      .soft(vaultPage.kycVerificationWarningText)
      .toHaveCSS("color", "rgb(247, 176, 110)");
    await expect.soft(vaultPage.kycVerificationWarningLink).toBeVisible();
    await expect
      .soft(vaultPage.kycVerificationWarningLink)
      .toHaveText("https://kyc.tradeflow.network/");
    await expect.soft(vaultPage.kycVerificationWarningTextBox).toBeVisible();
    await expect
      .soft(vaultPage.kycVerificationWarningTextBox)
      .toHaveCSS("background-color", "rgb(69, 37, 8)");
    // Vault details
    await vaultPage.btnCloseModal.click();
    await expect(vaultPage.dialogListItemDepositModal).not.toBeVisible();
    await vaultPage.openVaultDetails(id);
    await expect.soft(vaultPage.btnDepositDetailDepositModal).toBeVisible();
    await expect.soft(vaultPage.btnDepositDetailDepositModal).toBeDisabled();
    await expect.soft(vaultPage.kycVerificationWarningText).toBeVisible();
    await expect
      .soft(vaultPage.kycVerificationWarningText)
      .toHaveCSS("color", "rgb(247, 176, 110)");
    await expect.soft(vaultPage.kycVerificationWarningLink).toBeVisible();
    await expect
      .soft(vaultPage.kycVerificationWarningLink)
      .toHaveText("https://kyc.tradeflow.network/");
    await expect.soft(vaultPage.kycVerificationWarningTextBox).toBeVisible();
    await expect
      .soft(vaultPage.kycVerificationWarningTextBox)
      .toHaveCSS("background-color", "rgb(69, 37, 8)");
  });

  test("Lock Period - Layout is corrrect, deposit, withdraw and withdraw all funds is not available @smoke", async ({
    vaultPage,
  }) => {
    await vaultPage.startLockPeriod({
      strategyAddress: contractAddresses.tradeFintechStrategyMock,
    });
    await vaultPage.page.reload({ waitUntil: "load" });
    await expect
      .soft(vaultPage.getDepositButtonRowLocatorById(id))
      .toHaveText("Deposit");
    await vaultPage.getDepositButtonRowLocatorById(id).click();
    await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
    await vaultPage.page.waitForTimeout(2000);
    let depositCompletedWarningMessageVisible =
      await vaultPage.depositTimeCompletedWarningMessageText.isVisible();
    while (!depositCompletedWarningMessageVisible) {
      await vaultPage.page.reload({ waitUntil: "load" });
      await expect
        .soft(vaultPage.getDepositButtonRowLocatorById(id))
        .toHaveText("Deposit");
      await vaultPage.getDepositButtonRowLocatorById(id).click();
      await expect(vaultPage.dialogListItemDepositModal).toBeVisible();
      await vaultPage.page.waitForTimeout(2000);
      depositCompletedWarningMessageVisible =
        await vaultPage.depositTimeCompletedWarningMessageText.isVisible();
    }
    // Vault list item modal
    await expect
      .soft(vaultPage.btnConfirmDepositListItemDepositModal)
      .toBeVisible();
    await expect
      .soft(vaultPage.btnConfirmDepositListItemDepositModal)
      .toBeDisabled();
    await expect
      .soft(vaultPage.depositTimeCompletedWarningMessageText)
      .toBeVisible();
    await expect
      .soft(vaultPage.depositTimeCompletedWarningMessageText)
      .toHaveCSS("color", "rgb(247, 176, 110)");
    await expect
      .soft(vaultPage.depositTimeCompletedWarningMessageTextBox)
      .toBeVisible();
    await expect
      .soft(vaultPage.depositTimeCompletedWarningMessageTextBox)
      .toHaveCSS("background-color", "rgb(69, 37, 8)");
    await vaultPage.validateLockingPeriodBoxTradefiVault({
      period: TradeFiPeriod.Lock,
    });
    // Vault details
    await vaultPage.btnCloseModal.click();
    await expect(vaultPage.dialogListItemDepositModal).not.toBeVisible();
    await vaultPage.openVaultDetails(id);
    await expect.soft(vaultPage.btnWithdrawAllTradeFiVaultDetail).toBeVisible();
    await expect
      .soft(vaultPage.btnWithdrawAllTradeFiVaultDetail)
      .toBeDisabled();
    await expect
      .soft(vaultPage.btnDepositNavItemDetailManageModal)
      .not.toBeVisible();
    await expect
      .soft(vaultPage.btnWithdrawNavItemDetailManageModal)
      .not.toBeVisible();
    await vaultPage.validateLockingPeriodBoxTradefiVault({
      period: TradeFiPeriod.Lock,
    });
  });
});
