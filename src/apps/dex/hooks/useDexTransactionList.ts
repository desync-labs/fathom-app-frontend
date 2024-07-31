import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FormattedTransaction,
  SwapTransactionItem,
  TransactionItem,
} from "apps/dex/components/Transactions/Transaction";
import { useActiveWeb3React } from "./index";
import useSyncContext from "context/sync";
import { SelectChangeEvent } from "@mui/material";
import { getTransactionType, TXN_TYPE } from "apps/charts/components/TxnList";
import { formattedNum, formatTime } from "apps/charts/utils";
import { useLazyQuery } from "@apollo/client";
import { USER_TRANSACTIONS } from "apps/charts/apollo/queries";
import {
  isTransactionRecent,
  useAllTransactions,
} from "apps/dex/state/transactions/hooks";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";

function newTransactionsFirst(
  a: TransactionDetails | FormattedTransaction,
  b: TransactionDetails | FormattedTransaction
) {
  return b.addedTime - a.addedTime;
}

export type TXN_KEYS_TYPE = keyof typeof TXN_TYPE;

const useDexTransactionList = () => {
  const [transactionList, setTransactionList] = useState<
    FormattedTransaction[]
  >([]);
  const [filterByType, setFilterByType] = useState<TXN_KEYS_TYPE>("ALL");
  const [searchValue, setSearchValue] = useState<string>("");

  const { account, chainId } = useActiveWeb3React();
  const { syncDex, prevSyncDex } = useSyncContext();

  const handleFilterByType = useCallback(
    (event: SelectChangeEvent<unknown>) => {
      setFilterByType(event.target.value as TXN_KEYS_TYPE);
    },
    [setFilterByType]
  );

  const onCompleted = useCallback(
    (response: any) => {
      const transactions = response?.data ? response.data : response;
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
              token0Symbol: mint.pair.token0.symbol,
              token1Symbol: mint.pair.token1.symbol,
              summary: "",
            };
            const summary = getTransactionType(
              newTxn.type,
              newTxn.token0Symbol,
              newTxn.token1Symbol,
              formattedNum(newTxn.token0Amount),
              formattedNum(newTxn.token1Amount),
              formatTime(newTxn.addedTime / 1000)
            );
            newTxn.summary = summary;
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
              token0Symbol: burn.pair.token0.symbol,
              token1Symbol: burn.pair.token1.symbol,
              summary: "",
            };
            const summary = getTransactionType(
              newTxn.type,
              newTxn.token0Symbol,
              newTxn.token1Symbol,
              formattedNum(newTxn.token0Amount),
              formattedNum(newTxn.token1Amount),
              formatTime(newTxn.addedTime / 1000)
            );
            newTxn.summary = summary;
            return newTxns.push(newTxn);
          });
        }
        if (transactions.swaps.length > 0) {
          transactions.swaps.map((swap: SwapTransactionItem) => {
            const netToken0 = swap.amount0In - swap.amount0Out;
            const netToken1 = swap.amount1In - swap.amount1Out;

            const newTxn = {
              token0Symbol: swap.pair.token1.symbol,
              token1Symbol: swap.pair.token0.symbol,
              token0Amount: Math.abs(netToken1),
              token1Amount: Math.abs(netToken0),
              hash: swap.transaction.id,
              addedTime: Number(swap.transaction.timestamp) * 1000,
              type: TXN_TYPE.SWAP,
              summary: "",
            };

            const summary = getTransactionType(
              newTxn.type,
              newTxn.token0Symbol,
              newTxn.token1Symbol,
              formattedNum(newTxn.token0Amount),
              formattedNum(newTxn.token1Amount),
              formatTime(newTxn.addedTime / 1000)
            );
            newTxn.summary = summary;

            return newTxns.push(newTxn);
          });
        }

        setTransactionList(newTxns);
      } else {
        setTransactionList([]);
      }
    },
    [setTransactionList]
  );

  const [getTransactions, { loading, refetch: refetchTransactions }] =
    useLazyQuery(USER_TRANSACTIONS, {
      fetchPolicy: "network-only",
      onCompleted,
      context: {
        chainId,
        clientName: "dex",
      },
    });

  const storageTransactions = useAllTransactions();

  const storageFilteredTransactions = useMemo(() => {
    if (account) {
      const filtered = Object.entries(storageTransactions).filter(
        ([, tx]) => tx.from?.toLowerCase() === account?.toLowerCase()
      );
      return Object.fromEntries(filtered);
    } else {
      return {};
    }
  }, [storageTransactions, account]);

  /**
   * Get transactions for the last 7 days.
   */
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(storageFilteredTransactions);
    return txs.filter((tx) => isTransactionRecent(tx, 7));
  }, [storageFilteredTransactions]);

  const pending = useMemo(() => {
    return sortedRecentTransactions
      .filter((tx) => !tx.receipt)
      .map((tx) => tx.hash);
  }, [sortedRecentTransactions]);

  const filteredTransactionList = useMemo(
    () =>
      transactionList
        ?.filter((tx) => !pending.includes(tx.hash))
        .map((tx) => ({
          ...tx,
          pending: false,
        })),
    [transactionList, pending]
  );

  useEffect(() => {
    if (syncDex && !prevSyncDex) {
      refetchTransactions({ user: account, first: 1000 }).then(onCompleted);
    }
  }, [syncDex, prevSyncDex, refetchTransactions, onCompleted]);

  useEffect(() => {
    if (account && chainId) {
      getTransactions({
        variables: { user: account, first: 1000 },
      });
    }
  }, [account, getTransactions, chainId]);

  const pendingTransactions = pending.map(
    (hash: string) =>
      ({
        ...storageTransactions?.[hash],
        pending: true,
      } as unknown as FormattedTransaction)
  );

  const mergedTransactions = useMemo(() => {
    return [...filteredTransactionList, ...pendingTransactions]
      .sort(newTransactionsFirst)
      .filter((item) => {
        if (searchValue) {
          return (
            item.hash.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchValue.toLowerCase())
          );
        }
        return true;
      })
      .filter((item) => {
        if (filterByType === "ALL") {
          return true;
        }
        return item.type === TXN_TYPE[filterByType];
      });
  }, [pendingTransactions, filteredTransactionList, searchValue, filterByType]);

  const filterActive = useMemo(
    () => filterByType !== "ALL" || searchValue !== "",
    [searchValue, filterByType]
  );

  return {
    loading,
    setSearchValue,
    handleFilterByType,
    mergedTransactions,
    filterActive,
    filterByType,
    searchValue,
    setFilterByType,
  };
};

export default useDexTransactionList;
