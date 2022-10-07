import { Box, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import logo from "../../assets/images/fxd-logo.png";
import { useStores } from "../../stores";
import { AppPaper } from "../AppPaper/AppPaper";

const StatsStyles = {
  boxShadow: 2,
  width: "15rem",
  height: "5rem",
  background: "linear-gradient(180deg, #071126 0%, #050C1A 100%)",
  p: 1.5,
  m: 1,
  borderRadius: 2,
  textAlign: "center",
}

const ProtocolStats = function ProtocolStats(props: any) {
  const { chainId } = useWeb3React();
  const rootStore = useStores();
  const { fxdProtocolStatsStore } = rootStore;

  useEffect(() => {
    // Update the document title using the browser API
    if (chainId) {
      setTimeout(() => fxdProtocolStatsStore.fetchProtocolStats());
    }
  }, [
    fxdProtocolStatsStore,
    rootStore.alertStore,
    chainId
  ]);

  return (
    <AppPaper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 360,
      }}
    >
      <img
        src={logo}
        alt="Fathom Stablecoin"
        height="40"
        width="80"
        color="black"
      ></img>
      <Typography variant="subtitle1" gutterBottom>
        The reliable stablecoin that earns you extra passive income
      </Typography>
      <Typography variant="body2" gutterBottom>
        FXD is an auto-farming stablecoin that earns passive yields for you in
        the background. Now, instead of paying for loans,you can get loans while
        earning on your collateral.
      </Typography>
      <Grid container>
        <Box
          sx={StatsStyles}
        >
          <Typography variant="subtitle1" color="text.secondary">
            Total Supply
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {fxdProtocolStatsStore.commarize(
              fxdProtocolStatsStore.protocolStats.fathomSupplyCap
            )}
          </Typography>
        </Box>
        <Box
          sx={StatsStyles}
        >
          <Typography variant="subtitle1" color="text.secondary">
            TVL
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {fxdProtocolStatsStore.getFormattedTVL()}
          </Typography>
        </Box>
        <Box
          sx={StatsStyles}
        >
          <Typography variant="subtitle1" color="text.secondary">
            FXD Price
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {fxdProtocolStatsStore.getFormattedFXDPriceRatio()}
          </Typography>
        </Box>
        <Box
          sx={StatsStyles}
        >
          <Typography variant="subtitle1" color="text.secondary">
            Liq. Ratio
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {fxdProtocolStatsStore.getFormattedLiquidationRatio()}
          </Typography>
        </Box>
      </Grid>
    </AppPaper>
  );
};

export default ProtocolStats;
