import {
  Skeleton,
  ToggleButton,
  ToggleButtonProps,
  Typography,
} from "@mui/material";
import { formatUnits } from "fathom-ethers/lib/utils";

import { GasOption } from "apps/lending/components/transactions/GasStation/GasStationProvider";
import { FC } from "react";

export interface GasButtonProps extends ToggleButtonProps {
  value: GasOption;
  gwei?: string | undefined;
}

export const GasButton: FC<GasButtonProps> = ({ value, gwei, ...props }) => {
  return (
    <ToggleButton
      value={value}
      aria-label={value}
      sx={{ p: 2, height: "36px" }}
      {...props}
    >
      {gwei ? (
        <Typography variant={props.selected ? "subheader1" : "description"}>
          {parseFloat(formatUnits(gwei, "gwei")).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </Typography>
      ) : (
        <Skeleton variant="text" sx={{ width: "100%" }} />
      )}
    </ToggleButton>
  );
};
