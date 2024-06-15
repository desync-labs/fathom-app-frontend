import { useState, useRef, useEffect, FC, memo } from "react";
import { darken } from "polished";
import { Box, styled, useMediaQuery, useTheme } from "@mui/material";
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";
import { AutoRow, RowBetween, RowFixed } from "apps/charts/components/Row";
import {
  toK,
  toNiceDate,
  toNiceDateYear,
  formattedNum,
  getTimeframe,
} from "apps/charts/utils";
import useSharedContext from "context/shared";
import { usePrevious } from "hooks/General/usePrevious";
import { OptionButton } from "apps/charts/components/ButtonStyled";
import { timeframeOptions } from "apps/charts/constants";
import {
  useTokenChartData,
  useTokenPriceData,
} from "apps/charts/contexts/TokenData";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import CandleStickChart from "apps/charts/components/CandleChart";
import LocalLoader from "apps/charts/components/LocalLoader";

const ChartWrapper = styled(Box)`
  height: 100%;
  min-height: 300px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`;

const PriceOption = styled(OptionButton)`
  border-radius: 2px;
`;

const CHART_VIEW = {
  VOLUME: "Volume",
  LIQUIDITY: "Liquidity",
  PRICE: "Price",
  LINE_PRICE: "Price (Line)",
};

const DATA_FREQUENCY = {
  DAY: "DAY",
  HOUR: "HOUR",
  LINE: "LINE",
};

const ActivityIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
};

type TokenChartProps = { address: any; color: any; base: any };

