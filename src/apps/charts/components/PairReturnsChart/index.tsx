import { useState } from "react";
import styled from "styled-components";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { AutoRow, RowBetween } from "apps/charts/components/Row";

import {
  toK,
  toNiceDate,
  toNiceDateYear,
  formattedNum,
  getTimeframe,
} from "apps/charts/utils";
import { OptionButton } from "apps/charts/components/ButtonStyled";
import { useMedia } from "react-use";
import { timeframeOptions } from "apps/charts/constants";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import { useUserPositionChart } from "apps/charts/contexts/User";
import { useTimeframe } from "apps/charts/contexts/Application";
import LocalLoader from "apps/charts/components/LocalLoader";
import { useColor } from "apps/charts/hooks";
import { useDarkModeManager } from "apps/charts/contexts/LocalStorage";

const ChartWrapper = styled.div`
  max-height: 420px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`;

const OptionsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 40px;
`;

const CHART_VIEW = {
  VALUE: "Value",
  FEES: "Fees",
};

const PairReturnsChart = (props: { account: any; position: any }) => {
  const { account, position } = props;
  let data = useUserPositionChart(position, account);

  const [timeWindow, setTimeWindow] = useTimeframe();

  const below600 = useMedia("(max-width: 600px)");

  const color = useColor(position?.pair.token0.id);

  const [chartView, setChartView] = useState(CHART_VIEW.VALUE);

  // based on window, get start time
  const utcStartTime = getTimeframe(timeWindow);
  data = data?.filter((entry: { date: number }) => entry.date >= utcStartTime);

  const aspect = below600 ? 60 / 42 : 60 / 16;

  const [darkMode] = useDarkModeManager();
  const textColor = darkMode ? "white" : "black";

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <div />
          <DropdownSelect
            options={timeframeOptions}
            active={timeWindow}
            setActive={setTimeWindow}
          />
        </RowBetween>
      ) : (
        <OptionsRow>
          <AutoRow gap="6px" style={{ flexWrap: "nowrap" }}>
            <OptionButton
              active={chartView === CHART_VIEW.VALUE}
              onClick={() => setChartView(CHART_VIEW.VALUE)}
            >
              Liquidity
            </OptionButton>
            <OptionButton
              active={chartView === CHART_VIEW.FEES}
              onClick={() => setChartView(CHART_VIEW.FEES)}
            >
              Fees
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
      <ResponsiveContainer aspect={aspect}>
        {data ? (
          <LineChart
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            barCategoryGap={1}
            data={data}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={14}
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
              interval="preserveStartEnd"
              minTickGap={0}
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
                borderRadius: 10,
                borderColor: color,
                color: "black",
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />

            <Line
              type="monotone"
              dataKey={chartView === CHART_VIEW.VALUE ? "usdValue" : "fees"}
              stroke={color}
              yAxisId={0}
              name={
                chartView === CHART_VIEW.VALUE
                  ? "Liquidity"
                  : "Fees Earned (Cumulative)"
              }
            />
          </LineChart>
        ) : (
          <LocalLoader />
        )}
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default PairReturnsChart;
