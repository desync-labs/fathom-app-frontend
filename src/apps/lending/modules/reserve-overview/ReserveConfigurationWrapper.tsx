import { Trans } from "@lingui/macro";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ComputedReserveData } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { FC } from "react";

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

import ReserveConfiguration from "apps/lending/modules/reserve-overview/ReserveConfiguration";

export const ReserveConfigurationWrapper: FC<ReserveConfigurationProps> = ({
  reserve,
}) => {
  const { breakpoints } = useTheme();
  const downToXsm = useMediaQuery(breakpoints.down("xsm"));

  return (
    <Paper variant="outlined" sx={{ pt: 4, pb: 20, px: downToXsm ? 4 : 6 }}>
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
        <Typography variant="h3" color={(theme) => theme.palette.primary.main}>
          <Trans>Reserve status &#38; configuration</Trans>
        </Typography>
      </Box>
      <ReserveConfiguration reserve={reserve} />
    </Paper>
  );
};
