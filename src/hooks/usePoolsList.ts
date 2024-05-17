import { useCallback, useState } from "react";
import { ICollateralPool } from "fathom-sdk";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import useConnector from "context/connector";

const usePoolsList = () => {
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();
  const { data, loading, refetch } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });
  const { chainId } = useConnector();

  const onCloseNewPosition = useCallback(() => {
    setSelectedPool(undefined);
  }, [setSelectedPool]);

  const filteredPools = useCallback(() => {
    if (!loading && data && data.pools) {
      return data.pools.map((poolItem: ICollateralPool) => {
        if (poolItem.poolName.toUpperCase() === "XDC" && chainId === 11155111) {
          return { ...poolItem, poolName: "ETH" };
        } else {
          return poolItem;
        }
      });
    } else {
      return [];
    }
  }, [data, loading, chainId]);

  return {
    pools: filteredPools(),
    selectedPool,
    onCloseNewPosition,
    setSelectedPool,
    loading,
    refetch,
  };
};

export default usePoolsList;
