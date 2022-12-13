import { useEffect, useMemo, useState } from "react";
import useStakingContext from "context/staking";
import { formatNumber } from "utils/format";
import { YEAR_IN_SECONDS } from "helpers/Constants";
import ILockPosition from "stores/interfaces/ILockPosition";

const useStakingItemView = (lockPosition: ILockPosition) => {
  const [seconds, setSeconds] = useState(lockPosition.end - Date.now() / 1000);
  const { processFlow, isUnlockable } = useStakingContext();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>();

  useEffect(() => {
    const diff = lockPosition.end - Date.now() / 1000;
    if (diff <= 0) {
      return setSeconds(0);
    } else {
      return setSeconds(diff);
    }
  }, [lockPosition, setSeconds]);

  useEffect(() => {
    if (seconds > 0 && !timer) {
      const identifier = setTimeout(() => {
        setTimer(null);
        setSeconds(seconds - 1);
      }, 1000);
      setTimer(identifier);
    }
  }, [timer, seconds, setSeconds, setTimer]);

  const penaltyFee = useMemo(() => {
    const secondsLeft = Number(lockPosition.end) - Date.now() / 1000;
    return formatNumber((30 * secondsLeft) / YEAR_IN_SECONDS);
  }, [lockPosition]);

  return {
    processFlow,
    isUnlockable,
    penaltyFee,
    seconds,
  };
};

export default useStakingItemView;
