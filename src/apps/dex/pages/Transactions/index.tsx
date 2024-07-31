import { useEffect, useState, memo, useMemo, FC, useCallback } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  SelectChangeEvent,
  Table,
  TableBody,
  TableHead,
  Typography,
} from "@mui/material";

import { USER_TRANSACTIONS } from "apps/charts/apollo/queries";
import { getTransactionType, TXN_TYPE } from "apps/charts/components/TxnList";
import {
  isTransactionRecent,
  useAllTransactions,
} from "apps/dex/state/transactions/hooks";
import {
  FormattedTransaction,
  TransactionItem,
  SwapTransactionItem,
} from "apps/dex/components/Transactions/Transaction";
import { useActiveWeb3React } from "apps/dex/hooks";
import useSyncContext from "context/sync";
import BasePageContainer from "components/Base/PageContainer";
import BasePageHeader from "components/Base/PageHeader";
import {
  BaseTableCell,
  BaseTableContainer,
  BaseTableHeaderRow,
} from "components/Base/Table/StyledTable";
import { PositionActivityListLoader } from "components/PositionActivityList/PositionActivityListLoader";
import {
  BaseAccordion,
  BaseAccordionTxGroupDate,
  BaseAccordionTxGroupDetails,
  BaseAccordionTxGroupSummary,
} from "components/Base/Accordion/StyledAccordion";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { dexGroupByDate } from "utils/Dex/dexGroupByDate";
import DexTransactionListItem from "apps/dex/pages/Transactions/DexTransactionListItem";
import { TransactionDetails } from "apps/dex/state/transactions/reducer";
import { formattedNum, formatTime } from "apps/charts/utils";
import DexTransactionListFilters from "apps/dex/pages/Transactions/DexTransactionListFilters";

function newTransactionsFirst(
  a: TransactionDetails | FormattedTransaction,
  b: TransactionDetails | FormattedTransaction
) {
  return b.addedTime - a.addedTime;
}

export type TXN_KEYS_TYPE = keyof typeof TXN_TYPE;

const Transactions: FC = () => {
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

  return (
    <BasePageContainer sx={{ mt: 0, padding: 0 }}>
      <BasePageHeader title={"Transaction history"} />
      <DexTransactionListFilters
        filterByType={filterByType}
        handleFilterByType={handleFilterByType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <BaseTableContainer>
        <Table aria-label="pools table">
          <TableHead>
            <BaseTableHeaderRow>
              <BaseTableCell>Date</BaseTableCell>
            </BaseTableHeaderRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <>
                <PositionActivityListLoader />
                <PositionActivityListLoader txAmount={3} />
              </>
            ) : (
              <>
                {mergedTransactions && mergedTransactions.length > 0 && (
                  <>
                    {Object.entries(dexGroupByDate(mergedTransactions)).map(
                      ([date, txns], groupIndex) => (
                        <BaseAccordion
                          key={groupIndex}
                          defaultExpanded={groupIndex < 3}
                        >
                          <BaseAccordionTxGroupSummary
                            expandIcon={
                              <KeyboardArrowDownRoundedIcon
                                sx={{ color: "#fff" }}
                              />
                            }
                            aria-controls={`panel${groupIndex}-content`}
                            id={`panel${groupIndex}-header`}
                          >
                            <BaseAccordionTxGroupDate>
                              {date}
                            </BaseAccordionTxGroupDate>
                          </BaseAccordionTxGroupSummary>
                          <BaseAccordionTxGroupDetails>
                            {txns.map((transaction: FormattedTransaction) => {
                              return (
                                <DexTransactionListItem
                                  key={transaction.hash}
                                  transaction={transaction}
                                />
                              );
                            })}
                          </BaseAccordionTxGroupDetails>
                        </BaseAccordion>
                      )
                    )}
                  </>
                )}
                {mergedTransactions && !mergedTransactions.length ? (
                  <Typography
                    sx={{ my: 12 }}
                    textAlign={"center"}
                    variant="h3"
                    color="text.light"
                  >
                    No transactions yet.
                  </Typography>
                ) : null}
              </>
            )}
          </TableBody>
        </Table>
      </BaseTableContainer>
    </BasePageContainer>
  );
};

export default memo(Transactions);
