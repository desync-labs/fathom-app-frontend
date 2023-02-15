import { useCallback, useEffect, useState } from "react";
import { useStores } from "stores";
import { useWeb3React } from "@web3-react/core";

const usePositionDebtValue = (debtShare: string, poolId: string) => {
  const { positionService } = useStores();
  const [debtValue, setDebtValue] = useState<string>("");
  const { account, library } = useWeb3React();

  const getDebtValue = useCallback(async () => {
    console.log(
      `Fetching debtValue from share : ${debtShare} for poolId: ${poolId}`
    );

    const debtValue = await positionService.getDebtValue(
      debtShare,
      poolId,
      library
    );

    console.log(`Debt Value is ${debtValue}`);

    setDebtValue(debtValue);
  }, [positionService, debtShare, library, setDebtValue, poolId]);

  useEffect(() => {
    if (account) {
      getDebtValue();
    } else {
      setDebtValue("");
    }
  }, [account, getDebtValue, debtShare, poolId, setDebtValue]);

  return {
    debtValue,
  };
};

export default usePositionDebtValue;
