import { useStores } from "stores";
import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { ClosePositionContextType } from "context/closePosition";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import ICollateralPool from "stores/interfaces/ICollateralPool";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";

export enum ClosingType {
  Full,
  Partial,
}

const useClosePosition = (
  position: ClosePositionContextType["position"],
  onClose: ClosePositionContextType["onClose"],
  closingType: ClosingType,
  setType: Dispatch<ClosingType>
) => {
  const { positionService } = useStores();
  const { account } = useConnector()!;
  const { library } = useWeb3React();

  const { data } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const { setLastTransactionBlock } = useSyncContext();

  const [collateral, setCollateral] = useState<number>(0);
  const [fathomToken, setFathomToken] = useState<number>(0);

  const [price, setPrice] = useState<number>(0);

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [disableClosePosition, setDisableClosePosition] =
    useState<boolean>(false);

  const pool = useMemo(
    () =>
      data?.pools?.find(
        (pool: ICollateralPool) => pool.id === position?.collateralPool
      ),
    [data, position]
  );

  const lockedCollateral = useMemo(
    () => Number(position.lockedCollateral),
    [position]
  );

  const getBalance = useCallback(async () => {
    const balance = await positionService.balanceStableCoin(account, library);
    setBalance(balance!);
  }, [positionService, account, library, setBalance]);

  const handleOnOpen = useCallback(async () => {
    const price =
      BigNumber(position.debtShare).dividedBy(Number(position.lockedCollateral))

    setPrice(price.toNumber());
    setFathomToken(Number(position.debtShare));
    setCollateral(lockedCollateral);
  }, [position, lockedCollateral, setPrice, setFathomToken, setCollateral]);

  useEffect(() => {
    getBalance();
    handleOnOpen();
  }, [getBalance, handleOnOpen]);

  useEffect(() => {
    balance !== null && (balance as number) / 10 ** 18 < fathomToken
      ? setBalanceError(true)
      : setBalanceError(false);
  }, [fathomToken, balance]);

  const closePosition = useCallback(async () => {
    setDisableClosePosition(true);
    try {
      let receipt;
      if (closingType === ClosingType.Full) {
        receipt = await positionService.closePosition(
          position.positionId,
          pool,
          account,
          collateral,
          library
        );
      } else {
        receipt = await positionService.partiallyClosePosition(
          position.positionId,
          pool,
          account,
          fathomToken,
          collateral,
          library
        );
      }

      setLastTransactionBlock(receipt!.blockNumber);
      onClose();
    } catch (e) {
      console.error(e);
    }
    setDisableClosePosition(false);
  }, [
    closingType,
    position,
    pool,
    account,
    library,
    fathomToken,
    collateral,
    positionService,
    onClose,
    setDisableClosePosition,
    setLastTransactionBlock,
  ]);

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      const maxAllowed = Number(position.debtShare);

      let { value } = e.target;
      value = Number(value);
      value = value > maxAllowed ? maxAllowed : value;

      if (isNaN(value)) {
        return;
      }

      const walletBalance = Number(balance) / 10 ** 18;
      value > walletBalance ? setBalanceError(true) : setBalanceError(false);

      setFathomToken(value);
      setCollateral(value / price);
    },
    [
      price,
      lockedCollateral,
      balance,
      position,
      setFathomToken,
      setCollateral,
      setBalanceError,
    ]
  );

  const handleTypeChange = useCallback(
    (type: ClosingType) => {
      if (type === ClosingType.Full) {
        setFathomToken(lockedCollateral * price);
        setCollateral(lockedCollateral);
      }
      setType(type);
    },
    [price, lockedCollateral, setFathomToken, setType, setCollateral]
  );

  const setMax = useCallback(() => {
    const walletBalance = (balance as number) / 10 ** 18;
    const maxBalance = Number(position.debtShare);
    const setBalance = walletBalance < maxBalance ? walletBalance : maxBalance;

    setFathomToken(setBalance);
    setCollateral(setBalance / price);
  }, [price, position, lockedCollateral, balance, setFathomToken, setCollateral]);

  return {
    collateral,
    lockedCollateral,
    price,
    fathomToken,
    pool,
    closingType,
    balance,
    balanceError,
    closePosition,
    disableClosePosition,
    handleFathomTokenTextFieldChange,
    handleTypeChange,
    setMax,
    onClose,
    position,
    setType,
  };
};

export default useClosePosition;
