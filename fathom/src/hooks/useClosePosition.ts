import { useStores } from "stores";
import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import useMetaMask from "context/metamask";
import { ClosePositionProps } from "components/Positions/ClosePositionDialog";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";
import ICollateralPool from "stores/interfaces/ICollateralPool";

export enum ClosingType {
  Full,
  Partial,
}

const useClosePosition = (
  position: ClosePositionProps["position"],
  onClose: ClosePositionProps["onClose"],
  closingType: ClosingType,
  setType: Dispatch<ClosingType>,
  refetchData: () => void
) => {
  const { positionStore } = useStores();
  const { account } = useMetaMask()!;

  const { data } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

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
    const balance = await positionStore.balanceStableCoin(account);
    setBalance(balance!);
  }, [positionStore, account, setBalance]);

  const handleOnOpen = useCallback(async () => {
    setPrice(pool.priceWithSafetyMargin);
    setFathomToken(pool.priceWithSafetyMargin * lockedCollateral);
    setCollateral(lockedCollateral);
  }, [pool, lockedCollateral, setPrice, setFathomToken, setCollateral]);

  useEffect(() => {
    getBalance();
    handleOnOpen();
  }, [getBalance, handleOnOpen]);

  useEffect(() => {
    !isNaN(balance as number) && balance as number / 10 ** 18 < fathomToken
      ? setBalanceError(true)
      : setBalanceError(false);
  }, [fathomToken, balance]);

  const closePosition = useCallback(async () => {
    setDisableClosePosition(true);
    try {
      if (closingType === ClosingType.Full) {
        await positionStore.fullyClosePosition(
          position,
          pool,
          account,
          collateral
        );
      } else {
        await positionStore.partiallyClosePosition(
          position,
          pool,
          account,
          fathomToken,
          collateral
        );
      }

      refetchData();
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
    fathomToken,
    collateral,
    positionStore,
    onClose,
    setDisableClosePosition,
    refetchData,
  ]);

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      const maxAllowed = lockedCollateral * price;
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
    const walletBalance = balance as number / 10 ** 18;
    const maxBalance = lockedCollateral * price;

    const setBalance = walletBalance < maxBalance ? walletBalance : maxBalance;

    setFathomToken(setBalance);
    setCollateral(setBalance / price);
  }, [price, lockedCollateral, balance, setFathomToken, setCollateral]);

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
  };
};

export default useClosePosition;
