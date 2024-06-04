import { Box } from "@mui/material";
import { useEffect } from "react";
import { MarketAssetsListContainer } from "apps/lending/modules/markets/MarketAssetsListContainer";
import { MarketsTopPanel } from "apps/lending/modules/markets/MarketsTopPanel";
import { useRootStore } from "apps/lending/store/root";
import { ContentContainer } from "apps/lending/components/ContentContainer";

export default function Markets() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent("Page Viewed", {
      "Page Name": "Markets",
    });
  }, [trackEvent]);
  return (
    <>
      <MarketsTopPanel />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          mt: { xs: "-32px", lg: "-46px", xl: "-44px", xxl: "-48px" },
        }}
      >
        <ContentContainer>
          <MarketAssetsListContainer />
        </ContentContainer>
      </Box>
    </>
  );
}
