import {
  createContext,
  Dispatch,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@apollo/client";
import { HEALTH } from "apollo/queries";
import useConnector from "context/connector";

type StakingProviderType = {
  children: ReactElement;
};

type UseSyncContextReturn = {
  setLastTransactionBlock: Dispatch<number>;
  syncFXD: boolean;
  prevSyncFxd: boolean;
  syncDao: boolean;
  prevSyncDao: boolean;
  syncVault: boolean;
  prevSyncVault: boolean;
  syncDex: boolean;
  prevSyncDex: boolean;
};

export const SyncContext = createContext<UseSyncContextReturn>(
  {} as UseSyncContextReturn
);

export const SyncProvider: FC<StakingProviderType> = ({ children }) => {
  const [lastTransactionBlock, setLastTransactionBlock] = useState<number>(0);
  const [syncFXD, setSyncFXD] = useState<boolean>(true);
  const [syncDao, setSyncDao] = useState<boolean>(true);
  const [syncVault, setSyncVault] = useState<boolean>(true);
  const [syncDex, setSyncDex] = useState<boolean>(true);

  const prevSyncFxd = useRef<boolean>(true);
  const prevSyncDao = useRef<boolean>(true);
  const prevSyncVault = useRef<boolean>(true);
  const prevSyncDex = useRef<boolean>(true);
  const { chainId } = useConnector();

  const { data: fxdData, refetch: refetchFxd } = useQuery(HEALTH, {
    variables: {
      name: "stablecoin-subgraph",
      chainId,
    },
    context: {
      chainId,
    },
    fetchPolicy: "network-only",
  });

  const { data: daoData, refetch: refetchDao } = useQuery(HEALTH, {
    variables: {
      name: "dao-subgraph",
      chainId,
    },
    context: {
      chainId,
    },
    fetchPolicy: "network-only",
  });

  const { data: vaultData, refetch: refetchVault } = useQuery(HEALTH, {
    variables: {
      name: "vaults-subgraph",
      chainId,
    },
    context: {
      chainId,
    },
    fetchPolicy: "network-only",
  });

  const { data: dexData, refetch: refetchDex } = useQuery(HEALTH, {
    variables: {
      name: "dex-subgraph",
      chainId,
    },
    context: {
      chainId,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (chainId) {
      setLastTransactionBlock(0);
      setSyncFXD(true);
      setSyncVault(true);
      setSyncDex(true);
      setSyncDao(true);
    }
  }, [
    chainId,
    setLastTransactionBlock,
    setSyncFXD,
    setSyncVault,
    setSyncDex,
    setSyncDao,
  ]);

  const values = useMemo(() => {
    return {
      syncFXD,
      syncDao,
      syncVault,
      syncDex,
      prevSyncFxd: prevSyncFxd.current,
      prevSyncDao: prevSyncDao.current,
      prevSyncVault: prevSyncVault.current,
      prevSyncDex: prevSyncDex.current,
      setLastTransactionBlock,
    };
  }, [setLastTransactionBlock, syncFXD, syncDao, syncVault, syncDex]);

  useEffect(() => {
    prevSyncFxd.current = syncFXD;
  }, [syncFXD]);

  useEffect(() => {
    prevSyncDao.current = syncDao;
  }, [syncDao]);

  useEffect(() => {
    prevSyncVault.current = syncVault;
  }, [syncVault]);

  useEffect(() => {
    prevSyncDex.current = syncDex;
  }, [syncDex]);

  useEffect(() => {
    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      lastTransactionBlock &&
      Number(lastTransactionBlock) >=
        Number(
          fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
    ) {
      interval = setInterval(() => {
        refetchFxd();
      }, 500);

      setSyncFXD(false);
    } else {
      setSyncFXD(true);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [lastTransactionBlock, fxdData, refetchFxd, setSyncFXD]);

  useEffect(() => {
    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      lastTransactionBlock &&
      Number(lastTransactionBlock) >=
        Number(
          daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
    ) {
      interval = setInterval(() => {
        refetchDao();
      }, 500);

      setSyncDao(false);
    } else {
      setSyncDao(true);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [lastTransactionBlock, daoData, refetchDao, setSyncDao]);

  useEffect(() => {
    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      lastTransactionBlock &&
      Number(lastTransactionBlock) >=
        Number(
          vaultData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
    ) {
      interval = setInterval(() => {
        refetchVault();
      }, 500);
      setSyncVault(false);
    } else {
      setSyncVault(true);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [lastTransactionBlock, vaultData, refetchVault, setSyncVault]);

  useEffect(() => {
    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      lastTransactionBlock &&
      Number(lastTransactionBlock) >=
        Number(
          dexData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
    ) {
      interval = setInterval(() => {
        refetchDex();
      }, 500);

      setSyncDex(false);
    } else {
      setSyncDex(true);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [lastTransactionBlock, dexData, refetchDex, setSyncDex]);

  return <SyncContext.Provider value={values}>{children}</SyncContext.Provider>;
};

const useSyncContext = () => useContext(SyncContext);

export default useSyncContext;
