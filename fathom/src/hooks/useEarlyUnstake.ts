import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import ILockPosition from "stores/interfaces/ILockPosition";
import useStakingView from "hooks/useStakingView";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const useEarlyUnstake = (lockPosition: ILockPosition) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

  const { action, handleEarlyUnstake } = useStakingView();

  const isLoading = useMemo(() => {
    return action?.type === 'early' && action?.id === lockPosition?.lockId
  }, [action, lockPosition])

  const totalBalance = useMemo(() => {
    return Number(lockPosition.MAINTokenBalance) + Number(lockPosition.RewardsAvailable)
  }, [lockPosition])

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

  const formatNumber = useCallback((number: number) => {
    return formatter
      .formatToParts(number)
      .map((p) =>
        p.type !== "literal" && p.type !== "currency" ? p.value : ""
      )
      .join("");
  }, [])

  const formatCurrency = useCallback((number: number) => {
    return formatter.format(number);
  }, [])

  const setMax = useCallback(() => {
    setUnstakeAmount(totalBalance);
  }, [totalBalance, setUnstakeAmount])

  const earlyUnstakeHandler = useCallback(() => {
    handleEarlyUnstake(lockPosition.lockId)
  }, [lockPosition, handleEarlyUnstake])

  return {
    balanceError,
    unstakeAmount,
    totalBalance,

    handleUnstakeAmountChange,
    formatNumber,
    formatCurrency,
    setMax,
    earlyUnstakeHandler,

    isLoading,
  };
};

export default useEarlyUnstake;
