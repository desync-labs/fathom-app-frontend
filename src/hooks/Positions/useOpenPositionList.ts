import {
  ChangeEvent,
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useServices } from "context/services";
import { ICollateralPool, IOpenPosition } from "fathom-sdk";
import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS } from "apollo/queries";

import { COUNT_PER_PAGE } from "utils/Constants";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";
import { ChainId } from "connectors/networks";

const useOpenPositionList = (
  setPositionCurrentPage: Dispatch<number>,
  proxyWallet: string
) => {
  const { positionService } = useServices();
  const { chainId, account } = useConnector();
  const [formattedPositions, setFormattedPositions] = useState<IOpenPosition[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [loadPositions, { loading, data, fetchMore, called }] = useLazyQuery(
    FXD_POSITIONS,
    {
      context: { clientName: "stable", chainId },
      variables: {
        chainId,
      },
    }
  );

  const { data: poolsItems, loading: poolsLoading } = useQuery(FXD_POOLS, {
    context: { clientName: "stable", chainId },
    fetchPolicy: "network-only",
    variables: { chainId },
  });

  const poolsData = useMemo(() => {
    if (!poolsLoading && poolsItems && poolsItems.pools) {
      return poolsItems.pools.map((poolItem: ICollateralPool) => {
        if (
          poolItem.poolName.toUpperCase() === "XDC" &&
          chainId === ChainId.SEPOLIA
        ) {
          return { ...poolItem, poolName: "ETH" };
        } else {
          return poolItem;
        }
      });
    } else {
      return [];
    }
  }, [poolsItems, poolsLoading, chainId]);

  const [closePosition, setClosePosition] = useState<IOpenPosition>();
  const [topUpPosition, setTopUpPosition] = useState<IOpenPosition>();

  const topUpPositionPool = useMemo(() => {
    if (topUpPosition && poolsData.length) {
      return poolsData.find(
        (pool: ICollateralPool) => pool.id === topUpPosition.collateralPool
      );
    }

    return null;
  }, [topUpPosition, poolsData]);

  useEffect(() => {
    if (proxyWallet && account) {
      loadPositions({
        variables: {
          first: COUNT_PER_PAGE,
          skip: 0,
          walletAddress: proxyWallet,
        },
        fetchPolicy: "network-only",
      });
    } else {
      setFormattedPositions([]);
    }
  }, [chainId, proxyWallet, account, called, loadPositions]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      setIsLoading(true);
      fetchMore({
        variables: {
          first: COUNT_PER_PAGE,
          skip: (page - 1) * COUNT_PER_PAGE,
          walletAddress: proxyWallet,
        },
      }).then(
        ({ data: { positions } }) => !positions.length && setIsLoading(false)
      );
      setPositionCurrentPage(page);
    },
    [proxyWallet, setPositionCurrentPage, setIsLoading, fetchMore]
  );

  const fetchPositions = useMemo(
    () =>
      debounce((data, poolsData) => {
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
              const findPool = poolsData.find(
                (pool: ICollateralPool) => pool.id === position.collateralPool
              );

              const debtValue = debtValues[index];

              const liquidationPrice = BigNumber(position?.debtValue)
                .dividedBy(position?.lockedCollateral)
                .multipliedBy(findPool?.liquidationRatio)
                .toNumber();

              const ltv = BigNumber(position.debtValue)
                .dividedBy(
                  BigNumber(findPool?.rawPrice).multipliedBy(
                    position.lockedCollateral
                  )
                )
                .toNumber();

              return {
                ...position,
                debtValue,
                liquidationPrice,
                ltv,
              };
            }
          );

          const renamedPoolName = positions.map(
            (positionItem: IOpenPosition) => {
              if (
                positionItem.collateralPoolName.toUpperCase() === "XDC" &&
                chainId === ChainId.SEPOLIA
              ) {
                return { ...positionItem, collateralPoolName: "ETH" };
              } else {
                return positionItem;
              }
            }
          );

          setFormattedPositions(renamedPoolName);
          setIsLoading(false);
        });
      }, 300),
    [positionService, chainId, setFormattedPositions, setIsLoading]
  );

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (loading || !data || !poolsData.length) {
      return setFormattedPositions([]);
    }

    fetchPositions(data, poolsData);
  }, [loading, data, poolsData, fetchPositions]);

  const onClose = useCallback(() => {
    setClosePosition(undefined);
    setTopUpPosition(undefined);
  }, [setClosePosition, setTopUpPosition]);

  return {
    topUpPositionPool,
    positions: formattedPositions,
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
