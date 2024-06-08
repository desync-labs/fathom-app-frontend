import { FC, memo, PureComponent, useEffect, useState } from "react";
import { Box, ListItemText, Paper, Typography, styled } from "@mui/material";
import dayjs from "dayjs";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatNumber } from "utils/format";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

export const ChartTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  margin-bottom: 16px;
`;

export interface HistoryChartDataType {
  timestamp: string;
  chartValue: string;
}

type VaultHistoryChartPropTypes = {
  title: string;
  chartDataArray: HistoryChartDataType[];
  valueLabel: string;
  valueUnits?: string;
};

const CustomTooltipPaper = styled(Paper)`
  padding: 5px;
  border-radius: 8px;
  background: #2a3e5a;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 5px 5px 5px 10px;
  }
  .MuiListItem-root {
    > * {
      color: #fff;
    }
  }
`;

const CustomTooltip: FC<TooltipProps<ValueType, NameType>> = memo(
  ({ payload }) => {
    if (payload && payload.length) {
      const reportTimestamp = parseInt(payload[0]?.payload?.timestamp, 10);
      const reportDateString = dayjs(reportTimestamp).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      const units = payload[0].unit || "";
      return (
        <CustomTooltipPaper>
          <AppList sx={{ padding: 0 }}>
            <AppListItem alignItems="flex-start">
              <ListItemText primary={reportDateString} />
            </AppListItem>
            <AppListItem
              sx={{ gap: "10px" }}
              alignItems="flex-start"
              secondaryAction={
                <>{`${formatNumber(payload[0].payload?.chartValue) + units}`}</>
              }
            >
              <ListItemText primary={payload[0].name} />
            </AppListItem>
          </AppList>
        </CustomTooltipPaper>
      );
    }

    return null;
  }
);

class CustomizedYAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y - 10})`}>
        <text x={0} y={0} dy={16} textAnchor="start" fill="#6D86B2">
          {formatNumber(payload.value)}
        </text>
      </g>
    );
  }
}

const VaultHistoryChart: FC<VaultHistoryChartPropTypes> = ({
  title,
  chartDataArray,
  valueLabel,
  valueUnits,
}) => {
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(0);

  useEffect(() => {
    if (chartDataArray.length) {
      const chartValues = chartDataArray.map((item) =>
        parseFloat(item.chartValue || "0")
      );

      setMaxValue(Math.max(...chartValues));
      setMinValue(Math.min(...chartValues));
    } else {
      setMaxValue(0);
      setMinValue(0);
    }
  }, [chartDataArray]);

  const tickFormatter = (timestamp: string, index: number) => {
    const date = dayjs(parseInt(timestamp, 10));
    if (
      index === 0 ||
      dayjs(parseInt(chartDataArray[index - 1].timestamp, 10)).year() !==
        date.year()
    ) {
      return date.format("YYYY");
    }
    return date.format("MMM");
  };

  return (
    <Box pt="25px">
      <ChartTitle>{title}</ChartTitle>
      <ResponsiveContainer width="100%" aspect={6}>
        <LineChart
          data={chartDataArray}
          margin={{
            top: 0,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid
            stroke="#3D5580"
            strokeDasharray="5 5"
            vertical={false}
          />
          <XAxis
            domain={["auto", "auto"]}
            dataKey="timestamp"
            stroke="#5977a0"
            tickFormatter={tickFormatter}
            allowDataOverflow={true}
            strokeWidth={1}
          />
          <YAxis
            domain={[minValue, maxValue]}
            stroke={"transparent"}
            orientation="right"
            tick={<CustomizedYAxisTick />}
            allowDataOverflow={false}
            width={20}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="step"
            dataKey="chartValue"
            stroke="#00fff6"
            strokeWidth={2}
            name={valueLabel}
            unit={valueUnits}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VaultHistoryChart;
