import React from "react";
import BigNumber from "bignumber.js";
import { Box, Divider, Grid, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AppList,
  AppListItem
} from "components/AppComponents/AppList/AppList";
import { formatNumberPrice, formatPercentage, formatNumber } from "utils/format";
import useTopUpPositionContext from "context/topUpPosition";

const ListDivider = styled(Divider)`
  margin: 20px 20px 20px 5px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0 20px 0;
  }
`;

const TopUpPositionInfo = () => {
  const {
    ltv,
    safetyBuffer,
    debtValue,
    pool,
    position,
    liquidationPrice,
    totalCollateral,
    totalFathomToken,
  } = useTopUpPositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {BigNumber(debtValue).toFixed(6)} FXD{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {BigNumber(totalFathomToken).toFixed(6)} FXD
              </Box>
            </>
          }
        >
          <ListItemText primary="FXD Borrowed" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatPercentage(
                BigNumber(position.lockedCollateral).toNumber()
              )}{" "}
              {pool.poolName}{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {formatPercentage(BigNumber(totalCollateral).toNumber())}{" "}
                {pool.poolName}
              </Box>
            </>
          }
        >
          <ListItemText primary="Collateral Locked" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(
            BigNumber(ltv).multipliedBy(100).toNumber()
          )} %`}
        >
          <ListItemText primary="LTV" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(safetyBuffer * 100)} %`}
        >
          <ListItemText primary="Safety Buffer" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`$${formatNumberPrice(liquidationPrice)}`}
        >
          <ListItemText primary={`Liquidation Price of ${pool.poolName}`} />
        </AppListItem>
        <ListDivider />
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`2%`}
        >
          <ListItemText primary={`Stability Fee`} />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default TopUpPositionInfo;
