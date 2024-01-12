import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { FC, ReactNode } from "react";

import { NetworkConfig } from "apps/lending/ui-config/networksConfig";
import { MarketSwitcher } from "apps/lending/components/MarketSwitcher";

export interface PageTitleProps extends Pick<NetworkConfig, "bridge"> {
  pageTitle?: ReactNode;
  withMarketSwitcher?: boolean;
}

export const PageTitle: FC<PageTitleProps> = ({
  pageTitle,
  withMarketSwitcher,
}) => {
  const theme = useTheme();
  const upToLG = useMediaQuery(theme.breakpoints.up("lg"));
  // const upToMD = useMediaQuery(theme.breakpoints.up('md'));
  const downToXSM = useMediaQuery(theme.breakpoints.down("xsm"));

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", xsm: "center" },
        mb: pageTitle ? 4 : 0,
        flexDirection: { xs: "column", xsm: "row" },
      }}
    >
      {pageTitle && (downToXSM || !withMarketSwitcher) && (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Typography
            variant={downToXSM ? "h2" : upToLG ? "display1" : "h1"}
            sx={{
              color: withMarketSwitcher ? "text.muted" : "text.white",
              mr: { xs: 5, xsm: 3 },
              mb: { xs: 1, xsm: 0 },
            }}
          >
            {pageTitle}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          mb: !pageTitle ? 4 : 0,
        }}
      >
        {withMarketSwitcher && <MarketSwitcher />}
      </Box>
    </Box>
  );
};
