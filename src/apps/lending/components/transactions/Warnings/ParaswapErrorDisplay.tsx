import { Box, Typography } from "@mui/material";
import { Warning } from "apps/lending/components/primitives/Warning";
import { TxErrorType } from "apps/lending/ui-config/errorMapping";

import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { FC } from "react";

const USER_DENIED_SIGNATURE =
  "MetaMask Message Signature: User denied message signature.";
const USER_DENIED_TRANSACTION =
  "MetaMask Message Signature: User denied message signature.";

interface ErrorProps {
  txError: TxErrorType;
}
export const ParaswapErrorDisplay: FC<ErrorProps> = ({ txError }) => {
  return (
    <Box>
      <GasEstimationError txError={txError} />
      {txError.rawError.message !== USER_DENIED_SIGNATURE &&
        txError.rawError.message !== USER_DENIED_TRANSACTION && (
          <Box sx={{ pt: 4 }}>
            <Warning severity="info">
              <Typography variant="description">
                {" "}
                <> Tip: Try increasing slippage or reduce input amount</>
              </Typography>
            </Warning>
          </Box>
        )}
    </Box>
  );
};
