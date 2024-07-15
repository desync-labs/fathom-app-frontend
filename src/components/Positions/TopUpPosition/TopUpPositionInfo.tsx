import BigNumber from "bignumber.js";
import { Box, Divider, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatPercentage, formatNumber } from "utils/format";
import useTopUpPositionContext from "context/topUpPosition";

import BasePopover from "components/Base/Popover/BasePopover";
import {
  InfoListItem,
  ListTitleWrapper,
} from "components/Positions/OpenPosition/OpenPositionInfo";
import { BaseSummary } from "components/Base/Typography/StyledTypography";
import {
  BaseDialogFormInfoWrapper,
  BaseFormInfoList,
} from "components/Base/Form/StyledForm";

const ListDivider = styled(Divider)`
  margin: 0 0 8px 0;
`;

const TopUpPositionInfo = () => {
  const {
    overCollateral,
    safetyBuffer,
    debtValue,
    pool,
    position,
    liquidationPrice,
    totalCollateral,
    totalFathomToken,
  } = useTopUpPositionContext();

  return (
    <BaseDialogFormInfoWrapper>
      <BaseSummary>Summary</BaseSummary>
      <Divider />
      <BaseFormInfoList>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatNumber(BigNumber(debtValue).toNumber())} FXD{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {formatNumber(BigNumber(totalFathomToken).toNumber())} FXD
              </Box>
            </>
          }
        >
          <ListItemText primary="FXD Borrowed" />
        </InfoListItem>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatPercentage(position.lockedCollateral)} {pool?.poolName}{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                → {formatPercentage(BigNumber(totalCollateral).toNumber())}{" "}
                {pool?.poolName}
              </Box>
            </>
          }
        >
          <ListItemText primary="Collateral Locked" />
        </InfoListItem>
        <InfoListItem
          alignItems={"flex-start"}
          secondaryAction={`${formatNumber(overCollateral)} %`}
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
                      if your collateral value is $100, with 25% LTV, you can
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
          secondaryAction={`$${formatPercentage(
            BigNumber(liquidationPrice).toNumber()
          )}`}
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

export default TopUpPositionInfo;
