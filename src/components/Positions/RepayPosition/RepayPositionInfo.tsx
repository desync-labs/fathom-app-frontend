import { Box, Divider, ListItemText } from "@mui/material";
import BigNumber from "bignumber.js";

import useClosePositionContext from "context/repayPosition";
import { formatNumber, formatNumberPrice } from "utils/format";

import BasePopover from "components/Base/Popover/BasePopover";
import { BaseSummary } from "components/Base/Typography/StyledTypography";
import {
  InfoListItem,
  ListTitleWrapper,
} from "components/Positions/OpenPosition/OpenPositionInfo";
import {
  BaseDialogFormInfoWrapper,
  BaseFormInfoList,
} from "components/Base/Form/StyledForm";

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
    <BaseDialogFormInfoWrapper>
      <BaseSummary>Summary</BaseSummary>
      <Divider />
      <BaseFormInfoList>
        <InfoListItem
          alignItems="flex-start"
          secondaryAction={
            <>
              {formatNumber(
                BigNumber(lockedCollateral).multipliedBy(price).toNumber()
              )}{" "}
              FXD{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {formatNumber(
                  BigNumber(lockedCollateral)
                    .multipliedBy(price)
                    .minus(fathomToken)
                    .toNumber()
                )}{" "}
                FXD
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
              {formatNumber(BigNumber(lockedCollateral).toNumber())}{" "}
              {pool?.poolName}{" "}
              <Box component="span" sx={{ color: "#29C20A" }}>
                →{" "}
                {formatNumber(
                  BigNumber(lockedCollateral)
                    .minus(BigNumber(collateral))
                    .toNumber()
                )}{" "}
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
          secondaryAction={`1 ${pool?.poolName} = ${formatNumberPrice(
            liquidationPrice
          )} FXD`}
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
      </BaseFormInfoList>
    </BaseDialogFormInfoWrapper>
  );
};

export default RepayPositionInfo;
