import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import { dexClient as client } from "apollo/client";
import {
  FILTERED_TRANSACTIONS,
  HOURLY_PAIR_RATES,
  PAIR_CHART,
  PAIR_DATA,
  PAIRS_BULK,
  PAIRS_CURRENT,
  PAIRS_HISTORICAL_BULK,
} from "apps/charts/apollo/queries";

import { useEthPrice } from "apps/charts/contexts/GlobalData";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import {
  get2DayPercentChange,
  getBlocksFromTimestamps,
  getPercentChange,
  getTimestampsForChanges,
  isAddress,
  splitQuery,
} from "apps/charts/utils";
import {
  timeframeOptions,
  TRACKED_OVERRIDES_PAIRS,
  TRACKED_OVERRIDES_TOKENS,
} from "apps/charts/constants";
import {
  ProviderProps,
  useLatestBlocks,
  useListedTokens,
} from "apps/charts/contexts/Application";

const UPDATE = "UPDATE";
const UPDATE_PAIR_TXNS = "UPDATE_PAIR_TXNS";
const UPDATE_CHART_DATA = "UPDATE_CHART_DATA";
const UPDATE_TOP_PAIRS = "UPDATE_TOP_PAIRS";
const UPDATE_HOURLY_DATA = "UPDATE_HOURLY_DATA";

dayjs.extend(utc);

export function safeAccess(object: any, path: any[]) {
  return object
    ? path.reduce(
        (accumulator, currentValue) =>
          accumulator && accumulator[currentValue]
            ? accumulator[currentValue]
            : null,
        object
      )
    : null;
}

type State = any;

const PairDataContext = createContext({} as [State, any]);

function usePairDataContext() {
  return useContext(PairDataContext);
}

function reducer(
  state: { [x: string]: { hourlyData: any } },
  { type, payload }: any
) {
  switch (type) {
    case UPDATE: {
      const { pairAddress, data } = payload;
      return {
        ...state,
        [pairAddress]: {
          ...state?.[pairAddress],
          ...data,
        },
      };
    }

    case UPDATE_TOP_PAIRS: {
      const { topPairs } = payload;
      const added = {} as any;
      topPairs.map((pair: { id: string | number }) => {
        return (added[pair.id] = pair);
      });
      return {
        ...state,
        ...added,
      };
    }

    case UPDATE_PAIR_TXNS: {
      const { address, transactions } = payload;
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          txns: transactions,
        },
      };
    }
    case UPDATE_CHART_DATA: {
      const { address, chartData } = payload;
      return {
        ...state,
        [address]: {
          ...(safeAccess(state, [address]) || {}),
          chartData,
        },
      };
    }

    case UPDATE_HOURLY_DATA: {
      const { address, hourlyData, timeWindow } = payload;
      return {
        ...state,
        [address]: {
          ...state?.[address],
          hourlyData: {
            ...state?.[address]?.hourlyData,
            [timeWindow]: hourlyData,
          },
        },
      };
    }

    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

const Provider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});

  // update pair specific data
  const update = useCallback((pairAddress: any, data: any) => {
    dispatch({
      type: UPDATE,
      payload: {
        pairAddress,
        data,
      },
    });
  }, []);

  const updateTopPairs = useCallback((topPairs: any) => {
    dispatch({
      type: UPDATE_TOP_PAIRS,
      payload: {
        topPairs,
      },
    });
  }, []);

  const updatePairTxns = useCallback((address: any, transactions: any) => {
    dispatch({
      type: UPDATE_PAIR_TXNS,
      payload: { address, transactions },
    });
  }, []);

  const updateChartData = useCallback((address: any, chartData: any) => {
    dispatch({
      type: UPDATE_CHART_DATA,
      payload: { address, chartData },
    });
  }, []);

  const updateHourlyData = useCallback(
    (address: any, hourlyData: any, timeWindow: any) => {
      dispatch({
        type: UPDATE_HOURLY_DATA,
        payload: { address, hourlyData, timeWindow },
      });
    },
    []
  );

  return (
    <PairDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updatePairTxns,
            updateChartData,
            updateTopPairs,
            updateHourlyData,
          },
        ],
        [
          state,
          update,
          updatePairTxns,
          updateChartData,
          updateTopPairs,
          updateHourlyData,
        ]
      )}
    >
      {children}
    </PairDataContext.Provider>
  );
};

