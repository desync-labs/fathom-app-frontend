import {
  ChainId,
  Currency,
  currencyEquals,
  JSBI,
  Price,
  WETH,
} from "into-the-fathom-swap-sdk";
import { useMemo } from "react";
import { FXD_AXDC } from "apps/dex/constants/index";
import { PairState, usePairs } from "apps/dex/data/Reserves";
import { useActiveWeb3React } from "apps/dex/hooks";
import { wrappedCurrency } from "apps/dex/utils//wrappedCurrency";

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function usePrice(currency?: Currency): Price | undefined {
  const { chainId } = useActiveWeb3React();
  const wrapped = wrappedCurrency(currency, chainId);
  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && currencyEquals((WETH as any)[chainId], wrapped)
          ? undefined
          : currency,
        chainId ? (WETH as any)[chainId] : undefined,
      ],
      [
        wrapped?.equals(FXD_AXDC) ? undefined : wrapped,
        chainId === ChainId.AXDC ? FXD_AXDC : undefined,
      ],
      [
        chainId ? (WETH as any)[chainId] : undefined,
        chainId === ChainId.AXDC ? FXD_AXDC : undefined,
      ],
    ],
    [chainId, currency, wrapped]
  );
  const pairsResponse = usePairs(tokenPairs);
  const [
    [ethPairState, ethPair],
    [usdcPairState, usdcPair],
    [usdcEthPairState, usdcEthPair],
  ] = pairsResponse;

  // console.log(pairsResponse)
  // console.log(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined;
    }
    // handle weth/eth
    if (wrapped.equals((WETH as any)[chainId])) {
      if (usdcPair) {
        const price = usdcPair.priceOf((WETH as any)[chainId]);
        return new Price(
          currency,
          FXD_AXDC,
          price.denominator,
          price.numerator
        );
      } else {
        return undefined;
      }
    }
    // handle usdc
    if (wrapped.equals(FXD_AXDC)) {
      return new Price(FXD_AXDC, FXD_AXDC, "1", "1");
    }

    const ethPairETHAmount = ethPair?.reserveOf((WETH as any)[chainId]);
    const ethPairETHUSDCValue: JSBI =
      ethPairETHAmount && usdcEthPair
        ? usdcEthPair.priceOf((WETH as any)[chainId]).quote(ethPairETHAmount)
            .raw
        : JSBI.BigInt(0);

    // all other tokens
    // first try the usdc pair
    if (
      usdcPairState === PairState.EXISTS &&
      usdcPair &&
      usdcPair.reserveOf(FXD_AXDC).greaterThan(ethPairETHUSDCValue)
    ) {
      const price = usdcPair.priceOf(wrapped);
      return new Price(currency, FXD_AXDC, price.denominator, price.numerator);
    }
    if (
      ethPairState === PairState.EXISTS &&
      ethPair &&
      usdcEthPairState === PairState.EXISTS &&
      usdcEthPair
    ) {
      if (
        usdcEthPair.reserveOf(FXD_AXDC).greaterThan("0") &&
        ethPair.reserveOf((WETH as any)[chainId]).greaterThan("0")
      ) {
        const ethUsdcPrice = usdcEthPair.priceOf(FXD_AXDC);
        const currencyEthPrice = ethPair.priceOf((WETH as any)[chainId]);
        const usdcPrice = ethUsdcPrice.multiply(currencyEthPrice).invert();
        return new Price(
          currency,
          FXD_AXDC,
          usdcPrice.denominator,
          usdcPrice.numerator
        );
      }
    }
    return undefined;
  }, [
    chainId,
    currency,
    ethPair,
    ethPairState,
    usdcEthPair,
    usdcEthPairState,
    usdcPair,
    usdcPairState,
    wrapped,
  ]);
}
