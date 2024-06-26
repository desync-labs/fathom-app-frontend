import { BigNumber } from "bignumber.js";
import dayjs from "dayjs";
import { ethers } from "fathom-ethers";
import utc from "dayjs/plugin/utc";
import { dexClient as client, blockClient } from "apollo/client";
import { GET_BLOCK, GET_BLOCKS, SHARE_VALUE } from "apps/charts/apollo/queries";
import _Decimal from "decimal.js-light";
import * as toFormatImport from "toformat";
import { timeframeOptions } from "apps/charts/constants";
import Numeral from "numeral";
import { ApolloClient } from "@apollo/client";
import { Typography } from "@mui/material";

const toFormat = toFormatImport as any;

// format libraries
const Decimal = toFormat(_Decimal);
BigNumber.set({ EXPONENTIAL_AT: 50 });
dayjs.extend(utc);

export function getTimeframe(timeWindow: string) {
  const utcEndTime = dayjs.utc();
  // based on window, get starttime
  let utcStartTime;
  switch (timeWindow) {
    case timeframeOptions.WEEK:
      utcStartTime = utcEndTime.subtract(1, "week").endOf("day").unix() - 1;
      break;
    case timeframeOptions.MONTH:
      utcStartTime = utcEndTime.subtract(1, "month").endOf("day").unix() - 1;
      break;
    case timeframeOptions.ALL_TIME:
      utcStartTime = utcEndTime.subtract(1, "year").endOf("day").unix() - 1;
      break;
    default:
      utcStartTime = utcEndTime.subtract(1, "year").startOf("year").unix() - 1;
      break;
  }
  return utcStartTime;
}

export function getPoolLink(
  token0Address: string,
  token1Address = null,
  remove = false
) {
  if (!token1Address) {
    return (
      `/swap/` +
      (remove ? `remove` : `add`) +
      `/${
        token0Address === "0x951857744785e80e2de051c32ee7b25f9c458c42"
          ? "XDC"
          : token0Address
      }/${"XDC"}`
    );
  } else {
    return (
      `/swap/` +
      (remove ? `remove` : `add`) +
      `/${
        token0Address === "0x951857744785e80e2de051c32ee7b25f9c458c42"
          ? "XDC"
          : token0Address
      }/${
        token1Address === "0x951857744785e80e2de051c32ee7b25f9c458c42"
          ? "XDC"
          : token1Address
      }`
    );
  }
}

export function getSwapLink(token0Address: string, token1Address = null) {
  if (!token1Address) {
    return `/swap?inputCurrency=${token0Address}`;
  } else {
    return `/swap?inputCurrency=${
      token0Address === "0x951857744785e80e2de051c32ee7b25f9c458c42"
        ? "XDC"
        : token0Address
    }&outputCurrency=${
      token1Address === "0x951857744785e80e2de051c32ee7b25f9c458c42"
        ? "XDC"
        : token1Address
    }`;
  }
}

export function localNumber(val: number) {
  return Numeral(val).format("0,0");
}

export const toNiceDate = (date: number) => {
  return dayjs.utc(dayjs.unix(date)).format("MMM DD");
};

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4) {
  const parsed = isAddress(address);
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export function getTimestampsForChanges() {
  const utcCurrentTime = dayjs();
  const t1 = utcCurrentTime.subtract(1, "day").startOf("minute").unix();
  const t2 = utcCurrentTime.subtract(2, "day").startOf("minute").unix();
  const tWeek = utcCurrentTime.subtract(1, "week").startOf("minute").unix();
  return [t1, t2, tWeek];
}

export async function splitQuery(
  query: any,
  localClient: ApolloClient<any>,
  vars: any,
  list: any,
  skipCount = 100
) {
  let fetchedData = {};
  let allFound = false;
  let skip = 0;

  while (!allFound) {
    let end = list.length;
    if (skip + skipCount < list.length) {
      end = skip + skipCount;
    }
    const sliced = list.slice(skip, end);
    const result = await localClient.query({
      query: query(...vars, sliced),
      fetchPolicy: "cache-first",
    });
    fetchedData = {
      ...fetchedData,
      ...result.data,
    };
    if (
      Object.keys(result.data).length < skipCount ||
      skip + skipCount > list.length
    ) {
      allFound = true;
    } else {
      skip += skipCount;
    }
  }

  return fetchedData;
}

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp: number) {
  const result = await blockClient.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: "cache-first",
  });
  return result?.data?.blocks?.[0]?.number;
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(
  timestamps: number[],
  skipCount = 500
) {
  if (timestamps?.length === 0) {
    return [];
  }

  const fetchedData = await splitQuery(
    GET_BLOCKS,
    blockClient,
    [],
    timestamps,
    skipCount
  );

  const blocks: any[] = [];
  if (fetchedData) {
    for (const t in fetchedData) {
      if ((fetchedData as any)[t].length > 0) {
        blocks.push({
          timestamp: t.split("t")[1],
          number: (fetchedData as any)[t][0]["number"],
        });
      }
    }
  }
  return blocks;
}

