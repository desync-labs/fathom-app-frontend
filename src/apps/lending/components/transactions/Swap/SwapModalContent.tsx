import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Box, SvgIcon, Typography } from "@mui/material";
import BigNumber from "bignumber.js";
import React, { useRef, useState } from "react";
import { PriceImpactTooltip } from "apps/lending/components/infoTooltips/PriceImpactTooltip";
import { Warning } from "apps/lending/components/primitives/Warning";
import {
  Asset,
  AssetInput,
} from "apps/lending/components/transactions/AssetInput";
import { TxModalDetails } from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { StETHCollateralWarning } from "apps/lending/components/Warnings/StETHCollateralWarning";
import { CollateralType } from "apps/lending/helpers/types";
import { useCollateralSwap } from "apps/lending/hooks/paraswap/useCollateralSwap";
import { getDebtCeilingData } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useWeb3Context } from "apps/lending/libs/hooks/useWeb3Context";
import { ListSlippageButton } from "apps/lending/modules/dashboard/lists/SlippageList";
import { remainingCap } from "apps/lending/utils/getMaxAmountAvailableToSupply";
import { calculateHFAfterSwap } from "apps/lending/utils/hfUtils";
import { amountToUsd } from "apps/lending/utils/utils";

import {
  ComputedUserReserveData,
  useAppDataContext,
} from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  ErrorType,
  getAssetCollateralType,
  useFlashloan,
  zeroLTVBlockingWithdraw,
} from "apps/lending/components/transactions/utils";
import { ParaswapErrorDisplay } from "apps/lending/components/transactions/Warnings/ParaswapErrorDisplay";
import { SwapActions } from "apps/lending/components/transactions/Swap/SwapActions";
import { SwapModalDetails } from "apps/lending/components/transactions/Swap/SwapModalDetails";

export type SupplyProps = {
  underlyingAsset: string;
};

