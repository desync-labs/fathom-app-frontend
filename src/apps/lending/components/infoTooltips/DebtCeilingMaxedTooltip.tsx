import { ExclamationIcon } from "@heroicons/react/outline";
import { Box } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

type DebtCeilingMaxedTooltipProps = TextWithTooltipProps & {
  debtCeiling: AssetCapData;
};

export const DebtCeilingMaxedTooltip: FC<DebtCeilingMaxedTooltipProps> = ({
  debtCeiling,
  ...rest
}) => {
  if (!debtCeiling || !debtCeiling.isMaxed) return null;

  return (
    <Box sx={{ ml: 2 }}>
      <TextWithTooltip
        {...rest}
        icon={<ExclamationIcon />}
        iconColor="error.main"
        iconSize={18}
      >
        <>
          Protocol debt ceiling is at 100% for this asset. Futher borrowing
          against this asset is unavailable.
        </>
      </TextWithTooltip>
    </Box>
  );
};
