import { AppList } from "components/AppComponents/AppList/AppList";
import { Divider, Grid, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { formatNumberPrice } from "utils/format";
import useTopUpPositionContext from "context/topUpPosition";

const ListDivider = styled(Divider)`
  margin: 20px 20px 20px 5px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0 20px 0;
  }
`;

const TopUpPositionInfo = () => {
  const {
    pool,
    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdToBeBorrowed,
    fxdAvailableToBorrow,
    debtRatio,
    safetyBuffer,
    liquidationPrice,
  } = useTopUpPositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${collateralToBeLocked.toFixed(2)} ${
            pool.poolName
          }`}
        >
          <ListItemText primary="Collateral to be Locked" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${collateralAvailableToWithdraw.toFixed(2)} ${
            pool.poolName
          }`}
        >
          <ListItemText primary="Estimated Collateral Available to Withdraw" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${fxdToBeBorrowed.toFixed(2)} FXD`}
        >
          <ListItemText primary="FXD to be Borrowed" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${fxdAvailableToBorrow.toFixed(2)} FXD`}
        >
          <ListItemText primary="FXD Available to Borrow" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${debtRatio.toFixed(2)} %`}
        >
          <ListItemText primary="LTV" />
        </ListItem>
        <ListItem
          alignItems="flex-start"
          secondaryAction={`${(safetyBuffer * 100).toFixed(2)} %`}
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
        <ListItem alignItems="flex-start" secondaryAction={`0.22%`}>
          <ListItemText primary={`Fathom Rewards APR`} />
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

export default TopUpPositionInfo;
