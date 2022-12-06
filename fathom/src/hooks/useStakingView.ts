import { useCallback, useEffect, useMemo, useState } from "react";
import useMetaMask from "context/metamask";
import { LogLevel, useLogger } from "helpers/Logger";
import { useStores } from "stores";
import ILockPosition from "stores/interfaces/ILockPosition";

export type ActionType = { type: string; id: number | null };

export enum DialogActions {
  NONE,
  UNCLAIMED,
  CLAIM_REWARDS,
  CLAIM_REWARDS_COOLDOWN,
  EARLY_UNSTAKE,
  UNSTAKE,
  UNSTAKE_COOLDOWN,
  WITHDRAW,
}

const useStakingView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<ActionType>();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const { stakingStore, alertStore } = useStores();

  const [unstake, setUnstake] = useState<null | ILockPosition>(null);
  const [earlyUnstake, setEarlyUnstake] = useState<null | ILockPosition>(null);

  const [dialogAction, setDialogAction] = useState<DialogActions>(
    DialogActions.NONE
  );

  const processFlow = useCallback(
    (action: string, position?: ILockPosition) => {
      action === "early" && setEarlyUnstake(position!);
      action === "unstake" && setUnstake(position!);

      ["early", "unstake"].includes(action) &&
        !!position!.RewardsAvailable &&
        setDialogAction(DialogActions.UNCLAIMED);

      console.log(action);
      console.log(unstake);
      console.log(earlyUnstake);

      if (action === "skip" || action === "continue") {
        !!unstake && setDialogAction(DialogActions.UNSTAKE);
        !!earlyUnstake && setDialogAction(DialogActions.EARLY_UNSTAKE);
      }

      action === "unstake-cooldown" &&
        setDialogAction(DialogActions.UNSTAKE_COOLDOWN);

      action === "claim-cooldown" &&
        setDialogAction(DialogActions.CLAIM_REWARDS_COOLDOWN);

      action === "claim" && setDialogAction(DialogActions.CLAIM_REWARDS);

      action === "withdraw" && setDialogAction(DialogActions.WITHDRAW);
    },
    [unstake, earlyUnstake, setEarlyUnstake, setUnstake, setDialogAction]
  );

  const fetchAll = useCallback(
    async (account: string) => {
      setIsLoading(true);
      Promise.all([
        stakingStore.fetchLocks(account),
        stakingStore.fetchVOTEBalance(account),
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
        stakingStore.fetchAPR(),
      ]).then(() => {
        setIsLoading(false);
      });
    },
    [stakingStore, setIsLoading]
  );

  useEffect(() => {
    if (chainId) {
      fetchAll(account);
    } else {
      stakingStore.setLocks([]);
    }
  }, [account, logger, stakingStore, chainId, fetchAll]);

  const claimRewards = useCallback(
    async (callback: Function) => {
      setAction({ type: "claim", id: null });
      try {
        await stakingStore.handleClaimRewards(account);
        stakingStore.fetchLocksAfterClaimAllRewards();
        callback();
      } catch (e) {
        logger.log(LogLevel.error, "Claim error");
      }
      setAction(undefined);
    },
    [stakingStore, account, setAction, logger]
  );

  const withdrawAll = useCallback(async () => {
    setAction({ type: "withdrawAll", id: null });
    try {
      await stakingStore.handleWithdrawAll(account);
      fetchOverallValues(account);
    } catch (e) {
      logger.log(LogLevel.error, "Withdraw error");
    }
    setAction(undefined);
  }, [stakingStore, account, fetchOverallValues, setAction, logger]);

  const handleEarlyUnstake = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      try {
        await stakingStore.handleEarlyWithdrawal(account, lockId);
        stakingStore.fetchLockPositionAfterUnlock(lockId);
      } catch (e) {
        logger.log(LogLevel.error, "Handle early withdrawal");
      }
      setAction(undefined);
    },
    [stakingStore, account, setAction, logger]
  );

  const handleUnlock = useCallback(
    async (lockId: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      try {
        await stakingStore.handleUnlock(account, lockId);
        stakingStore.fetchLockPositionAfterUnlock(lockId);
      } catch (e: any) {
        alertStore.setShowErrorAlert(true, e.message);
        throw e;
      }

      setAction(undefined);
      fetchOverallValues(account);
    },
    [stakingStore, account, fetchOverallValues, setAction, alertStore]
  );

  const isUnlockable = useCallback((remainingTime: number) => {
    return remainingTime <= 0;
  }, []);

  const totalRewards = useMemo(() => {
    return stakingStore.lockPositions.reduce(
      (previousValue, lockPositions) =>
        previousValue + Number(lockPositions.RewardsAvailable),
      0
    );
  }, [stakingStore.lockPositions]);

  const onClose = useCallback(() => {
    setEarlyUnstake(null);
    setUnstake(null);
    setDialogAction(DialogActions.NONE);
  }, [setEarlyUnstake, setUnstake, setDialogAction]);

  return {
    stakingStore,
    account,
    chainId,
    action,
    isLoading,
    isUnlockable,
    withdrawAll,
    claimRewards,
    fetchOverallValues,

    handleEarlyUnstake,
    handleUnlock,

    unstake,
    earlyUnstake,
    dialogAction,
    setDialogAction,
    totalRewards,

    setUnstake,
    setEarlyUnstake,

    onClose,
    processFlow,
  } as const;
};

export default useStakingView;
