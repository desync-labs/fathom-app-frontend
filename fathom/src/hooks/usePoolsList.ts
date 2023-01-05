import { useCallback, useState } from "react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";

const usePoolsList = () => {
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();
  const { data, loading, refetch } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const onCloseNewPosition = useCallback(() => {
    setSelectedPool(undefined);
  }, [setSelectedPool]);

  return {
    pools:
      !loading && data && data.pools
        ? data.pools.filter(
            (pool: ICollateralPool) =>
              pool.poolName.toUpperCase() === "WXDC"
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
