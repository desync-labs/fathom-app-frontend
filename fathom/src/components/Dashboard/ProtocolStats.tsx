import { Grid, Box, Typography } from "@mui/material";
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
  width: "calc(33.33% - 8px)",
  background: '#131F35',
  borderRadius: '8px',
}));

const ProtocolStatsContainer = styled(
  Grid,
  {}
)(({ theme }) => ({
  height: "92px",
  marginBottom: '30px',
  display: 'flex',
  gap: '8px'
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

const ProtocolStats = observer(() => {
  const { chainId } = useWeb3React();
  const rootStore = useStores();
  const { fxdProtocolStatsStore } = rootStore;

  useEffect(() => {
    // Update the document title using the browser API
    if (chainId) {
      setTimeout(() => fxdProtocolStatsStore.fetchProtocolStats());
    } else {
      fxdProtocolStatsStore.setDefaultStats();
    }
  }, [fxdProtocolStatsStore, rootStore.alertStore, chainId]);

  return (
    <ProtocolStatsContainer container>
      <StatsItem item>
        <Box>
          <StatsTitle>Total Supply</StatsTitle>
          <StatsDescription variant="body2">
            {fxdProtocolStatsStore.getFormattedSupply()}
          </StatsDescription>
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>TVL</StatsTitle>
          <StatsDescription>
            {fxdProtocolStatsStore.getFormattedTVL()}
          </StatsDescription>
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>FXD Price</StatsTitle>
          <StatsDescription>
            {fxdProtocolStatsStore.getFormattedFXDPriceRatio()}
          </StatsDescription>
        </Box>
      </StatsItem>
    </ProtocolStatsContainer>
  );
});

export default ProtocolStats;
