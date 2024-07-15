import { Dispatch, FC, SetStateAction, memo } from "react";
import BigNumber from "bignumber.js";
import { styled } from "@mui/material/styles";
import { TableCell, Box, Stack } from "@mui/material";
import { ICollateralPool } from "fathom-sdk";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber, formatNumberPrice } from "utils/format";
import usePricesContext from "context/prices";

import { OpenPositionButton } from "components/AppComponents/AppButton/AppButton";
import { TVL } from "components/AppComponents/AppBox/AppBox";
import TokenLogo from "components/Common/TokenLogo";
import PriceChanged from "components/Common/PriceChange";
import PoolName from "components/Pools/PoolListItem/PoolName";
import { BaseTableItemRow } from "components/Base/Table/StyledTable";

type PoolsListItemPropsType = {
  pool: ICollateralPool;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
};

const PriceWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: 100%;
`;

const PoolsListItem: FC<PoolsListItemPropsType> = ({
  pool,
  setSelectedPool,
}) => {
  const { xdcPrice, prevXdcPrice } = usePricesContext();
  return (
    <BaseTableItemRow>
      <TableCell>
        <Stack direction="row" spacing={2}>
          <TokenLogo
            src={getTokenLogoURL(
              pool.poolName.toUpperCase() === "XDC" ? "WXDC" : pool.poolName
            )}
            alt={pool.poolName}
          />
          <Box>
            <PoolName>{pool.poolName}</PoolName>
            <TVL>TVL: {formatCurrency(pool.tvl)}</TVL>
          </Box>
        </Stack>
      </TableCell>
      <TableCell>
        <PriceWrapper>
          $
          {formatNumberPrice(
            pool.poolName.toUpperCase() === "XDC" &&
              BigNumber(xdcPrice).isGreaterThan(0)
              ? BigNumber(xdcPrice)
                  .dividedBy(10 ** 18)
                  .toNumber()
              : pool.collateralPrice
          )}
          <PriceChanged
            current={
              pool.poolName.toUpperCase() === "XDC" &&
              BigNumber(xdcPrice).isGreaterThan(0)
                ? BigNumber(xdcPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                : Number(pool.collateralPrice)
            }
            previous={
              pool.poolName.toUpperCase() === "XDC" &&
              prevXdcPrice &&
              BigNumber(prevXdcPrice).isGreaterThan(0)
                ? BigNumber(prevXdcPrice)
                    .dividedBy(10 ** 18)
                    .toNumber()
                : Number(pool.collateralLastPrice)
            }
          />
        </PriceWrapper>
      </TableCell>
      <TableCell>{formatNumber(pool.totalBorrowed)} FXD</TableCell>
      <TableCell>{formatNumber(pool.totalAvailable)} FXD</TableCell>
      <TableCell align="right">
        <OpenPositionButton onClick={() => setSelectedPool(pool)}>
          <AddCircleIcon
            sx={{ fontSize: "16px", marginRight: "8px", color: "#005C55" }}
          />
          Open Position
        </OpenPositionButton>
      </TableCell>
    </BaseTableItemRow>
  );
};

export default memo(PoolsListItem);
