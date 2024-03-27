import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IVault,
  IVaultPosition,
  IVaultStrategy,
  IVaultStrategyReport,
} from "fathom-sdk";
import BigNumber from "bignumber.js";
import { useServices } from "context/services";
import { useLazyQuery, useQuery } from "@apollo/client";
import { VAULT_STRATEGY_REPORTS, VAULTS_STRATEGIES } from "apollo/queries";

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

type IVaultStrategyHistorycalApr = {
  id: string;
  apr: string;
  timestamp: string;
};

const useVaultListItem = ({ vaultPosition, vault }: UseVaultListItemProps) => {
  const [extended, setExtended] = useState<boolean>(true);
  const [manageVault, setManageVault] = useState<boolean>(false);
  const [newVaultDeposit, setNewVaultDeposit] = useState<boolean>(false);
  const [balanceToken, setBalanceToken] = useState<string>("0");

  const [strategies, setStrategies] = useState<IVaultStrategy[]>([]);
  const [reports, setReports] = useState<
    Record<string, IVaultStrategyReport[]>
  >([] as unknown as Record<string, IVaultStrategyReport[]>);

  const [historicalApr, setHistoricalApr] = useState<
    Record<string, IVaultStrategyHistorycalApr[]>
  >([] as unknown as Record<string, IVaultStrategyHistorycalApr[]>);

  const [activeVaultInfoTab, setActiveVaultInfoTab] = useState<VaultInfoTabs>(
    vaultPosition && BigNumber(vaultPosition.balanceShares).isGreaterThan(0)
      ? VaultInfoTabs.POSITION
      : VaultInfoTabs.ABOUT
  );

  const { vaultService } = useServices();

  const { data: vaultStrategiesData } = useQuery(VAULTS_STRATEGIES, {
    variables: {
      vault: vault.id,
    },
    context: { clientName: "vaults" },
  });

  const [loadReports, { fetchMore: fetchMoreReports }] = useLazyQuery(
    VAULT_STRATEGY_REPORTS,
    {
      context: { clientName: "vaults" },
    }
  );

  const fetchReports = useCallback(
    (
      strategyId: string,
      prevStateReports: IVaultStrategyReport[] = [],
      prevStateApr: IVaultStrategyHistorycalApr[] = []
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
    if (vaultStrategiesData && vaultStrategiesData?.strategies) {
      vaultStrategiesData?.strategies.forEach((strategy: IVaultStrategy) => {
        fetchReports(strategy.id, [], []);
      });
      setStrategies(vaultStrategiesData?.strategies);
    }
  }, [vaultStrategiesData, fetchReports, setStrategies]);

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

  const getBalancePosition = useCallback(() => {
    fetchBalanceToken();
    const interval = setInterval(fetchBalanceToken, 15 * 1000);
    return () => clearInterval(interval);
  }, [fetchBalanceToken]);

  useEffect(() => {
    if (vaultPosition && vault) {
      getBalancePosition();
    }
  }, [vaultPosition, vault]);

  const balanceEarned = useMemo(() => {
    return BigNumber(balanceToken || "0")
      .minus(vaultPosition?.balancePosition as string)
      .dividedBy(10 ** 18)
      .toNumber();
  }, [vaultPosition, balanceToken]);

  return {
    reports,
    historicalApr,
    strategies,
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
