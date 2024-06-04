import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { lendingContainerProps } from "apps/lending/components/ContentContainer";
import { PageTitle } from "apps/lending/components/TopInfoPanel/PageTitle";

import { TopInfoPanel } from "apps/lending/components/TopInfoPanel/TopInfoPanel";

export const HistoryTopPanel = () => {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down("md"));
  const xsm = useMediaQuery(breakpoints.down("xsm"));

  return (
    <TopInfoPanel
      pageTitle={<></>}
      titleComponent={
        <Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h1">Transaction history</Typography>
          </Box>
          <PageTitle withMarketSwitcher={false} />
          <Box sx={{ width: md ? (xsm ? "320px" : "540px") : "860px" }} />
        </Box>
      }
      containerProps={lendingContainerProps}
    />
  );
};
