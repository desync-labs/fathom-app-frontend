import { useQuery } from "@apollo/client";
import { FXD_STATS } from "apollo/queries";
import useConnector from "context/connector";

const useProtocolStats = () => {
  const { chainId } = useConnector();
  const { data, loading, refetch } = useQuery(FXD_STATS, {
    context: { clientName: "stable", chainId },
  });

  return {
    totalSupply: data?.protocolStat?.totalSupply || 0,
    tvl: data?.protocolStat?.tvl || 0,
    loading,
    refetch,
  };
};

export default useProtocolStats;
