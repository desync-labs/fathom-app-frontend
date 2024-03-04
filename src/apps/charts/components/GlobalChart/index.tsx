import { useState, useMemo, useEffect, useRef, FC, memo } from "react";
import { ResponsiveContainer } from "recharts";
import { useMediaQuery } from "@mui/material";

import useSharedContext from "context/shared";
import { getTimeframe } from "apps/charts/utils";
import { TYPE } from "apps/charts/Theme";
import { timeframeOptions } from "apps/charts/constants";
import {
  useGlobalChartData,
  useGlobalData,
} from "apps/charts/contexts/GlobalData";
import DropdownSelect from "apps/charts/components/DropdownSelect";
import TradingViewChart, {
  CHART_TYPES,
} from "apps/charts/components/TradingviewChart";
import { RowFixed } from "apps/charts/components/Row";
import { OptionButton } from "apps/charts/components/ButtonStyled";

const CHART_VIEW = {
  VOLUME: "Volume",
  LIQUIDITY: "Liquidity",
};

const VOLUME_WINDOW = {
  WEEKLY: "WEEKLY",
  DAYS: "DAYS",
};
const GlobalChart: FC<{ display: any }> = (props) => {
  const { display } = props;
  // chart options
  const [chartView, setChartView] = useState(
    display === "volume" ? CHART_VIEW.VOLUME : CHART_VIEW.LIQUIDITY
  );
  const { isMobile } = useSharedContext();

  // time window and window size for chart
  const timeWindow = timeframeOptions.ALL_TIME;
  const [volumeWindow, setVolumeWindow] = useState(VOLUME_WINDOW.DAYS);

  // global historical data
  const [dailyData, weeklyData] = useGlobalChartData();
  const {
    totalLiquidityUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    liquidityChangeUSD,
    oneWeekVolume,
    weeklyVolumeChange,
  } = useGlobalData();

  // based on window, get starttim
  const utcStartTime = getTimeframe(timeWindow);

  const chartDataFiltered = useMemo(() => {
    const currentData =
      volumeWindow === VOLUME_WINDOW.DAYS ? dailyData : weeklyData;
    return (
      currentData &&
      Object.keys(currentData)
        ?.map((key) => {
          const item = currentData[key];
          if (item.date > utcStartTime) {
            return item;
          } else {
            return true;
          }
        })
        .filter((item) => {
          return !!item;
        })
    );
  }, [dailyData, utcStartTime, volumeWindow, weeklyData]);
  const below800 = useMediaQuery("(max-width: 800px)");

  // update the width on a window resize
  const ref = useRef<HTMLDivElement>(null);
  const isClient = typeof window === "object";
  const [width, setWidth] = useState(ref?.current?.clientWidth);
  useEffect(() => {
    if (!isClient) {
      return;
    }
    const handleResize = () => {
      setWidth(ref?.current?.clientWidth ?? width);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient, width]); // Empty array ensures that effect is only run on mount and unmount

  return chartDataFiltered ? (
    <>
      {below800 && (
        <DropdownSelect
          options={CHART_VIEW}
          active={chartView}
          setActive={setChartView}
          color={"#5a81ff"}
          shadow={"0 0 8px #003cff"}
        />
      )}

      {chartDataFiltered && chartView === CHART_VIEW.LIQUIDITY && (
        <ResponsiveContainer aspect={60 / 28} ref={ref}>
          <TradingViewChart
            data={dailyData}
            base={totalLiquidityUSD}
            baseChange={liquidityChangeUSD}
            title={isMobile ? "" : "Liquidity"}
            field="totalLiquidityUSD"
            width={width}
            type={CHART_TYPES.AREA}
            below800={below800}
          />
        </ResponsiveContainer>
      )}
      {chartDataFiltered && chartView === CHART_VIEW.VOLUME && (
        <ResponsiveContainer aspect={60 / 28}>
          <TradingViewChart
            data={chartDataFiltered}
            base={
              volumeWindow === VOLUME_WINDOW.WEEKLY
                ? oneWeekVolume
                : oneDayVolumeUSD
            }
            baseChange={
              volumeWindow === VOLUME_WINDOW.WEEKLY
                ? weeklyVolumeChange
                : volumeChangeUSD
            }
            title={
              isMobile
                ? ""
                : volumeWindow === VOLUME_WINDOW.WEEKLY
                ? "Volume (7d)"
                : "Volume"
            }
            field={
              volumeWindow === VOLUME_WINDOW.WEEKLY
                ? "weeklyVolumeUSD"
                : "dailyVolumeUSD"
            }
            width={width}
            type={CHART_TYPES.BAR}
            useWeekly={volumeWindow === VOLUME_WINDOW.WEEKLY}
            below800={below800}
          />
        </ResponsiveContainer>
      )}
      {display === "volume" && (
        <RowFixed
          style={{
            top: "-42px",
            position: "absolute",
            right: "32px",
            zIndex: 10,
          }}
        >
          <OptionButton
            active={volumeWindow === VOLUME_WINDOW.DAYS}
            onClick={() => setVolumeWindow(VOLUME_WINDOW.DAYS)}
          >
            <TYPE.body>D</TYPE.body>
          </OptionButton>
          <OptionButton
            style={{ marginLeft: "4px" }}
            active={volumeWindow === VOLUME_WINDOW.WEEKLY}
            onClick={() => setVolumeWindow(VOLUME_WINDOW.WEEKLY)}
          >
            <TYPE.body>W</TYPE.body>
          </OptionButton>
        </RowFixed>
      )}
    </>
  ) : null;
};

export default memo(GlobalChart);
