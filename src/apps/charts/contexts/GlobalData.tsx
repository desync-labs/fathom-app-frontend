import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useState,
  FC,
} from "react";
import { dexClient as client } from "apollo/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { ProviderProps, useTimeframe } from "apps/charts/contexts/Application";
import {
  getPercentChange,
  getBlockFromTimestamp,
  getBlocksFromTimestamps,
  get2DayPercentChange,
  getTimeframe,
} from "apps/charts/utils";
import {
  GLOBAL_DATA,
  GLOBAL_TXNS,
  GLOBAL_CHART,
  ETH_PRICE,
  ALL_PAIRS,
  ALL_TOKENS,
  TOP_LPS_PER_PAIRS,
} from "apps/charts/apollo/queries";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { useAllPairData } from "apps/charts/contexts/PairData";
import { useTokenChartDataCombined } from "apps/charts/contexts/TokenData";
import { BigNumber } from "bignumber.js";
import usePricesContext from "context/prices";

const UPDATE = "UPDATE";
const UPDATE_TXNS = "UPDATE_TXNS";
const UPDATE_CHART = "UPDATE_CHART";
const UPDATE_ETH_PRICE = "UPDATE_ETH_PRICE";
const ETH_PRICE_KEY = "ETH_PRICE_KEY";
const UPDATE_ALL_PAIRS_IN_FATHOM_SWAP =
  "UPDATE_ALL_PAIRS_IN_FATHOM_SWAP_TOP_PAIRS";
const UPDATE_ALL_TOKENS_IN_FATHOM_SWAP = "UPDATE_ALL_TOKENS_IN_FATHOM_SWAP";
const UPDATE_TOP_LPS = "UPDATE_TOP_LPS";

const offsetVolumes: any[] = [];

// format dayjs with the libraries that we need
dayjs.extend(utc);
dayjs.extend(weekOfYear);

type State = any;

const GlobalDataContext = createContext({} as [State, any]);

const useGlobalDataContext = () => useContext(GlobalDataContext);

