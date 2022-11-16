import {
  ChangeEvent,
  useCallback,
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

const useUnstake = (lockPosition: ILockPosition | null) => {
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [unstakeAmount, setUnstakeAmount] = useState<number>(0);

  const { action, handleUnlock } = useStakingView();

  const isLoading = useMemo(() => {
    return action?.type === 'unlock' && action?.id === lockPosition?.lockId
  }, [action, lockPosition])

  const totalBalance = useMemo(() => {
    if (lockPosition) {
      return Number(lockPosition.MAINTokenBalance) + Number(lockPosition.RewardsAvailable)
    }

    return 0;
  }, [lockPosition])

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

  const unstakeHandler = useCallback(() => {

  }, [])

  return {
    balanceError,
    unstakeAmount,
    totalBalance,

    handleUnstakeAmountChange,
    formatNumber,
    formatCurrency,
    setMax,
    unstakeHandler,

    isLoading,
  };
};

export default useUnstake;
