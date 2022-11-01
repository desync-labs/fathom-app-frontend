import { useStores } from "../stores";
import useMetaMask from "./metamask";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { OpenPositionProps } from "../components/Positions/OpenNewPositionDialog";

const useOpenPosition = (
  pool: OpenPositionProps["pool"],
  onClose: OpenPositionProps["onClose"]
) => {
  const { poolStore, positionStore } = useStores();

  const { account, chainId } = useMetaMask()!;
  const [approveBtn, setApproveBtn] = useState(false);
  const [approvalPending, setApprovalPending] = useState(false);
  const [balance, setBalance] = useState(0);
  const [balanceError, setBalanceError] = useState(false);

  const [fathomToken, setFathomToken] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [collateralToBeLocked, setCollateralToBeLocked] = useState(0);
  const [fxdToBeBorrowed, setFxdToBeBorrowed] = useState(0);
  const [safeMax, setSafeMax] = useState(0);
  const [collateralAvailableToWithdraw, setCollateralAvailableToWithdraw] =
    useState(0);
  const [safetyBuffer, setSafetyBuffer] = useState(0);
  const [debtRatio, setDebtRatio] = useState(0);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [fxdAvailableToBorrow, setFxdAvailableToBorrow] = useState(0);

  const [disableOpenPosition, setDisableOpenPosition] = useState(false);
  const [openPositionLoading, setOpenPositionLoading] = useState(false);

  const approvalStatus = useCallback(
    debounce(async () => {
      let approved = await positionStore.approvalStatus(
        account,
        collateral,
        pool
      );
      approved ? setApproveBtn(false) : setApproveBtn(true);
    }, 1000),
    [positionStore, pool, account, collateral]
  );

  const getBalance = useCallback(async () => {
    const balance = await poolStore.getUserTokenBalance(
      account,
      pool.collateralContractAddress
    );
    setBalance(balance);
  }, [poolStore, account, pool, setBalance]);

  useEffect(() => {
    getBalance();
  }, [chainId, getBalance]);

  useEffect(() => {
    if (chainId) {
      approvalStatus();
    }
  }, [approvalStatus, chainId, collateral]);

  const handleUpdates = useCallback(
    async (collateralInput: number, fathomTokenInput: number) => {
      const availableFathom = parseInt(
        pool.availableFathom.replaceAll(",", "")
      );
      const disable = fathomTokenInput >= availableFathom;
      console.log(
        `Input token ${fathomTokenInput} and Pool Max: ${availableFathom}`
      );
      setDisableOpenPosition(disable);

      // check collateral input
      if (isNaN(collateralInput) || !collateralInput) {
        collateralInput = 0;
      }
      // console.log("COLLATERAL INPUT: ", collateralInput);
      setCollateralToBeLocked(+collateralInput);

      if (isNaN(fathomTokenInput) || !fathomTokenInput) {
        fathomTokenInput = 0;
      }
      // console.log("FXD TO BORROW: ", fxdToBorrow);
      setFxdToBeBorrowed(+fathomTokenInput);

      // GET USER BALANCE
      const balance = await poolStore.getUserTokenBalance(
        account,
        pool.collateralContractAddress
      );
      setBalance(balance);

      // CHECK BALANCE
      // if the user does not have enough collateral -- show them a balance error
      if (+balance / 10 ** 18 < +collateralInput) {
        setBalanceError(true);
        return;
      } else {
        setBalanceError(false);
      }

      // GET PRICE WITH SAFETY MARGIN
      let priceWithSafetyMargin;
      if (pool.name === "USDT") {
        priceWithSafetyMargin = 0.75188;
      } else {
        priceWithSafetyMargin = await poolStore.getPriceWithSafetyMargin(pool);
      }
      // setPriceWithSafetyMargin(+priceWithSafetyMargin);

      // SAFE MAX
      let safeMax;
      if (priceWithSafetyMargin === 0) {
        safeMax = +collateralInput;
      } else {
        safeMax = +collateralInput * priceWithSafetyMargin * 0.99;
      }

      //TODO: TODO...
      safeMax = Math.floor(safeMax);

      setSafeMax(+safeMax);

      if (+fathomTokenInput > safeMax) {
        setFxdToBeBorrowed(0);
        setFathomToken(0);
      }

      let collatralAvailableToWithdraw = 0;
      if (+priceWithSafetyMargin === 0) {
        collatralAvailableToWithdraw = +collateralInput - +fathomTokenInput;
      } else {
        collatralAvailableToWithdraw =
          (+collateralInput * +priceWithSafetyMargin - +fathomTokenInput) /
          +priceWithSafetyMargin;
      }

      setCollateralAvailableToWithdraw(+collatralAvailableToWithdraw);

      // PRICE OF COLLATERAL FROM DEX
      const priceOfCollateralFromDex =
        pool.name === "USDT"
          ? 10 ** 18
          : await poolStore.getDexPrice(pool.collateralContractAddress);

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
      const safetyBuffer = collatralAvailableToWithdraw / +collateralInput;
      setSafetyBuffer(+safetyBuffer);

      // LIQUIDATION PRICE
      let liquidationPrice = 0;
      if (priceWithSafetyMargin === 0) {
        liquidationPrice =
          priceOfCollateralFromDex / 10 ** 18 -
          collatralAvailableToWithdraw / +collateralInput;
      } else {
        liquidationPrice =
          priceOfCollateralFromDex / 10 ** 18 -
          (collatralAvailableToWithdraw * priceWithSafetyMargin) /
            +collateralInput;
      }

      setLiquidationPrice(+liquidationPrice);
    },
    [
      account,
      pool,
      poolStore,
      setLiquidationPrice,
      setSafetyBuffer,
      setFxdAvailableToBorrow,
      setDebtRatio,
      setCollateralAvailableToWithdraw,
      setSafeMax,
      setDisableOpenPosition,
      setCollateralToBeLocked,
      setFxdToBeBorrowed,
      setFathomToken,
      setBalanceError,
      setBalance,
    ]
  );

  const updateFathomAmount = useCallback(() => {
    setFathomToken(safeMax);
    handleUpdates(collateral, safeMax);
  }, [safeMax, collateral, setFathomToken, handleUpdates]);

  const openNewPosition = useCallback(async () => {
    setDisableOpenPosition(true);
    setOpenPositionLoading(true);
    try {
      await positionStore.openPosition(account, pool, collateral, fathomToken);
      onClose();
    } catch (e) {
      console.log(e);
    }
    setDisableOpenPosition(false);
    setOpenPositionLoading(false);
  }, [
    positionStore,
    onClose,
    account,
    pool,
    collateral,
    fathomToken,
    setDisableOpenPosition,
    setOpenPositionLoading,
  ]);

  const handleCloseApproveBtn = useCallback(() => {
    setApproveBtn(false);
  }, [setApproveBtn]);

  const approve = useCallback(async () => {
    setApprovalPending(true);
    try {
      await positionStore.approve(account, pool);
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
    pool,
    positionStore,
  ]);

  const handleCollateralTextFieldChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      if (!isNaN(value)) {
        setCollateral(value);
      }

      handleUpdates(value, fathomToken);
    },
    [handleUpdates, setCollateral, fathomToken]
  );

  const handleFathomTokenTextFieldChange = useCallback(
    (e: any) => {
      const value = e.target.value;
      if (!isNaN(value)) {
        setFathomToken(value);
      }
      handleUpdates(collateral, value);
    },
    [collateral, handleUpdates, setFathomToken]
  );

  const setMax = useCallback(
    (balance: number) => {
      const max = +balance / 10 ** 18;
      setCollateral(max);
      handleUpdates(max, fathomToken);
    },
    [setCollateral, handleUpdates, fathomToken]
  );

  return {
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
    balanceError,
    collateral,
    fathomToken,
    safeMax,
    disableOpenPosition,
    openPositionLoading,

    handleCollateralTextFieldChange,
    handleFathomTokenTextFieldChange,
    setMax,
    updateFathomAmount,
    openNewPosition,
  };
};

export default useOpenPosition;
