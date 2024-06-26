import { useEffect } from "react";
import { Box } from "@mui/material";
import { ContentContainer } from "apps/lending/components/ContentContainer";
import { HistoryTopPanel } from "apps/lending/modules/history/HistoryTopPanel";
import HistoryWrapper from "apps/lending/modules/history/HistoryWrapper";
import { useRootStore } from "apps/lending/store/root";

export default function History() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent("Page Viewed", {
      "Page Name": "History",
    });
  }, [trackEvent]);

  return (
    <>
      <HistoryTopPanel />
      <Box
        sx={{
          mt: { xs: "-32px", lg: "-46px", xl: "-44px", xxl: "-48px" },
        }}
      >
        <ContentContainer>
          <HistoryWrapper />
        </ContentContainer>
      </Box>
    </>
  );
}
