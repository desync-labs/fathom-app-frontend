import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import {
  LogLevel,
  useLogger
} from "helpers/Logger";
import {
  useCallback,
  useEffect,
  useState
} from "react";
import IOpenPosition from "stores/interfaces/IOpenPosition";


const useOpenPositionList = () => {
  const { positionStore } = useStores();
  const { account, chainId } = useMetaMask()!;
  const logger = useLogger();
  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();

  const [approveBtn, setApproveBtn] = useState(true);
  const [approvalPending, setApprovalPending] = useState(false);

  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStableCoin(account);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account]);

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        // Update the document title using the browser API
        logger.log(LogLevel.info, `fetching open positions. ${account}`);
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
    positions: positionStore.positions,
    approve,
    selectedPosition,
    setSelectedPosition
  }
}

export default useOpenPositionList;