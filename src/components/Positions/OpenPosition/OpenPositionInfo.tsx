import { Divider, Grid, ListItemText } from "@mui/material";

import { AppListItem } from "components/AppComponents/AppList/AppList";
import { AppList } from "components/AppComponents/AppList/AppList";

import useOpenPositionContext from "context/openPosition";
import { styled } from "@mui/material/styles";
import { formatNumber, formatPercentage } from "utils/format";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";
import BigNumber from "bignumber.js";

const ListDivider = styled(Divider)`
  margin: 20px 20px 20px 5px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    margin: 20px 0 20px 0;
  }
`;

export const ListTitleWrapper = styled("div")`
  display: flex;
  gap: 7px;
`;

const OpenPositionInfo = () => {
  const {
    pool,
    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdToBeBorrowed,
    fxdAvailableToBorrow,
    overCollateral,
    safetyBuffer,
    liquidationPrice,
  } = useOpenPositionContext();

  return (
    <Grid item xs={12} sm={6}>
      <AppList>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(Number(collateralToBeLocked))} ${
            pool.poolName
          }`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Collateral to be Locked
                <AppPopover
                  id={"collateral-locked"}
                  text={
                    <>
                      Collateral to be Locked - the amount of Collateral to be
                      used to borrow FXD.
                    </>
                  }
                />
              </ListTitleWrapper>
            }
          />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(
            Number(collateralAvailableToWithdraw)
          )} ${pool.poolName}`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Safety Buffer
                <AppPopover
                  id={"safety-buffer"}
                  text={
                    <>
                      Safety Buffer represents the extra collateral value above
                      your borrowed amount. This is maintained to protect
                      against market volatility and prevent the automatic
                      liquidation of your assets. The larger your safety buffer,
                      the lower your risk of reaching the liquidation price.{" "}
                      <br />
                      <br />
                      Safety buffer is calculated from LTV. When you multiply
                      your collateral value with LTV - you will get how much you
                      can borrow maximum with a 0% safety buffer. For example,
                      if your collateral value is $100, with 75% LTV, you can
                      maximum borrow 75 FXD, which gives you 0% Safety Buffer,
                      and your position becomes very risky for liquidation.{" "}
                      <br />
                      <br />
                      We recommend at least 50% Safety Buffer. Using the example
                      above, the recommended amount to borrow is 75 FXD * 50% =
                      37.5 FXD.
                    </>
                  }
                />
              </ListTitleWrapper>
            }
          />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(Number(fxdToBeBorrowed))} FXD`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Max FXD can be Borrowed
                <AppPopover
                  id={"max-fxd-borrowed"}
                  text={
                    <>
                      Max FXD can be Borrowed - how many FXD you can borrow
                      providing Collateral with 0% Safety Buffer.
                    </>
                  }
                />
              </ListTitleWrapper>
            }
          />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(
            Number(fxdAvailableToBorrow)
          )} FXD`}
        >
          <ListItemText primary="Safety Buffer (FXD)" />
        </AppListItem>
        <AppListItem
          alignItems={"flex-start"}
          secondaryAction={`${formatNumber(Number(overCollateral))} %`}
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
          secondaryAction={`${formatPercentage(
            BigNumber(safetyBuffer).multipliedBy(100).toNumber()
          )} %`}
        >
          <ListItemText primary="Safety Buffer (%)" />
        </AppListItem>
        <AppListItem
          alignItems="flex-start"
          secondaryAction={`$${formatPercentage(Number(liquidationPrice))}`}
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
        <ListDivider />
        <AppListItem alignItems="flex-start" secondaryAction={`2%`}>
          <ListItemText
            primary={
              <ListTitleWrapper>
                Stability Fee
                <AppPopover
                  id={"stability-fee"}
                  text={
                    <>
                      Stability Fee - yearly interest paid when a position is
                      closed. This fee is used to cover bad debt for
                      liquidators, and any remaining part of the stability fee
                      may be considered Fathom Protocol revenue.
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

export default OpenPositionInfo;
