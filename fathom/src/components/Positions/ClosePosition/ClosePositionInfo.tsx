import { AppList } from "components/AppComponents/AppList/AppList";
import { Box, Grid, ListItem, ListItemText } from "@mui/material";
import React from "react";
import useClosePositionContext from "context/closePosition";
import BigNumber from "bignumber.js";

const ClosePositionInfo = () => {
  const { lockedCollateral, price, fathomToken, pool, position, collateral } =
    useClosePositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList sx={{ width: "100%" }}>
        <ListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {BigNumber(lockedCollateral)
                .multipliedBy(price)
                .toFixed(6)}{" "}
              FXD{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {BigNumber(lockedCollateral)
                  .multipliedBy(price)
                  .minus(fathomToken)
                  .toFixed(6)}{" "}
                FXD
              </Box>
            </>
          }
        >
          <ListItemText primary="FXD Borrowed" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {BigNumber(lockedCollateral).toFixed(6)} {pool.poolName}{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → { BigNumber(lockedCollateral).minus( BigNumber(collateral) ).toFixed(6)}{" "}
                {pool.poolName}
              </Box>
            </>
          }
        >
          <ListItemText primary="Collateral Locked" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${Number(position.tvl) / 10}%`}
        >
          <ListItemText primary="LTV (Loan-to-Value)" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`1 FXD = ${1 / price} ${pool.poolName}`}
        >
          <ListItemText primary="Liquidation Price" />
        </ListItem>
      </AppList>
    </Grid>
  );
};

export default ClosePositionInfo;
