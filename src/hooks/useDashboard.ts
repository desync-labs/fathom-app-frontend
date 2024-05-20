import { useServices } from "context/services";
import { useLazyQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS, FXD_STATS, FXD_USER } from "apollo/queries";
import { useCallback, useEffect, useState } from "react";
import { COUNT_PER_PAGE } from "utils/Constants";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { ZERO_ADDRESS } from "fathom-sdk";

const useDashboard = () => {
  const { positionService } = useServices();
  const { account, chainId } = useConnector();
  const { syncFXD, prevSyncFxd } = useSyncContext();

  const [, { refetch: refetchStats, loading: loadingStats }] = useLazyQuery(
    FXD_STATS,
    {
      context: { clientName: "stable", chainId },
      variables: { chainId: chainId },
    }
  );
  const [, { refetch: refetchPositions, loading: loadingPositions }] =
    useLazyQuery(FXD_POSITIONS, {
      context: { clientName: "stable", chainId },
      variables: { chainId: chainId },
    });

  const [, { refetch: refetchPools, loading: loadingPools }] = useLazyQuery(
    FXD_POOLS,
    {
      context: { clientName: "stable", chainId },
      variables: { chainId: chainId },
    }
  );

  const [positionCurrentPage, setPositionCurrentPage] = useState(1);
  const [positionsItemsCount, setPositionsItemsCount] = useState(0);
  const [proxyWallet, setProxyWallet] = useState("");

  const [loadUserStats, { refetch: refetchUserStats }] = useLazyQuery(
    FXD_USER,
    {
      context: { clientName: "stable", chainId },
      fetchPolicy: "cache-first",
      variables: { chainId },
    }
  );

  const fetchUserStatsAndProxyWallet = async () => {
    const proxyWallet = await positionService.getProxyWallet(account);
    setProxyWallet(proxyWallet);

    return loadUserStats({
      variables: {
        walletAddress: proxyWallet,
      },
    }).then((response) => {
      const { data } = response;
      data &&
        Array.isArray(data.users) &&
        setPositionsItemsCount(data.users[0]?.activePositionsCount || 0);
    });
  };

  const refetchData = useCallback(async () => {
    refetchStats();
    refetchPools();

    if (proxyWallet === ZERO_ADDRESS) {
      const newProxyWallet = await positionService.getProxyWallet(account);

      setProxyWallet(newProxyWallet);

      refetchPositions({
        walletAddress: newProxyWallet,
        first: COUNT_PER_PAGE,
        skip: 0,
      }).then(() => {
        setPositionCurrentPage(1);
      });

      refetchUserStats({
        variables: {
          walletAddress: newProxyWallet,
        },
      }).then(({ data: { users } }) => {
        if (users !== undefined && users.length > 0) {
          const itemsCount = users[0].activePositionsCount;
          setPositionsItemsCount(itemsCount);
        }
      });
    } else {
      refetchPositions({
        walletAddress: proxyWallet,
        first: COUNT_PER_PAGE,
        skip: 0,
      }).then(() => {
        setPositionCurrentPage(1);
      });

      refetchUserStats({
        variables: {
          walletAddress: proxyWallet,
        },
      }).then(({ data }) => {
        if (data?.users !== undefined && data?.users.length > 0) {
          const itemsCount = data?.users[0].activePositionsCount;
          setPositionsItemsCount(itemsCount);
        }
      });
    }
  }, [
    account,
    positionService,
    proxyWallet,
    refetchPools,
    refetchStats,
    refetchPositions,
    refetchUserStats,
  ]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (account && chainId) {
      timeout = setTimeout(() => {
        fetchUserStatsAndProxyWallet();
      }, 100);
    } else {
      setProxyWallet("");
      setPositionsItemsCount(0);
    }

    return () => timeout && clearTimeout(timeout);
  }, [chainId, account, setPositionsItemsCount, setProxyWallet]);

  useEffect(() => {
    if (syncFXD && !prevSyncFxd) {
      refetchData();
    }
  }, [syncFXD, prevSyncFxd, refetchData]);

  return {
    loadingStats,
    loadingPositions,
    loadingPools,
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
  };
};

export default useDashboard;
