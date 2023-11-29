import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useQuery } from "@apollo/client";
import { IVault } from "fathom-sdk";
import { VAULTS } from "apollo/queries";
import { COUNT_PER_PAGE } from "utils/Constants";

const useAllVaultView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [vaultList, setVaultList] = useState<IVault[]>([]);
  const [vaultCurrentPage, setVaultCurrentPage] = useState(1);
  const [vaultItemsCount, setVaultItemsCount] = useState(0);

  const {
    data: vaultItemsData,
    loading: vaultsLoading,
    refetch: vaultsRefetch,
    fetchMore,
  } = useQuery(VAULTS, {
    variables: {
      first: COUNT_PER_PAGE,
      skip: 0,
    },
    context: { clientName: "vaults" },
  });

  useEffect(() => {
    if (vaultItemsData && vaultItemsData.vaults) {
      setVaultList(vaultItemsData.vaults);
      setVaultItemsCount(vaultItemsData.vaults.length);
    }
  }, [vaultItemsData]);

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

  return {
    vaultList,
    vaultsLoading,
    vaultCurrentPage,
    vaultItemsCount,
    isMobile,
    handlePageChange,
  };
};

export default useAllVaultView;
