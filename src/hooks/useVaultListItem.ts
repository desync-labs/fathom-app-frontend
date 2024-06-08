import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IVault,
  IVaultPosition,
  IVaultStrategy,
  IVaultStrategyReport,
  SmartContractFactory,
} from "fathom-sdk";
import BigNumber from "bignumber.js";
import { Contract } from "fathom-ethers";
import { useLazyQuery } from "@apollo/client";

import { useServices } from "context/services";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import useRpcError from "hooks/useRpcError";
import {
  VAULT_POSITION_TRANSACTIONS,
  VAULT_STRATEGY_REPORTS,
} from "apollo/queries";

interface UseVaultListItemProps {
  vaultPosition: IVaultPosition | null | undefined;
  vault: IVault;
}

export enum VaultInfoTabs {
  POSITION,
  ABOUT,
  STRATEGIES,
  MANAGEMENT_VAULT,
  MANAGEMENT_STRATEGY,
}

const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
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
  const { chainId } = useConnector();

  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);
  const [transactionsLoading, setTransactionLoading] = useState<boolean>(false);

  const [reports, setReports] = useState<
    Record<string, IVaultStrategyReport[]>
  >({});

  const [historicalApr, setHistoricalApr] = useState<
    Record<string, IVaultStrategyHistoricalApr[]>
  >({});

  const [managedStrategiesIds, setManagedStrategiesIds] = useState<string[]>(
    []
  );
  const [isUserManager, setIsUserManager] = useState<boolean>(false);

  const { syncVault, prevSyncVault } = useSyncContext();

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    vaultPosition && BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
      ? VaultInfoTabs.POSITION
      : VaultInfoTabs.ABOUT
  );

  const { account, library } = useConnector();
  const { vaultService } = useServices();
  const { showErrorNotification } = useRpcError();

  const [loadReports, { fetchMore: fetchMoreReports }] = useLazyQuery(
    VAULT_STRATEGY_REPORTS,
    {
      context: { clientName: "vaults", chainId },
      variables: { chainId },
      fetchPolicy: "no-cache",
    }
  );

  const [loadPositionTransactions, { refetch: refetchTransactions }] =
    useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId, first: 1000 },
      fetchPolicy: "no-cache",
    });

  const fetchReports = (
    strategyId: string,
    prevStateReports: IVaultStrategyReport[] = [],
    prevStateApr: IVaultStrategyHistoricalApr[] = []
  ) => {
    (!prevStateReports.length ? loadReports : fetchMoreReports)({
      variables: {
        strategy: strategyId,
        reportsFirst: VAULT_REPORTS_PER_PAGE,
        reportsSkip: prevStateReports.length,
        chainId,
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
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (vault && vault?.strategies && vault?.strategies?.length) {
      timeout = setTimeout(() => {
        vault?.strategies.forEach((strategy: IVaultStrategy) => {
          /**
           * Clear reports and historical APRs necessary for chain switch
           */
          setReports((prev) => ({
            ...prev,
            [strategy.id]: [],
          }));
          setHistoricalApr((prev) => ({
            ...prev,
            [strategy.id]: [],
          }));
          fetchReports(strategy.id, [], []);
        });
      }, 500);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vault, chainId]);

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
        interval = setInterval(fetchBalanceToken, 15 * 1000);
      }, 200);
    }

    return () => {
      interval && clearInterval(interval);
      timeout && clearTimeout(timeout);
    };
  }, [vault, fetchBalanceToken, fetchPositionTransactions]);

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
      setTransactionLoading(true);
      console.log("promise loading sync");
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

  const executeHasRoleMethod = async (): Promise<boolean> => {
    try {
      const VAULT_ABI = SmartContractFactory.FathomVault("").abi;
      const vaultContract = new Contract(vault.id, VAULT_ABI, library);

      return await vaultContract.hasRole(DEFAULT_ADMIN_ROLE, account);
    } catch (error) {
      console.error(
        `Failed to execute hasRole method for vault ${vault.id}:`,
        error
      );
      return false;
    }
  };

  const executeManagementMethod = async (
    strategyId: string
  ): Promise<boolean> => {
    const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;
    try {
      const strategyContract = new Contract(strategyId, STRATEGY_ABI, library);

      const result = await strategyContract.management();
      return result.includes(account);
    } catch (error) {
      console.error(
        `Failed to execute management method for strategy ${strategyId}:`,
        error
      );
      return false;
    }
  };

  const getStrategiesIds = useCallback(() => {
    const strategyIdsPromises = (vault.strategies || []).map(
      async (strategy: IVaultStrategy) => {
        const isUserAuthorized = await executeManagementMethod(strategy.id);
        return isUserAuthorized ? strategy.id : null;
      }
    );

    return Promise.all(strategyIdsPromises).then(
      (authorizedIds) => authorizedIds.filter((id) => id !== null) as string[]
    );
  }, [vault]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (vault && account) {
      timeout = setTimeout(() => {
        getStrategiesIds().then((ids) => setManagedStrategiesIds(ids));
      }, 500);
    } else {
      setManagedStrategiesIds([]);
    }

    return () => timeout && clearTimeout(timeout);
  }, [vault, account, chainId, getStrategiesIds]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (vault && account) {
      timeout = setTimeout(() => {
        executeHasRoleMethod().then(setIsUserManager);
      }, 500);
    } else {
      setIsUserManager(false);
    }
    return () => timeout && clearTimeout(timeout);
  }, [vault, account, chainId]);

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
    managedStrategiesIds,
    isUserManager,
  };
};

export default useVaultListItem;
