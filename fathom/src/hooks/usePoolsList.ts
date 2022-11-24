import {
  useCallback,
  useState
} from "react";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";


const usePoolsList = () => {
  const [selectedPool, setSelectedPool] = useState<ICollateralPool>();
  const { data, loading, refetch } = useQuery(FXD_POOLS, {
    variables: {
      page: 10,
    },
    fetchPolicy: "cache-first"
  })

  console.log(data);


  const onCloseNewPosition = useCallback(() => {
    setSelectedPool(undefined)
  }, [setSelectedPool])

  return {
    pools: loading ? [] : data.pools,
    selectedPool,
    onCloseNewPosition,
    setSelectedPool,
    loading,
    refetch,
  }
}

export default usePoolsList;