import { Typography } from "@mui/material";
import { formatUnits } from "fathom-ethers/lib/utils";

import {
  ActionFields,
  TransactionHistoryItem,
} from "apps/lending/modules/history/types";
import { FC } from "react";

export const BorrowRateModeBlock: FC<{
  swapBorrowRateTx: TransactionHistoryItem<ActionFields["SwapBorrowRate"]>;
  borrowRateMode: string;
}> = ({ swapBorrowRateTx, borrowRateMode }) => {
  if (borrowRateMode === "Variable" || borrowRateMode === "2") {
    return (
      <>
        <Typography variant="description" color="text.primary" pr={0.5}>
          Variable
        </Typography>
        <Typography variant="secondary14" color="text.primary" pr={0.5}>
          {Number(formatUnits(swapBorrowRateTx.variableBorrowRate, 25)).toFixed(
            2
          )}
          %
        </Typography>
        <Typography variant="description" color="text.primary">
          APY
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Typography variant="description" color="text.primary" pr={0.5}>
          Stable
        </Typography>
        <Typography variant="secondary14" color="text.primary" pr={0.5}>
          {Number(formatUnits(swapBorrowRateTx.stableBorrowRate, 25)).toFixed(
            2
          )}
          %
        </Typography>
        <Typography variant="description" color="text.primary">
          APY
        </Typography>
      </>
    );
  }
};
