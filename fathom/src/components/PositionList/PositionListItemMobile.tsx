import React, { FC } from "react";
import { PositionListItemProps } from "components/PositionList/PositionListItem";
import { getTokenLogoURL } from "utils/tokenLogo";
import {
  PoolName,
  TVL
} from "components/AppComponents/AppBox/AppBox";
import {
  formatCurrency,
  formatNumber,
  formatNumberPrice,
  formatPercentage
} from "utils/format";
import { styled } from "@mui/material/styles";
import {
  Box,
  CircularProgress
} from "@mui/material";
import {
  ButtonPrimary,
  ManagePositionButton
} from "components/AppComponents/AppButton/AppButton";
import AppPopover from "components/AppComponents/AppPopover/AppPopover";

const PositionListItemMobileContainer = styled(Box)`
  width: 100%;
  background: #131f35;
  border-bottom: 1px solid #131f35;
  border-radius: 8px;
  padding: 20px 16px;
  margin-bottom: 5px;
`;

const ListItemWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ListLabel = styled(Box)`
  color: #6379a1;
  font-weight: 600;
  font-size: 11px;
  line-height: 16px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: start;
`;

const ListLabelWithPopover = styled(ListLabel)`
  gap: 7px;
`;

const ListValue = styled(Box)`
  display: flex;
  justify-content: right;
  flex-direction: column;
`;

const PoolWrapper = styled(Box)`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
`;

const ButtonsWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: right;
  margin-top: 20px;
`;

const PositionListItemMobile: FC<PositionListItemProps> = ({
  position,
  setClosePosition,
  setTopUpPosition,
  approvalPending,
  approveBtn,
  approve
}) => {
  return (
    <PositionListItemMobileContainer>
      <ListItemWrapper>
        <ListLabel>Asset</ListLabel>
        <ListValue>
          <PoolWrapper>
            <img
              src={getTokenLogoURL(
                position?.collateralPoolName?.toUpperCase() === "XDC"
                  ? "WXDC"
                  : position?.collateralPoolName
              )}
              alt={position?.collateralPoolName}
              width={20}
              height={20}
            />
            <PoolName>{position?.collateralPoolName}</PoolName>
          </PoolWrapper>
          <TVL sx={{ textAlign: "right" }}>
            TVL: {formatCurrency(position.tvl)}
          </TVL>
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabelWithPopover>Liquidation price
          <AppPopover id={`liquidation-price-${position.positionId}`}
                      text={"Liquidation Price is the price of the collateral token when your collateral will be automatically sold to partially or fully repay the loan if your collateral value drops. It's a safety mechanism to ensure that loans are always sufficiently collateralized. Monitoring this price helps prevent the unwanted liquidation of your assets."} /></ListLabelWithPopover>
        <ListValue>
          $ {formatPercentage(position.liquidationPrice)}
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Borrowed</ListLabel>
        <ListValue>{formatNumber(position.debtValue)} FXD</ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabel>Collateral</ListLabel>
        <ListValue>
          {formatNumberPrice(position.lockedCollateral)} {position.collateralPoolName}
        </ListValue>
      </ListItemWrapper>
      <ListItemWrapper>
        <ListLabelWithPopover>
          Safety buffer
          <AppPopover id={`safety-buffer-${position.positionId}`}
                      text={<>
                        Safety Buffer represents the extra collateral value above your borrowed amount. This is
                        maintained to protect against market volatility and prevent the automatic liquidation of your
                        assets. The larger your safety buffer, the lower your risk of reaching the liquidation
                        price. <br /><br />
                        Safety buffer is calculated from LTV. When you multiply your collateral value with LTV - you
                        will get how much you can borrow maximum with a 0% safety buffer. For example, if your
                        collateral value is $100, with 25% LTV, you can maximum borrow 75 FXD, which gives you 0% Safety
                        Buffer, and your position becomes very risky for liquidation.<br /><br />
                        We recommend at least 50% Safety Buffer. Using the example above, the recommended amount to
                        borrow is 75 FXD * 50% = 37.5 FXD.
                      </>} />
        </ListLabelWithPopover>
        <ListValue>
          {formatNumber(position.safetyBufferInPercent * 100)}%
        </ListValue>
      </ListItemWrapper>
      <ButtonsWrapper>
        {approveBtn ? (
          <ButtonPrimary onClick={approve} sx={{ height: "32px" }}>
            {approvalPending ? (
              <CircularProgress size={20} sx={{ color: "#0D1526" }} />
            ) : (
              `Approve FXD`
            )}
          </ButtonPrimary>
        ) : (
          <ManagePositionButton size="small" onClick={() => setTopUpPosition(position)}>
            Manage position
          </ManagePositionButton>
        )}
      </ButtonsWrapper>
    </PositionListItemMobileContainer>
  );
};

export default PositionListItemMobile;
