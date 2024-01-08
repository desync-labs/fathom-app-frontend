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

  const [seconds, setSeconds] = useState<number>(0);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>();

  useEffect(() => {
    const now = Date.now() / 1000;
    if (Number(stake?.cooldown) > now) {
      setSeconds(Number(stake.cooldown) - now);
    } else {
      setSeconds(0);
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
      clearTimeout(timer);
      setTimer(null);
      setPreviousStakerState(stake);
    }
  }, [timer, stake, previousStakerState, setTimer, setPreviousStakerState]);

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
    stake,
    seconds,
    protocolStatsInfo,
    totalRewards,
    fthmPriceFormatted,
    processFlow,
  };
};

export default useStreamStats;
