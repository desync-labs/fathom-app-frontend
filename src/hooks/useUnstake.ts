import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ILockPosition } from "fathom-sdk";
import useStakingContext from "context/staking";
import { UnStakeDialogProps } from "components/Staking/Dialog/UnstakeDialog";
import BigNumber from "bignumber.js";

const useUnstake = (
  lockPosition: ILockPosition | null,
  onFinish: UnStakeDialogProps["onFinish"]
) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [requiredError, setRequiredError] = useState<boolean>(false);
  const [unStakeAmount, setUnStakeAmount] = useState<number>(0);

  const { action, handleUnlock } = useStakingContext();

  const isLoading = useMemo(() => {
    return action?.type === "unlock" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const totalBalance = useMemo(
    () => (lockPosition ? lockPosition.amount.toString() : "0"),
    [lockPosition]
  );

  useEffect(() => {
    if (
      BigNumber(unStakeAmount).isGreaterThan(
        BigNumber(totalBalance).dividedBy(10 ** 18)
      )
    ) {
      setBalanceError(true);
    } else {
      setBalanceError(false);
    }
  }, [unStakeAmount, totalBalance]);

  useEffect(() => {
    if (!unStakeAmount || !BigNumber(unStakeAmount).isGreaterThan(0)) {
      setRequiredError(true);
    } else {
      setRequiredError(false);
    }
  }, [unStakeAmount, setRequiredError]);

  const handleUnStakeAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setUnStakeAmount(value);
    },
    [setUnStakeAmount]
  );

  const setMax = useCallback(() => {
    setUnStakeAmount(
      BigNumber(totalBalance)
        .dividedBy(10 ** 18)
        .toNumber()
    );
  }, [totalBalance, setUnStakeAmount]);

  const unStakeHandler = useCallback(async () => {
    await handleUnlock(lockPosition?.lockId as number, unStakeAmount);
    onFinish(unStakeAmount);
  }, [lockPosition, handleUnlock, onFinish, unStakeAmount]);

  return {
    balanceError,
    requiredError,
    unStakeAmount,
    totalBalance,

    handleUnStakeAmountChange,
    setMax,
    unStakeHandler,
    isLoading,
  };
};

export default useUnstake;
