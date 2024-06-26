import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, SvgIcon, Typography } from "@mui/material";
import { FormattedNumber } from "apps/lending/components/primitives/FormattedNumber";
import { TokenIcon } from "apps/lending/components/primitives/TokenIcon";

import { BaseSuccessView } from "apps/lending/components/transactions/FlowCommons/BaseSuccess";

export type WithdrawAndSwitchTxSuccessViewProps = {
  txHash?: string;
  amount?: string;
  symbol: string;
  outAmount?: string;
  outSymbol: string;
};

export const WithdrawAndSwitchTxSuccessView = ({
  txHash,
  amount,
  symbol,
  outAmount,
  outSymbol,
}: WithdrawAndSwitchTxSuccessViewProps) => {
  return (
    <BaseSuccessView txHash={txHash}>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Typography>
          <>You&apos;ve successfully withdrew & switched tokens.</>
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <TokenIcon sx={{ fontSize: "20px" }} symbol={symbol} />
          <FormattedNumber value={Number(amount)} compact variant="main14" />
          <Typography variant="secondary14">{symbol}</Typography>
          <SvgIcon sx={{ fontSize: "14px" }}>
            <ArrowForwardIcon />
          </SvgIcon>
          <TokenIcon sx={{ fontSize: "20px" }} symbol={outSymbol} />
          <FormattedNumber value={Number(outAmount)} variant="main14" />
          <Typography variant="secondary14">{outSymbol}</Typography>
        </Box>
      </Box>
    </BaseSuccessView>
  );
};
