import { ChangeEvent, Dispatch, useCallback, useEffect, useState } from "react";

import { useStores } from "stores";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { ClosingType } from "hooks/useClosePosition";
import { useLazyQuery } from "@apollo/client";
import { FXD_POSITIONS } from "apollo/queries";
import { Constants } from "helpers/Constants";
import useConnector from "context/connector";

const useOpenPositionList = (
  setPositionCurrentPage: Dispatch<number>,
  proxyWallet: string
) => {
  const { positionStore } = useStores();
  const { account, chainId, library } = useConnector()!;
  /**
   * @todo Change walletAddress
   */
  const [loadPositions, { loading, data, fetchMore, called }] =
    useLazyQuery(FXD_POSITIONS, {
      context: { clientName: "stable" },
    });

  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();
  const [closingType, setType] = useState(ClosingType.Full);

  const [approveBtn, setApproveBtn] = useState<boolean>(true);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStableCoin(account, library);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account, library]);

  useEffect(() => {
    if (account) approvalStatus();
  }, [account, approvalStatus]);

  useEffect(() => {
    if (chainId && proxyWallet) {
      loadPositions({
        variables: {
          first: Constants.COUNT_PER_PAGE,
          skip: 0,
          walletAddress: proxyWallet,
        },
        fetchPolicy: "network-only",
      });
    }
  }, [chainId, proxyWallet, called, loadPositions]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approveStableCoin(account, library);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [positionStore, account, library, setApprovalPending, setApproveBtn]);

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

  return {
    approveBtn,
    approvalPending,
    closingType,
    positions:
      loading || !data
        ? []
        : data.positions.filter(
            (position: IOpenPosition) => position.positionStatus !== "closed"
          ),
    approve,
    selectedPosition,
    loading,

    setSelectedPosition,
    setType,
    handlePageChange,
  };
};

export default useOpenPositionList;
