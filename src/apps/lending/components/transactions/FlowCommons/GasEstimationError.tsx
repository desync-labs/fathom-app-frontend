import { Button, Typography } from "@mui/material";
import { Warning } from "apps/lending/components/primitives/Warning";
import { TxErrorType } from "apps/lending/ui-config/errorMapping";
import { FC } from "react";

export const GasEstimationError: FC<{ txError: TxErrorType }> = ({
  txError,
}) => {
  return (
    <Warning severity="error" sx={{ mt: 4, mb: 0 }}>
      <Typography variant="description">
        {txError.error ? (
          <>
            {txError.error}{" "}
            <Button
              sx={{ verticalAlign: "top", height: "auto" }}
              variant="text"
              onClick={() =>
                navigator.clipboard.writeText(
                  txError.rawError.message.toString()
                )
              }
            >
              <Typography variant="description">copy the error</Typography>
            </Button>
          </>
        ) : (
          <>
            There was some error. Please try changing the parameters or{" "}
            <Button
              sx={{ verticalAlign: "top" }}
              onClick={() =>
                navigator.clipboard.writeText(
                  txError.rawError.message.toString()
                )
              }
            >
              <Typography variant="description">copy the error</Typography>
            </Button>
          </>
        )}
      </Typography>
    </Warning>
  );
};