function reducer(
  state: State,
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case UPDATE: {
      const { data } = payload;
      return {
        ...state,
        globalData: data,
      };
    }
    case UPDATE_TXNS: {
      const { transactions } = payload;
      return {
        ...state,
        transactions,
      };
    }
    case UPDATE_CHART: {
      const { daily, weekly } = payload;
      return {
        ...state,
        chartData: {
          daily,
          weekly,
        },
      };
    }
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload;
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange,
      };
    }

    case UPDATE_ALL_PAIRS_IN_FATHOM_SWAP: {
      const { allPairs } = payload;
      return {
        ...state,
        allPairs,
      };
    }

    case UPDATE_ALL_TOKENS_IN_FATHOM_SWAP: {
      const { allTokens } = payload;
      return {
        ...state,
        allTokens,
      };
    }

    case UPDATE_TOP_LPS: {
      const { topLps } = payload;
      return {
        ...state,
        topLps,
      };
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`);
    }
  }
}

const Provider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {});
  const update = useCallback((data: any) => {
    dispatch({
      type: UPDATE,
      payload: {
        data,
      },
    });
  }, []);

  const updateTransactions = useCallback((transactions: any) => {
    dispatch({
      type: UPDATE_TXNS,
      payload: {
        transactions,
      },
    });
  }, []);

  const updateChart = useCallback((daily: any, weekly: any) => {
    dispatch({
      type: UPDATE_CHART,
      payload: {
        daily,
        weekly,
      },
    });
  }, []);

  const updateEthPrice = useCallback(
    (ethPrice: any, oneDayPrice: any, ethPriceChange: any) => {
      dispatch({
        type: UPDATE_ETH_PRICE,
        payload: {
          ethPrice,
          oneDayPrice,
          ethPriceChange,
        },
      });
    },
    []
  );

  const updateAllPairsInUniswap = useCallback((allPairs: any[]) => {
    dispatch({
      type: UPDATE_ALL_PAIRS_IN_FATHOM_SWAP,
      payload: {
        allPairs,
      },
    });
  }, []);

  const updateAllTokensInUniswap = useCallback((allTokens: any[]) => {
    dispatch({
      type: UPDATE_ALL_TOKENS_IN_FATHOM_SWAP,
      payload: {
        allTokens,
      },
    });
  }, []);

  const updateTopLps = useCallback((topLps: any[]) => {
    dispatch({
      type: UPDATE_TOP_LPS,
      payload: {
        topLps,
      },
    });
  }, []);
  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateTransactions,
            updateChart,
            updateEthPrice,
            updateTopLps,
            updateAllPairsInUniswap,
            updateAllTokensInUniswap,
          },
        ],
        [
          state,
          update,
          updateTransactions,
          updateTopLps,
          updateChart,
          updateEthPrice,
          updateAllPairsInUniswap,
          updateAllTokensInUniswap,
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  );
};

export default Provider;

/**
 * Gets all the global data for the overview page.
 * Needs current eth price and the old eth price to get
 * 24 hour USD changes.
 * @param {*} ethPrice
 * @param {*} oldEthPrice
 */

async function getGlobalData(ethPrice: number, oldEthPrice: number) {
  // data for each day , historic data used for % changes
  let data = {} as any;
  let oneDayData = {} as any;
  let twoDayData = {} as any;

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs();
    const utcOneDayBack = utcCurrentTime.subtract(1, "day").unix();
    const utcTwoDaysBack = utcCurrentTime.subtract(2, "day").unix();
    const utcOneWeekBack = utcCurrentTime.subtract(1, "week").unix();
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, "week").unix();

    // get the blocks needed for time travel queries
    const [oneDayBlock, twoDayBlock, oneWeekBlock, twoWeekBlock] =
      await getBlocksFromTimestamps([
        utcOneDayBack,
        utcTwoDaysBack,
        utcOneWeekBack,
        utcTwoWeeksBack,
      ]);

    // fetch the global data
    const result = await client.query({
      query: GLOBAL_DATA(),
      fetchPolicy: "cache-first",
    });
    data = result.data.fathomSwapFactories[0];

    // fetch the historical data
    const oneDayResult = await client.query({
      query: GLOBAL_DATA(oneDayBlock?.number),
      fetchPolicy: "cache-first",
    });
    oneDayData = oneDayResult.data.fathomSwapFactories[0];

    const twoDayResult = await client.query({
      query: GLOBAL_DATA(twoDayBlock?.number),
      fetchPolicy: "cache-first",
    });
    twoDayData = twoDayResult.data.fathomSwapFactories[0];

    const oneWeekResult = await client.query({
      query: GLOBAL_DATA(oneWeekBlock?.number),
      fetchPolicy: "cache-first",
    });
    const oneWeekData = oneWeekResult.data.fathomSwapFactories[0];

    const twoWeekResult = await client.query({
      query: GLOBAL_DATA(twoWeekBlock?.number),
      fetchPolicy: "cache-first",
    });
    const twoWeekData = twoWeekResult.data.fathomSwapFactories[0];

    if (data && oneDayData && twoDayData) {
      const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data?.totalVolumeUSD,
        oneDayData?.totalVolumeUSD,
        twoDayData?.totalVolumeUSD
      );

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData ? oneWeekData.totalVolumeUSD : 0,
        twoWeekData ? twoWeekData.totalVolumeUSD : 0
      );

      const [oneDayTxns, txnChange] = get2DayPercentChange(
        data.txCount,
        oneDayData.txCount ? oneDayData.txCount : 0,
        twoDayData.txCount ? twoDayData.txCount : 0
      );

      // format the total liquidity in USD
      const totalLiquidityUSD = data.totalLiquidityETH * ethPrice;
      const liquidityChangeUSD = getPercentChange(
        data.totalLiquidityETH * ethPrice,
        oneDayData.totalLiquidityETH * oldEthPrice
      );

      data = {
        ...data,
        totalLiquidityUSD: totalLiquidityUSD,
        oneDayVolumeUSD: oneDayVolumeUSD,
        oneWeekVolume: oneWeekVolume,
        weeklyVolumeChange: weeklyVolumeChange,
        volumeChangeUSD: volumeChangeUSD,
        liquidityChangeUSD: liquidityChangeUSD,
        oneDayTxns: oneDayTxns,
        txnChange: txnChange,
      };
    }
  } catch (e) {
    console.log(e);
  }

  return data;
}

/**
 * Get historical data for volume and liquidity used in global charts
 * on main page
 * @param {*} oldestDateToFetch // start of window to fetch from
 */

let checked = false;

const getChartData = async (
  oldestDateToFetch: number | undefined,
  offsetData: any[]
) => {
  let data: any[] = [];
  const weeklyData: any[] = [];
  const utcEndTime = dayjs.utc();
  let skip = 0;
  let allFound = false;

  try {
    while (!allFound) {
      const result = await client.query({
        query: GLOBAL_CHART,
        variables: {
          startTime: oldestDateToFetch,
          skip,
        },
        fetchPolicy: "cache-first",
      });
      skip += 1000;
      data = data.concat(result.data.fathomSwapDayDatas);
      if (result.data.fathomSwapDayDatas.length < 1000) {
        allFound = true;
      }
    }

    if (data) {
      const dayIndexSet = new Set();
      const dayIndexArray: any[] = [];
      const oneDay = 24 * 60 * 60;

      // for each day, parse the daily volume and format for chart array
      data.forEach((dayData, i) => {
        // add the day index to the set of days
        dayIndexSet.add((data[i].date / oneDay).toFixed(0));
        dayIndexArray.push(data[i]);
        const dailyVolumeUSD = parseFloat(dayData.dailyVolumeUSD);
        return {
          ...dayData,
          dailyVolumeUSD: dailyVolumeUSD,
        };
      });

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch;
      let latestLiquidityUSD = data[0].totalLiquidityUSD;
      let latestDayDats = data[0].mostLiquidTokens;
      let index = 1;
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay;
        const currentDayIndex = (nextDay / oneDay).toFixed(0);

        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            date: nextDay,
            dailyVolumeUSD: 0,
            totalLiquidityUSD: latestLiquidityUSD,
            mostLiquidTokens: latestDayDats,
          });
        } else {
          latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD;
          latestDayDats = dayIndexArray[index].mostLiquidTokens;
          index = index + 1;
        }
        timestamp = nextDay;
      }
    }

    // format weekly data for weekly sized chunks
    data = data.sort((a, b) => (parseInt(a.date) > parseInt(b.date) ? 1 : -1));
    let startIndexWeekly = -1;
    let currentWeek = -1;

    data.forEach((entry, i) => {
      const date = data[i].date;

      // hardcoded fix for offset volume
      offsetData &&
        !checked &&
        offsetData.map((dayData: any) => {
          if (dayData[date]) {
            data[i].dailyVolumeUSD =
              parseFloat(data[i].dailyVolumeUSD) -
              parseFloat(dayData[date].dailyVolumeUSD);
          }
          return true;
        });

      const week = dayjs.utc(dayjs.unix(data[i].date)).week();
      if (week !== currentWeek) {
        currentWeek = week;
        startIndexWeekly++;
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {};
      weeklyData[startIndexWeekly].date = data[i].date;
      weeklyData[startIndexWeekly].weeklyVolumeUSD =
        (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? 0) +
        data[i].dailyVolumeUSD;
    });

    if (!checked) {
      checked = true;
    }
  } catch (e) {
    console.log(e);
  }
  return [data, weeklyData];
};

/**
 * Get and format transactions for global page
 */
const getGlobalTransactions = async () => {
  const transactions: any = {};

  try {
    const result = await client.query({
      query: GLOBAL_TXNS,
      fetchPolicy: "cache-first",
    });
    transactions.mints = [];
    transactions.burns = [];
    transactions.swaps = [];
    result?.data?.transactions &&
      result.data.transactions.map((transaction: any) => {
        if (transaction.mints.length > 0) {
          transaction.mints.map((mint: any) => {
            return transactions.mints.push(mint);
          });
        }
        if (transaction.burns.length > 0) {
          transaction.burns.map((burn: any) => {
            return transactions.burns.push(burn);
          });
        }
        if (transaction.swaps.length > 0) {
          transaction.swaps.map((swap: any) => {
            return transactions.swaps.push(swap);
          });
        }
        return true;
      });
  } catch (e) {
    console.log(e);
  }

  return transactions;
};

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
const getEthPrice = async () => {
  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime
    .subtract(1, "day")
    .startOf("minute")
    .unix();

  let ethPrice = 0;
  let ethPriceOneDay = 0;
  let priceChangeETH = 0;

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack);
    const result = await client.query({
      query: ETH_PRICE(),
      fetchPolicy: "cache-first",
    });
    const resultOneDay = await client.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: "cache-first",
    });
    const currentPrice = result?.data?.bundles[0]?.ethPrice;
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice;
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice);
    ethPrice = currentPrice;
    ethPriceOneDay = oneDayBackPrice;
  } catch (e) {
    console.log(e);
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH];
};

const PAIRS_TO_FETCH = 500;
const TOKENS_TO_FETCH = 500;

/**
 * Loop through every pair on uniswap, used for search
 */
async function getAllPairsOnUniswap() {
  let allFound = false;
  let pairs: any[] = [];
  let skipCount = 0;
  while (!allFound) {
    const result = await client.query({
      query: ALL_PAIRS,
      variables: {
        skip: skipCount,
      },
      fetchPolicy: "cache-first",
    });
    skipCount = skipCount + PAIRS_TO_FETCH;
    pairs = pairs.concat(result?.data?.pairs);
    if (
      result?.data?.pairs.length < PAIRS_TO_FETCH ||
      pairs.length > PAIRS_TO_FETCH
    ) {
      allFound = true;
    }
  }
  return pairs;
}

/**
 * Loop through every token on uniswap, used for search
 */
async function getAllTokensOnUniswap() {
  let allFound = false;
  let skipCount = 0;
  let tokens: any[] = [];
  while (!allFound) {
    const result = await client.query({
      query: ALL_TOKENS,
      variables: {
        skip: skipCount,
      },
      fetchPolicy: "cache-first",
    });
    tokens = tokens.concat(result?.data?.tokens);
    if (
      result?.data?.tokens?.length < TOKENS_TO_FETCH ||
      tokens.length > TOKENS_TO_FETCH
    ) {
      allFound = true;
    }
    skipCount = skipCount += TOKENS_TO_FETCH;
  }
  return tokens;
}

/**
 * Hook that fetches overview data, plus all tokens and pairs for search
 */
export function useGlobalData() {
  const [state, { update, updateAllPairsInUniswap, updateAllTokensInUniswap }] =
    useGlobalDataContext();
  const [ethPrice, oldEthPrice] = useEthPrice();
  const [loading, setLoading] = useState<boolean>(false);

  const data = state?.globalData;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const globalData = await getGlobalData(ethPrice, oldEthPrice);

      globalData && update(globalData);

      const allPairs = await getAllPairsOnUniswap();
      updateAllPairsInUniswap(allPairs);

      const allTokens = await getAllTokensOnUniswap();
      updateAllTokensInUniswap(allTokens);
      setLoading(false);
    }

    if (!data && ethPrice && oldEthPrice && !loading) {
      fetchData();
    }
  }, [
    loading,
    ethPrice,
    oldEthPrice,
    update,
    data,
    updateAllPairsInUniswap,
    updateAllTokensInUniswap,
    setLoading,
  ]);

  return data || {};
}

export function useGlobalChartData() {
  const [state, { updateChart }] = useGlobalDataContext();
  const [oldestDateFetch, setOldestDateFetched] = useState<number>();
  const [activeWindow] = useTimeframe();

  const chartDataDaily = state?.chartData?.daily;
  const chartDataWeekly = state?.chartData?.weekly;

  /**
   * Keep track of oldest date fetched. Used to
   * limit data fetched until its actually needed.
   * (dont fetch year long stuff unless year option selected)
   */
  useEffect(() => {
    // based on window, get starttime
    const startTime = getTimeframe(activeWindow);

    if (
      (activeWindow && startTime < (oldestDateFetch as number)) ||
      !oldestDateFetch
    ) {
      setOldestDateFetched(startTime);
    }
  }, [activeWindow, oldestDateFetch]);

  // fix for rebass tokens

  const combinedData = useTokenChartDataCombined(offsetVolumes);

  /**
   * Fetch data if none fetched or older data is needed
   */
  useEffect(() => {
    async function fetchData() {
      // historical stuff for chart
      const [newChartData, newWeeklyData] = await getChartData(
        oldestDateFetch,
        combinedData
      );
      updateChart(newChartData, newWeeklyData);
    }

    if (
      oldestDateFetch &&
      !(chartDataDaily && chartDataWeekly) &&
      combinedData
    ) {
      fetchData();
    }
  }, [
    chartDataDaily,
    chartDataWeekly,
    combinedData,
    oldestDateFetch,
    updateChart,
  ]);

  return [chartDataDaily, chartDataWeekly];
}

export function useGlobalTransactions() {
  const [state, { updateTransactions }] = useGlobalDataContext();
  const transactions = state?.transactions;
  useEffect(() => {
    async function fetchData() {
      if (!transactions) {
        const txns = await getGlobalTransactions();
        updateTransactions(txns);
      }
    }

    fetchData();
  }, [updateTransactions, transactions]);
  return transactions;
}

export function useEthPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext();
  const ethPrice = state?.[ETH_PRICE_KEY];
  const ethPriceOld = state?.["oneDayPrice"];
  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        const [newPrice, oneDayPrice, priceChange] = await getEthPrice();
        updateEthPrice(newPrice, oneDayPrice, priceChange);
      }
    }

    checkForEthPrice();
  }, [ethPrice, updateEthPrice]);

  return [ethPrice, ethPriceOld];
}

export function useAllPairsInUniswap() {
  const [state] = useGlobalDataContext();
  const allPairs = state?.allPairs;

  return (allPairs || []) as any[];
}

export function useAllTokensInUniswap() {
  const [state] = useGlobalDataContext();
  const allTokens = state?.allTokens;

  return allTokens || [];
}

/**
 * Get the top liquidity positions based on USD size
 * @TODO Not a perfect lookup needs improvement
 */
export function useTopLps() {
  const [state, { updateTopLps }] = useGlobalDataContext();
  const topLps = state?.topLps;

  const allPairs = useAllPairData();

  useEffect(() => {
    async function fetchData() {
      // get top 20 by reserves
      const topPairs = Object.keys(allPairs)
        ?.sort((a, b) =>
          (allPairs as any)[a].reserveUSD > (allPairs as any)[b].reserveUSD
            ? -1
            : 1
        )
        ?.slice(0, 99)
        .map((pair) => pair);

      const topLpLists = await Promise.all(
        topPairs.map(async (pair) => {
          const { data: results } = await client.query({
            query: TOP_LPS_PER_PAIRS,
            variables: {
              pair: pair.toString(),
            },
            fetchPolicy: "cache-first",
          });
          if (results) {
            return results.liquidityPositions;
          }
        })
      );

      // get the top lps from the results formatted
      const topLps: any[] = [];
      topLpLists
        .filter((i) => !!i) // check for ones not fetched correctly
        .map((list) => {
          return list.map(
            (entry: {
              pair: { id: string | number };
              user: any;
              liquidityTokenBalance: string;
            }) => {
              const pairData = allPairs[entry.pair.id];
              return topLps.push({
                user: entry.user,
                pairName: pairData.token0.symbol + "-" + pairData.token1.symbol,
                pairAddress: entry.pair.id,
                token0: pairData.token0.id,
                token1: pairData.token1.id,
                usd:
                  (parseFloat(entry.liquidityTokenBalance) /
                    parseFloat(pairData.totalSupply)) *
                  parseFloat(pairData.reserveUSD),
              });
            }
          );
        });

      const sorted = topLps.sort((a, b) => (a.usd > b.usd ? -1 : 1));
      const shorter = sorted.splice(0, 100);
      updateTopLps(shorter);
    }

    if (!topLps && allPairs && Object.keys(allPairs).length > 0) {
      fetchData();
    }
  });

  return topLps;
}

export function useFxdPrice() {
  let { fxdPrice } = usePricesContext();
  fxdPrice = BigNumber(fxdPrice)
    .dividedBy(10 ** 18)
    .toString();

  return {
    fxdPrice,
  };
}

export function useFTHMPrice() {
  let { fthmPrice } = usePricesContext();
  fthmPrice = BigNumber(fthmPrice)
    .dividedBy(10 ** 18)
    .toString();

  return {
    fthmPrice,
  };
}
