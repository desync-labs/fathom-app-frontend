import {
  ChangeEvent,
  Dispatch,
  useCallback,
  useEffect,
  useState
} from "react";

import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { ClosingType } from "hooks/useClosePosition";
import { useLazyQuery } from "@apollo/client";
import { FXD_POSITIONS } from "apollo/queries";
import { Constants } from "helpers/Constants";

const useOpenPositionList = (setPositionCurrentPage: Dispatch<number>, proxyWallet: string) => {
  const { positionStore } = useStores();
  const { account, chainId } = useMetaMask()!;
  /**
   * @todo Change walletAddress
   */
  const [loadPositions, { loading, data, fetchMore }] = useLazyQuery(
    FXD_POSITIONS,
    {
      fetchPolicy: "cache-first",
    }
  );

  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();
  const [closingType, setType] = useState(ClosingType.Full);

  const [approveBtn, setApproveBtn] = useState<boolean>(true);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);


  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStableCoin(account);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account]);

  useEffect(() => {
    if (chainId && account && proxyWallet) {
      loadPositions({
        variables: {
          first: Constants.COUNT_PER_PAGE,
          skip: 0,
          walletAddress: proxyWallet,
        },
      });

      approvalStatus();
    }
  }, [chainId, account, proxyWallet, approvalStatus]);

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

  const handlePageChange = useCallback((event: ChangeEvent<unknown>, page: number) => {
    fetchMore({
      variables: {
        first: Constants.COUNT_PER_PAGE,
        skip: (page - 1) * Constants.COUNT_PER_PAGE,
        walletAddress: proxyWallet,
      }
    })
    setPositionCurrentPage(page);
  }, [proxyWallet, setPositionCurrentPage])

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
