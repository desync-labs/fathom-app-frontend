import { Box, Container } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { MarketAssetsListContainer } from "apps/lending/modules/markets/MarketAssetsListContainer";
import { MarketsTopPanel } from "apps/lending/modules/markets/MarketsTopPanel";
import { useRootStore } from "apps/lending/store/root";

interface MarketContainerProps {
  children: ReactNode;
}

export const marketContainerProps = {
  sx: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    pb: "39px",
    px: {
      xs: 2,
      xsm: 5,
      sm: 12,
      md: 5,
      lg: 0,
      xl: "96px",
      xxl: 0,
    },
    maxWidth: {
      xs: "unset",
      lg: "1240px",
      xl: "unset",
      xxl: "1440px",
    },
  },
};

export const MarketContainer = ({ children }: MarketContainerProps) => {
  return <Container {...marketContainerProps}>{children}</Container>;
};

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
        <MarketContainer>
          <MarketAssetsListContainer />
        </MarketContainer>
      </Box>
    </>
  );
}
