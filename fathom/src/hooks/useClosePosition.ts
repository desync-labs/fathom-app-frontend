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

  const [collateral, setCollateral] = useState<string>("");
  const [fathomToken, setFathomToken] = useState<string>("");

  const [price, setPrice] = useState<string>("");

  const [balance, setBalance] = useState<string>("");
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
    () => library.utils.toWei(position.lockedCollateral, "ether"),
    [position, library]
  );
  const debtShare = useMemo(
    () =>
      BigNumber(position.debtShare)
        .multipliedBy(10 ** 18)
        .toString(),
    [position]
  );

  const getBalance = useCallback(async () => {
    const balance = await positionService.balanceStableCoin(account, library);
    setBalance(balance);
  }, [positionService, account, library, setBalance]);

  const handleOnOpen = useCallback(async () => {
    const price = BigNumber(debtShare).dividedBy(lockedCollateral);

    setPrice(price.toString());

    setFathomToken(
      BigNumber(debtShare)
        .dividedBy(10 ** 18)
        .toString()
    );
    setCollateral(lockedCollateral);
  }, [lockedCollateral, debtShare, setPrice, setFathomToken, setCollateral]);

  useEffect(() => {
    getBalance();
    handleOnOpen();
  }, [getBalance, handleOnOpen]);

  useEffect(() => {
    balance && BigNumber(balance).isLessThan(fathomToken)
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
      let bigIntValue = BigNumber(value).multipliedBy(10 ** 18);

      if (bigIntValue.isGreaterThan(debtShare)) {
        bigIntValue = BigNumber(debtShare);
        value = bigIntValue.dividedBy(10 ** 18).toString();
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
    [price, debtShare, balance, setFathomToken, setCollateral, setBalanceError]
  );

  const handleTypeChange = useCallback(
    (type: ClosingType) => {
      if (type === ClosingType.Full) {
        setFathomToken(debtShare);
        setCollateral(lockedCollateral);
      }
      setType(type);
    },
    [debtShare, lockedCollateral, setFathomToken, setType, setCollateral]
  );

  const setMax = useCallback(() => {
    const setBalance = BigNumber(balance).isLessThan(debtShare)
      ? BigNumber(balance)
      : BigNumber(debtShare);
    setFathomToken(setBalance.dividedBy(10 ** 18).toString());
    setCollateral(setBalance.dividedBy(price).toString());
  }, [price, debtShare, balance, setFathomToken, setCollateral]);

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
