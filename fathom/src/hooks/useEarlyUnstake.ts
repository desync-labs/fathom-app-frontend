import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingView from "hooks/useStakingView";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const useEarlyUnstake = (lockPosition: ILockPosition) => {
  const { action, handleEarlyUnstake } = useStakingView();

  const isLoading = useMemo(() => {
    return action?.type === "early" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const earlyUnstakeHandler = useCallback(() => {
    handleEarlyUnstake(lockPosition.lockId);
  }, [lockPosition, handleEarlyUnstake]);

  return {
    unstakeAmount: lockPosition.MAINTokenBalance,
    penaltyFee: 0,
    unstakeAmountWithFee: lockPosition.MAINTokenBalance,
    isLoading,
    earlyUnstakeHandler,
  };
};

export default useEarlyUnstake;
