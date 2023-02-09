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
import { Constants } from "helpers/Constants";

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

  const [collateral, setCollateral] = useState<string>("");
  const [fathomToken, setFathomToken] = useState<string>("");

  const [price, setPrice] = useState<string>("");

  const [balance, setBalance] = useState<string>("");
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [disableClosePosition, setDisableClosePosition] =
    useState<boolean>(false);

  const [debtValue, setDebtValue] =
    useState<string>("");  

  const pool = useMemo(
    () =>
      data?.pools?.find(
        (pool: ICollateralPool) => pool.id === position?.collateralPool
      ),
    [data, position]
  );

  const lockedCollateral = useMemo(
    () => library.utils.toWei(position.lockedCollateral, "ether"),
    [position, library]
  );

  const getBalance = useCallback(async () => {
    const balance = await positionService.balanceStableCoin(account, library);
    setBalance(balance);
  }, [positionService, account, library, setBalance]);

  const getDebtValue = useCallback(async () => {
    const debtValue = await positionService.getDebtValue(position.debtShare,position.collateralPool, library);
    setDebtValue(debtValue);
  }, [positionService, position.debtShare, library, setDebtValue, position.collateralPool]);


  const handleOnOpen = useCallback(async () => {
    const price = BigNumber(debtValue).multipliedBy(Constants.WeiPerRad).dividedBy(lockedCollateral);

    setPrice(price.toString());

    setFathomToken(
      debtValue
    );
    setCollateral(lockedCollateral);
  }, [lockedCollateral, debtValue, setPrice, setFathomToken, setCollateral]);

  useEffect(() => {
    getBalance();
    getDebtValue();
    handleOnOpen();
  }, [getBalance, handleOnOpen, getDebtValue]);

  useEffect(() => {
    balance && BigNumber(balance).dividedBy(Constants.WeiPerWad).isLessThan(fathomToken)
      ? setBalanceError(true)
      : setBalanceError(false);
  }, [fathomToken, balance]);

  const closePosition = useCallback(async () => {
    setDisableClosePosition(true);
    try {
      let receipt;
      if (closingType === ClosingType.Full || BigNumber(collateral).isEqualTo(lockedCollateral)) {
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
      let bigIntValue = BigNumber(value).multipliedBy(Constants.WeiPerRad);

      if (bigIntValue.isGreaterThan(BigNumber(debtValue).multipliedBy(Constants.WeiPerRad))) {
        bigIntValue = BigNumber(debtValue).multipliedBy(Constants.WeiPerRad);
        value = bigIntValue.dividedBy(Constants.WeiPerRad).toString();
      }

      if (!bigIntValue.toString() || bigIntValue.toString() === "NaN") {
        bigIntValue = BigNumber(0);
      }

      bigIntValue.isGreaterThan(balance)
        ? setBalanceError(true)
        : setBalanceError(false);

      setFathomToken(value);
      setCollateral(bigIntValue.dividedBy(price).toString());
    },
    [price, debtValue, balance, setFathomToken, setCollateral, setBalanceError]
  );

  const handleTypeChange = useCallback(
    (type: ClosingType) => {
      if (type === ClosingType.Full) {
        setFathomToken(debtValue);
        setCollateral(lockedCollateral);
      }
      setType(type);
    },
    [debtValue, lockedCollateral, setFathomToken, setType, setCollateral]
  );

  const setMax = useCallback(() => {
    
    const setBalance = BigNumber(balance).isLessThan(BigNumber(debtValue).multipliedBy(Constants.WeiPerRad))
      ? BigNumber(balance)
      : BigNumber(debtValue).multipliedBy(Constants.WeiPerRad);

    setFathomToken(setBalance.dividedBy(Constants.WeiPerWad).toString());

    let bal = setBalance.dividedBy(Constants.WeiPerWad).multipliedBy(Constants.WeiPerRad);
    setCollateral(bal.dividedBy(price).toString());
    
  }, [price, debtValue, balance, setFathomToken, setCollateral]);

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
    debtValue,
  };
};

export default useClosePosition;
