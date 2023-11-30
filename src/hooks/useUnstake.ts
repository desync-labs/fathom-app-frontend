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
  const [unStakeAmount, setUnStakeAmount] = useState<string>("");

  const { action, handleUnlock } = useStakingContext();

  const isLoading = useMemo(() => {
    return action?.type === "unlock" && action?.id === lockPosition?.lockId;
  }, [action, lockPosition]);

  const totalBalance = useMemo(
    () => (lockPosition ? lockPosition.amount.toString() : "0"),
    [lockPosition]
  );

  const isBalanceError = useCallback(
    (unStakeAmount: string, totalBalance: string) => {
      if (
        BigNumber(unStakeAmount).isGreaterThan(
          BigNumber(totalBalance).dividedBy(10 ** 18)
        )
      ) {
        setBalanceError(true);
        return true;
      } else {
        setBalanceError(false);
        return false;
      }
    },
    [setBalanceError]
  );

  const isRequiredError = useCallback(
    (unStakeAmount: string) => {
      if (
        !unStakeAmount ||
        !BigNumber(unStakeAmount).isGreaterThanOrEqualTo(0)
      ) {
        setRequiredError(true);
        return true;
      } else {
        setRequiredError(false);
        return false;
      }
    },
    [setRequiredError]
  );

  useEffect(() => {
    unStakeAmount && isBalanceError(unStakeAmount, totalBalance);
  }, [unStakeAmount, totalBalance, isBalanceError]);

  const handleUnStakeAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUnStakeAmount(value);
    },
    [setUnStakeAmount]
  );

  const setMax = useCallback(() => {
    setUnStakeAmount(
      BigNumber(totalBalance)
        .dividedBy(10 ** 18)
        .toString()
    );
  }, [totalBalance, setUnStakeAmount]);

  const unStakeHandler = useCallback(async () => {
    if (
      isRequiredError(unStakeAmount) ||
      isBalanceError(unStakeAmount, totalBalance)
    ) {
      return;
    }

    await handleUnlock(lockPosition?.lockId as number, Number(unStakeAmount));
    onFinish(Number(unStakeAmount));
  }, [lockPosition, handleUnlock, onFinish, unStakeAmount, totalBalance]);

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
