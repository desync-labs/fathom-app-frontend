import { Box } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

type BorrowCapMaxedTooltipProps = TextWithTooltipProps & {
  borrowCap: AssetCapData;
};

export const BorrowCapMaxedTooltip: FC<BorrowCapMaxedTooltipProps> = ({
  borrowCap,
  ...rest
}) => {
  if (!borrowCap || !borrowCap.isMaxed) return null;

  return (
    <Box sx={{ ml: 2 }}>
      <TextWithTooltip
        {...rest}
        icon={<WarningAmberRoundedIcon />}
        iconColor="warning.main"
        iconSize={18}
      >
        <>
          Protocol borrow cap at 100% for this asset. Further borrowing
          unavailable.
        </>
      </TextWithTooltip>
    </Box>
  );
};
