import { FC, memo, useState } from "react";
import { Box, styled, useMediaQuery } from "@mui/material";
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
  getTimeframe,
} from "apps/charts/utils";
import { OptionButton } from "apps/charts/components/ButtonStyled";
import { timeframeOptions } from "apps/charts/constants";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import { useUserLiquidityChart } from "apps/charts/contexts/User";
import LocalLoader from "apps/charts/components/LocalLoader";
import { TYPE } from "apps/charts/Theme";
import useSharedContext from "context/shared";

const ChartWrapper = styled(Box)`
  height: 100%;
  max-height: 390px;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`;

type UserChartsProps = { account: string };

const UserChart: FC<UserChartsProps> = ({ account }) => {
  const chartData = useUserLiquidityChart(account);

  const [timeWindow, setTimeWindow] = useState<string>(
    timeframeOptions.ALL_TIME
  );
  const utcStartTime = getTimeframe(timeWindow);

  const below600 = useMediaQuery("(max-width: 600px)");
  const above1600 = useMediaQuery("(min-width: 1600px)");
  const { isMobile } = useSharedContext();

  const domain = [
    (dataMin: any) => (dataMin > utcStartTime ? dataMin : utcStartTime),
    "dataMax",
  ];

  const aspect = above1600 ? 60 / 12 : below600 ? 60 / 42 : 60 / 16;

  const textColor = "white";

  return (
    <ChartWrapper>
      {below600 ? (
        <RowBetween mb={"40px"}>
          <div />
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
        <RowBetween mb={"40px"}>
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
                <stop offset="5%" stopColor={"#43fff6"} stopOpacity={0.35} />
                <stop offset="95%" stopColor={"#43fff6"} stopOpacity={0} />
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
              domain={domain as any}
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
                border: "none",
                borderRadius: 8,
                color: "white",
                backgroundColor: "#2a3e5a",
              }}
              wrapperStyle={{ top: -70, left: -10, zIndex: 22 }}
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
              stroke={"#43fff6"}
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

export default memo(UserChart);
