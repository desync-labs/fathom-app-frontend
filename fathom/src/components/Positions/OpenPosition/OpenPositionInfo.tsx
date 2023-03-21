import React from "react";
import { Divider, Grid, ListItem, ListItemText } from "@mui/material";

import { AppList } from "components/AppComponents/AppList/AppList";

import useOpenPositionContext from "context/openPosition";
import { styled } from "@mui/material/styles";
import { formatNumber, formatNumberPrice, formatPercentage } from "utils/format";
import BigNumber from "bignumber.js";

const ListDivider = styled(Divider)`
  margin: 20px 20px 20px 5px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0 20px 0;
  }
`;

const OpenPositionInfo = () => {
  const {
    pool,
    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdToBeBorrowed,
    fxdAvailableToBorrow,
    debtRatio,
    safetyBuffer,
    liquidationPrice,
  } = useOpenPositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(collateralToBeLocked)} ${
            pool.poolName
          }`}
        >
          <ListItemText primary="Collateral to be Locked" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(collateralAvailableToWithdraw)} ${
            pool.poolName
          }`}
        >
          <ListItemText primary="Estimated Collateral Available to Withdraw" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(fxdToBeBorrowed)} FXD`}
        >
          <ListItemText primary="FXD to be Borrowed" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(fxdAvailableToBorrow)} FXD`}
        >
          <ListItemText primary="FXD Available to Borrow" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(debtRatio)} %`}
        >
          <ListItemText primary="LTV" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${BigNumber(safetyBuffer)
            .multipliedBy(100)
            .toFixed(2)} %`}
        >
          <ListItemText primary="Safety Buffer" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`$${formatNumberPrice(liquidationPrice)}`}
        >
          <ListItemText primary={`Liquidation Price of ${pool.poolName}`} />
        </ListItem>
        <ListDivider />
        <ListItem alignItems="flex-start" secondaryAction={`1.73%`}>
          <ListItemText primary={`Lending APR`} />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${pool.stabilityFeeRate}%`}
        >
          <ListItemText primary={`Stability Fee`} />
        </ListItem>
        <ListItem alignItems="flex-start" secondaryAction={`1.96%`}>
          <ListItemText primary={`Total APR`} />
        </ListItem>
        <ListItem alignItems="flex-start" secondaryAction={`1.98%`}>
          <ListItemText primary={`Total APY`} />
        </ListItem>
      </AppList>
    </Grid>
  );
};

export default OpenPositionInfo;
