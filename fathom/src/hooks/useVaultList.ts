import { useCallback, useEffect, useMemo, useState } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { useQuery } from "@apollo/client";
import { VAULTS } from "apollo/queries";

const useVaultList = () => {
  const theme = useTheme();
  const [vaultList, setVaultList] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: vaultsData,
    loading: vaultsLoading,
    refetch: vaultsRefetch,
  } = useQuery(VAULTS, {
    context: { clientName: "vaults" },
  });

  useEffect(() => {
    if (vaultsData && vaultsData.vaults) {
      setVaultList(vaultsData.vaults);
    }
  }, [vaultsData]);

  const handlePageChange = useCallback(() => {}, []);

  return {
    isMobile,
    vaultList,
    handlePageChange,
    loading: vaultsLoading,
  };
};

export default useVaultList;
