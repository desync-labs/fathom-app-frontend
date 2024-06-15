import { useCallback, useEffect, useMemo, useState } from "react";
import useConnector from "context/connector";
import { useLazyQuery } from "@apollo/client";
import { VAULTS_ACCOUNT_TRANSACTIONS } from "apollo/queries";
import BigNumber from "bignumber.js";
import { IVaultPosition } from "fathom-sdk";
import { TransactionFetchType } from "hooks/Vaults/useVaultListItem";

const useTotalStats = (
  positionsList: IVaultPosition[],
  positionsLoading: boolean
) => {
  const [totalBalance, setTotalBalance] = useState("-1");
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  const { chainId, account } = useConnector();

  const [loadAccountTransactions, { refetch: refetchTransactions }] =
    useLazyQuery(VAULTS_ACCOUNT_TRANSACTIONS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId },
      fetchPolicy: "no-cache",
    });

  const fetchPositionTransactions = useCallback(
    (fetchType: TransactionFetchType = TransactionFetchType.FETCH) => {
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return refetchTransactions({
            account: account.toLowerCase(),
            chainId,
          });
        }

        setTransactionsLoading(true);

        return loadAccountTransactions({
          variables: {
            account: account.toLowerCase(),
            chainId,
          },
        })
          .then((res) => {
            res.data?.deposits && setDepositsList(res.data.deposits);
            res.data?.withdrawals && setWithdrawalsList(res.data.withdrawals);
          })
          .finally(() => setTransactionsLoading(false));
      } else {
        setDepositsList([]);
        setWithdrawalsList([]);
        return;
      }
    },
    [
      chainId,
      account,
      setDepositsList,
      setTransactionsLoading,
      loadAccountTransactions,
      refetchTransactions,
    ]
  );

  useEffect(() => {
    if (positionsLoading) {
      setTotalBalance("-1");
    } else if (positionsList.length && !positionsLoading) {
      const totalBalance = positionsList.reduce((acc, position) => {
        return BigNumber(acc).plus(position.balancePosition);
      }, BigNumber(0));
      setTotalBalance(totalBalance.toString());
    } else {
      setTotalBalance("0");
    }
  }, [positionsList, positionsLoading, setTotalBalance]);

  useEffect(() => {
    fetchPositionTransactions();
  }, [account, fetchPositionTransactions]);

  const balanceEarned = useMemo(() => {
    if (totalBalance === "-1") return "0";

    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    return transactionsLoading
      ? "-1"
      : BigNumber(totalBalance || "0")
          .minus(sumTokenDeposits.minus(sumTokenWithdrawals))
          .toString();
  }, [totalBalance, depositsList, withdrawalsList, transactionsLoading]);

  return {
    totalBalance,
    balanceEarned,
  };
};

export default useTotalStats;
