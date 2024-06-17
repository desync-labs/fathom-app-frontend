import useStakingContext from "context/staking";
import usePricesContext from "context/prices";
import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";

const useStreamStats = () => {
  const { processFlow, protocolStatsInfo, stake, previousStake, totalRewards } =
    useStakingContext();

  const { fthmPrice } = usePricesContext();
  const fthmPriceFormatted = useMemo(
    () =>
      BigNumber(fthmPrice)
        .dividedBy(10 ** 18)
        .toNumber(),
    [fthmPrice]
  );

  const [previousStakerState, setPreviousStakerState] = useState<any>();

  const [seconds, setSeconds] = useState<number | null>(null);
  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>();

  useEffect(() => {
    const now = Date.now() / 1000;
    if (BigNumber(stake?.cooldown).isGreaterThan(now)) {
      setSeconds(BigNumber(stake.cooldown).minus(now).toNumber());
    } else {
      setSeconds(null);
    }
  }, [stake, setSeconds]);

  useEffect(() => {
    setPreviousStakerState(previousStake);
  }, [previousStake, setPreviousStakerState]);

  useEffect(() => {
    if (
      timer &&
      previousStakerState &&
      previousStakerState?.cooldown !== stake?.cooldown
    ) {
      clearInterval(timer);
      setTimer(null);
      setPreviousStakerState(stake);
    }
  }, [timer, stake, previousStakerState, setTimer, setPreviousStakerState]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (BigNumber(Number(seconds)).isGreaterThan(0) && !timer) {
      interval = setInterval(() => {
        setSeconds((val) => Number(val) - 1);
      }, 1000);

      setTimer(interval);
    } else if (Number(seconds) <= 0 && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [seconds, timer, setSeconds, setTimer]);

  return {
    stake,
    seconds,
    protocolStatsInfo,
    totalRewards,
    fthmPriceFormatted,
    processFlow,
  };
};

export default useStreamStats;
