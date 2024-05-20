import { useCallback, useEffect, useState } from "react";
import { ICollateralPool } from "fathom-sdk";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import useConnector from "context/connector";

const usePoolsList = () => {
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();
  const { chainId } = useConnector();
  const { loading, data, refetch } = useQuery(FXD_POOLS, {
    context: { clientName: "stable", chainId },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (chainId) {
      refetch({
        context: { clientName: "stable", chainId },
        fetchPolicy: "network-only",
      });
    }
  }, [chainId]);

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

  useEffect(() => {
    if (chainId) {
      refetch();
    }
  }, [chainId, refetch]);

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
