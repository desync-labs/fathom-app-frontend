import AppBody from "apps/dex/pages/AppBody";
import { Wrapper } from "apps/dex/pages/Pool/styleds";
import { useLazyQuery } from "@apollo/client";
import { USER_TRANSACTIONS } from "apps/charts/apollo/queries";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState, memo, useMemo, FC } from "react";
import { TXN_TYPE } from "apps/charts/components/TxnList";
import {
  isTransactionRecent,
  useAllTransactions,
} from "apps/dex/state/transactions/hooks";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";
import {
  Transaction,
  PreviousTransaction,
  FormattedTransaction,
  TransactionItem,
  SwapTransactionItem,
} from "apps/dex/components/Transactions/Transaction";
import styled from "styled-components";

const TransactionListWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
`;

function newTransactionsFirst(
  a: TransactionDetails | FormattedTransaction,
  b: TransactionDetails | FormattedTransaction
) {
  return b.addedTime - a.addedTime;
}

export enum TransactionType {
  STORAGE,
  GRAPH,
}

const Transactions: FC = () => {
  const [transactionList, setTransactionList] = useState<
    FormattedTransaction[]
  >([]);

  const [sortedFilteredTransactions, setSortedFilteredTransactions] = useState<
    (TransactionDetails | FormattedTransaction)[]
  >([]);

  const { account } = useWeb3React();
  const [getTransactions] = useLazyQuery(USER_TRANSACTIONS, {
    fetchPolicy: "cache-first",
    onCompleted: (transactions) => {
      setSortedFilteredTransactions([]);
      if (
        transactions &&
        transactions.mints &&
        transactions.burns &&
        transactions.swaps
      ) {
        const newTxns: FormattedTransaction[] = [];
        if (transactions.mints.length > 0) {
          transactions.mints.map((mint: TransactionItem) => {
            const newTxn = {
              hash: mint.transaction.id,
              addedTime: Number(mint.transaction.timestamp) * 1000,
              type: TXN_TYPE.ADD,
              token0Amount: mint.amount0,
              token1Amount: mint.amount1,
              account: mint.to,
              token0Symbol: mint.pair.token0.symbol,
              token1Symbol: mint.pair.token1.symbol,
              amountUSD: mint.amountUSD,
              transactionType: TransactionType.STORAGE,
            };
            return newTxns.push(newTxn);
          });
        }
        if (transactions.burns.length > 0) {
          transactions.burns.map((burn: TransactionItem) => {
            const newTxn = {
              hash: burn.transaction.id,
              addedTime: Number(burn.transaction.timestamp) * 1000,
              type: TXN_TYPE.REMOVE,
              token0Amount: burn.amount0,
              token1Amount: burn.amount1,
              account: burn.sender,
              token0Symbol: burn.pair.token0.symbol,
              token1Symbol: burn.pair.token1.symbol,
              amountUSD: burn.amountUSD,
              transactionType: TransactionType.STORAGE,
            };
            return newTxns.push(newTxn);
          });
        }
        if (transactions.swaps.length > 0) {
          transactions.swaps.map((swap: SwapTransactionItem) => {
            const netToken0 = swap.amount0In - swap.amount0Out;
            const netToken1 = swap.amount1In - swap.amount1Out;

            const newTxn = {
              token0Symbol: "",
              token1Symbol: "",
              token0Amount: 0,
              token1Amount: 0,
              hash: "",
              addedTime: 0,
              type: "",
              amountUSD: 0,
              account: "",
              transactionType: TransactionType.STORAGE,
            };

            if (netToken0 < 0) {
              newTxn.token0Symbol = swap.pair.token0.symbol;
              newTxn.token1Symbol = swap.pair.token1.symbol;
              newTxn.token0Amount = Math.abs(netToken0);
              newTxn.token1Amount = Math.abs(netToken1);
            } else if (netToken1 < 0) {
              newTxn.token0Symbol = swap.pair.token1.symbol;
              newTxn.token1Symbol = swap.pair.token0.symbol;
              newTxn.token0Amount = Math.abs(netToken1);
              newTxn.token1Amount = Math.abs(netToken0);
            }

            newTxn.hash = swap.transaction.id;
            newTxn.addedTime = Number(swap.transaction.timestamp) * 1000;
            newTxn.type = TXN_TYPE.SWAP;

            newTxn.amountUSD = swap.amountUSD;
            newTxn.account = swap.to;
            return newTxns.push(newTxn);
          });
        }

        setTransactionList(newTxns);
      } else {
        setTransactionList([]);
      }
    },
  });

  const storageTransactions = useAllTransactions();

  const allTransactions = useMemo(() => {
    if (account) {
      const filtered = Object.entries(storageTransactions).filter(
        ([, tx]) => tx.from?.toLowerCase() === account?.toLowerCase()
      );
      return Object.fromEntries(filtered);
    } else {
      return {};
    }
  }, [storageTransactions, account]);

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions);
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst);
  }, [allTransactions]);

  const pending = useMemo(() => {
    return sortedRecentTransactions
      .filter((tx) => !tx.receipt)
      .map((tx) => tx.hash);
  }, [sortedRecentTransactions]);

  useEffect(() => {
    if (account) {
      getTransactions({
        variables: { user: account },
      });
    }
  }, [account, getTransactions]);

  useEffect(() => {
    if (!transactionList.length && !sortedRecentTransactions.length) {
      return;
    }

    console.log({
      transactionList,
      sortedRecentTransactions,
    });
    const transactionListHashes = transactionList.map(
      (transaction) => transaction.hash
    );
    const confirmed = sortedRecentTransactions
      .filter((tx) => tx.receipt)
      .map((tx) => tx.hash);

    const confirmedCollection = confirmed
      .filter((hash) => !transactionListHashes.includes(hash))
      .map((hash: string) => allTransactions?.[hash]);

    const sortedArray = [...confirmedCollection, ...transactionList].sort(
      newTransactionsFirst
    );

    setSortedFilteredTransactions(sortedArray);
  }, [
    transactionList,
    sortedRecentTransactions,
    allTransactions,
    setSortedFilteredTransactions,
  ]);

  return (
    <AppBody>
      <Wrapper id={"transaction-list"}>
        <TransactionListWrapper>
          {pending.map((hash, i) => {
            return <Transaction key={i} tx={allTransactions?.[hash]} />;
          })}
        </TransactionListWrapper>
        <br />
        <TransactionListWrapper>
          {sortedFilteredTransactions.map((item) => {
            return item?.transactionType === TransactionType.STORAGE ? (
              <PreviousTransaction
                item={item as FormattedTransaction}
                key={item.hash}
              />
            ) : (
              <Transaction tx={item as TransactionDetails} key={item.hash} />
            );
          })}
        </TransactionListWrapper>
      </Wrapper>
    </AppBody>
  );
};

export default memo(Transactions);
