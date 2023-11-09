import { useServices } from "context/services";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS, FXD_STATS, FXD_USER } from "apollo/queries";
import { useCallback, useEffect, useState } from "react";
import { COUNT_PER_PAGE } from "helpers/Constants";
import useSyncContext from "context/sync";
import { useMediaQuery, useTheme } from "@mui/material";
import useConnector from "context/connector";

const useDashboard = () => {
  const { positionService } = useServices();
  const { account } = useConnector();
  const { syncFXD, prevSyncFxd } = useSyncContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { refetch: refetchStats } = useQuery(FXD_STATS, {
    context: { clientName: "stable" },
  });
  const [, { refetch: refetchPositions }] = useLazyQuery(FXD_POSITIONS, {
    context: { clientName: "stable" },
  });
  const { refetch: refetchPools } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
  });

  const [positionCurrentPage, setPositionCurrentPage] = useState(1);
  const [positionsItemsCount, setPositionsItemsCount] = useState(0);
  const [proxyWallet, setProxyWallet] = useState("");

  const [loadUserStats, { refetch: refetchUserStats }] = useLazyQuery(
    FXD_USER,
    {
      context: { clientName: "stable" },
      fetchPolicy: "cache-first",
    }
  );

  const fetchUserStatsAndProxyWallet = useCallback(async () => {
    const proxyWallet = await positionService.proxyWalletExist(account);
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
    positionService,
    account,
    loadUserStats,
    setPositionsItemsCount,
    setProxyWallet,
  ]);

  const refetchData = useCallback(async () => {
    refetchStats();
    refetchPools();

    if (/^0x0+$/.test(proxyWallet)) {
      const newProxyWallet = await positionService.proxyWalletExist(account);

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
    if (account) {
      fetchUserStatsAndProxyWallet();
    } else {
      setProxyWallet("");
      setPositionsItemsCount(0);
    }
  }, [
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
    isMobile,
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
  };
};

export default useDashboard;
