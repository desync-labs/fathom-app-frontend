import { useState, useEffect, useRef, FC } from "react";
import { createChart } from "lightweight-charts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { formattedNum } from "apps/charts/utils";
import styled from "styled-components";
import { usePrevious } from "react-use";
import { Play } from "react-feather";
import { useDarkModeManager } from "apps/charts/contexts/LocalStorage";
import { IconWrapper } from "apps/charts/components";
import dropSrc from "apps/charts/assets/drop.svg";
import riseSrc from "apps/charts/assets/rise.svg";

dayjs.extend(utc);

export const CHART_TYPES = {
  BAR: "BAR",
  AREA: "AREA",
};

const Wrapper = styled.div`
  position: relative;
`;

// constant height for charts
const HEIGHT = 300;

type TradingViewChartProps = {
  type?: string | undefined;
  data: any;
  base: any;
  baseChange: any;
  field: any;
  title: any;
  width: any;
  useWeekly?: false | undefined;
  below800: any;
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
  const ref = useRef();

  // pointer to the chart object
  const [chartCreated, setChartCreated] = useState(false);
  const dataPrev = usePrevious(data);

  const [darkMode] = useDarkModeManager();
  const textColor = "#6379A1";
  const previousTheme = usePrevious(darkMode);

  useEffect(() => {
    if (data !== dataPrev && chartCreated && type === CHART_TYPES.BAR) {
      // remove the tooltip element
      let tooltip = document.getElementById("tooltip-id" + type);
      let node = document.getElementById("test-id" + type);
      node.removeChild(tooltip);
      chartCreated.resize(0, 0);
      setChartCreated();
    }
  }, [chartCreated, data, dataPrev, type]);

  // parese the data and format for tardingview consumption
  const formattedData = data?.map((entry) => {
    return {
      time: dayjs.unix(entry.date).utc().format("YYYY-MM-DD"),
      value: parseFloat(entry[field]),
    };
  });

  // adjust the scale based on the type of chart
  const topScale = type === CHART_TYPES.AREA ? 0.32 : 0.2;

  // reset the chart if them switches
  useEffect(() => {
    if (chartCreated && previousTheme !== darkMode) {
      // remove the tooltip element
      let tooltip = document.getElementById("tooltip-id" + type);
      let node = document.getElementById("test-id" + type);
      node.removeChild(tooltip);
      chartCreated.resize(0, 0);
      setChartCreated();
    }
  }, [chartCreated, darkMode, previousTheme, type]);

  // if no chart created yet, create one with options and add to DOM manually
  useEffect(() => {
    if (!chartCreated && formattedData) {
      const chart = createChart(ref.current, {
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
            color: "#003CFF",
            visible: false,
          },
          vertLines: {
            color: "#003CFF",
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
            color: "#003CFF",
            labelVisible: false,
          },
        },
        localization: {
          priceFormatter: (val) => formattedNum(val, true),
        },
      });

      const series =
        type === CHART_TYPES.BAR
          ? chart.addHistogramSeries({
              color: "#003CFF",
              priceFormat: {
                type: "volume",
              },
              scaleMargins: {
                top: 0.32,
                bottom: 0,
              },
              lineColor: "#003CFF",
              lineWidth: 3,
            })
          : chart.addAreaSeries({
              topColor: "#003CFF",
              bottomColor: "#003CFF",
              lineColor: "#003CFF",
              lineWidth: 3,
            });

      series.setData(formattedData);
      const toolTip = document.createElement("div");
      toolTip.setAttribute("id", "tooltip-id" + type);
      toolTip.className = darkMode
        ? "three-line-legend-dark"
        : "three-line-legend";
      ref.current.appendChild(toolTip);
      toolTip.style.display = "block";
      toolTip.style.fontWeight = "500";
      toolTip.style.left = -4 + "px";
      toolTip.style.top = "-" + 8 + "px";
      toolTip.style.backgroundColor = "transparent";

      // format numbers
      let percentChange = baseChange?.toFixed(2);
      let formattedPercentChange =
        (percentChange > 0 ? "+" : "") + percentChange + "%";
      let percentageBackgroundColor =
        percentChange >= 0 ? "#173D0F" : "#811717";

      // get the title of the chart
      function setLastBarText() {
        toolTip.innerHTML = !below800
          ? `<div style="position: absolute; top: -42px; font-size: 16px; margin: 4px 0px; color: white;">${title} ${
              type === CHART_TYPES.BAR && !useWeekly ? "(24hr)" : ""
            }</div>` +
            `<div style="display: flex; justify-content: space-between; align-items: center; font-size: 22px; position: absolute; top: -20px; margin: 4px 0px; color:white" >` +
            formattedNum(base ?? 0, true) +
            `<span style="
                padding: 4px 8px;
                margin-left: 10px;
                display: flex;
                align-items: center;
                gap: 7px;                          
                font-size: 16px;
                font-size: 12px;
                border-radius: 6px;
                background-color: ${percentageBackgroundColor};
          ">
          <img src="${
            percentChange >= 0 ? riseSrc : dropSrc
          }" alt="percentage-state" />
          
${formattedPercentChange}
</span>` +
            "</div>"
          : "";
      }
      setLastBarText();

      // update the title when hovering on the chart
      chart.subscribeCrosshairMove(function (param) {
        if (
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.x > width ||
          param.point.y < 0 ||
          param.point.y > HEIGHT
        ) {
          setLastBarText();
        } else {
          let dateStr = useWeekly
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
          var price = param.seriesPrices.get(series);

          toolTip.innerHTML =
            `<div style="font-size: 16px; position: absolute; top: -42px; margin: 4px 0px; color: white;">${title}</div>` +
            `<div style="font-size: 22px; position: absolute; top: -20px; margin: 4px 0px; color: white">` +
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
    darkMode,
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
      chartCreated && chartCreated.timeScale().scrollToPosition(0);
    }
  }, [chartCreated, width]);

  return (
    <Wrapper>
      <div ref={ref} id={"test-id" + type} />
      <IconWrapper>
        <Play
          onClick={() => {
            chartCreated && chartCreated.timeScale().fitContent();
          }}
        />
      </IconWrapper>
    </Wrapper>
  );
};

export default TradingViewChart;
