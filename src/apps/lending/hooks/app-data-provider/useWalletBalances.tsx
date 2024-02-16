import { API_ETH_MOCK_ADDRESS } from "@into-the-fathom/lending-contract-helpers";
import {
  nativeToUSD,
  normalize,
  USD_DECIMALS,
} from "@into-the-fathom/lending-math-utils";
import { BigNumber } from "bignumber.js";
import { useRootStore } from "apps/lending/store/root";

import {
  selectCurrentBaseCurrencyData,
  selectCurrentReserves,
} from "apps/lending/store/poolSelectors";
import { usePoolTokensBalance } from "apps/lending/hooks/pool/usePoolTokensBalance";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";

export interface WalletBalance {
  address: string;
  amount: string;
}

export const useWalletBalances = () => {
  const { currentNetworkConfig } = useProtocolDataContext();
  const { data: balances, isLoading: balancesLoading } = usePoolTokensBalance();
  const [reserves, baseCurrencyData] = useRootStore((state) => [
    selectCurrentReserves(state),
    selectCurrentBaseCurrencyData(state),
  ]);

  const walletBalances = balances ?? [];
  // process data
  let hasEmptyWallet = true;
  const aggregatedBalance = walletBalances.reduce((acc, reserve) => {
    const poolReserve = reserves.find((poolReserve) => {
      if (reserve.address === API_ETH_MOCK_ADDRESS.toLowerCase()) {
        return (
          poolReserve.symbol.toLowerCase() ===
          currentNetworkConfig.wrappedBaseAssetSymbol?.toLowerCase()
        );
      }
      return poolReserve.underlyingAsset.toLowerCase() === reserve.address;
    });
    if (reserve.amount !== "0") hasEmptyWallet = false;
    if (poolReserve) {
      acc[reserve.address] = {
        amount: normalize(reserve.amount, poolReserve.decimals),
        amountUSD: nativeToUSD({
          amount: new BigNumber(reserve.amount),
          currencyDecimals: poolReserve.decimals,
          priceInMarketReferenceCurrency:
            poolReserve.priceInMarketReferenceCurrency,
          marketReferenceCurrencyDecimals:
            baseCurrencyData.marketReferenceCurrencyDecimals,
          normalizedMarketReferencePriceInUsd: normalize(
            baseCurrencyData.marketReferenceCurrencyPriceInUsd,
            USD_DECIMALS
          ),
        }),
      };
    }
    return acc;
  }, {} as { [address: string]: { amount: string; amountUSD: string } });
  return {
    walletBalances: aggregatedBalance,
    hasEmptyWallet,
    loading: balancesLoading || !reserves.length,
  };
};
