import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState
} from "react";

import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import { ClosingType } from "hooks/useClosePosition";
import { useLazyQuery } from "@apollo/client";
import { FXD_POSITIONS, FXD_USER } from "apollo/queries";
import { Constants } from "../helpers/Constants";

const useOpenPositionList = () => {
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

  const [loadUserStats] = useLazyQuery(FXD_USER, {
    fetchPolicy: "cache-first",
  });

  const [selectedPosition, setSelectedPosition] = useState<IOpenPosition>();
  const [closingType, setType] = useState(ClosingType.Full);

  const [approveBtn, setApproveBtn] = useState<boolean>(true);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);
  const [itemsCount, setItemsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [walletProxy, setWalletProxy] = useState('');

  const approvalStatus = useCallback(async () => {
    const approved = await positionStore.approvalStatusStableCoin(account);
    approved ? setApproveBtn(false) : setApproveBtn(true);
  }, [positionStore, account]);

  const loadPositionsCallback = useCallback(async () => {
    if (account) {
      const walletProxy = await positionStore.getProxyWallet(account);

      setWalletProxy(walletProxy!);

      if (walletProxy) {
        loadPositions({
          variables: {
            first: Constants.COUNT_PER_PAGE,
            skip: 0,
            walletAddress: walletProxy,
          },
        });

        loadUserStats({
          variables: {
            walletAddress: walletProxy,
          },
        }).then(({ data: { users } }) => {
          const itemsCount = users[0].activePositionsCount;
          setItemsCount(itemsCount);
        });
      }
    }
  }, [positionStore, account, loadPositions, setItemsCount, setWalletProxy]);

  useEffect(() => {
    if (chainId && account) {
      approvalStatus();
      loadPositionsCallback();
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

  const handlePageChange = useCallback((event: ChangeEvent<unknown>, page: number) => {
    fetchMore({
      variables: {
        first: Constants.COUNT_PER_PAGE,
        skip: page * Constants.COUNT_PER_PAGE,
        walletAddress: walletProxy,
      }
    })
    setCurrentPage(page);
  }, [walletProxy, setCurrentPage])

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
    currentPage,
    itemsCount,

    setSelectedPosition,
    setType,
    handlePageChange,
  };
};

export default useOpenPositionList;
