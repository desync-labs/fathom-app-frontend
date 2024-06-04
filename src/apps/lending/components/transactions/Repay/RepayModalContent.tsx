import {
  API_ETH_MOCK_ADDRESS,
  InterestRate,
  synthetixProxyByChainId,
} from "@into-the-fathom/lending-contract-helpers";
import {
  BigNumberValue,
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from "@into-the-fathom/lending-math-utils";
import Typography from "@mui/material/Typography";
import BigNumber from "bignumber.js";
import { FC, memo, useEffect, useRef, useState } from "react";
import { useAppDataContext } from "apps/lending/hooks/app-data-provider/useAppDataProvider";
import { useModalContext } from "apps/lending/hooks/useModal";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { useRootStore } from "apps/lending/store/root";
import { getNetworkConfig } from "apps/lending/utils/marketsAndNetworksConfig";

import {
  Asset,
  AssetInput,
} from "apps/lending/components/transactions/AssetInput";
import { GasEstimationError } from "apps/lending/components/transactions/FlowCommons/GasEstimationError";
import { ModalWrapperProps } from "apps/lending/components/transactions/FlowCommons/ModalWrapper";
import { TxSuccessView } from "apps/lending/components/transactions/FlowCommons/Success";
import {
  DetailsHFLine,
  DetailsNumberLineWithSub,
  TxModalDetails,
} from "apps/lending/components/transactions/FlowCommons/TxModalDetails";
import { RepayActions } from "apps/lending/components/transactions/Repay/RepayActions";
import { roundToTokenDecimals } from "apps/lending/utils/utils";
import { Warning } from "apps/lending/components/primitives/Warning";

interface RepayAsset extends Asset {
  balance: string;
}

export const RepayModalContent: FC<
  ModalWrapperProps & { debtType: InterestRate }
> = memo(
  ({
    poolReserve,
    userReserve,
    symbol: modalSymbol,
    tokenBalance,
    nativeBalance,
    isWrongNetwork,
    debtType,
  }) => {
    const {
      gasLimit,
      mainTxState: repayTxState,
      txError,
      requiresApproval,
    } = useModalContext();
    const { marketReferencePriceInUsd, user } = useAppDataContext();
    const { currentChainId } = useProtocolDataContext();

    const [minRemainingBaseTokenBalance] = useRootStore((store) => [
      store.poolComputed.minRemainingBaseTokenBalance,
    ]);

    // states
    const [tokenToRepayWith, setTokenToRepayWith] = useState<RepayAsset>({
      address: poolReserve.underlyingAsset,
      symbol: poolReserve.symbol,
      iconSymbol: poolReserve.iconSymbol,
      balance: tokenBalance,
    });
    const [assets, setAssets] = useState<RepayAsset[]>([tokenToRepayWith]);
    const [repayMax, setRepayMax] = useState("");
    const [_amount, setAmount] = useState("");
    const amountRef = useRef<string>();

    const networkConfig = getNetworkConfig(currentChainId);

    const { underlyingBalance, usageAsCollateralEnabledOnUser, reserve } =
      userReserve;

    const repayWithFmTokens =
      tokenToRepayWith.address === poolReserve.fmTokenAddress;

    const debt =
      debtType === InterestRate.Stable
        ? userReserve?.stableBorrows || "0"
        : userReserve?.variableBorrows || "0";
    const debtUSD = new BigNumber(debt)
      .multipliedBy(poolReserve.formattedPriceInMarketReferenceCurrency)
      .multipliedBy(marketReferencePriceInUsd)
      .shiftedBy(-USD_DECIMALS);

    const safeAmountToRepayAll = valueToBigNumber(debt).multipliedBy("1.0025");

    // calculate max amount available to repay
    let maxAmountToRepay: BigNumber;
    let balance: string;
    if (repayWithFmTokens) {
      maxAmountToRepay = BigNumber.min(underlyingBalance, debt);
      balance = underlyingBalance;
    } else {
      const normalizedWalletBalance = valueToBigNumber(
        tokenToRepayWith.balance
      ).minus(
        userReserve?.reserve.symbol.toUpperCase() ===
          networkConfig.baseAssetSymbol
          ? minRemainingBaseTokenBalance
          : "0"
      );
      balance = normalizedWalletBalance.toString(10);
      maxAmountToRepay = BigNumber.min(normalizedWalletBalance, debt);
    }

    const isMaxSelected = _amount === "-1";
    const amount = isMaxSelected ? maxAmountToRepay.toString(10) : _amount;

    const handleChange = (value: string) => {
      const maxSelected = value === "-1";
      const decimalTruncatedValue = roundToTokenDecimals(
        value,
        poolReserve.decimals
      );
      amountRef.current = maxSelected
        ? maxAmountToRepay.toString(10)
        : decimalTruncatedValue;
      setAmount(decimalTruncatedValue);
      if (maxSelected && (repayWithFmTokens || maxAmountToRepay.eq(debt))) {
        if (
          tokenToRepayWith.address === API_ETH_MOCK_ADDRESS.toLowerCase() ||
          (synthetixProxyByChainId[currentChainId] &&
            synthetixProxyByChainId[currentChainId].toLowerCase() ===
              reserve.underlyingAsset.toLowerCase())
        ) {
          // for native token and synthetix (only mainnet) we can't send -1 as
          // contract does not accept max unit256
          setRepayMax(safeAmountToRepayAll.toString(10));
        } else {
          // -1 can always be used for v3 otherwise
          // for v2 we can onl use -1 when user has more balance than max debt to repay
          // this is accounted for when maxAmountToRepay.eq(debt) as maxAmountToRepay is
          // min between debt and walletbalance, so if it enters here for v2 it means
          // balance is bigger and will be able to transact with -1
          setRepayMax("-1");
        }
      } else {
        setRepayMax(
          safeAmountToRepayAll.lt(balance)
            ? safeAmountToRepayAll.toString(10)
            : maxAmountToRepay.toString(10)
        );
      }
    };

    // token info
    useEffect(() => {
      const repayTokens: RepayAsset[] = [];
      // set possible repay tokens
      // if wrapped reserve push both wrapped / native
      if (poolReserve.symbol === networkConfig.wrappedBaseAssetSymbol) {
        const nativeTokenWalletBalance = valueToBigNumber(nativeBalance);
        const maxNativeToken = BigNumber.max(
          nativeTokenWalletBalance,
          BigNumber.min(nativeTokenWalletBalance, debt)
        );
        repayTokens.push({
          address: API_ETH_MOCK_ADDRESS.toLowerCase(),
          symbol: networkConfig.baseAssetSymbol,
          balance: maxNativeToken.toString(10),
        });
      }
      // push reserve asset
      const minReserveTokenRepay = BigNumber.min(
        valueToBigNumber(tokenBalance),
        debt
      );
      const maxReserveTokenForRepay = BigNumber.max(
        minReserveTokenRepay,
        tokenBalance
      );
      repayTokens.push({
        address: poolReserve.underlyingAsset,
        symbol: poolReserve.symbol,
        iconSymbol: poolReserve.iconSymbol,
        balance: maxReserveTokenForRepay.toString(10),
      });

      // push reserve fmToken
      const fmTokenBalance = valueToBigNumber(underlyingBalance);
      const maxBalance = BigNumber.max(
        fmTokenBalance,
        BigNumber.min(fmTokenBalance, debt).toString(10)
      );
      repayTokens.push({
        address: poolReserve.fmTokenAddress,
        symbol: `fm${poolReserve.symbol}`,
        iconSymbol: poolReserve.iconSymbol,
        fmToken: true,
        balance: maxBalance.toString(10),
      });
      setAssets(repayTokens);
      setTokenToRepayWith(repayTokens[0]);
    }, []);

    // debt remaining after repay
    const amountAfterRepay = valueToBigNumber(debt)
      .minus(amount || "0")
      .toString(10);
    const amountAfterRepayInUsd = new BigNumber(amountAfterRepay)
      .multipliedBy(poolReserve.formattedPriceInMarketReferenceCurrency)
      .multipliedBy(marketReferencePriceInUsd)
      .shiftedBy(-USD_DECIMALS);

    const maxRepayWithDustRemaining =
      isMaxSelected && amountAfterRepayInUsd.toNumber() > 0;

    // health factor calculations
    // we use usd values instead of MarketreferenceCurrency so it has same precision
    let newHF = user?.healthFactor;
    if (amount) {
      let collateralBalanceMarketReferenceCurrency: BigNumberValue =
        user?.totalCollateralUSD || "0";
      if (repayWithFmTokens && usageAsCollateralEnabledOnUser) {
        collateralBalanceMarketReferenceCurrency = valueToBigNumber(
          user?.totalCollateralUSD || "0"
        ).minus(valueToBigNumber(reserve.priceInUSD).multipliedBy(amount));
      }

      const remainingBorrowBalance = valueToBigNumber(
        user?.totalBorrowsUSD || "0"
      ).minus(valueToBigNumber(reserve.priceInUSD).multipliedBy(amount));
      const borrowBalanceMarketReferenceCurrency = BigNumber.max(
        remainingBorrowBalance,
        0
      );

      const calculatedHealthFactor = calculateHealthFactorFromBalancesBigUnits({
        collateralBalanceMarketReferenceCurrency,
        borrowBalanceMarketReferenceCurrency,
        currentLiquidationThreshold: user?.currentLiquidationThreshold || "0",
      });

      newHF =
        calculatedHealthFactor.isLessThan(0) && !calculatedHealthFactor.eq(-1)
          ? "0"
          : calculatedHealthFactor.toString(10);
    }

    // calculating input usd value
    const usdValue = valueToBigNumber(amount).multipliedBy(reserve.priceInUSD);

    if (repayTxState.success)
      return (
        <TxSuccessView
          action={"Repaid"}
          amount={amountRef.current}
          symbol={tokenToRepayWith.symbol}
          visibleDecimals={poolReserve.decimals > 6 ? 6 : poolReserve.decimals}
        />
      );

    return (
      <>
        <AssetInput
          value={amount}
          onChange={handleChange}
          usdValue={usdValue.toString(10)}
          symbol={tokenToRepayWith.symbol}
          assets={assets}
          onSelect={setTokenToRepayWith}
          isMaxSelected={isMaxSelected}
          maxValue={maxAmountToRepay.toString(10)}
          balanceText={"Wallet balance"}
        />

        {maxRepayWithDustRemaining && (
          <Typography color="warning.main" variant="helperText">
            You don’t have enough funds in your wallet to repay the full amount.
            If you proceed to repay with your current amount of funds, you will
            still have a small borrowing position in your dashboard.
          </Typography>
        )}

        <TxModalDetails gasLimit={gasLimit}>
          <DetailsNumberLineWithSub
            description={"Remaining debt"}
            futureValue={amountAfterRepay}
            futureValueUSD={amountAfterRepayInUsd.toString(10)}
            value={debt}
            valueUSD={debtUSD.toString()}
            symbol={
              poolReserve.iconSymbol === networkConfig.wrappedBaseAssetSymbol
                ? networkConfig.baseAssetSymbol
                : poolReserve.iconSymbol
            }
            decimals={poolReserve.decimals}
          />
          <DetailsHFLine
            visibleHfChange={!!_amount}
            healthFactor={user?.healthFactor}
            futureHealthFactor={newHF}
          />
        </TxModalDetails>

        {isMaxSelected && requiresApproval && (
          <Warning severity="warning" sx={{ my: 6 }}>
            Your {poolReserve.symbol} amount is increasing every second. For
            correct repay of the whole amount, confirm in your wallet the
            suggested value.
          </Warning>
        )}

        {txError && <GasEstimationError txError={txError} />}

        <RepayActions
          poolReserve={poolReserve}
          amountToRepay={isMaxSelected ? repayMax : amount}
          poolAddress={
            repayWithFmTokens
              ? poolReserve.underlyingAsset
              : tokenToRepayWith.address ?? ""
          }
          isWrongNetwork={isWrongNetwork}
          symbol={modalSymbol}
          debtType={debtType}
          repayWithFmTokens={repayWithFmTokens}
        />
      </>
    );
  }
);
