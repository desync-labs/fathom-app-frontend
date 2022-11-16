import { useCallback, useEffect, useState } from "react";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import { useStores } from "stores";
import { processRpcError } from "utils/processRpcError";
import ILockPosition from "../stores/interfaces/ILockPosition";

export type ActionType = { type: string; id: number | null };

const useStakingView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionType>();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const { stakingStore, alertStore } = useStores();

  const fetchAll = useCallback(
    async (account: string) => {
      setIsLoading(true);
      Promise.all([
        stakingStore.fetchLocks(account),
        stakingStore.fetchVOTEBalance(account),
        stakingStore.fetchWalletBalance(account),
        stakingStore.fetchAPR(),
      ]).then(() => {
        setIsLoading(false);
      });
    },
    [stakingStore, setIsLoading]
  );

  const fetchOverallValues = useCallback(
    async (account: string) => {
      setIsLoading(true);
      await Promise.all([
        stakingStore.fetchVOTEBalance(account),
        stakingStore.fetchWalletBalance(account),
        stakingStore.fetchAPR(),
      ]).then(() => {
        setIsLoading(false);
      });
    },
    [stakingStore, setIsLoading]
  );

  useEffect(() => {
    if (chainId) {
      logger.log(LogLevel.info, "Fetching lock positions.");
      fetchAll(account);
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, logger, stakingStore, chainId, fetchAll]);

  const claimRewards = useCallback(async () => {
    setAction({ type: "claim", id: null });
    try {
      await stakingStore.handleClaimRewards(account);
      fetchAll(account);
    } catch (e) {
      logger.log(LogLevel.error, "Claim error");
    }
    setAction(undefined);
  }, [stakingStore, account, setAction, fetchAll, logger]);

  const claimRewardsSingle = useCallback(
    async (lockId: number) => {
      setAction({ type: "claimSingle", id: lockId });
      try {
        await stakingStore.handleClaimRewardsSingle(account, lockId);
        fetchAll(account);
      } catch (e) {
        logger.log(LogLevel.error, "Claim Rewards Single error");
      }

      setAction(undefined);
    },
    [stakingStore, account, setAction, fetchAll, alertStore]
  );

  const withdrawRewards = useCallback(async () => {
    setAction({ type: "withdraw", id: null });
    try {
      await stakingStore.handleWithdrawRewards(account);
      fetchOverallValues(account);
    } catch (e) {
      logger.log(LogLevel.error, "Withdraw error");
    }
    setAction(undefined);
  }, [stakingStore, account, fetchOverallValues, setAction, logger]);

  const handleEarlyWithdrawal = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      try {
        await stakingStore.handleEarlyWithdrawal(account, lockId);
        await stakingStore.fetchLockPositionAfterUnlock(lockId);
      } catch (e) {
        logger.log(LogLevel.error, "handle Early Withdrawal");
      }
      setAction(undefined);
      fetchOverallValues(account);
    },
    [stakingStore, account, fetchOverallValues, setAction, logger]
  );

  const handleUnlock = useCallback(
    async (lockId: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      try {
        await stakingStore.handleUnlock(account, lockId);
        await stakingStore.fetchLockPositionAfterUnlock(lockId);
      } catch (e) {
        const err = processRpcError(e);
        alertStore.setShowErrorAlert(true, err.reason || err.message);
      }

      setAction(undefined);
      fetchOverallValues(account);
    },
    [stakingStore, account, fetchOverallValues, setAction, alertStore]
  );

  const isUnlockable = useCallback((remainingTime: number) => {
    return remainingTime <= 0;
  }, []);

  const calculateTotalRewards = useCallback(
    (lockPositions: ILockPosition[]) => {
      return lockPositions.reduce(
        (previousValue, lockPositions) =>
          previousValue + Number(lockPositions.RewardsAvailable),
        0
      );
    },
    []
  );

  return {
    stakingStore,
    account,
    chainId,
    action,
    isLoading,
    isUnlockable,
    withdrawRewards,
    claimRewards,
    fetchOverallValues,

    handleEarlyWithdrawal,
    handleUnlock,

    calculateTotalRewards,
    claimRewardsSingle,
  };
};

export default useStakingView;
