import { useQuery } from "@apollo/client";
import { FXD_STATS } from "apollo/queries";

const useProtocolStats = () => {
  const { data, loading, refetch } = useQuery(FXD_STATS, {
    context: { clientName: "stable" },
  });

  return {
    totalSupply: data?.protocolStat?.totalSupply || 0,
    tvl: data?.protocolStat?.tvl || 0,
    loading,
    refetch,
  };
};

export default useProtocolStats;
