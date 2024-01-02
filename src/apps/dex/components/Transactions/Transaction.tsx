import styled from "styled-components";
import { CheckCircle, Triangle } from "react-feather";

import { useActiveWeb3React } from "apps/dex/hooks";
import { getBlockScanLink } from "apps/dex/utils";
import { ExternalLink } from "apps/dex/theme";
import { RowFixed } from "apps/dex/components/Row";
import Loader from "apps/dex/components/Loader";
import { FC } from "react";
import { formattedNum, formatTime, urls } from "apps/charts/utils";
import { getTransactionType } from "apps/charts/components/TxnList";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";

const TransactionWrapper = styled.div``;

const TransactionStatusText = styled.div`
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
  padding: 0.25rem 0rem;
  font-weight: 500;
  font-size: 0.825rem;
  color: ${({ theme }) => theme.text1};
`;

const IconWrapper = styled.div<{ pending: boolean; success?: boolean }>`
  color: ${({ pending, success, theme }) =>
    pending ? theme.primary1 : success ? theme.green1 : theme.red1};
`;

export type TransactionItem = {
  transaction: { id: any; timestamp: any };
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
  account: string;
  token0Symbol: string;
  token1Symbol: string;
  amountUSD: number;
  transactionType: number;
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
    <TransactionWrapper>
      <TransactionState
        href={getBlockScanLink(chainId, tx.hash, "transaction")}
        pending={pending}
        success={success}
      >
        <RowFixed>
          <TransactionStatusText>
            {summary
              ? summary + " " + formatTime(tx.addedTime / 1000)
              : tx.hash}{" "}
            ↗
          </TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={pending} success={success}>
          {pending ? (
            <Loader stroke={"white"} />
          ) : success ? (
            <CheckCircle size="16" />
          ) : (
            <Triangle size="16" />
          )}
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  );
};

export const PreviousTransaction: FC<{ item: FormattedTransaction }> = ({
  item,
}) => {
  return (
    <TransactionWrapper>
      <TransactionState
        href={urls.showTransaction(item.hash)}
        pending={false}
        success={true}
      >
        <RowFixed>
          <TransactionStatusText>
            {getTransactionType(
              item.type,
              item.token1Symbol,
              item.token0Symbol,
              formattedNum(item.token0Amount),
              formattedNum(item.token1Amount),
              formatTime(item.addedTime / 1000)
            )}{" "}
            ↗
          </TransactionStatusText>
        </RowFixed>
        <IconWrapper pending={false} success={true}>
          <CheckCircle size="16" />
        </IconWrapper>
      </TransactionState>
    </TransactionWrapper>
  );
};
