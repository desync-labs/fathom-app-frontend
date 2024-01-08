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
};

export const SyncContext = createContext<UseSyncContextReturn>(
  {} as UseSyncContextReturn
);

export const SyncProvider: FC<StakingProviderType> = ({ children }) => {
  const [lastTransactionBlock, setLastTransactionBlock] = useState<number>();
  const [syncFXD, setSyncFXD] = useState<boolean>(true);
  const [syncDao, setSyncDao] = useState<boolean>(true);
  const [syncVault, setSyncVault] = useState<boolean>(true);

  const prevSyncFxd = useRef<boolean>(true);
  const prevSyncDao = useRef<boolean>(true);
  const prevSyncVault = useRef<boolean>(true);

  const { data: fxdData, refetch: refetchFxd } = useQuery(HEALTH, {
    variables: {
      name: "stablecoin-subgraph",
    },
  });

  const { data: daoData, refetch: refetchDao } = useQuery(HEALTH, {
    variables: {
      name: "dao-subgraph",
    },
  });

  const { data: vaultData, refetch: refetchVault } = useQuery(HEALTH, {
    variables: {
      name: "vaults-subgraph",
    },
  });

  const values = useMemo(() => {
    return {
      syncFXD,
      syncDao,
      syncVault,
      setLastTransactionBlock,
      prevSyncFxd: prevSyncFxd.current,
      prevSyncDao: prevSyncDao.current,
      prevSyncVault: prevSyncVault.current,
    };
  }, [setLastTransactionBlock, syncFXD, syncDao, syncVault]);

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
    if (
      !lastTransactionBlock &&
      fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
    ) {
      setSyncFXD(true);
      return setLastTransactionBlock(
        Number(
          fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
      );
    }

    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      Number(lastTransactionBlock) >
      Number(
        fxdData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
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
      clearInterval(interval);
    };
  }, [
    lastTransactionBlock,
    fxdData,
    setLastTransactionBlock,
    refetchFxd,
    setSyncFXD,
  ]);

  useEffect(() => {
    if (
      !lastTransactionBlock &&
      daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
    ) {
      setSyncDao(true);
      return setLastTransactionBlock(
        Number(
          daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
      );
    }

    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      Number(lastTransactionBlock) >
      Number(
        daoData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
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
      clearInterval(interval);
    };
  }, [
    lastTransactionBlock,
    daoData,
    setLastTransactionBlock,
    refetchDao,
    setSyncDao,
  ]);

  useEffect(() => {
    if (
      !lastTransactionBlock &&
      vaultData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock?.number
    ) {
      setSyncVault(true);
      return setLastTransactionBlock(
        Number(
          vaultData?.indexingStatusForCurrentVersion?.chains[0]?.latestBlock
            ?.number
        )
      );
    }

    /***
     * Check if transaction block from transaction receipt has block number higher than latestBlock from Graph, if so our Graph state is not up-to-date.
     */
    let interval: ReturnType<typeof setInterval>;
    if (
      Number(lastTransactionBlock) >
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
      clearInterval(interval);
    };
  }, [
    lastTransactionBlock,
    vaultData,
    setLastTransactionBlock,
    refetchVault,
    setSyncVault,
  ]);

  return <SyncContext.Provider value={values}>{children}</SyncContext.Provider>;
};

const useSyncContext = () => useContext(SyncContext);

export default useSyncContext;
