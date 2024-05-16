import { test, expect } from "../../fixtures/pomSynpressFixture";
import { WalletConnectOptions } from "../../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: DAO Staking", () => {
  test.describe.serial("Scenario 1 @smoke", () => {
    test.beforeEach(async ({ daoPage }) => {
      await daoPage.navigateStaking();
      await daoPage.connectWallet(WalletConnectOptions.Metamask);
      await daoPage.validateConnectedWalletAddress();
    });

    test("Staking 150 FTHM with a 7-day lock period is successful", async ({
      daoPage,
    }) => {
      const stakingAmount = 150;
      const lockPeriod = 7;
      const walletFTHMBalanceBefore =
        await daoPage.getMyWalletFTHMBalanceValue();
      const newPositionLockId = await daoPage.createStakeFTHMPosition({
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
      await daoPage.navigateStaking();
    });
  });
});
