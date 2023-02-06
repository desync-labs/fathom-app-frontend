import { useQuery } from "@apollo/client";
import { FXD_STATS } from "apollo/queries";
import { useWeb3React } from "@web3-react/core";

const useProtocolStats = () => {
  const { chainId } = useWeb3React();
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
