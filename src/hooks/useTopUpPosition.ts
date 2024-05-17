import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useServices } from "context/services";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";
import { OpenPositionContextType } from "context/openPosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { IOpenPosition } from "fathom-sdk";
import { DANGER_SAFETY_BUFFER } from "utils/Constants";

const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: 0,
  dangerSafeMax: 0,
};

const useTopUpPosition = (
  pool: OpenPositionContextType["pool"],
  onClose: OpenPositionContextType["onClose"],
  position: IOpenPosition
) => {
  const { poolService, positionService } = useServices();
  const { account, chainId, library } = useConnector();

  const { handleSubmit, watch, control, setValue, trigger } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const collateral = watch("collateral");
  const fathomToken = watch("fathomToken");
  const safeMax = watch("safeMax");
  const dangerSafeMax = watch("dangerSafeMax");

  const [debtValue, setDebtValue] = useState<string>("");
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");

  const [ltv, setLtv] = useState<string>("");
  const [overCollateral, setOverCollateral] = useState<number>(0);
  const [safetyBuffer, setSafetyBuffer] = useState<string>("");

  const [balance, setBalance] = useState<string>("0");
  const [collateralTokenAddress, setCollateralTokenAddress] = useState<
    string | null
  >();
  const [maxBorrowAmount, setMaxBorrowAmount] = useState<string>("");
  const [errorAtLeastOneField, setErrorAtLeastOneField] =
    useState<boolean>(false);

  const { setLastTransactionBlock } = useSyncContext();

  const [openPositionLoading, setOpenPositionLoading] =
    useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const availableFathomInPool = useMemo(() => {
    return pool.availableFathomInPool;
  }, [pool]);

  const totalCollateral = useMemo(() => {
    return (
      collateral
        ? BigNumber(position.lockedCollateral).plus(collateral)
        : position.lockedCollateral
    ).toString();
  }, [collateral, position]);

  const totalFathomToken = useMemo(() => {
    return (
      fathomToken ? BigNumber(debtValue).plus(fathomToken) : debtValue
    ).toString();
  }, [fathomToken, debtValue]);

  const approvalStatus = useMemo(
    () =>
      debounce(async (collateral: string) => {
        const approved = await positionService.approvalStatus(
          account,
          collateralTokenAddress as string,
          collateral
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [positionService, collateralTokenAddress, account]
  );

  const getDebtValue = useCallback(async () => {
    const debtValue = await positionService.getDebtValue(
      position.debtShare,
      position.collateralPool
    );

    const liquidationPrice = BigNumber(debtValue)
      .dividedBy(position.lockedCollateral)
      .multipliedBy(pool.liquidationRatio)
      .toString();

    const ltv = BigNumber(debtValue)
      .dividedBy(
        BigNumber(pool.rawPrice).multipliedBy(position.lockedCollateral)
      )
      .toString();

    /**
     * PRICE OF COLLATERAL FROM DEX
     */
    const priceOfCollateralFromDex =
      pool.poolName.toUpperCase() === "XDC" ||
      pool.poolName.toUpperCase() === "CGO" ||
      pool.poolName === "CollateralTokenAdapterJeju" ||
      pool.poolName.toUpperCase() === "ETH"
        ? BigNumber(pool.collateralLastPrice)
            .multipliedBy(10 ** 18)
            .toNumber()
        : await poolService.getDexPrice(collateralTokenAddress as string);

    const overCollateral = BigNumber(totalCollateral)
      .multipliedBy(priceOfCollateralFromDex.toString())
      .dividedBy(10 ** 18)
      .dividedBy(totalFathomToken)
      .multipliedBy(100)
      .toNumber();

    setOverCollateral(overCollateral);

    setLtv(ltv);
    setLiquidationPrice(liquidationPrice);
    setDebtValue(debtValue);
  }, [
    totalFathomToken,
    totalCollateral,
    collateralTokenAddress,
    poolService,
    pool,
    position,
    positionService,
    setDebtValue,
    setLiquidationPrice,
    setLtv,
    setOverCollateral,
  ]);

  const getPositionDebtCeiling = useCallback(() => {
    positionService.getPositionDebtCeiling(pool.id).then((debtCeiling) => {
      setMaxBorrowAmount(debtCeiling);
    });
  }, [positionService, pool, setMaxBorrowAmount]);

  const getCollateralTokenAndBalance = useCallback(async () => {
    if (
      pool.poolName.toUpperCase() === "XDC" ||
      pool.poolName.toUpperCase() === "ETH"
    ) {
      const balance = await library.getBalance(account);
      setCollateralTokenAddress(null);
      setBalance(balance.toString());
    } else {
      const tokenAddress = await poolService.getCollateralTokenAddress(
        pool.tokenAdapterAddress
      );

      console.log("Token Adapter Address", pool.tokenAdapterAddress);
      console.log("Collateral Token Address", tokenAddress);

      const balance = await poolService.getUserTokenBalance(
        account,
        tokenAddress
      );

      setCollateralTokenAddress(tokenAddress);
      setBalance(balance.toString());
    }
  }, [poolService, account, pool, setCollateralTokenAddress]);

  const handleUpdates = useMemo(
    () =>
      debounce(
        async (totalCollateralAmount: string, totalFathomAmount: string) => {
          /**
           * GET PRICE WITH SAFETY MARGIN
           */
          const { priceWithSafetyMargin } = pool;

          /**
           * SAFE MAX
           */
          let safeMax = Number(
            BigNumber(totalCollateralAmount)
              .multipliedBy(
                BigNumber(priceWithSafetyMargin)
                  .multipliedBy(BigNumber(100).minus(pool.stabilityFeeRate))
                  .dividedBy(100)
              )
              .minus(debtValue)
              .toNumber()
          );

          let dangerSafeMax = Number(
            BigNumber(totalCollateralAmount)
              .multipliedBy(
                BigNumber(priceWithSafetyMargin)
                  .multipliedBy(
                    BigNumber(100).minus(DANGER_SAFETY_BUFFER * 100)
                  )
                  .dividedBy(100)
              )
              .minus(debtValue)
              .decimalPlaces(6, BigNumber.ROUND_DOWN)
              .toNumber()
          );

          safeMax = safeMax > 0 ? safeMax : 0;
          dangerSafeMax = dangerSafeMax > 0 ? dangerSafeMax : 0;

          const collateralAvailableToWithdraw =
            Number(priceWithSafetyMargin) === 0
              ? BigNumber(totalCollateralAmount)
                  .minus(totalFathomAmount)
                  .toNumber()
              : BigNumber(totalCollateralAmount)
                  .multipliedBy(priceWithSafetyMargin)
                  .minus(totalFathomAmount)
                  .dividedBy(priceWithSafetyMargin)
                  .toNumber();

          const safetyBuffer = BigNumber(collateralAvailableToWithdraw)
            .dividedBy(totalCollateralAmount)
            .decimalPlaces(4)
            .toString();

          setSafetyBuffer(safetyBuffer);

          setValue("safeMax", safeMax);
          setValue("dangerSafeMax", dangerSafeMax);

          const liquidationPrice = BigNumber(totalFathomAmount)
            .dividedBy(totalCollateralAmount)
            .multipliedBy(pool.liquidationRatio)
            .toString();

          const ltv = BigNumber(totalFathomAmount)
            .dividedBy(
              BigNumber(pool.rawPrice).multipliedBy(totalCollateralAmount)
            )
            .toString();

          setLiquidationPrice(liquidationPrice);
          setLtv(ltv);

          /**
           * Revalidate form
           */
          setTimeout(() => {
            trigger();
          }, 100);
        },
        500
      ),
    [
      pool,
      debtValue,
      setValue,
      trigger,
      setLiquidationPrice,
      setLtv,
      setSafetyBuffer,
    ]
  );

  const setSafeMax = useCallback(() => {
    setValue("fathomToken", dangerSafeMax.toString(), { shouldValidate: true });
  }, [dangerSafeMax, setValue]);

  const onSubmit = useCallback(
    async (values: any) => {
      const { collateral, fathomToken } = values;

      if (
        !BigNumber(collateral).isGreaterThan(0) &&
        !BigNumber(fathomToken).isGreaterThan(0)
      ) {
        setErrorAtLeastOneField(true);
        return;
      }

      setOpenPositionLoading(true);

      try {
        let blockNumber;
        if (BigNumber(fathomToken).isGreaterThan(0)) {
          if (
            pool.poolName.toUpperCase() === "XDC" ||
            pool.poolName.toUpperCase() === "ETH"
          ) {
            blockNumber = await positionService.topUpPositionAndBorrow(
              account,
              pool,
              collateral,
              fathomToken,
              position.positionId
            );
          } else {
            blockNumber = await positionService.topUpPositionAndBorrowERC20(
              account,
              pool,
              collateral,
              fathomToken,
              position.positionId
            );
          }
        } else {
          if (
            pool.poolName.toUpperCase() === "XDC" ||
            pool.poolName.toUpperCase() === "ETH"
          ) {
            blockNumber = await positionService.topUpPosition(
              account,
              pool,
              collateral,
              position.positionId
            );
          } else {
            blockNumber = await positionService.topUpPositionERC20(
              account,
              pool,
              collateral,
              position.positionId
            );
          }
        }
        setLastTransactionBlock(blockNumber as number);
        onClose();
      } catch (e) {
        console.log(e);
      }
      setOpenPositionLoading(false);
    },
    [
      account,
      pool,
      position,
      positionService,
      setOpenPositionLoading,
      setLastTransactionBlock,
      onClose,
    ]
  );

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
      await positionService.approve(account, collateralTokenAddress as string);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
    collateralTokenAddress,
    positionService,
    setApprovalPending,
    setApproveBtn,
  ]);

  const setMax = useCallback(
    (balance: string) => {
      const max = BigNumber(balance).dividedBy(10 ** 18);
      setValue("collateral", max.toString(), { shouldValidate: true });
    },
    [setValue]
  );

  useEffect(() => {
    if (account && chainId) {
      getDebtValue();
      getCollateralTokenAndBalance();
      getPositionDebtCeiling();
    }
  }, [
    chainId,
    account,
    getCollateralTokenAndBalance,
    getDebtValue,
    getPositionDebtCeiling,
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (account && chainId) {
      interval = setInterval(getDebtValue, 5000);
    }

    return () => interval && clearInterval(interval);
  }, [account, chainId, getDebtValue]);

  useEffect(() => {
    if (
      pool?.poolName?.toUpperCase() === "XDC" &&
      (totalCollateral || totalFathomToken)
    ) {
      handleUpdates(totalCollateral, totalFathomToken);
    } else if (
      collateralTokenAddress &&
      (totalCollateral || totalFathomToken)
    ) {
      handleUpdates(totalCollateral, totalFathomToken);
      approvalStatus(totalCollateral);
    }
  }, [
    pool,
    totalCollateral,
    totalFathomToken,
    collateralTokenAddress,
    handleUpdates,
    approvalStatus,
  ]);

  useEffect(() => {
    if (collateral.trim().length || fathomToken.trim().length) {
      setErrorAtLeastOneField(false);
    }
  }, [collateral, fathomToken]);

  return {
    position,
    safeMax,
    debtValue,
    approveBtn,
    approve,
    approvalPending,
    balance,
    liquidationPrice,
    ltv,
    safetyBuffer,
    collateral: Number(collateral),
    fathomToken,
    openPositionLoading,
    setMax,
    setSafeMax,
    onSubmit,
    control,
    handleSubmit,
    pool,
    onClose,
    switchPosition,
    totalCollateral,
    totalFathomToken,
    overCollateral,
    maxBorrowAmount,
    availableFathomInPool,
    errorAtLeastOneField,
  };
};

export default useTopUpPosition;
