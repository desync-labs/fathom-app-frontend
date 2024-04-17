import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IVault,
  IVaultPosition,
  IVaultStrategy,
  IVaultStrategyReport,
} from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useServices } from "context/services";
import useConnector from "context/connector";
import { useLazyQuery } from "@apollo/client";
import {
  VAULT_POSITION_TRANSACTIONS,
  VAULT_STRATEGY_REPORTS,
} from "apollo/queries";
import useSyncContext from "context/sync";

interface UseVaultListItemProps {
  vaultPosition: IVaultPosition | null | undefined;
  vault: IVault;
}

export enum VaultInfoTabs {
  POSITION,
  ABOUT,
  STRATEGIES,
}

const VAULT_REPORTS_PER_PAGE = 1000;

export type IVaultStrategyHistoricalApr = {
  id: string;
  apr: string;
  timestamp: string;
};

enum TransactionFetchType {
  FETCH = "fetch",
  PROMISE = "promise",
}

enum FetchBalanceTokenType {
  PROMISE = "promise",
  FETCH = "fetch",
}

const useVaultListItem = ({ vaultPosition, vault }: UseVaultListItemProps) => {
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);
  const [balanceToken, setBalanceToken] = useState<string>("0");

  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [transactionsLoading, setTransactionLoading] = useState<boolean>(false);

  const [reports, setReports] = useState<
    Record<string, IVaultStrategyReport[]>
  >({});

  const [historicalApr, setHistoricalApr] = useState<
    Record<string, IVaultStrategyHistoricalApr[]>
  >({});

  const { syncVault, prevSyncVault } = useSyncContext();

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    vaultPosition && BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
      ? VaultInfoTabs.POSITION
      : VaultInfoTabs.ABOUT
  );

  const { account } = useConnector();
  const { vaultService } = useServices();

  const [loadReports, { fetchMore: fetchMoreReports }] = useLazyQuery(
    VAULT_STRATEGY_REPORTS,
    {
      context: { clientName: "vaults" },
    }
  );

  const [loadPositionTransactions, { refetch: refetchTransactions }] =
    useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
      context: { clientName: "vaults" },
    });

  const fetchReports = useCallback(
    (
      strategyId: string,
      prevStateReports: IVaultStrategyReport[] = [],
      prevStateApr: IVaultStrategyHistoricalApr[] = []
    ) => {
      (!prevStateReports.length ? loadReports : fetchMoreReports)({
        variables: {
          strategy: strategyId,
          reportsFirst: VAULT_REPORTS_PER_PAGE,
          reportsSkip: prevStateReports.length,
        },
      }).then((response) => {
        const { data } = response;

        if (
          data?.strategyReports &&
          data?.strategyReports.length &&
          data?.strategyReports.length % VAULT_REPORTS_PER_PAGE === 0
        ) {
          fetchReports(
            strategyId,
            [...prevStateReports, ...data.strategyReports],
            [...prevStateApr, ...data.strategyHistoricalAprs]
          );
        } else {
          setReports((prev) => ({
            ...prev,
            [strategyId]: [...prevStateReports, ...data.strategyReports],
          }));
          setHistoricalApr((prev) => ({
            ...prev,
            [strategyId]: [...prevStateApr, ...data.strategyHistoricalAprs],
          }));
        }
      });
    },
    [loadReports, fetchMoreReports, setReports, setHistoricalApr]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (vault && vault?.strategies && vault?.strategies?.length) {
      vault?.strategies.forEach((strategy: IVaultStrategy) => {
        fetchReports(strategy.id, [], []);
      });
      /**
       * Refetch reports every 30 seconds
       */
      interval = setInterval(() => {
        vault?.strategies.forEach((strategy: IVaultStrategy) => {
          fetchReports(strategy.id, [], []);
        });
      }, 30 * 1000);
    }

    return () => clearInterval(interval);
  }, [vault, fetchReports]);

  useEffect(() => {
    if (
      vaultPosition &&
      BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
    ) {
      setActiveVaultInfoTab(VaultInfoTabs.POSITION);
    } else if (activeVaultInfoTab === VaultInfoTabs.POSITION) {
      setActiveVaultInfoTab(VaultInfoTabs.ABOUT);
    }
  }, [vaultPosition]);

  const fetchBalanceToken = useCallback(
    (
      fetchBalanceTokenType: FetchBalanceTokenType = FetchBalanceTokenType.FETCH
    ) => {
      if (fetchBalanceTokenType === FetchBalanceTokenType.PROMISE) {
        return vaultService.previewRedeem(
          BigNumber(vaultPosition?.balanceShares as string)
            .dividedBy(10 ** 18)
            .toString(),
          vault.id
        );
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
        });
    },
    [vaultService, vault.id, vaultPosition, setBalanceToken]
  );

  const fetchPositionTransactions = useCallback(
    (fetchType: TransactionFetchType = TransactionFetchType.FETCH) => {
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return refetchTransactions({
            variables: { account: account.toLowerCase() },
          });
        }

        setTransactionLoading(true);

        return loadPositionTransactions({
          variables: {
            account: account.toLowerCase(),
            vault: vault.id,
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
      account,
      setDepositsList,
      setTransactionLoading,
      loadPositionTransactions,
      refetchTransactions,
    ]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (vaultPosition && vault) {
      fetchBalanceToken();
      fetchPositionTransactions();
      interval = setInterval(fetchBalanceToken, 15 * 1000);
    }
    return () => clearInterval(interval);
  }, [vault, fetchBalanceToken, fetchPositionTransactions]);

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
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
    vaultPosition,
    vault,
    setBalanceToken,
    setDepositsList,
    setWithdrawalsList,
    setTransactionLoading,
  ]);

  const balanceEarned = useMemo(() => {
    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    return transactionsLoading
      ? -1
      : BigNumber(balanceToken || "0")
          .minus(sumTokenDeposits.minus(sumTokenWithdrawals))
          .dividedBy(10 ** 18)
          .toNumber();
  }, [
    vaultPosition,
    balanceToken,
    depositsList,
    withdrawalsList,
    transactionsLoading,
  ]);

  return {
    reports,
    historicalApr,
    balanceEarned,
    balanceToken,
    manageVault,
    newVaultDeposit,
    activeVaultInfoTab,
    setActiveVaultInfoTab,
    setManageVault,
    setNewVaultDeposit,
  };
};

export default useVaultListItem;
