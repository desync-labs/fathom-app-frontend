import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { IVault, IVaultPosition, VaultType } from "fathom-sdk";
import {
  ACCOUNT_VAULT_POSITIONS,
  VAULTS,
  VAULT_FACTORIES,
} from "apollo/queries";
import { COUNT_PER_PAGE } from "utils/Constants";
import { vaultTitle } from "utils/getVaultTitleAndDescription";
import { vaultType } from "utils/getVaultType";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import { useServices } from "context/services";
import BigNumber from "bignumber.js";

declare module "fathom-sdk" {
  interface IVault {
    name: string;
  }
}

interface IdToVaultIdMap {
  [key: string]: string | undefined;
}

export enum SortType {
  EARNED = "earned",
  TVL = "tvl",
  STAKED = "staked",
}

const useVaultList = () => {
  const { account } = useConnector();
  const { poolService, vaultService } = useServices();
  const { syncVault, prevSyncVault } = useSyncContext();

  const [vaultSortedList, setVaultSortedList] = useState<IVault[]>([]);
  const [vaultPositionsList, setVaultPositionsList] = useState<
    IVaultPosition[]
  >([]);
  const [vaultCurrentPage, setVaultCurrentPage] = useState(1);
  const [vaultItemsCount, setVaultItemsCount] = useState(0);
  const [performanceFee, setPerformanceFee] = useState(0);

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>(SortType.TVL);
  const [isShutdown, setIsShutdown] = useState<boolean>(false);
  const { chainId } = useConnector();

  const {
    data: vaultItemsData,
    loading: vaultsLoading,
    refetch: vaultsRefetch,
    fetchMore,
  } = useQuery(VAULTS, {
    variables: {
      first: COUNT_PER_PAGE,
      skip: 0,
      shutdown: isShutdown,
      chainId,
    },
    context: { clientName: "vaults", chainId },
    fetchPolicy: "network-only",
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

  const [
    loadPositions,
    { loading: vaultPositionsLoading, refetch: positionsRefetch },
  ] = useLazyQuery(ACCOUNT_VAULT_POSITIONS, {
    context: { clientName: "vaults", chainId },
    fetchPolicy: "network-only",
    variables: { chainId, first: 1000 },
  });

  useEffect(() => {
    if (account && vaultService && chainId) {
      loadPositions({ variables: { account: account.toLowerCase() } }).then(
        (res) => {
          if (
            res.data?.accountVaultPositions &&
            res.data?.accountVaultPositions.length
          ) {
            setVaultPositionsList(res.data?.accountVaultPositions);

            const promises: Promise<any>[] = [];

            res.data?.accountVaultPositions.forEach(
              (position: IVaultPosition) => {
                promises.push(
                  poolService.getUserTokenBalance(
                    account,
                    position.shareToken.id
                  )
                );
              }
            );

            const balancePositionsPromises: Promise<any>[] = [];

            Promise.all(promises).then((balances) => {
              const vaultPositions = res.data.accountVaultPositions.map(
                (position: IVaultPosition, index: number) => {
                  balancePositionsPromises.push(
                    vaultService.previewRedeem(
                      balances[index].toString(),
                      position.vault.id
                    )
                  );
                  return {
                    ...position,
                    balanceShares: balances[index].toString(),
                  };
                }
              );

              Promise.all(balancePositionsPromises).then((values) => {
                const updatedVaultPositions = vaultPositions.map(
                  (position: IVaultPosition, index: number) => {
                    return {
                      ...position,
                      balancePosition: BigNumber(values[index].toString())
                        .dividedBy(10 ** 18)
                        .toString(),
                    };
                  }
                );
                setVaultPositionsList(updatedVaultPositions);
              });
            });
          } else {
            setVaultPositionsList([]);
          }
        }
      );
    } else {
      setVaultPositionsList([]);
    }
  }, [
    account,
    chainId,
    loadPositions,
    setVaultPositionsList,
    poolService,
    vaultService,
  ]);

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
      positionsRefetch({ account: account.toLowerCase() }).then((res) => {
        res.data?.accountVaultPositions
          ? setVaultPositionsList(res.data.accountVaultPositions)
          : setVaultPositionsList([]);
      });
      vaultsRefetch();
    }
  }, [syncVault, prevSyncVault, vaultsRefetch]);

  useEffect(() => {
    /**
     * Refetch vaults every 60 seconds
     */
    const interval = setInterval(() => {
      vaultsRefetch();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [vaultsRefetch, account]);

  useEffect(() => {
    if (!vaultsFactoriesLoading && vaultsFactories) {
      const { accountants } = vaultsFactories;
      const performanceFeeRes = accountants[0].performanceFee;

      if (performanceFeeRes) {
        setPerformanceFee(performanceFeeRes / 100);
      }
    }
  }, [vaultsFactories]);

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      sortingVaults(vaultItemsData.vaults);
      setVaultItemsCount(vaultItemsData.vaults.length);
    }
  }, [vaultItemsData]);

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      sortingVaults(filteringVaultsBySearch(vaultItemsData.vaults));
    }
  }, [sortBy, search, vaultItemsData]);

  // Sort vaults
  const sortingVaults = useCallback(
    (vaultData: IVault[]) => {
      let sortedVaults = [...vaultData];
      if (vaultData.length) {
        if (sortBy === SortType.TVL) {
          sortedVaults = sortedVaults.sort((a, b) => {
            const tvlA = Number(a.balanceTokens);
            const tvlB = Number(b.balanceTokens);

            return tvlB - tvlA;
          });
        }
        if (vaultPositionsList.length) {
          const idToVaultIdMap: IdToVaultIdMap = {};

          const sortVaultsByVaultPositionValue = (a: IVault, b: IVault) => {
            const keyA = a.id;
            const keyB = b.id;

            const positionValueA =
              parseFloat(idToVaultIdMap[keyA] as string) || 0;
            const positionValueB =
              parseFloat(idToVaultIdMap[keyB] as string) || 0;

            return positionValueB - positionValueA;
          };

          if (sortBy === SortType.EARNED) {
            vaultPositionsList.forEach((position: IVaultPosition) => {
              const key = position.vault.id;
              idToVaultIdMap[key] = position.balanceProfit;
            });

            sortedVaults = sortedVaults.sort(sortVaultsByVaultPositionValue);
          }

          if (sortBy === SortType.STAKED) {
            vaultPositionsList.forEach((position: IVaultPosition) => {
              const key = position.vault.id;
              idToVaultIdMap[key] = position.balancePosition;
            });

            sortedVaults = sortedVaults.sort(sortVaultsByVaultPositionValue);
          }
        }
      }

      setVaultSortedList(sortedVaults);
    },
    [sortBy, vaultPositionsList]
  );

  const filteringVaultsBySearch = useCallback(
    (vaultList: IVault[]) => {
      let vaultListWithNames = vaultList.map((vault) => {
        return {
          ...vault,
          name: vaultTitle[vault.id.toLowerCase()]
            ? vaultTitle[vault.id.toLowerCase()]
            : vault.token.name,
          type: vaultType[vault.id.toLowerCase()]
            ? vaultType[vault.id.toLowerCase()]
            : VaultType.DEFAULT,
        };
      });

      if (search) {
        vaultListWithNames = vaultListWithNames.filter((vault) =>
          vault.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      return vaultListWithNames;
    },
    [search]
  );

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
        },
      });
      setVaultCurrentPage(page);
    },
    [setVaultCurrentPage, fetchMore]
  );

  const filterCurrentPosition = useCallback(
    (vaultId: string) => {
      const filteredPositions = vaultPositionsList.find((position) => {
        return position.vault.id === vaultId;
      });

      return filteredPositions ? filteredPositions : null;
    },
    [vaultPositionsList, vaultPositionsLoading]
  );

  const handleIsShutdown = (newValue: boolean) => {
    if (newValue !== null) {
      setIsShutdown(newValue);
    }
  };

  return {
    vaultSortedList,
    vaultsLoading,
    vaultPositionsLoading,
    vaultPositionsList,
    vaultCurrentPage,
    vaultItemsCount,
    performanceFee,
    isShutdown,
    search,
    sortBy,
    handleIsShutdown,
    setSearch,
    setSortBy,
    handlePageChange,
    filterCurrentPosition,
  };
};

export default useVaultList;
