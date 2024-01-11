import { Typography } from "@mui/material";

import { Warning } from "apps/lending/components/primitives/Warning";

export const SNXWarning = () => {
  return (
    <Warning severity="warning">
      <Typography>
        Before supplying SNX please check that the amount you want to supply is
        not currently being used for staking. If it is being used for staking,
        your transaction might fail.
      </Typography>
    </Warning>
  );
};
