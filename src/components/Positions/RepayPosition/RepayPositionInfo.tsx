import { Box, Grid, ListItemText } from "@mui/material";
import BigNumber from "bignumber.js";

import useClosePositionContext from "context/repayPosition";
import { AppList, AppListItem } from "components/AppComponents/AppList/AppList";

import { formatNumber, formatNumberPrice } from "utils/format";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import { ListTitleWrapper } from "components/Positions/OpenPosition/OpenPositionInfo";

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
          <ListItemText
            primary={
              <ListTitleWrapper>
                Collateralization Ratio
                <AppPopover
                  id={"collateralization-ratio"}
                  text={
                    <>
                      Collateralization Ratio is the percentage of the total
                      value of your Collateral compared to the amount you've
                      borrowed. A higher ratio indicates a larger safety buffer,
                      reducing liquidation risk. If this ratio falls below the
                      minimum required level due to market fluctuations, your
                      Collateral could be liquidated to repay the loan.
                    </>
                  }
                />
              </ListTitleWrapper>
            }
          />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`1 ${pool.poolName} = ${formatNumberPrice(
            liquidationPrice
          )} FXD`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Liquidation Price of {pool.poolName}
                <AppPopover
                  id={"liquidation-price"}
                  text={
                    <>
                      Liquidation Price of XDC - Liquidation Price is the price
                      of the collateral token when your Collateral will be
                      automatically sold to partially or fully repay the loan if
                      your collateral value drops. It's a safety mechanism to
                      ensure that loans are always sufficiently collateralized.
                      Monitoring this price helps prevent the unwanted
                      liquidation of your assets.
                    </>
                  }
                />
              </ListTitleWrapper>
            }
          />
        </AppListItem>
      </AppList>
    </Grid>
  );
};

export default RepayPositionInfo;
