import { useStores } from "stores";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS, FXD_STATS, FXD_USER } from "apollo/queries";
import { useCallback, useEffect, useState } from "react";
import { Constants } from "helpers/Constants";
import useSyncContext from "context/sync";
import { useWeb3React } from "@web3-react/core";
import {
  useMediaQuery,
  useTheme
} from "@mui/material";

const useDashboard = () => {
  const { positionService } = useStores();
  const { account, library } = useWeb3React();
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
    const proxyWallet = await positionService.proxyWalletExist(account!, library);
    setProxyWallet(proxyWallet!);

    loadUserStats({
      variables: {
        walletAddress: proxyWallet,
      },
    }).then(({ data: { users } }) => {
      setPositionsItemsCount(users[0]?.activePositionsCount || 0);
    });
  }, [
    positionService,
    account,
    library,
    loadUserStats,
    setPositionsItemsCount,
    setProxyWallet,
  ]);

  const refetchData = useCallback(async () => {
    refetchStats();
    refetchPools();
    refetchPositions({
      walletAddress: proxyWallet,
      first: Constants.COUNT_PER_PAGE,
      skip: 0,
    }).then(() => {
      setPositionCurrentPage(1);
    });

    refetchUserStats({
      variables: {
        walletAddress: proxyWallet,
      },
    }).then(({ data: { users } }) => {
      const itemsCount = users[0].activePositionsCount;
      setPositionsItemsCount(itemsCount);
    });
  }, [
    proxyWallet,
    refetchStats,
    refetchPools,
    refetchPositions,
    refetchUserStats,
  ]);

  useEffect(() => {
    if (account) {
      fetchUserStatsAndProxyWallet();
    }
  }, [account, fetchUserStatsAndProxyWallet]);

  useEffect(() => {
    if (syncFXD && !prevSyncFxd) {
      refetchData();
    }
  }, [syncFXD, prevSyncFxd, refetchData])

  return {
    isMobile,
    proxyWallet,
    positionCurrentPage,
    positionsItemsCount,
    setPositionCurrentPage,
  };
};

export default useDashboard;
