import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import {
  useLogger
} from "helpers/Logger";
import {
  useCallback,
  useEffect,
  useState
} from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { ClosingType } from "hooks/useClosePosition";


const useOpenPositionList = () => {
  const { positionStore } = useStores();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();

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
    positions: positionStore.positions,
    approve,
    selectedPosition,
    setSelectedPosition,
    setType
  }
}

export default useOpenPositionList;