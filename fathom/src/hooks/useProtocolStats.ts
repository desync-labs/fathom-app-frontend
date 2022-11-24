import { useQuery } from "@apollo/client";
import { FATHOM_FXD_STATS } from "../apollo/queries";


const useProtocolStats = () => {
  const {
    data,
    loading,
    refetch,
  } = useQuery(FATHOM_FXD_STATS);

  return {
    totalSupply: data?.protocolStat?.totalSupply || 0,
    tvl: data?.protocolStat?.tvl || 0,
    loading,
    refetch,
  }
}


export default useProtocolStats;