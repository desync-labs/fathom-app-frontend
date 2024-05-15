import { test } from "../../fixtures/pomSynpressFixture";
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
      const newPositionLockId = await daoPage.createStakeFTHMPosition({
        stakingAmount: 1,
        lockPeriod: 7,
      });
      console.log(newPositionLockId);
    });

    test("Early unstaking a FTHM staked position is successful", async ({
      daoPage,
    }) => {
      await daoPage.navigateStaking();
    });
  });
});
