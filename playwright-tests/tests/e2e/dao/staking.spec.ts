import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../../types";
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

    test(
      qase(38, "Staking 150 FTHM with a 7-day lock period is successful"),
      async ({ daoPage }) => {
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
      }
    );

    test(
      qase(39, "Early unstaking a FTHM staked position is successful"),
      async ({ daoPage }) => {
        await daoPage.clickEarlyUnstakeButtonByLockId({
          lockId: newPositionLockId,
        });
        await daoPage.validateEarlyUnstakeDialog({
          stakingAmountExpected: stakingAmount,
        });
        await daoPage.confirmUnstakeEarlyUnstakeDialog();
        await daoPage.validateConfirmEarlyUnstake({
          lockId: newPositionLockId,
        });
        await daoPage.validateUnstakeCooldownDialog({ stakingAmount });
      }
    );
  });

  test(
    qase(
      40,
      "Wallet not connected state layout is correct, staking connect wallet functionality is successful"
    ),
    async ({ daoPage }) => {
      await daoPage.navigateStaking();
      await expect(daoPage.btnDaoConnectWallet).toBeVisible();
      await expect.soft(daoPage.myWalletBalanceFTHM).toBeVisible();
      const walletFTHMBalanceBefore =
        await daoPage.getMyWalletFTHMBalanceValue();
      expect.soft(walletFTHMBalanceBefore).toEqual(0);
      await expect(
        daoPage.page.getByText("You have no open positions.")
      ).toBeVisible();
      await daoPage.connectWalletDao(WalletConnectOptions.Metamask);
      await expect.soft(daoPage.btnStake).toBeVisible();
      await expect.soft(daoPage.myWalletBalanceFTHM).toBeVisible();
      const walletFTHMBalanceAfter =
        await daoPage.getMyWalletFTHMBalanceValue();
      expect.soft(walletFTHMBalanceAfter).toBeGreaterThan(0);
      await expect
        .soft(daoPage.page.getByText("You have no open positions."))
        .not.toBeVisible();
    }
  );

  test(
    qase(
      84,
      "'Buy FTHM on DEX' button is functional and successfully redirects to DEX page with prefilled FXD to FTHM values"
    ),
    async ({ daoPage, dexPage }) => {
      await daoPage.navigateStaking();
      await daoPage.connectWallet(WalletConnectOptions.Metamask);
      await daoPage.validateConnectedWalletAddress();
      await expect(daoPage.btnBuyFthmDex).toBeVisible();
      await daoPage.btnBuyFthmDex.click();
      await expect(daoPage.page).toHaveURL(/#\/swap/);
      await expect
        .soft(
          dexPage.fromCurrencySelectButton.locator(
            "span.token-symbol-container"
          )
        )
        .toContainText("FXD");
      await expect
        .soft(
          dexPage.toCurrencySelectButton.locator("span.token-symbol-container")
        )
        .toContainText("FTHM");
    }
  );
});
