import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IVault,
  IVaultPosition,
  IVaultStrategy,
  IVaultStrategyReport,
  SmartContractFactory,
  VaultType,
} from "fathom-sdk";
import { FunctionFragment } from "@into-the-fathom/abi";
import BigNumber from "bignumber.js";
import { Contract } from "fathom-ethers";
import { useLazyQuery, useQuery } from "@apollo/client";

import { useServices } from "context/services";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import useRpcError from "hooks/General/useRpcError";
import {
  VAULT,
  VAULT_FACTORIES,
  VAULT_POSITION,
  VAULT_POSITION_TRANSACTIONS,
  VAULT_STRATEGY_REPORTS,
} from "apollo/queries";
import { vaultTitle } from "utils/getVaultTitleAndDescription";
import { vaultType } from "utils/getVaultType";

declare module "fathom-sdk" {
  interface IVault {
    name: string;
  }
}

interface UseVaultDetailProps {
  vaultId: string | undefined;
}

export enum VaultInfoTabs {
  ABOUT,
  STRATEGIES,
  MANAGEMENT_VAULT,
  MANAGEMENT_STRATEGY,
}

const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const VAULT_REPORTS_PER_PAGE = 1000;

const VAULT_ABI = SmartContractFactory.FathomVault("").abi;
const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;

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

