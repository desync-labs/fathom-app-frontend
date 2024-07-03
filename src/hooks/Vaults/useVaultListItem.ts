import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IVault,
  IVaultPosition,
  IVaultStrategyReport,
  VaultType,
} from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useLazyQuery } from "@apollo/client";
import dayjs from "dayjs";

import { useServices } from "context/services";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import useRpcError from "hooks/General/useRpcError";
import {
  VAULT_POSITION_TRANSACTIONS,
  VAULT_STRATEGY_REPORTS,
} from "apollo/queries";
import { vaultType } from "utils/Vaults/getVaultType";
import { getVaultLockEndDate } from "utils/Vaults/getVaultLockEndDate";

interface UseVaultListItemProps {
  vaultPosition: IVaultPosition | null | undefined;
  vault: IVault;
}

export type IVaultStrategyHistoricalApr = {
  id: string;
  apr: string;
  timestamp: string;
};

const useVaultListItem = ({ vaultPosition, vault }: UseVaultListItemProps) => {
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);

  const [balanceToken, setBalanceToken] = useState<string>("0");
  const [balanceTokenLoading, setBalanceTokenLoading] =
    useState<boolean>(false);
  const [loadingEarning, setLoadingEarning] = useState<boolean>(true);

  const { chainId } = useConnector();
  const { balanceTokens } = vault;

  const [depositsList, setDepositsList] = useState([]);
  const [withdrawalsList, setWithdrawalsList] = useState([]);

  const { syncVault, prevSyncVault } = useSyncContext();

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
  const [tfVaultDepositLimit, setTfVaultDepositLimit] = useState<string>("0");
  const [activeTfPeriod, setActiveTfPeriod] = useState(0);
  const [tfReport, setTfReport] = useState<IVaultStrategyReport>(
    {} as IVaultStrategyReport
  );
  const [isReportsLoaded, setIsReportsLoaded] = useState<boolean>(false);

  const [minimumDeposit, setMinimumDeposit] = useState<number>(0.0000000001);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState<boolean>(false);

  const { account } = useConnector();
  const { vaultService } = useServices();
  const { showErrorNotification } = useRpcError();
  const { setLastTransactionBlock } = useSyncContext();

  const [loadPositionTransactions, { loading: transactionsLoading }] =
    useLazyQuery(VAULT_POSITION_TRANSACTIONS, {
      context: { clientName: "vaults", chainId },
      variables: { chainId, first: 1000 },
      fetchPolicy: "no-cache",
    });

  const [loadReports] = useLazyQuery(VAULT_STRATEGY_REPORTS, {
    context: { clientName: "vaults", chainId },
    variables: { chainId },
    fetchPolicy: "no-cache",
  });

  const fetchBalanceToken = useCallback(() => {
    setBalanceTokenLoading(true);
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
      })
      .finally(() => {
        setBalanceTokenLoading(false);
      });
  }, [vaultService, vault.id, vaultPosition, setBalanceToken]);

  const fetchPositionTransactions = useCallback(() => {
    return loadPositionTransactions({
      variables: {
        account: account.toLowerCase(),
        vault: vault.id,
        chainId,
      },
    });
  }, [vault.id, chainId, account, loadPositionTransactions]);

  const fetchReports = (strategyId: string) => {
    loadReports({
      variables: {
        strategy: strategyId,
        reportsFirst: 1,
        reportsSkip: 0,
        chainId,
      },
    }).then((response) => {
      const { data } = response;

      if (data?.strategyReports?.length) {
        setTfReport(data?.strategyReports[0] as IVaultStrategyReport);
      }

      setIsReportsLoaded(true);
    });
  };

  useEffect(() => {
    if (isTfVaultType && vault?.strategies && vault?.strategies?.length) {
      /**
       * Fetch reports for TradeFi vault only after the lock period is end.
       */
      if (isTfVaultType && activeTfPeriod < 2) {
        return;
      }
      fetchReports(vault.strategies[0].id);
    }
  }, [vault?.strategies, chainId, isTfVaultType, activeTfPeriod]);

  useEffect(() => {
    if (
      vault.id &&
      vaultType[vault.id.toLowerCase()] &&
      vaultType[vault.id.toLowerCase()] === VaultType.TRADEFI
    ) {
      setIsTfVaultType(true);
    } else {
      setIsTfVaultType(false);
    }
  }, [vault.id, setIsTfVaultType]);

  useEffect(() => {
    if (vault.id && account && isTfVaultType) {
      vaultService
        .kycPassed(vault.id, account)
        .then((res) => {
          setIsUserKycPassed(res);
        })
        .catch((e) => {
          console.log(e);
          setIsUserKycPassed(false);
        });
    }
  }, [vault.id, account, isTfVaultType, setIsUserKycPassed]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingEarning(balanceTokenLoading || transactionsLoading);
    }, 300);

    return () => clearTimeout(timeout);
  }, [balanceTokenLoading, transactionsLoading, setLoadingEarning]);

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
  }, [vault.strategies, isTfVaultType]);

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

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (account && isTfVaultType) {
      timeout = setTimeout(() => {
        vaultService
          .getDepositLimit(vault.id, isTfVaultType, account)
          .then((res) => {
            setTfVaultDepositLimit(res);
            if (BigNumber(res).isEqualTo(0)) {
              setTfVaultDepositLimit(
                BigNumber(vault.strategies[0].maxDebt)
                  .minus(balanceTokens)
                  .toString()
              );
            }
          });
      }, 30);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [isTfVaultType, vault.id, account, balanceTokens, setTfVaultDepositLimit]);

  useEffect(() => {
    /**
     * Min Deposit for TradeFlow vaults is 10,000
     * Min Deposit for other vaults is 0.0000000001
     */
    vaultType[vault.id.toLowerCase()] === VaultType.TRADEFI
      ? vaultService.getMinUserDeposit(vault.id).then((res) => {
          setMinimumDeposit(
            BigNumber(res)
              .dividedBy(10 ** 18)
              .toNumber()
          );
        })
      : setMinimumDeposit(0.0000000001);
  }, [isTfVaultType, vault.id, setMinimumDeposit]);

  useEffect(() => {
    if (transactionsLoading || balanceTokenLoading) return;

    if (
      (syncVault && !prevSyncVault && vaultPosition?.balanceShares) ||
      (vaultPosition?.balanceShares && vault.id)
    ) {
      Promise.all([fetchPositionTransactions(), fetchBalanceToken()]).then(
        ([transactions, balanceToken]) => {
          setBalanceToken(balanceToken as string);
          transactions?.data?.deposits &&
            setDepositsList(transactions?.data.deposits);
          transactions?.data?.withdrawals &&
            setWithdrawalsList(transactions?.data.withdrawals);
        }
      );
    }
  }, [
    syncVault,
    prevSyncVault,
    fetchPositionTransactions,
    fetchBalanceToken,
    vaultPosition?.balanceShares,
    vault.id,
    setBalanceToken,
    setDepositsList,
    setWithdrawalsList,
  ]);

  const balanceEarned = useMemo(() => {
    if (loadingEarning) return -1;
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

    return BigNumber(earnedValue).isLessThan(0.0001) ? 0 : earnedValue;
  }, [balanceToken, depositsList, withdrawalsList, loadingEarning]);

  const showWithdrawAllButton = useMemo(() => {
    if (
      !isTfVaultType ||
      !isReportsLoaded ||
      tfVaultDepositEndTimeLoading ||
      tfVaultLockEndTimeLoading
    ) {
      return false;
    }

    return (
      isTfVaultType &&
      activeTfPeriod === 2 &&
      BigNumber(tfReport?.gain || "0").isGreaterThan(0)
    );
  }, [
    tfReport,
    isTfVaultType,
    activeTfPeriod,
    isReportsLoaded,
    tfVaultDepositEndTimeLoading,
    tfVaultLockEndTimeLoading,
  ]);

  const handleWithdrawAll = useCallback(async () => {
    if (vaultPosition) {
      setIsWithdrawLoading(true);
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
        setIsWithdrawLoading(false);
      }
    }
  }, [
    vaultPosition?.balanceShares,
    vault.shareToken.id,
    account,
    vaultService,
    setLastTransactionBlock,
  ]);

  return {
    balanceEarned,
    balanceToken,
    manageVault,
    newVaultDeposit,
    minimumDeposit,
    setManageVault,
    setNewVaultDeposit,
    isTfVaultType,
    isUserKycPassed,
    tfVaultDepositEndDate,
    tfVaultLockEndDate,
    activeTfPeriod,
    tfVaultDepositLimit,
    handleWithdrawAll,
    isWithdrawLoading,
    showWithdrawAllButton,
  };
};

export default useVaultListItem;
