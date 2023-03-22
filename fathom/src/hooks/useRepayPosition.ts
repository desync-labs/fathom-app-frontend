import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { useStores } from "stores";
import BigNumber from "bignumber.js";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";

import { ClosePositionContextType } from "context/closePosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

import { Constants } from "helpers/Constants";

import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";

const useRepayPosition = (
  position: ClosePositionContextType["position"],
  onClose: ClosePositionContextType["onClose"]
) => {
  const { positionService } = useStores();
  const { account } = useConnector()!;
  const { library, chainId } = useConnector();

  const { data } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first",
  });

  const { setLastTransactionBlock } = useSyncContext();

  const [collateral, setCollateral] = useState<string>("");
  const [fathomToken, setFathomToken] = useState<string>("");

  const [price, setPrice] = useState<string>("");

  const [balance, setBalance] = useState<string>("");

  const [balanceError, setBalanceError] = useState<boolean>(false);

  const [disableClosePosition, setDisableClosePosition] =
    useState<boolean>(false);

  const [debtValue, setDebtValue] = useState<string>("");
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  const [ltv, setLtv] = useState<number>(0);

  const pool = useMemo(
    () =>
      data?.pools?.find(
        (pool: ICollateralPool) => pool.id === position?.collateralPool
      ),
    [data, position]
  );

  const lockedCollateral = useMemo(
    () => position.lockedCollateral.toString(),
    [position]
  );

  const getBalance = useCallback(async () => {
    const balance = await positionService.balanceStableCoin(account, library);
    const balanceInDecimal = BigNumber(balance)
      .dividedBy(Constants.WeiPerWad)
      .toFixed();

    setBalance(balanceInDecimal);
  }, [positionService, account, library, setBalance]);

  const getDebtValue = useCallback(async () => {
    const debtValue = await positionService.getDebtValue(
      position.debtShare,
      position.collateralPool,
      library
    );

    const liquidationPrice = BigNumber(pool.rawPrice)
      .minus(
        BigNumber(pool.priceWithSafetyMargin)
          .multipliedBy(position.lockedCollateral)
          .minus(position.debtValue)
          .dividedBy(position.lockedCollateral)
      )
      .toNumber();

    const ltv = BigNumber(position.debtValue)
      .dividedBy(
        BigNumber(pool.rawPrice).multipliedBy(position.lockedCollateral)
      )
      .toNumber();

    setLtv(ltv);
    setLiquidationPrice(liquidationPrice);
    setDebtValue(debtValue);
  }, [
    pool,
    position,
    positionService,
    library,
    setDebtValue,
    setLiquidationPrice,
    setLtv,
  ]);

  const handleOnOpen = useCallback(async () => {
    const price = BigNumber(debtValue).dividedBy(lockedCollateral);
    setPrice(price.toString());

    setFathomToken(debtValue);
    setCollateral(lockedCollateral);
  }, [lockedCollateral, debtValue, setPrice, setFathomToken, setCollateral]);

  useEffect(() => {
    getBalance();
    getDebtValue();
    handleOnOpen();
  }, [getBalance, handleOnOpen, getDebtValue]);

  useEffect(() => {
    balance && BigNumber(balance).isLessThan(fathomToken)
      ? setBalanceError(true)
      : setBalanceError(false);
  }, [fathomToken, balance]);

  const closePositionHandler = useCallback(async () => {
    setDisableClosePosition(true);
    try {
      let receipt;
      if (BigNumber(collateral).isEqualTo(lockedCollateral)) {
        receipt = await positionService.closePosition(
          position.positionId,
          pool,
          account,
          BigNumber(collateral).multipliedBy(Constants.WeiPerWad).toFixed(),
          library
        );
      } else {
        receipt = await positionService.partiallyClosePosition(
          position.positionId,
          pool,
          account,
          BigNumber(fathomToken)
            .multipliedBy(Constants.WeiPerWad)
            .toFixed(0, BigNumber.ROUND_UP),
          BigNumber(collateral)
            .multipliedBy(Constants.WeiPerWad)
            .toFixed(0, BigNumber.ROUND_UP),
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
    lockedCollateral,
    position,
    pool,
    account,
    fathomToken,
    collateral,
    positionService,
    library,
    onClose,
    setDisableClosePosition,
    setLastTransactionBlock,
  ]);

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      let { value } = e.target;
      let bigIntValue = BigNumber(value);

      if (bigIntValue.isGreaterThan(debtValue)) {
        bigIntValue = BigNumber(debtValue);
        value = bigIntValue.toString();
      }

      if (!bigIntValue.toString() || bigIntValue.toString() === "NaN") {
        bigIntValue = BigNumber(0);
      }

      bigIntValue.isGreaterThan(balance)
        ? setBalanceError(true)
        : setBalanceError(false);

      setFathomToken(value);
      setCollateral(bigIntValue.dividedBy(price).precision(18).toFixed());
    },
    [price, debtValue, balance, setFathomToken, setCollateral, setBalanceError]
  );

  const handleCollateralTextFieldChange = useCallback(
    (e: any) => {
      const { value } = e.target;
      let bigIntValue = BigNumber(value);

      if (bigIntValue.isGreaterThan(lockedCollateral)) {
        bigIntValue = BigNumber(lockedCollateral);
        setCollateral(lockedCollateral);
      } else {
        setCollateral(value);
      }

      const repay = bigIntValue.multipliedBy(price);
      if (BigNumber(fathomToken).isLessThan(repay)) {
        setFathomToken(repay.toString());
      }
    },
    [lockedCollateral, fathomToken, price, setCollateral, setFathomToken]
  );

  const setMax = useCallback(() => {
    const setBalance = BigNumber(balance).isLessThan(debtValue)
      ? BigNumber(balance)
      : BigNumber(debtValue);

    let collateral = setBalance.dividedBy(price);
    if (collateral.isGreaterThan(lockedCollateral)) {
      collateral = BigNumber(lockedCollateral);
    }

    setFathomToken(setBalance.toString());
    setCollateral(collateral.toString());
  }, [
    price,
    debtValue,
    balance,
    lockedCollateral,
    setFathomToken,
    setCollateral,
  ]);

  const switchPosition = useCallback(
    (callback: Dispatch<IOpenPosition>) => {
      onClose();
      callback(position);
    },
    [onClose, position]
  );

  return {
    liquidationPrice,
    ltv,
    chainId,
    collateral,
    lockedCollateral,
    price,
    fathomToken,
    pool,
    balance,
    balanceError,
    closePositionHandler,
    disableClosePosition,
    handleFathomTokenTextFieldChange,
    handleCollateralTextFieldChange,
    setMax,
    onClose,
    position,
    debtValue,
    switchPosition,
  };
};

export default useRepayPosition;
