import {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  Dispatch,
  useMemo,
} from "react";

import { useServices } from "context/services";
import IOpenPosition from "services/interfaces/models/IOpenPosition";
import ICollateralPool from "services/interfaces/models/ICollateralPool";

import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS } from "apollo/queries";

import { COUNT_PER_PAGE } from "helpers/Constants";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import { useMediaQuery, useTheme } from "@mui/material";

const useOpenPositionList = (
  setPositionCurrentPage: Dispatch<number>,
  proxyWallet: string
) => {
  const { positionService } = useServices();
  const { account, chainId } = useConnector();
  const [formattedPositions, setFormattedPositions] = useState<IOpenPosition[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loadPositions, { loading, data, fetchMore, called }] = useLazyQuery(
    FXD_POSITIONS,
    {
      context: { clientName: "stable" },
    }
  );

  const { data: poolsData } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const [closePosition, setClosePosition] = useState<IOpenPosition>();
  const [topUpPosition, setTopUpPosition] = useState<IOpenPosition>();

  const [approveBtn, setApproveBtn] = useState<boolean>(true);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const approvalStatus = useCallback(
    async (formattedPositions: IOpenPosition[]) => {
      const maxPositionDebtValue = Math.max(
        ...formattedPositions.map(
          (position: IOpenPosition) => position.debtValue
        )
      );
      const approved = await positionService.approvalStatusStableCoin(
        maxPositionDebtValue,
        account
      );
      approved ? setApproveBtn(false) : setApproveBtn(true);
    },
    [positionService, account]
  );

  useEffect(() => {
    if (account && formattedPositions.length) {
      approvalStatus(formattedPositions);
    }
  }, [account, approvalStatus, formattedPositions]);

  const topUpPositionPool = useMemo(() => {
    if (topUpPosition && poolsData) {
      return poolsData.pools.find(
        (pool: ICollateralPool) => pool.id === topUpPosition.collateralPool
      );
    }

    return null;
  }, [topUpPosition, poolsData]);

  useEffect(() => {
    loadPositions({
      variables: {
        first: COUNT_PER_PAGE,
        skip: 0,
        walletAddress: proxyWallet,
      },
      fetchPolicy: "network-only",
    });
  }, [chainId, proxyWallet, called, loadPositions]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionService.approveStableCoin(account);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [positionService, account, setApprovalPending, setApproveBtn]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
          walletAddress: proxyWallet,
        },
      });
      setPositionCurrentPage(page);
    },
    [proxyWallet, setPositionCurrentPage, fetchMore]
  );

  const fetchPositions = useMemo(
    () =>
      debounce((loading, data, poolsData) => {
        setIsLoading(true);
        const filteredPosition = data.positions.filter(
          (position: IOpenPosition) => position.positionStatus !== "closed"
        );

        const promises = filteredPosition.map((position: IOpenPosition) =>
          positionService.getDebtValue(
            position.debtShare,
            position.collateralPool
          )
        );

        Promise.all(promises).then((debtValues) => {
          const positions = filteredPosition.map(
            (position: IOpenPosition, index: number) => {
              const findPool = poolsData.pools.find(
                (pool: ICollateralPool) => pool.id === position.collateralPool
              );

              position.debtValue = debtValues[index];

              position.liquidationPrice = BigNumber(position.debtValue)
                .dividedBy(position.lockedCollateral)
                .multipliedBy(findPool.liquidationRatio)
                .toNumber();

              position.ltv = BigNumber(position.debtValue)
                .dividedBy(
                  BigNumber(findPool.rawPrice).multipliedBy(
                    position.lockedCollateral
                  )
                )
                .toNumber();

              return position;
            }
          );

          setFormattedPositions(positions);
          setIsLoading(false);
        });
      }, 300),
    [positionService, setFormattedPositions, setIsLoading]
  );

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (loading || !data || !poolsData) {
      return setFormattedPositions([]);
    }

    fetchPositions(loading, data, poolsData);
  }, [loading, data, poolsData, fetchPositions]);

  const onClose = useCallback(() => {
    setClosePosition(undefined);
    setTopUpPosition(undefined);
  }, [setClosePosition, setTopUpPosition]);

  return {
    isMobile,
    topUpPositionPool,
    approveBtn,
    approvalPending,
    positions: formattedPositions,
    approve,
    closePosition,
    topUpPosition,
    loading: isLoading,
    handlePageChange,
    setTopUpPosition,
    setClosePosition,
    onClose,
  };
};

export default useOpenPositionList;