export const SwapModalContent = ({
  poolReserve,
  userReserve,
  isWrongNetwork,
}: ModalWrapperProps) => {
  const { reserves, user, marketReferencePriceInUsd } = useAppDataContext();
  const { currentChainId, currentNetworkConfig } = useProtocolDataContext();
  const { currentAccount } = useWeb3Context();
  const { gasLimit, mainTxState: supplyTxState, txError } = useModalContext();

  const swapTargets = reserves
    .filter(
      (r) => r.underlyingAsset !== poolReserve.underlyingAsset && !r.isFrozen
    )
    .map((reserve) => ({
      address: reserve.underlyingAsset,
      symbol: reserve.symbol,
      iconSymbol: reserve.iconSymbol,
    }));

  // states
  const [_amount, setAmount] = useState("");
  const amountRef = useRef<string>("");
  const [targetReserve, setTargetReserve] = useState<Asset>(swapTargets[0]);
  const [maxSlippage, setMaxSlippage] = useState("0.1");

  const swapTarget = user.userReservesData.find(
    (r) => r.underlyingAsset === targetReserve.address
  ) as ComputedUserReserveData;

  // a user can never swap more then 100% of available as the txn would fail on withdraw step
  const maxAmountToSwap = BigNumber.min(
    userReserve.underlyingBalance,
    new BigNumber(poolReserve.availableLiquidity).multipliedBy(0.99)
  ).toString(10);

  const isMaxSelected = _amount === "-1";
  const amount = isMaxSelected ? maxAmountToSwap : _amount;

  const {
    inputAmountUSD,
    inputAmount,
    outputAmount,
    outputAmountUSD,
    error,
    loading: routeLoading,
    buildTxFn,
  } = useCollateralSwap({
    chainId: currentNetworkConfig.underlyingChainId || currentChainId,
    userAddress: currentAccount,
    swapIn: { ...poolReserve, amount: amountRef.current },
    swapOut: { ...swapTarget.reserve, amount: "0" },
    max: isMaxSelected,
    skip: supplyTxState.loading || false,
    maxSlippage: Number(maxSlippage),
  });

  const loadingSkeleton = routeLoading && outputAmountUSD === "0";

  const handleChange = (value: string) => {
    const maxSelected = value === "-1";
    amountRef.current = maxSelected ? maxAmountToSwap : value;
    setAmount(value);
  };

  const { hfAfterSwap, hfEffectOfFromAmount } = calculateHFAfterSwap({
    fromAmount: amount,
    fromAssetData: poolReserve,
    fromAssetUserData: userReserve,
    user,
    toAmountAfterSlippage: outputAmount,
    toAssetData: swapTarget.reserve,
  });

  // if the hf would drop below 1 from the hf effect a flashloan should be used to mitigate liquidation
  const shouldUseFlashloan = useFlashloan(
    user.healthFactor,
    hfEffectOfFromAmount
  );

  // consider caps
  // we cannot check this in advance as it's based on the swap result
  const remainingSupplyCap = remainingCap(
    swapTarget.reserve.supplyCap,
    swapTarget.reserve.totalLiquidity
  );
  const remainingCapUsd = amountToUsd(
    remainingSupplyCap,
    swapTarget.reserve.formattedPriceInMarketReferenceCurrency,
    marketReferencePriceInUsd
  );

  const assetsBlockingWithdraw: string[] = zeroLTVBlockingWithdraw(user);

  let blockingError: ErrorType | undefined = undefined;
  if (
    assetsBlockingWithdraw.length > 0 &&
    !assetsBlockingWithdraw.includes(poolReserve.symbol)
  ) {
    blockingError = ErrorType.ZERO_LTV_WITHDRAW_BLOCKED;
  } else if (
    !remainingSupplyCap.eq("-1") &&
    remainingCapUsd.lt(outputAmountUSD)
  ) {
    blockingError = ErrorType.SUPPLY_CAP_REACHED;
  } else if (!hfAfterSwap.eq("-1") && hfAfterSwap.lt("1.01")) {
    blockingError = ErrorType.HF_BELOW_ONE;
  }

  const BlockingError: React.FC = () => {
    switch (blockingError) {
      case ErrorType.SUPPLY_CAP_REACHED:
        return (
          <>Supply cap on target reserve reached. Try lowering the amount.</>
        );
      case ErrorType.HF_BELOW_ONE:
        return (
          <>
            The effects on the health factor would cause liquidation. Try
            lowering the amount.
          </>
        );
      case ErrorType.ZERO_LTV_WITHDRAW_BLOCKED:
        return (
          <>
            Assets with zero LTV ({assetsBlockingWithdraw}) must be withdrawn or
            disabled as collateral to perform this action
          </>
        );
      default:
        return null;
    }
  };

  if (supplyTxState.success)
    return (
      <TxSuccessView
        action={<>Switched</>}
        amount={amountRef.current}
        symbol={poolReserve.symbol}
      />
    );

  // hf is only relevant when there are borrows
  const showHealthFactor =
    user &&
    user.totalBorrowsMarketReferenceCurrency !== "0" &&
    poolReserve.reserveLiquidationThreshold !== "0";

  const { debtCeilingReached: sourceDebtCeiling } = getDebtCeilingData(
    swapTarget.reserve
  );
  const swapSourceCollateralType = getAssetCollateralType(
    userReserve,
    user.totalCollateralUSD,
    user.isInIsolationMode,
    sourceDebtCeiling
  );

  const { debtCeilingReached: targetDebtCeiling } = getDebtCeilingData(
    swapTarget.reserve
  );
  let swapTargetCollateralType = getAssetCollateralType(
    swapTarget,
    user.totalCollateralUSD,
    user.isInIsolationMode,
    targetDebtCeiling
  );

  // If the user is swapping all of their isolated asset to an asset that is not supplied,
  // then the swap target will be enabled as collateral as part of the swap.
  if (
    isMaxSelected &&
    swapSourceCollateralType === CollateralType.ISOLATED_ENABLED &&
    swapTarget.underlyingBalance === "0"
  ) {
    if (swapTarget.reserve.isIsolated) {
      swapTargetCollateralType = CollateralType.ISOLATED_ENABLED;
    } else {
      swapTargetCollateralType = CollateralType.ENABLED;
    }
  }

  // If the user is swapping all of their enabled asset to an isolated asset that is not supplied,
  // and no other supplied assets are being used as collateral,
  // then the swap target will be enabled as collateral and the user will be in isolation mode.
  if (
    isMaxSelected &&
    swapSourceCollateralType === CollateralType.ENABLED &&
    swapTarget.underlyingBalance === "0" &&
    swapTarget.reserve.isIsolated
  ) {
    const reservesAsCollateral = user.userReservesData.filter(
      (r) => r.usageAsCollateralEnabledOnUser
    );

    if (
      reservesAsCollateral.length === 1 &&
      reservesAsCollateral[0].underlyingAsset === userReserve.underlyingAsset
    ) {
      swapTargetCollateralType = CollateralType.ISOLATED_ENABLED;
    }
  }

  return (
    <>
      {/* {showIsolationWarning && (
            <Typography>You are about to enter into isolation. FAQ link</Typography>
          )} */}
      <AssetInput
        value={amount}
        onChange={handleChange}
        usdValue={inputAmountUSD}
        symbol={poolReserve.iconSymbol}
        assets={[
          {
            balance: maxAmountToSwap,
            address: poolReserve.underlyingAsset,
            symbol: poolReserve.symbol,
            iconSymbol: poolReserve.iconSymbol,
          },
        ]}
        maxValue={maxAmountToSwap}
        inputTitle={<>Supplied asset amount</>}
        balanceText={<>Supply balance</>}
        isMaxSelected={isMaxSelected}
      />
      <Box
        sx={{
          padding: "18px",
          pt: "14px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <SvgIcon sx={{ fontSize: "18px !important" }}>
          <SwapVertIcon />
        </SvgIcon>

        <PriceImpactTooltip
          loading={loadingSkeleton}
          outputAmountUSD={outputAmountUSD}
          inputAmountUSD={inputAmountUSD}
        />
      </Box>
      <AssetInput
        value={outputAmount}
        onSelect={setTargetReserve}
        usdValue={outputAmountUSD}
        symbol={targetReserve.symbol}
        assets={swapTargets}
        inputTitle={<>Switch to</>}
        balanceText={<>Supply balance</>}
        disableInput
        loading={loadingSkeleton}
      />
      {error && !loadingSkeleton && (
        <Typography variant="helperText" color="error.main">
          {error}
        </Typography>
      )}
      {!error && blockingError !== undefined && (
        <Typography variant="helperText" color="error.main">
          <BlockingError />
        </Typography>
      )}

      {swapTarget.reserve.symbol === "stETH" && (
        <Warning severity="warning" sx={{ mt: 2, mb: 0 }}>
          <StETHCollateralWarning />
        </Warning>
      )}

      <TxModalDetails
        gasLimit={gasLimit}
        slippageSelector={
          <ListSlippageButton
            selectedSlippage={maxSlippage}
            setSlippage={setMaxSlippage}
          />
        }
      >
        <SwapModalDetails
          showHealthFactor={showHealthFactor}
          healthFactor={user?.healthFactor}
          healthFactorAfterSwap={hfAfterSwap.toString(10)}
          swapSource={{
            ...userReserve,
            collateralType: swapSourceCollateralType,
          }}
          swapTarget={{
            ...swapTarget,
            collateralType: swapTargetCollateralType,
          }}
          toAmount={outputAmount}
          fromAmount={amount === "" ? "0" : amount}
          loading={loadingSkeleton}
        />
      </TxModalDetails>

      {txError && <ParaswapErrorDisplay txError={txError} />}

      <SwapActions
        isMaxSelected={isMaxSelected}
        poolReserve={poolReserve}
        amountToSwap={inputAmount}
        amountToReceive={outputAmount}
        isWrongNetwork={isWrongNetwork}
        targetReserve={swapTarget.reserve}
        symbol={poolReserve.symbol}
        blocked={
          blockingError !== undefined ||
          error !== "" ||
          swapTarget.reserve.symbol === "stETH"
        }
        useFlashLoan={shouldUseFlashloan}
        loading={routeLoading}
        buildTxFn={buildTxFn}
      />
    </>
  );
};
