import { ExclamationIcon } from "@heroicons/react/outline";
import { Box, SvgIcon } from "@mui/material";

import { ContentWithTooltip } from "apps/lending/components/ContentWithTooltip";
import { BorrowDisabledWarning } from "apps/lending/components/Warnings/BorrowDisabledWarning";
import { FC } from "react";

interface BorrowDisabledToolTipProps {
  symbol: string;
  currentMarket: string;
}
export const BorrowDisabledToolTip: FC<BorrowDisabledToolTipProps> = ({
  symbol,
  currentMarket,
}) => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <Box>
          <BorrowDisabledWarning
            symbol={symbol}
            currentMarket={currentMarket}
          />
        </Box>
      }
    >
      <SvgIcon sx={{ fontSize: "20px", color: "error.main", ml: 2 }}>
        <ExclamationIcon />
      </SvgIcon>
    </ContentWithTooltip>
  );
};
