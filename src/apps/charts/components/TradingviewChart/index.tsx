import { useState, useEffect, useRef, FC, memo, useMemo } from "react";
import { createChart, IChartApi } from "lightweight-charts";
import { Box, styled } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { usePrevious } from "hooks/General/usePrevious";
import { formattedNum } from "apps/charts/utils";
import { IconWrapper } from "apps/charts/components";

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import dropSrc from "apps/charts/assets/drop.svg";
import riseSrc from "apps/charts/assets/rise.svg";

dayjs.extend(utc);

export const CHART_TYPES = {
  BAR: "BAR",
  AREA: "AREA",
};

const Wrapper = styled(Box)`
  position: relative;
`;

// constant height for charts
const HEIGHT = 300;

type TradingViewChartProps = {
  type?: string;
  data: any;
  base: any;
  baseChange: any;
  field: any;
  title: string;
  width?: number;
  useWeekly?: boolean;
  below800: boolean;
};

const TradingViewChart: FC<TradingViewChartProps> = (props) => {
  const {
    type = CHART_TYPES.BAR,
    data,
    base,
    baseChange,
    field,
    title,
    width,
    useWeekly = false,
    below800,
  } = props;
  // reference for DOM element to create with chart
  const ref = useRef<HTMLDivElement>(null);

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState<IChartApi | null>(null);
  const dataPrev = usePrevious(data);

  const textColor = "#6379A1";

  useEffect(() => {
    if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
      // remove the tooltip element
      const tooltip = document.getElementById("tooltip-id" + type);
      const node = document.getElementById("test-id" + type);
      node?.removeChild(tooltip as HTMLElement);
      chartCreated.resize(0, 0);
      setChartCreated(null);
    }
  }, [chartCreated, data, dataPrev, type]);

  // parse the data and format for tradeview consumption
  const formattedData = useMemo(() => {
    const formattedDataValues: { time: string; value: number }[] = [];

    data?.forEach((entry: any) => {
      const date = dayjs.unix(entry.date as number);

      if (!date.isValid()) {
        return;
      }

      const item = {
        time: date.utc().format("YYYY-MM-DD"),
        value: parseFloat(entry[field]),
      };

      formattedDataValues.push(item);
    });

    return formattedDataValues || [];
  }, [data]);

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2;

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated && formattedData && formattedData.length) {
      const chart = createChart(ref.current as HTMLDivElement, {
        width: width,
        height: HEIGHT,
        layout: {
          backgroundColor: "transparent",
          textColor: textColor,
        },
        rightPriceScale: {
          scaleMargins: {
            top: topScale,
            bottom: 0,
          },
          borderVisible: false,
        },
        timeScale: {
          borderVisible: false,
        },
        grid: {
          horzLines: {
            color: "#324567",
            visible: false,
          },
          vertLines: {
            color: "#324567",
            visible: false,
          },
        },
        crosshair: {
          horzLine: {
            visible: false,
            labelVisible: false,
          },
          vertLine: {
            visible: true,
            style: 0,
            width: 2,
            color: "rgba(0, 255, 246, 0.16)",
            labelVisible: false,
          },
        },
        localization: {
          priceFormatter: (val: any) => formattedNum(val, true),
        },
      });

      const series =
        type === CHART_TYPES.BAR
          ? chart.addHistogramSeries({
              color: "#43fff6",
              priceFormat: {
                type: "volume",
              },
              scaleMargins: {
                top: 0.32,
                bottom: 0,
              },
              lineColor: "#324567",
              lineWidth: 3,
            } as any)
          : chart.addAreaSeries({
              topColor: "#43fff6",
              bottomColor: "#324567",
              lineColor: "#43fff6",
              lineWidth: 1,
            });

      series.setData(formattedData);
      const toolTip = document.createElement("div");
      toolTip.setAttribute("id", "tooltip-id" + type);
      toolTip.className = "three-line-legend-dark";
      (ref.current as HTMLElement).appendChild(toolTip);
      toolTip.style.display = "block";
      toolTip.style.fontWeight = "500";
      toolTip.style.left = -4 + "px";
      toolTip.style.top = "-" + 8 + "px";
      toolTip.style.backgroundColor = "transparent";

      // format numbers
      const percentChange = baseChange?.toFixed(2);
      const formattedPercentChange =
        (percentChange > 0 ? "+" : "") + percentChange + "%";
      const percentageBackgroundColor =
        percentChange >= 0 ? "#173D0F" : "#811717";

      // get the title of the chart
      const setLastBarText = () => {
        toolTip.innerHTML = !below800
          ? `<div style="position: absolute; top: -42px; font-size: 16px; margin: 4px 0; color: white;">${title} ${
              type === CHART_TYPES.BAR && !useWeekly ? "(24hr)" : ""
            }</div>` +
            `<div style="display: flex; justify-content: space-between; align-items: center; font-size: 22px; position: absolute; top: -20px; margin: 4px 0; color:white" >` +
            formattedNum(base ?? 0, true) +
            `<span style="
                padding: 4px 8px;
                margin-left: 10px;
                display: flex;
                align-items: center;
                gap: 7px;                                         
                font-size: 12px;
                border-radius: 6px;
                background-color: ${percentageBackgroundColor};
          ">
          <img src="${
            percentChange >= 0 ? riseSrc : dropSrc
          }" alt="percentage-state" /> ${formattedPercentChange} </span>` +
            "</div>"
          : "";
      };
      setLastBarText();

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (prop) {
        const param = prop as any;
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          (width && param.point.x > width) ||
          param.point.y < 0 ||
          param.point.y > HEIGHT
        ) {
          setLastBarText();
        } else {
          const dateStr = useWeekly
            ? dayjs(
                param.time.year + "-" + param.time.month + "-" + param.time.day
              )
                .startOf("week")
                .format("MMMM D, YYYY") +
              "-" +
              dayjs(
                param.time.year + "-" + param.time.month + "-" + param.time.day
              )
                .endOf("week")
                .format("MMMM D, YYYY")
            : dayjs(
                param.time.year + "-" + param.time.month + "-" + param.time.day
              ).format("MMMM D, YYYY");

          const price = param.seriesPrices?.get(series);

          toolTip.innerHTML =
            `<div style="font-size: 16px; position: absolute; top: -42px; margin: 4px 0; color: white;">${title}</div>` +
            `<div style="font-size: 22px; position: absolute; top: -20px; margin: 4px 0; color: white">` +
            formattedNum(price, true) +
            "</div>" +
            "<div>" +
            dateStr +
            "</div>";
        }
      });

      chart.timeScale().fitContent();

      setChartCreated(chart);
    }
  }, [
    base,
    baseChange,
    chartCreated,
    data,
    formattedData,
    textColor,
    title,
    topScale,
    type,
    useWeekly,
    width,
    below800,
  ]);

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, HEIGHT);
      chartCreated && chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, width]);

  return (
    <Wrapper>
      <div style={{ marginTop: "25px" }} ref={ref} id={"test-id" + type} />
      <IconWrapper>
        <PlayArrowOutlinedIcon
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent();
          }}
        />
      </IconWrapper>
    </Wrapper>
  );
};

export default memo(TradingViewChart);
