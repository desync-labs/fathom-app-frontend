import { AlertColor, Typography } from "@mui/material";

import { Warning } from "apps/lending/components/primitives/Warning";
import { FC } from "react";

interface IsolationModeWarningProps {
  asset?: string;
  severity?: AlertColor;
}

export const IsolationModeWarning: FC<IsolationModeWarningProps> = ({
  asset,
  severity,
}) => {
  return (
    <Warning severity={severity || "info"} sx={{ mb: 3 }}>
      <Typography variant="subheader1" mb={0.5}>
        You are entering Isolation mode
      </Typography>
      <Typography>
        In Isolation mode, you cannot supply other assets as collateral. A
        global debt ceiling limits the borrowing power of the isolated asset. To
        exit isolation mode disable {asset ? asset : ""} as collateral before
        borrowing another asset.
      </Typography>
    </Warning>
  );
};
