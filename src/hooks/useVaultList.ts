import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { ACCOUNT_VAULT_POSITIONS, VAULTS } from "apollo/queries";
import { COUNT_PER_PAGE } from "utils/Constants";
import useConnector from "context/connector";
import useSyncContext from "context/sync";
import { IVault, IVaultPosition } from "fathom-sdk";

export enum SortType {
  FEE = "fee",
  EARNED = "earned",
  TVL = "tvl",
  STAKED = "staked",
}

const useVaultList = () => {
  const { account } = useConnector();
  const { syncVault, prevSyncVault } = useSyncContext();

  const [vaultSortedList, setVaultSortedList] = useState<IVault[]>([]);
  const [vaultPositionsList, setVaultPositionsList] = useState<
    IVaultPosition[]
  >([]);
  const [vaultCurrentPage, setVaultCurrentPage] = useState(1);
  const [vaultItemsCount, setVaultItemsCount] = useState(0);

  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortType>(SortType.TVL);
  const [isShutdown, setIsShutdown] = useState<boolean>(false);

  const {
    data: vaultItemsData,
    loading: vaultsLoading,
    refetch: vaultsRefetch,
    fetchMore,
  } = useQuery(VAULTS, {
    variables: {
      first: COUNT_PER_PAGE,
      skip: 0,
      search: search,
      shutdown: isShutdown,
    },
    context: { clientName: "vaults" },
  });

  const {
    data: positionsData,
    loading: vaultPositionsLoading,
    refetch: positionsRefetch,
  } = useQuery(ACCOUNT_VAULT_POSITIONS, {
    variables: {
      account: account ? account.toLowerCase() : undefined,
    },
    context: { clientName: "vaults" },
  });

  useEffect(() => {
    if (syncVault && !prevSyncVault) {
      positionsRefetch();
      vaultsRefetch();
    }
  }, [syncVault, prevSyncVault, positionsRefetch, vaultsRefetch]);

  useEffect(() => {
    positionsRefetch();
  }, [account]);

  useEffect(() => {
    if (positionsData && positionsData.accountVaultPositions) {
      setVaultPositionsList(positionsData.accountVaultPositions);
    } else {
      setVaultPositionsList([]);
    }
  }, [positionsData]);

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      setVaultSortedList(vaultItemsData.vaults);
      setVaultItemsCount(vaultItemsData.vaults.length);
    }
  }, [vaultItemsData]);

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      sortingVaults([...vaultItemsData.vaults]);
    }
  }, [sortBy]);

  // Sort vaults
  const sortingVaults = useCallback(
    (vaultData: IVault[]) => {
      let sortedVaults = vaultData;
      if (vaultData.length) {
        if (sortBy === SortType.FEE) {
          sortedVaults = vaultData.sort((a, b) => {
            const totalFeesA = Number(a.strategies[0].reports[0].totalFees);
            const totalFeesB = Number(b.strategies[0].reports[0].totalFees);

            return totalFeesB - totalFeesA;
          });
        }
        if (sortBy === SortType.TVL) {
          sortedVaults = vaultData.sort((a, b) => {
            const tvlA = Number(a.balanceTokens);
            const tvlB = Number(b.balanceTokens);

            return tvlB - tvlA;
          });
        }
      }

      setVaultSortedList(sortedVaults);
    },
    [sortBy]
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
      const filteredPositions = vaultPositionsList.filter((position) => {
        return position.vault.id === vaultId;
      });

      return filteredPositions ? filteredPositions[0] : null;
    },
    [vaultPositionsList, vaultPositionsLoading]
  );

  return {
    vaultSortedList,
    vaultsLoading,
    vaultPositionsLoading,
    vaultPositionsList,
    vaultCurrentPage,
    vaultItemsCount,
    isShutdown,
    search,
    sortBy,
    setIsShutdown,
    setSearch,
    setSortBy,
    handlePageChange,
    filterCurrentPosition,
  };
};

export default useVaultList;
