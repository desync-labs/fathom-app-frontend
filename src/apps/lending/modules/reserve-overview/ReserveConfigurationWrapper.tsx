import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { FC, memo } from "react";

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

import ReserveConfiguration from "apps/lending/modules/reserve-overview/ReserveConfiguration";

export const ReserveConfigurationWrapper: FC<ReserveConfigurationProps> = memo(
  ({ reserve }) => {
    const { breakpoints } = useTheme();
    const downToXsm = useMediaQuery(breakpoints.down("xsm"));

    return (
      <Paper variant="outlined" sx={{ pt: 2, pb: 10, px: downToXsm ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            mb:
              reserve.isFrozen ||
              reserve.symbol == "AMPL" ||
              reserve.symbol === "stETH"
                ? "0px"
                : "36px",
          }}
        >
          <Typography variant="h3">
            Reserve status &#38; configuration
          </Typography>
        </Box>
        <ReserveConfiguration reserve={reserve} />
      </Paper>
    );
  }
);
