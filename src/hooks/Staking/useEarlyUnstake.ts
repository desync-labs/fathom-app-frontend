import { useCallback, useMemo, useState } from "react";
import { ILockPosition } from "fathom-sdk";
import useStakingContext from "context/staking";
import { EarlyUnstakeDialogProps } from "components/Staking/Dialog/EarlyUnstakeDialog";

const YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

const useEarlyUnstake = (
  lockPosition: ILockPosition,
  onFinish: EarlyUnstakeDialogProps["onFinish"]
) => {
  const { action, handleEarlyUnstake } = useStakingContext();
  const [penaltyFeePercent, setPenaltyFeePercent] = useState(0);

  const isLoading = useMemo(() => {
    return action?.type === "early" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const penaltyFee = useMemo(() => {
    const secondsLeft = Number(lockPosition.end) - Date.now() / 1000;
    const penaltyPercent = (30 * secondsLeft) / YEAR_IN_SECONDS;

    setPenaltyFeePercent(penaltyPercent);

    return Number(lockPosition.amount) * (penaltyPercent / 100);
  }, [lockPosition, setPenaltyFeePercent]);

  const earlyUnstakeHandler = useCallback(async () => {
    handleEarlyUnstake(lockPosition.lockId).then(() => {
      onFinish(lockPosition.amount - penaltyFee);
    });
  }, [lockPosition, penaltyFee, handleEarlyUnstake, onFinish]);

  return {
    unstakeAmount: lockPosition.amount,
    penaltyFee,
    unstakeAmountWithFee: lockPosition.amount - penaltyFee,
    isLoading,
    earlyUnstakeHandler,
    penaltyFeePercent,
  };
};

export default useEarlyUnstake;
