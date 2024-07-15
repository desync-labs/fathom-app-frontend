import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { useServices } from "context/services";
import BigNumber from "bignumber.js";
import { useQuery } from "@apollo/client";
import { FXD_POOLS } from "apollo/queries";

import { ClosePositionContextType } from "context/repayPosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

import { WeiPerWad } from "utils/Constants";

import { ICollateralPool, IOpenPosition } from "fathom-sdk";
import debounce from "lodash.debounce";
import { ChainId, NATIVE_ASSETS } from "connectors/networks";

const useRepayPosition = (
  position: ClosePositionContextType["position"],
  onClose: ClosePositionContextType["onClose"]
) => {
  const { positionService } = useServices();
  const { chainId, account } = useConnector();

  const { data: poolsItems, loading: poolsLoading } = useQuery(FXD_POOLS, {
    context: { clientName: "stable", chainId },
    fetchPolicy: "cache-first",
    variables: { chainId },
  });

  const poolsData = useMemo(() => {
    if (!poolsLoading && poolsItems && poolsItems.pools) {
      return poolsItems.pools.map((poolItem: ICollateralPool) => {
        if (
          poolItem.poolName.toUpperCase() === "XDC" &&
          chainId === ChainId.SEPOLIA
        ) {
          return { ...poolItem, poolName: "ETH" };
        } else {
          return poolItem;
        }
      });
    } else {
      return [];
    }
  }, [poolsItems, poolsLoading, chainId]);

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [priceOfCollateral, setPriceOfCollateral] = useState<string>("0");

  const pool = useMemo(
    () =>
      poolsData?.find(
        (pool: ICollateralPool) => pool.id === position?.collateralPool
      ),
    [poolsData, position]
  );

  const lockedCollateral = useMemo(
    () => position.lockedCollateral.toString(),
    [position]
  );

  const totalCollateral = useMemo(() => {
    return collateral
      ? BigNumber(position.lockedCollateral).minus(collateral).toString()
      : position.lockedCollateral.toString();
  }, [collateral, position]);

  const totalFathomToken = useMemo(() => {
    return (
      fathomToken
        ? BigNumber(debtValue).minus(fathomToken).toString()
        : debtValue
    ).toString();
  }, [fathomToken, debtValue]);

  const handleUpdates = useCallback(
    async (totalCollateralAmount: string, totalFathomAmount: string) => {
      if (
        BigNumber(totalFathomAmount).isGreaterThan(0) &&
        !isNaN(Number(totalFathomAmount))
      ) {
        const liquidationPrice = BigNumber(totalFathomAmount)
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
        const priceOfCollateralFromDex = BigNumber(pool.collateralLastPrice)
          .multipliedBy(10 ** 18)
          .toNumber();

        const overCollateral = BigNumber(totalCollateralAmount)
          .multipliedBy(priceOfCollateralFromDex)
          .dividedBy(10 ** 18)
          .dividedBy(totalFathomAmount)
          .multipliedBy(100)
          .toNumber();

        setPriceOfCollateral(priceOfCollateralFromDex.toString());
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
        const approved = await positionService.approvalStatusStableCoin(
          fathomToken,
          account
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [positionService, account]
  );

  const getBalance = useCallback(async () => {
    const balance = await positionService.balanceStableCoin(account);
    const balanceInDecimal = BigNumber(balance.toString())
      .dividedBy(WeiPerWad)
      .toString();

    setBalance(balanceInDecimal);
  }, [positionService, account, setBalance]);

  const getDebtValue = useCallback(async () => {
    let debtValue: string | BigNumber = await positionService.getDebtValue(
      position.debtShare,
      position.collateralPool
    );

    /**
     * Slightly increase debt value to avoid rounding errors
     */
    debtValue = BigNumber(debtValue).multipliedBy(1.0001);

    const liquidationPrice = debtValue
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
    setDebtValue(debtValue.toString());
  }, [
    pool,
    position,
    positionService,
    setDebtValue,
    setLiquidationPrice,
    setLtv,
  ]);

  const handleOnOpen = useCallback(async () => {
    if (debtValue) {
      const price = BigNumber(debtValue).dividedBy(lockedCollateral);
      setPrice(price.toString());

      const fathomValue = BigNumber(balance).isGreaterThan(debtValue)
        ? debtValue
        : balance;
      setFathomToken(fathomValue);

      let collateral = BigNumber(fathomValue).dividedBy(price);

      if (collateral.isGreaterThan(lockedCollateral)) {
        collateral = BigNumber(lockedCollateral);
      }

      setCollateral(collateral.toString());
    }
  }, [
    lockedCollateral,
    balance,
    debtValue,
    setPrice,
    setFathomToken,
    setCollateral,
  ]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getBalance(), getDebtValue()])
      .then(handleOnOpen)
      .finally(() => setIsLoading(false));
  }, [getBalance, handleOnOpen, getDebtValue, setIsLoading]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (account && chainId) {
      /**
       * Get debt balance of the user every 5 seconds
       */
      interval = setInterval(getDebtValue, 5000);
    }

    return () => interval && clearInterval(interval);
  }, [account, chainId, getDebtValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (balance && !isLoading && BigNumber(balance).isLessThan(fathomToken)) {
        setBalanceError(true);
      } else {
        setBalanceError(false);
      }

      if (BigNumber(fathomToken).isLessThanOrEqualTo(0) && !isLoading) {
        setBalanceErrorNotFilled(true);
      } else {
        setBalanceErrorNotFilled(false);
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [
    fathomToken,
    balance,
    isLoading,
    setBalanceErrorNotFilled,
    setBalanceError,
  ]);

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
      if (BigNumber(fathomToken).isEqualTo(position.debtValue)) {
        if (NATIVE_ASSETS.includes(pool.poolName.toUpperCase())) {
          /**
           * Fully close position with native assets
           */
          blockNumber = await positionService.closePosition(
            position.positionId,
            pool,
            account,
            BigNumber(collateral).multipliedBy(WeiPerWad).toFixed(0)
          );
        } else {
          /**
           * Fully close position with ERC20 token
           */
          blockNumber = await positionService.closePositionERC20(
            position.positionId,
            pool,
            account,
            BigNumber(collateral).multipliedBy(WeiPerWad).toFixed(0)
          );
        }
      } else {
        /**
         * Close position with native assets
         */
        if (NATIVE_ASSETS.includes(pool.poolName.toUpperCase())) {
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
              .toFixed(0, BigNumber.ROUND_UP)
          );
        } else {
          /**
           * Close position with ERC20 token
           */
          blockNumber = await positionService.partiallyClosePositionERC20(
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
              .toFixed(0, BigNumber.ROUND_UP)
          );
        }
      }

      setLastTransactionBlock(blockNumber as number);
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
      setCollateral(bigIntValue.dividedBy(price).decimalPlaces(18).toString());
      setFathomTokenIsDirty(true);
    },
    [
      price,
      debtValue,
      balance,
      setFathomToken,
      setCollateral,
      setBalanceError,
      setFathomTokenIsDirty,
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
    setCollateral,
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
      await positionService.approveStableCoin(account);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [account, positionService, setApprovalPending, setApproveBtn]);

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
    approve,
    priceOfCollateral,
  };
};

export default useRepayPosition;
