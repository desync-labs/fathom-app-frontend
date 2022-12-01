import { useCallback, useMemo } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingContext from "context/staking";


export const PENALTY_FEE = 0.1;

const useEarlyUnstake = (lockPosition: ILockPosition, onFinish: () => void) => {
  const { action, handleEarlyUnstake } = useStakingContext();

  const isLoading = useMemo(() => {
    return action?.type === "early" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const penaltyFee = useMemo(() => {
    return lockPosition.MAINTokenBalance * (PENALTY_FEE / 100)
  }, [lockPosition])

  const earlyUnstakeHandler = useCallback(() => {
    handleEarlyUnstake(lockPosition.lockId);
  }, [lockPosition, handleEarlyUnstake]);

  return {
    unstakeAmount: lockPosition.MAINTokenBalance,
    penaltyFee,
    unstakeAmountWithFee: lockPosition.MAINTokenBalance - penaltyFee,
    isLoading,
    earlyUnstakeHandler,
  };
};

export default useEarlyUnstake;