export default Provider;

async function getBulkPairData(
  pairList: any[],
  ethPrice: any,
  listedTokens: string | Record<string, any> | undefined
) {
  const [t1, t2, tWeek] = getTimestampsForChanges();
  const [{ number: b1 }, { number: b2 }, { number: bWeek }] =
    await getBlocksFromTimestamps([t1, t2, tWeek]);

  try {
    const current = await client.query({
      query: PAIRS_BULK,
      variables: {
        allPairs: pairList,
      },
      fetchPolicy: "cache-first",
    });

    const filteredPairs = current.data.pairs.filter(
      (pair: { token0: { id: any }; token1: { id: any } }) => {
        return (
          (listedTokens as any)?.includes(pair.token0.id) &&
          (listedTokens as any)?.includes(pair.token1.id)
        );
      }
    );

    const [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
      [b1, b2, bWeek].map(async (block) => {
        return client.query({
          query: PAIRS_HISTORICAL_BULK(block, pairList),
          fetchPolicy: "cache-first",
        });
      })
    );

    const oneDayData = oneDayResult?.data?.pairs.reduce(
      (obj: any, cur: { id: any }) => {
        return { ...obj, [cur.id]: cur };
      },
      {}
    );

    const twoDayData = twoDayResult?.data?.pairs.reduce(
      (obj: any, cur: { id: any }) => {
        return { ...obj, [cur.id]: cur };
      },
      {}
    );

    const oneWeekData = oneWeekResult?.data?.pairs.reduce(
      (obj: any, cur: { id: any }) => {
        return { ...obj, [cur.id]: cur };
      },
      {}
    );

    return await Promise.all(
      current &&
        filteredPairs.map(async (pair: { id: string }) => {
          let data = pair;
          let oneDayHistory = oneDayData?.[pair.id];
          if (!oneDayHistory) {
            const newData = await client.query({
              query: PAIR_DATA(pair.id, b1),
              fetchPolicy: "cache-first",
            });
            oneDayHistory = newData.data.pairs[0];
          }
          let twoDayHistory = twoDayData?.[pair.id];
          if (!twoDayHistory) {
            const newData = await client.query({
              query: PAIR_DATA(pair.id, b2),
              fetchPolicy: "cache-first",
            });
            twoDayHistory = newData.data.pairs[0];
          }
          let oneWeekHistory = oneWeekData?.[pair.id];
          if (!oneWeekHistory) {
            const newData = await client.query({
              query: PAIR_DATA(pair.id, bWeek),
              fetchPolicy: "cache-first",
            });
            oneWeekHistory = newData.data.pairs[0];
          }
          data = parseData(
            data,
            oneDayHistory,
            twoDayHistory,
            oneWeekHistory,
            ethPrice
          );
          return data;
        })
    );
  } catch (e) {
    return console.log(e);
  }
}

