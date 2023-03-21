import React, { FC } from "react";
import { PositionListItemProps } from "components/PositionList/PositionListItem";
import { getTokenLogoURL } from "utils/tokenLogo";
import { PoolName, TVL } from "components/AppComponents/AppBox/AppBox";
import { formatCurrency, formatNumber, formatNumberPrice } from "utils/format";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import {
  ButtonPrimary,
  ManagePositionButton
} from "components/AppComponents/AppButton/AppButton";

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
  approve,
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
        <ListLabel>Liquidation price</ListLabel>
        <ListValue>
          {formatNumberPrice(position.liquidationPrice)}
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
        <ListLabel>Safety buffer</ListLabel>
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
