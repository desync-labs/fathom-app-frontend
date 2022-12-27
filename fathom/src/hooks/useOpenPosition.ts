import { useStores } from "stores";
import useMetaMask from "context/metamask";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { OpenPositionContextType } from "context/openPosition";
import { useForm } from "react-hook-form";
import useSyncContext from "context/sync";

const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: 0,
};

const useOpenPosition = (
  pool: OpenPositionContextType["pool"],
  onClose: OpenPositionContextType["onClose"]
) => {
  const { poolStore, positionStore } = useStores();

  const { account, chainId } = useMetaMask()!;

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
  const [collateralTokenAddress, setCollateralTokenAddress] =
    useState<string>();

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
        let approved = await positionStore.approvalStatus(
          account,
          Number(collateral),
          collateralTokenAddress!
        );
        approved ? setApproveBtn(false) : setApproveBtn(true);
      }, 1000),
    [positionStore, collateralTokenAddress, account]
  );

  const getCollateralTokenAndBalance = useCallback(async () => {
    const tokenAddress = await poolStore.getCollateralTokenAddress(
      pool.tokenAdapterAddress
    );

    console.log("tokenAdapterAddress", pool.tokenAdapterAddress);
    console.log("collateral token address", tokenAddress);

    const balance = await poolStore.getUserTokenBalance(account, tokenAddress!);

    setCollateralTokenAddress(tokenAddress);
    setBalance(balance);
  }, [poolStore, account, pool, setCollateralTokenAddress]);

  const availableFathomInPool = useMemo(
    () => Number(pool.totalAvailable),
    [pool.totalAvailable]
  );

  useEffect(() => {
    getCollateralTokenAndBalance();
  }, [chainId, getCollateralTokenAndBalance]);

  const handleUpdates = useCallback(
    async (collateralInput: number, fathomTokenInput: number) => {
      setCollateralToBeLocked(Number(collateralInput) || 0);
      setFxdToBeBorrowed(Number(fathomTokenInput) || 0);

      // GET PRICE WITH SAFETY MARGIN
      const priceWithSafetyMargin = Number(pool.priceWithSafetyMargin);

      // SAFE MAX
      const safeMax = Math.floor(
        Number(collateralInput) *
          ((priceWithSafetyMargin * (100 - Number(pool.stabilityFeeRate))) /
            100)
      );

      setFxdToBeBorrowed(safeMax);

      setValue("safeMax", safeMax);

      const collateralAvailableToWithdraw =
        Number(priceWithSafetyMargin) === 0
          ? Number(collateralInput) - Number(fathomTokenInput)
          : (Number(collateralInput) * Number(priceWithSafetyMargin) -
              Number(fathomTokenInput)) /
            Number(priceWithSafetyMargin);

      setCollateralAvailableToWithdraw(collateralAvailableToWithdraw);

      // PRICE OF COLLATERAL FROM DEX
      const priceOfCollateralFromDex =
        pool.poolName === "USDT"
          ? 10 ** 18
          : await poolStore.getDexPrice(collateralTokenAddress!);

      // DEBT RATIO
      const debtRatio =
        +fathomTokenInput === 0
          ? 0
          : (+fathomTokenInput /
              ((+collateralInput * +priceOfCollateralFromDex) / 10 ** 18)) *
            100;
      setDebtRatio(+debtRatio);

      // FXD AVAILABLE TO BORROW
      const fxdAvailableToBorrow = safeMax - Number(fathomTokenInput);
      setFxdAvailableToBorrow(fxdAvailableToBorrow);

      // SAFETY BUFFER
      const safetyBuffer = collateralAvailableToWithdraw / +collateralInput;
      setSafetyBuffer(+safetyBuffer);

      // LIQUIDATION PRICE
      let liquidationPrice;
      if (priceWithSafetyMargin === 0) {
        liquidationPrice =
          priceOfCollateralFromDex / 10 ** 18 -
          collateralAvailableToWithdraw / +collateralInput;
      } else {
        liquidationPrice =
          priceOfCollateralFromDex / 10 ** 18 -
          (collateralAvailableToWithdraw * priceWithSafetyMargin) /
            +collateralInput;
      }

      setLiquidationPrice(+liquidationPrice);

      /**
       * Revalidate form
       */
      trigger();
    },
    [
      collateralTokenAddress,
      pool,
      poolStore,
      setLiquidationPrice,
      setSafetyBuffer,
      setFxdAvailableToBorrow,
      setDebtRatio,
      setCollateralAvailableToWithdraw,
      setCollateralToBeLocked,
      setFxdToBeBorrowed,
      setValue,
      trigger,
    ]
  );

  useEffect(() => {
    const collateralVal = Number(collateral);
    const fathomTokenVal = Number(fathomToken);

    if (collateralTokenAddress && (collateralVal || fathomTokenVal)) {
      handleUpdates(collateralVal, fathomTokenVal);
      approvalStatus(collateral);
    }
  }, [
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
        const receipt = await positionStore.openPosition(
          account,
          pool,
          Number(collateral),
          Number(fathomToken)
        );
        setLastTransactionBlock(receipt.blockNumber);
        onClose();
      } catch (e) {
        console.log(e);
      }
      setOpenPositionLoading(false);
    },
    [
      account,
      pool,
      positionStore,
      setOpenPositionLoading,
      setLastTransactionBlock,
      onClose,
    ]
  );

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approve(account, collateralTokenAddress!);
      setApproveBtn(false);
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [
    setApprovalPending,
    setApproveBtn,
    account,
    collateralTokenAddress,
    positionStore,
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
