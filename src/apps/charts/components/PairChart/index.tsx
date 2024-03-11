import { useState, useRef, useEffect, FC, memo } from "react";
import { Box, styled, useMediaQuery } from "@mui/material";
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
import { darken } from "polished";
import { RowBetween, AutoRow } from "apps/charts/components/Row";
import {
  toK,
  toNiceDate,
  toNiceDateYear,
  formattedNum,
  getTimeframe,
} from "apps/charts/utils";
import { OptionButton } from "apps/charts/components/ButtonStyled";
import {
  usePairChartData,
  useHourlyRateData,
  usePairData,
} from "apps/charts/contexts/PairData";
import { timeframeOptions } from "apps/charts/constants";
import { EmptyCard } from "apps/charts/components";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import CandleStickChart from "apps/charts/components/CandleChart";
import LocalLoader from "apps/charts/components/LocalLoader";
import useSharedContext from "context/shared";

const ChartWrapper = styled(Box)`
  height: 100%;
  max-height: 340px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
    max-height: unset;
  }
`;

const OptionsRow = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`;

const CHART_VIEW = {
  VOLUME: "Volume",
  LIQUIDITY: "Liquidity",
  RATE0: "Rate 0",
  RATE1: "Rate 1",
};

type PairChartProps = {
  address: string;
  color: string;
  base0: any;
  base1: any;
};

const PairChart: FC<PairChartProps> = (props) => {
  const { address, color, base0, base1 } = props;
  const [chartFilter, setChartFilter] = useState(CHART_VIEW.LIQUIDITY);

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.MONTH);
  const { isMobile } = useSharedContext();

  const textColor = "white";

  // update the width on a window resize
  const ref = useRef<HTMLDivElement>(null);
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(ref?.current?.clientWidth);
  const [height, setHeight] = useState(ref?.current?.clientHeight);
  useEffect(() => {
    if (!isClient) {
      return;
    }
    function handleResize() {
      setWidth(ref?.current?.clientWidth ?? width);
      setHeight(ref?.current?.clientHeight ?? height);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height, isClient, width]); // Empty array ensures that effect is only run on mount and unmount

  // get data for pair, and rates
  const pairData = usePairData(address);
  let chartData = usePairChartData(address);
  const hourlyData = useHourlyRateData(address, timeWindow);
  const hourlyRate0 = hourlyData && hourlyData[0];
  const hourlyRate1 = hourlyData && hourlyData[1];

  // formatted symbols for overflow
  const formattedSymbol0 =
    pairData?.token0?.symbol.length > 6
      ? pairData?.token0?.symbol.slice(0, 5) + "..."
      : pairData?.token0?.symbol;
  const formattedSymbol1 =
    pairData?.token1?.symbol.length > 6
      ? pairData?.token1?.symbol.slice(0, 5) + "..."
      : pairData?.token1?.symbol;

  const below1600 = useMediaQuery("(max-width: 1600px)");
  const below1080 = useMediaQuery("(max-width: 1080px)");
  const below600 = useMediaQuery("(max-width: 600px)");

  const utcStartTime = getTimeframe(timeWindow);
  chartData = chartData?.filter(
    (entry: { date: number }) => entry.date >= utcStartTime
  );

  if (chartData && chartData.length === 0) {
    return (
      <ChartWrapper>
        <EmptyCard height="300px">No historical data yet.</EmptyCard>{" "}
      </ChartWrapper>
    );
  }

  /**
   * Used to format values on chart on scroll
   * Needs to be raw html for chart API to parse styles
   * @param {*} val
   */
  function valueFormatter(val: string | number) {
    if (chartFilter === CHART_VIEW.RATE0) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
      );
    }
    if (chartFilter === CHART_VIEW.RATE1) {
      return (
        formattedNum(val) +
        `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
      );
    }

    return null;
  }

  const aspect = below600
    ? 60 / 60
    : below1080
    ? 60 / 24
    : below1600
    ? 60 / 32
    : 60 / 23;

  const textSize = below600 ? 12 : 16;

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
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: "nowrap" }}>
            <OptionButton
              active={chartFilter === CHART_VIEW.LIQUIDITY}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME);
                setChartFilter(CHART_VIEW.LIQUIDITY);
              }}
            >
              Liquidity
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.VOLUME}
              onClick={() => {
                setTimeWindow(timeframeOptions.ALL_TIME);
                setChartFilter(CHART_VIEW.VOLUME);
              }}
            >
              Volume
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.RATE0}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK);
                setChartFilter(CHART_VIEW.RATE0);
              }}
            >
              {pairData.token0
                ? formattedSymbol1 + "/" + formattedSymbol0
                : "-"}
            </OptionButton>
            <OptionButton
              active={chartFilter === CHART_VIEW.RATE1}
              onClick={() => {
                setTimeWindow(timeframeOptions.WEEK);
                setChartFilter(CHART_VIEW.RATE1);
              }}
            >
              {pairData.token0
                ? formattedSymbol0 + "/" + formattedSymbol1
                : "-"}
            </OptionButton>
          </AutoRow>
          <AutoRow justify="flex-end" gap="6px">
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
        </OptionsRow>
      )}
      {chartFilter === CHART_VIEW.LIQUIDITY && (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart
            margin={{
              top: 0,
              right: below600 ? -15 : 0,
              bottom: 0,
              left: 0,
            }}
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
              minTickGap={80}
              tickMargin={10}
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
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={" (USD)"}
              dataKey={"reserveUSD"}
              yAxisId={0}
              stroke={darken(0.12, color)}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {chartFilter === CHART_VIEW.RATE1 &&
        (hourlyRate1 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate1}
              base={base0}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.RATE0 &&
        (hourlyRate0 ? (
          <ResponsiveContainer aspect={aspect} ref={ref}>
            <CandleStickChart
              data={hourlyRate0}
              base={base1}
              margin={false}
              width={width}
              valueFormatter={valueFormatter}
            />
          </ResponsiveContainer>
        ) : (
          <LocalLoader />
        ))}

      {chartFilter === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={aspect}>
          <BarChart
            margin={{
              top: 0,
              right: below600 ? -16 : 0,
              bottom: 6,
              left: below1080 ? 0 : 10,
            }}
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
              tickFormatter={(tick) => "$" + toK(tick)}
              tickLine={false}
              interval="preserveEnd"
              orientation="right"
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

export default memo(PairChart);
