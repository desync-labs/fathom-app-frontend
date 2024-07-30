import { FC } from "react";
import { Box, styled } from "@mui/material";

import { useActiveWeb3React } from "apps/dex/hooks";
import { getBlockScanLink } from "apps/dex/utils";
import { ExternalLink } from "apps/dex/theme";
import { RowFixed } from "apps/dex/components/Row";
import Loader from "apps/dex/components/Loader";
import { formatTime } from "apps/charts/utils";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { ExtLinkIcon } from "components/AppComponents/AppButton/AppButton";

const TransactionStatusText = styled(Box)`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  :hover {
    text-decoration: underline;
  }
`;

const TransactionState = styled(ExternalLink)<{
  pending: boolean;
  success?: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none !important;
  border-radius: 0.5rem;
  padding: 0.25rem 0;
  font-weight: 500;
  font-size: 0.825rem;
  color: #fff;
`;

const IconWrapper = styled(Box)<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success }) =>
    pending ? "#253656" : success ? "#27AE60" : "#FD4040"};
`;

export type TransactionItem = {
  transaction: { id: string; timestamp: string };
  amount0: number;
  amount1: number;
  to: string;
  pair: any;
  amountUSD: number;
  sender: string;
};

export type SwapTransactionItem = TransactionItem & {
  amount0In: number;
  amount0Out: number;
  amount1In: number;
  amount1Out: number;
};

export type FormattedTransaction = {
  hash: string;
  addedTime: number;
  token0Amount: number;
  token1Amount: number;
  account?: string;
  token0Symbol: string;
  token1Symbol: string;
  amountUSD?: number;
};

export const Transaction: FC<{ tx: TransactionDetails }> = ({ tx }) => {
  const { chainId } = useActiveWeb3React();

  const summary = tx?.summary;
  const pending = !tx?.receipt;
  const success =
    !pending &&
    tx &&
    (tx.receipt?.status === 1 || typeof tx.receipt?.status === "undefined");

  if (!chainId) return null;

  return (
    <Box data-testid={`dex-transactions-transactionWrapper-${tx.hash}`}>
      <TransactionState
        href={getBlockScanLink(chainId, tx.hash, "transaction")}
        pending={pending}
        success={success}
      >
        <RowFixed>
          <TransactionStatusText
            data-testid={`dex-transactions-transactionStatusText-${tx.hash}`}
          >
            {summary
              ? summary + " " + formatTime(tx.addedTime / 1000)
              : tx.hash}{" "}
            <ExtLinkIcon />
          </TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success}>
          {pending ? (
            <Loader stroke={"white"} />
          ) : success ? (
            <TaskAltIcon sx={{ width: "16px", height: "16px" }} />
          ) : (
            <WarningAmberIcon sx={{ width: "16px", height: "16px" }} />
          )}
        </IconWrapper>
      </TransactionState>
    </Box>
  );
};
