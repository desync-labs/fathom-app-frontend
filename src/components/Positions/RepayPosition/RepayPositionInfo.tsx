import { Box, Grid, ListItemText } from "@mui/material";
import BigNumber from "bignumber.js";

import useClosePositionContext from "context/repayPosition";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

import { formatNumber, formatNumberPrice } from "utils/format";

const RepayPositionInfo = () => {
  const {
    lockedCollateral,
    price,
    fathomToken,
    pool,
    collateral,
    liquidationPrice,
    overCollateral,
  } = useClosePositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList sx={{ width: "100%" }}>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {BigNumber(lockedCollateral).multipliedBy(price).toFixed(6)} FXD{" "}
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
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {BigNumber(lockedCollateral).toFixed(6)} {pool.poolName}{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {BigNumber(lockedCollateral)
                  .minus(BigNumber(collateral))
                  .toFixed(6)}{" "}
                {pool.poolName}
              </Box>
            </>
          }
        >
          <ListItemText primary="Collateral Locked" />
        </AppListItem>
        <AppListItem
          alignItems={"flex-start"}
          secondaryAction={`${formatNumber(overCollateral)} %`}
        >
          <ListItemText primary="Collateralization Ratio" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`1 ${pool.poolName} = ${formatNumberPrice(
            liquidationPrice
          )} FXD`}
        >
          <ListItemText primary="Liquidation Price" />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default RepayPositionInfo;
