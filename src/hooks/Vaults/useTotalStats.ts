import { useCallback, useEffect, useMemo, useState } from "react";
import useConnector from "context/connector";
import { useLazyQuery } from "@apollo/client";
import {
  VAULTS_ACCOUNT_WITHDRAWALS,
  VAULTS_ACCOUNT_DEPOSITS,
} from "apollo/queries";
import BigNumber from "bignumber.js";
import { IVaultPosition } from "fathom-sdk";
import useSyncContext from "context/sync";

const TRANSACTIONS_PER_PAGE = 1000;

export type TransactionItem = {
  id: string;
  timestamp: string;
  sharesBurnt: string;
  tokenAmount: string;
  blockNumber: string;
};

const useTotalStats = (
  positionsList: IVaultPosition[],
  positionsLoading: boolean
) => {
  const [totalBalance, setTotalBalance] = useState("-1");
  const [depositsList, setDepositsList] = useState<TransactionItem[]>([]);
  const [withdrawalsList, setWithdrawalsList] = useState<TransactionItem[]>([]);
  const [balanceEarnedLoading, setBalanceEarnedLoading] =
    useState<boolean>(true);

  const { chainId, account } = useConnector();
  const { syncVault, prevSyncVault } = useSyncContext();

  const [loadAccountDeposits, { loading: depositsLoading }] = useLazyQuery(
    VAULTS_ACCOUNT_DEPOSITS,
    {
      context: { clientName: "vaults", chainId },
      variables: { chainId, first: TRANSACTIONS_PER_PAGE },
      fetchPolicy: "no-cache",
    }
  );

  const [loadAccountWithdrawals, { loading: withdrawalsLoading }] =
    useLazyQuery(VAULTS_ACCOUNT_WITHDRAWALS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId, first: TRANSACTIONS_PER_PAGE },
      fetchPolicy: "no-cache",
    });

  const fetchAccountDeposits = useCallback(
    (prevDeposits: TransactionItem[] = []) => {
      if (account) {
        return loadAccountDeposits({
          variables: {
            account: account.toLowerCase(),
            chainId,
            skip: prevDeposits.length,
            first: TRANSACTIONS_PER_PAGE,
          },
        }).then((res) => {
          if (res.data?.deposits?.length < TRANSACTIONS_PER_PAGE) {
            setDepositsList([...prevDeposits, ...(res.data?.deposits || [])]);
          } else {
            fetchAccountDeposits([
              ...prevDeposits,
              ...(res.data?.deposits || []),
            ]);
          }
        });
      } else {
        return setDepositsList([]);
      }
    },
    [chainId, account, setDepositsList, loadAccountDeposits]
  );

  const fetchAccountWithdrawals = useCallback(
    (prevWithdrawals: TransactionItem[] = []) => {
      if (account) {
        return loadAccountWithdrawals({
          variables: {
            account: account.toLowerCase(),
            chainId,
            skip: prevWithdrawals.length,
            first: TRANSACTIONS_PER_PAGE,
          },
        }).then((res) => {
          if (res.data?.withdrawals?.length < TRANSACTIONS_PER_PAGE) {
            setWithdrawalsList([
              ...prevWithdrawals,
              ...(res.data?.withdrawals || []),
            ]);
          } else {
            fetchAccountWithdrawals([
              ...prevWithdrawals,
              ...(res.data?.withdrawals || []),
            ]);
          }
        });
      } else {
        return setWithdrawalsList([]);
      }
    },
    [chainId, account, setDepositsList, loadAccountWithdrawals]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBalanceEarnedLoading(
        positionsLoading || withdrawalsLoading || depositsLoading
      );
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    positionsLoading,
    withdrawalsLoading,
    depositsLoading,
    setBalanceEarnedLoading,
  ]);

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
    fetchAccountDeposits([]);
    fetchAccountWithdrawals([]);
  }, [account, fetchAccountDeposits, fetchAccountWithdrawals]);

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
      fetchAccountDeposits([]);
      fetchAccountWithdrawals([]);
    }
  }, [syncVault, prevSyncVault, fetchAccountDeposits, fetchAccountWithdrawals]);

  const balanceEarned = useMemo(() => {
    if (balanceEarnedLoading) return "-1";
    if (totalBalance === "-1") return "0";

    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    return BigNumber(totalBalance || "0")
      .minus(sumTokenDeposits.minus(sumTokenWithdrawals))
      .toString();
  }, [balanceEarnedLoading, totalBalance, depositsList, withdrawalsList]);

  return {
    depositsLoading,
    withdrawalsLoading,
    totalBalance,
    balanceEarned,
  };
};

export default useTotalStats;