/**
 * @notice Example query using time travel queries
 * @dev TODO - handle scenario where blocks are not available for a timestamps (e.g. current time)
 * @param {String} pairAddress
 * @param {Array} timestamps
 */
export async function getShareValueOverTime(
  pairAddress: string,
  timestamps: any
) {
  if (!timestamps) {
    const utcCurrentTime = dayjs();
    const utcSevenDaysBack = utcCurrentTime.subtract(8, "day").unix();
    timestamps = getTimestampRange(utcSevenDaysBack, 86400, 7);
  }

  // get blocks based on timestamps
  const blocks = await getBlocksFromTimestamps(timestamps);

  // get historical share values with time travel queries
  const result = await client.query({
    query: SHARE_VALUE(pairAddress, blocks),
    fetchPolicy: "cache-first",
  });

  const values: any[] = [];
  for (const row in result?.data) {
    const timestamp = row.split("t")[1];
    const sharePriceUsd =
      parseFloat(result.data[row]?.reserveUSD) /
      parseFloat(result.data[row]?.totalSupply);
    if (timestamp) {
      values.push({
        timestamp,
        sharePriceUsd,
        totalSupply: result.data[row].totalSupply,
        reserve0: result.data[row].reserve0,
        reserve1: result.data[row].reserve1,
        reserveUSD: result.data[row].reserveUSD,
        token0DerivedETH: result.data[row].token0.derivedETH,
        token1DerivedETH: result.data[row].token1.derivedETH,
        roiUsd:
          values && values[0] ? sharePriceUsd / values[0]["sharePriceUsd"] : 1,
        ethPrice: 0,
        token0PriceUSD: 0,
        token1PriceUSD: 0,
      });
    }
  }

  // add eth prices
  let index = 0;
  for (const brow in result?.data) {
    const timestamp = brow.split("b")[1];
    if (timestamp) {
      values[index].ethPrice = result.data[brow].ethPrice;
      values[index].token0PriceUSD =
        result.data[brow].ethPrice * values[index].token0DerivedETH;
      values[index].token1PriceUSD =
        result.data[brow].ethPrice * values[index].token1DerivedETH;
      index += 1;
    }
  }

  return values;
}

/**
 * @notice Creates an evenly-spaced array of timestamps
 * @dev Periods include a start and end timestamp. For example, n periods are defined by n+1 timestamps.
 * @param {Int} timestamp_from in seconds
 * @param {Int} period_length in seconds
 * @param {Int} periods
 */
export function getTimestampRange(
  timestamp_from: number,
  period_length: number,
  periods: number
) {
  const timestamps = [];
  for (let i = 0; i <= periods; i++) {
    timestamps.push(timestamp_from + i * period_length);
  }
  return timestamps;
}

export const toNiceDateYear = (date: number) =>
  dayjs.utc(dayjs.unix(date)).format("MMMM DD, YYYY");

export const isAddress = (value: string) => {
  try {
    return ethers.utils.getAddress(value.toLowerCase());
  } catch {
    return false;
  }
};

export const toK = (num: any) => {
  return Numeral(num).format("0.[00]a");
};

export const urls = {
  showTransaction: (tx: string) => `https://xdc.blocksscan.io/txs/${tx}/`,
  showAddress: (address: string) =>
    `https://xdc.blocksscan.io/address/${address.replace(/^.{2}/g, "xdc")}/`,
  showToken: (address: string) =>
    `https://xdc.blocksscan.io/tokens/${address.replace(/^.{2}/g, "xdc")}/`,
  showBlock: (block: string) => `https://xdc.blocksscan.io/blocks/${block}/`,
};

