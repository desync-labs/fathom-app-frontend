import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { OpenPositionProps } from "components/Positions/OpenNewPositionDialog";
import { useForm } from "react-hook-form";
import {
  useLazyQuery,
  useQuery
} from "@apollo/client";
import { FXD_POOLS, FXD_POSITIONS, FXD_STATS } from "../apollo/queries";

const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: 0,
};

const useOpenPosition = (
  pool: OpenPositionProps["pool"],
  onClose: OpenPositionProps["onClose"]
) => {
  const { poolStore, positionStore } = useStores();

  const { account, chainId } = useMetaMask()!;

  const { handleSubmit, watch, control, setValue } = useForm({
    defaultValues,
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const { refetch: refetchStats } = useQuery(FXD_STATS);
  const [_, { refetch: refetchPositions }] = useLazyQuery(FXD_POSITIONS);

  const { refetch: refetchPools } = useQuery(FXD_POOLS, {
    variables: {
      page: 10,
    },
  });

  const collateral = watch("collateral");
  const fathomToken = watch("fathomToken");
  const safeMax = watch("safeMax");

  const [balance, setBalance] = useState<number>(0);

  const [collateralToBeLocked, setCollateralToBeLocked] = useState<number>(0);
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = useState<number>(0);
  const [collateralTokenAddress, setCollateralTokenAddress] =
    useState<string>();

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

  const approvalStatus = useCallback(
    debounce(async (collateral: string) => {
      let approved = await positionStore.approvalStatus(
        account,
        Number(collateral),
        collateralTokenAddress!
      );
      approved ? setApproveBtn(false) : setApproveBtn(true);
    }, 1000),
    [positionStore, collateralTokenAddress, pool, account]
  );

  const getCollateralTokenAndBalance = useCallback(async () => {
    const tokenAddress = await poolStore.getCollateralTokenAddress(
      pool.tokenAdapterAddress
    );
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
      console.log(
        `Input token ${fathomTokenInput} and Pool Max: ${availableFathomInPool}`
      );

      // check collateral input
      if (isNaN(collateralInput) || !collateralInput) {
        collateralInput = 0;
      }

      setCollateralToBeLocked(+collateralInput);

      if (isNaN(fathomTokenInput) || !fathomTokenInput) {
        fathomTokenInput = 0;
      }
      setFxdToBeBorrowed(+fathomTokenInput);

      // if the user does not have enough collateral -- show them a balance error
      if (+balance / 10 ** 18 < +collateralInput) return;

      // GET PRICE WITH SAFETY MARGIN
      const priceWithSafetyMargin =
        pool.poolName === "USDT" ? 0.75188 : Number(pool.priceWithSafetyMargin);

      // SAFE MAX
      const safeMax = Math.floor(
        priceWithSafetyMargin === 0
          ? +collateralInput
          : +collateralInput * priceWithSafetyMargin * 0.99
      );
      setValue("safeMax", safeMax, { shouldValidate: true });
      setFxdToBeBorrowed(safeMax);

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
      const fxdAvailableToBorrow = safeMax - +fathomTokenInput;
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
    },
    [
      balance,
      availableFathomInPool,
      collateralTokenAddress,
      account,
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
      setBalance,
    ]
  );

  useEffect(() => {
    if (collateralTokenAddress) {
      handleUpdates(Number(collateral), Number(fathomToken));
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

  const refetchData = useCallback(async () => {
    const walletProxy = await positionStore.getProxyWallet(account)!;

    setTimeout(() => {
      refetchStats();
      refetchPools();
      refetchPositions({
        walletAddress: walletProxy,
      });
    }, 1000)
  }, [positionStore, refetchStats, refetchPools, refetchPositions])

  const onSubmit = useCallback(
    async (values: any) => {
      setOpenPositionLoading(true);
      const { collateral, fathomToken } = values;

      try {
        await positionStore.openPosition(
          account,
          pool,
          Number(collateral),
          Number(fathomToken)
        );

        refetchData();

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
      onClose,
      refetchStats,
      refetchPositions,
      refetchPools,
    ]
  );

  const handleCloseApproveBtn = useCallback(() => {
    setApproveBtn(false);
  }, [setApproveBtn]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approve(account, collateralTokenAddress!);
      handleCloseApproveBtn();
    } catch (e) {
      setApproveBtn(true);
    }

    setApprovalPending(false);
  }, [
    setApprovalPending,
    setApproveBtn,
    handleCloseApproveBtn,
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
  };
};

export default useOpenPosition;
