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

const useVaultListItem = ({ vaultPosition, vault }: UseVaultListItemProps) => {
  const [extended, setExtended] = useState<boolean>(true);
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

  const [loadPositionTransactions] = useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
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

  const fetchBalanceToken = useCallback(() => {
    vaultService
      .previewRedeem(
        BigNumber(vaultPosition?.balanceShares as string)
          .dividedBy(10 ** 18)
          .toString(),
        vault.id
      )
      .then((balanceToken: string) => {
        setBalanceToken(balanceToken);
      });
  }, [vaultService, vault.id, vaultPosition, setBalanceToken]);

  const fetchPositionTransactions = useCallback(() => {
    if (account) {
      setTransactionLoading(true);
      loadPositionTransactions({
        variables: { account: account.toLowerCase() },
      })
        .then((res) => {
          res.data?.deposits && setDepositsList(res.data.deposits);
          res.data?.withdrawals && setWithdrawalsList(res.data.withdrawals);
        })
        .finally(() => setTransactionLoading(false));
    } else {
      setDepositsList([]);
      setWithdrawalsList([]);
    }
  }, [account, setDepositsList, setTransactionLoading]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (vaultPosition && vault) {
      fetchBalanceToken();
      fetchPositionTransactions();
      interval = setInterval(fetchBalanceToken, 15 * 1000);
    }
    return () => clearInterval(interval);
  }, [vaultPosition, vault, fetchBalanceToken, fetchPositionTransactions]);

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
      fetchPositionTransactions();
      fetchBalanceToken();
    }
  }, [syncVault, prevSyncVault, fetchPositionTransactions]);

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
      ? 0
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
    extended,
    activeVaultInfoTab,
    setActiveVaultInfoTab,
    setExtended,
    setManageVault,
    setNewVaultDeposit,
  };
};

export default useVaultListItem;
