/**
 * This hook is used for getting historical reserve data, and it is primarily used with charts.
 * In particular, this hook is used in the ApyGraph.
 */
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { ESupportedTimeRanges } from "apps/lending/modules/reserve-overview/TimeRangeSelector";
import { makeCancelable } from "apps/lending/utils/utils";

export const reserveRateTimeRangeOptions = [
  ESupportedTimeRanges.OneMonth,
  ESupportedTimeRanges.SixMonths,
  ESupportedTimeRanges.OneYear,
];
export type ReserveRateTimeRange = (typeof reserveRateTimeRangeOptions)[number];

type RatesHistoryParams = {
  from: number;
  resolutionInHours: number;
};

type APIResponse = {
  liquidityRate_avg: number;
  variableBorrowRate_avg: number;
  stableBorrowRate_avg: number;
  utilizationRate_avg: number;
  x: { year: number; month: number; date: number; hours: number };
};

const fetchStats = async (
  address: string,
  timeRange: ReserveRateTimeRange,
  endpointURL: string
) => {
  const { from, resolutionInHours } = resolutionForTimeRange(timeRange);
  try {
    const url = `${endpointURL}?reserveId=${address}&from=${from}&resolutionInHours=${resolutionInHours}`;
    const result = await fetch(url);
    const json = await result.json();
    return json;
  } catch (e) {
    return [];
  }
};

// TODO: there is possibly a bug here, as Polygon and Avalanche v2 data is coming through empty and erroring in our hook
// The same asset without the 'from' field comes through just fine.
const resolutionForTimeRange = (
  timeRange: ReserveRateTimeRange
): RatesHistoryParams => {
  // Return today as a fallback
  let calculatedDate = dayjs().unix();
  switch (timeRange) {
    case ESupportedTimeRanges.OneMonth:
      calculatedDate = dayjs().subtract(30, "day").unix();
      return {
        from: calculatedDate,
        resolutionInHours: 6,
      };
    case ESupportedTimeRanges.SixMonths:
      calculatedDate = dayjs().subtract(6, "month").unix();
      return {
        from: calculatedDate,
        resolutionInHours: 24,
      };
    case ESupportedTimeRanges.OneYear:
      calculatedDate = dayjs().subtract(1, "year").unix();
      return {
        from: calculatedDate,
        resolutionInHours: 24,
      };
    default:
      return {
        from: calculatedDate,
        resolutionInHours: 6,
      };
  }
};

export type FormattedReserveHistoryItem = {
  date: number;
  liquidityRate: number;
  utilizationRate: number;
  stableBorrowRate: number;
  variableBorrowRate: number;
};

// TODO: api need to be altered to expect chainId underlying asset and poolConfig
export function useReserveRatesHistory(
  reserveAddress: string,
  timeRange: ReserveRateTimeRange
) {
  const { currentNetworkConfig } = useProtocolDataContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<FormattedReserveHistoryItem[]>([]);

  const ratesHistoryApiUrl = currentNetworkConfig?.ratesHistoryApiUrl;

  const refetchData = useCallback<() => () => void>(() => {
    // reset
    setLoading(true);
    setError(false);
    setData([]);

    if (reserveAddress && ratesHistoryApiUrl) {
      const cancelable = makeCancelable(
        fetchStats(reserveAddress, timeRange, ratesHistoryApiUrl)
      );

      cancelable.promise
        .then((data: APIResponse[]) => {
          setData(
            data.map((d) => ({
              date: new Date(
                d.x.year,
                d.x.month,
                d.x.date,
                d.x.hours
              ).getTime(),
              liquidityRate: d.liquidityRate_avg,
              variableBorrowRate: d.variableBorrowRate_avg,
              utilizationRate: d.utilizationRate_avg,
              stableBorrowRate: d.stableBorrowRate_avg,
            }))
          );
          setLoading(false);
        })
        .catch((e) => {
          console.error(
            "useReservesHistory(): Failed to fetch historical reserve data.",
            e
          );
          setError(true);
          setLoading(false);
        });

      return cancelable.cancel;
    }

    setLoading(false);
    return () => null;
  }, [reserveAddress, timeRange, ratesHistoryApiUrl]);

  useEffect(() => {
    const cancel = refetchData();
    return () => cancel();
  }, [refetchData]);

  return {
    loading,
    data,
    error: error || (!loading && data.length === 0),
    refetch: refetchData,
  };
}
