import { TableCell, Box, Stack } from "@mui/material";
import { ICollateralPool } from "fathom-sdk";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { Dispatch, FC, SetStateAction, memo } from "react";
import BigNumber from "bignumber.js";
import { AppTableRow } from "components/AppComponents/AppTable/AppTable";
import { styled } from "@mui/material/styles";
import { OpenPositionButton } from "components/AppComponents/AppButton/AppButton";

import { TVL, PoolName } from "components/AppComponents/AppBox/AppBox";
import TokenLogo from "components/Common/TokenLogo";

import { getTokenLogoURL } from "utils/tokenLogo";
import { formatCurrency, formatNumber, formatNumberPrice } from "utils/format";
import usePricesContext from "context/prices";

import PriceChanged from "components/Common/PriceChange";

type PoolsListItemPropsType = {
  pool: ICollateralPool;
  setSelectedPool: Dispatch<SetStateAction<ICollateralPool | undefined>>;
};

const PoolsListItemTableRow = styled(AppTableRow)`
  td {
    background: #1d2d49;
    border-color: #121212;
    padding: 9px 0;
  }

  td:first-of-type {
    border-radius: 8px 0 0 8px;
    text-align: center;
  }

  td:last-of-type {
    border-radius: 0 8px 8px 0;
  }
`;

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
    <PoolsListItemTableRow
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
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
          <AddCircleIcon sx={{ fontSize: "16px", marginRight: "7px" }} />
          Open Position
        </OpenPositionButton>
      </TableCell>
    </PoolsListItemTableRow>
  );
};

export default memo(PoolsListItem);
