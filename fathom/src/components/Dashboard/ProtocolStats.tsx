import { Grid, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import useProtocolStats from "hooks/useProtocolStats";
import { formatCurrency, formatNumber } from "utils/format";
import usePricesContext from "context/prices";

const StatsItem = styled(Grid)`
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: calc(33.33% - 8px);
  background: #131f35;
  border-radius: 8px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    width: 100%;
    padding: 16px 20px;
    justify-content: start;
  }
`;

const ProtocolStatsContainer = styled(Grid)`
  height: 92px;
  margin-bottom: 30px;
  display: flex;
  gap: 8px;
  height: 100%;
`;

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

const StatsDescription = styled(Typography)`
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 28px;
  margin: 0;
  padding: 0;
  padding-top: 7px;
`;

const ProtocolStats = () => {
  const { totalSupply, tvl, loading } = useProtocolStats();
  const { fxdPrice } = usePricesContext();

  return (
    <ProtocolStatsContainer container>
      <StatsItem item>
        <Box>
          <StatsTitle>Total Supply</StatsTitle>
          <StatsDescription variant="body2">
            {!loading && formatNumber(totalSupply)}
          </StatsDescription>
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>TVL</StatsTitle>
          <StatsDescription>{!loading && formatCurrency(tvl)}</StatsDescription>
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>FXD Price</StatsTitle>
          <StatsDescription>
            {formatCurrency(fxdPrice / 10 ** 18)}
          </StatsDescription>
        </Box>
      </StatsItem>
    </ProtocolStatsContainer>
  );
};

export default ProtocolStats;
