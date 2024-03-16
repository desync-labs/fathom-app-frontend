import { useCallback, useEffect, useMemo, useState } from "react";
import useStakingContext from "context/staking";
import { formatNumber } from "utils/format";
import { YEAR_IN_SECONDS } from "utils/Constants";
import { ILockPosition } from "fathom-sdk";
import { useServices } from "context/services";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";
import usePricesContext from "context/prices";
import { supportedChainIds } from "connectors/networks";

const useStakingItemView = (lockPosition: ILockPosition) => {
  const [seconds, setSeconds] = useState(lockPosition.end - Date.now() / 1000);
  const { processFlow, isUnlockable } = useStakingContext();
  const { account, library, chainId } = useConnector();
  const { stakingService } = useServices();
  const [rewardsAvailable, setRewardsAvailable] = useState<string>(
    lockPosition.rewardsAvailable.toString()
  );
  const { fthmPrice } = usePricesContext();

  const fthmPriceFormatted = useMemo(
    () =>
      BigNumber(fthmPrice)
        .dividedBy(10 ** 18)
        .toNumber(),
    [fthmPrice]
  );

  const fetchRewards = useCallback(() => {
    if (account && supportedChainIds.includes(chainId)) {
      stakingService
        .getStreamClaimableAmountPerLock(0, account, lockPosition.lockId)
        .then((claimRewards) => {
          setRewardsAvailable(claimRewards.toString());
        });
    }
  }, [
    stakingService,
    lockPosition,
    account,
    chainId,
    library,
    setRewardsAvailable,
  ]);

  useEffect(() => {
    const diff = lockPosition.end - Date.now() / 1000;
    if (diff <= 0) {
      return setSeconds(0);
    } else {
      return setSeconds(diff);
    }
  }, [lockPosition, setSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (seconds > 0 && !interval) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (seconds <= 0 && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [seconds, setSeconds]);

  useEffect(() => {
    if (Math.floor(seconds % 30) === 0) {
      fetchRewards();
    }
  }, [seconds, fetchRewards]);

  useEffect(() => {
    BigNumber(lockPosition.rewardsAvailable).isGreaterThan(0) &&
      setRewardsAvailable(lockPosition.rewardsAvailable.toString());
  }, [lockPosition, setRewardsAvailable]);

  const penaltyFee = useMemo(() => {
    const secondsLeft = Number(lockPosition.end) - Date.now() / 1000;
    return formatNumber((30 * secondsLeft) / YEAR_IN_SECONDS);
  }, [lockPosition]);

  return {
    processFlow,
    isUnlockable,
    penaltyFee,
    seconds,
    rewardsAvailable,
    fthmPriceFormatted,
  };
};

export default useStakingItemView;
