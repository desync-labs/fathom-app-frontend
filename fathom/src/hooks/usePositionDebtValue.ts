  import { useCallback, useEffect, useState } from "react";
  import { useStores } from "stores";
  import { useWeb3React } from "@web3-react/core";


  const usePositionDebtValue = (debtShare: string, poolId: string) => {
    const { positionService } = useStores();
    const [debtValue, setDebtValue] = useState<string>("");
    const { library } = useWeb3React();


    const getDebtValue = useCallback(async () => {
        console.log(`Fetching debtValue from share : ${debtShare} for poolId: ${poolId}`)
        const debtValue = await positionService.getDebtValue(debtShare,poolId, library);
        console.log(`Debt Valye is ${debtValue}`)
        setDebtValue(debtValue);
      }, [positionService, debtShare, library, setDebtValue, poolId]);


      useEffect(() => {
        getDebtValue();
      }, [getDebtValue,debtShare,poolId]);

      return {
          debtValue,
      };

    };
  
  export default usePositionDebtValue;