export const formatTime = (unix: any) => {
  const now = dayjs();
  const timestamp = dayjs.unix(unix);

  const inSeconds = now.diff(timestamp, "second");
  const inMinutes = now.diff(timestamp, "minute");
  const inHours = now.diff(timestamp, "hour");
  const inDays = now.diff(timestamp, "day");

  if (inHours >= 24) {
    return `${inDays} ${inDays === 1 ? "day" : "days"} ago`;
  } else if (inMinutes >= 60) {
    return `${inHours} ${inHours === 1 ? "hour" : "hours"} ago`;
  } else if (inSeconds >= 60) {
    return `${inMinutes} ${inMinutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `${inSeconds} ${inSeconds === 1 ? "second" : "seconds"} ago`;
  }
};

export const formatNumber = (num: { toString: () => string }) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num: number | bigint, digits: number) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return formatter.format(num);
};

export const toSignificant = (number: any, significantDigits: number) => {
  Decimal.set({ precision: significantDigits + 1, rounding: Decimal.ROUND_UP });
  const updated = new Decimal(number).toSignificantDigits(significantDigits);
  return updated.toFormat(updated.decimalPlaces(), { groupSeparator: "" });
};

export const formattedNum = (number: string | number, usd = false): string => {
  if (isNaN(number as number) || number === "" || number === undefined) {
    return usd ? "$0" : "0";
  }
  const num = parseFloat(number as string);

  if (num > 500000000) {
    return (usd ? "$" : "") + toK(num.toFixed(0));
  }

  if (num === 0) {
    if (usd) {
      return "$0";
    }
    return "0";
  }

  if (num < 0.0001 && num > 0) {
    return usd ? "< $0.0001" : "< 0.0001";
  }

  if (num > 1000) {
    return usd
      ? formatDollarAmount(num, 0)
      : Number(parseFloat(String(num)).toFixed(0)).toLocaleString();
  }

  if (usd) {
    return formatDollarAmount(num, 4);
  }

  return Number(parseFloat(String(num)).toFixed(4)).toString();
};

export function formattedPercent(percent: string | number) {
  if (typeof percent === "string") {
    percent = parseFloat(percent);
  }
  if (!percent || percent === 0) {
    return <Typography fontWeight={500}>0%</Typography>;
  }

  if (percent < 0.0001 && percent > 0) {
    return (
      <Typography fontWeight={500} color="green">
        {"< 0.0001%"}
      </Typography>
    );
  }

  if (percent < 0 && percent > -0.0001) {
    return (
      <Typography fontWeight={500} color="red">
        {"< 0.0001%"}
      </Typography>
    );
  }

  const fixedPercent = percent.toFixed(2);
  if (fixedPercent === "0.00") {
    return "0%";
  }
  if (Number(fixedPercent) > 0) {
    if (Number(fixedPercent) > 100) {
      return (
        <Typography fontWeight={500} color="text5">{`+${percent
          ?.toFixed(0)
          .toLocaleString()}%`}</Typography>
      );
    } else {
      return (
        <Typography
          fontWeight={500}
          color="text5"
        >{`+${fixedPercent}%`}</Typography>
      );
    }
  } else {
    return (
      <Typography fontWeight={500} color="red">{`${fixedPercent}%`}</Typography>
    );
  }
}

/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export const get2DayPercentChange = (
  valueNow: string,
  value24HoursAgo: string | number,
  value48HoursAgo: string | number
) => {
  // get volume info for both 24 hour periods
  const currentChange =
    parseFloat(valueNow) - parseFloat(value24HoursAgo as string);
  const previousChange =
    parseFloat(value24HoursAgo as string) -
    parseFloat(value48HoursAgo as string);

  const adjustedPercentChange =
    (parseFloat(String(currentChange - previousChange)) /
      parseFloat(String(previousChange))) *
    100;

  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};

/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
export const getPercentChange = (
  valueNow: string | number,
  value24HoursAgo: string | number
) => {
  const adjustedPercentChange =
    ((parseFloat(valueNow as string) - parseFloat(value24HoursAgo as string)) /
      parseFloat(value24HoursAgo as string)) *
    100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return 0;
  }
  return adjustedPercentChange;
};
