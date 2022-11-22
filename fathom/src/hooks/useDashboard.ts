import { useWeb3React } from "@web3-react/core";
import { useStores } from "stores";
import {
  LogLevel,
  useLogger
} from "helpers/Logger";
import { useEffect } from "react";


const useDashboard = () => {
  const { chainId, account } = useWeb3React();
  const { poolStore, positionStore } = useStores();
  const logger = useLogger();

  useEffect(() => {
    if (chainId && account) {
      logger.log(LogLevel.info, "Fetching pools information.");
      setTimeout(() => {
        Promise.all([
          poolStore.fetchPools(),
          positionStore.fetchPositions(account!),
        ]);
      });
    } else {
      poolStore.setPool([]);
    }
  }, [poolStore, positionStore, logger, chainId, account]);

  return {

  }
}

export default useDashboard;