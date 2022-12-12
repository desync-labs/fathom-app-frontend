import { useCallback, useMemo } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingContext from "context/staking";
import { EarlyUnstakeDialogProps } from "components/Staking/Dialog/EarlyUnstakeDialog";

export const PENALTY_FEE = 0.1;

const useEarlyUnstake = (lockPosition: ILockPosition, onFinish: EarlyUnstakeDialogProps['onFinish']) => {
  const { action, handleEarlyUnstake } = useStakingContext();

  const isLoading = useMemo(() => {
    return action?.type === "early" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const penaltyFee = useMemo(() => {
    return lockPosition.amount * (PENALTY_FEE / 100);
  }, [lockPosition]);

  const earlyUnstakeHandler = useCallback(async () => {
    try {
      await handleEarlyUnstake(lockPosition.lockId);
      onFinish(lockPosition.amount - penaltyFee);
    } catch (e) {}
  }, [lockPosition, penaltyFee, handleEarlyUnstake, onFinish]);

  return {
    unstakeAmount: lockPosition.amount,
    penaltyFee,
    unstakeAmountWithFee: lockPosition.amount - penaltyFee,
    isLoading,
    earlyUnstakeHandler,
  };
};

export default useEarlyUnstake;
