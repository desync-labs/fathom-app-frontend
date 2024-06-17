import { useState, useEffect, useRef, FC, memo, useMemo } from "react";
import { Box, styled } from "@mui/material";
import { createChart, CrosshairMode, IChartApi } from "lightweight-charts";
import dayjs from "dayjs";
import { usePrevious } from "hooks/General/usePrevious";
import { formattedNum } from "apps/charts/utils";

import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";

const IconWrapper = styled(Box)`
  position: absolute;
  right: 10px;
  color: #fafafa;
  border-radius: 3px;
  height: 16px;
  width: 16px;
  padding: 0;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`;

type CandleStickChartProps = {
  data: any;
  width?: number;
  height?: number;
  base: any;
  margin?: boolean;
  valueFormatter?: (val: string) => void;
};

const CandleStickChart: FC<CandleStickChartProps> = ({
  data,
  width,
  height = 300,
  base,
  margin = true,
  valueFormatter = (val: string) => formattedNum(val, true),
}) => {
  // reference for DOM element to create with chart
  const ref = useRef<HTMLDivElement>(null);

  const formattedData = useMemo(() => {
    const formattedDataValues: any[] = [];

    data?.forEach((entry: any) => {
      formattedDataValues.push({
        time: parseFloat(entry.timestamp),
        open: parseFloat(entry.open),
        low: parseFloat(entry.open),
        close: parseFloat(entry.close),
        high: parseFloat(entry.close),
      });
    });

    if (formattedDataValues && formattedDataValues.length > 0) {
      formattedDataValues.push({
        time: dayjs().unix(),
        open: parseFloat(
          formattedDataValues[formattedDataValues.length - 1].close
        ),
        close: parseFloat(base),
        low: Math.min(
          parseFloat(base),
          parseFloat(formattedDataValues[formattedDataValues.length - 1].close)
        ),
        high: Math.max(
          parseFloat(base),
          parseFloat(formattedDataValues[formattedDataValues.length - 1].close)
        ),
      });
    }

    return formattedDataValues;
  }, [data]);

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState<IChartApi | null>(null);
  const dataPrev = usePrevious(data);

  const textColor = "white";

  useEffect(() => {
    if (data !== dataPrev && chartCreated) {
      // remove the tooltip element
      const tooltip = document.getElementById("tooltip-id");
      const node = document.getElementById("test-id");
      node?.removeChild(tooltip as HTMLElement);
      chartCreated.resize(0, 0);
      setChartCreated(null);
    }
  }, [chartCreated, data, dataPrev]);

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated) {
      const chart = createChart(ref.current as unknown as HTMLElement, {
        width: width,
        height: height,
        layout: {
          backgroundColor: "transparent",
          textColor: textColor,
        },
        grid: {
          vertLines: {
            color: "rgba(197, 203, 206, 0.5)",
          },
          horzLines: {
            color: "rgba(197, 203, 206, 0.5)",
          },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
          visible: true,
        },
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
        },
        localization: {
          priceFormatter: (val: any) => formattedNum(val),
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: "green",
        downColor: "red",
        borderDownColor: "red",
        borderUpColor: "green",
        wickDownColor: "red",
        wickUpColor: "green",
      });

      candleSeries.setData(formattedData);

      const toolTip = document.createElement("div");
      toolTip.setAttribute("id", "tooltip-id");
      toolTip.className = "three-line-legend";
      (ref.current as unknown as HTMLElement).appendChild(toolTip);
      toolTip.style.display = "block";
      toolTip.style.left = (margin ? 116 : 10) + "px";
      toolTip.style.top = 50 + "px";
      toolTip.style.backgroundColor = "transparent";

      // get the title of the chart
      const setLastBarText = () => {
        toolTip.innerHTML = base
          ? `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
            valueFormatter(base) +
            "</div>"
          : "";
      };
      setLastBarText();

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (param) {
        if (
          param === undefined ||
          param.time === undefined ||
          (param?.point?.x as number) < 0 ||
          (param?.point?.x as number) > Number(width) ||
          (param?.point?.y as number) < 0 ||
          (param?.point?.y as number) > height
        ) {
          setLastBarText();
        } else {
          const price = (param as any).seriesPrices.get(candleSeries).close;
          const time = dayjs.unix(param.time as number).format("MM/DD h:mm A");
          toolTip.innerHTML =
            `<div style="font-size: 22px; margin: 4px 0px; color: ${textColor}">` +
            valueFormatter(price) +
            `<span style="font-size: 12px; margin: 4px 6px; color: ${textColor}">` +
            time +
            " UTC" +
            "</span>" +
            "</div>";
        }
      });

      chart.timeScale().fitContent();

      setChartCreated(chart);
    }
  }, [
    chartCreated,
    formattedData,
    width,
    height,
    valueFormatter,
    base,
    margin,
    textColor,
  ]);

  // responsiveness
  useEffect(() => {
    if (width) {
      chartCreated && chartCreated.resize(width, height);
      chartCreated && chartCreated.timeScale().scrollToPosition(0, false);
    }
  }, [chartCreated, height, width]);

  return (
    <div>
      <div ref={ref} id="test-id" />
      <IconWrapper>
        <PlayArrowOutlinedIcon
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent();
          }}
        />
      </IconWrapper>
    </div>
  );
};

export default memo(CandleStickChart);
