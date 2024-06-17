import { useCallback, useEffect, useMemo, useState } from "react";
import { IVault, IVaultPosition } from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useLazyQuery } from "@apollo/client";

import { useServices } from "context/services";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import useRpcError from "hooks/General/useRpcError";
import { VAULT_POSITION_TRANSACTIONS } from "apollo/queries";

interface UseVaultListItemProps {
  vaultPosition: IVaultPosition | null | undefined;
  vault: IVault;
}

export type IVaultStrategyHistoricalApr = {
  id: string;
  apr: string;
  timestamp: string;
};

export enum TransactionFetchType {
  FETCH = "fetch",
  PROMISE = "promise",
}

export enum FetchBalanceTokenType {
  PROMISE = "promise",
  FETCH = "fetch",
}

const useVaultListItem = ({ vaultPosition, vault }: UseVaultListItemProps) => {
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);
  const [balanceToken, setBalanceToken] = useState<string>("0");
  const { chainId } = useConnector();

  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [transactionsLoading, setTransactionLoading] = useState<boolean>(false);
  const { syncVault, prevSyncVault } = useSyncContext();

  const { account } = useConnector();
  const { vaultService } = useServices();
  const { showErrorNotification } = useRpcError();

  const [loadPositionTransactions, { refetch: refetchTransactions }] =
    useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId, first: 1000 },
      fetchPolicy: "no-cache",
    });

  const fetchBalanceToken = useCallback(
    (
      fetchBalanceTokenType: FetchBalanceTokenType = FetchBalanceTokenType.FETCH
    ) => {
      if (fetchBalanceTokenType === FetchBalanceTokenType.PROMISE) {
        return vaultService
          .previewRedeem(
            BigNumber(vaultPosition?.balanceShares as string)
              .dividedBy(10 ** 18)
              .toString(),
            vault.id
          )
          .catch((error) => {
            showErrorNotification(error);
            return "-1";
          });
      }
      return vaultService
        .previewRedeem(
          BigNumber(vaultPosition?.balanceShares as string)
            .dividedBy(10 ** 18)
            .toString(),
          vault.id
        )
        .then((balanceToken: string) => {
          setBalanceToken(balanceToken);
        })
        .catch((error) => {
          setBalanceToken("-1");
          showErrorNotification(error);
        });
    },
    [vaultService, vault.id, vaultPosition, setBalanceToken]
  );

  const fetchPositionTransactions = useCallback(
    (fetchType: TransactionFetchType = TransactionFetchType.FETCH) => {
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return refetchTransactions({
            account: account.toLowerCase(),
            vault: vault.id,
            chainId,
          });
        }
        setTransactionLoading(true);

        return loadPositionTransactions({
          variables: {
            account: account.toLowerCase(),
            vault: vault.id,
            chainId,
          },
        })
          .then((res) => {
            res.data?.deposits && setDepositsList(res.data.deposits);
            res.data?.withdrawals && setWithdrawalsList(res.data.withdrawals);
          })
          .finally(() => setTransactionLoading(false));
      } else {
        setDepositsList([]);
        setWithdrawalsList([]);
        return;
      }
    },
    [
      vault,
      chainId,
      account,
      setDepositsList,
      setTransactionLoading,
      loadPositionTransactions,
      refetchTransactions,
    ]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    if (vaultPosition && vault) {
      timeout = setTimeout(() => {
        fetchBalanceToken();
        fetchPositionTransactions();
        interval = setInterval(() => fetchBalanceToken(), 15 * 1000);
      }, 200);
    }

    return () => {
      interval && clearInterval(interval);
      timeout && clearTimeout(timeout);
    };
  }, [vault, fetchBalanceToken, fetchPositionTransactions]);

  useEffect(() => {
    if (syncVault && !prevSyncVault && vaultPosition) {
      setTransactionLoading(true);
      Promise.all([
        fetchPositionTransactions(TransactionFetchType.PROMISE),
        fetchBalanceToken(FetchBalanceTokenType.PROMISE),
      ])
        .then(([transactions, balanceToken]) => {
          setBalanceToken(balanceToken as string);
          transactions?.data?.deposits &&
            setDepositsList(transactions?.data.deposits);
          transactions?.data?.withdrawals &&
            setWithdrawalsList(transactions?.data.withdrawals);
        })
        .finally(() => setTransactionLoading(false));
    }
  }, [
    syncVault,
    prevSyncVault,
    fetchPositionTransactions,
    fetchBalanceToken,
    vaultPosition,
    vault,
    setBalanceToken,
    setDepositsList,
    setWithdrawalsList,
    setTransactionLoading,
  ]);

  const balanceEarned = useMemo(() => {
    if (balanceToken === "-1") return 0;

    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    const earnedValue = BigNumber(balanceToken || "0")
      .minus(sumTokenDeposits.minus(sumTokenWithdrawals))
      .dividedBy(10 ** 18)
      .toNumber();

    return transactionsLoading
      ? -1
      : BigNumber(earnedValue).isLessThan(0.0001)
      ? 0
      : earnedValue;
  }, [
    vaultPosition,
    balanceToken,
    depositsList,
    withdrawalsList,
    transactionsLoading,
  ]);

  return {
    balanceEarned,
    balanceToken,
    manageVault,
    newVaultDeposit,
    setManageVault,
    setNewVaultDeposit,
  };
};

export default useVaultListItem;
