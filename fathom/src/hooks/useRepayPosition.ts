import {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { useStores } from "stores";
import BigNumber from "bignumber.js";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";

import { ClosePositionContextType } from "context/repayPosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

import { WeiPerWad } from "helpers/Constants";

import ICollateralPool from "stores/interfaces/ICollateralPool";
import IOpenPosition from "stores/interfaces/IOpenPosition";
import debounce from "lodash.debounce";
import { SmartContractFactory } from "config/SmartContractFactory";

const useRepayPosition = (
  position: ClosePositionContextType["position"],
  onClose: ClosePositionContextType["onClose"]
) => {
  const { positionService } = useStores();
  const { library, chainId, account } = useConnector();

  const { data } = useQuery(FXD_POOLS, {
    context: { clientName: "stable" },
    fetchPolicy: "cache-first"
  });

  const { setLastTransactionBlock } = useSyncContext();

  const [collateral, setCollateral] = useState<string>("");
  const [fathomToken, setFathomToken] = useState<string>("");
  const [fathomTokenIsDirty, setFathomTokenIsDirty] = useState<boolean>(false);

  const [price, setPrice] = useState<string>("");

  const [balance, setBalance] = useState<string>("");
  const [balanceError, setBalanceError] = useState<boolean>(false);
  const [balanceErrorNotFilled, setBalanceErrorNotFilled] =
    useState<boolean>(false);

  const [disableClosePosition, setDisableClosePosition] =
    useState<boolean>(false);

  const [debtValue, setDebtValue] = useState<string>("");
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);

  const [ltv, setLtv] = useState<number>(0);
  const [overCollateral, setOverCollateral] = useState<number>(0);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

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

  const totalCollateral = useMemo(() => {
    return (
      collateral
        ? BigNumber(position.lockedCollateral).minus(collateral).toString()
        : position.lockedCollateral
    ).toString();
  }, [collateral, position]);

  const totalFathomToken = useMemo(() => {
    return (
      fathomToken ? BigNumber(debtValue).minus(fathomToken).toString() : debtValue
    ).toString();
  }, [fathomToken, debtValue]);

  const fxdTokenAddress = useMemo(() => {
    return SmartContractFactory.FathomStableCoin(chainId!).address;
  }, [chainId]);

  const handleUpdates = useCallback(
    async (totalCollateralAmount: string, totalFathomAmount: string) => {
      if (BigNumber(totalFathomAmount).isGreaterThan(0) && !isNaN(Number(totalFathomAmount))) {
        const liquidationPrice =
          BigNumber(totalFathomAmount)
            .dividedBy(totalCollateralAmount)
            .multipliedBy(pool.liquidationRatio)
            .toNumber();

        const ltv = BigNumber(totalFathomAmount)
          .dividedBy(
            BigNumber(pool.rawPrice).multipliedBy(totalCollateralAmount)
          )
          .toNumber();

        /**
         * PRICE OF COLLATERAL FROM DEX
         */
        const priceOfCollateralFromDex =
          BigNumber(pool.collateralLastPrice)
            .multipliedBy(10 ** 18)
            .toNumber();

        const overCollateral = BigNumber(totalCollateralAmount)
          .multipliedBy(priceOfCollateralFromDex)
          .dividedBy(10 ** 18).dividedBy(totalFathomAmount).multipliedBy(100).toNumber();

        setLiquidationPrice(liquidationPrice);
        setLtv(ltv);
        setOverCollateral(overCollateral);
      } else {
        setOverCollateral(0);
      }
    },
    [pool, setLiquidationPrice, setLtv, setOverCollateral]
  );

  const checkFXDAllowance = useMemo(
    () =>
      debounce(async (fathomToken: string) => {
        let approved = await positionService.approvalStatus(
          account,
          fxdTokenAddress!,
          fathomToken,
          library
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [positionService, fxdTokenAddress, account, library]
  );

  const getBalance = useCallback(async () => {
    const balance = await positionService.balanceStableCoin(account, library);
    const balanceInDecimal = BigNumber(balance)
      .dividedBy(WeiPerWad)
      .toFixed();

    setBalance(balanceInDecimal);
  }, [positionService, account, library, setBalance]);

  const getDebtValue = useCallback(async () => {
    const debtValue = await positionService.getDebtValue(
      position.debtShare,
      position.collateralPool,
      library
    );

    const liquidationPrice =
      BigNumber(debtValue)
        .dividedBy(position.lockedCollateral)
        .multipliedBy(pool.liquidationRatio)
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
    setLtv
  ]);

  const handleOnOpen = useCallback(async () => {
    const price = BigNumber(debtValue).dividedBy(lockedCollateral);
    setPrice(price.toString());

    const fathomValue = BigNumber(balance).isGreaterThan(debtValue) ? debtValue : balance;
    setFathomToken(fathomValue);

    let collateral = BigNumber(fathomValue).dividedBy(price).decimalPlaces(12, BigNumber.ROUND_UP);

    if (collateral.isGreaterThan(lockedCollateral)) {
      collateral = BigNumber(lockedCollateral);
    }

    setCollateral(collateral.toString());
  }, [lockedCollateral, balance, debtValue, setPrice, setFathomToken, setCollateral]);

  useEffect(() => {
    getBalance().then(() => {
      handleOnOpen();
    });
    getDebtValue();
  }, [getBalance, handleOnOpen, getDebtValue]);

  useEffect(() => {
    balance && BigNumber(balance).isLessThan(fathomToken)
      ? setBalanceError(true)
      : setBalanceError(false);

    !fathomToken
      ? setBalanceErrorNotFilled(true)
      : setBalanceErrorNotFilled(false);
  }, [fathomToken, balance]);

  useEffect(() => {
    if (fathomToken) {
      checkFXDAllowance(fathomToken);
    }
  }, [fathomToken, checkFXDAllowance]);

  useEffect(() => {
    if (totalCollateral || totalFathomToken) {
      handleUpdates(totalCollateral, totalFathomToken);
    }
  }, [pool, totalCollateral, totalFathomToken, handleUpdates]);

  const closePositionHandler = useCallback(async () => {
    setDisableClosePosition(true);

    try {
      let blockNumber;
      if (BigNumber(collateral).isEqualTo(lockedCollateral)) {
        blockNumber = await positionService.closePosition(
          position.positionId,
          pool,
          account,
          BigNumber(collateral).multipliedBy(WeiPerWad).toFixed(),
          library
        );
      } else {
        blockNumber = await positionService.partiallyClosePosition(
          position.positionId,
          pool,
          account,
          fathomToken
            ? BigNumber(fathomToken)
              .multipliedBy(WeiPerWad)
              .toFixed(0, BigNumber.ROUND_UP)
            : "0",
          BigNumber(collateral)
            .multipliedBy(WeiPerWad)
            .toFixed(0, BigNumber.ROUND_UP),
          library
        );
      }

      setLastTransactionBlock(blockNumber!);
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
    setLastTransactionBlock
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
      setFathomTokenIsDirty(true);
    },
    [
      price,
      debtValue,
      balance,
      setFathomToken,
      setCollateral,
      setBalanceError,
      setFathomTokenIsDirty
    ]
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
    setCollateral
  ]);

  const switchPosition = useCallback(
    (callback: Dispatch<IOpenPosition>) => {
      onClose();
      callback(position);
    },
    [onClose, position]
  );

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionService.approve(account, fxdTokenAddress!, library);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
    fxdTokenAddress,
    positionService,
    library,
    setApprovalPending,
    setApproveBtn
  ]);

  return {
    liquidationPrice,
    ltv,
    overCollateral,
    chainId,
    collateral,
    lockedCollateral,
    price,
    fathomToken,
    pool,
    balance,
    balanceError,
    balanceErrorNotFilled,
    fathomTokenIsDirty,
    closePositionHandler,
    disableClosePosition,
    handleFathomTokenTextFieldChange,
    handleCollateralTextFieldChange,
    setMax,
    onClose,
    position,
    debtValue,
    switchPosition,
    approveBtn,
    approvalPending,
    approve
  };
};

export default useRepayPosition;