function parseData(
  data: any,
  oneDayData: {
    volumeUSD: string;
    untrackedVolumeUSD: string;
    reserveUSD: string | number;
  },
  twoDayData: { volumeUSD: string; untrackedVolumeUSD: string },
  oneWeekData: { volumeUSD: number; untrackedVolumeUSD: number },
  ethPrice: number
) {
  const pairAddress = data.id;

  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data?.volumeUSD,
    oneDayData?.volumeUSD ? oneDayData.volumeUSD : 0,
    twoDayData?.volumeUSD ? twoDayData.volumeUSD : 0
  );
  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    data?.untrackedVolumeUSD,
    oneDayData?.untrackedVolumeUSD
      ? parseFloat(oneDayData?.untrackedVolumeUSD)
      : 0,
    twoDayData?.untrackedVolumeUSD ? twoDayData?.untrackedVolumeUSD : 0
  );

  const oneWeekVolumeUSD = parseFloat(
    oneWeekData ? data?.volumeUSD - oneWeekData?.volumeUSD : data.volumeUSD
  );

  const oneWeekVolumeUntracked = parseFloat(
    oneWeekData
      ? data?.untrackedVolumeUSD - oneWeekData?.untrackedVolumeUSD
      : data.untrackedVolumeUSD
  );

  // set volume properties
  data = {
    ...data,
    oneDayVolumeUSD: parseFloat(String(oneDayVolumeUSD)),
    oneWeekVolumeUSD: oneWeekVolumeUSD,
    volumeChangeUSD: volumeChangeUSD,
    oneDayVolumeUntracked: oneDayVolumeUntracked,
    oneWeekVolumeUntracked: oneWeekVolumeUntracked,
    volumeChangeUntracked: volumeChangeUntracked,
  };

  // set liquidity properties
  data = {
    ...data,
    trackedReserveUSD: data.trackedReserveETH * ethPrice,
    liquidityChangeUSD: getPercentChange(
      data.reserveUSD,
      oneDayData?.reserveUSD
    ),
  };

  // format if pair hasnt existed for a day or a week
  if (!oneDayData && data) {
    data = {
      ...data,
      oneDayVolumeUSD: parseFloat(data.volumeUSD),
    };
  }
  if (!oneWeekData && data) {
    data = {
      ...data,
      oneWeekVolumeUSD: parseFloat(data.volumeUSD),
    };
  }

  if (
    TRACKED_OVERRIDES_PAIRS.includes(pairAddress) ||
    TRACKED_OVERRIDES_TOKENS.includes(data.token0.id) ||
    TRACKED_OVERRIDES_TOKENS.includes(data.token1.id)
  ) {
    data = {
      ...data,
      oneDayVolumeUSD: oneDayVolumeUntracked,
      oneWeekVolumeUSD: oneWeekVolumeUntracked,
      volumeChangeUSD: volumeChangeUntracked,
      trackedReserveUSD: data.reserveUSD,
    };
  }

  return data;
}

const getPairTransactions = async (pairAddress: any) => {
  const transactions = {
    mints: undefined,
    burns: undefined,
    swaps: undefined,
  };

  try {
    const result = await client.query({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: [pairAddress],
      },
      fetchPolicy: "no-cache",
    });
    transactions.mints = result.data.mints;
    transactions.burns = result.data.burns;
    transactions.swaps = result.data.swaps;
  } catch (e) {
    console.log(e);
  }

  return transactions;
};

const getPairChartData = async (pairAddress: any) => {
  let data: any[] = [];
  const utcEndTime = dayjs.utc();
  const utcStartTime = utcEndTime.subtract(1, "year").startOf("minute");
  const startTime = utcStartTime.unix() - 1;

  try {
    let allFound = false;
    let skip = 0;
    while (!allFound) {
      const result = await client.query({
        query: PAIR_CHART,
        variables: {
          pairAddress: pairAddress,
          skip,
        },
        fetchPolicy: "cache-first",
      });
      skip += 1000;
      data = data.concat(result.data.pairDayDatas);
      if (result.data.pairDayDatas.length < 1000) {
        allFound = true;
      }
    }

    data = data.map((dayData) => ({
      ...dayData,
      dailyVolumeUSD: parseFloat(dayData.dailyVolumeUSD),
      reserveUSD: parseFloat(dayData.reserveUSD),
    }));

    const dayIndexSet = new Set();
    const dayIndexArray: any[] = [];
    const oneDay = 24 * 60 * 60;
    data.forEach((dayData, i) => {
      // add the day index to the set of days
      dayIndexSet.add((data[i].date / oneDay).toFixed(0));
      dayIndexArray.push(data[i]);
    });

    if (data[0]) {
      // fill in empty days
      let timestamp = data[0].date ? data[0].date : startTime;
      let latestLiquidityUSD = data[0].reserveUSD;
      let index = 1;
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay;
        const currentDayIndex = (nextDay / oneDay).toFixed(0);
        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dayString: nextDay,
            dailyVolumeUSD: 0,
            reserveUSD: latestLiquidityUSD,
          });
        } else {
          latestLiquidityUSD = dayIndexArray[index].reserveUSD;
          index = index + 1;
        }
        timestamp = nextDay;
      }
    }

    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1));
  } catch (e) {
    console.log(e);
  }

  return data;
};

