import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import StyledToggleButton from "apps/lending/components/StyledToggleButton";
import StyledToggleButtonGroup from "apps/lending/components/StyledToggleButtonGroup";
import {
  ComputedReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { AssetCapsProvider } from "apps/lending/hooks/useAssetCaps";
import { ReserveActions } from "apps/lending/modules/reserve-overview/ReserveActions";
import { ReserveConfigurationWrapper } from "apps/lending/modules/reserve-overview/ReserveConfigurationWrapper";
import { ReserveTopDetailsWrapper } from "apps/lending/modules/reserve-overview/ReserveTopDetailsWrapper";
import { useRootStore } from "apps/lending/store/root";

import { ContentContainer } from "apps/lending/components/ContentContainer";
import { useLocation } from "react-router-dom";

export default function ReserveOverview() {
  const location = useLocation();
  const { reserves } = useAppDataContext();
  const underlyingAsset = useMemo(
    () => new URLSearchParams(location.search).get("underlyingAsset"),
    [location.search]
  ) as string;

  const [mode, setMode] = useState<"overview" | "actions" | "">("overview");
  const trackEvent = useRootStore((store) => store.trackEvent);

  const reserve = useMemo(
    () =>
      reserves.find((reserve) => reserve.underlyingAsset === underlyingAsset),
    [reserves]
  ) as ComputedReserveData;

  const [pageEventCalled, setPageEventCalled] = useState(false);

  useEffect(() => {
    if (!pageEventCalled && reserve && reserve.iconSymbol && underlyingAsset) {
      trackEvent("Page Viewed", {
        "Page Name": "Reserve Overview",
        Reserve: reserve.iconSymbol,
        Asset: underlyingAsset,
      });
      setPageEventCalled(true);
    }
  }, [trackEvent, reserve, underlyingAsset, pageEventCalled]);

  const isOverview = useMemo(() => mode === "overview", [mode]);

  return (
    <AssetCapsProvider asset={reserve}>
      <ReserveTopDetailsWrapper underlyingAsset={underlyingAsset} />
      <Box
        sx={{
          mt: { xs: "-32px", lg: "-46px", xl: "-44px", xxl: "-48px" },
        }}
      >
        <ContentContainer>
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              justifyContent: { xs: "center", xsm: "flex-start" },
              mb: { xs: 1.5, xsm: 2 },
            }}
          >
            <StyledToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(_, value) => setMode(value)}
              sx={{ width: { xs: "100%", xsm: "359px" }, height: "44px" }}
            >
              <StyledToggleButton
                value="overview"
                disabled={mode === "overview"}
              >
                <Typography variant="subheader1">Overview</Typography>
              </StyledToggleButton>
              <StyledToggleButton value="actions" disabled={mode === "actions"}>
                <Typography variant="subheader1">Your info</Typography>
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>

          <Box sx={{ display: "flex" }}>
            {/** Main status and configuration panel*/}
            <Box
              sx={{
                display: { xs: !isOverview ? "none" : "block", lg: "block" },
                width: { xs: "100%", lg: "calc(100% - 432px)" },
                mr: { xs: 0, lg: 2 },
              }}
            >
              <ReserveConfigurationWrapper reserve={reserve} />
            </Box>

            {/** Right panel with actions*/}
            <Box
              sx={{
                display: { xs: isOverview ? "none" : "block", lg: "block" },
                width: { xs: "100%", lg: "416px" },
              }}
            >
              <ReserveActions reserve={reserve} />
            </Box>
          </Box>
        </ContentContainer>
      </Box>
    </AssetCapsProvider>
  );
}
