import { FTHM } from "apps/dex/constants";
import {
  Currency,
  CurrencyAmount,
  XDC,
  JSBI,
  Token,
  TokenAmount,
} from "into-the-fathom-swap-sdk";
import { useMemo } from "react";
import ERC20_INTERFACE from "apps/dex/constants/abis/erc20";
import { useAllTokens } from "apps/dex/hooks/Tokens";
import { useActiveWeb3React } from "apps/dex/hooks";
import { useMulticallContract } from "apps/dex/hooks/useContract";
import { isAddress } from "apps/dex/utils";
import {
  useSingleContractMultipleData,
  useMultipleContractSingleData,
} from "apps/dex/state/multicall/hooks";

/**
 * Returns a map of the given addresses to their eventually consistent XDC balances.
 */
export function useXDCBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount | undefined;
} {
  const multicallContract = useMulticallContract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    "getEthBalance",
    addresses.map((address) => [address])
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount }>(
        (memo, address, i) => {
          const value = results?.[i]?.result?.[0];
          if (value)
            memo[address] = CurrencyAmount.xdc(JSBI.BigInt(value.toString()));
          return memo;
        },
        {}
      ),
    [addresses, results]
  );
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token => isAddress(t?.address) !== false
      ) ?? [],
    [tokens]
  );

  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20_INTERFACE,
    "balanceOf",
    [address]
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: TokenAmount | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ];
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0];
}

// get the balance for a single token/account combo
export function useTokenBalance(
  account?: string,
  token?: Token
): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token]);
  if (!token) return undefined;
  return tokenBalances[token.address];
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(
    () =>
      currencies?.filter(
        (currency): currency is Token => currency instanceof Token
      ) ?? [],
    [currencies]
  );

  const tokenBalances = useTokenBalances(account, tokens);
  const containsXDC: boolean = useMemo(
    () => currencies?.some((currency) => currency === XDC) ?? false,
    [currencies]
  );
  const xdcBalance = useXDCBalances(containsXDC ? [account] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency) return undefined;
        if (currency instanceof Token) return tokenBalances[currency.address];
        if (currency === XDC) return xdcBalance[account];
        return undefined;
      }) ?? [],
    [account, currencies, xdcBalance, tokenBalances]
  );
}

export function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency])[0];
}

// mimics useAllBalances
export function useAllTokenBalances(): {
  [tokenAddress: string]: TokenAmount | undefined;
} {
  const { account } = useActiveWeb3React();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(
    () => Object.values(allTokens ?? {}),
    [allTokens]
  );
  const balances = useTokenBalances(account ?? undefined, allTokensArray);
  return balances ?? {};
}

// get the total owned, unclaimed, and unharvested FTHM for an account
export function useAggregateFTHMBalance(): TokenAmount | undefined {
  const { account, chainId } = useActiveWeb3React();

  const fthm = chainId ? FTHM[chainId] : undefined;

  const fthmBalance: TokenAmount | undefined = useTokenBalance(
    account ?? undefined,
    fthm
  );

  if (!fthm) return undefined;

  return new TokenAmount(
    fthm,
    JSBI.add(fthmBalance?.raw ?? JSBI.BigInt(0), JSBI.BigInt(0))
  );
}