const useVaultDetail = ({ vaultId }: UseVaultDetailProps) => {
  const navigate = useNavigate();
  const [vault, setVault] = useState<IVault>({} as IVault);

  const [vaultPosition, setVaultPosition] = useState<IVaultPosition>(
    {} as IVaultPosition
  );
  const [balanceToken, setBalanceToken] = useState<string>("0");

  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  const [protocolFee, setProtocolFee] = useState(0);
  const [performanceFee, setPerformanceFee] = useState(0);

  const [updateVaultPositionLoading, setUpdateVaultPositionLoading] =
    useState<boolean>(false);
  const [fetchBalanceLoading, setFetchBalanceLoading] =
    useState<boolean>(false);

  const [reports, setReports] = useState<
    Record<string, IVaultStrategyReport[]>
  >({});
  const [isReportsLoaded, setIsReportsLoaded] = useState<boolean>(false);

  const [historicalApr, setHistoricalApr] = useState<
    Record<string, IVaultStrategyHistoricalApr[]>
  >({});

  const [managedStrategiesIds, setManagedStrategiesIds] = useState<string[]>(
    []
  );
  const [isUserManager, setIsUserManager] = useState<boolean>(false);

  const [isTfVaultType, setIsTfVaultType] = useState<boolean>(false);
  const [isUserKycPassed, setIsUserKycPassed] = useState<boolean>(false);
  const [tfVaultDepositEndDate, setTfVaultDepositEndDate] = useState<
    string | null
  >(null);
  const [tfVaultLockEndDate, setTfVaultLockEndDate] = useState<string | null>(
    null
  );
  const [activeTfPeriod, setActiveTfPeriod] = useState(0);

  const { syncVault, prevSyncVault } = useSyncContext();

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    VaultInfoTabs.ABOUT
  );

  const [vaultMethods, setVaultMethods] = useState<FunctionFragment[]>([]);
  const [strategyMethods, setStrategyMethods] = useState<FunctionFragment[]>(
    []
  );

  const { chainId, account, library } = useConnector();
  const { vaultService, poolService } = useServices();
  const { showErrorNotification } = useRpcError();

  const [loadVault, { loading: vaultLoading }] = useLazyQuery(VAULT, {
    context: { clientName: "vaults", chainId },
    fetchPolicy: "network-only",
  });

  const [loadPosition, { loading: vaultPositionLoading }] = useLazyQuery(
    VAULT_POSITION,
    {
      context: { clientName: "vaults", chainId },
      fetchPolicy: "no-cache",
    }
  );

  const [loadReports] = useLazyQuery(VAULT_STRATEGY_REPORTS, {
    context: { clientName: "vaults", chainId },
    variables: { chainId },
    fetchPolicy: "no-cache",
  });

  const [
    loadPositionTransactions,
    { loading: transactionsLoading, refetch: refetchTransactions },
  ] = useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
    context: { clientName: "vaults", chainId },
    variables: { chainId, first: 1000 },
    fetchPolicy: "no-cache",
  });

  const { data: vaultsFactories, loading: vaultsFactoriesLoading } = useQuery(
    VAULT_FACTORIES,
    {
      context: { clientName: "vaults", chainId },
      fetchPolicy: "network-only",
      variables: {
        chainId,
      },
    }
  );

  useEffect(() => {
    if (
      vaultId &&
      vaultType[vaultId.toLowerCase()] &&
      vaultType[vaultId.toLowerCase()] === VaultType.TRADEFLOW
    ) {
      setIsTfVaultType(true);
    } else {
      setIsTfVaultType(false);
    }
  }, [vaultId]);

  const fetchReports = (
    strategyId: string,
    prevStateReports: IVaultStrategyReport[] = [],
    prevStateApr: IVaultStrategyHistoricalApr[] = []
  ) => {
    loadReports({
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
        data?.strategyReports?.length &&
        data?.strategyReports?.length % VAULT_REPORTS_PER_PAGE === 0
      ) {
        fetchReports(
          strategyId,
          [...prevStateReports, ...(data?.strategyReports || [])],
          [...prevStateApr, ...(data?.strategyHistoricalAprs || [])]
        );
      } else {
        setReports((prev) => ({
          ...prev,
          [strategyId]: [...prevStateReports, ...(data?.strategyReports || [])],
        }));
        setHistoricalApr((prev) => ({
          ...prev,
          [strategyId]: [
            ...prevStateApr,
            ...(data?.strategyHistoricalAprs || []),
          ],
        }));
        setIsReportsLoaded(true);
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
      }, 300);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vault, chainId]);

  useEffect(() => {
    if (!vaultsFactoriesLoading && vaultsFactories) {
      const { factories, accountants } = vaultsFactories;
      const protocolFeeRes = factories[0].protocolFee;
      const performanceFeeRes = accountants[0].performanceFee;

      if (protocolFeeRes) {
        setProtocolFee(protocolFeeRes / 100);
      }
      if (performanceFeeRes) {
        setPerformanceFee(performanceFeeRes / 100);
      }
    }
  }, [vaultsFactories, vaultsFactoriesLoading]);

  const updateVaultDepositLimit = async (
    vaultData: IVault,
    account: string,
    isTfVaultType: boolean
  ) => {
    let depositLimitValue = vaultData.depositLimit;
    try {
      if (account && isTfVaultType) {
        depositLimitValue = await vaultService.getDepositLimit(
          vaultData.id,
          account,
          isTfVaultType
        );
      }

      const updatedVault = {
        ...vaultData,
        depositLimit: depositLimitValue,
        name: vaultTitle[vaultData.id.toLowerCase()]
          ? vaultTitle[vaultData.id.toLowerCase()]
          : vaultData.token.name,
        type: vaultType[vaultData.id.toLowerCase()]
          ? vaultType[vaultData.id.toLowerCase()]
          : VaultType.DEFAULT,
      };

      setVault(updatedVault);
    } catch (error) {
      console.error("Error updating vault deposit limit:", error);
    }
  };

  useEffect(() => {
    if (!vaultId) {
      navigate("/vaults");
    } else {
      loadVault({
        variables: {
          id: vaultId,
          chainId,
        },
      }).then((res) => {
        if (!res.data?.vault) {
          navigate("/vaults");
        } else {
          const vaultData = res.data.vault;

          updateVaultDepositLimit(vaultData, account, isTfVaultType);
        }
      });

      /**
       * Fetch additional data for strategies
       */
      if (vault && vault?.strategies && vault?.strategies?.length) {
        const promises: Promise<boolean>[] = [];
        vault?.strategies.forEach((strategy: IVaultStrategy) => {
          promises.push(vaultService.isStrategyShutdown(strategy.id));
        });

        Promise.all(promises).then((response) => {
          const strategies = vault?.strategies.map(
            (strategy: IVaultStrategy, index: number) => {
              return {
                ...strategy,
                isShutdown: response[index],
              };
            }
          );

          setVault((prev) => ({
            ...prev,
            strategies,
          }));
        });
      }
    }
  }, [loadVault, vaultId, account, isTfVaultType, chainId]);

  useEffect(() => {
    if (vaultId && account && isTfVaultType) {
      vaultService.kycPassed(vaultId, account).then((res) => {
        setIsUserKycPassed(res);
      });
    }
  }, [vaultId, account, isTfVaultType]);

  useEffect(() => {
    if (isTfVaultType && vault.strategies?.length) {
      vaultService
        .getTradeFlowVaultDepositEndDate(vault.strategies[0].id)
        .then((res) => {
          setTfVaultDepositEndDate(res);
        });

      vaultService
        .getTradeFlowVaultLockEndDate(vault.strategies[0].id)
        .then((res) => {
          setTfVaultLockEndDate(res);
        });
    }
  }, [vault, isTfVaultType]);

  useEffect(() => {
    if (tfVaultDepositEndDate === null || tfVaultLockEndDate === null) return;
    const now = new Date();
    let activePeriod = 2;

    if (now < new Date(Number(tfVaultLockEndDate) * 1000)) {
      activePeriod = 1;
    }
    if (now < new Date(Number(tfVaultDepositEndDate) * 1000)) {
      activePeriod = 0;
    }

    setActiveTfPeriod(activePeriod);
  }, [tfVaultDepositEndDate, tfVaultLockEndDate, setActiveTfPeriod]);

  const fetchVaultPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      loadPosition({
        variables: { account: account.toLowerCase(), vault: vaultId },
      }).then(async (res) => {
        if (
          res.data?.accountVaultPositions &&
          res.data?.accountVaultPositions.length
        ) {
          const position = res.data.accountVaultPositions[0];

          try {
            setUpdateVaultPositionLoading(true);
            const balance = await poolService.getUserTokenBalance(
              account,
              position.shareToken.id
            );

            const previewRedeemValue = await vaultService.previewRedeem(
              balance.toString(),
              position.vault.id
            );

            const updatedVaultPosition = {
              ...position,
              balanceShares: balance.toString(),
              balancePosition: BigNumber(previewRedeemValue.toString())
                .dividedBy(10 ** 18)
                .toString(),
            };

            setVaultPosition(updatedVaultPosition);
            resolve(updatedVaultPosition);
          } catch (error) {
            console.error("Error updating vault position:", error);
            setVaultPosition(position);
            reject(position);
          } finally {
            setUpdateVaultPositionLoading(false);
          }
        } else {
          setVaultPosition({} as IVaultPosition);
          resolve({});
        }
      });
    });
  }, [
    poolService,
    vaultService,
    vaultId,
    account,
    loadPosition,
    setVaultPosition,
    setUpdateVaultPositionLoading,
  ]);

  useEffect(() => {
    if (account && vault.id && vaultService) {
      fetchVaultPosition();
    } else {
      setVaultPosition({} as IVaultPosition);
    }
  }, [fetchVaultPosition, account, vault, vaultService, setVaultPosition]);

  useEffect(() => {
    try {
      const methods = (VAULT_ABI as FunctionFragment[]).filter(
        (item: FunctionFragment) => item.type === "function"
      );

      setVaultMethods(methods);
    } catch (e: any) {
      console.error(e);
    }
  }, [setVaultMethods]);

  useEffect(() => {
    try {
      const methods = (STRATEGY_ABI as FunctionFragment[]).filter(
        (item: FunctionFragment) => item.type === "function"
      );

      setStrategyMethods(methods);
    } catch (e: any) {
      console.error(e);
    }
  }, [setStrategyMethods]);

  const fetchBalanceToken = useCallback(
    (
      fetchBalanceTokenType: FetchBalanceTokenType = FetchBalanceTokenType.FETCH
    ) => {
      if (fetchBalanceTokenType === FetchBalanceTokenType.PROMISE) {
        setFetchBalanceLoading(true);
        return vaultService
          .previewRedeem(
            BigNumber(vaultPosition?.balanceShares as string)
              .dividedBy(10 ** 18)
              .toString(),
            vault.id
          )
          .catch((error) => {
            console.error("Error fetching balance token:", error);
            showErrorNotification(error);
            return "-1";
          })
          .finally(() => setFetchBalanceLoading(false));
      }

      if (BigNumber(vaultPosition?.balanceShares).isGreaterThan(0)) {
        setFetchBalanceLoading(true);
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
            console.error("Error fetching balance token:", error);
            setBalanceToken("-1");
            showErrorNotification(error);
          })
          .finally(() => setFetchBalanceLoading(false));
      } else {
        setBalanceToken("-1");
        return;
      }
    },
    [
      vaultService,
      vault,
      vaultPosition,
      setBalanceToken,
      setFetchBalanceLoading,
    ]
  );

  const fetchPositionTransactions = useCallback(
    (fetchType: TransactionFetchType = TransactionFetchType.FETCH) => {
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return refetchTransactions({
            account: account.toLowerCase(),
            vault: vault.id,
          });
        }

        return loadPositionTransactions({
          variables: {
            account: account.toLowerCase(),
            vault: vault.id,
          },
        }).then((res) => {
          res.data?.deposits && setDepositsList(res.data.deposits);
          res.data?.withdrawals && setWithdrawalsList(res.data.withdrawals);
        });
      } else {
        setDepositsList([]);
        setWithdrawalsList([]);
        return;
      }
    },
    [
      account,
      vault,
      setDepositsList,
      loadPositionTransactions,
      refetchTransactions,
    ]
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;
    if (
      vaultPosition &&
      vault.id &&
      !vaultPositionLoading &&
      !updateVaultPositionLoading
    ) {
      timeout = setTimeout(() => {
        fetchBalanceToken();
        fetchPositionTransactions();
        /**
         * Fetch balance token every 60 seconds
         */
        interval = setInterval(fetchBalanceToken, 60 * 1000);
      }, 300);
    }
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [
    vault,
    fetchBalanceToken,
    fetchPositionTransactions,
    vaultPositionLoading,
    updateVaultPositionLoading,
  ]);

  useEffect(() => {
    if (syncVault && !prevSyncVault && vaultPosition && vault.id) {
      fetchVaultPosition().then(() => {
        Promise.all([
          fetchPositionTransactions(TransactionFetchType.PROMISE),
          fetchBalanceToken(FetchBalanceTokenType.PROMISE),
        ]).then(([transactions, balanceToken]) => {
          setBalanceToken(balanceToken as string);
          transactions?.data?.deposits &&
            setDepositsList(transactions?.data.deposits);
          transactions?.data?.withdrawals &&
            setWithdrawalsList(transactions?.data.withdrawals);
        });
      });
    }
  }, [
    fetchVaultPosition,
    vaultPosition,
    vault,
    syncVault,
    prevSyncVault,
    fetchPositionTransactions,
    fetchBalanceToken,
    setBalanceToken,
    setDepositsList,
    setWithdrawalsList,
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

    return transactionsLoading || fetchBalanceLoading
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
    fetchBalanceLoading,
  ]);

  const executeHasRoleMethod = async (): Promise<boolean> => {
    if (vault === null) {
      return false;
    }
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

  const getStrategiesIds = useMemo(() => {
    const strategyIdsPromises = (vault?.strategies || []).map(
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
    if (vault.id && account) {
      getStrategiesIds.then((authorizedIds) =>
        setManagedStrategiesIds(authorizedIds)
      );
    } else {
      setManagedStrategiesIds([]);
    }
  }, [vault, account, getStrategiesIds]);

  useEffect(() => {
    if (vault.id && account) {
      executeHasRoleMethod().then((isManager) => setIsUserManager(isManager));
    } else {
      setIsUserManager(false);
    }
  }, [vault, account]);

  return {
    vault,
    vaultLoading,
    vaultPosition,
    vaultPositionLoading,
    reports,
    historicalApr,
    balanceEarned,
    balanceToken,
    protocolFee,
    performanceFee,
    activeVaultInfoTab,
    vaultMethods,
    strategyMethods,
    setActiveVaultInfoTab,
    managedStrategiesIds,
    isUserManager,
    updateVaultPositionLoading,
    isReportsLoaded,
    isUserKycPassed,
    isTfVaultType,
    tfVaultDepositEndDate,
    tfVaultLockEndDate,
    activeTfPeriod,
  };
};

export default useVaultDetail;