const TokenChart: FC<TokenChartProps> = (props) => {
  const { address, color, base } = props;
  // settings for the window and candle width
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.PRICE);
  const [frequency, setFrequency] = useState(DATA_FREQUENCY.HOUR);
  const { isMobile } = useSharedContext();

  const textColor = "white";

  // reset view on new address
  const addressPrev = usePrevious(address);
  useEffect(() => {
    if (address !== addressPrev && addressPrev) {
      setChartFilter(CHART_VIEW.LIQUIDITY);
    }
  }, [address, addressPrev]);

  let chartData = useTokenChartData(address);

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.WEEK);
  const prevWindow = usePrevious(timeWindow);

  // hourly and daily price data based on the current time window
  const hourlyWeek = useTokenPriceData(address, timeframeOptions.WEEK, 3600);
  const hourlyMonth = useTokenPriceData(address, timeframeOptions.MONTH, 3600);
  const hourlyAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 3600);
  const dailyWeek = useTokenPriceData(address, timeframeOptions.WEEK, 86400);
  const dailyMonth = useTokenPriceData(address, timeframeOptions.MONTH, 86400);
  const dailyAll = useTokenPriceData(address, timeframeOptions.ALL_TIME, 86400);
  const priceData =
    timeWindow === timeframeOptions.MONTH
      ? // monthly selected
        frequency === DATA_FREQUENCY.DAY
        ? dailyMonth
        : hourlyMonth
      : // weekly selected
      timeWindow === timeframeOptions.WEEK
      ? frequency === DATA_FREQUENCY.DAY
        ? dailyWeek
        : hourlyWeek
      : // all time selected
      frequency === DATA_FREQUENCY.DAY
      ? dailyAll
      : hourlyAll;

  // switch to hourly data when switched to week window
  useEffect(() => {
    if (
      timeWindow === timeframeOptions.WEEK &&
      prevWindow &&
      prevWindow !== timeframeOptions.WEEK
    ) {
      setFrequency(DATA_FREQUENCY.HOUR);
    }
  }, [prevWindow, timeWindow]);

  // switch to daily data if switche to month or all time view
  useEffect(() => {
    if (
      timeWindow === timeframeOptions.MONTH &&
      prevWindow &&
      prevWindow !== timeframeOptions.MONTH
    ) {
      setFrequency(DATA_FREQUENCY.DAY);
    }
    if (
      timeWindow === timeframeOptions.ALL_TIME &&
      prevWindow &&
      prevWindow !== timeframeOptions.ALL_TIME
    ) {
      setFrequency(DATA_FREQUENCY.DAY);
    }
  }, [prevWindow, timeWindow]);

  const theme = useTheme();
  const below1080 = useMediaQuery(theme.breakpoints.down(1080));
  const below600 = useMediaQuery(theme.breakpoints.down(600));

  const utcStartTime = getTimeframe(timeWindow);
  const aspect = below600 ? 60 / 60 : below1080 ? 60 / 32 : 60 / 22;
  const textSize = below600 ? 12 : 16;

  chartData = chartData?.filter(
    (entry: { date: number }) => entry.date >= utcStartTime
  );

  // update the width on a window resize
  const ref = useRef<HTMLDivElement>(null);
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(ref?.current?.clientWidth);
  useEffect(() => {
    if (!isClient) {
      return;
    }
    function handleResize() {
      setWidth(ref?.current?.clientWidth ?? width);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient, width]); // Empty array ensures that effect is only run on mount and unmount

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={"40px"}>
          <DropdownSelect
            options={CHART_VIEW}
            active={chartFilter}
            setActive={setChartFilter}
            color={"#5a81ff"}
            shadow={"0 0 8px #003cff"}
          />
          <DropdownSelect
            options={timeframeOptions}
            active={timeWindow}
            setActive={setTimeWindow}
            color={"#5a81ff"}
            shadow={"0 0 8px #003cff"}
            style={{ paddingRight: isMobile ? "1.25rem" : "0" }}
          />
        </RowBetween>
      ) : (
        <RowBetween
          mb={
            chartFilter === CHART_VIEW.LIQUIDITY ||
            chartFilter === CHART_VIEW.VOLUME ||
            (chartFilter === CHART_VIEW.PRICE &&
              frequency === DATA_FREQUENCY.LINE)
              ? "40px"
              : 0
          }
          align="flex-start"
        >
          <div>
            <RowFixed>
              <OptionButton
                active={chartFilter === CHART_VIEW.LIQUIDITY}
                onClick={() => setChartFilter(CHART_VIEW.LIQUIDITY)}
                style={{ marginRight: "6px" }}
              >
                Liquidity
              </OptionButton>
              <OptionButton
                active={chartFilter === CHART_VIEW.VOLUME}
                onClick={() => setChartFilter(CHART_VIEW.VOLUME)}
                style={{ marginRight: "6px" }}
              >
                Volume
              </OptionButton>
              <OptionButton
                active={chartFilter === CHART_VIEW.PRICE}
                onClick={() => {
                  setChartFilter(CHART_VIEW.PRICE);
                }}
              >
                Price
              </OptionButton>
            </RowFixed>
            {chartFilter === CHART_VIEW.PRICE && (
              <AutoRow gap="4px">
                <PriceOption
                  active={frequency === DATA_FREQUENCY.DAY}
                  onClick={() => {
                    setTimeWindow(timeframeOptions.MONTH);
                    setFrequency(DATA_FREQUENCY.DAY);
                  }}
                >
                  D
                </PriceOption>
                <PriceOption
                  active={frequency === DATA_FREQUENCY.HOUR}
                  onClick={() => setFrequency(DATA_FREQUENCY.HOUR)}
                >
                  H
                </PriceOption>
                <PriceOption
                  active={frequency === DATA_FREQUENCY.LINE}
                  onClick={() => setFrequency(DATA_FREQUENCY.LINE)}
                >
                  <ActivityIcon />
                </PriceOption>
              </AutoRow>
            )}
          </div>
          <AutoRow justify="flex-end" gap="6px" align="flex-start">
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.ALL_TIME}
              onClick={() => setTimeWindow(timeframeOptions.ALL_TIME)}
            >
              All
            </OptionButton>
          </AutoRow>
        </RowBetween>
      )}
      {chartFilter === CHART_VIEW.LIQUIDITY && chartData && (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart
            barCategoryGap={1}
            data={chartData}
            margin={{ top: 0, right: below600 ? -15 : 0, bottom: 5, left: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={120}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor, fontSize: textSize }}
              type={"number"}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              type="number"
              orientation="right"
              tickFormatter={(tick) => "$" + toK(tick)}
              axisLine={false}
              tickLine={false}
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor, fontSize: textSize }}
            />
            <Tooltip
              cursor={true}
              formatter={(val) => formattedNum(Number(val), true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: "10px 14px",
                border: "none",
                borderRadius: 8,
                color: "white",
                backgroundColor: "#2a3e5a",
              }}
              wrapperStyle={{ top: -70, left: -10, zIndex: 22 }}
            />
            <Area
              key={"other"}
              dataKey={"totalLiquidityUSD"}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={"Liquidity"}
              yAxisId={0}
              stroke={darken(0.12, color)}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
      {chartFilter === CHART_VIEW.PRICE &&
        (frequency === DATA_FREQUENCY.LINE ? (
          <ResponsiveContainer aspect={aspect}>
            <AreaChart
              margin={{ top: 0, right: -5, bottom: 5, left: 0 }}
              barCategoryGap={1}
              data={chartData}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                tickLine={false}
                axisLine={false}
                interval="preserveEnd"
                tickMargin={16}
                minTickGap={120}
                tickFormatter={(tick) => toNiceDate(tick)}
                dataKey="date"
                tick={{ fill: textColor }}
                type={"number"}
                domain={["dataMin", "dataMax"]}
              />
              <YAxis
                type="number"
                orientation="right"
                tickFormatter={(tick) => "$" + toK(tick)}
                axisLine={false}
                tickLine={false}
                interval="preserveEnd"
                minTickGap={80}
                yAxisId={0}
                tick={{ fill: textColor }}
              />
              <Tooltip
                cursor={true}
                formatter={(val) => formattedNum(Number(val), true)}
                labelFormatter={(label) => toNiceDateYear(label)}
                labelStyle={{ paddingTop: 4 }}
                contentStyle={{
                  padding: "10px 14px",
                  border: "none",
                  borderRadius: 8,
                  color: "white",
                  backgroundColor: "#2a3e5a",
                }}
                wrapperStyle={{ top: -70, left: -10, zIndex: 22 }}
              />
              <Area
                key={"other"}
                dataKey={"priceUSD"}
                stackId="2"
                strokeWidth={2}
                dot={false}
                type="monotone"
                name={"Price"}
                yAxisId={0}
                stroke={darken(0.12, color)}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : priceData ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart data={priceData} width={width} base={base} />
          </ResponsiveContainer>
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          <BarChart
            margin={{ top: 0, right: below600 ? -10 : 0, bottom: 5, left: 0 }}
            barCategoryGap={1}
            data={chartData}
          >
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={80}
              tickMargin={14}
              tickFormatter={(tick) => toNiceDate(tick)}
              dataKey="date"
              tick={{ fill: textColor, fontSize: textSize }}
              type={"number"}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              type="number"
              axisLine={false}
              tickMargin={16}
              tickFormatter={(tick) => "$" + toK(tick)}
              tickLine={false}
              orientation="right"
              interval="preserveEnd"
              minTickGap={80}
              yAxisId={0}
              tick={{ fill: textColor, fontSize: textSize }}
            />
            <Tooltip
              cursor={{ fill: color, opacity: 0.1 }}
              formatter={(val) => formattedNum(Number(val), true)}
              labelFormatter={(label) => toNiceDateYear(label)}
              labelStyle={{ paddingTop: 4 }}
              contentStyle={{
                padding: "10px 14px",
                border: "none",
                borderRadius: 8,
                color: "white",
                backgroundColor: "#2a3e5a",
              }}
              wrapperStyle={{ top: -70, left: -10, zIndex: 22 }}
            />
            <Bar
              type="monotone"
              name={"Volume"}
              dataKey={"dailyVolumeUSD"}
              fill={color}
              opacity={"0.4"}
              yAxisId={0}
              stroke={color}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartWrapper>
  );
};

export default memo(TokenChart);
