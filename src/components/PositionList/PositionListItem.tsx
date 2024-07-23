import { memo, Dispatch, FC, SetStateAction } from "react";
import BigNumber from "bignumber.js";
import { Box, TableCell, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IOpenPosition } from "fathom-sdk";

import { getTokenLogoURL } from "utils/tokenLogo";
import {
  formatCurrency,
  formatNumber,
  formatNumberPrice,
  formatPercentage,
} from "utils/format";
import { DANGER_SAFETY_BUFFER } from "utils/Constants";
import TokenLogo from "components/Common/TokenLogo";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import { ManagePositionButton } from "components/AppComponents/AppButton/AppButton";
import PoolName from "components/Pools/PoolListItem/PoolName";
import { BaseTableItemRow } from "components/Base/Table/StyledTable";

export type PositionListItemProps = {
  position: IOpenPosition;
  setClosePosition: Dispatch<SetStateAction<IOpenPosition | undefined>>;
  setTopUpPosition: Dispatch<SetStateAction<IOpenPosition | undefined>>;
};

const ButtonsWrapper = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 36px;
  justify-content: right;
`;

const PositionListItem: FC<PositionListItemProps> = ({
  position,
  setTopUpPosition,
}) => {
  return (
    <BaseTableItemRow key={position.id}>
      <TableCell component="td" scope="row">
        {position.positionId}
      </TableCell>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
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
      <TableCell>${formatPercentage(position.liquidationPrice)}</TableCell>
      <TableCell>{formatNumber(position.debtValue)} FXD</TableCell>
      <TableCell>
        {formatNumberPrice(position.lockedCollateral)}{" "}
        {position.collateralPoolName}
      </TableCell>
      <TableCell
        sx={{
          color: BigNumber(position.safetyBufferInPercent)
            .decimalPlaces(3, BigNumber.ROUND_UP)
            .isLessThan(DANGER_SAFETY_BUFFER)
            ? "#f76e6e !important"
            : "#fff",
        }}
      >
        {formatNumber(position.safetyBufferInPercent * 100)}%
      </TableCell>
      <TableCell>
        <ButtonsWrapper>
          <ManagePositionButton
            size="small"
            onClick={() => setTopUpPosition(position)}
          >
            Manage position
          </ManagePositionButton>
        </ButtonsWrapper>
      </TableCell>
    </BaseTableItemRow>
  );
};

export default memo(PositionListItem);
