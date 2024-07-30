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
import { NATIVE_ASSETS } from "connectors/networks";
import { formatNumber } from "utils/format";

export const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMinCollateral: "0",
};

const useOpenPosition = (
  pool: OpenPositionContextType["pool"],
  onClose: OpenPositionContextType["onClose"],
  proxyWallet: OpenPositionContextType["proxyWallet"],
  fetchProxyWallet: OpenPositionContextType["fetchProxyWallet"]
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
  const safeMinCollateral = watch("safeMinCollateral");

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

  const [priceOfCollateral, setPriceOfCollateral] = useState<string>("0");

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
     * Native asset collateral.
     */
    if (NATIVE_ASSETS.includes(pool.poolName.toUpperCase())) {
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
      .then((debtCeiling) => {
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

  const minCollateralAmount = useMemo(() => {
    return BigNumber(1)
      .dividedBy(
        BigNumber(pool.priceWithSafetyMargin).multipliedBy(
          1 - DANGER_SAFETY_BUFFER
        )
      )
      .decimalPlaces(6, BigNumber.ROUND_UP)
      .toNumber();
  }, [pool]);

  const dangerSafetyBuffer = useMemo(() => {
    return (
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
       * SAFE MIN COLLATERAL
       */
      const safeMinCollateral = BigNumber(fathomTokenInput)
        .dividedBy(
          BigNumber(priceWithSafetyMargin).multipliedBy(
            BigNumber(100).minus(pool.stabilityFeeRate).dividedBy(100)
          )
        )
        .decimalPlaces(6, BigNumber.ROUND_UP)
        .toString();

      setFxdToBeBorrowed(safeMax);
      setValue("safeMinCollateral", safeMinCollateral, {
        shouldValidate: false,
      });

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
        ["XDC", "ETH", "CGO"].includes(pool.poolName.toUpperCase()) ||
        pool.poolName === "CollateralTokenAdapterJeju"
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

      setPriceOfCollateral(priceOfCollateralFromDex.toString());
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

      setSafetyBuffer(
        safetyBuffer.isNaN() || !isFinite(safetyBuffer.toNumber())
          ? "0"
          : safetyBuffer.toString()
      );

      /**
       * LIQUIDATION PRICE
       */
      const liquidationPrice = BigNumber(fathomTokenInput)
        .div(collateralInput)
        .multipliedBy(pool.liquidationRatio);

      setLiquidationPrice(
        liquidationPrice.isNaN() || !isFinite(liquidationPrice.toNumber())
          ? "0"
          : liquidationPrice.toString()
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

  /**
   * Max borrow amount, wallet balance or collateral amount by price with safety margin and 25% overcollateralization.
   */
  const setBorrowMax = useCallback(
    (collateralAmount?: number) => {
      const { priceWithSafetyMargin } = pool;

      const formattedBalance = BigNumber(balance).dividedBy(10 ** 18);

      let borrow: BigNumber | string = BigNumber(
        collateralAmount || formattedBalance
      ).multipliedBy(
        BigNumber(priceWithSafetyMargin).multipliedBy(1 - DANGER_SAFETY_BUFFER)
      );

      borrow = (
        borrow.isGreaterThan(maxBorrowAmount)
          ? BigNumber(maxBorrowAmount).minus(0.01)
          : borrow
      )
        .decimalPlaces(2, BigNumber.ROUND_DOWN)
        .toString();

      setValue("fathomToken", borrow, { shouldValidate: true });
    },
    [pool, balance, maxBorrowAmount, setValue]
  );

  /**
   * Safe max collateral input, price with safety margin and 25% overcollateralization.
   */
  const setCollateralSafeMax = useCallback(() => {
    const { priceWithSafetyMargin } = pool;

    let collateral: BigNumber | string = BigNumber(fathomToken).dividedBy(
      BigNumber(priceWithSafetyMargin).multipliedBy(1 - DANGER_SAFETY_BUFFER)
    );
    const formattedBalance = BigNumber(balance).dividedBy(10 ** 18);

    if (collateral.isGreaterThan(formattedBalance)) {
      collateral = formattedBalance
        .decimalPlaces(6, BigNumber.ROUND_DOWN)
        .toString();
    } else {
      collateral = collateral.decimalPlaces(6, BigNumber.ROUND_UP).toString();
    }

    setValue("collateral", collateral, { shouldValidate: true });
  }, [fathomToken, pool, setValue, balance]);

  /**
   * Set wallet balance to collateral input.
   */
  const setCollateralMax = useCallback(
    (balance: string) => {
      const max = BigNumber(balance).dividedBy(10 ** 18);
      setValue("collateral", max.toString(), { shouldValidate: true });
    },
    [setValue]
  );

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      setOpenPositionLoading(true);
      const { collateral, fathomToken } = values;

      try {
        let blockNumber;
        if (NATIVE_ASSETS.includes(pool.poolName.toUpperCase())) {
          /**
           * Native asset collateral.
           */
          blockNumber = await positionService.openPosition(
            account,
            pool,
            collateral,
            fathomToken
          );
        } else {
          /**
           * ERC20 token collateral.
           */
          if (!proxyWalletExists) {
            await positionService.createProxyWallet(account);
            fetchProxyWallet(); // Fetch proxy wallet
            return;
          }

          blockNumber = await positionService.openPositionERC20(
            account,
            pool,
            collateral,
            fathomToken
          );
        }

        setLastTransactionBlock(blockNumber as number);
        onClose();
      } catch (e) {
        console.log(e);
      } finally {
        setOpenPositionLoading(false);
      }
    },
    [
      proxyWalletExists,
      account,
      pool,
      positionService,
      setOpenPositionLoading,
      setLastTransactionBlock,
      onClose,
      fetchProxyWallet,
    ]
  );

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionService.approve(account, collateralTokenAddress as string);
      setApproveBtn(false);
    } catch (e) {
      console.error(e);
      setApproveBtn(true);
    } finally {
      setApprovalPending(false);
    }
  }, [
    account,
    collateralTokenAddress,
    positionService,
    setApprovalPending,
    setApproveBtn,
  ]);

  const validateMaxBorrowAmount = useCallback(() => {
    if (BigNumber(fathomToken).isGreaterThanOrEqualTo(maxBorrowAmount)) {
      return `Borrow amount should be less than ${formatNumber(
        Number(maxBorrowAmount)
      )}.`;
    }
    return false;
  }, [fathomToken, maxBorrowAmount]);

  useEffect(() => {
    if (isTouched) {
      handleUpdates(collateral, fathomToken);
    }

    if (collateralTokenAddress && proxyWallet !== ZERO_ADDRESS && collateral) {
      approvalStatus(collateral);
    } else {
      setApproveBtn(false);
    }
  }, [
    proxyWallet,
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
  }, [collateral, fathomToken, setIsTouched, setIsDirty]);

  useEffect(() => {
    if (account && chainId) {
      getCollateralTokenAndBalance();
      getPositionDebtCeiling();
    }
  }, [chainId, account, getCollateralTokenAndBalance, getPositionDebtCeiling]);

  const setAiPredictionCollateral = (recommendedCollateral: string) => {
    const formattedRecommendedCollateral = BigNumber(recommendedCollateral)
      .decimalPlaces(6, BigNumber.ROUND_UP)
      .toString();

    setValue("collateral", formattedRecommendedCollateral, {
      shouldValidate: true,
    });
  };

  return {
    proxyWalletExists,
    safeMinCollateral,
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
    setCollateralMax,
    setCollateralSafeMax,
    setBorrowMax,
    onSubmit,
    control,
    handleSubmit,
    availableFathomInPool,
    pool,
    onClose,
    dangerSafetyBuffer,
    errors,
    maxBorrowAmount,
    minCollateralAmount,
    validateMaxBorrowAmount,
    priceOfCollateral,
    setAiPredictionCollateral,
  };
};

export default useOpenPosition;
