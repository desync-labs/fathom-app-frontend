import useStakingContext from "context/staking";
import usePricesContext from "context/prices";
import { useEffect, useMemo, useState } from "react";

const useStreamStats = () => {
  const {
    processFlow,
    protocolStatsInfo,
    staker,
    previousStaker,
    totalRewards,
  } = useStakingContext();

  const { fthmPrice } = usePricesContext();
  const fthmPriceFormatted = useMemo(() => fthmPrice / 10 ** 18, [fthmPrice]);

  const [previousStakerState, setPreviousStakerState] = useState<any>();

  const [seconds, setSeconds] = useState<number>(0);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>();

  useEffect(() => {
    const now = Date.now() / 1000;
    if (Number(staker?.cooldown) > now) {
      setSeconds(Number(staker.cooldown) - now);
    } else {
      setSeconds(0);
    }
  }, [staker, setSeconds]);

  useEffect(() => {
    setPreviousStakerState(previousStaker);
  }, [previousStaker, setPreviousStakerState]);

  useEffect(() => {
    if (
      timer &&
      previousStakerState &&
      previousStakerState?.cooldown !== staker?.cooldown
    ) {
      clearTimeout(timer);
      setTimer(null);
      setPreviousStakerState(staker);
    }
  }, [timer, staker, previousStakerState, setTimer, setPreviousStakerState]);

  useEffect(() => {
    if (seconds > 0 && !timer) {
      const identifier = setTimeout(() => {
        setSeconds(seconds - 1);
        setTimer(null);
      }, 1000);
      setTimer(identifier);
    }
  }, [seconds, timer, setSeconds, setTimer]);

  return {
    staker,
    seconds,
    protocolStatsInfo,
    totalRewards,
    fthmPriceFormatted,
    processFlow,
  };
};

export default useStreamStats;
