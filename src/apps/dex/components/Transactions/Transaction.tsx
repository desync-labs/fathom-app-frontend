import { FC } from "react";
import { Box, styled } from "@mui/material";

import { useActiveWeb3React } from "apps/dex/hooks";
import { getBlockScanLink } from "apps/dex/utils";
import { ExternalLink } from "apps/dex/theme";
import { RowFixed } from "apps/dex/components/Row";
import Loader from "apps/dex/components/Loader";
import { formattedNum, formatTime } from "apps/charts/utils";
import { getTransactionType } from "apps/charts/components/TxnList";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";

import TaskAltIcon from "@mui/icons-material/TaskAlt";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import useConnector from "context/connector";
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

export const IconWrapper = styled(Box)<{ pending: boolean; success?: boolean }>`
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
  type: string;
  token0Amount: number;
  token1Amount: number;
  summary: string;
  account?: string;
  token0Symbol: string;
  token1Symbol: string;
  amountUSD?: number;
  pending?: boolean;
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

export const PreviousTransaction: FC<{ item: FormattedTransaction }> = ({
  item,
}) => {
  const { chainId } = useConnector();

  return (
    <Box>
      <TransactionState
        href={getBlockScanLink(chainId, item.hash, "transaction")}
        pending={false}
        success={true}
      >
        <RowFixed>
          <TransactionStatusText>
            {getTransactionType(
              item.type,
              item.token0Symbol,
              item.token1Symbol,
              formattedNum(item.token0Amount),
              formattedNum(item.token1Amount),
              formatTime(item.addedTime / 1000)
            )}{" "}
            <ExtLinkIcon />
          </TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={false} success={true}>
          <TaskAltIcon sx={{ width: "16px", height: "16px" }} />
        </IconWrapper>
      </TransactionState>
    </Box>
  );
};
