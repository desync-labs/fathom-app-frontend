import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LogLevel, useLogger } from "utils/Logger";
import { useServices } from "context/services";
import { ILockPosition } from "fathom-sdk";
import { useLazyQuery, useQuery } from "@apollo/client";
import { STAKING_PROTOCOL_STATS, STAKING_STAKER } from "apollo/queries";
import { COUNT_PER_PAGE } from "utils/Constants";
import useSyncContext from "context/sync";
import { useMediaQuery, useTheme } from "@mui/material";
import useConnector from "context/connector";
import debounce from "lodash.debounce";
import { BigNumber as eBigNumber } from "ethers";
import BigNumber from "bignumber.js";

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
  const { account, chainId, library } = useConnector();
  const logger = useLogger();
  const { stakingService } = useServices();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [unstake, setUnstake] = useState<null | ILockPosition>(null);
  const [earlyUnstake, setEarlyUnstake] = useState<null | ILockPosition>(null);
  const [lockPositions, setLockPositions] = useState<ILockPosition[]>([]);

  const [totalRewards, setTotalRewards] = useState<string>("0");
  const previousTotalRewardsRef = useRef<string>("0");

  const [fetchPositionsLoading, setFetchPositionLoading] =
    useState<boolean>(false);

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
    fetchStakes,
    {
      data: stakesData,
      previousData: stakesPreviousData,
      loading: stakesLoading,
      refetch: refetchStakes,
      fetchMore: fetchMoreStakes,
    },
  ] = useLazyQuery(STAKING_STAKER, {
    context: { clientName: "governance", chainId },
  });

  const fetchAllClaimRewards = useCallback(() => {
    if (account) {
      stakingService.getStreamClaimableAmount(account).then((amount) => {
        setTotalRewards(amount.toString());
        setTimeout(() => {
          previousTotalRewardsRef.current = amount.toString();
        }, 1000);
      });
    }
  }, [stakingService, account, library, setTotalRewards]);

  useEffect(() => {
    if (syncDao && !prevSyncDao) {
      refetchStakes({
        variables: {
          skip: 0,
          first: COUNT_PER_PAGE,
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
    refetchStakes,
    refetchProtocolStats,
    setCurrentPage,
  ]);

  useEffect(() => {
    if (account && stakesData?.stakers?.length) {
      fetchAllClaimRewards();
    }
  }, [account, stakesData, fetchAllClaimRewards]);

  const fetchPositions = useMemo(
    () =>
      debounce((stakesData, account, stakesLoading) => {
        if (
          stakesData?.stakers?.length &&
          stakesData?.stakers[0].lockPositions.length &&
          !stakesLoading
        ) {
          const promises: Promise<eBigNumber>[] = [];
          stakesData?.stakers[0].lockPositions.forEach(
            (lockPosition: ILockPosition) => {
              promises.push(
                stakingService.getStreamClaimableAmountPerLock(
                  0,
                  account,
                  lockPosition.lockId
                )
              );
            }
          );

          setFetchPositionLoading(true);

          Promise.all(promises).then((result) => {
            const newLockPositions = stakesData?.stakers[0].lockPositions
              .map((lockPosition: ILockPosition, index: number) => {
                const newLockPosition: ILockPosition = { ...lockPosition };
                newLockPosition.rewardsAvailable = result[index].toNumber();
                return newLockPosition;
              })
              .sort((stake1: ILockPosition, stake2: ILockPosition) => {
                return BigNumber(stake2.blockNumber)
                  .minus(stake1.blockNumber)
                  .toNumber();
              });

            setLockPositions(newLockPositions);
            setFetchPositionLoading(false);
          });
        } else {
          setLockPositions([]);
          setFetchPositionLoading(false);
        }
      }, 300),
    [stakingService, library, setLockPositions, setFetchPositionLoading]
  );

  useEffect(() => {
    if (account) {
      fetchPositions(stakesData, account, stakesLoading);
    }
  }, [stakesData, account, stakesLoading, fetchPositions]);

  /**
   * Get All claimed rewards
   */
  useEffect(() => {
    setTimeout(() => {
      fetchAllClaimRewards();
    }, 30 * 1000);
  }, [totalRewards, fetchAllClaimRewards]);

  const processFlow = useCallback(
    (action: string, position?: ILockPosition) => {
      action === "early" && setEarlyUnstake(position as ILockPosition);
      action === "unstake" && setUnstake(position as ILockPosition);

      if (["early", "unstake"].includes(action)) {
        if ((position as ILockPosition).rewardsAvailable > 0) {
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
      fetchStakes({
        variables: {
          skip: 0,
          first: COUNT_PER_PAGE,
          address: account,
        },
        fetchPolicy: "network-only",
      });

      setCurrentPage(1);
    }
  }, [account, fetchStakes, setCurrentPage]);

  const claimRewards = useCallback(
    async (callback: Function) => {
      setAction({ type: "claim", id: null });
      try {
        const blockNumber = await stakingService.handleClaimRewards(account, 0);
        callback();
        setLastTransactionBlock(blockNumber as number);
      } catch (e) {
        logger.log(LogLevel.error, "Claim error");
      } finally {
        setAction(undefined);
      }
    },
    [
      stakingService,
      account,
      library,
      logger,
      setAction,
      setLastTransactionBlock,
    ]
  );

  const withdrawAll = useCallback(
    async (callback: Function) => {
      setAction({ type: "withdrawAll", id: null });
      try {
        const blockNumber = await stakingService.handleWithdrawAll(account, 0);
        callback();
        setLastTransactionBlock(blockNumber as number);
      } catch (e) {
        logger.log(LogLevel.error, "Withdraw error");
      } finally {
        setAction(undefined);
      }
    },
    [
      stakingService,
      account,
      library,
      logger,
      setAction,
      setLastTransactionBlock,
    ]
  );

  const handleEarlyUnstake = useCallback(
    async (lockId: number) => {
      setAction({
        type: "early",
        id: lockId,
      });
      try {
        const blockNumber = await stakingService.handleEarlyWithdrawal(
          account,
          lockId
        );
        setLastTransactionBlock(blockNumber as number);
        return blockNumber;
      } catch (e) {
        logger.log(LogLevel.error, "Handle early withdrawal");
        throw e;
      } finally {
        setAction(undefined);
      }
    },
    [
      stakingService,
      account,
      library,
      logger,
      setAction,
      setLastTransactionBlock,
    ]
  );

  const handleUnlock = useCallback(
    async (lockId: number, amount: number) => {
      setAction({
        type: "unlock",
        id: lockId,
      });
      try {
        const blockNumber = await stakingService.handleUnlock(
          account,
          lockId,
          amount
        );
        setLastTransactionBlock(blockNumber as number);

        return blockNumber;
      } catch (e: any) {
        logger.log(LogLevel.error, "Handle early withdrawal");
        throw e;
      } finally {
        setAction(undefined);
      }
    },
    [
      stakingService,
      account,
      library,
      setAction,
      setLastTransactionBlock,
      logger,
    ]
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
      fetchMoreStakes({
        variables: {
          address: account,
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
        },
      });
      setCurrentPage(page);
    },
    [setCurrentPage, fetchMoreStakes, account]
  );

  return {
    isMobile,
    account,
    chainId,
    action,
    isLoading: stakesLoading || fetchPositionsLoading,
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

    stake:
      !stakesLoading && stakesData?.stakers?.length
        ? stakesData.stakers[0]
        : null,
    previousStake: stakesPreviousData?.stakers?.length
      ? stakesPreviousData.stakers[0]
      : null,
    lockPositions,
    protocolStatsInfo:
      !protocolStatsLoading && protocolStatsInfo.protocolStats.length
        ? protocolStatsInfo.protocolStats[0]
        : null,

    itemCount: stakesData?.stakers?.length
      ? stakesData.stakers[0].lockPositionCount
      : 0,
    currentPage,
    handlePageChange,
  } as const;
};

export default useStakingView;
