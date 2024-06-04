import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ParentSize } from "@visx/responsive";
import { FC, useState } from "react";
import type { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import {
  ReserveRateTimeRange,
  useReserveRatesHistory,
} from "apps/lending/hooks/useReservesHistory";
import { MarketDataType } from "apps/lending/utils/marketsAndNetworksConfig";

import { ESupportedTimeRanges } from "apps/lending/modules/reserve-overview/TimeRangeSelector";
import { ApyGraph } from "apps/lending/modules/reserve-overview/graphs/ApyGraph";
import { GraphLegend } from "apps/lending/modules/reserve-overview/graphs/GraphLegend";
import { GraphTimeRangeSelector } from "apps/lending/modules/reserve-overview/graphs/GraphTimeRangeSelector";

type Field = "liquidityRate" | "stableBorrowRate" | "variableBorrowRate";

type Fields = { name: Field; color: string; text: string }[];

type ApyGraphContainerKey = "supply" | "borrow";

type ApyGraphContainerProps = {
  graphKey: ApyGraphContainerKey;
  reserve: ComputedReserveData;
  currentMarketData: MarketDataType;
};

/**
 * NOTES:
 * This may not be named accurately.
 * This container uses the same graph but with different fields, so we use a 'graphKey' to determine which to show
 * This likely may need to be turned into two different container components if the graphs become wildly different.
 * This graph gets its data via an external API call, thus having loading/error states
 */
export const ApyGraphContainer: FC<ApyGraphContainerProps> = ({
  graphKey,
  reserve,
  currentMarketData,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] =
    useState<ReserveRateTimeRange>(ESupportedTimeRanges.OneMonth);

  const CHART_HEIGHT = 155;
  const CHART_HEIGHT_LOADING_FIX = 3.5;
  const reserveAddress = reserve
    ? `${reserve.underlyingAsset}${currentMarketData.addresses.LENDING_POOL_ADDRESS_PROVIDER}`
    : "";
  const { data, loading, error, refetch } = useReserveRatesHistory(
    reserveAddress,
    selectedTimeRange
  );

  // Supply fields
  const supplyFields: Fields = [
    { name: "liquidityRate", color: "#2EBAC6", text: "Supply APR" },
  ];

  // Borrow fields
  const borrowFields: Fields = [
    ...(reserve.stableBorrowRateEnabled
      ? ([
          {
            name: "stableBorrowRate",
            color: "#E7C6DF",
            text: "Borrow APR, stable",
          },
        ] as const)
      : []),
    {
      name: "variableBorrowRate",
      color: "#5a81ff",
      text: "Borrow APR, variable",
    },
  ];

  const fields = graphKey === "supply" ? supplyFields : borrowFields;

  const graphLoading = (
    <Box
      sx={{
        height: CHART_HEIGHT + CHART_HEIGHT_LOADING_FIX,
        width: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={20} sx={{ mb: 1, opacity: 0.5 }} />
      <Typography variant="subheader1" color="text.muted">
        Loading data...
      </Typography>
    </Box>
  );

  const graphError = (
    <Box
      sx={{
        height: CHART_HEIGHT + CHART_HEIGHT_LOADING_FIX,
        width: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="subheader1">Something went wrong</Typography>
      <Typography variant="caption" sx={{ mb: 1.5 }}>
        Data couldn&apos;t be fetched, please reload graph.
      </Typography>
      <Button variant="outlined" color="primary" onClick={refetch}>
        Reload
      </Button>
    </Box>
  );

  return (
    <Box sx={{ mt: 5, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <GraphLegend labels={fields} />
        <GraphTimeRangeSelector
          disabled={loading || error}
          timeRange={selectedTimeRange}
          onTimeRangeChanged={setSelectedTimeRange}
        />
      </Box>
      {loading && graphLoading}
      {error && graphError}
      {!loading && !error && data.length > 0 && (
        <ParentSize>
          {({ width }) => (
            <ApyGraph
              width={width}
              height={CHART_HEIGHT}
              data={data}
              fields={fields}
              selectedTimeRange={selectedTimeRange}
            />
          )}
        </ParentSize>
      )}
    </Box>
  );
};
