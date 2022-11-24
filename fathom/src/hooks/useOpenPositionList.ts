import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { useLogger } from "helpers/Logger";
import { useCallback, useEffect, useState } from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { ClosingType } from "hooks/useClosePosition";
import { useQuery } from "@apollo/client";
import { FXD_POSITIONS } from "../apollo/queries";

const useOpenPositionList = () => {
  const { positionStore } = useStores();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  /**
   * @todo Change walletAddress
   */
  const { data, loading, refetch } = useQuery(FXD_POSITIONS, {
    variables: {
      walletAddress: "0xbb4b23f1374d701747c28039c5a071de4b9fc02b",
    },
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

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        approvalStatus();
      });
    } else {
      positionStore.setPositions([]);
    }
  }, [positionStore, account, chainId, approvalStatus, logger]);

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
    positions: loading ? [] : data.positions.filter((position: IOpenPosition) => position.positionStatus !== 'closed'),
    approve,
    selectedPosition,
    setSelectedPosition,
    setType,
    loading,
  };
};

export default useOpenPositionList;
