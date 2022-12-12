import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingContext from "context/staking";
import { UnStakeDialogProps } from "components/Staking/Dialog/UnstakeDialog";

const useUnstake = (
  lockPosition: ILockPosition | null,
  onFinish: UnStakeDialogProps["onFinish"]
) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [unStakeAmount, setUnStakeAmount] = useState<number>(0);

  const { action, handleUnlock } = useStakingContext();

  const isLoading = useMemo(() => {
    return action?.type === "unlock" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const totalBalance = useMemo(
    () => Number(lockPosition?.amount),
    [lockPosition]
  );

  useEffect(() => {
    if (unStakeAmount > totalBalance) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }
  }, [unStakeAmount, totalBalance]);

  const handleUnStakeAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setUnStakeAmount(value);
    },
    [setUnStakeAmount]
  );

  const setMax = useCallback(() => {
    setUnStakeAmount(totalBalance / 10 ** 18);
  }, [totalBalance, setUnStakeAmount]);

  const unStakeHandler = useCallback(async () => {
    try {
      await handleUnlock(lockPosition!.lockId);
      onFinish(unStakeAmount);
    } catch (e) {}
  }, [lockPosition, handleUnlock, onFinish, unStakeAmount]);

  return {
    balanceError,
    unStakeAmount,
    totalBalance,

    handleUnStakeAmountChange,
    setMax,
    unStakeHandler,
    isLoading,
  };
};

export default useUnstake;
