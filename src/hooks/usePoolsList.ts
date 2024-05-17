import { useCallback, useState } from "react";
import { ICollateralPool } from "fathom-sdk";
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
      !loading && data && data.pools ? (data.pools as ICollateralPool[]) : [],
    selectedPool,
    onCloseNewPosition,
    setSelectedPool,
    loading,
    refetch,
  };
};

export default usePoolsList;
