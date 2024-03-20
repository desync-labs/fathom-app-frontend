import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from "@into-the-fathom/lending-math-utils";
import BigNumber from "bignumber.js";
import { FC, memo, useMemo, useState } from "react";
import { useAssetCaps } from "apps/lending/hooks/useAssetCaps";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { ERC20TokenType } from "apps/lending/libs/web3-data-provider/Web3Provider";
import { useRootStore } from "apps/lending/store/root";
import { getMaxAmountAvailableToSupply } from "apps/lending/utils/getMaxAmountAvailableToSupply";
import { GENERAL } from "apps/lending/utils/mixPanelEvents";
import { roundToTokenDecimals } from "apps/lending/utils/utils";

import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { CapType } from "apps/lending/components/caps/helper";
import { AssetInput } from "apps/lending/components/transactions/AssetInput";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsCollateralLine,
  DetailsHFLine,
  DetailsIncentivesLine,
  DetailsNumberLine,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { getAssetCollateralType } from "apps/lending/components/transactions/utils";
import { IsolationModeWarning } from "apps/lending/components/transactions/Warnings/IsolationModeWarning";
import { SupplyActions } from "apps/lending/components/transactions/Supply/SupplyActions";

export const SupplyModalContent: FC<ModalWrapperProps> = memo(
  ({
    underlyingAsset,
    poolReserve,
    userReserve,
    isWrongNetwork,
    nativeBalance,
    tokenBalance,
  }) => {
    const { marketReferencePriceInUsd, user } = useAppDataContext();
    const { currentNetworkConfig } = useProtocolDataContext();
    const { mainTxState: supplyTxState, gasLimit, txError } = useModalContext();
    const { supplyCap: supplyCapUsage, debtCeiling: debtCeilingUsage } =
      useAssetCaps();
    const minRemainingBaseTokenBalance = useRootStore(
      (state) => state.poolComputed.minRemainingBaseTokenBalance
    );

    // states
    const [amount, setAmount] = useState("");
    const supplyUnWrapped =
      underlyingAsset.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase();

    const walletBalance = supplyUnWrapped ? nativeBalance : tokenBalance;

    const supplyApy = poolReserve.supplyAPY;
    const {
      supplyCap,
      totalLiquidity,
      isFrozen,
      decimals,
      debtCeiling,
      isolationModeTotalDebt,
    } = poolReserve;

    // Calculate max amount to supply
    const maxAmountToSupply = useMemo(
      () =>
        getMaxAmountAvailableToSupply(
          walletBalance,
          {
            supplyCap,
            totalLiquidity,
            isFrozen,
            decimals,
            debtCeiling,
            isolationModeTotalDebt,
          },
          underlyingAsset,
          minRemainingBaseTokenBalance
        ),
      [
        walletBalance,
        supplyCap,
        totalLiquidity,
        isFrozen,
        decimals,
        debtCeiling,
        isolationModeTotalDebt,
        underlyingAsset,
        minRemainingBaseTokenBalance,
      ]
    );

    const handleChange = (value: string) => {
      if (value === "-1") {
        setAmount(maxAmountToSupply);
      } else {
        const decimalTruncatedValue = roundToTokenDecimals(
          value,
          poolReserve.decimals
        );
        setAmount(decimalTruncatedValue);
      }
    };

    // Calculation of future HF
    const amountIntEth = new BigNumber(amount).multipliedBy(
      poolReserve.formattedPriceInMarketReferenceCurrency
    );
    // TODO: is it correct to ut to -1 if user doesnt exist?
    const amountInUsd = amountIntEth
      .multipliedBy(marketReferencePriceInUsd)
      .shiftedBy(-USD_DECIMALS);
    const totalCollateralMarketReferenceCurrencyAfter = user
      ? valueToBigNumber(user.totalCollateralMarketReferenceCurrency).plus(
          amountIntEth
        )
      : "-1";

    const liquidationThresholdAfter = user
      ? valueToBigNumber(user.totalCollateralMarketReferenceCurrency)
          .multipliedBy(user.currentLiquidationThreshold)
          .plus(
            amountIntEth.multipliedBy(
              poolReserve.formattedReserveLiquidationThreshold
            )
          )
          .dividedBy(totalCollateralMarketReferenceCurrencyAfter)
      : "-1";

    const isMaxSelected = amount === maxAmountToSupply;

    let healthFactorAfterDeposit = user
      ? valueToBigNumber(user.healthFactor)
      : "-1";

    if (
      user &&
      ((!user.isInIsolationMode && !poolReserve.isIsolated) ||
        (user.isInIsolationMode &&
          user.isolatedReserve?.underlyingAsset ===
            poolReserve.underlyingAsset))
    ) {
      healthFactorAfterDeposit = calculateHealthFactorFromBalancesBigUnits({
        collateralBalanceMarketReferenceCurrency:
          totalCollateralMarketReferenceCurrencyAfter,
        borrowBalanceMarketReferenceCurrency: valueToBigNumber(
          user.totalBorrowsMarketReferenceCurrency
        ),
        currentLiquidationThreshold: liquidationThresholdAfter,
      });
    }

    // ************** Warnings **********
    // isolation warning
    const hasDifferentCollateral = user.userReservesData.find(
      (reserve) =>
        reserve.usageAsCollateralEnabledOnUser &&
        reserve.reserve.id !== poolReserve.id
    );
    const showIsolationWarning: boolean =
      !user.isInIsolationMode &&
      poolReserve.isIsolated &&
      !hasDifferentCollateral &&
      (userReserve && userReserve.underlyingBalance !== "0"
        ? userReserve.usageAsCollateralEnabledOnUser
        : true);

    // token info to add to wallet
    const addToken: ERC20TokenType = {
      address: poolReserve.fmTokenAddress,
      symbol: poolReserve.iconSymbol,
      decimals: poolReserve.decimals,
      fmToken: true,
    };

    // collateralization state
    const collateralType = getAssetCollateralType(
      userReserve,
      user.totalCollateralUSD,
      user.isInIsolationMode,
      debtCeilingUsage.isMaxed
    );

    const supplyActionsProps = {
      amountToSupply: amount,
      isWrongNetwork,
      poolAddress: supplyUnWrapped
        ? API_ETH_MOCK_ADDRESS
        : poolReserve.underlyingAsset,
      symbol: supplyUnWrapped
        ? currentNetworkConfig.baseAssetSymbol
        : poolReserve.symbol,
      blocked: false,
      decimals: poolReserve.decimals,
      isWrappedBaseAsset: poolReserve.isWrappedBaseAsset,
    };

    if (supplyTxState.success)
      return (
        <TxSuccessView
          action={"Supplied"}
          amount={amount}
          symbol={
            supplyUnWrapped
              ? currentNetworkConfig.baseAssetSymbol
              : poolReserve.symbol
          }
          addToken={addToken}
        />
      );

    return (
      <>
        {showIsolationWarning && (
          <IsolationModeWarning asset={poolReserve.symbol} />
        )}
        {supplyCapUsage.determineWarningDisplay({ supplyCap: supplyCapUsage })}
        {debtCeilingUsage.determineWarningDisplay({
          debtCeiling: debtCeilingUsage,
        })}

        <AssetInput
          value={amount}
          onChange={handleChange}
          usdValue={amountInUsd.toString(10)}
          symbol={
            supplyUnWrapped
              ? currentNetworkConfig.baseAssetSymbol
              : poolReserve.symbol
          }
          assets={[
            {
              balance: maxAmountToSupply,
              symbol: supplyUnWrapped
                ? currentNetworkConfig.baseAssetSymbol
                : poolReserve.symbol,
              iconSymbol: supplyUnWrapped
                ? currentNetworkConfig.baseAssetSymbol
                : poolReserve.iconSymbol,
            },
          ]}
          capType={CapType.supplyCap}
          isMaxSelected={isMaxSelected}
          disabled={supplyTxState.loading}
          maxValue={maxAmountToSupply}
          balanceText={"Wallet balance"}
          event={{
            eventName: GENERAL.MAX_INPUT_SELECTION,
            eventParams: {
              asset: poolReserve.underlyingAsset,
              assetName: poolReserve.name,
            },
          }}
        />

        <TxModalDetails
          gasLimit={gasLimit}
          skipLoad={true}
          disabled={Number(amount) === 0}
        >
          <DetailsNumberLine
            description={"Supply APY"}
            value={supplyApy}
            percent
          />
          <DetailsIncentivesLine
            incentives={poolReserve.fmIncentivesData}
            symbol={poolReserve.symbol}
          />
          <DetailsCollateralLine collateralType={collateralType} />
          <DetailsHFLine
            visibleHfChange={!!amount}
            healthFactor={user ? user.healthFactor : "-1"}
            futureHealthFactor={healthFactorAfterDeposit.toString(10)}
          />
        </TxModalDetails>

        {txError && <GasEstimationError txError={txError} />}

        <SupplyActions {...supplyActionsProps} />
      </>
    );
  }
);
