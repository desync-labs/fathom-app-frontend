import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useStores } from "stores";
import debounce from "lodash.debounce";
import BigNumber from "bignumber.js";
import { OpenPositionContextType } from "context/openPosition";
import useSyncContext from "context/sync";
import useConnector from "context/connector";
import IOpenPosition from "stores/interfaces/IOpenPosition";

const defaultValues = {
  collateral: "",
  fathomToken: "",
  safeMax: 0,
};

const useTopUpPosition = (
  pool: OpenPositionContextType["pool"],
  onClose: OpenPositionContextType["onClose"],
  position: IOpenPosition
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

  const [debtValue, setDebtValue] = useState<string>("");
  const [liquidationPrice, setLiquidationPrice] = useState<string>("");
  const [ltv, setLtv] = useState<string>("");
  const [safetyBuffer, setSafetyBuffer] = useState<string>("");

  const [balance, setBalance] = useState<number>(0);
  const [collateralTokenAddress, setCollateralTokenAddress] = useState<
    string | null
  >();
  const [maxBorrowAmount, setMaxBorrowAmount] = useState<string>('');

  const { setLastTransactionBlock } = useSyncContext();

  const [openPositionLoading, setOpenPositionLoading] =
    useState<boolean>(false);

  const [approveBtn, setApproveBtn] = useState<boolean>(false);
  const [approvalPending, setApprovalPending] = useState<boolean>(false);

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

  const getDebtValue = useCallback(async () => {
    const debtValue = await positionService.getDebtValue(
      position.debtShare,
      position.collateralPool,
      library
    );

    const liquidationPrice = BigNumber(pool.rawPrice)
      .minus(
        BigNumber(pool.priceWithSafetyMargin)
          .multipliedBy(position.lockedCollateral)
          .minus(debtValue)
          .dividedBy(position.lockedCollateral)
      )
      .toString();

    const ltv = BigNumber(debtValue)
      .dividedBy(
        BigNumber(pool.rawPrice).multipliedBy(position.lockedCollateral)
      )
      .toString();

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
    setLtv,
  ]);

  const getPositionDebtCeiling = useCallback(() => {
    positionService.getPositionDebtCeiling(pool.id, library).then((debtCeiling) => {
      setMaxBorrowAmount(debtCeiling);
    })
  }, [positionService, pool, library, setMaxBorrowAmount])

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

  const handleUpdates = useMemo(
    () =>
      debounce(
        async (totalCollateralAmount: string, totalFathomAmount: string) => {
          // GET PRICE WITH SAFETY MARGIN
          const { priceWithSafetyMargin } = pool;
          // SAFE MAX
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

          safeMax = safeMax > 0 ? safeMax : 0;

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
            .toString();

          setSafetyBuffer(safetyBuffer);

          setValue("safeMax", safeMax);

          const liquidationPrice = BigNumber(pool.rawPrice)
            .minus(
              BigNumber(pool.priceWithSafetyMargin)
                .multipliedBy(totalCollateralAmount)
                .minus(totalFathomAmount)
                .dividedBy(totalCollateralAmount)
            )
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
    setValue("fathomToken", safeMax.toString(), { shouldValidate: true });
  }, [safeMax, setValue]);

  const onSubmit = useCallback(
    async (values: any) => {
      setOpenPositionLoading(true);
      const { collateral, fathomToken } = values;

      try {
        let blockNumber;
        if (BigNumber(fathomToken).isGreaterThan(0)) {
          blockNumber = await positionService.topUpPositionAndBorrow(
            account,
            pool,
            collateral,
            fathomToken,
            position.positionId,
            library
          );
        } else {
          blockNumber = await positionService.topUpPosition(
            account,
            pool,
            collateral,
            position.positionId,
            library
          );
        }
        setLastTransactionBlock(blockNumber!);
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
  }, [chainId, account, getCollateralTokenAndBalance, getDebtValue, getPositionDebtCeiling]);

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
    collateral,
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
    maxBorrowAmount,
  };
};

export default useTopUpPosition;
