import { Box } from "@mui/material";
import { AssetCapData } from "apps/lending/hooks/useAssetCaps";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import {
  TextWithTooltip,
  TextWithTooltipProps,
} from "apps/lending/components/TextWithTooltip";
import { FC } from "react";

type SupplyCapMaxedTooltipProps = TextWithTooltipProps & {
  supplyCap: AssetCapData;
};

export const SupplyCapMaxedTooltip: FC<SupplyCapMaxedTooltipProps> = ({
  supplyCap,
  ...rest
}) => {
  if (!supplyCap || !supplyCap.isMaxed) return null;

  return (
    <Box sx={{ ml: 2 }}>
      <TextWithTooltip
        {...rest}
        icon={<WarningAmberRoundedIcon />}
        iconColor="warning.main"
        iconSize={18}
      >
        <>
          Protocol supply cap at 100% for this asset. Further supply
          unavailable.
        </>
      </TextWithTooltip>
    </Box>
  );
};
