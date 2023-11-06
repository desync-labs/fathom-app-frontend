import React, { memo, Dispatch, FC, SetStateAction } from "react";
import { Box, CircularProgress, TableCell, Stack } from "@mui/material";
import { PoolName, TVL } from "components/AppComponents/AppBox/AppBox";
import {
  ButtonPrimary,
  ManagePositionButton
} from "components/AppComponents/AppButton/AppButton";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import IOpenPosition from "services/interfaces/models/IOpenPosition";
import { styled } from "@mui/material/styles";
import TokenLogo from "components/Common/TokenLogo";
import { getTokenLogoURL } from "utils/tokenLogo";

import {
  formatCurrency,
  formatNumber,
  formatNumberPrice,
  formatPercentage
} from "utils/format";

export type PositionListItemProps = {
  position: IOpenPosition;
  setClosePosition: Dispatch<SetStateAction<IOpenPosition | undefined>>;
  setTopUpPosition: Dispatch<SetStateAction<IOpenPosition | undefined>>;
  approve: () => void;
  approvalPending: boolean;
  approveBtn: boolean;
};

const ButtonsWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 20px;
  justify-content: right;
`;

const PositionListItem: FC<PositionListItemProps> = ({
  position,
  setTopUpPosition,
  approvalPending,
  approveBtn,
  approve,
}) => {
  return (
    <AppTableRow
      key={position.id}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        td: { paddingLeft: "10px", textAlign: "left" },
      }}
    >
      <TableCell component="td" scope="row">
        {position.positionId}
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TokenLogo
            src={getTokenLogoURL(
              position?.collateralPoolName?.toUpperCase() === "XDC"
                ? "WXDC"
                : position?.collateralPoolName
            )}
            alt={position?.collateralPoolName}
          />
          <Box>
            <PoolName>{position.collateralPoolName}</PoolName>
            <TVL>TVL: {formatCurrency(Number(position.tvl))}</TVL>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>$ {formatPercentage(position.liquidationPrice)}</TableCell>
      <TableCell>{formatNumber(position.debtValue)} FXD</TableCell>
      <TableCell>
        {formatNumberPrice(position.lockedCollateral)}{" "}
        {position.collateralPoolName}
      </TableCell>
      <TableCell>
        {formatNumber(position.safetyBufferInPercent * 100)}%
      </TableCell>
      <TableCell>
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
      </TableCell>
    </AppTableRow>
  );
};

export default memo(PositionListItem);
