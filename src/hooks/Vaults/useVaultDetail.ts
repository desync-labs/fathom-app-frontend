import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import {
  getDefaultVaultTitle,
  vaultTitle,
} from "utils/Vaults/getVaultTitleAndDescription";
import { vaultType } from "utils/Vaults/getVaultType";
import dayjs from "dayjs";
import { getVaultLockEndDate } from "utils/Vaults/getVaultLockEndDate";
import { ChainId } from "connectors/networks";
import { TRADE_FI_VAULT_REPORT_STEP } from "utils/Constants";
import { useAprNumber } from "hooks/Vaults/useApr";

declare module "fathom-sdk" {
  interface IVault {
    name: string;
  }
}

interface UseVaultDetailProps {
  vaultId: string | undefined;
  urlParams: string | undefined;
}

export enum VaultInfoTabs {
  ABOUT = "about",
  STRATEGIES = "strategies",
  MANAGEMENT_VAULT = "management-vault",
  MANAGEMENT_STRATEGY = "management-strategy",
}

const DEFAULT_ADMIN_ROLE =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const VAULT_REPORTS_PER_PAGE = 1000;

const VAULT_ABI = SmartContractFactory.FathomVault("").abi;
const STRATEGY_ABI = SmartContractFactory.FathomVaultStrategy("").abi;
const TRADE_FLOW_VAULT_ABI = SmartContractFactory.FathomTradeFlowVault("").abi;
const TRADE_FLOW_STRATEGY_ABI =
  SmartContractFactory.FathomTradeFlowStrategy("").abi;

export type IVaultStrategyHistoricalApr = {
  id: string;
  apr: string;
  timestamp: string;
};

enum TransactionFetchType {
  FETCH = "fetch",
  PROMISE = "promise",
}

