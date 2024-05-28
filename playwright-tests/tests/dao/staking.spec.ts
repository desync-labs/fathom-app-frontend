import { test, expect } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: DAO Staking", () => {
  test.describe.serial("Scenario 1 @smoke", () => {
    let newPositionLockId: number;
    const stakingAmount = 150;
    const lockPeriod = 7;

    test.beforeEach(async ({ daoPage }) => {
      await daoPage.navigateStaking();
      await daoPage.connectWallet(WalletConnectOptions.Metamask);
      await daoPage.validateConnectedWalletAddress();
    });

    test("Staking 150 FTHM with a 7-day lock period is successful", async ({
      daoPage,
    }) => {
      const walletFTHMBalanceBefore =
        await daoPage.getMyWalletFTHMBalanceValue();
      newPositionLockId = await daoPage.createStakeFTHMPosition({
        stakingAmount,
        lockPeriod,
      });
      const walletFTHMBalanceAfter =
        await daoPage.getMyWalletFTHMBalanceValue();
      await daoPage.validatePositionDataByLockId({
        lockId: newPositionLockId,
        stakingAmountExpected: stakingAmount,
        lockedPeriodExpected: lockPeriod,
      });
      expect
        .soft(walletFTHMBalanceAfter)
        .toEqual(walletFTHMBalanceBefore - stakingAmount);
    });

    test("Early unstaking a FTHM staked position is successful", async ({
      daoPage,
    }) => {
      await daoPage.clickEarlyUnstakeButtonByLockId({
        lockId: newPositionLockId,
      });
      await daoPage.validateEarlyUnstakeDialog({
        stakingAmountExpected: stakingAmount,
      });
      await daoPage.confirmUnstakeEarlyUnstakeDialog();
      await daoPage.validateConfirmEarlyUnstake({ lockId: newPositionLockId });
      await daoPage.validateUnstakeCooldownDialog({ stakingAmount });
    });
  });

  test("Wallet not connected state layout is correct, staking connect wallet functionality is successful", async ({
    daoPage,
  }) => {
    await daoPage.navigateStaking();
    await expect(daoPage.btnDaoConnectWallet).toBeVisible();
    await expect
      .soft(daoPage.page.getByText("My Wallet Balance"))
      .not.toBeVisible();
    await expect.soft(daoPage.myWalletBalanceFTHM).not.toBeVisible();
    await expect.soft(daoPage.myWalletBalanceXDC).not.toBeVisible();
    await expect.soft(daoPage.myWalletBalanceFXD).not.toBeVisible();
    await expect(
      daoPage.page.getByText("You have no open positions.")
    ).toBeVisible();
    await daoPage.connectWalletDao(WalletConnectOptions.Metamask);
    await expect.soft(daoPage.btnStake).toBeVisible();
    await expect
      .soft(daoPage.page.getByText("My Wallet Balance"))
      .toBeVisible();
    await expect.soft(daoPage.myWalletBalanceFTHM).toBeVisible();
    await expect.soft(daoPage.myWalletBalanceXDC).toBeVisible();
    await expect.soft(daoPage.myWalletBalanceFXD).toBeVisible();
    await expect
      .soft(daoPage.page.getByText("You have no open positions."))
      .not.toBeVisible();
  });
});
