import { Grid, Box, Typography, Divider } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { useStores } from "stores";
import { observer } from "mobx-react";
import { styled } from "@mui/material/styles";

const StatsItem = styled(
  Grid,
  {}
)(({ theme }) => ({
  textAlign: "left",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
}));

const ProtocolStatsContainer = styled(
  Grid,
  {}
)(({ theme }) => ({
  background: "linear-gradient(180deg, #101D32 7.88%, #1A2D47 113.25%)",
  borderRadius: "12px",
  height: "92px",
  marginBottom: '30px'
}));

const StatsTitle = styled(
  Typography,
  {}
)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: "13px",
  lineHeight: "16px",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  fontWeight: "bold",
}));

const StatsDescription = styled(
  Typography,
  {}
)(({ theme }) => ({
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "24px",
  lineHeight: "28px",
  margin: 0,
  padding: 0,
  paddingTop: "7px",
}));

const ProtocolStatsDivider = styled(Divider)(({ theme }) => ({
  position: "absolute",
  right: 0,
  height: "60%",
}));

const ProtocolStats = observer(() => {
  const { chainId } = useWeb3React();
  const rootStore = useStores();
  const { fxdProtocolStatsStore } = rootStore;

  useEffect(() => {
    // Update the document title using the browser API
    if (chainId) {
      setTimeout(() => fxdProtocolStatsStore.fetchProtocolStats());
    }
  }, [fxdProtocolStatsStore, rootStore.alertStore, chainId]);

  return (
    <ProtocolStatsContainer container>
      <StatsItem item xs={3}>
        <Box>
          <StatsTitle variant="subtitle1">Total Supply</StatsTitle>
          <StatsDescription variant="body2">
            {fxdProtocolStatsStore.getFormattedSupply()}
          </StatsDescription>
        </Box>
        <ProtocolStatsDivider orientation="vertical"></ProtocolStatsDivider>
      </StatsItem>
      <StatsItem item xs={3}>
        <Box>
          <StatsTitle variant="subtitle1">TVL</StatsTitle>
          <StatsDescription>
            {fxdProtocolStatsStore.getFormattedTVL()}
          </StatsDescription>
        </Box>
        <ProtocolStatsDivider orientation="vertical"></ProtocolStatsDivider>
      </StatsItem>
      <StatsItem item xs={3}>
        <Box>
          <StatsTitle variant="subtitle1">FXD Price</StatsTitle>
          <StatsDescription>
            {fxdProtocolStatsStore.getFormattedFXDPriceRatio()}
          </StatsDescription>
        </Box>
        <ProtocolStatsDivider orientation="vertical"></ProtocolStatsDivider>
      </StatsItem>
      <StatsItem item xs={3}>
        <Box>
          <StatsTitle variant="subtitle1">Liquidation Ratio</StatsTitle>
          <StatsDescription>
            {fxdProtocolStatsStore.getFormattedLiquidationRatio()}
          </StatsDescription>
        </Box>
      </StatsItem>
    </ProtocolStatsContainer>
  );
});

export default ProtocolStats;
