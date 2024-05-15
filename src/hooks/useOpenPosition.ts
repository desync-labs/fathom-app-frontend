import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useServices } from "context/services";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";
import { OpenPositionContextType } from "context/openPosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import { DANGER_SAFETY_BUFFER } from "utils/Constants";
import { ZERO_ADDRESS } from "fathom-sdk";

export const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: "0",
  dangerSafeMax: "0",
};

const useOpenPosition = (
  pool: OpenPositionContextType["pool"],
  onClose: OpenPositionContextType["onClose"],
  proxyWallet: OpenPositionContextType["proxyWallet"]
) => {
  const { poolService, positionService } = useServices();
  const { account, chainId, library } = useConnector();

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const collateral = watch("collateral");
  const fathomToken = watch("fathomToken");
  const safeMax = watch("safeMax");
  const dangerSafeMax = watch("dangerSafeMax");

  const [balance, setBalance] = useState<string>("0");

  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [collateralToBeLocked, setCollateralToBeLocked] = useState<string>("0");
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = useState<string>("0");
  const [collateralTokenAddress, setCollateralTokenAddress] = useState<
    string | null
  >();

  const [maxBorrowAmount, setMaxBorrowAmount] = useState<string>("");

  const { setLastTransactionBlock } = useSyncContext();

  const [collateralAvailableToWithdraw, setCollateralAvailableToWithdraw] =
    useState<string>("0");
  const [safetyBuffer, setSafetyBuffer] = useState<string>("0");
  const [debtRatio, setDebtRatio] = useState<string>("0");
  const [overCollateral, setOverCollateral] = useState<string>("0");
  const [liquidationPrice, setLiquidationPrice] = useState<string>("0");
  const [fxdAvailableToBorrow, setFxdAvailableToBorrow] = useState<string>("0");

  const [openPositionLoading, setOpenPositionLoading] =
    useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const proxyWalletExists = useMemo(
    () => proxyWallet !== ZERO_ADDRESS,
    [proxyWallet]
  );

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

  const getCollateralTokenAndBalance = useCallback(async () => {
    /**
     * Native token collateral.
     */
    if (
      pool.poolName.toUpperCase() === "XDC" ||
      pool.poolName.toUpperCase() === "ETH"
    ) {
      const balance = await library.getBalance(account);
      setCollateralTokenAddress(null);
      setBalance(balance.toString());
    } else {
      /**
       * ERC20 token collateral.
       */
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
  }, [poolService, account, pool, library, setCollateralTokenAddress]);

  const getPositionDebtCeiling = useCallback(() => {
    positionService
      .getPositionDebtCeiling(pool.id)
      .then((debtCeiling: string) => {
        setMaxBorrowAmount(debtCeiling);
      })
      .catch(() => {
        console.log("Can`t get MAX_BORROW_AMOUNT");
      });
  }, [positionService, pool, setMaxBorrowAmount]);

  const availableFathomInPool = useMemo(
    () => Number(pool.totalAvailable),
    [pool]
  );

  const dangerSafetyBuffer = useMemo(() => {
    return (
      !Object.keys(errors).length &&
      isTouched &&
      isDirty &&
      BigNumber(safetyBuffer).isGreaterThanOrEqualTo(0) &&
      BigNumber(safetyBuffer).isLessThan(DANGER_SAFETY_BUFFER)
    );
  }, [isTouched, isDirty, safetyBuffer, errors]);

  const handleUpdates = useCallback(
    async (collateralInput: string, fathomTokenInput: string) => {
      collateralInput = collateralInput || "0";
      fathomTokenInput = fathomTokenInput || "0";
      setCollateralToBeLocked(collateralInput);
      setFxdToBeBorrowed(fathomTokenInput);

      /**
       * GET PRICE WITH SAFETY MARGIN
       */
      const { priceWithSafetyMargin } = pool;

      /**
       * SAFE MAX
       */
      const safeMax = BigNumber(collateralInput)
        .multipliedBy(
          BigNumber(priceWithSafetyMargin)
            .multipliedBy(BigNumber(100).minus(pool.stabilityFeeRate))
            .dividedBy(100)
        )
        .toString();

      /**
       * DANGER_SAFE_MAX
       */
      const dangerSafeMax = BigNumber(collateralInput)
        .multipliedBy(
          BigNumber(priceWithSafetyMargin)
            .multipliedBy(BigNumber(100).minus(DANGER_SAFETY_BUFFER * 100))
            .dividedBy(100)
        )
        .decimalPlaces(6, BigNumber.ROUND_DOWN)
        .toString();

      setFxdToBeBorrowed(safeMax);
      setValue("safeMax", safeMax);
      setValue("dangerSafeMax", dangerSafeMax);

      const collateralAvailableToWithdraw = (
        BigNumber(priceWithSafetyMargin).isGreaterThan(0)
          ? BigNumber(collateralInput)
              .multipliedBy(priceWithSafetyMargin)
              .minus(fathomTokenInput || 0)
              .dividedBy(priceWithSafetyMargin)
          : BigNumber(collateralInput).minus(fathomTokenInput)
      )
        .precision(10)
        .toString();

      setCollateralAvailableToWithdraw(collateralAvailableToWithdraw);

      /**
       * PRICE OF COLLATERAL FROM DEX
       */
      const priceOfCollateralFromDex =
        pool.poolName.toUpperCase() === "XDC" ||
        pool.poolName.toUpperCase() === "ETH"
          ? BigNumber(pool.collateralLastPrice)
              .multipliedBy(10 ** 18)
              .toNumber()
          : await poolService.getDexPrice(collateralTokenAddress as string);

      /**
       * DEBT RATIO
       */
      const debtRatio = BigNumber(fathomTokenInput).isGreaterThan(0)
        ? BigNumber(fathomTokenInput)
            .dividedBy(
              BigNumber(collateralInput)
                .multipliedBy(priceOfCollateralFromDex.toString())
                .dividedBy(10 ** 18)
            )
            .multipliedBy(100)
            .toString()
        : "0";

      const overCollateralDiv = BigNumber(10 ** 18).multipliedBy(
        fathomTokenInput
      );
      const overCollateral = (
        overCollateralDiv.isGreaterThan(0)
          ? BigNumber(collateralInput)
              .multipliedBy(priceOfCollateralFromDex.toString())
              .dividedBy(overCollateralDiv)
          : BigNumber(collateralInput)
              .multipliedBy(priceOfCollateralFromDex.toString())
              .dividedBy(10 ** 18)
      )
        .multipliedBy(100)
        .toString();

      setOverCollateral(overCollateral);
      setDebtRatio(debtRatio);

      /**
       * FXD AVAILABLE TO BORROW
       */
      const fxdAvailableToBorrow = BigNumber(safeMax)
        .minus(fathomTokenInput)
        .toString();

      setFxdAvailableToBorrow(fxdAvailableToBorrow);

      /**
       * SAFETY BUFFER
       */
      const safetyBuffer = BigNumber(collateralAvailableToWithdraw)
        .dividedBy(collateralInput)
        .precision(10, BigNumber.ROUND_FLOOR);

      setSafetyBuffer(safetyBuffer.isNaN() ? "0" : safetyBuffer.toString());

      /**
       * LIQUIDATION PRICE
       */
      const liquidationPrice = BigNumber(fathomTokenInput)
        .div(collateralInput)
        .multipliedBy(pool.liquidationRatio);

      setLiquidationPrice(
        liquidationPrice.isNaN() ? "0" : liquidationPrice.toString()
      );

      /**
       * Revalidate form
       */
      setTimeout(() => {
        trigger();
      }, 100);
    },
    [
      collateralTokenAddress,
      pool,
      poolService,
      setLiquidationPrice,
      setSafetyBuffer,
      setFxdAvailableToBorrow,
      setDebtRatio,
      setOverCollateral,
      setCollateralAvailableToWithdraw,
      setCollateralToBeLocked,
      setFxdToBeBorrowed,
      setValue,
      trigger,
    ]
  );

  const setSafeMax = useCallback(() => {
    setValue("fathomToken", dangerSafeMax.toString(), { shouldValidate: true });
  }, [dangerSafeMax, setValue]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      setOpenPositionLoading(true);
      const { collateral, fathomToken } = values;

      try {
        const blockNumber = await positionService.openPosition(
          account,
          pool,
          collateral,
          fathomToken
        );

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
      positionService,
      setOpenPositionLoading,
      setLastTransactionBlock,
      onClose,
    ]
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
    if (isTouched) {
      handleUpdates(collateral, fathomToken);
    }
    if (collateralTokenAddress) {
      approvalStatus(collateral);
    }
  }, [
    pool,
    collateral,
    collateralTokenAddress,
    fathomToken,
    isTouched,
    handleUpdates,
    approvalStatus,
  ]);

  useEffect(() => {
    if (collateral.trim() || fathomToken.trim()) {
      setIsTouched(true);
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [collateral, fathomToken]);

  useEffect(() => {
    if (account && chainId) {
      getCollateralTokenAndBalance();
      getPositionDebtCeiling();
    }
  }, [chainId, account, getCollateralTokenAndBalance, getPositionDebtCeiling]);

  return {
    proxyWalletExists,
    safeMax,
    approveBtn,
    approve,
    approvalPending,
    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdAvailableToBorrow,
    debtRatio,
    overCollateral,
    fxdToBeBorrowed,
    balance,
    safetyBuffer,
    liquidationPrice,
    collateral,
    fathomToken,
    openPositionLoading,
    setMax,
    setSafeMax,
    onSubmit,
    control,
    handleSubmit,
    availableFathomInPool,
    pool,
    onClose,
    dangerSafetyBuffer,
    errors,
    maxBorrowAmount,
  };
};

export default useOpenPosition;
