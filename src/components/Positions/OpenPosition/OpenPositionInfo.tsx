import BigNumber from "bignumber.js";
import { Divider, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";

import useOpenPositionContext from "context/openPosition";
import { formatNumber, formatPercentage } from "utils/format";

import { BaseSummary } from "components/Base/Typography/StyledTypography";
import BasePopover from "components/Base/Popover/BasePopover";
import { BaseListItem } from "components/Base/List/StyledList";
import {
  BaseDialogFormInfoWrapper,
  BaseFormInfoList,
} from "components/Base/Form/StyledForm";

const ListDivider = styled(Divider)`
  margin: 4px 0 8px 0;
`;

export const InfoListItem = styled(BaseListItem)`
  & .MuiListItemText-root {
    margin-top: 1px;
    margin-bottom: 1px;
  }

  ${({ theme }) => theme.breakpoints.down("sm")} {
    & .MuiListItemText-root {
      margin-top: 2px;
      margin-bottom: 2px;

      & span {
        font-size: 11px;
      }
    }

    & .MuiListItemSecondaryAction-root {
      font-size: 11px;

      & span {
        font-size: 11px;
      }
    }
  }
`;

export const ListTitleWrapper = styled("div")`
  display: flex;
  gap: 8px;
  align-items: center;
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
    <BaseDialogFormInfoWrapper>
      <BaseSummary>Summary</BaseSummary>
      <Divider />
      <BaseFormInfoList>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(Number(collateralToBeLocked))} ${
            pool.poolName
          }`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Collateral to be Locked
                <BasePopover
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
        </InfoListItem>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={`${formatNumber(
            Number(collateralAvailableToWithdraw)
          )} ${pool.poolName}`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Safety Buffer
                <BasePopover
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
        </InfoListItem>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(Number(fxdToBeBorrowed))} FXD`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Max FXD can be Borrowed
                <BasePopover
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
        </InfoListItem>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(
            Number(fxdAvailableToBorrow)
          )} FXD`}
        >
          <ListItemText primary="Safety Buffer (FXD)" />
        </InfoListItem>
        <InfoListItem
          alignItems={"flex-start"}
          secondaryAction={`${formatNumber(Number(overCollateral))} %`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Collateralization Ratio
                <BasePopover
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
        </InfoListItem>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={`${formatPercentage(
            BigNumber(safetyBuffer).multipliedBy(100).toNumber()
          )} %`}
        >
          <ListItemText primary="Safety Buffer (%)" />
        </InfoListItem>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={`$${formatPercentage(Number(liquidationPrice))}`}
        >
          <ListItemText
            primary={
              <ListTitleWrapper>
                Liquidation Price of {pool?.poolName}
                <BasePopover
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
        </InfoListItem>
        <ListDivider />
        <InfoListItem alignItems="flex-start" secondaryAction={`2%`}>
          <ListItemText
            primary={
              <ListTitleWrapper>
                Stability Fee
                <BasePopover
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
        </InfoListItem>
      </BaseFormInfoList>
    </BaseDialogFormInfoWrapper>
  );
};

export default OpenPositionInfo;
