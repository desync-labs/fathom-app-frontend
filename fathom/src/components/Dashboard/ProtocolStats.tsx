import React from "react";
import {
  Grid,
  Box,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useProtocolStats from "hooks/useProtocolStats";
import {
  formatCurrency,
  formatNumber
} from "utils/format";
import usePricesContext from "context/prices";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";

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
  lineHeight: "19px",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  fontWeight: "bold",
  display: "flex",
  justifyContent: "center",
  gap: "7px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "left",
  }
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
  const { tvl, loading, totalBorrowed } = useProtocolStats();
  const { fxdPrice } = usePricesContext();

  return (
    <ProtocolStatsContainer container>
      <StatsItem item>
        <Box>
          <StatsTitle>
            Total Issued
            <AppPopover id={"total-issued"}
                        text={"The total amount of FXD has been issued through borrowing from protocol and is currently in circulation."} />
          </StatsTitle>
          <StatsDescription variant="body2">
            {!loading && formatNumber(totalBorrowed) + " FXD"}
          </StatsDescription>
        </Box>
      </StatsItem>
      <StatsItem item>
        <Box>
          <StatsTitle>
            TVL
            <AppPopover id={"tvl"}
                        text={"TVL, or Total Value Locked, signifies the total amount of assets currently deposited in the platform and used to borrow FXD."} />
          </StatsTitle>
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
