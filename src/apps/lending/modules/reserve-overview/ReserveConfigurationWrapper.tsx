import { Trans } from "@lingui/macro";
import { Box, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";
import { ComputedReserveData } from "src/hooks/app-data-provider/useAppDataProvider";

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

const ReserveConfiguration = dynamic(() =>
  import("./ReserveConfiguration").then((module) => module.ReserveConfiguration)
);

export const ReserveConfigurationWrapper: React.FC<
  ReserveConfigurationProps
> = ({ reserve }) => {
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