const useVaultDetail = ({ vaultId, urlParams }: UseVaultDetailProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [vault, setVault] = useState<IVault>({} as IVault);

  const [vaultPosition, setVaultPosition] = useState<IVaultPosition>(
    {} as IVaultPosition
  );
  const [balanceToken, setBalanceToken] = useState<string>("0");

  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  const [protocolFee, setProtocolFee] = useState(0);
  const [performanceFee, setPerformanceFee] = useState(0);

  const [minimumDeposit, setMinimumDeposit] = useState<number>(0.0000000001);

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

  const [tfVaultDepositEndTimeLoading, setTfVaultDepositEndTimeLoading] =
    useState<boolean>(false);
  const [tfVaultLockEndTimeLoading, setTfVaultLockEndTimeLoading] =
    useState<boolean>(false);

  const [activeTfPeriod, setActiveTfPeriod] = useState<number>(0);
  const [tfVaultDepositLimit, setTfVaultDepositLimit] = useState<string>("0");

  const { syncVault, prevSyncVault, setLastTransactionBlock } =
    useSyncContext();

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    VaultInfoTabs.ABOUT
  );

  const apr = useAprNumber(vault);

  const [vaultMethods, setVaultMethods] = useState<FunctionFragment[]>([]);
  const [strategyMethods, setStrategyMethods] = useState<FunctionFragment[]>(
    []
  );
  const [isWithdrawAllLoading, setIsWithdrawAllLoading] =
    useState<boolean>(false);
  const [isShowWithdrawAllButtonLoading, setIsShowWithdrawAllButtonLoading] =
    useState<boolean>(true);

  const { chainId, account, library } = useConnector();
  const { vaultService, poolService } = useServices();
  const { showErrorNotification } = useRpcError();

  const [loadVault, { loading: vaultLoading }] = useLazyQuery(VAULT, {
    context: { clientName: "vaults", chainId },
    fetchPolicy: "no-cache",
  });

  const [loadPosition, { loading: vaultPositionLoading }] = useLazyQuery(
    VAULT_POSITION,
    {
      context: { clientName: "vaults", chainId },
      fetchPolicy: "no-cache",
    }
  );

  const [loadReports, { loading: reportsLoading }] = useLazyQuery(
    VAULT_STRATEGY_REPORTS,
    {
      context: { clientName: "vaults", chainId },
      variables: { chainId },
      fetchPolicy: "no-cache",
    }
  );

  const [loadPositionTransactions, { loading: transactionsLoading }] =
    useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
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
      vaultType[vaultId.toLowerCase()] === VaultType.TRADEFI
    ) {
      setIsTfVaultType(true);
    } else {
      setIsTfVaultType(false);
    }
  }, [vaultId]);

  const fetchReports = (
    strategyId: string,
    prevStateReports: IVaultStrategyReport[] = [],
    prevStateApr: IVaultStrategyHistoricalApr[] = [],
    isTfVault = false
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
          [...prevStateApr, ...(data?.strategyHistoricalAprs || [])],
          isTfVault
        );
      } else {
        setReports((prev) => ({
          ...prev,
          [strategyId]: [...prevStateReports, ...(data?.strategyReports || [])],
        }));
        if (!isTfVault) {
          setHistoricalApr((prev) => ({
            ...prev,
            [strategyId]: [
              ...prevStateApr,
              ...(data?.strategyHistoricalAprs || []),
            ],
          }));
        }

        setIsReportsLoaded(true);
      }
    });
  };

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (vault?.strategies && vault?.strategies?.length) {
      /**
       * Fetch reports for TradeFi vault only after the lock period is end.
       */
      if (isTfVaultType && activeTfPeriod < 2) {
        return;
      }
      timeout = setTimeout(() => {
        vault?.strategies.forEach((strategy: IVaultStrategy) => {
          /**
           * Clear reports and historical APRs necessary for chain switch only for non-TradeFi vaults
           */
          setReports((prev) => ({
            ...prev,
            [strategy.id]: [],
          }));
          setHistoricalApr((prev) => ({
            ...prev,
            [strategy.id]: [],
          }));
          fetchReports(strategy.id, [], [], isTfVaultType);
        });
      }, 300);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vault?.strategies, chainId, isTfVaultType, activeTfPeriod]);

  useEffect(() => {
    if (!tfVaultLockEndDate || !tfVaultDepositEndDate) return;

    const now = dayjs();
    const lockEndDate = dayjs.unix(Number(tfVaultLockEndDate));
    const depositEndDate = dayjs.unix(Number(tfVaultDepositEndDate));

    if (
      isTfVaultType &&
      now.isAfter(depositEndDate) &&
      now.isBefore(lockEndDate) &&
      apr &&
      BigNumber(vault?.balanceTokens).isGreaterThan(0)
    ) {
      const countOfHours = now.isBefore(lockEndDate)
        ? now.diff(depositEndDate, "hour")
        : lockEndDate.diff(depositEndDate, "hour");

      if (BigNumber(countOfHours).isGreaterThan(0)) {
        const reports: { gain: string; timestamp: string; loss: string }[] = [];

        for (let i = 0; i <= countOfHours; i++) {
          if (i % TRADE_FI_VAULT_REPORT_STEP === 0) {
            const timestamp = (
              Number(depositEndDate.add(i, "hour").unix()) * 1000
            ).toString();

            const gain = BigNumber(apr)
              .dividedBy(100)
              .multipliedBy(vault.balanceTokens)
              .dividedBy(365 * 24)
              .multipliedBy(TRADE_FI_VAULT_REPORT_STEP)
              .dividedBy(10 ** 18)
              .toString();

            reports.push({
              timestamp,
              gain: BigNumber(gain)
                .multipliedBy(10 ** 18)
                .toString(),
              loss: "0",
            });
          }
        }

        setReports((prev) => ({
          ...prev,
          [vault.strategies[0].id]: reports as IVaultStrategyReport[],
        }));
      }
      setIsReportsLoaded(true);
    }
  }, [
    isTfVaultType,
    tfVaultLockEndDate,
    tfVaultDepositEndDate,
    apr,
    vault?.balanceTokens,
    setReports,
    setIsReportsLoaded,
  ]);

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
  }, [vaultsFactoriesLoading, vaultsFactories]);

  const updateVaultDepositLimit = async (
    vaultData: IVault,
    account: string
  ) => {
    let depositLimitValue = vaultData.depositLimit;
    try {
      const type = vaultType[vaultData.id.toLowerCase()] || VaultType.DEFAULT;

      depositLimitValue = await vaultService.getDepositLimit(
        vaultData.id,
        type === VaultType.TRADEFI,
        account
      );

      if (type === VaultType.TRADEFI && !account) {
        depositLimitValue = "0";
      }

      if (
        type === VaultType.TRADEFI &&
        BigNumber(depositLimitValue).isEqualTo(0)
      ) {
        depositLimitValue = BigNumber(vaultData.strategies[0].maxDebt)
          .minus(vaultData.balanceTokens)
          .toString();
      }

      setTfVaultDepositLimit(depositLimitValue);

      const updatedVault = {
        ...vaultData,
        depositLimit: BigNumber(depositLimitValue).toString(),
        name: vaultTitle[vaultData.id.toLowerCase()]
          ? vaultTitle[vaultData.id.toLowerCase()]
          : getDefaultVaultTitle(
              vaultType[vaultData.id.toLowerCase()] || VaultType.DEFAULT,
              vaultData.token.name,
              vaultData.id
            ),
        type,
      };

      setVault(updatedVault);

      /**
       * Min Deposit for TradeFlow vaults is 10,000
       * Min Deposit for other vaults is 0.0000000001
       */
      setMinimumDeposit(
        updatedVault.type === VaultType.TRADEFI
          ? BigNumber(await vaultService.getMinUserDeposit(vaultData.id))
              .dividedBy(10 ** 18)
              .toNumber()
          : 0.0000000001
      );

      return updatedVault;
    } catch (error) {
      console.error("Error updating vault deposit limit:", error);
      setVault(vaultData);
      return vaultData;
    }
  };

  const fetchVault = useCallback(
    (vaultId: string, chainId: ChainId) => {
      loadVault({
        variables: {
          id: vaultId,
          chainId,
        },
      }).then(async (res) => {
        if (!res.data?.vault) {
          navigate("/vaults");
        } else {
          let vaultData = res.data.vault;

          setVault(vaultData);

          vaultData = await updateVaultDepositLimit(vaultData, account);
          /**
           * Fetch additional data for strategies
           */
          if (
            vaultData &&
            vaultData?.strategies &&
            vaultData?.strategies?.length
          ) {
            if (vaultData.type === VaultType.TRADEFI) {
              const strategies = vaultData?.strategies.map(
                (strategy: IVaultStrategy) => {
                  return {
                    ...strategy,
                    isShutdown: false,
                  };
                }
              );

              setVault({
                ...vaultData,
                strategies,
              });
            } else {
              const promises: Promise<boolean>[] = [];
              vaultData?.strategies.forEach((strategy: IVaultStrategy) => {
                promises.push(vaultService.isStrategyShutdown(strategy.id));
              });

              Promise.all(promises).then((response) => {
                const strategies = vaultData?.strategies.map(
                  (strategy: IVaultStrategy, index: number) => {
                    return {
                      ...strategy,
                      isShutdown: response[index],
                    };
                  }
                );

                setVault({
                  ...vaultData,
                  strategies,
                });
              });
            }
          }
        }
      });
    },
    [loadVault, setVault, navigate, vaultService, account]
  );

  useEffect(() => {
    let params: string | string[] = urlParams || "";
    params = params.split("/");
    const tabIndex = params.indexOf("tab");
    if (tabIndex !== -1) {
      const activeTab = params[tabIndex + 1];
      setActiveVaultInfoTab(activeTab as VaultInfoTabs);
    }
  }, [urlParams, setActiveVaultInfoTab]);

  const setActiveVaultInfoTabHandler = useCallback(
    (value: VaultInfoTabs) => {
      let params: string | string[] = urlParams || "";
      params = params ? params.split("/") : [];
      const index = params.indexOf("tab");
      if (index !== -1) {
        const replaceString = `tab/${params[index + 1]}`;
        window.history.replaceState(
          undefined,
          "",
          `#${location.pathname.replace(
            replaceString,
            "tab/" + value.toLowerCase()
          )}`
        );
      } else {
        window.history.replaceState(
          undefined,
          "",
          `#${location.pathname}/tab/${value.toLowerCase()}`
        );
      }

      setActiveVaultInfoTab(value);
    },
    [setActiveVaultInfoTab, location, navigate, urlParams]
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!vaultId) {
      navigate("/vaults");
    } else if (!vaultLoading) {
      timeout = setTimeout(() => {
        fetchVault(vaultId, chainId);
      }, 150);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [vaultId, chainId, account, fetchVault]);

  useEffect(() => {
    if (syncVault && !prevSyncVault && vaultId && !vaultLoading) {
      fetchVault(vaultId, chainId);
    }
  }, [syncVault, prevSyncVault, vaultId, chainId]);

  useEffect(() => {
    if (vaultId && account && isTfVaultType) {
      vaultService.kycPassed(vaultId, account).then((res) => {
        setIsUserKycPassed(res);
      });
    }
  }, [vaultId, account, isTfVaultType]);

  useEffect(() => {
    if (isTfVaultType && vault.strategies?.length) {
      setTfVaultDepositEndTimeLoading(true);
      vaultService
        .getTradeFlowVaultDepositEndDate(vault.strategies[0].id)
        .then((res) => {
          setTfVaultDepositEndDate(res);
        })
        .finally(() => {
          setTfVaultDepositEndTimeLoading(false);
        });

      setTfVaultLockEndTimeLoading(true);
      vaultService
        .getTradeFlowVaultLockEndDate(vault.strategies[0].id)
        .then((res) => {
          setTfVaultLockEndDate(getVaultLockEndDate(res).toString());
        })
        .finally(() => {
          setTfVaultLockEndTimeLoading(false);
        });
    }
  }, [
    vault,
    isTfVaultType,
    setTfVaultDepositEndTimeLoading,
    setTfVaultLockEndTimeLoading,
  ]);

  useEffect(() => {
    if (!tfVaultDepositEndDate || !tfVaultLockEndDate) return;
    const now = dayjs();
    let activePeriod = 2;

    if (now.isBefore(dayjs.unix(Number(tfVaultLockEndDate)))) {
      activePeriod = 1;
    }

    if (now.isBefore(dayjs.unix(Number(tfVaultDepositEndDate)))) {
      activePeriod = 0;
    }

    setActiveTfPeriod(activePeriod);
  }, [tfVaultDepositEndDate, tfVaultLockEndDate, setActiveTfPeriod]);

  const fetchVaultPosition = useCallback(
    (vaultId: string, account: string): Promise<IVaultPosition> => {
      return new Promise((resolve) => {
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
              const balance = (
                await poolService.getUserTokenBalance(
                  account,
                  position.shareToken.id
                )
              ).toString();

              let previewRedeemValue = "0";

              if (BigNumber(balance).isGreaterThan(0)) {
                previewRedeemValue = (
                  await vaultService.previewRedeem(
                    balance.toString(),
                    position.vault.id
                  )
                ).toString();
                previewRedeemValue = BigNumber(previewRedeemValue)
                  .dividedBy(10 ** 18)
                  .toString();
              }

              const updatedVaultPosition = {
                ...position,
                balanceShares: balance,
                balancePosition: previewRedeemValue,
              };

              resolve(updatedVaultPosition);
            } catch (error) {
              console.error("Error updating vault position:", error);
              resolve(position);
            } finally {
              setUpdateVaultPositionLoading(false);
            }
          } else {
            resolve({} as IVaultPosition);
          }
        });
      });
    },
    [poolService, vaultService, loadPosition, setUpdateVaultPositionLoading]
  );

  useEffect(() => {
    try {
      const methods = (
        (isTfVaultType ? TRADE_FLOW_VAULT_ABI : VAULT_ABI) as FunctionFragment[]
      ).filter((item: FunctionFragment) => item.type === "function");

      setVaultMethods(methods);
    } catch (e: any) {
      console.error(e);
    }
  }, [setVaultMethods, isTfVaultType]);

  useEffect(() => {
    try {
      const methods = (
        (isTfVaultType
          ? TRADE_FLOW_STRATEGY_ABI
          : STRATEGY_ABI) as FunctionFragment[]
      ).filter((item: FunctionFragment) => item.type === "function");

      setStrategyMethods(methods);
    } catch (e: any) {
      console.error(e);
    }
  }, [setStrategyMethods, isTfVaultType]);

  const fetchBalanceToken = useCallback(
    (vaultPosition: IVaultPosition) => {
      if (!vaultPosition?.balanceShares) {
        return Promise.resolve("0");
      }

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
    },
    [vaultService, vault.id, setBalanceToken, setFetchBalanceLoading]
  );

  const fetchPositionTransactions = useCallback(
    (
      fetchType: TransactionFetchType = TransactionFetchType.FETCH,
      vaultId: string
    ) => {
      if (account) {
        if (fetchType === TransactionFetchType.PROMISE) {
          return loadPositionTransactions({
            variables: {
              account: account.toLowerCase(),
              vault: vaultId,
            },
          });
        }

        return loadPositionTransactions({
          variables: {
            account: account.toLowerCase(),
            vault: vaultId,
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
    [account, setDepositsList, setWithdrawalsList, loadPositionTransactions]
  );

  useEffect(() => {
    if (
      !vault.id ||
      updateVaultPositionLoading ||
      vaultPositionLoading ||
      transactionsLoading ||
      fetchBalanceLoading
    ) {
      return;
    }

    if ((syncVault && !prevSyncVault) || (vault.id && account)) {
      fetchVaultPosition(vault.id, account).then(
        (vaultPosition: IVaultPosition) => {
          Promise.all([
            fetchPositionTransactions(TransactionFetchType.PROMISE, vault.id),
            fetchBalanceToken(vaultPosition),
          ])
            .then(([transactions, balanceToken]) => {
              setBalanceToken(balanceToken as string);
              transactions?.data?.deposits &&
                setDepositsList(transactions?.data.deposits);
              transactions?.data?.withdrawals &&
                setWithdrawalsList(transactions?.data.withdrawals);
            })
            .finally(() => {
              setVaultPosition(vaultPosition);
            });
        }
      );
    } else {
      setVaultPosition({} as IVaultPosition);
    }
  }, [
    account,
    vault.id,
    syncVault,
    prevSyncVault,
    fetchPositionTransactions,
    fetchBalanceToken,
    fetchVaultPosition,
    setBalanceToken,
    setDepositsList,
    setWithdrawalsList,
    setVaultPosition,
  ]);

  const balanceEarned = useMemo(() => {
    if (balanceToken === "-1") return 0;
    if (transactionsLoading || fetchBalanceLoading) {
      return -1;
    }

    const sumTokenDeposits = depositsList.reduce(
      (acc: BigNumber, deposit: any) => acc.plus(deposit.tokenAmount),
      new BigNumber(0)
    );

    const sumTokenWithdrawals = withdrawalsList.reduce(
      (acc: BigNumber, withdrawal: any) => acc.plus(withdrawal.tokenAmount),
      new BigNumber(0)
    );

    return BigNumber(balanceToken || "0")
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsShowWithdrawAllButtonLoading(
        !isTfVaultType ||
          !isReportsLoaded ||
          tfVaultDepositEndTimeLoading ||
          tfVaultLockEndTimeLoading ||
          reportsLoading ||
          !Object.values(reports).length
      );
    }, 300);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [
    isTfVaultType,
    isReportsLoaded,
    tfVaultDepositEndTimeLoading,
    tfVaultLockEndTimeLoading,
    reportsLoading,
    reports,
    setIsShowWithdrawAllButtonLoading,
  ]);

  const showWithdrawAllButton = useMemo(() => {
    if (isShowWithdrawAllButtonLoading) {
      return false;
    }

    const firstReport = Object.values(reports)[0][0];

    return (
      activeTfPeriod === 2 &&
      BigNumber(firstReport?.gain || "0").isGreaterThan(0)
    );
  }, [isShowWithdrawAllButtonLoading, reports, activeTfPeriod]);

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
  }, [vault?.strategies]);

  useEffect(() => {
    if (vault?.id && account) {
      getStrategiesIds.then((authorizedIds) =>
        setManagedStrategiesIds(authorizedIds)
      );
    } else {
      setManagedStrategiesIds([]);
    }
  }, [vault?.id, account, getStrategiesIds]);

  useEffect(() => {
    if (vault?.id && account) {
      executeHasRoleMethod().then((isManager) => setIsUserManager(isManager));
    } else {
      setIsUserManager(false);
    }
  }, [vault?.id, account]);

  const handleWithdrawAll = useCallback(async () => {
    if (vaultPosition) {
      setIsWithdrawAllLoading(true);
      try {
        const blockNumber = await vaultService.redeem(
          BigNumber(vaultPosition.balanceShares)
            .dividedBy(10 ** 18)
            .toString(),
          account,
          account,
          vault.shareToken.id
        );

        setLastTransactionBlock(blockNumber as number);
      } catch (e) {
        console.log(e);
      } finally {
        setIsWithdrawAllLoading(false);
      }
    }
  }, [vaultPosition, account, vaultService, setLastTransactionBlock]);

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
    tfVaultDepositLimit,
    tfVaultDepositEndDate,
    tfVaultLockEndDate,
    activeTfPeriod,
    minimumDeposit,
    setMinimumDeposit,
    isWithdrawAllLoading,
    handleWithdrawAll,
    tfVaultDepositEndTimeLoading,
    tfVaultLockEndTimeLoading,
    showWithdrawAllButton,
    isShowWithdrawAllButtonLoading,
    setActiveVaultInfoTabHandler,
    urlParams,
  };
};

export default useVaultDetail;