const getHourlyRateData = async (
  pairAddress: any,
  startTime: number,
  latestBlock: string | undefined
) => {
  try {
    const utcEndTime = dayjs.utc();
    let time = startTime;

    // create an array of hour start times until we reach current hour
    const timestamps = [];
    while (time <= utcEndTime.unix() - 3600) {
      timestamps.push(time);
      time += 3600;
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return [];
    }

    // once you have all the timestamps, get the blocks for each timestamp in a bulk query
    let blocks;

    blocks = await getBlocksFromTimestamps(timestamps, 100);

    // catch failing case
    if (!blocks || blocks?.length === 0) {
      return [];
    }

    if (latestBlock) {
      blocks = blocks.filter((b) => {
        return parseFloat(b.number) <= parseFloat(latestBlock);
      });
    }

    const result = await splitQuery(
      HOURLY_PAIR_RATES,
      client,
      [pairAddress],
      blocks,
      100
    );

    // format token ETH price results
    const values = [];
    for (const row in result) {
      const timestamp = row.split("t")[1];
      if (timestamp) {
        values.push({
          timestamp,
          rate0: parseFloat((result as any)[row]?.token0Price),
          rate1: parseFloat((result as any)[row]?.token1Price),
        });
      }
    }

    const formattedHistoryRate0 = [];
    const formattedHistoryRate1 = [];

    // for each hour, construct the open and close price
    for (let i = 0; i < values.length - 1; i++) {
      formattedHistoryRate0.push({
        timestamp: values[i].timestamp,
        open: parseFloat(String(values[i].rate0)),
        close: parseFloat(String(values[i + 1].rate0)),
      });
      formattedHistoryRate1.push({
        timestamp: values[i].timestamp,
        open: parseFloat(String(values[i].rate1)),
        close: parseFloat(String(values[i + 1].rate1)),
      });
    }

    return [formattedHistoryRate0, formattedHistoryRate1];
  } catch (e) {
    console.log(e);
    return [[], []];
  }
};

export function Updater() {
  const [, { updateTopPairs }] = usePairDataContext();
  const [ethPrice] = useEthPrice();
  const listedTokens = useListedTokens();

  useEffect(() => {
    async function getData() {
      // get top pairs by reserves
      const {
        data: { pairs },
      } = await client.query({
        query: PAIRS_CURRENT,
        fetchPolicy: "cache-first",
      });

      // format as array of addresses
      const formattedPairs = pairs.map((pair: { id: any }) => {
        return pair.id;
      });

      // get data for every pair in list
      const topPairs = await getBulkPairData(
        formattedPairs,
        ethPrice,
        listedTokens
      );
      topPairs && updateTopPairs(topPairs);
    }
    ethPrice && getData();
  }, [ethPrice, updateTopPairs, listedTokens]);
  return null;
}

