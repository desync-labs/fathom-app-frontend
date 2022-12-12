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
    return lockPosition.amount * (PENALTY_FEE / 100)
  }, [lockPosition])

  const earlyUnstakeHandler = useCallback(() => {
    try {
      handleEarlyUnstake(lockPosition.lockId);
      onFinish();
    } catch (e) {

    }
  }, [lockPosition, handleEarlyUnstake]);

  return {
    unstakeAmount: lockPosition.amount,
    penaltyFee,
    unstakeAmountWithFee: lockPosition.amount - penaltyFee,
    isLoading,
    earlyUnstakeHandler,
  };
};

export default useEarlyUnstake;
