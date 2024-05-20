import { useServices } from "context/services";
import { useLazyQuery, useQuery } from "@apollo/client";
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

  const { refetch: refetchStats, loading: loadingStats } = useQuery(FXD_STATS, {
    context: { clientName: "stable", chainId },
  });
  const [, { refetch: refetchPositions, loading: loadingPositions }] =
    useLazyQuery(FXD_POSITIONS, {
      context: { clientName: "stable", chainId },
    });

  const { refetch: refetchPools, loading: loadingPools } = useQuery(FXD_POOLS, {
    context: { clientName: "stable", chainId },
  });

  const [positionCurrentPage, setPositionCurrentPage] = useState(1);
  const [positionsItemsCount, setPositionsItemsCount] = useState(0);
  const [proxyWallet, setProxyWallet] = useState("");

  const [loadUserStats, { refetch: refetchUserStats }] = useLazyQuery(
    FXD_USER,
    {
      context: { clientName: "stable", chainId },
      fetchPolicy: "cache-first",
    }
  );

  const fetchUserStatsAndProxyWallet = useCallback(async () => {
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
  }, [
    chainId,
    positionService,
    account,
    loadUserStats,
    setPositionsItemsCount,
    setProxyWallet,
  ]);

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
    refetchStats,
    refetchPools,
    refetchPositions,
    refetchUserStats,
  ]);

  useEffect(() => {
    if (account && chainId) {
      fetchUserStatsAndProxyWallet();
    } else {
      setProxyWallet("");
      setPositionsItemsCount(0);
    }
  }, [
    chainId,
    account,
    fetchUserStatsAndProxyWallet,
    setPositionsItemsCount,
    setProxyWallet,
  ]);

  useEffect(() => {
    if (syncFXD && !prevSyncFxd) {
      refetchData();
    }
  }, [syncFXD, prevSyncFxd, refetchData]);

  return {
    loadingPools,
    loadingStats,
    loadingPositions,
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
  };
};

export default useDashboard;