export function useHourlyRateData(pairAddress: any, timeWindow: any) {
  const [state, { updateHourlyData }] = usePairDataContext();
  const chartData = state?.[pairAddress]?.hourlyData?.[timeWindow];
  const [latestBlock] = useLatestBlocks();

  useEffect(() => {
    const currentTime = dayjs.utc();
    const windowSize = timeWindow === timeframeOptions.MONTH ? "month" : "week";
    const startTime =
      timeWindow === timeframeOptions.ALL_TIME
        ? 1589760000
        : currentTime.subtract(1, windowSize).startOf("hour").unix();

    async function fetch() {
      const data = await getHourlyRateData(pairAddress, startTime, latestBlock);
      updateHourlyData(pairAddress, data, timeWindow);
    }
    if (!chartData) {
      fetch();
    }
  }, [chartData, timeWindow, pairAddress, updateHourlyData, latestBlock]);

  return chartData;
}

/**
 * @todo
 * store these updates to reduce future redundant calls
 */
export function useDataForList(pairList: any) {
  const [state] = usePairDataContext();
  const [ethPrice] = useEthPrice();

  const [stale, setStale] = useState<boolean>(false);
  const [fetched, setFetched] = useState<any[] | null>(null);
  const listedTokens = useListedTokens();

  // reset
  useEffect(() => {
    if (pairList) {
      setStale(false);
      setFetched(null);
    }
  }, [pairList]);

  useEffect(() => {
    async function fetchNewPairData() {
      const newFetched: any[] = [];
      const unfetched: any[] = [];

      pairList.map(async (pair: { id: string | number }) => {
        const currentData = state?.[pair.id];
        if (!currentData) {
          unfetched.push(pair.id);
        } else {
          newFetched.push(currentData);
        }
      });

      const newPairData = await getBulkPairData(
        unfetched.map((pair) => {
          return pair;
        }),
        ethPrice,
        listedTokens
      );

      setFetched(newFetched.concat(newPairData));
    }
    if (ethPrice && pairList && pairList.length > 0 && !fetched && !stale) {
      setStale(true);
      fetchNewPairData();
    }
  }, [
    ethPrice,
    state,
    pairList,
    stale,
    fetched,
    listedTokens,
    setStale,
    setFetched,
  ]);

  const formattedFetch =
    fetched &&
    fetched.reduce((obj, cur) => {
      return { ...obj, [cur?.id]: cur };
    }, {});

  return formattedFetch;
}

/**
 * Get all the current and 24hr changes for a pair
 */
export function usePairData(pairAddress: string) {
  const [state, { update }] = usePairDataContext();
  const [ethPrice] = useEthPrice();
  const pairData = state?.[pairAddress];
  const listedTokens = useListedTokens();

  useEffect(() => {
    async function fetchData() {
      if (!pairData && pairAddress) {
        const data = await getBulkPairData(
          [pairAddress],
          ethPrice,
          listedTokens
        );
        data && update(pairAddress, data[0]);
      }
    }
    if (!pairData && pairAddress && ethPrice && isAddress(pairAddress)) {
      fetchData();
    }
  }, [pairAddress, pairData, update, ethPrice, listedTokens]);

  return pairData || {};
}

/**
 * Get most recent txns for a pair
 */
export function usePairTransactions(pairAddress: string) {
  const [state, { updatePairTxns }] = usePairDataContext();
  const pairTxns = state?.[pairAddress]?.txns;
  useEffect(() => {
    async function checkForTxns() {
      if (!pairTxns) {
        const transactions = await getPairTransactions(pairAddress);
        updatePairTxns(pairAddress, transactions);
      }
    }
    checkForTxns();
  }, [pairTxns, pairAddress, updatePairTxns]);
  return pairTxns;
}

export function usePairChartData(pairAddress: string) {
  const [state, { updateChartData }] = usePairDataContext();
  const chartData = state?.[pairAddress]?.chartData;

  useEffect(() => {
    async function checkForChartData() {
      if (!chartData) {
        const data = await getPairChartData(pairAddress);
        updateChartData(pairAddress, data);
      }
    }
    checkForChartData();
  }, [chartData, pairAddress, updateChartData]);
  return chartData;
}

/**
 * Get list of all pairs in Uniswap
 */
export function useAllPairData() {
  const [state] = usePairDataContext();
  return state || {};
}
