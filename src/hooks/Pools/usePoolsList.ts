import { useCallback, useMemo, useState } from "react";
import { ICollateralPool } from "fathom-sdk";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import useConnector from "context/connector";
import { ChainId } from "connectors/networks";

const usePoolsList = () => {
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();
  const { chainId } = useConnector();
  const { loading, data, refetch } = useQuery(FXD_POOLS, {
    context: { clientName: "stable", chainId },
    variables: { chainId },
  });

  const onCloseNewPosition = useCallback(() => {
    setSelectedPool(undefined);
  }, [setSelectedPool]);

  const filteredPools = useMemo(() => {
    if (!loading && data && data.pools) {
      return data.pools.map((poolItem: ICollateralPool) => {
        if (
          poolItem.poolName.toUpperCase() === "XDC" &&
          chainId === ChainId.SEPOLIA
        ) {
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
    pools: filteredPools,
    selectedPool,
    onCloseNewPosition,
    setSelectedPool,
    loading,
    refetch,
  };
};

export default usePoolsList;
