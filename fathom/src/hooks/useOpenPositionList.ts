import { useCallback, useEffect, useState } from "react";

import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { ClosingType } from "hooks/useClosePosition";
import { useLazyQuery } from "@apollo/client";
import { FXD_POSITIONS } from "apollo/queries";

const useOpenPositionList = () => {
  const { positionStore } = useStores();
  const { account, chainId } = useMetaMask()!;
  /**
   * @todo Change walletAddress
   */
  const [loadPositions, { loading, data }] = useLazyQuery(FXD_POSITIONS, {
    fetchPolicy: "cache-first",
  });

  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();
  const [closingType, setType] = useState(ClosingType.Full);

  const [approveBtn, setApproveBtn] = useState<boolean>(true);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStableCoin(account);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account]);

  const loadPositionsCallback = useCallback(async () => {
    if (account) {
      const walletProxy = await positionStore.getProxyWallet(account);

      if (walletProxy) {
        loadPositions({
          variables: {
            walletAddress: walletProxy
          }
        })
      }
    }
  }, [positionStore, account, loadPositions])

  useEffect(() => {
    if (chainId && account) {
      approvalStatus();
      loadPositionsCallback()
    }
  }, [chainId, account, approvalStatus, loadPositionsCallback]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approveStableCoin(account);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [positionStore, account, setApprovalPending, setApproveBtn]);

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
    setSelectedPosition,
    setType,
    loading,
  };
};

export default useOpenPositionList;
