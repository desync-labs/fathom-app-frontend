import { useCallback, useEffect, useState } from "react";
import useMetaMask from "hooks/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import { useStores } from "stores";
import { processRpcError } from "utils/processRpcError";
import {
  ActionType,
  StakingViewItemMethodsPropsType,
} from "components/Staking/StakingView";

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

  const withdrawRewards = useCallback(async () => {
    setAction({ type: "withdraw", id: null });
    try {
      await stakingStore.handleWithdrawRewards(account);
    } catch (e) {
      logger.log(LogLevel.error, "Withdraw error");
    }
    setAction(undefined);
  }, [stakingStore, account, setAction, logger]);

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
        console.log(e);
      }
      setAction(undefined);
      fetchOverallValues(account);
    },
    [stakingStore, account, fetchOverallValues, setAction]
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

  const isItUnlockable = useCallback((remainingTime: number) => {
    return remainingTime <= 0;
  }, []);

  const stakingViewItemProps: StakingViewItemMethodsPropsType = {
    handleEarlyWithdrawal,
    isItUnlockable,
    handleUnlock,
  };

  return {
    stakingStore,

    account,
    chainId,
    action,
    isLoading,
    isItUnlockable,

    stakingViewItemProps,
    withdrawRewards,
    claimRewards,
    fetchOverallValues,
  };
};

export default useStakingView;
