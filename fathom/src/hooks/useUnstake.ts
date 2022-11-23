import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingView from "hooks/useStakingView";
import { UNSTAKE_TYPE } from "components/Staking/Dialog/UnstakeDialog";



const useUnstake = (
  lockPosition: ILockPosition | null,
  lockPositions: ILockPosition[] | null,
  type: UNSTAKE_TYPE
) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

  const { action, handleUnlock, withdrawAll } = useStakingView();

  const isLoading = useMemo(() => {
    return (action?.type === "unlock" && action?.id === lockPosition?.lockId) || action?.type === 'withdrawAll';
  }, [action, lockPosition]);

  const totalBalance = useMemo(() => {
    return (
      Number(lockPosition?.MAINTokenBalance) +
      Number(lockPosition?.RewardsAvailable)
    );
  }, [lockPosition]);

  const totalUnstakeBalance = useMemo(() => {
    return lockPositions?.filter(lockPosition => lockPosition.EndTime <= 0)?.reduce((premValue, lockPosition) => {
      return (
        premValue +
        (Number(lockPosition.MAINTokenBalance) +
          Number(lockPosition.RewardsAvailable))
      );
    }, 0);
  }, [lockPositions]);

  const totalMainTokenBalance = useMemo(() => {
    return lockPositions?.filter(lockPosition => lockPosition.EndTime <= 0).reduce((premValue, lockPosition) => {
      return (
        premValue +
        Number(lockPosition.MAINTokenBalance)
      );
    }, 0);
  }, [lockPositions]);

  const totalRewardBalance = useMemo(() => {
    return lockPositions?.filter(lockPosition => lockPosition.EndTime <= 0).reduce((premValue, lockPosition) => {
      return (
        premValue +
        Number(lockPosition.RewardsAvailable)
      );
    }, 0);
  }, [lockPositions]);

  useEffect(() => {
    if (type === UNSTAKE_TYPE.ALL && totalUnstakeBalance) {
      setUnstakeAmount(totalUnstakeBalance)
    }
  }, [type, totalUnstakeBalance, setUnstakeAmount])

  useEffect(() => {
    if (unstakeAmount > totalBalance) {
      setBalanceError(true)
    } else {
      setBalanceError(false)
    }
  }, [unstakeAmount, totalBalance])

  const handleUnstakeAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setUnstakeAmount(value);
    },
    [setUnstakeAmount]
  );

  const setMax = useCallback(() => {
    setUnstakeAmount(totalBalance);
  }, [totalBalance, setUnstakeAmount]);

  const unstakeHandler = useCallback(() => {
    if (type === UNSTAKE_TYPE.ITEM) {
      handleUnlock(lockPosition!.lockId)
    } else {
      withdrawAll();
    }
  }, [type, lockPosition, handleUnlock, withdrawAll]);

  return {
    balanceError,
    unstakeAmount,
    totalBalance,

    handleUnstakeAmountChange,
    setMax,
    unstakeHandler,

    totalUnstakeBalance,
    totalMainTokenBalance,
    totalRewardBalance,

    isLoading,
  };
};

export default useUnstake;
