import { FC, useState } from "react";
import styled from "styled-components";
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
} from "recharts";
import { AutoRow, RowBetween } from "apps/charts/components/Row";
import {
  toK,
  toNiceDate,
  toNiceDateYear,
  formattedNum,
} from "apps/charts/utils";
import { OptionButton } from "apps/charts/components/ButtonStyled";
import { useMedia } from "react-use";
import { timeframeOptions } from "apps/charts/constants";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import { useUserLiquidityChart } from "apps/charts/contexts/User";
import LocalLoader from "apps/charts/components/LocalLoader";
import { useDarkModeManager } from "apps/charts/contexts/LocalStorage";
import { TYPE } from "apps/charts/Theme";

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 390px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`;

type UserChartProps = { account: string };

const UserChart: FC<UserChartProps> = (props) => {
  const { account } = props;
  const chartData = useUserLiquidityChart(account);

  const [timeWindow, setTimeWindow] = useState(timeframeOptions.ALL_TIME);

  const below600 = useMedia("(max-width: 600px)");
  const above1600 = useMedia("(min-width: 1600px)");

  const aspect = above1600 ? 60 / 12 : below600 ? 60 / 42 : 60 / 16;

  const [darkMode] = useDarkModeManager();
  const textColor = darkMode ? "white" : "black";

  // @ts-ignore
  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={40}>
          <div />
          <DropdownSelect
            options={timeframeOptions}
            active={timeWindow}
            setActive={setTimeWindow}
            color={"#ff007a"}
          />
        </RowBetween>
      ) : (
        <RowBetween mb={40}>
          <AutoRow gap="10px">
            <TYPE.main>Liquidity Value</TYPE.main>
          </AutoRow>
          <AutoRow justify="flex-end" gap="4px">
            <OptionButton
              active={timeWindow === timeframeOptions.MONTH}
              onClick={() => setTimeWindow(timeframeOptions.MONTH)}
            >
              1M
            </OptionButton>
            <OptionButton
              active={timeWindow === timeframeOptions.WEEK}
              onClick={() => setTimeWindow(timeframeOptions.WEEK)}
            >
              1W
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
      {chartData ? (
        <ResponsiveContainer aspect={aspect}>
          <AreaChart
            margin={{ top: 0, right: 10, bottom: 6, left: 0 }}
            barCategoryGap={1}
            data={chartData}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={"#4f8fea"} stopOpacity={0.35} />
                <stop offset="95%" stopColor={"#4f8fea"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              tickMargin={16}
              minTickGap={0}
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
              minTickGap={6}
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
                borderColor: "#4f8fea",
                color: "black",
              }}
              wrapperStyle={{ top: -70, left: -10 }}
            />
            <Area
              key={"other"}
              dataKey={"valueUSD"}
              stackId="2"
              strokeWidth={2}
              dot={false}
              type="monotone"
              name={"Liquidity"}
              yAxisId={0}
              stroke={"#4f8fea"}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <LocalLoader />
      )}
    </ChartWrapper>
  );
};

export default UserChart;
