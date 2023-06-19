import { useQuery } from "@apollo/client";
import { FXD_STATS } from "apollo/queries";
import useConnector from "context/connector";
import usePoolsList from "hooks/usePoolsList";
import {
  useMemo
} from "react";
import ICollateralPool from "stores/interfaces/ICollateralPool";

const useProtocolStats = () => {
  const { chainId } = useConnector();
  const { data, loading, refetch } = useQuery(FXD_STATS, {
    context: { clientName: "stable", chainId }
  });

  const { pools } = usePoolsList();

  const totalBorrowed = useMemo(() => {
    if (pools.length) {
      return pools.reduce((accumulator: number, currentPool: ICollateralPool) => {
        return accumulator + Number(currentPool.totalBorrowed);
      }, 0);
    } else {
      return 0;
    }
  }, [pools]);


  return {
    totalSupply: data?.protocolStat?.totalSupply || 0,
    totalBorrowed,
    tvl: data?.protocolStat?.tvl || 0,
    loading,
    refetch
  };
};

export default useProtocolStats;
