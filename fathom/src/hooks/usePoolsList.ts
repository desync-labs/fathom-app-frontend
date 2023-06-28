import { useCallback, useState } from "react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";

const usePoolsList = () => {
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();
  const { data, loading, refetch } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const onCloseNewPosition = useCallback(() => {
    setSelectedPool(undefined);
  }, [setSelectedPool]);

  return {
    isMobile,
    pools:
      !loading && data && data.pools
        ? data.pools.filter(
            (pool: ICollateralPool) =>
              pool.poolName.toUpperCase() === "XDC"
          )
        : [],
    selectedPool,
    onCloseNewPosition,
    setSelectedPool,
    loading,
    refetch,
  };
};

export default usePoolsList;
