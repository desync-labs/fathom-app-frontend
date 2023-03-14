import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useStores } from "stores";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";
import { OpenPositionContextType } from "context/openPosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";

const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: 0,
};

const useOpenPosition = (
  pool: OpenPositionContextType["pool"],
  onClose: OpenPositionContextType["onClose"]
) => {
  const { poolService, positionService } = useStores();
  const { account, chainId, library } = useConnector()!;

  const { handleSubmit, watch, control, setValue, trigger } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const collateral = watch("collateral");
  const fathomToken = watch("fathomToken");
  const safeMax = watch("safeMax");

  const [balance, setBalance] = useState<number>(0);

  const [collateralToBeLocked, setCollateralToBeLocked] = useState<number>(0);
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = useState<number>(0);
  const [collateralTokenAddress, setCollateralTokenAddress] = useState<
    string | null
  >();

  const { setLastTransactionBlock } = useSyncContext();

  const [collateralAvailableToWithdraw, setCollateralAvailableToWithdraw] =
    useState<number>(0);
  const [safetyBuffer, setSafetyBuffer] = useState<number>(0);
  const [debtRatio, setDebtRatio] = useState<number>(0);
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  const [fxdAvailableToBorrow, setFxdAvailableToBorrow] = useState<number>(0);

  const [openPositionLoading, setOpenPositionLoading] =
    useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

  const approvalStatus = useMemo(
    () =>
      debounce(async (collateral: string) => {
        let approved = await positionService.approvalStatus(
          account,
          collateralTokenAddress!,
          collateral,
          library
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [positionService, collateralTokenAddress, account, library]
  );

  const getCollateralTokenAndBalance = useCallback(async () => {
    if (pool.poolName.toUpperCase() === "XDC") {
      const balance = await library.eth.getBalance(account);
      setCollateralTokenAddress(null);
      setBalance(balance);
    } else {
      const tokenAddress = await poolService.getCollateralTokenAddress(
        pool.tokenAdapterAddress,
        library
      );

      console.log("Token Adapter Address", pool.tokenAdapterAddress);
      console.log("Collateral Token Address", tokenAddress);

      const balance = await poolService.getUserTokenBalance(
        account,
        tokenAddress!,
        library
      );

      setCollateralTokenAddress(tokenAddress);
      setBalance(balance);
    }
  }, [poolService, account, pool, library, setCollateralTokenAddress]);

  const availableFathomInPool = useMemo(
    () => Number(pool.totalAvailable),
    [pool]
  );

  useEffect(() => {
    account && chainId && getCollateralTokenAndBalance();
  }, [chainId, account, getCollateralTokenAndBalance]);

  const handleUpdates = useCallback(
    async (collateralInput: number, fathomTokenInput: number) => {
      setCollateralToBeLocked(collateralInput || 0);
      setFxdToBeBorrowed(fathomTokenInput || 0);

      // GET PRICE WITH SAFETY MARGIN
      const { priceWithSafetyMargin } = pool;

      // SAFE MAX
      const safeMax = Number(
        BigNumber(collateralInput)
          .multipliedBy(
            BigNumber(priceWithSafetyMargin)
              .multipliedBy(BigNumber(100).minus(pool.stabilityFeeRate))
              .dividedBy(100)
          )
          .toNumber()
      );

      setFxdToBeBorrowed(safeMax);
      setValue("safeMax", safeMax);

      const collateralAvailableToWithdraw =
        Number(priceWithSafetyMargin) === 0
          ? BigNumber(collateralInput).minus(fathomTokenInput).toNumber()
          : BigNumber(collateralInput)
              .multipliedBy(priceWithSafetyMargin)
              .minus(fathomTokenInput)
              .dividedBy(priceWithSafetyMargin)
              .toNumber();

      setCollateralAvailableToWithdraw(collateralAvailableToWithdraw);

      // PRICE OF COLLATERAL FROM DEX
      const priceOfCollateralFromDex =
        pool.poolName.toUpperCase() === "XDC"
          ? BigNumber(pool.collateralLastPrice)
              .multipliedBy(10 ** 18)
              .toNumber()
          : await poolService.getDexPrice(collateralTokenAddress!, library);

      // DEBT RATIO
      const debtRatio =
        fathomTokenInput === 0
          ? 0
          : BigNumber(fathomTokenInput)
              .dividedBy(
                BigNumber(collateralInput)
                  .multipliedBy(priceOfCollateralFromDex)
                  .dividedBy(10 ** 18)
              )
              .multipliedBy(100)
              .toNumber();

      setDebtRatio(debtRatio);

      // FXD AVAILABLE TO BORROW
      const fxdAvailableToBorrow = BigNumber(safeMax)
        .minus(fathomTokenInput)
        .toNumber();
      setFxdAvailableToBorrow(fxdAvailableToBorrow);

      // SAFETY BUFFER
      const safetyBuffer = BigNumber(collateralAvailableToWithdraw)
        .dividedBy(collateralInput)
        .toNumber();

      setSafetyBuffer(safetyBuffer);

      // LIQUIDATION PRICE
      let liquidationPrice;
      if (priceWithSafetyMargin === 0) {
        liquidationPrice = BigNumber(priceOfCollateralFromDex)
          .dividedBy(10 ** 18)
          .minus(
            BigNumber(collateralAvailableToWithdraw).dividedBy(collateralInput)
          )
          .toNumber();
      } else {
        liquidationPrice = BigNumber(priceOfCollateralFromDex)
          .dividedBy(10 ** 18)
          .minus(
            BigNumber(collateralAvailableToWithdraw)
              .multipliedBy(priceWithSafetyMargin)
              .dividedBy(collateralInput)
          )
          .toNumber();
      }

      setLiquidationPrice(liquidationPrice);
      /**
       * Revalidate form
       */
      setTimeout(() => {
        trigger();
      }, 100)
    },
    [
      collateralTokenAddress,
      pool,
      poolService,
      setLiquidationPrice,
      setSafetyBuffer,
      setFxdAvailableToBorrow,
      setDebtRatio,
      setCollateralAvailableToWithdraw,
      setCollateralToBeLocked,
      setFxdToBeBorrowed,
      setValue,
      trigger,
      library,
    ]
  );

  useEffect(() => {
    const collateralVal = Number(collateral);
    const fathomTokenVal = Number(fathomToken);

    if (
      pool?.poolName?.toUpperCase() === "XDC" &&
      (collateralVal || fathomTokenVal)
    ) {
      handleUpdates(collateralVal, fathomTokenVal);
    } else if (collateralTokenAddress && (collateralVal || fathomTokenVal)) {
      handleUpdates(collateralVal, fathomTokenVal);
      approvalStatus(collateral);
    }
  }, [
    pool,
    collateral,
    collateralTokenAddress,
    fathomToken,
    handleUpdates,
    approvalStatus,
  ]);

  const setSafeMax = useCallback(() => {
    setValue("fathomToken", safeMax.toString(), { shouldValidate: true });
  }, [safeMax, setValue]);

  const onSubmit = useCallback(
    async (values: any) => {
      setOpenPositionLoading(true);
      const { collateral, fathomToken } = values;

      try {
        const receipt = await positionService.openPosition(
          account,
          pool,
          collateral,
          fathomToken,
          library
        );
        setLastTransactionBlock(receipt!.blockNumber);
        onClose();
      } catch (e) {
        console.log(e);
      }
      setOpenPositionLoading(false);
    },
    [
      account,
      library,
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
      await positionService.approve(account, collateralTokenAddress!, library);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [
    account,
    collateralTokenAddress,
    positionService,
    library,
    setApprovalPending,
    setApproveBtn,
  ]);

  const setMax = useCallback(
    (balance: number) => {
      const max = balance / 10 ** 18;
      setValue("collateral", max.toString(), { shouldValidate: true });
    },
    [setValue]
  );

  return {
    safeMax,
    approveBtn,
    approve,
    approvalPending,
    collateralToBeLocked,
    collateralAvailableToWithdraw,
    fxdAvailableToBorrow,
    debtRatio,
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
  };
};

export default useOpenPosition;
