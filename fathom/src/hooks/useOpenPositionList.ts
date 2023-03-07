import { useCallback, useEffect, useState, ChangeEvent, Dispatch } from "react";

import { useStores } from "stores";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import ICollateralPool from "stores/interfaces/ICollateralPool";

import { useLazyQuery, useQuery } from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS } from "apollo/queries";

import { ClosingType } from "hooks/useClosePosition";
import { Constants } from "helpers/Constants";
import useConnector from "context/connector";
import BigNumber from "bignumber.js";

const useOpenPositionList = (
  setPositionCurrentPage: Dispatch<number>,
  proxyWallet: string
) => {
  const { positionService } = useStores();
  const { account, chainId, library } = useConnector()!;
  const [formattedPositions, setFormattedPositions] = useState<IOpenPosition[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();
  const [closingType, setType] = useState(ClosingType.Full);

  const [approveBtn, setApproveBtn] = useState<boolean>(true);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const approvalStatus = useCallback(async () => {
    const approved = await positionService.approvalStatusStableCoin(
      account,
      library
    );
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionService, account, library]);

  useEffect(() => {
    if (account) {
      approvalStatus();
    }
  }, [account, approvalStatus]);

  useEffect(() => {
    loadPositions({
      variables: {
        first: Constants.COUNT_PER_PAGE,
        skip: 0,
        walletAddress: proxyWallet,
      },
      fetchPolicy: "network-only",
    });
  }, [chainId, proxyWallet, called, loadPositions]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionService.approveStableCoin(account, library);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [positionService, account, library, setApprovalPending, setApproveBtn]);

  const handlePageChange = useCallback(
    (event: ChangeEvent<unknown>, page: number) => {
      fetchMore({
        variables: {
          first: Constants.COUNT_PER_PAGE,
          skip: (page - 1) * Constants.COUNT_PER_PAGE,
          walletAddress: proxyWallet,
        },
      });
      setPositionCurrentPage(page);
    },
    [proxyWallet, setPositionCurrentPage, fetchMore]
  );

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (loading || !data || !poolsData) {
      return setFormattedPositions([]);
    }

    setIsLoading(true);
    const filteredPosition = data.positions.filter(
      (position: IOpenPosition) => position.positionStatus !== "closed"
    );

    const promises = filteredPosition.map((position: IOpenPosition) =>
      positionService.getDebtValue(
        position.debtShare,
        position.collateralPool,
        library
      )
    );

    Promise.all(promises).then((debtValues) => {
      const positions = filteredPosition.map(
        (position: IOpenPosition, index: number) => {
          const findPool = poolsData.pools.find(
            (pool: ICollateralPool) => pool.id === position.collateralPool
          );

          position.debtValue = debtValues[index];
          position.liquidationPrice = BigNumber(findPool.rawPrice)
            .minus(
              BigNumber(findPool.priceWithSafetyMargin)
                .multipliedBy(position.lockedCollateral)
                .minus(position.debtValue)
                .dividedBy(position.lockedCollateral)
            )
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
  }, [
    loading,
    data,
    poolsData,
    library,
    positionService,
    setFormattedPositions,
    setIsLoading,
  ]);

  return {
    approveBtn,
    approvalPending,
    closingType,
    positions: formattedPositions,
    approve,
    selectedPosition,
    loading: isLoading,

    setSelectedPosition,
    setType,
    handlePageChange,
  };
};

export default useOpenPositionList;
