import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { LogLevel, useLogger } from "helpers/Logger";
import { useStores } from "stores";
import ILockPosition from "stores/interfaces/ILockPosition";
import { useLazyQuery, useQuery } from "@apollo/client";
import { STAKING_PROTOCOL_STATS, STAKING_STAKER } from "apollo/queries";
import { Constants } from "helpers/Constants";
import useSyncContext from "context/sync";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";
import useConnector from "context/connector";

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
  const [action, setAction] = useState<ActionType>();
  const { account, chainId, library } = useConnector()!;
  const logger = useLogger();
  const { stakingStore } = useStores();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [unstake, setUnstake] = useState<null | ILockPosition>(null);
  const [earlyUnstake, setEarlyUnstake] = useState<null | ILockPosition>(null);
  const [lockPositions, setLockPositions] = useState<ILockPosition[]>([]);

  const [totalRewards, setTotalRewards] = useState(0);
  const previousTotalRewardsRef = useRef<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { setLastTransactionBlock, syncDao, prevSyncDao } = useSyncContext();

  const [dialogAction, setDialogAction] = useState<DialogActions>(
    DialogActions.NONE
  );

  const {
    data: protocolStatsInfo,
    loading: protocolStatsLoading,
    refetch: refetchProtocolStats,
  } = useQuery(STAKING_PROTOCOL_STATS, {
    context: { clientName: "governance", chainId },
  });

  const [
    fetchStakers,
    {
      data: stakersData,
      previousData: stakerPreviousData,
      loading: stakersLoading,
      refetch: refetchStakers,
      fetchMore: fetchMoreStakers,
    },
  ] = useLazyQuery(STAKING_STAKER, {
    context: { clientName: "governance", chainId },
  });

  const fetchAllClaimRewards = useCallback(() => {
   if (account) {
     stakingStore.getStreamClaimableAmount(account, library).then((amount) => {
       setTotalRewards(Number(amount));

       setTimeout(() => {
         previousTotalRewardsRef.current = amount!;
       }, 1000);
     });
   }
  }, [stakingStore, account, library, setTotalRewards]);

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetchStakers({
        variables: {
          skip: 0,
          first: Constants.COUNT_PER_PAGE,
          address: account,
        },
      });

      refetchProtocolStats();
      setCurrentPage(1);
    }
  }, [
    syncDao,
    account,
    prevSyncDao,
    refetchStakers,
    refetchProtocolStats,
    setCurrentPage,
  ]);

  useEffect(() => {
    if (account && stakersData?.stakers?.length) {
      fetchAllClaimRewards();
    }
  }, [account, stakersData, fetchAllClaimRewards]);

  const fetchPositions = useCallback(async () => {
    if (stakersData?.stakers?.length) {
      const promises: Promise<number>[] = [];
      stakersData?.stakers[0].lockPositions.forEach(
        (lockPosition: ILockPosition) => {
          promises.push(
            stakingStore.getStreamClaimableAmountPerLock(
              account,
              lockPosition.lockId,
              library
            )
          );
        }
      );

      Promise.all(promises).then((result) => {
        const newLockPositions = stakersData?.stakers[0].lockPositions.map(
          (lockPosition: ILockPosition, index: number) => {
            const newLockPosition: ILockPosition = { ...lockPosition };
            newLockPosition.rewardsAvailable = Number(result[index]);
            return newLockPosition;
          }
        );

        setLockPositions(newLockPositions);
      });
    } else {
      setLockPositions([]);
    }
  }, [stakingStore, stakersData, account, library, setLockPositions]);

  useEffect(() => {
    if (stakersData?.stakers?.length && account) {
      fetchPositions();
    }
  }, [stakersData, account, fetchPositions]);

  /**
   * Get All claimed rewards
   */
  useEffect(() => {
    setTimeout(() => {
      fetchAllClaimRewards();
    }, 30 * 1000)
  }, [totalRewards, fetchAllClaimRewards]);

  const processFlow = useCallback(
    (action: string, position?: ILockPosition) => {
      action === "early" && setEarlyUnstake(position!);
      action === "unstake" && setUnstake(position!);

      if (["early", "unstake"].includes(action)) {
        if (position!.rewardsAvailable > 0) {
          return setDialogAction(DialogActions.UNCLAIMED);
        }
        action === "early"
          ? setDialogAction(DialogActions.EARLY_UNSTAKE)
          : setDialogAction(DialogActions.UNSTAKE);
      }

      if (action === "skip" || action === "continue") {
        !!unstake && setDialogAction(DialogActions.UNSTAKE);
        !!earlyUnstake && setDialogAction(DialogActions.EARLY_UNSTAKE);
      }

      if (action === "unstake-cooldown-unstake") {
        setDialogAction(DialogActions.UNSTAKE_COOLDOWN);
        console.log("Unstake", position);
        !!position && setUnstake(position);
      }

      if (action === "unstake-cooldown-early-unstake") {
        setDialogAction(DialogActions.UNSTAKE_COOLDOWN);
        console.log("Early unstake", position);
        !!position && setEarlyUnstake(position);
      }

      action === "claim-cooldown" &&
        setDialogAction(DialogActions.CLAIM_REWARDS_COOLDOWN);

      action === "claim" && setDialogAction(DialogActions.CLAIM_REWARDS);

      action === "withdraw" && setDialogAction(DialogActions.WITHDRAW);
    },
    [unstake, earlyUnstake, setEarlyUnstake, setUnstake, setDialogAction]
  );

  useEffect(() => {
    if (account) {
      fetchStakers({
        variables: {
          skip: 0,
          first: Constants.COUNT_PER_PAGE,
          address: account,
        },
        fetchPolicy: "network-only"
      });

      setCurrentPage(1);
    }
  }, [account, fetchStakers, setCurrentPage]);

  const claimRewards = useCallback(
    async (callback: Function) => {
      setAction({ type: "claim", id: null });
      try {
        const receipt = await stakingStore.handleClaimRewards(account, library);
        callback();
        setLastTransactionBlock(receipt.blockNumber);
      } catch (e) {
        logger.log(LogLevel.error, "Claim error");
      } finally {
        setAction(undefined);
      }
    },
    [stakingStore, account, library, logger, setAction, setLastTransactionBlock]
  );

  const withdrawAll = useCallback(
    async (callback: Function) => {
      setAction({ type: "withdrawAll", id: null });
      try {
        const receipt = await stakingStore.handleWithdrawAll(account, library);
        callback();
        setLastTransactionBlock(receipt.blockNumber);
      } catch (e) {
        logger.log(LogLevel.error, "Withdraw error");
      } finally {
        setAction(undefined);
      }
    },
    [stakingStore, account, library, logger, setAction, setLastTransactionBlock]
  );

  const handleEarlyUnstake = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      try {
        const receipt = await stakingStore.handleEarlyWithdrawal(
          account,
          lockId,
          library,
        );
        setLastTransactionBlock(receipt.blockNumber);
        return receipt;
      } catch (e) {
        logger.log(LogLevel.error, "Handle early withdrawal");
        throw e;
      } finally {
        setAction(undefined);
      }
    },
    [stakingStore, account, library, logger, setAction, setLastTransactionBlock]
  );

  const handleUnlock = useCallback(
    async (lockId: number, amount: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      try {
        const receipt = await stakingStore.handleUnlock(
          account,
          lockId,
          amount,
          library
        );
        setLastTransactionBlock(receipt.blockNumber);

        return receipt;
      } catch (e: any) {
        logger.log(LogLevel.error, "Handle early withdrawal");
        throw e;
      } finally {
        setAction(undefined);
      }
    },
    [stakingStore, account, library, setAction, setLastTransactionBlock, logger]
  );

  const isUnlockable = useCallback((remainingTime: number) => {
    return remainingTime <= 0;
  }, []);

  const onClose = useCallback(() => {
    setEarlyUnstake(null);
    setUnstake(null);
    setDialogAction(DialogActions.NONE);
  }, [setEarlyUnstake, setUnstake, setDialogAction]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMoreStakers({
        variables: {
          address: account,
          first: Constants.COUNT_PER_PAGE,
          skip: (page - 1) * Constants.COUNT_PER_PAGE,
        },
      });
      setCurrentPage(page);
    },
    [setCurrentPage, fetchMoreStakers, account]
  );

  return {
    isMobile,
    account,
    chainId,
    action,
    isLoading: stakersLoading,
    isUnlockable,
    withdrawAll,
    claimRewards,

    handleEarlyUnstake,
    handleUnlock,

    unstake,
    earlyUnstake,

    dialogAction,
    setDialogAction,

    totalRewards,
    previousTotalRewards: previousTotalRewardsRef.current,

    setUnstake,
    setEarlyUnstake,

    onClose,
    processFlow,

    staker:
      !stakersLoading && stakersData?.stakers?.length
        ? stakersData.stakers[0]
        : null,
    previousStaker: stakerPreviousData?.stakers?.length ? stakerPreviousData.stakers[0] : null,
    lockPositions,
    protocolStatsInfo:
      !protocolStatsLoading && protocolStatsInfo.protocolStats.length
        ? protocolStatsInfo.protocolStats[0]
        : null,

    itemCount: stakersData?.stakers?.length
      ? stakersData.stakers[0].lockPositionCount
      : 0,
    currentPage,
    handlePageChange,
  } as const;
};

export default useStakingView;
